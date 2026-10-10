# Bubbles

Mod U의 시스템 메시지 카드. 회의 확정 플로우의 각 단계에서 시스템 명의로 게시되는 5종 인터랙티브 카드 + 상태 라우터 1개.

## 정본과 참조 관계

- 코드 정본: `src/components/bubbles.jsx`
- Figma 정본: `Organisms/Bubbles/*` 컴포넌트
- 상세 문서: `docs/design-system/organisms/*-bubble.md`

## 최상위 원칙: 시스템 명의

**IMPORTANT**: 모든 버블은 **시스템 명의의 중앙 카드**로 게시된다. 특정 참석자(주최자 포함)의 개인 말풍선처럼 렌더링하지 않는다.

이 원칙은 `Guidelines.md`의 Product logic 규칙과 정합된다. 코드에서는 `ChatRoom.jsx`에서 `<div className="chat__msg--center">` 컨테이너로 감싸 중앙 정렬 카드로 배치된다.

### 시스템 명의의 시각적 표현

| 속성 | 값 |
|---|---|
| 컨테이너 | `chat__msg--center` (중앙 정렬 wrapper) |
| 최대 폭 | 92% (`chat__msg--system`) |
| 카드 스타일 | 4면 모두 `radius-lg` (뾰족 모서리 없음) |
| 보더 | 1px `line/default` |
| 그림자 | `shadow-card` |
| 아바타 | 없음 (좌측 아바타 렌더링 안 함) |

## 포함 버블

| 컴포넌트 | 시나리오 단계 | 트리거 조건 (`state.mode`) |
|---|---|---|
| `ComposeCard` | 회의 생성 시작점 | `'compose'` + 호스트만 |
| `ProposalBubble` | 잠정 확정 통보 | `'proposal'` 또는 `'proposalEscalated'` |
| `CoordinationBubble` | 조율 모드 (계층 2) | `'coordination'` — **폴백** |
| `ConfirmedBubble` | 최종 확정 요약 | `'confirmed'` |
| `NoSlotBubble` | 교집합 붕괴 실패 | `'noslot'` |
| `SchedulingBubble` | 라우터 (위 5개 중 하나 렌더) | 모든 mode |

**규칙**: 이 5종 밖의 시스템 메시지를 만들지 않는다. 새 시나리오가 필요하면 화이트리스트 확장 제안.

---

# BubbleShell (공통 셸)

모든 버블이 공유하는 컨테이너. 헤더(앱 라벨 + 타이틀 + 서브타이틀) + children 구조.

## Props

| Prop | Type | 설명 |
|---|---|---|
| `title` | string | 버블 타이틀 |
| `subtitle` | string (optional) | 서브타이틀 |
| `children` | ReactNode | 버블 본문 |

## 내부 구조

```
BubbleShell
├── .bubble__head
│   ├── .bubble__app — "모두의 시간" (앱 이름)
│   ├── .bubble__title — title prop
│   └── .bubble__subtitle — subtitle prop (조건부)
└── children
```

## 스펙

| 요소 | 스타일 | 토큰 |
|---|---|---|
| 컨테이너 (`.bubble`) | padding `space-4`, gap `space-3`, radius `radius-lg` | `surface/default` bg, `shadow-card` |
| 앱 라벨 | `text-xs` semibold | `primary/default` |
| 타이틀 | `text-md` bold | `text/default` |
| 서브타이틀 | `text-sm` regular | `text/sub/default` |

**규칙**: 모든 버블은 반드시 BubbleShell로 감싼다. 헤더 없는 시스템 카드를 만들지 않는다.

---

# ComposeCard

회의 생성 시작점. **주최자에게만** 표시되며, 조건 설정 시트를 여는 진입점.

## 사용 조건

- **쓴다**: `state.mode === 'compose'`이고 `currentUser === 'runa'` (호스트)
- **쓰지 않는다**:
  - 호스트가 아닌 경우 (코드에서 `return null` 처리됨)
  - 다른 모든 phase

## 상태 의존성

- `state.mode === 'compose'` — 렌더링 트리거
- `state.currentUser === 'runa'` — 호스트 확인 (isHost). 아니면 `return null`
- `state.meeting.title`, `state.meeting.duration` — BubbleShell title에 조합해서 표시

**주요 액션**:
- 클릭 시 `dispatch({ type: 'SHEET', open: true })` — ComposeSheet 오픈

## 실제 구조

```jsx
<BubbleShell
  title={`${state.meeting.title} · ${state.meeting.duration}`}
  subtitle="조건을 정하면 시스템이 시간을 찾아 잠정 확정해요"
>
  <Notice tone="neutral">
    팀원들의 캘린더와 회의룸 예약 상황을 읽어 모두가 비는 시간을 먼저 골라요.
    투표는 필요할 때만 열려요.
  </Notice>
  <div className="bubble__actions">
    <Button variant="primary" full>회의 만들기</Button>
  </div>
</BubbleShell>
```

## 내부 요소

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Head | BubbleShell head | 회의 제목 + 시간, 서브타이틀 |
| Notice | `tone="neutral"` | 시스템 접근 방식 안내 |
| Action | Button `primary` `full` | Sheet 오픈 트리거 (ComposeSheet 진입) |

## 중요 특성

- **호스트 전용 렌더**: 코드에서 `if (!isHost) return null`
- **채팅방 미게시 상태**: `ChatRoom.jsx`에서 `state.mode === 'compose' && currentUser === 'runa'`인 경우에만 `<div className="chat__msg--center">`로 감싸 표시됨. 다른 팀원 시점에서는 채팅방에 아무것도 없다.
- **필드 편집 없음**: ComposeCard 자체는 필드를 표시하지 않는다. 실제 조건 설정은 Sheet의 ComposeSheet에서.

## Do / Don't

✅ 호스트에게만 렌더링
✅ Sheet 진입 CTA 하나만 제공
✅ 시스템 명의 카드로 중앙 정렬
✅ 회의 제목·시간을 head에 표시

❌ 필드(회의명, 시간, 회의실 등)를 카드 안에 나열
❌ SlotCard preset을 이 카드 안에 배치
❌ 호스트가 아닌 사용자에게 렌더링
❌ 액션 버튼을 여러 개 추가

## Figma 매핑

- **마스터**: `Organisms/Bubbles/ComposeCard`
- **Variants**: 없음
- **Properties**:
  - `title` (TEXT) — 회의 제목 + 시간
  - `subtitle` (TEXT)
- **Nested instances**:
  - BubbleShell
  - Notice (neutral)
  - Button (primary, full)

---

# ProposalBubble

잠정 확정된 시간을 통보하는 버블. Hero SlotCard로 시간을 강조하고, 대상자별로 다른 액션 표시.

## 사용 조건

- **쓴다**: `state.mode === 'proposal'` 또는 `'proposalEscalated'`
- **쓰지 않는다**:
  - 최종 확정 → ConfirmedBubble
  - 여러 시간 나열 → CoordinationBubble

## 상태 의존성

- `state.mode === 'proposal'` 또는 `'proposalEscalated'` — 렌더링 트리거
- `state.proposal[currentUser]` — 개인 응답 값 (`'ok'` | `undefined`)
  - `'objection'` 상태는 이 버블에서 처리되지 않음. 이의 제기 시 `enterCoordination()`이 호출되어 mode가 `'coordination'`으로 전환됨
- `state.required` — 필참자 목록 (`isRequired(state, me)` 판단에 사용)
- `waitingIds(state)` — 응답 대기 중인 필참자 목록 (Board 표시 여부 결정)
- `state.meeting.deadline` — Notice 안 볼드 부분에 표시
- `state.mode === 'proposalEscalated'` — 재알림 Notice 표시 여부

**주요 액션**:
- 액션 버튼 클릭 시 `dispatch({ type: 'SHEET', open: true })` — ProposalSheet 오픈
- Board 클릭 시 동일 (Sheet 오픈, 호스트는 OrganizerSheet)

## 핵심 원칙: 침묵은 동의

**IMPORTANT**: Proposal은 "이의 없으면 그대로 확정"이라는 어휘. 사용자에게 응답을 강요하지 않는다.

- 필참자가 이의 제기 시 → CoordinationBubble로 전환
- 응답 없이 마감 도달 → 자동으로 ConfirmedBubble

## 실제 구조

```jsx
<BubbleShell title="{title} · {duration}" subtitle="캘린더와 회의룸이 모두 비는 시간으로 잡았어요">
  <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
  <Notice tone="weak">
    여섯 명의 캘린더와 회의룸이 모두 비는 시간 중 가장 이른 시간이에요.
    캘린더에 없는 사정이 있다면 알려주세요.
  </Notice>
  <Notice tone="neutral">
    어려우면 <b>{deadline}</b>까지 알려주세요. 이의가 없으면 그대로 확정돼요.
  </Notice>

  {/* 비호스트만 액션 영역 */}
  {!isHost && (
    <div className="bubble__actions">
      {mine === 'ok' ? (
        <Chip tone="success">확인 완료 — 참석으로 정리됐어요</Chip>
      ) : (
        <>
          <Button variant="primary" full>
            {isRequired ? '확인하기' : '응답하기'}
          </Button>
          {!isRequired && (
            <Notice tone="weak">응답하지 않아도 괜찮아요 — 참석 가능한 것으로 정리돼요.</Notice>
          )}
        </>
      )}
    </div>
  )}

  {/* 대기자가 있으면 Board */}
  {waiting.length > 0 && (
    <div className="board">
      <NameFlow ids={waiting} suffix="님의 확인이 꼭 필요해요" />
      <span className="board__deadline">응답하지 않은 분들은 참석 가능한 것으로 정리돼요</span>
    </div>
  )}

  {/* proposalEscalated + 호스트 */}
  {escalated && isHost && (
    <Notice tone="warn">확인 기한이 지나 아직 확인하지 않은 필참자에게만 다시 알렸어요.</Notice>
  )}
</BubbleShell>
```

## 내부 요소 (조건부 렌더)

| 요소 | 조건 | 컴포넌트 |
|---|---|---|
| Hero SlotCard | 항상 | SlotCard `variant="hero"` |
| Notice weak | 항상 | Notice — 이 시간을 고른 이유 |
| Notice neutral | 항상 | Notice — 마감 안내 |
| Chip (확인 완료) | 비호스트 + 응답함 | Chip `tone="success"` |
| Button (확인/응답하기) | 비호스트 + 미응답 | Button `primary` `full` |
| Notice weak (선택 안내) | 비호스트 + 미응답 + 선택 참석 | Notice — "응답 안 해도 괜찮아요" |
| Board (대기자) | `waiting.length > 0` | NameFlow + deadline |
| Notice warn (escalated) | proposalEscalated + 호스트 | Notice — "다시 알렸어요" |

## 화자·대상자별 시나리오

| 시점 | 표시되는 것 |
|---|---|
| 필참자, 미응답 | Hero + Notice ×2 + "확인하기" Button + Board(다른 대기자) |
| 선택 참석, 미응답 | Hero + Notice ×2 + "응답하기" Button + Notice weak |
| 응답 완료 (`mine === 'ok'`) | Hero + Notice ×2 + Chip "확인 완료" + Board(다른 대기자) |
| 이의 제기 (`mine === 'objection'`) | **이 버블은 렌더되지 않음** — mode가 `'coordination'`으로 전환되어 CoordinationBubble이 대신 표시됨 |
| 호스트 (`me === 'runa'`) | Hero + Notice ×2 + Board(대기자) + (escalated 시 Notice warn) |
| Escalated + 호스트 (`mode === 'proposalEscalated'`) | 위 + Notice warn "다시 알렸어요" |

**규칙**: 액션 영역은 **비호스트만** 렌더된다. 호스트는 응답 대상이 아니므로 액션 버튼 없음.

## Board 컴포넌트 (조건부)

대기자가 있을 때 `.board` 요소가 렌더된다.

| 속성 | 값 |
|---|---|
| 배경 | `surface/sub/default` |
| Padding | `space-3` |
| Radius | `radius-md` |
| Hover | 배경 `primary/weak` |
| 클릭 | Sheet 오픈 |

내부: `<NameFlow ids={waiting} suffix="..." />` + `<span className="board__deadline">`

## Do / Don't

✅ Hero SlotCard로 시간 하나만 강조
✅ 대상자(필참/선택/호스트/응답 완료)에 따라 액션 다르게 표시
✅ 침묵은 동의 원칙 유지 (동의 버튼 없음, 이의 액션만)
✅ `waiting.length > 0`일 때만 Board 표시
✅ Notice로 마감·이유·규칙 3층 안내

❌ 여러 시간을 Hero로 나열
❌ "동의합니다" primary 버튼 추가 (침묵이 동의)
❌ 호스트에게 액션 버튼 표시
❌ Board를 항상 렌더 (대기자 없으면 생략)
❌ Chip과 Button을 동시 표시 (응답 상태에 따라 하나만)

## Figma 매핑

- **마스터**: `Organisms/Bubbles/Proposal`
- **Variants**:
  - `viewer = required | optional | responded | host` (대상자별 액션)
  - `escalated = false | true` (재알림 상태)
- **Properties**:
  - `title` (TEXT)
  - `subtitle` (TEXT)
  - `deadline` (TEXT) — Notice 안 볼드 부분
  - `waiting-visible` (BOOLEAN) — Board 표시 여부
- **Nested instances**:
  - BubbleShell
  - SlotCard (hero variant)
  - Notice × 2~3
  - Button 또는 Chip (viewer variant에 따라)
  - Board (조건부)
  - NameFlow (Board 내부)

---

# CoordinationBubble

조율 모드 진입 시 게시되는 버블. 여러 시간 옵션을 Tally SlotCard 리스트로 표시하고, 팀 응답을 실시간 집계.

## 사용 조건

- **쓴다**: `state.mode === 'coordination'` (이의 발생 또는 교집합 부재 이후)
- **쓰지 않는다**:
  - 기본 플로우 (Proposal이 담당)
  - 단일 시간 강조

## 상태 의존성

- `state.mode === 'coordination'` — 렌더링 트리거
- `state.slots` — 렌더할 슬롯 리스트 (기본 3개 후보 또는 widened 시 다른 세트)
- `state.coord[currentUser]` — 개인 응답 (`{ [slotId]: 'ok' | 'hard' }`)
- `state.coord` 전체 — 팀 응답 집계 (`rankedSlots(state)`로 계산)
- `state.widened` — 기간 확장 여부 (subtitle과 제외 사유 Notice 조건)
- `state.objection` — 비공개 이의 (호스트만 표시)
- `state.outMembers` — 마감 규칙으로 불참 정리된 멤버
- `state.escalated` — 마감 후 무응답 필참자
- `state.phase >= 3` — 마감 이후 상태 (`afterDeadline`)
- `waitingIds(state)` — 응답 대기 중인 멤버

**주요 액션**:
- SlotCard 클릭 → Sheet 오픈 (ResponseSheet 또는 OrganizerSheet)
- 액션 버튼 클릭 → 동일하게 Sheet 오픈
- Board 클릭 → 동일하게 Sheet 오픈

## 핵심 원칙: 폴백 어휘

**IMPORTANT**: Coordination은 **예외 상황에서만** 진입하는 폴백이다. 기본 플로우로 다루지 않는다 (`Guidelines.md` Product logic 규칙).

## 실제 구조

```jsx
<BubbleShell
  title="{title} · {duration}"
  subtitle={widened ? '기간을 넓혀 다시 조율하고 있어요' : '일정을 다시 조율하고 있어요'}
>
  {/* 호스트에게만 비공개 이의 표시 */}
  {isHost && objection && (
    <Notice tone="warn">
      비공개 이의 1건 — {name} · "{reason}" (나에게만 보여요)
    </Notice>
  )}

  {/* 슬롯 나열 */}
  <div className="bubble__slots">
    {slots.map(slot => (
      <SlotCard
        variant="tally"
        okCount={...}
        total={MEMBER_IDS.length}
        myValue={coord[me]?.[slot.id]}
        best={slot.id === bestId}
        onClick={openSheet}
      />
    ))}
  </div>

  {/* 제외 사유 (widened 아닐 때) */}
  {!widened && (
    <Notice tone="weak">
      수요일은 팀원 일정으로, 화 13:00는 조율 요청으로 후보에서 제외했어요.
    </Notice>
  )}

  {/* 비호스트 액션 */}
  {!isHost && (
    <div className="bubble__actions">
      {responded ? (
        <Button variant="secondary" size="sm">내 응답 수정하기</Button>
      ) : outMembers.includes(me) ? (
        <>
          <Chip tone="neutral">마감 규칙으로 불참 정리됨</Chip>
          <Button variant="secondary" size="sm">지금 응답하고 참여하기</Button>
        </>
      ) : (
        <Button variant="primary" full>가능한 시간 응답하기</Button>
      )}
    </div>
  )}

  {/* 호스트 액션 */}
  {isHost && (
    <div className="bubble__actions">
      <Button variant="secondary" full>응답 현황 보기</Button>
    </div>
  )}

  {/* 대기자 Board */}
  {waiting.length > 0 && (
    <div className="board">
      <NameFlow ids={waiting} suffix="님의 응답을 기다리고 있어요" />
      <span className="board__deadline">
        {afterDeadline ? '응답 마감이 지났어요' : `${deadline} 마감 · 마감 후 미응답 시 참석이 어려운 것으로 정리돼요`}
      </span>
    </div>
  )}

  {/* 불참 정리된 멤버 */}
  {outMembers.length > 0 && (
    <Notice tone="weak">
      <NameFlow ids={outMembers} suffix="님은 마감 규칙에 따라 불참으로 정리됐어요. 지금 응답하면 다시 참여할 수 있어요." />
    </Notice>
  )}

  {/* 마감 후 필참 무응답 (호스트만) */}
  {afterDeadline && escalated.length > 0 && isHost && (
    <Notice tone="danger">
      필참자 <NameFlow ids={escalated} suffix="님이 마감까지 응답하지 않았어요. 현황에서 처리해주세요." />
    </Notice>
  )}
</BubbleShell>
```

## 내부 요소 (조건부 렌더)

| 요소 | 조건 | 컴포넌트 |
|---|---|---|
| Notice warn (비공개 이의) | 호스트 + 이의 존재 | Notice `warn` |
| Slots 리스트 | 항상 | SlotCard `tally` × N |
| Notice weak (제외 사유) | `!widened` | Notice `weak` |
| Actions (비호스트 미응답) | `!isHost && !responded && !out` | Button primary full |
| Actions (비호스트 응답 완료) | `!isHost && responded` | Button secondary sm |
| Actions (불참 정리됨) | `!isHost && outMembers.includes(me)` | Chip + Button secondary sm |
| Actions (호스트) | `isHost` | Button secondary full "응답 현황 보기" |
| Board (대기자) | `waiting.length > 0` | NameFlow + deadline |
| Notice weak (불참 목록) | `outMembers.length > 0` | Notice `weak` + NameFlow |
| Notice danger (escalated) | 마감 후 + escalated 있음 + 호스트 | Notice `danger` |

## 화자·대상자별 시나리오

| 시점 | 표시되는 것 |
|---|---|
| 미응답자, 조율 진행 중 | Slots + Notice(제외) + Button primary + Board |
| 응답 완료자 | Slots + Notice(제외) + Button secondary "수정하기" + Board |
| 불참 정리된 멤버 | Slots + Notice(제외) + Chip + Button "다시 참여" + Board |
| 호스트 | (이의 Notice) + Slots + Notice(제외) + Button "현황 보기" + Board + (escalated Notice) |

## Notice tone 사용 규칙

이 버블은 4가지 Notice를 상황별로 사용한다.

| Notice | tone | 조건 |
|---|---|---|
| 비공개 이의 표시 | `warn` | 호스트 + 이의 있음 |
| 후보 제외 사유 | `weak` | `!widened` (초기 조율) |
| 불참 정리 목록 | `weak` | `outMembers.length > 0` |
| 필참 미응답 경고 | `danger` | 마감 후 + escalated + 호스트 |

**규칙**: 각 tone은 심각도를 표현. 임의로 tone을 바꾸지 않는다.

## Do / Don't

✅ SlotCard tally variant로 여러 슬롯 나열
✅ 대상자별로 액션 다르게 표시 (5가지 시나리오)
✅ 호스트만 비공개 이의·필참 경고 노출
✅ Notice tone으로 심각도 표현 (warn/weak/danger)
✅ `widened` 상태에 따라 subtitle 변경

❌ Hero SlotCard 사용 (Coordination은 Tally 나열)
❌ 비호스트에게 비공개 이의 정보 노출
❌ Notice tone을 모두 같은 값으로 통일
❌ Board를 항상 렌더 (대기자 없으면 생략)
❌ 불참 멤버를 slot 리스트에서 완전히 숨김 (별도 Notice로 안내)

## Figma 매핑

- **마스터**: `Organisms/Bubbles/Coordination`
- **Variants**:
  - `viewer = respondent | responded | out | host`
  - `phase = before-deadline | after-deadline`
  - `widened = false | true`
- **Properties**:
  - `title` (TEXT)
  - `subtitle` (TEXT)
  - `objection-visible` (BOOLEAN)
  - `out-members-visible` (BOOLEAN)
  - `escalated-visible` (BOOLEAN)
- **Nested instances**:
  - BubbleShell
  - SlotCard (tally variant) × N
  - Notice × 1~3 (tone별)
  - Button 또는 Chip+Button (viewer variant에 따라)
  - Board (조건부)
  - NameFlow (Board·Notice 내부)

---

# ConfirmedBubble

최종 확정 통보 버블. 확정된 시간·회의실·참석자를 요약하고 "조율 영수증"으로 시스템 개입 정도를 시각화.

## 사용 조건

- **쓴다**: `state.mode === 'confirmed'` (플로우 종료점)
- **쓰지 않는다**:
  - 잠정 확정 → ProposalBubble
  - 확정 후 변경 알림 → 신규 버블 필요 시 화이트리스트 확장 제안

## 상태 의존성

- `state.mode === 'confirmed'` — 렌더링 트리거
- `state.confirmed.slot` — 확정된 시간 슬롯 (Hero SlotCard에 전달)
- `state.confirmed.via` — 확정 방식 (`'layer1'` | `'layer2'`), subtitle과 receipt 문구 분기
- `state.confirmed.absent` — 마감 규칙 불참 목록
- `state.confirmed.unconfirmedRequired` — 확인 전 필참자 목록
- `state.reRequested` — 재요청 횟수 계산 (receipt 문구 조립)
- `state.phase` — 개인 리마인드 횟수 계산 (`phase >= 2 ? 1 : 0`)
- `MEMBER_IDS`에서 `absent`, `unconfirmedRequired` 제외 = attendees

**주요 액션**: 없음 (읽기 전용 버블)

## 핵심 원칙: 조율 영수증

**Mod U의 고유 어휘**: ConfirmedBubble은 최종 결과뿐 아니라 **"시스템이 주최자 대신 한 일"의 요약**을 마지막 Notice로 표시한다. 이는 "가치 교환표" 개념으로, 사용자가 시스템을 통해 무엇을 얻었는지 명시.

`via` 값에 따라 receipt 문구가 달라진다:
- `via === 'layer1'` (침묵 = 동의로 확정): "조율 영수증 — 단체방 독촉 0회, 투표 0회. 침묵이 그대로 확정이 됐어요."
- 그 외 (조율 후 확정): "조율 영수증 — 단체방 독촉 0회, 개인 리마인드 N회, 재요청 N회"

## 실제 구조

```jsx
<BubbleShell
  title="회의가 확정됐어요"
  subtitle={via === 'layer1' ? '이의 없이 그대로 확정됐어요' : '조율 결과로 확정됐어요'}
>
  <SlotCard slot={slot} variant="hero" />

  {/* 참석자 요약 */}
  <div className="confirm__people">
    <span className="confirm__label">참석 {attendees.length}</span>
    <div className="confirm__avatars">
      {attendees.map(id => <Avatar id={id} size="sm" />)}
    </div>
  </div>

  {/* 마감 규칙 불참 */}
  {absent.length > 0 && (
    <Notice tone="weak">
      마감 규칙에 따라 불참으로 정리됐어요: {absentNames.join(', ')}
    </Notice>
  )}

  {/* 확인 전 필참자 */}
  {unconfirmedRequired.length > 0 && (
    <Notice tone="warn">
      {names}님은 아직 확인 전이에요 — 별도로 안내했어요.
    </Notice>
  )}

  {/* 시스템 액션 결과 */}
  <Notice tone="success">모두의 캘린더에 등록하고 {slot.room}을 예약했어요.</Notice>

  {/* 조율 영수증 */}
  <Notice tone="weak">{receipt}</Notice>
</BubbleShell>
```

## 내부 요소 (조건부 렌더)

| 요소 | 조건 | 컴포넌트 |
|---|---|---|
| Hero SlotCard | 항상 | SlotCard `hero` |
| 참석자 요약 | 항상 | `.confirm__people` — label + Avatar 나열 |
| Notice weak (불참) | `absent.length > 0` | Notice `weak` |
| Notice warn (확인 전 필참) | `unconfirmedRequired.length > 0` | Notice `warn` |
| Notice success (등록 완료) | 항상 | Notice `success` |
| Notice weak (영수증) | 항상 | Notice `weak` — receipt 문구 |

## 참석자 요약 스펙

`.confirm__people` 영역의 세부.

| 요소 | 스타일 | 토큰 |
|---|---|---|
| Label (`confirm__label`) | `text-sm` semibold | `text/default` |
| Avatar 크기 | `size="sm"` (28px) | — |
| 겹침 offset | `margin-left: -8px` (예외 목록) | — |
| Avatar 보더 | 2px solid `surface/default` (겹침 구분선) | — |
| 첫 Avatar | `margin-left: 0` | — |

**규칙**:
- 참석자는 아바타로 겹쳐 나열 (이름 리스트 아님)
- 첫 아바타를 제외한 나머지는 `-8px` 겹침
- 이는 예외 목록에 등록된 값 (spacing.md 참조)

## Notice 4개의 역할

Confirmed 버블은 4개 Notice로 마감 결과를 설명한다. 각각 다른 정보.

| Notice | tone | 역할 |
|---|---|---|
| 불참 정리 | `weak` | 마감 규칙으로 자동 정리된 멤버 목록 (조건부) |
| 확인 전 필참 | `warn` | 필참인데 아직 확인 안 한 멤버 목록 (조건부) |
| 등록 완료 | `success` | 시스템이 캘린더·회의실 처리 완료 통보 |
| 조율 영수증 | `weak` | 시스템 개입 요약 (독촉 횟수 등) |

**규칙**: 각 Notice는 독립된 정보. 하나로 통합하지 않는다.

## 화자별 시나리오

Confirmed는 모든 사용자에게 **동일한 내용**을 표시한다. 시점 분기 없음. (ProposalBubble/CoordinationBubble과 다름)

## Do / Don't

✅ Hero SlotCard로 확정 시간 1개 강조
✅ 참석자를 Avatar 겹침으로 요약 (이름 나열 아님)
✅ 4개 Notice로 마감 결과·후속 처리 명시
✅ `via` 값에 따라 subtitle과 receipt 문구 변경
✅ 조율 영수증으로 시스템 개입 정도 시각화

❌ 참석자를 이름 리스트로 표시 (Avatar 겹침 사용)
❌ 확정 후 액션 버튼 추가 (읽기 전용)
❌ Notice를 하나로 통합 (각각 다른 정보)
❌ `via` 값 무시하고 문구 고정
❌ 조율 영수증 생략 (Mod U 고유 어휘)

## Figma 매핑

- **마스터**: `Organisms/Bubbles/Confirmed`
- **Variants**:
  - `via = layer1 | layer2` (확정 방식)
- **Properties**:
  - `title` (TEXT) — "회의가 확정됐어요" 고정
  - `subtitle` (TEXT) — via에 따라 변경
  - `attendee-count` (TEXT)
  - `absent-visible` (BOOLEAN)
  - `unconfirmed-visible` (BOOLEAN)
  - `receipt-text` (TEXT)
- **Nested instances**:
  - BubbleShell
  - SlotCard (hero variant)
  - Avatar (size=sm) × N (겹침 배치)
  - Notice × 2~4 (tone별)

---

# NoSlotBubble

교집합 붕괴 폴백 버블. 필참자 응답 후 공통 가능 시간이 없을 때 게시.

## 사용 조건

- **쓴다**: `state.mode === 'noslot'` (필참 응답 집계 후 교집합 0)
- **쓰지 않는다**:
  - 조율 가능한 경우 → CoordinationBubble
  - 개별 이의 → Proposal의 이의 액션

## 상태 의존성

- `state.mode === 'noslot'` — 렌더링 트리거
  - `intersectionCollapsed(state)`로 판정: 필참자 응답 후 교집합이 0일 때 mode가 자동으로 `'noslot'`으로 전환됨
- `state.currentUser === 'runa'` — 호스트 확인 (isHost)
  - 호스트: 재조율 액션 표시
  - 비호스트: 대기 안내만 표시

**주요 액션**:
- 호스트: Button 클릭 시 `dispatch({ type: 'WIDEN' })` — 기간을 넓혀 조율 재시작 (`slots`가 `WIDENED_SLOTS`로 교체되고 mode가 `'coordination'`으로 전환)
- 비호스트: 액션 없음

## 핵심 원칙: 설계된 실패

**Mod U의 어휘**: NoSlot은 "시스템이 확정할 수 없는" 상태로, 사람(호스트)의 재조정이 필요함을 명확히 전달한다. 시스템이 대체 시간을 자동 제안하지 않는다.

## 실제 구조

```jsx
<BubbleShell
  title="다음 주엔 모두 가능한 시간이 없어요"
  subtitle="꼭 참석해야 하는 분들의 일정이 겹치지 않아요"
>
  {isHost ? (
    <div className="bubble__actions">
      <Button variant="primary" full>기간을 넓혀 다시 찾기</Button>
      <Notice tone="weak">
        또는 필참 구성을 조정해보세요 — 필참자가 적을수록 시간이 빨리 잡혀요.
      </Notice>
    </div>
  ) : (
    <Notice tone="neutral">루나님이 일정을 다시 조율하고 있어요.</Notice>
  )}
</BubbleShell>
```

## 내부 요소 (조건부 렌더)

| 요소 | 조건 | 컴포넌트 |
|---|---|---|
| Button primary (기간 확장) | 호스트 | Button `primary` `full` |
| Notice weak (필참 조정 안내) | 호스트 | Notice `weak` |
| Notice neutral (대기 안내) | 비호스트 | Notice `neutral` |

## 화자별 시나리오

| 시점 | 표시되는 것 |
|---|---|
| 호스트 (runa) | Button "기간을 넓혀 다시 찾기" + Notice weak (필참 조정 팁) |
| 비호스트 | Notice neutral "루나님이 조율하고 있어요" |

**규칙**: 비호스트는 액션이 없다. 재조율 결정은 호스트만.

## Do / Don't

✅ 호스트에게만 재조율 액션 (WIDEN)
✅ 비호스트에게는 대기 안내만
✅ 원인을 subtitle에 명시 ("필참자 일정 겹침")
✅ 필참 구성 조정 힌트를 Notice로 제공

❌ 시스템이 자동으로 대체 시간 제안
❌ 비호스트에게 액션 버튼 (재조율은 호스트 결정)
❌ 필참자 실명·이유 상세 나열 (프라이버시)
❌ Hero SlotCard 표시 (확정된 시간 없음)
❌ 여러 버튼 나열 (핵심 액션 하나만)

## Figma 매핑

- **마스터**: `Organisms/Bubbles/NoSlot`
- **Variants**:
  - `viewer = host | member`
- **Properties**:
  - `title` (TEXT) — 기본값 "다음 주엔 모두 가능한 시간이 없어요"
  - `subtitle` (TEXT)
- **Nested instances**:
  - BubbleShell
  - Button (primary, full) — host viewer only
  - Notice (weak 또는 neutral) — viewer에 따라

---

# SchedulingBubble (라우터)

`state.mode`에 따라 위 5개 버블 중 하나를 렌더하는 라우터 컴포넌트. **버블의 실제 진입점**.

## 사용 조건

- **쓴다**: ChatRoom에서 시스템 메시지 자리에 배치
- **쓰지 않는다**: 특정 버블을 직접 지정해야 하는 경우 (거의 없음)

## 실제 구조

```jsx
export function SchedulingBubble() {
  const { state } = useStore()
  if (state.mode === 'compose') return <ComposeCard />
  if (state.mode === 'confirmed') return <ConfirmedBubble />
  if (state.mode === 'noslot') return <NoSlotBubble />
  if (state.mode === 'coordination') return <CoordinationBubble />
  return <ProposalBubble />  // 기본값: proposal 또는 proposalEscalated
}
```

## 라우팅 매핑

| `state.mode` | 렌더되는 버블 |
|---|---|
| `'compose'` | ComposeCard |
| `'proposal'` | ProposalBubble |
| `'proposalEscalated'` | ProposalBubble (escalated 프로퍼티 활성) |
| `'coordination'` | CoordinationBubble |
| `'confirmed'` | ConfirmedBubble |
| `'noslot'` | NoSlotBubble |

## Used by

- `ChatRoom.jsx`의 `<div className="chat__msg--center">` 내부
- 채팅방에 게시되는 유일한 시스템 카드 진입점

## Do / Don't

✅ ChatRoom에서는 SchedulingBubble만 사용 (개별 버블 직접 참조 금지)
✅ state.mode 변화 시 자동으로 적절한 버블로 전환
✅ 라우팅 로직 안에 조건부 렌더 위임

❌ ChatRoom에서 개별 버블(`<ProposalBubble />` 등)을 직접 참조
❌ SchedulingBubble 안에서 여러 버블을 동시에 렌더
❌ mode 값에 따라 라우팅 로직을 다른 곳에서 중복 구현

## Figma 매핑

SchedulingBubble은 **코드 전용 라우터**이며, Figma에는 대응 컴포넌트가 없다. Figma에서는 각 mode별로 해당 버블 인스턴스를 직접 배치.

---

## 버블 간 관계와 전환

Mod U의 회의 확정 플로우에서 버블들의 관계.

### 정상 플로우

```
ComposeCard (호스트만 시작점)
  ↓ CREATE 액션
ProposalBubble (잠정 확정)
  ↓ 침묵 = 동의, 마감 도달
ConfirmedBubble (via='layer1')
```

### 조율 폴백 플로우 (계층 2)

```
ProposalBubble (잠정 확정)
  ↓ 필참자 이의 제기
CoordinationBubble (조율 진입) — 폴백
  ↓ 다수 응답 후 교집합 확보
ConfirmedBubble (via='layer2')
```

### 재알림 플로우 (ProposalBubble 내부 상태 전환)

```
ProposalBubble (mode='proposal')
  ↓ 필참 확인 기한 도과
ProposalBubble (mode='proposalEscalated')
  ↓ 확인 완료 또는 재확인 후
ConfirmedBubble
```

### 실패 플로우

```
CoordinationBubble
  ↓ 조율 후에도 교집합 없음
NoSlotBubble
  ↓ WIDEN 액션 (호스트만)
CoordinationBubble (widened=true)
```

### 전환 규칙

- 같은 채팅방에서 하나의 SchedulingBubble이 mode에 따라 다른 버블로 전환됨
- 이전 버블은 별도 히스토리로 유지되지 않음 (state.mode 하나로 관리)
- 각 버블은 SchedulingBubble 안에서 조건부 렌더됨
- proposal → proposalEscalated 전환은 같은 ProposalBubble 인스턴스가 escalated 상태로 재렌더

## 공통 조립 규칙

### Uses (모든 버블 공통)

- BubbleShell (공통 셸)
- Notice (안내 문구)

### Uses (버블별 추가)

| 버블 | 추가 하위 컴포넌트 |
|---|---|
| ComposeCard | Button (primary, full) |
| ProposalBubble | SlotCard hero, Button 또는 Chip, Board(NameFlow) |
| CoordinationBubble | SlotCard tally × N, Button 또는 Chip+Button, Board, NameFlow × 다수 |
| ConfirmedBubble | SlotCard hero, Avatar × N (겹침), `.confirm__people` 요약 |
| NoSlotBubble | Button (호스트만) |

### Used by

- ChatRoom의 시스템 메시지 위치 (`chat__msg--center`)
- SchedulingBubble이 라우터로서 진입점

### 나열 규칙

- 채팅방에는 **하나의 SchedulingBubble만** 표시 (여러 시스템 카드 동시 배치 없음)
- 시스템 카드 위치는 `chat__msg--center` 컨테이너로 감싸 중앙 정렬
- 시스템 카드 앞뒤로 일반 메시지(INTRO_MESSAGES, TRAILING_MESSAGES)가 배치됨

## Non-negotiable rules

### 1. 시스템 명의 원칙
모든 버블은 시스템 명의의 중앙 카드로 게시. 특정 참석자의 개인 말풍선처럼 렌더링하지 않는다. 4면 모두 `radius-lg`, 아바타 없음.

### 2. 5종 버블 + 1개 라우터
ComposeCard / ProposalBubble / CoordinationBubble / ConfirmedBubble / NoSlotBubble + SchedulingBubble. 이 외 시스템 메시지 유형을 만들지 않는다.

### 3. Coordination은 폴백
Coordination은 예외 상황에서만 진입한다. 기본 플로우 어휘로 사용하지 않는다.

### 4. 침묵은 동의
Proposal에는 "동의" primary 버튼을 만들지 않는다. 응답 없음이 곧 동의.

### 5. SchedulingBubble이 유일한 진입점
ChatRoom은 개별 버블을 직접 참조하지 않는다. SchedulingBubble이 mode 기반으로 라우팅.

### 6. BubbleShell 필수
모든 버블은 BubbleShell로 감싼다. 헤더(앱 라벨 + 타이틀) 없는 시스템 카드 금지.

### 7. 대상자별 렌더 분기
Proposal·Coordination은 viewer(호스트/필참/선택/응답 완료 등)에 따라 액션·표시가 다르다. Confirmed·NoSlot도 호스트 여부로 분기. 모든 사용자에게 동일 화면 표시 금지.

### 8. 조율 영수증 필수
ConfirmedBubble은 반드시 receipt Notice를 포함한다. 시스템 개입 정도를 명시하는 Mod U 고유 어휘.

## Common mistakes to avoid

❌ 시스템 메시지를 주최자의 개인 말풍선으로 렌더링 (좌측 아바타 + 이름)
✅ 시스템 명의 중앙 카드. 아바타 없음, 중앙 정렬

❌ Proposal에 "동의합니다" primary 버튼 추가
✅ 침묵은 동의. 응답 필요 시 "확인하기"/"응답하기"만

❌ Coordination을 기본 플로우 어휘로 사용 (모든 회의에 등장)
✅ 이의·교집합 부재 시에만. Proposal이 기본

❌ ChatRoom에서 `<ProposalBubble />` 직접 렌더
✅ `<SchedulingBubble />`만 사용. mode 기반 라우팅에 위임

❌ ComposeCard를 모든 사용자에게 표시
✅ 호스트만 렌더 (`if (!isHost) return null`)

❌ ComposeCard 안에 필드(회의명·시간·회의실) 편집 UI 삽입
✅ ComposeCard는 진입 CTA만. 편집은 ComposeSheet에서

❌ ConfirmedBubble의 참석자를 이름 리스트로 나열
✅ Avatar 겹침(-8px)으로 시각 요약

❌ ConfirmedBubble에서 조율 영수증 생략
✅ 시스템 개입 정도를 명시하는 필수 요소

❌ NoSlotBubble에서 시스템이 대체 시간 자동 제안
✅ 재조율은 호스트의 결정. 시스템은 상황 통보만

❌ Coordination에서 모든 Notice를 같은 tone으로 통일
✅ warn(이의) / weak(제외 사유·불참 목록) / danger(필참 무응답) 심각도별로

❌ Proposal의 액션 영역을 호스트에게도 표시
✅ 액션은 비호스트만. 호스트는 대기·현황 관찰

❌ Board(대기자 명단)를 대기자 없어도 항상 렌더
✅ `waiting.length > 0`일 때만

❌ ProposalBubble에서 여러 후보 시간 나열
✅ Hero SlotCard 하나만. 여러 시간은 CoordinationBubble

❌ proposalEscalated를 별도 컴포넌트로 만들기
✅ ProposalBubble의 상태 프로퍼티로 처리 (escalated boolean)

❌ 조율 후 확정 시에도 receipt를 layer1 문구로 표시
✅ via 값에 따라 문구 분기 (layer1: "침묵이 그대로 확정" / layer2: "독촉·리마인드·재요청 횟수")