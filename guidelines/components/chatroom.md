# ChatRoom

Mod U의 최상위 화면 셸. 사내 메신저의 팀 채팅방을 시뮬레이션하며, 회의 확정 플로우의 모든 요소가 이 안에서 일어난다.

## 정본과 참조 관계

- 코드 정본: `src/components/ChatRoom.jsx`
- Figma 정본: `Organisms/ChatRoom`
- 상세 문서: `docs/design-system/organisms/chatroom.md`

## 최상위 원칙: 하나의 공간

**IMPORTANT**: 요청·현황·확정이 모두 이 방의 버블 안에서 일어난다. 별도 화면(모달·풀스크린)으로 이동하지 않는다. 이 원칙은 `Guidelines.md`의 Product logic 규칙과 정합.

- 시스템 메시지(SchedulingBubble)는 채팅방 안의 중앙 카드로 게시됨
- Sheet도 채팅방 위에 오버레이로 오픈됨 (별도 페이지 아님)
- 푸시 알림은 상단 배너로 채팅방 안에 삽입됨

## 채팅방 셸의 구조

```
Phone (iPhone 16 Pro 프레임)
├── Notch (Dynamic Island)
├── Header (chat__header)
│   ├── IconBack
│   ├── Title (chat__title) — "우리팀" + 인원수
│   └── IconSettings
├── PushBanner (조건부, 최상단 오버레이)
├── PinBar (조건부, 확정 전 고정 링크)
├── Main Scroll (chat__scroll)
│   ├── Date divider (chat__date)
│   ├── INTRO_MESSAGES × N (Message 컴포넌트)
│   ├── SchedulingBubble (시스템 명의 중앙 카드)
│   └── TRAILING_MESSAGES × N (Message 컴포넌트)
├── HintBar (조건부, 테스터 힌트)
├── Input Footer (chat__input)
│   ├── Placeholder text
│   └── IconSend
└── Sheet (조건부 오버레이)
```

**규칙**: 이 구조가 채팅방의 유일한 레이아웃이다. 요소 추가·제거·순서 변경 금지.

## 상태 의존성

- `state.mode` — 여러 조건 판단의 기준
- `state.currentUser` (= me) — 현재 시점의 사용자
- `state.hintOn` — HintBar 표시 여부
- `state.sheetOpen` — Sheet 마운트 여부 (Sheet 컴포넌트가 내부에서 판단)

**로컬 계산**:
- `banner = bannerFor(state)` — 타겟 푸시 배너 결정
- `composing = state.mode === 'compose'` — 회의 생성 전 상태
- `hint = state.hintOn && mode !== 'confirmed' ? (composing ? COMPOSE_HINT : HINTS[state.phase]) : null`

**주요 액션**:
- Banner 클릭 → `dispatch({ type: 'SHEET', open: true })`
- PinBar 클릭 → 스크롤 이동 (Sheet 안 엶)
- HintBar 숨기기 → `dispatch({ type: 'TOGGLE_HINT' })`

---

# Phone 프레임

전체 채팅방을 감싸는 폰 프레임. iPhone 16 Pro 규격.

## 스펙

| 속성 | 값 |
|---|---|
| 크기 | 402 × 874px |
| 배경 | `bg/default` (앱 배경) |
| 외곽 radius | 38px (기기 규격 예외) |
| 보더 | 5px solid `black` (얇은 베젤) |
| 그림자 | 폰 프레임 전용 이중 shadow (예외 목록 참조) |
| Overflow | hidden |
| Position | relative |

**규칙**: 폰 프레임의 radius(38px)와 shadow는 기기 규격 예외로 다른 컴포넌트에서 재현하지 않는다.

## Dynamic Island

폰 상단 중앙의 검은 pill.

| 속성 | 값 |
|---|---|
| 위치 | `top: 12px`, `left: 50%`, translateX(-50%) |
| 크기 | 126 × 37px |
| 배경 | `black` |
| Radius | `radius-full` (pill) |
| z-index | 30 |

**규칙**:
- 노치가 아닌 Dynamic Island 규격. 구형 노치(120×24) 재현 금지
- 채팅 헤더는 이 영역을 피해 `padding-top: 54px`로 배치

---

# Chat Header

폰 프레임 상단의 채팅방 헤더.

## 실제 구조

```jsx
<header className="chat__header">
  <IconBack />
  <div className="chat__title">
    <b>우리팀</b> <span className="chat__count">6</span>
  </div>
  <button type="button" className="chat__settings" aria-label="채팅방 설정">
    <IconSettings />
  </button>
</header>
```

## 스펙

| 속성 | 값 |
|---|---|
| Padding | `54px space-4 space-3` (상: Dynamic Island 회피) |
| 배경 | `surface/default` |
| 하단 보더 | 1px `line/default` |
| Layout | flex row, gap `space-3`, align center |

## 내부 요소

| 요소 | 컴포넌트 | 스타일 |
|---|---|---|
| Back 아이콘 | IconBack (24px) | `text/sub/default` 상속 |
| Title (`chat__title`) | 텍스트 | `text-lg` regular, flex:1 |
| 팀명 (`b`) | 인라인 강조 | 부모 텍스트 스타일 상속 |
| 인원수 (`chat__count`) | 텍스트 | `text/weak/default`, margin-left 2px |
| Settings 아이콘 | IconSettings (20px) | `text/sub/default`, hover 시 `text/default` |

**고정 텍스트**: "우리팀" + "6" (6명 팀 시나리오)

## Do / Don't (Header)

✅ 3개 요소 배치 (Back / Title / Settings)
✅ 팀명은 `<b>` 강조, 인원수는 옆에 작게
✅ Padding-top 54px로 Dynamic Island 회피
✅ Settings는 aria-label 필수

❌ 5개 이상 아이콘 배치 (Back·Settings 외 추가 금지)
❌ Title에 프로필 이미지·상태 표시 추가
❌ 인원수를 굵기 강조 (부수 정보로 유지)

---

# Push Banner (타겟 푸시)

채팅방 상단에 조건부로 표시되는 시스템 푸시 알림.

## 사용 조건

`bannerFor(state)` 함수가 반환하는 값이 있을 때만 렌더. 없으면 렌더 안 함.

**핵심 원칙**: 응답을 마친 사람에게는 배너가 표시되지 않는다. 타겟 푸시.

## bannerFor 로직

```js
// 요약: 각 mode + 사용자 상태 조합별로 다른 배너 문구

if (mode === 'confirmed' || mode === 'compose') return null;

// proposalEscalated + 필참 미응답 (비호스트)
if (mode === 'proposalEscalated' && isRequired(me) && me !== 'runa' && !proposal[me])
  return { text: '다음 주 회의 확정에 {name}님 확인만 남았어요', cta: '확인하기' };

// coordination/noslot + 재요청 받음 + 미응답
if ((mode === 'coordination' || mode === 'noslot') && me !== 'runa') {
  if (reRequested[me] && !isResponded(me))
    return { text: '다음 주 회의 확정에 {name}님 응답만 남았어요', cta: '바로 응답' };

  if (phase === 2 && !isResponded(me) && !outMembers.includes(me))
    return { text: '오늘 18:00 마감 — 다음 주 회의 시간 응답이 아직이에요', cta: '응답하기' };
}

// 호스트 전용 배너
if (me === 'runa') {
  if (mode === 'noslot') return { text: '모두 가능한 시간이 없어요 — 조건을 조정해보세요', cta: '보기' };
  if (phase >= 3 && escalated.length > 0) return { text: '필참자 {names}님이 마감까지 응답하지 않았어요', cta: '처리하기' };
  if (mode === 'coordination' && phase <= 1 && objection) return { text: '비공개 이의가 도착해 일정을 다시 조율해요', cta: '현황 보기' };
}
```

**규칙**:
- 배너 표시 대상은 코드가 자동 결정
- 응답 완료·불참·마감 처리된 상태는 배너 없음
- 호스트와 비호스트가 다른 배너를 봄

## 실제 구조

```jsx
{banner && (
  <button
    type="button"
    className="push"
    onClick={() => dispatch({ type: 'SHEET', open: true })}
  >
    <span className="push__app">모두의 시간</span>
    <span className="push__text">{banner.text}</span>
    <span className="push__cta">{banner.cta}</span>
  </button>
)}
```

## 스펙

| 속성 | 값 |
|---|---|
| Position | `absolute`, top 40px, left/right 12px |
| z-index | 40 |
| 배경 | `overlay` (반투명 오버레이) |
| 텍스트 | `text/inverse` |
| Padding | `space-3 space-4` |
| Radius | `radius-lg` |
| Shadow | `shadow-banner` |
| Layout | flex row, gap `space-2`, align center |
| 애니메이션 | 상단에서 슬라이드 다운 (`pushIn` keyframe) |

## 내부 요소

| 요소 | 스타일 | 토큰 |
|---|---|---|
| App 라벨 (`push__app`) | `text-xs` semibold | `primary/dark` (다크 배경 위 강조) |
| 본문 (`push__text`) | `text-sm`, flex:1 | `text/inverse` 상속 |
| CTA 배지 (`push__cta`) | `text-xs` semibold, `radius-full` pill, `primary/default` bg | `text/inverse` |

## 클릭 액션

전체 배너 영역이 button. 클릭 시 Sheet 오픈.

**규칙**: 배너의 어느 부분을 클릭해도 동일한 액션. CTA 배지에 별도 이벤트 없음.

## Do / Don't (PushBanner)

✅ `bannerFor(state)` 조건에 따라 자동 표시
✅ 응답 완료자에게는 표시 안 함 (타겟 푸시)
✅ 전체 영역이 클릭 가능한 button
✅ 다크 오버레이 위 흰 텍스트로 시각 대비 강조

❌ 여러 배너를 동시 표시 (한 번에 하나만)
❌ 배너 클릭 시 다른 화면으로 이동 (Sheet 오픈만)
❌ 응답 완료자에게도 표시 (타겟 원칙 위반)
❌ 명시적 닫기 버튼 추가 (Sheet 열면 자동 갱신)

---

# PinBar

확정 전까지 스케줄링 버블에 대한 스크롤 접근을 유지하는 상단 고정 바.

## 사용 조건

- **쓴다**: `!composing && state.mode !== 'confirmed'`
  - 즉, 회의 생성 중이 아니고 아직 최종 확정 전
- **쓰지 않는다**:
  - `composing === true` (회의 만들기 진행 중)
  - `state.mode === 'confirmed'` (최종 확정 완료)

**목적**: 대화가 이어져 스케줄링 버블이 위로 밀려 올라가도, 사용자가 언제든 버블로 돌아갈 수 있게 하는 앵커. "제안이 대화에 밀려 침묵을 낳는 문제"에 대한 안전장치.

## 실제 구조

```jsx
{!composing && state.mode !== 'confirmed' && (
  <button
    type="button"
    className="pinbar"
    onClick={() =>
      document.getElementById('scheduling-bubble')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  >
    <IconPin />
    <span className="pinbar__text">
      {state.meeting.title} — {mode === 'coordination' || mode === 'noslot' ? '조율 중' : '확인 대기'}
    </span>
    <span className="pinbar__cta">보기</span>
  </button>
)}
```

## 스펙

| 속성 | 값 |
|---|---|
| 배경 | `primary/weak` |
| 텍스트 | `primary/default` |
| 폰트 | `text-sm` semibold |
| Padding | `space-2 space-4` |
| 하단 보더 | 1px `line/default` |
| Layout | flex row, gap `space-2`, justify space-between |
| Radius | 없음 (flat bar) |

## 내부 요소

| 요소 | 컴포넌트 | 스타일 |
|---|---|---|
| Pin 아이콘 | IconPin (14px) | `primary/default` 상속, flex-shrink 0 |
| 본문 (`pinbar__text`) | 텍스트 | `text-sm` semibold, flex:1, ellipsis |
| CTA (`pinbar__cta`) | 텍스트 | `text-xs`, `text/sub/default`, flex-shrink 0 |

## 본문 텍스트 조합

```
{meeting.title} — {상태 텍스트}
```

**상태 텍스트 매핑**:
| state.mode | 텍스트 |
|---|---|
| `'coordination'` | "조율 중" |
| `'noslot'` | "조율 중" |
| 그 외 (proposal, proposalEscalated) | "확인 대기" |

## 클릭 액션

Sheet를 열지 않고 **스크롤 이동만** 수행:

```js
document.getElementById('scheduling-bubble')?.scrollIntoView({
  behavior: 'smooth',
  block: 'center',
})
```

**규칙**: PinBar는 Sheet 오픈 트리거가 아니다. 스크롤 앵커 역할. 이는 Push Banner와 다른 동작.

## Do / Don't (PinBar)

✅ 확정 전 상태에만 렌더 (`mode !== 'confirmed'`)
✅ Compose 중에는 렌더 안 함 (`composing === true`)
✅ 클릭 시 버블로 스크롤 이동만
✅ 텍스트 오버플로우는 ellipsis 처리
✅ Pin 아이콘 + 텍스트 + CTA 3분할 유지

❌ PinBar 클릭 시 Sheet 오픈 (스크롤만)
❌ Confirmed 상태에서 표시 (플로우 종료 후 불필요)
❌ 여러 개 나열 (한 번에 하나)
❌ 명시적 닫기 버튼 추가
❌ 상태 텍스트를 다른 문구로 변경 ("진행 중", "대기 중" 등 금지)

---

# Main Scroll

채팅방 메시지 영역. 스크롤 가능한 본문.

## 실제 구조

```jsx
<main className="chat__scroll">
  <div className="chat__date">{TODAY_LABEL}</div>

  {INTRO_MESSAGES.map((m, i) => (
    <Message key={i} from={m.from} me={state.currentUser}>{m.text}</Message>
  ))}

  {composing ? (
    state.currentUser === 'runa' && (
      <div className="chat__msg--center">
        <SchedulingBubble />
      </div>
    )
  ) : (
    <>
      <div className="chat__msg--center" id="scheduling-bubble">
        <SchedulingBubble />
      </div>
      {TRAILING_MESSAGES.map((m, i) => (
        <Message key={`t${i}`} from={m.from} me={state.currentUser}>{m.text}</Message>
      ))}
    </>
  )}
</main>
```

## 스펙

| 속성 | 값 |
|---|---|
| flex | 1 (헤더와 푸터 사이 나머지 공간) |
| Overflow-y | auto (스크롤 가능) |
| Padding | `space-4 space-4 space-6` |
| Layout | 세로 나열 (요소별로 margin-bottom `space-4`) |

## 콘텐츠 순서

**규칙**: 반드시 아래 순서로 렌더. 임의 변경 금지.

```
1. Date divider — TODAY_LABEL ("2025년 1월 24일 금요일" 등)
2. INTRO_MESSAGES × N — 사전 대화 (data.js에 정의된 메시지)
3. SchedulingBubble — 시스템 명의 중앙 카드
4. TRAILING_MESSAGES × N — 사후 대화 (composing 아닐 때만)
```

## composing 상태의 특수 처리

`composing === true` (`state.mode === 'compose'`)일 때:

| 조건 | 표시 |
|---|---|
| `currentUser === 'runa'` (호스트) | INTRO 메시지 + SchedulingBubble (ComposeCard 렌더됨) |
| 비호스트 | INTRO 메시지만 (SchedulingBubble 및 TRAILING 없음) |

**규칙**: Compose 단계는 아직 채팅방에 게시되지 않은 상태. 호스트만 자신의 시점에서 시작 카드를 본다.

## SchedulingBubble 배치

시스템 명의 카드는 `chat__msg--center` div로 감싼다.

```jsx
<div className="chat__msg--center" id="scheduling-bubble">
  <SchedulingBubble />
</div>
```

**규칙**:
- `id="scheduling-bubble"`은 PinBar의 스크롤 앵커. 반드시 유지
- Composing 시에는 id 없음 (아직 게시 안 됨)
- `chat__msg--center` 컨테이너로 중앙 정렬 (좌우 아바타 없음)

## Date Divider

날짜 구분선.

| 속성 | 값 |
|---|---|
| 텍스트 | `TODAY_LABEL` (data.js에서 import) |
| 정렬 | center |
| 폰트 | `text-xs` regular |
| 색 | `text/weak/default` |
| Margin | bottom `space-4` |

**규칙**: 하나의 채팅방에는 하나의 date divider (오늘 날짜만). 여러 날짜 구분은 미지원.

---

# Message (일반 채팅 말풍선)

INTRO / TRAILING 메시지를 렌더하는 서브 컴포넌트. 일반 팀원 간 채팅.

## 실제 구조

```jsx
function Message({ from, me, children }) {
  const mine = from === me;
  return (
    <div className={`chat__msg ${mine ? 'chat__msg--mine' : ''}`}>
      {!mine && <Avatar id={from} size="sm" />}
      <div className="chat__msgbody">
        {!mine && <span className="chat__name">{MEMBERS[from].name}</span>}
        <div className={`chat__text ${mine ? 'chat__text--mine' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | 설명 |
|---|---|---|
| `from` | string | 발신자 멤버 ID |
| `me` | string | 현재 사용자 ID |
| `children` | ReactNode | 메시지 내용 |

## Mine vs Not-Mine 렌더

`mine = from === me` 판정에 따라 완전히 다른 레이아웃.

### Not-Mine (다른 사람 메시지, 좌측 정렬)

```
[Avatar sm] [이름 라벨]
            [말풍선 (좌상단 뾰족)]
```

- 좌측에 Avatar 표시
- 위에 발신자 이름
- 말풍선 좌상단 4px 뾰족 (`4px 16px 16px 16px`)
- 배경 `surface/default`

### Mine (내 메시지, 우측 정렬)

```
                       [말풍선 (우상단 뾰족)]
```

- Avatar·이름 없음
- 우측 정렬 (flex-direction row-reverse)
- 말풍선 우상단 4px 뾰족 (`16px 4px 16px 16px`)
- 배경 `primary/weak`

## 스펙

| 요소 | 스타일 | 토큰 |
|---|---|---|
| `chat__msg` | flex row, gap `space-2`, align flex-start | — |
| `chat__msg--mine` | flex-direction row-reverse | — |
| `chat__msgbody` | max-width 82%, grid, gap `space-1` | — |
| `chat__name` | `text-xs` | `text/sub/default` |
| `chat__text` | `text-md`, line-height 1.45, padding 10px 14px | `surface/default` bg, `shadow-card` |
| `chat__text--mine` | 위와 동일 + 배경 | `primary/weak` bg |

## Margin

메시지 간 간격은 부모 `chat__scroll`의 요소별 `margin-bottom: space-4`로 처리.

## Do / Don't (Message)

✅ Mine 판정으로 좌/우 정렬 자동 결정
✅ Not-mine에만 Avatar + 이름 라벨 표시
✅ 말풍선 뾰족 모서리로 방향성 표현 (4px 뾰족)
✅ Mine은 `primary/weak` 배경으로 시각 구분

❌ Mine 메시지에 Avatar 표시
❌ 좌우 대칭 레이아웃 (mine과 not-mine을 같은 정렬로)
❌ 말풍선 4면 모두 라운드 (뾰족 모서리 유지)
❌ 이름 라벨을 mine에 표시

---

# HintBar

테스터용 힌트 표시 바. 프로덕트 화면 밖의 시연 보조 요소.

## 사용 조건

- **쓴다**: `state.hintOn === true` && `state.mode !== 'confirmed'`
- **쓰지 않는다**:
  - 힌트 숨김 처리 (`hintOn === false`)
  - 최종 확정 상태

## 실제 구조

```jsx
{hint && (
  <div className="hintbar">
    <span>
      <em className="hintbar__badge">TIP</em> {hint}
    </span>
    <button type="button" onClick={() => dispatch({ type: 'TOGGLE_HINT' })}>
      숨기기
    </button>
  </div>
)}
```

## 스펙

| 속성 | 값 |
|---|---|
| 배경 | `warn/weak` |
| 텍스트 | `warn/text/strong` |
| 폰트 | `text-sm` |
| Padding | `space-2 space-4` |
| Line-height | 1.4 |
| Layout | flex row, gap `space-2`, justify space-between, align center |

## 힌트 내용 결정

```js
const hint = state.hintOn && state.mode !== 'confirmed'
  ? (composing ? COMPOSE_HINT : HINTS[state.phase])
  : null
```

| 조건 | 힌트 내용 |
|---|---|
| `composing === true` | `COMPOSE_HINT` (data.js) |
| 그 외 | `HINTS[state.phase]` (data.js, phase 0~3별로 다름) |

**규칙**: 힌트 문구는 data.js에 하드코딩. 컴포넌트에서 수정하지 않는다.

## 내부 요소

### TIP 배지 (`hintbar__badge`)

| 속성 | 값 |
|---|---|
| 배경 | `#8a5a00` (Hex 직접 사용 — foundations/color.md의 유일한 예외) |
| 텍스트 | `warn/weak` |
| 폰트 | `text-xs` bold, 자간 0.6px |
| Padding | `0 space-2` |
| Line-height | 16px |
| Radius | `radius-full` (pill) |
| Font-style | normal (em 태그의 italic 취소) |

**IMPORTANT**: TIP 배지 배경 `#8a5a00`은 `foundations/color.md`의 명시된 예외. 새 컴포넌트에서 재현하지 않는다.

### 숨기기 버튼

| 속성 | 값 |
|---|---|
| 폰트 | `text-xs` |
| 텍스트 | `warn/text/strong` |
| Text-decoration | underline |
| Flex-shrink | 0 |
| 액션 | `dispatch({ type: 'TOGGLE_HINT' })` |

## Do / Don't (HintBar)

✅ 테스터 힌트 전용 (프로덕트 어휘 아님)
✅ 숨기기 버튼으로 사용자 제어 가능
✅ TIP 배지로 시각 강조
✅ Confirmed 상태에는 렌더 안 함

❌ 프로덕트 알림·안내로 재사용 (Notice로 처리)
❌ 힌트 문구를 컴포넌트에서 하드코딩 (data.js에서만)
❌ TIP 배지 배경색을 다른 곳에서 재현
❌ 여러 힌트 동시 표시 (phase별 하나만)

---

# Chat Input (Footer)

채팅 입력창. 시각적 요소만, 실제 입력 기능 없음.

## 실제 구조

```jsx
<footer className="chat__input">
  <span>메시지 보내기…</span>
  <IconSend />
</footer>
```

## 스펙

| 속성 | 값 |
|---|---|
| 배경 | `surface/default` |
| 상단 보더 | 1px `line/default` |
| Padding | `space-3 space-4 28px` (하: 홈 인디케이터 회피 예외) |
| 색 | `text/weak/default` |
| 폰트 | `text-md` |
| Layout | flex row, justify space-between, align center |

## 내부 요소

| 요소 | 스타일 | 토큰 |
|---|---|---|
| Placeholder 텍스트 | "메시지 보내기…" 고정 | `text/weak/default` |
| Send 아이콘 | IconSend (20px) | `text/weak/default` 상속 |

**규칙**:
- Placeholder 텍스트는 고정 (편집 기능 없음)
- Send 아이콘은 시각 요소만 (클릭 액션 없음)
- Mod U는 스케줄링 시뮬레이션이므로 실제 채팅 입력은 미구현

## Do / Don't (Input)

✅ 시각적 어포던스만 (실제 입력 없음)
✅ 홈 인디케이터 회피를 위해 padding-bottom 28px
✅ Placeholder 문구 고정

❌ 실제 입력 처리 로직 추가 (시뮬레이션 범위 밖)
❌ Send 아이콘에 클릭 액션 (시각 요소로만)
❌ Padding-bottom을 다른 값으로 변경 (홈 인디케이터 규격)

---

# Sheet 마운트

`<Sheet />` 컴포넌트는 ChatRoom 최하단에 배치. 내부에서 `state.sheetOpen` 확인 후 조건부 렌더.

```jsx
<Sheet />
```

**규칙**: Sheet는 항상 ChatRoom 안에 마운트. 외부 배치 금지. Sheet 자체가 조건부 렌더를 처리하므로 ChatRoom 레벨에서 조건 검사 안 함.

상세: `components/sheet.md`

---

## ChatRoom 조립 규칙

### Uses

- `Phone` 프레임 (`.phone`)
- IconBack, IconSettings, IconSend, IconPin (`primitives.md § icons`)
- Avatar (Message 컴포넌트 내부)
- `SchedulingBubble` (`bubbles.md`)
- `Sheet` (`sheet.md`)
- Message (내부 서브 컴포넌트)

### Used by

- App.jsx (최상위 라우팅)

### 배치 순서

세로 순서를 고정한다:

1. **Phone Notch** (Dynamic Island)
2. **Header**
3. **PushBanner** (조건부, absolute position이지만 논리적 위치)
4. **PinBar** (조건부)
5. **Main Scroll**
6. **HintBar** (조건부)
7. **Input Footer**
8. **Sheet** (조건부 오버레이)

**규칙**: 이 순서는 코드 구조와 시각 레이어를 일치시킨다. 임의 변경 금지.

## 시점 전환 규칙

`state.currentUser` 값이 바뀌면 ChatRoom 전체가 재렌더된다. 각 요소가 어떻게 반응하는지:

| 요소 | 시점 전환 시 반응 |
|---|---|
| Header | 변화 없음 (팀 정보 고정) |
| PushBanner | `bannerFor(state)` 재계산 → 다른 배너 또는 없음 |
| PinBar | 변화 없음 (state.mode 기준) |
| Main Scroll | Message의 mine 판정 재계산 → 정렬 방향 전환 |
| SchedulingBubble | 내부에서 me별로 다른 액션·표시 |
| HintBar | 변화 없음 (state.phase 기준) |
| Input | 변화 없음 |
| Sheet | 열려있으면 자동으로 다른 서브 시트로 라우팅 |

**규칙**: 시점 전환은 전역 상태(currentUser)만 변경. ChatRoom 각 요소가 자체적으로 me에 반응.

## Non-negotiable rules (ChatRoom)

### 1. 하나의 공간 원칙
요청·현황·확정이 모두 채팅방 안의 버블·시트에서 일어난다. 별도 페이지로 이동하지 않는다.

### 2. 8개 요소 배치 순서 고정
Notch → Header → PushBanner → PinBar → Main → HintBar → Input → Sheet. 순서 변경·요소 추가 금지.

### 3. SchedulingBubble이 유일한 시스템 카드
채팅방에는 하나의 SchedulingBubble만 존재. 여러 시스템 카드 동시 배치 금지.

### 4. PushBanner는 타겟 푸시
`bannerFor(state)` 로직 준수. 응답 완료자에게 배너 표시 금지.

### 5. PinBar는 스크롤 앵커 전용
Sheet 오픈 액션과 분리. PinBar 클릭 = 스크롤만.

### 6. HintBar는 테스터 어휘
프로덕트 안내로 재사용하지 않는다. 테스터 힌트만.

### 7. Message는 mine 자동 판정
`from === me`로 mine 판정. 수동 지정 금지.

### 8. Sheet는 ChatRoom 내부에 마운트
Sheet를 App 레벨 또는 외부에 배치하지 않는다.

### 9. Chat 헤더 3요소 유지
IconBack + Title + IconSettings. 추가·제거 금지.

### 10. Phone 프레임은 iPhone 16 Pro 규격
402×874, radius 38px, Dynamic Island 126×37. 다른 기기 규격으로 변경 시 별도 마스터 컴포넌트 등록.

## Common mistakes to avoid

❌ 채팅방 안에서 다른 화면(모달·풀스크린)으로 이동
✅ 모든 상호작용은 채팅방 안의 버블·Sheet에서

❌ 여러 시스템 카드를 채팅방에 동시 게시
✅ SchedulingBubble 하나만. mode에 따라 내부 라우팅

❌ 응답 완료자에게 PushBanner 표시
✅ `bannerFor(state)` 로직 준수. 타겟 원칙

❌ PinBar 클릭 시 Sheet 오픈
✅ PinBar는 스크롤 이동만. Sheet는 Push Banner·버블 액션으로

❌ Message의 mine을 수동으로 지정
✅ `from === me` 자동 판정

❌ HintBar를 프로덕트 알림으로 재사용
✅ HintBar는 테스터 힌트. 프로덕트 안내는 Notice

❌ Confirmed 상태에서 PinBar·HintBar 표시
✅ Confirmed는 종료 상태. 두 요소 모두 렌더 안 함

❌ Compose 상태에서 SchedulingBubble을 비호스트에게 표시
✅ Compose 시 SchedulingBubble은 호스트에게만 (내부 return null 처리)

❌ INTRO_MESSAGES·TRAILING_MESSAGES를 컴포넌트에서 하드코딩
✅ data.js에서 import. 데이터 분리

❌ Chat Input에 실제 입력 기능 구현
✅ 시각 어포던스만. Mod U 스코프 밖

❌ Message의 말풍선 4면을 모두 라운드
✅ 뾰족 모서리로 방향성 유지 (좌상단 또는 우상단 4px)

❌ Mine 메시지에 Avatar·이름 라벨 표시
✅ Mine은 우측 정렬 + 색 배경만. 아바타·이름 없음

❌ Chat Header에 프로필 이미지·상태 아이콘 추가
✅ Back + Title + Settings 3요소 고정

❌ Phone 프레임의 shadow를 다른 컴포넌트에 재사용
✅ 폰 프레임 shadow는 기기 규격 예외. 카드는 `shadow-card` 상한

❌ SchedulingBubble의 `chat__msg--center` 래퍼를 다른 컴포넌트에 사용
✅ 시스템 명의 카드 전용 어휘. 일반 메시지는 `chat__msg` (좌/우 정렬)

❌ PushBanner에 닫기 버튼 추가
✅ Sheet 오픈 시 자동 갱신. 명시적 닫기 없음

❌ HintBar에 여러 힌트 동시 표시