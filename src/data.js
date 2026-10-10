/* ============================================================
   Static data — 화면에 표시되는 모든 고정 데이터.
   store.jsx에서 재사용. 순수 JS, React 의존 없음.
   ============================================================ */

export const MEMBERS = {
  runa: { name: '루나' },
  will: { name: '윌리엄' },
  dan: { name: '댄' },
  mara: { name: '마라' },
  jim: { name: '짐' },
  lia: { name: '리아' },
}

export const MEMBER_IDS = ['runa', 'will', 'dan', 'mara', 'jim', 'lia']

const USER_COLORS = [
  '#3182f6', // runa — blue
  '#7048e8', // will — violet
  '#0ca678', // dan — teal
  '#f59f00', // mara — amber
  '#e64980', // jim — pink
  '#495057', // lia — slate
]

export function userColorOf(id) {
  const idx = MEMBER_IDS.indexOf(id)
  return USER_COLORS[idx] ?? USER_COLORS[0]
}

/* 계층 1: 잠정 확정 슬롯 */
export const PROPOSAL_SLOT = {
  id: 'tue-10',
  day: '화요일',
  date: '10월 14일',
  time: '10:00 – 11:00',
  room: '3층 라운지',
}

/* 계층 2: 조율 후보 슬롯 (수요일·화 13:00 제외 후) */
export const COORDINATION_SLOTS = [
  { id: 'mon-10', day: '월요일', date: '10월 13일', time: '10:00 – 11:00', room: '3층 라운지' },
  { id: 'thu-14', day: '목요일', date: '10월 16일', time: '14:00 – 15:00', room: '2층 회의실 A' },
  { id: 'fri-10', day: '금요일', date: '10월 17일', time: '10:00 – 11:00', room: '3층 라운지' },
]

/* 캘린더 기반 프리셋 — 조율 시트 초기값. 팀원이 직접 수정 가능 */
export const CALENDAR_PRESET = {
  runa: { 'mon-10': 'ok', 'thu-14': 'ok', 'fri-10': 'ok' },
  will: { 'mon-10': 'ok', 'thu-14': 'hard', 'fri-10': 'ok' },
  dan:  { 'mon-10': 'hard', 'thu-14': 'ok', 'fri-10': 'ok' },
  mara: { 'mon-10': 'ok', 'thu-14': 'ok', 'fri-10': 'hard' },
  jim:  { 'mon-10': 'ok', 'thu-14': 'ok', 'fri-10': 'ok' },
  lia:  { 'mon-10': 'hard', 'thu-14': 'ok', 'fri-10': 'ok' },
}

/* 채팅 메시지 — 버블 앞뒤의 자연스러운 대화 맥락 */
export const INTRO_MESSAGES = [
  { from: 'mara', text: '이번 주 공유드릴 게 많아서 주간 회의 꼭 해야 할 것 같아요!' },
  { from: 'will', text: '저도 업데이트 있어요. 언제가 좋을까요?' },
  { from: 'jim', text: '다음 주 월요일 이후로 잡아주시면 좋겠어요.' },
]

export const TRAILING_MESSAGES = [
  { from: 'dan', text: '알겠어요, 확인해볼게요.' },
  { from: 'lia', text: '저도 참석 예정이에요 👍' },
]

export const TODAY_LABEL = '오늘'

/* JudgeBar 시간 단계 */
export const STAGES = [
  {
    key: 'compose',
    label: '생성 전',
    title: '아직 회의가 생성되지 않았어요',
    desc: '루나 시점에서 채팅방 버블의 "회의 만들기"를 탭해보세요.',
  },
  {
    key: 'proposal',
    label: '잠정 확정',
    title: '잠정 확정이 게시됐어요',
    desc: '팀원 시점으로 전환해 응답을 체험해보세요. 이의를 보내면 조율 모드로 전환돼요.',
  },
  {
    key: 'escalated',
    label: '마감 임박',
    title: '마감 임박 — 미응답 필참자에게 다시 알렸어요',
    desc: '루나 시점에서 현황을 확인하거나, 팀원 시점에서 응답을 체험해보세요.',
  },
  {
    key: 'deadline',
    label: '마감 이후',
    title: '응답 마감이 지났어요',
    desc: '루나 시점에서 1순위 시간으로 확정하거나 마감을 연장할 수 있어요.',
  },
]

/* 테스터 힌트 — 단계별 안내 문구 */
export const HINTS = [
  '루나 시점에서 "회의 만들기"를 탭해 회의 조건을 확인하고 게시해보세요.',
  '팀원 시점으로 전환해 확인하거나 이의를 보내보세요. 이의가 오면 조율 모드로 전환돼요.',
  '필참자 중 미응답자에게만 개인 알림이 갔어요. 루나 시점에서 현황을 확인해보세요.',
  '루나 시점에서 1순위로 확정하거나, 마감을 연장하고 기다릴 수 있어요.',
]
export const COMPOSE_HINT = '시스템이 채팅 대화와 캘린더를 읽어 미리 채워뒀어요. 탭해서 수정할 수 있어요.'

/* 생성 시트 — 회의 정보 필드 */
export const MEETING_FIELDS = [
  {
    key: 'title',
    label: '회의 이름',
    source: '채팅 대화에서 추출했어요',
    type: 'text',
  },
  {
    key: 'duration',
    label: '소요 시간',
    source: '지난 주간 회의 평균이에요',
    type: 'options',
    options: ['30분', '1시간', '1시간 30분', '2시간'],
  },
  {
    key: 'range',
    label: '일정 범위',
    source: '팀 캘린더 기준이에요',
    type: 'options',
    options: ['이번 주', '다음 주', '2주 이내'],
  },
  {
    key: 'deadline',
    label: '응답 마감',
    source: '통상적으로 3일 전이에요',
    type: 'options',
    options: ['오늘 18:00', '내일 18:00', '이번 주 금요일 18:00'],
  },
]

export const REQUIRED_SOURCE = '지난 주 회의 참석 이력과 채팅방 역할 정보 기반이에요.'
