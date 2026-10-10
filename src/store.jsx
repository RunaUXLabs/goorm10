/* ============================================================
   Store — React Context 기반 전역 상태 관리.
   Reducer + Provider + useStore hook.
   ============================================================ */
import React, { createContext, useContext, useReducer } from 'react'
import { MEMBER_IDS, COORDINATION_SLOTS, CALENDAR_PRESET } from './data.js'

export { MEMBERS, MEMBER_IDS } from './data.js'

/* ---- Selector helpers ---- */

export function isRequired(state, id) {
  return state.required.includes(id)
}

export function isResponded(state, id) {
  const { mode } = state
  if (mode === 'proposal' || mode === 'proposalEscalated') {
    return !!state.proposal[id]
  }
  if (mode === 'coordination' || mode === 'noslot') {
    const responses = state.coord[id]
    if (!responses) return false
    return state.slots.every((slot) => !!responses[slot.id])
  }
  return false
}

/* 필참자 중 아직 응답하지 않은 멤버 목록 */
export function waitingIds(state) {
  return state.required.filter(
    (id) => id !== 'runa' && !isResponded(state, id) && !state.outMembers.includes(id)
  )
}

/* 슬롯을 [필참전원가능 → ok수] 기준으로 내림차순 정렬 */
export function rankedSlots(state) {
  return state.slots
    .map((slot) => {
      let ok = 0
      let reqOk = true
      for (const id of MEMBER_IDS) {
        const v = state.coord[id]?.[slot.id]
        if (v === 'ok') ok++
        if (state.required.includes(id) && v !== 'ok') reqOk = false
      }
      return { slot, ok, reqOk }
    })
    .sort((a, b) => {
      if (a.reqOk !== b.reqOk) return a.reqOk ? -1 : 1
      return b.ok - a.ok
    })
}

/* ---- Initial state ---- */

const initialState = {
  currentUser: 'runa',
  mode: 'compose',   // compose | proposal | proposalEscalated | coordination | noslot | confirmed
  phase: 0,          // 0=생성전 1=잠정확정 2=마감임박 3=마감이후
  hintOn: true,
  sheetOpen: false,
  meeting: {
    title: '다음 주 주간 회의',
    duration: '1시간',
    range: '다음 주',
    deadline: '이번 주 금요일 18:00',
  },
  required: ['runa', 'will', 'dan'],  // 필참자 ID 목록
  proposal: {},          // { [memberId]: 'ok' }
  objection: null,       // { member, reason } | null
  slots: COORDINATION_SLOTS,
  coord: {},             // { [memberId]: { [slotId]: 'ok'|'hard' } }
  widened: false,
  outMembers: [],        // 마감 규칙으로 불참 처리된 멤버
  escalated: [],         // 필참인데 마감까지 미응답인 멤버
  reRequested: {},       // { [memberId]: true }
  confirmed: null,       // { slot, via, absent, unconfirmedRequired }
}

/* ---- Reducer ---- */

function reducer(state, action) {
  switch (action.type) {
    case 'SHEET':
      return { ...state, sheetOpen: action.open }

    case 'TOGGLE_HINT':
      return { ...state, hintOn: !state.hintOn }

    case 'UPDATE_MEETING':
      return { ...state, meeting: { ...state.meeting, ...action.patch } }

    case 'CREATE': {
      /* 주최자가 생성 시트에서 필참 구성을 확정하고 게시 */
      return {
        ...state,
        required: ['runa', ...action.required],
        mode: 'proposal',
        phase: 1,
        sheetOpen: false,
        proposal: {},
        coord: {},
        objection: null,
        outMembers: [],
        escalated: [],
        reRequested: {},
        confirmed: null,
      }
    }

    case 'PROPOSAL_RESPOND': {
      const { member, kind, reason } = action
      if (kind === 'ok') {
        return { ...state, proposal: { ...state.proposal, [member]: 'ok' }, sheetOpen: false }
      }
      /* 이의 — 조율 모드로 전환. 잠정 확정은 철회 */
      return {
        ...state,
        objection: { member, reason: reason || '사유 미입력' },
        mode: 'coordination',
        sheetOpen: false,
        slots: COORDINATION_SLOTS,
      }
    }

    case 'COORD_RESPOND': {
      return {
        ...state,
        coord: { ...state.coord, [action.member]: action.responses },
        outMembers: state.outMembers.filter((id) => id !== action.member),
        sheetOpen: false,
      }
    }

    case 'ORG_REREQUEST': {
      return { ...state, reRequested: { ...state.reRequested, [action.member]: true } }
    }

    case 'ORG_CONFIRM': {
      /* 주최자가 1순위 슬롯으로 확정 */
      const ranked = rankedSlots(state)
      const target = ranked.find((r) => r.slot.id === action.slotId) || ranked[0]
      return {
        ...state,
        mode: 'confirmed',
        sheetOpen: false,
        confirmed: {
          slot: target.slot,
          via: state.objection ? 'layer2' : 'layer1',
          absent: [...state.outMembers],
          unconfirmedRequired: state.escalated.filter((id) => !state.coord[id]),
        },
      }
    }

    case 'ORG_EXTEND': {
      /* 마감 연장 — 에스컬레이션 초기화 */
      return { ...state, phase: 2, escalated: [], sheetOpen: false }
    }

    case 'WIDEN': {
      /* 교집합 없음 → 기간 넓혀 재조율 */
      return { ...state, widened: true, mode: 'coordination', sheetOpen: false }
    }

    case 'SWITCH_USER': {
      return { ...state, currentUser: action.id, sheetOpen: false }
    }

    case 'ADVANCE': {
      if (state.phase >= 3 || state.mode === 'confirmed') return state

      if (state.phase === 0) {
        /* 생성 전 → 잠정 확정 게시 (자동 진행) */
        return { ...state, phase: 1, mode: 'proposal', sheetOpen: false }
      }

      if (state.phase === 1) {
        /* 잠정 확정 → 마감 임박 */
        if (state.mode === 'coordination') {
          /* 이의로 이미 조율 모드에 있는 경우 */
          return { ...state, phase: 2 }
        }
        /* 필참 중 미응답자 확인 → proposalEscalated */
        const notReplied = state.required.filter(
          (id) => id !== 'runa' && !state.proposal[id]
        )
        return {
          ...state,
          phase: 2,
          mode: notReplied.length > 0 ? 'proposalEscalated' : 'proposal',
        }
      }

      if (state.phase === 2) {
        /* 마감 임박 → 마감 이후 */
        let newCoord = { ...state.coord }
        let newProposal = { ...state.proposal }
        let outMembers = [...state.outMembers]
        let escalated = [...state.escalated]

        if (state.mode === 'proposal' || state.mode === 'proposalEscalated') {
          /* 선택 참석자 무응답 → 침묵=동의로 ok 처리 */
          for (const id of MEMBER_IDS) {
            if (!newProposal[id] && !state.required.includes(id)) {
              newProposal[id] = 'ok'
            }
          }
          /* 필참 미응답자 → escalated */
          escalated = state.required.filter(
            (id) => id !== 'runa' && !newProposal[id]
          )
        } else {
          /* 조율 모드 — 미응답자 outMembers로 */
          const newOut = MEMBER_IDS.filter(
            (id) => id !== 'runa' && !isResponded(state, id) && !outMembers.includes(id)
          )
          outMembers = [...outMembers, ...newOut]
          /* 필참 미응답자 → escalated */
          escalated = newOut.filter((id) => state.required.includes(id))
          /* 선택 참석자 미응답 — CALENDAR_PRESET으로 자동 채움 */
          for (const id of MEMBER_IDS) {
            if (!isResponded(state, id) && !state.required.includes(id)) {
              const preset = CALENDAR_PRESET[id] || {}
              newCoord[id] = preset
            }
          }
        }

        return {
          ...state,
          phase: 3,
          proposal: newProposal,
          coord: newCoord,
          outMembers,
          escalated,
        }
      }

      return state
    }

    case 'RESET':
      return { ...initialState, slots: COORDINATION_SLOTS }

    default:
      return state
  }
}

/* ---- Context & Provider ---- */

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
