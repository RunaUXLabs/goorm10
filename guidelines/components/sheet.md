# Sheet

바텀시트 컨테이너 + 4개 서브 시트. 채팅방 위로 슬라이드 업되어 상세 액션을 처리한다.

## 정본과 참조 관계

- 코드 정본: `src/components/Sheet.jsx`
- Figma 정본: `Organisms/Sheet/*` 컴포넌트
- 상세 문서: `docs/design-system/organisms/sheet.md`

## 최상위 원칙: 하나의 진입점, 여러 상태

**IMPORTANT**: Sheet는 **단일 진입점**이다. 채팅방에서 버블·현황판을 탭하면 `dispatch({ type: 'SHEET', open: true })`가 호출되며, Sheet 내부에서 `state.mode`와 `isHost`에 따라 4개 서브 시트 중 하나가 렌더된다.

이 원칙은 "같은 버튼을 눌러도 사용자의 역할·시점에 따라 다른 화면"이라는 Mod U의 핵심 어휘를 구현한다.

## 포함 컴포넌트

| 컴포넌트 | 성격 | 트리거 조건 |
|---|---|---|
| Sheet (래퍼) | 바텀시트 컨테이너 + 라우터 | `state.sheetOpen === true` |
| ComposeSheet | 회의 만들기 | `state.mode === 'compose'` |
| ProposalSheet | 잠정 확정에 대한 응답 | `mode === 'proposal' \| 'proposalEscalated'` + 비호스트 |
| ResponseSheet | 조율 모드 슬롯 응답 | `mode === 'coordination'` + 비호스트 |
| OrganizerSheet | 주최자 현황 매트릭스 | 호스트(`currentUser === 'runa'`) — proposal/coordination 두 상태 |

**규칙**: 이 5개 외의 시트를 만들지 않는다. 새 시나리오가 필요하면 화이트리스트 확장 제안.

---

# Sheet (래퍼 + 라우터)

바텀시트 컨테이너와 서브 시트 라우팅을 담당하는 최상위 컴포넌트.

## 사용 조건

- **쓴다**: `state.sheetOpen === true`일 때만 렌더
- **쓰지 않는다**: sheetOpen이 false면 `return null` (조건부 렌더)

## 실제 구조

```jsx
export default function Sheet() {
  const { state, dispatch } = useStore()
  if (!state.sheetOpen) return null
  const isHost = state.currentUser === 'runa'

  return (
    <div className="sheet__dim" onClick={() => dispatch({ type: 'SHEET', open: false })}>
      <div
        className={`sheet ${state.mode === 'compose' ? 'sheet--tall' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__grab" />
        {state.mode === 'compose' ? <ComposeSheet /> :
         isHost ? <OrganizerSheet /> :
         state.mode === 'proposal' || state.mode === 'proposalEscalated' ? <ProposalSheet /> :
         <ResponseSheet />}
      </div>
    </div>
  )
}
```

## 라우팅 로직

```
Sheet 오픈 시:
  ├─ mode === 'compose' → ComposeSheet (호스트 여부 무관, 실제로는 호스트만 트리거)
  ├─ isHost === true → OrganizerSheet (proposal/coordination phase 자동 분기)
  ├─ mode === 'proposal' || 'proposalEscalated' → ProposalSheet
  └─ 그 외 (coordination) → ResponseSheet
```

**규칙**: 라우팅 로직은 Sheet 래퍼에만 존재. 외부에서 특정 서브 시트를 직접 지정할 수 없다.

## 스펙 (컨테이너)

| 요소 | 스타일 | 토큰 |
|---|---|---|
| Dim (`sheet__dim`) | position absolute, inset 0, backdrop 딤 | `dim` |
| Sheet (`sheet`) | width 100%, max-height 86%, 하단 부착 | `surface/default` bg, `shadow-sheet` |
| Sheet radius | 상단 2모서리만 `radius-lg` | 상단 부착 부분만 라운드 |
| Sheet--tall | max-height 80% (compose 전용) | Compose 필드 편집 공간 확보 |
| Grab handle | 44×4px, pill, 상단 중앙 | `line/default` |
| 애니메이션 | 하단에서 슬라이드 업 | `sheetUp` keyframe, `duration-base ease-out` |

## 상호작용

| 트리거 | 동작 |
|---|---|
| Dim 클릭 | Sheet 닫기 (`dispatch({ type: 'SHEET', open: false })`) |
| Sheet 본문 클릭 | 이벤트 전파 차단 (`stopPropagation`) |
| Grab handle | 시각적 어포던스만. 실제 드래그 없음 |

**규칙**: Sheet 밖(dim) 클릭으로만 닫힌다. 명시적 닫기 버튼 없음.

## Variant: sheet--tall

Compose 모드일 때만 적용되는 modifier. 필드 편집 공간을 위해 max-height를 확장.

| 속성 | 기본 sheet | sheet--tall |
|---|---|---|
| max-height | 86% | 80% |
| height | 자동 (콘텐츠) | 80% (고정) |

**규칙**: `sheet--tall`은 Compose 전용. 다른 서브 시트에서 사용하지 않는다.

## 공통 내부 구조

모든 서브 시트가 공유하는 구조.

```
Sheet
├── .sheet__grab (라운드 핸들 시각 요소)
└── 서브 시트 컴포넌트
    ├── .sheet__body (스크롤 가능, 본문)
    │   └── .sheet__section × N (섹션 그룹)
    │       ├── .sheet__title 또는 .sheet__sectiontitle
    │       └── 콘텐츠
    └── .sheet__footer (선택적, 하단 고정 CTA)
        ├── Button primary full
        └── Notice weak (부가 안내)
```

## Body vs Footer

| 영역 | 특성 | 사용 |
|---|---|---|
| `sheet__body` | 스크롤 가능, 상단 제한, padding `space-3 space-5 space-5` | 본문 콘텐츠 (섹션 나열) |
| `sheet__footer` | 하단 고정, padding `space-3 space-5 space-6` | 주요 액션 CTA + 부가 Notice |

**규칙**:
- Body는 항상 존재
- Footer는 선택적. **주요 액션 CTA가 있을 때만** 사용 (Compose·Response·Organizer coordination)
- Footer는 body 위에 그라데이션 포그로 스크롤 오버플로우 암시 (`sheet__footer::before`)

## 섹션 위계

Sheet 본문은 섹션 단위로 조직된다.

| 요소 | 용도 | 스타일 |
|---|---|---|
| `sheet__title` | 시트 최상단 타이틀 (한 시트에 1개) | `text-lg` bold |
| `sheet__sectiontitle` | 섹션 라벨 (여러 개 가능) | `text-xs` bold, `text/weak/default`, 자간 0.6px, 옆으로 1px 라인 |
| `sheet__section` | 섹션 그룹 컨테이너 | gap `space-2`, `sheet__body` 안에서 `space-6` 간격 |

**여백 위계**:
- 필드 내부: `space-1` (4px)
- 섹션 내 요소 간: `space-2` (8px)
- 섹션 간: `space-6` (24px)

## Sheet 공통 조립 규칙

### Used by

- ChatRoom (`<Sheet />` 컴포넌트로 마운트)

### Uses

- ComposeSheet / ProposalSheet / ResponseSheet / OrganizerSheet (조건부 렌더)

## Non-negotiable rules (Sheet 래퍼)

### 1. 단일 진입점 원칙
Sheet는 `state.sheetOpen` 하나로만 오픈된다. 여러 진입점을 만들지 않는다.

### 2. 라우팅은 Sheet 내부에만
외부에서 `<ComposeSheet />`를 직접 렌더하지 않는다. 항상 `<Sheet />`를 통해 라우팅.

### 3. Dim 클릭으로 닫기
명시적 X 버튼을 만들지 않는다. Dim 영역 클릭이 유일한 닫기 액션.

### 4. `sheet--tall`은 Compose 전용
다른 서브 시트에 `sheet--tall` variant 적용 금지.

### 5. Body/Footer 구조 유지
콘텐츠는 항상 `sheet__body` 안에. 주요 액션은 `sheet__footer`에 분리 고정.

---

# ComposeSheet

주최자가 회의 조건(제목·시간·기간·마감·필참자)을 설정하는 시트.

## 사용 조건

- **쓴다**: `state.mode === 'compose'` (회의 생성 진입점)
- **쓰지 않는다**: 이후 phase (proposal, coordination, confirmed)

## 상태 의존성

- `state.mode === 'compose'` — 렌더링 트리거
- `state.meeting` — 편집 대상 데이터 (제목·시간·기간·마감)
- `state.required` — 필참자 목록 초기값
- `MEETING_FIELDS` — data.js에 정의된 필드 스키마
- `REQUIRED_SOURCE` — 필참 설정 안내 문구

**로컬 상태**:
- `req` (필참자 배열, useState로 관리)
- `editing` (현재 편집 중인 필드 key, 하나만)

**주요 액션**:
- 필드 저장 → `dispatch({ type: 'UPDATE_MEETING', patch: { [key]: value } })`
- 시간 찾기 시작 → `dispatch({ type: 'CREATE', required: req })`

## 실제 구조

```jsx
<>
  <div className="sheet__body">
    <div className="sheet__section">
      <h3 className="sheet__title">회의 만들기</h3>
      <Notice tone="neutral">...안내...</Notice>
    </div>

    <div className="sheet__section">
      <span className="sheet__sectiontitle">회의 정보</span>
      <div className="compose__fields">
        {MEETING_FIELDS.map(f => <Field key={f.key} ... />)}
      </div>
    </div>

    <div className="sheet__section">
      <span className="sheet__sectiontitle">참석자와 필참</span>
      <Notice tone="neutral">...필참 설명...</Notice>
      <span className="field__source">{REQUIRED_SOURCE}</span>
      <div className="matrix">
        {MEMBER_IDS.filter(id => id !== 'runa').map(id => (
          <MatrixRow />
        ))}
      </div>
      <Notice tone="weak">...팁...</Notice>
    </div>
  </div>

  <div className="sheet__footer">
<Button variant="primary" full onClick={() => dispatch({ type: 'CREATE', required: req })}>
      이 조건으로 시간 찾기
    </Button>
    <Notice tone="weak">필참/선택 구분은 나에게만 보여요. 팀원들에게는 같은 요청으로 전달돼요.</Notice>
  </div>
</>
```

## 3개 섹션 구성

ComposeSheet는 반드시 아래 3개 섹션으로 구성된다.

### 섹션 1: 인트로

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Title | `sheet__title` | "회의 만들기" 고정 |
| Notice | `tone="neutral"` | 사전 채움 안내 |

Notice 텍스트 (고정):
> "채팅방 대화와 팀 캘린더를 읽고 미리 채워뒀어요. **값을 누르면 바꿀 수 있어요.**"

### 섹션 2: 회의 정보

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Section title | `sheet__sectiontitle` | "회의 정보" 고정 |
| Fields | `compose__fields` 컨테이너 + Field × N | `MEETING_FIELDS`로 순회 |

각 Field는 하나의 회의 속성을 표현한다.

### 섹션 3: 참석자와 필참

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Section title | `sheet__sectiontitle` | "참석자와 필참" 고정 |
| Notice | `tone="neutral"` | 필참 개념 설명 (bold 강조 포함) |
| Source label | `field__source` | 필참 자동 설정 근거 |
| Matrix | `matrix` 컨테이너 + MatrixRow × 5 (runa 제외) | 필참/선택 토글 |
| Notice | `tone="weak"` | 필참자 적을수록 빠르다는 팁 |

## Field 컴포넌트 (compose 내부)

각 회의 속성 편집 UI. `MEETING_FIELDS`의 각 항목마다 하나씩 렌더.

### 실제 구조

```jsx
<div className="field" key={f.key}>
  <div className="field__row">
    <span className="field__label">{f.label}</span>
    <button
      className="field__value"
      onClick={() => setEditing(editing === f.key ? null : f.key)}
    >
      {state.meeting[f.key]} <span className="field__editicon">✎</span>
    </button>
  </div>
  <span className="field__source">{f.source}</span>
  {editing === f.key && (
    f.type === 'text' ? <input className="field__input" ... />
                     : <div className="field__options">...</div>
  )}
</div>
```

### 상태

| 상태 | 표시 |
|---|---|
| 기본 (미편집) | 라벨 + 값 버튼 (✎ 아이콘) + source 문구 |
| 편집 중 (`editing === f.key`) | 위 + 하단에 입력 UI (text 또는 options) |

**규칙**:
- 편집은 **한 번에 하나의 필드만** (`editing` 로컬 state로 배타적 관리)
- 필드 값 클릭 시 편집 토글 (같은 필드 다시 클릭하면 편집 종료)

### Field 타입

`MEETING_FIELDS`의 `type`에 따라 편집 UI 분기.

| type | 편집 UI |
|---|---|
| `text` | `<input className="field__input">` — Enter 또는 blur 시 저장 |
| `options` | `<div className="field__options">` — 옵션 Button 나열, 클릭 시 저장 |

## MatrixRow (필참자 설정)

필참 토글용 매트릭스 행. 각 멤버(runa 제외) 5명.

### 실제 구조

```jsx
<div className="matrix__row" key={id}>
  <span className="matrix__name">
    <Avatar id={id} size="sm" /> {MEMBERS[id].name}
  </span>
  <Button
    variant={req.includes(id) ? 'primary' : 'secondary'}
    size="sm"
    onClick={() => toggle(id)}
  >
    {req.includes(id) ? '필참' : '선택 참석'}
  </Button>
</div>
```

### 상태

| 상태 | Button variant | Button 텍스트 |
|---|---|---|
| 필참 | primary | "필참" |
| 선택 참석 | secondary | "선택 참석" |

**규칙**: 라벨 텍스트는 "필참"/"선택 참석" 고정. 다른 문구로 변경 금지.

## Footer 액션

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Primary CTA | Button primary, full | "이 조건으로 시간 찾기" — CREATE 액션 dispatch |
| Notice weak | 부가 안내 | "필참/선택 구분은 나에게만 보여요" |

## Do / Don't

✅ 3개 섹션 구조 유지 (인트로 → 회의 정보 → 참석자와 필참)
✅ 편집은 한 번에 하나의 필드만
✅ Field 값 버튼에 ✎ 아이콘 병기 (편집 가능성 어포던스)
✅ MatrixRow의 필참 토글은 Button variant로 (primary/secondary)
✅ `sheet--tall` variant 사용 (Compose 전용)

❌ 여러 필드를 동시에 편집 상태로 표시
❌ Field 값을 항상 편집 UI로 노출 (값 버튼 → 편집 UI 전환 유지)
❌ Runa(주최자)를 필참 매트릭스에 포함 (자동 필참, 편집 불가)
❌ Section title 텍스트 변경 ("회의 정보"/"참석자와 필참" 고정)
❌ Footer 없이 body에 CREATE 버튼 배치

## Figma 매핑

- **마스터**: `Organisms/Sheet/ComposeSheet`
- **Variants**: 없음
- **Properties**:
  - `title` (TEXT) — "회의 만들기" 고정 텍스트
  - `intro-notice` (TEXT)
  - `required-source` (TEXT)
- **Nested instances**:
  - Notice × 3~4 (tone별)
  - Field × N (MEETING_FIELDS 개수만큼)
  - MatrixRow × 5 (Avatar + Button)
  - Button (primary, full) — footer CTA

---

# ProposalSheet

잠정 확정된 시간에 대한 개별 응답 시트. 2단계 화면 전환 (응답 선택 → 사유 선택).

## 사용 조건

- **쓴다**: `mode === 'proposal' \| 'proposalEscalated'` + 비호스트
- **쓰지 않는다**:
  - 호스트 → OrganizerSheet (proposal phase)
  - 조율 모드 → ResponseSheet
  - 회의 생성 → ComposeSheet

## 상태 의존성

- `state.mode` — 'proposal' 또는 'proposalEscalated'
- `state.currentUser` (= me) — 응답자 식별
- `isRequired(state, me)` — 필참 여부 (Notice 표시 분기)
- `PROPOSAL_SLOT` — 잠정 확정 시간 (SlotCard hero에 전달)

**로컬 상태**:
- `objecting` (2단계 전환용, useState)

**주요 액션**:
- 괜찮아요 → `dispatch({ type: 'PROPOSAL_RESPOND', member: me, kind: 'ok' })`
- 어려워요 → `setObjecting(true)` (사유 선택 화면으로 전환)
- 사유 선택 → `dispatch({ type: 'PROPOSAL_RESPOND', member: me, kind: 'objection', reason })`

## 2단계 화면

ProposalSheet는 `objecting` 상태에 따라 두 화면으로 전환된다.

### 단계 1: 응답 선택 (objecting === false)

```jsx
<div className="sheet__body">
  <h3 className="sheet__title">이 시간, 괜찮으세요?</h3>
  <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
  {required && <Notice tone="neutral">꼭 참석해야 하는 회의라 확인이 필요해요.</Notice>}
  <div className="sheet__actions">
    <Button variant="primary" full onClick={handleOk}>괜찮아요</Button>
    <Button variant="secondary" full onClick={() => setObjecting(true)}>어려워요</Button>
  </div>
  <Notice tone="weak">'어려워요'는 루나님에게만 전달돼요. 채팅방에는 표시되지 않아요.</Notice>
</div>
```

**요소 순서**: 타이틀 → Hero SlotCard → (필참 안내) → 액션 2개 → 프라이버시 안내

### 단계 2: 사유 선택 (objecting === true)

```jsx
<div className="sheet__body">
  <h3 className="sheet__title">어떤 사정인지 알려주시면 조율에 도움이 돼요</h3>
  <div className="sheet__reasons">
    {OBJECTION_REASONS.map(r => (
      <Button variant="secondary" full onClick={() => handleReason(r)}>{r}</Button>
    ))}
    <Button variant="ghost" full onClick={() => handleReason('사유 미입력')}>사유 없이 보내기</Button>
  </div>
  <Notice tone="weak">사유는 선택이에요. 루나님에게만 비공개로 전달돼요.</Notice>
</div>
```

**요소 순서**: 타이틀 → 사유 옵션 3개 + 사유 없이 보내기 → 프라이버시 안내

## OBJECTION_REASONS (고정 옵션)

Sheet.jsx에 하드코딩된 3가지 사유:

```js
const OBJECTION_REASONS = [
  '점심 직후는 어려워요',
  '외근이 있어요',
  '개인 일정이 있어요',
]
```

**규칙**: 이 3개 + "사유 없이 보내기" = 총 4개 버튼. 변경 시 코드 수정 필요.

## Footer 없음

ProposalSheet는 footer가 없다. 모든 액션이 body 안에 배치된다.

## Do / Don't

✅ 2단계 화면 전환 (응답 → 사유 선택)
✅ 사유는 3개 고정 옵션 + 사유 없이 보내기
✅ 필참자에게만 필참 Notice 노출
✅ '어려워요' 응답이 비공개임을 반복해서 안내 (2번 Notice)
✅ Hero SlotCard로 잠정 확정 시간 명시

❌ 사유 옵션을 사용자가 자유롭게 입력 (드롭다운/자유 텍스트 금지)
❌ 사유 선택 없이 objection 저장 (사유 없이 보내기 버튼으로 명시적 처리)
❌ '괜찮아요' 후 사유 화면 표시 (ok는 즉시 완료)
❌ 사유를 채팅방에 표시 (호스트에게만 비공개 전달)
❌ Footer에 CTA 배치 (Proposal은 body 안에 모두 배치)

## Figma 매핑

- **마스터**: `Organisms/Sheet/ProposalSheet`
- **Variants**:
  - `stage = choose | reason` (2단계 화면 전환)
- **Properties**:
  - `title` (TEXT) — stage에 따라 변경
  - `required-visible` (BOOLEAN) — 필참 Notice 표시 여부 (stage=choose 전용)
- **Nested instances (stage=choose)**:
  - SlotCard (hero variant)
  - Notice (neutral) — 조건부
  - Button × 2 (primary + secondary)
  - Notice (weak) — 프라이버시 안내
- **Nested instances (stage=reason)**:
  - Button × 4 (secondary × 3 + ghost × 1)
  - Notice (weak) — 프라이버시 안내

---

# ResponseSheet

조율 모드에서 여러 슬롯 응답을 입력·수정하는 시트.

## 사용 조건

- **쓴다**: `mode === 'coordination'` + 비호스트
- **쓰지 않는다**:
  - 호스트 → OrganizerSheet
  - 잠정 확정 응답 → ProposalSheet

## 상태 의존성

- `state.mode === 'coordination'` — 라우팅 트리거
- `state.currentUser` (= me) — 응답자 식별
- `state.coord[me]` — 기존 응답 존재 여부 (`isResponded(state, me)`)
- `state.slots` — 응답 대상 슬롯 리스트 (기본 3개 또는 widened 시 다른 세트)
- `CALENDAR_PRESET[me]` — 응답 이력 없을 때 프리셋 초기값

**로컬 상태**:
- `values` (슬롯별 응답 객체, useState)
  - 이미 응답한 사용자: `{ ...state.coord[me] }`로 초기화
  - 신규 사용자: `CALENDAR_PRESET[me]`로 초기화
- `preset = !already` — 파선 보더 표시 여부

**주요 액션**:
- SegButton 변경 → `setValues` (로컬 상태만)
- 저장 → `dispatch({ type: 'COORD_RESPOND', member: me, responses: values })`

## 두 진입 상태

`isResponded(state, me)` 결과에 따라 화면이 미묘하게 다르다.

| 상태 | 판정 | 표시 |
|---|---|---|
| 신규 응답 | `!already` | 타이틀 "가능한 시간을 알려주세요" + 프리셋 Notice + Respond(preset=true) |
| 응답 수정 | `already` | 타이틀 "내 응답 수정하기" + Respond(preset=false) + Notice weak |

**규칙**: 이 분기는 코드에서 자동. 사용자가 명시적으로 선택하지 않는다.

## 실제 구조

```jsx
<>
  <div className="sheet__body">
    <h3 className="sheet__title">
      {already ? '내 응답 수정하기' : '가능한 시간을 알려주세요'}
    </h3>
    {preset && (
      <Notice tone="neutral">
        캘린더 기준으로 미리 채워뒀어요 — 다르면 바꿔주세요. 저장해야 반영돼요.
      </Notice>
    )}
    <div className="sheet__slots">
      {state.slots.map(slot => (
        <SlotCard
          key={slot.id}
          slot={slot}
          variant="respond"
          myValue={values[slot.id]}
          preset={preset}
          onChange={v => setValues(prev => ({ ...prev, [slot.id]: v }))}
        />
      ))}
    </div>
    {already && <Notice tone="weak">일정이 바뀌면 언제든 수정할 수 있어요.</Notice>}
  </div>

  <div className="sheet__footer">
    <Button
      variant="primary"
      full
      disabled={!complete}
      onClick={() => dispatch({ type: 'COORD_RESPOND', member: me, responses: values })}
    >
      {already ? '수정 저장' : '응답 저장'}
    </Button>
  </div>
</>
```

## 완료 검증

```js
const complete = state.slots.every(slot => values[slot.id])
```

**규칙**: 모든 슬롯에 응답이 있어야 저장 버튼 활성화. 하나라도 비어있으면 `disabled`.

## Footer

| 요소 | 컴포넌트 | 역할 |
|---|---|---|
| Primary CTA | Button primary, full | "응답 저장" 또는 "수정 저장" (already에 따라) |

**규칙**: Footer에는 Notice 없음. 저장 버튼만.

## Do / Don't

✅ 두 진입 상태 자동 분기 (신규 응답 / 수정)
✅ 신규 응답 시 프리셋 채워두고 파선 보더로 확인 유도
✅ 모든 슬롯 응답해야 저장 가능 (disabled 처리)
✅ 저장 버튼 텍스트는 상태에 따라 변경 ("응답 저장" / "수정 저장")
✅ 수정 상태(already)에는 하단에 안내 Notice 추가

❌ 신규 응답 시 프리셋 없이 빈 상태로 시작 (캘린더 프리셋으로 채움)
❌ 일부 슬롯만 응답한 채로 저장 허용
❌ 신규/수정 상태를 사용자에게 명시적으로 선택하게 함
❌ 프리셋 확인 Notice 생략 (신규 응답 시 필수)
❌ 저장 버튼을 body에 배치 (Footer 유지)

## Figma 매핑

- **마스터**: `Organisms/Sheet/ResponseSheet`
- **Variants**:
  - `stage = new | edit` (신규 응답 / 수정)
- **Properties**:
  - `title` (TEXT) — stage에 따라 두 문구
  - `save-label` (TEXT) — "응답 저장" 또는 "수정 저장"
- **Nested instances**:
  - Notice (neutral) — stage=new 전용 프리셋 안내
  - SlotCard (respond variant) × N (preset=stage=new)
  - Notice (weak) — stage=edit 전용 하단 안내
  - Button (primary, full) — footer CTA

---

# OrganizerSheet

주최자가 응답 현황을 확인하고 액션(재요청·확정·마감 연장)을 수행하는 시트.

## 사용 조건

- **쓴다**: `currentUser === 'runa'` (호스트) — mode에 따라 두 phase로 자동 분기
- **쓰지 않는다**:
  - 비호스트 → ProposalSheet 또는 ResponseSheet
  - 회의 생성 → ComposeSheet

## 상태 의존성

- `state.currentUser === 'runa'` — 호스트 확인 (Sheet 라우터 레벨)
- `state.mode` — 'proposal'/'proposalEscalated' vs 'coordination' 분기
  - `proposalPhase = state.mode === 'proposal' || state.mode === 'proposalEscalated'`
- `state.proposal` — 각 멤버의 잠정 확정 응답 (proposal phase 매트릭스)
- `state.coord` — 각 멤버의 슬롯 응답 (coordination phase 매트릭스)
- `state.slots` — 후보 슬롯 (coordination phase)
- `state.outMembers` — 마감 후 불참 처리된 멤버
- `state.escalated` — 마감 후 무응답 필참자
- `state.reRequested` — 재요청 여부 (각 멤버별)
- `state.objection` — 비공개 이의 (coordination phase에서 표시)
- `state.phase >= 3` — 마감 이후 상태 (`afterDeadline`)
- `rankedSlots(state)` — 슬롯별 응답 집계 및 정렬

**주요 액션**:
- 재요청 → `dispatch({ type: 'ORG_REREQUEST', member: id })`
- 마감 연장 → `dispatch({ type: 'ORG_EXTEND' })`
- 확정 → `dispatch({ type: 'ORG_CONFIRM', slotId: best.slot.id })`

## 두 Phase 분기

OrganizerSheet 내부에서 `proposalPhase` 값에 따라 다른 화면.

```
OrganizerSheet
├── if (proposalPhase) → 잠정 확정 현황 화면
└── else (coordination) → 응답 현황 매트릭스 화면
```

### Phase 1: 잠정 확정 현황 (proposal / proposalEscalated)

```jsx
<div className="sheet__body">
  <h3 className="sheet__title">잠정 확정 현황</h3>
  <SlotCard slot={PROPOSAL_SLOT} variant="hero" />
  <div className="matrix">
    {MEMBER_IDS.filter(id => id !== 'runa').map(id => (
      <div className="matrix__row" key={id}>
        <Avatar id={id} size="sm" />
        <span className="matrix__name">
          {MEMBERS[id].name}
          <Chip tone={isRequired(state, id) ? 'primary' : 'neutral'}>
            {isRequired(state, id) ? '필참' : '선택'}
          </Chip>
        </span>
        {state.proposal[id] === 'ok' ? (
          <Chip tone="success">확인</Chip>
        ) : isRequired(state, id) ? (
          <Chip tone="warn">확인 대기</Chip>
        ) : (
          <Chip tone="neutral">침묵 = 동의</Chip>
        )}
      </div>
    ))}
  </div>
  <Notice tone="weak">이의가 오면 나에게만 비공개로 전달되고, 후보 조율로 전환돼요.</Notice>
</div>
```

**규칙**:
- Footer 없음 (proposal phase는 액션 대기 상태)
- 각 멤버 행에 Chip 2개: 역할(필참/선택) + 응답 상태(확인/확인 대기/침묵=동의)

### Phase 1 응답 상태 매핑

| 조건 | Chip tone | Chip 텍스트 |
|---|---|---|
| `proposal[id] === 'ok'` | success | "확인" |
| `!proposal[id]` + 필참 | warn | "확인 대기" |
| `!proposal[id]` + 선택 | neutral | "침묵 = 동의" |

### Phase 2: 응답 현황 매트릭스 (coordination)

```jsx
<>
  <div className="sheet__body">
    <h3 className="sheet__title">응답 현황</h3>
    {state.objection && (
      <Notice tone="warn">
        비공개 이의 — {name} · "{reason}"
      </Notice>
    )}
    <div className="matrix matrix--table">
      {/* Header row: 팀원 · 필/선 + 슬롯 헤더 × N */}
      {/* Data rows: 각 멤버의 슬롯별 응답 */}
    </div>
    {afterDeadline && state.escalated.length > 0 && (
      <div className="sheet__escalation">
        {/* 재요청 필요한 필참자들 */}
      </div>
    )}
  </div>
  <div className="sheet__footer">
    <Button variant="primary" full disabled={!canConfirm}>
      1순위로 확정 — {best label}
    </Button>
    {afterDeadline && state.escalated.length > 0 && (
      <>
        <Notice tone="warn">지금 확정하면 무응답 필참자는 '확인 전'으로 표시돼요.</Notice>
        <Button variant="ghost" full onClick={() => dispatch({ type: 'ORG_EXTEND' })}>
          마감 연장하고 기다리기
        </Button>
      </>
    )}
  </div>
</>
```

## Matrix vs Matrix--table

OrganizerSheet는 두 phase에서 다른 매트릭스 스타일을 사용한다.

| Variant | 사용 phase | 레이아웃 | 사용처 |
|---|---|---|---|
| `matrix` (기본) | Proposal | 세로 나열, 행마다 Avatar+이름+Chip×2 | Phase 1 응답 확인 |
| `matrix--table` | Coordination | 표 형태, 슬롯을 열로 나열 | Phase 2 슬롯별 응답 |

### matrix (기본, Proposal용)

```
Row: [Avatar] [이름 + 역할Chip] [응답Chip]
Row: [Avatar] [이름 + 역할Chip] [응답Chip]
...
```

### matrix--table (Coordination용)

```
Header:  [팀원 · 필/선]  [슬롯1]  [슬롯2]  [슬롯3]
Row:     [Avatar 이름 필]  [✓]    [✕]    [–]
Row:     [Avatar 이름 선]  [✓]    [✓]    [불참]
...
```

## Matrix Cell 상태 (Phase 2)

각 셀은 `state.coord[id]?.[slot.id]` 값에 따라 렌더.

| 값 | 클래스 | 표시 | 스타일 |
|---|---|---|---|
| `'ok'` | `matrix__cell--ok` | ✓ | `success/weak` bg, `success/default` text, bold |
| `'hard'` | `matrix__cell--hard` | ✕ | `danger/weak` bg, `danger/default` text, bold |
| `undefined` + out | `matrix__cell--none` | "불참" | `surface/sub/default` bg |
| `undefined` + not out | `matrix__cell--none` | – | `surface/sub/default` bg |

## Matrix Role 배지 (matrix--table 전용)

멤버 이름 옆에 필/선 마커를 원형 배지로 표시.

| 상태 | 클래스 | 표시 | 스타일 |
|---|---|---|---|
| 필참 | `matrix__role matrix__role--req` | 필 | `primary/weak` bg, `primary/default` text |
| 선택 | `matrix__role` | 선 | `surface/sub/default` bg, `line/default` border |

**규칙**:
- 크기 20×20px 정원
- Chip 대신 이 마커 사용 (행 두께 최소화)
- `matrix--table`에서만. 기본 `matrix`는 Chip 사용

## Sticky 팀원 열 (matrix--table)

`matrix--table`에서는 좌측 팀원 열이 sticky.

```css
.matrix--table .matrix__name {
  width: 100px;
  position: sticky;
  left: 0;
  background: surface/default;
  z-index: 1;
}
```

**이유**: 슬롯이 많아 가로 스크롤될 때 팀원 이름이 계속 보이도록.

## Escalation 영역 (afterDeadline + escalated)

마감 후 무응답 필참자에게 재요청할 수 있는 영역.

### 실제 구조

```jsx
{afterDeadline && state.escalated.length > 0 && (
  <div className="sheet__escalation">
    {state.escalated.map(id => (
      <div className="matrix__row" key={id}>
        <span className="matrix__name">
          <Avatar id={id} size="sm" /> {MEMBERS[id].name} — 필참인데 마감까지 무응답이에요
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={state.reRequested[id]}
          onClick={() => dispatch({ type: 'ORG_REREQUEST', member: id })}
        >
          {state.reRequested[id] ? '다시 요청함' : '다시 요청'}
        </Button>
      </div>
    ))}
    <Notice tone="weak">
      다시 요청은 1회만 보낼 수 있어요 — "회의 확정에 응답만 남았어요"로 전달돼요.
    </Notice>
  </div>
)}
```

### 스펙

| 속성 | 값 |
|---|---|
| 컨테이너 (`sheet__escalation`) | `surface/sub/default` bg, `radius-md`, padding `space-3`, gap `space-2` |
| 행 (`matrix__row`) | Avatar + 이름 + 안내 문구 + Button |
| Button | secondary sm, 1회만 활성 (`disabled={state.reRequested[id]}`) |
| Notice | weak, 재요청 규칙 안내 |

**규칙**: 각 필참자당 재요청 1회만 허용 (`state.reRequested[id]`가 true면 disabled).

## Footer (Phase 2 전용)

### 기본 Footer

```jsx
<Button variant="primary" full disabled={!canConfirm}>
  1순위로 확정 — {best.slot.day} {best.slot.time.slice(0, 5)} (가능 {best.ok}명)
</Button>
```

**Confirm 조건**: `canConfirm = best && best.ok > 0` — 1순위 슬롯에 최소 1명 응답자 있어야 활성

### afterDeadline + escalated 추가 요소

기본 Footer 아래에 조건부로 추가:

```jsx
<Notice tone="warn">지금 확정하면 무응답 필참자는 '확인 전'으로 표시돼요.</Notice>
<Button variant="ghost" full onClick={() => dispatch({ type: 'ORG_EXTEND' })}>
  마감 연장하고 기다리기
</Button>
```

**규칙**: 마감 연장은 필참 무응답이 있을 때만 제공되는 대안 액션.

## Phase별 렌더 요약

### Phase 1 (Proposal / ProposalEscalated)

```
[Title] 잠정 확정 현황
[SlotCard hero] PROPOSAL_SLOT
[Matrix]
  ├─ Avatar + 이름 + 필/선Chip + 응답Chip
  └─ ... (runa 제외 5명)
[Notice weak] 이의 안내
```

- Footer 없음
- 액션 없음 (관찰만)

### Phase 2 (Coordination)

```
[Title] 응답 현황
[Notice warn] 비공개 이의 (있을 때만)
[Matrix--table]
  ├─ Header: 팀원·필/선 + 슬롯 헤더 × N
  └─ Row × 6 (전원, 각 슬롯별 셀)
[Escalation] (마감 후 + 무응답 필참 있을 때)
  ├─ Row × N: Avatar + 안내 + 다시 요청 Button
  └─ Notice weak: 재요청 규칙
[Footer]
  ├─ Button primary: 1순위로 확정
  └─ (조건부) Notice warn + Button ghost: 마감 연장
```

## Do / Don't

✅ Phase에 따라 자동 분기 (proposal / coordination)
✅ Phase 1: 매트릭스는 단순 리스트 (세로 나열)
✅ Phase 2: matrix--table로 슬롯을 가로 배치
✅ Phase 2 sticky 팀원 열 유지 (가로 스크롤 대비)
✅ 재요청은 필참자당 1회만 (disabled 처리)
✅ 확정 조건 검증 (best 응답자 최소 1명)
✅ 마감 연장 옵션은 필참 무응답 있을 때만 제공

❌ Phase 1에서 slot별 응답 매트릭스 표시 (Proposal은 단일 시간)
❌ Phase 2에서 Chip으로 응답 상태 표현 (셀 색상으로)
❌ 재요청 버튼을 여러 번 활성 상태로 유지
❌ 확정 버튼을 항상 활성 (canConfirm 조건 준수)
❌ Runa(주최자)를 필참자 Escalation에 포함
❌ Phase 1에 Footer 추가 (관찰만 하는 화면)

## Figma 매핑

- **마스터**: `Organisms/Sheet/OrganizerSheet`
- **Variants**:
  - `phase = proposal | coordination`
  - `after-deadline = false | true` (coordination phase 전용)
- **Properties**:
  - `title` (TEXT) — phase별 다른 값
  - `objection-visible` (BOOLEAN) — coordination phase 전용
  - `escalation-visible` (BOOLEAN) — coordination + after-deadline 전용
  - `canConfirm` (BOOLEAN) — Confirm 버튼 disabled 여부
  - `best-label` (TEXT) — Confirm 버튼 안 슬롯 정보
- **Nested instances (proposal)**:
  - SlotCard (hero)
  - MatrixRow × 5 (Avatar + 이름 + Chip × 2)
  - Notice (weak)
- **Nested instances (coordination)**:
  - Notice (warn) — objection
  - MatrixTable Header + Rows
  - Escalation 영역 (조건부)
  - Button (primary, full) — footer
  - Notice (warn) + Button (ghost, full) — after-deadline 전용

---

## Sheet 간 관계와 라우팅

Sheet 래퍼가 4개 서브 시트를 라우팅. 사용자는 개별 시트를 직접 선택할 수 없다.

### 라우팅 우선순위

```
1. state.mode === 'compose'
   → ComposeSheet (호스트 전용 진입, 실제로는 mode 자체가 호스트만 발생)

2. isHost === true (state.currentUser === 'runa')
   → OrganizerSheet
     └─ proposalPhase에 따라 내부 분기 (Phase 1 / Phase 2)

3. mode === 'proposal' || 'proposalEscalated'
   → ProposalSheet

4. 기본값 (mode === 'coordination')
   → ResponseSheet
```

**규칙**: 이 우선순위는 코드에 하드코딩. 임의 변경 시 오작동.

### Sheet 트리거 소스

Sheet를 여는 진입점:

| 진입 | 트리거 |
|---|---|
| 버블 액션 버튼 | Button onClick → `dispatch({ type: 'SHEET', open: true })` |
| Board (현황판) 클릭 | `.board` onClick → 동일 dispatch |
| SlotCard tally 클릭 | 각 카드의 onClick → 동일 dispatch |
| Push banner 클릭 | 배너 onClick → 동일 dispatch |
| PinBar 클릭 | 스크롤 이동만 (Sheet 안 엶) |

**규칙**: 모든 진입점이 동일한 `SHEET open: true` 액션을 dispatch. Sheet 내부 라우팅이 컨텍스트를 결정.

## Non-negotiable rules (전체 Sheet)

### 1. 4개 서브 시트만 존재
ComposeSheet / ProposalSheet / ResponseSheet / OrganizerSheet 외 서브 시트를 만들지 않는다.

### 2. Sheet 래퍼가 유일한 진입점
외부에서 개별 시트를 직접 렌더하지 않는다. 항상 `<Sheet />`를 통해.

### 3. Body/Footer 구조 준수
콘텐츠는 `sheet__body` 안에, 주요 CTA는 `sheet__footer`에 분리. Footer가 필요 없는 시트(ProposalSheet, OrganizerSheet Phase 1)는 Footer 자체를 렌더하지 않는다.

### 4. sheet--tall은 ComposeSheet 전용
다른 시트에 `sheet--tall` variant를 적용하지 않는다. Compose의 필드 편집을 위한 예외.

### 5. Dim 클릭으로만 닫힘
명시적 X 버튼 없음. Dim 클릭이 유일한 닫기 액션.

### 6. 라우팅은 mode + isHost 조합
개별 시트의 사용 조건은 이 두 값의 조합으로만 결정. 사용자가 시트를 선택하지 않는다.

### 7. 로컬 상태는 시트 안에서만
`editing`, `objecting`, `values`, `req` 같은 로컬 상태는 각 시트 안에서 useState로 관리. 전역 상태(store)를 오염시키지 않는다.

### 8. 저장/확정은 명시적 dispatch
Sheet 안의 편집은 로컬 상태에서만 발생. 반드시 명시적 액션 버튼 클릭 시 dispatch 발생.

### 9. Sheet 오픈 시 상태 유지
Sheet를 열었다 닫아도 store 상태는 유지. 다시 열면 이전 로컬 상태는 초기화되지만 store 값으로 다시 계산.

### 10. 매트릭스 어휘 준수
- Phase 1은 `matrix` (세로 리스트)
- Phase 2는 `matrix--table` (표)
- 두 어휘를 섞지 않는다

## Common mistakes to avoid

❌ 개별 서브 시트를 직접 렌더 (`<ComposeSheet />` 외부에서)
✅ `<Sheet />` 래퍼를 통해서만 마운트

❌ Sheet에 명시적 닫기 버튼 추가
✅ Dim 클릭이 유일한 닫기. Grab handle도 시각 어포던스만

❌ ComposeSheet 외 시트에 `sheet--tall` 적용
✅ `sheet--tall`은 Compose 전용

❌ 여러 필드를 동시 편집 상태로 표시 (ComposeSheet)
✅ `editing` 로컬 state로 배타적 관리 — 한 번에 하나

❌ ProposalSheet에서 '괜찮아요' 후 사유 화면 표시
✅ ok는 즉시 dispatch 완료. objection만 사유 선택 화면으로 전환

❌ ResponseSheet 신규 응답 시 빈 상태로 시작
✅ 항상 `CALENDAR_PRESET[me]`로 프리셋 + 파선 보더 표시

❌ ResponseSheet 부분 응답으로 저장 허용
✅ `complete` 검증. 모든 슬롯 응답 시에만 활성

❌ OrganizerSheet Phase 1에서 Footer + 확정 버튼 표시
✅ Phase 1은 관찰만. Footer 없음

❌ OrganizerSheet Phase 2에서 매트릭스를 세로 리스트로 렌더
✅ `matrix--table` 사용. 슬롯을 열로 배치

❌ 재요청 버튼을 여러 번 누를 수 있게 유지
✅ `state.reRequested[id]` 확인 → 1회 사용 후 disabled

❌ Sheet 내부에서 채팅방 상태를 직접 조작 (사이드 이펙트)
✅ 명시적 dispatch 액션만 사용

❌ ProposalSheet의 사유 옵션을 자유 텍스트로 대체
✅ `OBJECTION_REASONS` 3개 + "사유 없이 보내기" 4개 버튼 고정

❌ MatrixRow의 필참 라벨을 다른 문구로 변경 (예: "필수"/"선택사항")
✅ "필참"/"선택 참석" 고정 어휘 유지

❌ Sheet 헤더에 뒤로가기·닫기 아이콘 추가
✅ Grab handle만 유지. 헤더 별도 없음

❌ Escalation 영역을 Footer에 배치
✅ Escalation은 body 안에. Footer는 확정 CTA 전용

❌ afterDeadline이 아닌데 마감 연장 옵션 노출
✅ `afterDeadline && escalated.length > 0`일 때만