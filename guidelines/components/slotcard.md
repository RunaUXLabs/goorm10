# SlotCard

시간 슬롯을 표현하는 다형 카드. 3개 variant + 1개 modifier로 각기 다른 컨텍스트에서 사용된다.

## 정본과 참조 관계

- 코드 정본: `src/components/SlotCard.jsx`
- Figma 정본: `Molecules/SlotCard` 컴포넌트 세트
- 상세 문서: `docs/design-system/molecules/slot-card.md`

## Variant 개요

| Variant | 코드 값 | 사용처 | 성격 |
|---|---|---|---|
| Hero | `variant="hero"` | ProposalBubble·ConfirmedBubble·OrganizerSheet 상단 | 확정/제안된 시간을 크게 강조 (읽기용) |
| Tally | `variant="tally"` | CoordinationBubble 슬롯 리스트 | 응답 집계·팀 쏠림·개인 상태 (버튼) |
| Respond | `variant="respond"` | ResponseSheet 슬롯 리스트 | 슬롯 + SegButton 응답 (인터랙션) |

**Modifier**: Respond variant는 `preset={true}` 옵션으로 **캘린더 기반 프리셋 확인 필요** 상태를 표현한다. 별도 variant가 아니라 respond의 modifier.

**규칙**: 이 3개 variant + preset modifier 외의 슬롯 표현을 만들지 않는다. 새 컨텍스트가 필요하면 화이트리스트 확장 제안.

## 공통 Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `slot` | object | — | 슬롯 데이터 (`{ day, date, time, room }`) |
| `variant` | `'hero' \| 'tally' \| 'respond'` | `'tally'` | 렌더 모드 |
| `okCount` | number | — | Tally 전용. 가능 인원 |
| `total` | number | — | Tally 전용. 전체 인원 (게이지 분모) |
| `myValue` | `'ok' \| 'hard' \| undefined` | — | Tally/Respond 공용. 내 응답 상태 |
| `best` | boolean | `false` | Tally 전용. "지금 1순위" 플래그 표시 여부 |
| `preset` | boolean | `false` | Respond 전용. 캘린더 프리셋 확인 필요 modifier |
| `onChange` | function | — | Respond 전용. SegButton 값 변경 핸들러 |
| `onClick` | function | — | Tally 전용. 카드 탭 → Sheet 오픈 |

## 슬롯 데이터 구조

모든 variant가 공유하는 `slot` 객체 형식.

```js
{
  id: string,     // 예: 'mon14', 'tue10'
  day: string,    // 예: '월요일'
  date: string,   // 예: '3/25'
  time: string,   // 예: '14:00~15:00'
  room: string,   // 예: '회의실 A'
}
```

`src/data.js`의 `PROPOSAL_SLOT`, `COORD_SLOTS`, `WIDENED_SLOTS`에서 정의된다.

---

# Hero variant

확정된 또는 제안된 시간을 크게 강조하는 카드. 시각적으로 가장 강한 어휘.

## 사용 조건

- **쓴다**:
  - ProposalBubble의 잠정 확정 시간 (`PROPOSAL_SLOT`)
  - ConfirmedBubble의 최종 확정 시간 (`state.confirmed.slot`)
  - OrganizerSheet의 잠정 확정 현황 상단
- **쓰지 않는다**:
  - 여러 시간 나열 → Tally variant
  - 응답 대상 시간 → Respond variant

## 실제 구조

```jsx
<div className="slotcard slotcard--hero">
  <div className="slotcard__day">{slot.day}</div>
  <div className="slotcard__main">
    <span className="slotcard__date">{slot.date}</span>
    <span className="slotcard__time">{slot.time}</span>
  </div>
  <div className="slotcard__room">{slot.room} 예약됨</div>
</div>
```

## 스펙

| 속성 | 값 |
|---|---|
| 배경 | `primary/weak` |
| Padding | `space-4` |
| Radius | `radius-md` |
| Layout | 중앙 정렬 grid |
| Gap | `space-1` |
| 클릭 | **불가** (`div` 요소) |

## 내부 요소

| 요소 | 스타일 | 토큰 |
|---|---|---|
| 요일 라벨 (`slotcard__day`) | `text-sm` semibold, 중앙 정렬 | `primary/default` |
| 날짜 (`slotcard__date`) | `text-lg` bold | `text/default` |
| 시간 (`slotcard__time`) | `text-lg` bold | `primary/default` |
| 회의실 (`slotcard__room`) | `text-sm` regular | `text/sub/default` |

**레이아웃**: 요일 → 날짜+시간(가로 baseline 정렬) → 회의실 순으로 세로 배치.

**중요 텍스트**: 회의실 표시는 `"{room} 예약됨"` 형식. 회의실명 단독으로 표시하지 않음.

## 사용 예시

```jsx
// ProposalBubble에서 잠정 확정 시간
<SlotCard slot={PROPOSAL_SLOT} variant="hero" />

// ConfirmedBubble에서 최종 확정 시간
<SlotCard slot={state.confirmed.slot} variant="hero" />
```

## Do / Don't

✅ 잠정 확정·최종 확정 시간 1개만 표시
✅ 중앙 정렬 유지
✅ 회의실 표시는 "{room} 예약됨" 형식
✅ `primary/weak` 배경으로 브랜드 강조

❌ 여러 개 나열 (여러 슬롯은 Tally variant)
❌ 클릭 가능하게 만들기 (Hero는 읽기 전용, `div` 요소)
❌ 배경색을 다른 톤으로 변경
❌ 회의실 정보 생략 ("예약됨" 문구도 유지)
❌ 요일·날짜·시간 순서 변경

## Figma 매핑

- **마스터**: `Molecules/SlotCard`
- **Variant**: `type = hero`
- **Properties**:
  - `day` (TEXT) — 요일
  - `date` (TEXT) — 날짜
  - `time` (TEXT) — 시간
  - `room` (TEXT) — 회의실명 (뒤에 "예약됨"은 고정 텍스트)
- **인스턴스 오버라이드**: 텍스트 편집만. 색·크기 변경 금지

---

# Tally variant

응답 집계·팀 쏠림·개인 상태를 3개 채널로 시각화하는 카드. Coordination 버블에서 사용되며, 클릭 시 응답 화면 진입.

## 사용 조건

- **쓴다**: CoordinationBubble 내부 슬롯 리스트
- **쓰지 않는다**:
  - 강조된 1개 시간 → Hero variant
  - 슬롯 응답 입력 → Respond variant

## 핵심 원칙: 3개 시각 채널 분리

**IMPORTANT**: Tally variant는 세 개의 독립된 시각 채널을 가진다. 이 원칙은 `Guidelines.md`의 IMPORTANT 규칙에 명시됨.

| 채널 | 표현 | 정보 | 코드 |
|---|---|---|---|
| **Flag chip** (우상단, 보더 걸침) | Neutral chip "지금 1순위" | **팀 통계 요약** — 현재 최다 응답 슬롯 표시 | `best={true}`일 때 |
| **Meta chip** (우측 인라인) | Success/Danger chip "가능해요"/"어려워요" | **개인 응답 상태** — 내가 어떻게 응답했는가 | `myValue === 'ok' \| 'hard'` |
| **Gauge** (하단 게이지) | 채움 바 + 인원 문구 | **팀 응답 인원수** — 팀원 몇 명이 가능한가 | `okCount`, `total` |

**규칙**:
- 이 세 채널을 하나로 합치지 않는다
- 세 채널을 같은 색으로 통일하지 않는다
- 한 채널을 다른 채널의 정보로 대체하지 않는다 (예: 게이지 색을 개인 상태로 바꾸기 금지)

## 실제 구조

```jsx
<button type="button" className="slotcard slotcard--tally" onClick={onClick}>
  {/* Flag: 지금 1순위 표시 */}
  {best && (
    <span className="slotcard__flag">
      <Chip tone="neutral">지금 1순위</Chip>
    </span>
  )}

  {/* 좌측 정보 */}
  <div className="slotcard__info">
    <span className="slotcard__date">{slot.day} {slot.date}</span>
    <span className="slotcard__time">{slot.time} · {slot.room}</span>
  </div>

  {/* Meta chip: 내 응답 상태 */}
  <div className="slotcard__meta">
    {myValue === 'ok' && <Chip tone="success">가능해요</Chip>}
    {myValue === 'hard' && <Chip tone="danger">어려워요</Chip>}
  </div>

  {/* 하단 게이지: 팀 인원수 */}
  <span className="slotcard__gauge" aria-hidden="true">
    <i style={{ width: `${percent}%` }} />
    <em className="slotcard__gaugetext">
      {okCount > 0 ? `팀원 ${okCount}명이 가능하대요` : '아직 응답을 모으는 중이에요'}
    </em>
  </span>
</button>
```

## 스펙

| 속성 | 값 |
|---|---|
| 요소 | `button` (클릭 가능) |
| 배경 | `surface/sub/default` |
| 보더 | 1px `line/default` |
| Padding | `space-3` |
| Padding-bottom | `calc(24px + space-3)` (게이지 자리 확보) |
| Radius | `radius-md` |
| Hover 보더 | `primary/default` |
| Layout | flex row (info 좌측 + meta 우측) |
| Gap | `space-2` |
| Position | `relative` (Flag 겹침용) |

## 3개 채널 세부 스펙

### 채널 1: Flag chip (우상단)

`best={true}`일 때만 렌더.

| 속성 | 값 |
|---|---|
| Position | `absolute`, `top: -8px`, `right: space-3` |
| z-index | 1 |
| Chip tone | `neutral` |
| Chip 텍스트 | "지금 1순위" 고정 |
| 배경 | `surface/default` (카드 배경과 대비) |
| 그림자 | `shadow-card` |

**규칙**: Flag의 chip은 반드시 `tone="neutral"`. 팀 통계 정보이므로 상태색 사용 금지.

### 채널 2: Meta chip (우측 인라인)

`myValue` 값에 따라 조건부 렌더.

| myValue | Chip tone | Chip 텍스트 |
|---|---|---|
| `'ok'` | `success` | "가능해요" |
| `'hard'` | `danger` | "어려워요" |
| `undefined` | 렌더 없음 (미응답) | — |

**규칙**: Meta chip 텍스트는 "가능해요"/"어려워요" 고정. 다른 문구로 변경 금지.

### 채널 3: Gauge (하단)

항상 렌더 (`okCount` 값에 따라 문구 변경).

| 속성 | 값 |
|---|---|
| Position | `absolute`, `left: 0`, `right: 0`, `bottom: 0` |
| 높이 | 24px |
| 배경 | `surface/default` |
| Radius | `0 0 radius-md radius-md` (하단 2모서리만) |
| 채움 바 (`i`) | 높이 100%, 배경 `primary/weak` |
| 채움 폭 | `${Math.round((okCount / total) * 100)}%` |
| 애니메이션 | `width` 전환 `duration-base ease-out` |
| 문구 위치 | `absolute`, `left: space-3`, 세로 중앙 |
| 문구 스타일 | `text-sm` semibold, `primary/default` |
| 문구 내용 | `okCount > 0`: `팀원 {okCount}명이 가능하대요` |
| | `okCount === 0`: `아직 응답을 모으는 중이에요` |
| aria-hidden | `true` (시각 표현만) |

**규칙**:
- 게이지 채움 색은 항상 `primary/weak`. 개인 상태에 따라 색을 바꾸지 않는다
- 게이지 문구는 팀 인원수 정보만. 개인 응답 상태를 게이지 문구로 표현하지 않는다

## 좌측 정보 영역

| 요소 | 스타일 | 토큰 |
|---|---|---|
| 날짜 (`slotcard__date`) | `text-md` semibold | `text/default` |
| 시간 (`slotcard__time`) | `text-sm` regular | `text/sub/default` |
| 텍스트 형식 (date) | `{day} {date}` — 예: "월요일 3/25" |
| 텍스트 형식 (time) | `{time} · {room}` — 예: "14:00~15:00 · 회의실 A" |

## 사용 예시

```jsx
// CoordinationBubble에서 슬롯 리스트
{state.slots.map((slot) => (
  <SlotCard
    key={slot.id}
    slot={slot}
    variant="tally"
    okCount={ranked.find((r) => r.slot.id === slot.id)?.ok ?? 0}
    total={MEMBER_IDS.length}
    myValue={state.coord[me]?.[slot.id]}
    best={slot.id === bestId}
    onClick={() => dispatch({ type: 'SHEET', open: true })}
  />
))}
```

## Do / Don't

✅ 3개 채널 유지 (Flag chip / Meta chip / Gauge)
✅ Flag chip은 `neutral` tone 고정 (팀 통계이므로 상태색 금지)
✅ Meta chip은 `myValue`에 따라 success/danger 자동 결정
✅ Gauge 채움은 `primary/weak` 고정
✅ Hover 시 보더 색을 `primary/default`로
✅ 여러 슬롯을 세로로 나열 시 `bubble__slots` 부모의 `gap: space-3` 사용

❌ Meta chip과 Gauge를 같은 정보로 통일 (개인 vs 팀 채널 분리)
❌ Gauge 색을 개인 상태로 변경 (내가 어려움이면 붉게 등)
❌ Flag chip에 success/danger tone 사용 (팀 통계 = neutral)
❌ 카드 전체 배경색을 개인 상태로 변경
❌ Flag를 카드 내부에 배치 (반드시 `top: -8px` 보더 걸침)
❌ Gauge 자리(하단 24px) 확보 안 함 → 내용과 겹침
❌ Meta chip 텍스트 변경 ("좋아요"/"싫어요" 등 다른 어휘)
❌ Gauge 문구를 개인 응답 상태로 대체
❌ Flag chip 텍스트 변경 ("추천"/"베스트" 등)

## Figma 매핑

- **마스터**: `Molecules/SlotCard`
- **Variant**: `type = tally`
- **Properties**:
  - `date` (TEXT) — "{day} {date}" 조합
  - `time` (TEXT) — "{time} · {room}" 조합
  - `flag-visible` (BOOLEAN) — Flag chip 표시 여부 (best 프로퍼티)
  - `my-response` (VARIANT: none | ok | hard) — Meta chip 상태
  - `gauge-percent` (숫자) — 게이지 채움 width 바인딩
  - `gauge-text` (TEXT) — 게이지 문구
- **Nested instances**:
  - Chip (neutral) — Flag 위치 (조건부)
  - Chip (success 또는 danger) — Meta 위치 (조건부)
- **인스턴스 오버라이드**: 텍스트 편집 + variant 값 변경만

---

# Respond variant

응답 시트에서 각 슬롯 옆에 SegButton을 배치한 인터랙션 카드. `preset={true}` modifier로 파선 보더 상태 추가 가능.

## 사용 조건

- **쓴다**: ResponseSheet 슬롯 리스트 (각 슬롯마다 가능/어려움 응답 입력)
- **쓰지 않는다**:
  - 응답 결과 표시 → Tally variant
  - 확정된 시간 → Hero variant

## Preset modifier

`preset={true}` 옵션은 **캘린더 기반으로 미리 채워진 응답을 사용자가 확인해야 할 때** 사용한다.

- Sheet.jsx의 ResponseSheet에서 `preset = !already`로 계산
  - 즉, **아직 응답한 적 없는 사용자**에게 캘린더 프리셋이 채워져 있음을 알리는 상태
- 시각적 어휘: 파선 보더 + "캘린더 기준 제안 — 확인해주세요" 라벨

## 실제 구조

```jsx
<div className={`slotcard slotcard--respond ${preset ? 'slotcard--preset' : ''}`}>
  <div className="slotcard__info">
    <span className="slotcard__date">{slot.day} {slot.date}</span>
    <span className="slotcard__time">{slot.time} · {slot.room}</span>
    {preset && (
      <span className="slotcard__presetlabel">캘린더 기준 제안 — 확인해주세요</span>
    )}
  </div>
  <SegButton value={myValue} onChange={onChange} />
</div>
```

## 스펙

| 속성 | 값 |
|---|---|
| 요소 | `div` |
| 배경 | `surface/sub/default` |
| 보더 (기본) | 1px solid `line/default` |
| 보더 (preset) | 1px **dashed** `line/default` |
| Padding | `space-3` |
| Radius | `radius-md` |
| Layout | flex row (info 좌측 + SegButton 우측) |
| Gap | `space-2` |

**핵심 차이 (preset modifier)**: 보더 스타일이 solid → dashed로 변경. "확정되지 않은 프리셋" 어휘.

## 내부 요소

| 요소 | 조건 | 컴포넌트 |
|---|---|---|
| 좌측 정보 | 항상 | 날짜·시간 텍스트 (Tally와 동일 스타일) |
| Preset 라벨 (`slotcard__presetlabel`) | `preset={true}` | 텍스트 라인 |
| 우측 컨트롤 | 항상 | SegButton 인스턴스 |

## Preset 라벨 스펙

| 속성 | 값 |
|---|---|
| 텍스트 | "캘린더 기준 제안 — 확인해주세요" 고정 |
| 폰트 | `text-sm` regular |
| 색 | `warn/text/default` (amber-800) |

**IMPORTANT**: Preset 라벨의 색은 `warn/text/default`(amber-800)이다. `warn/default`(amber-500)는 대비율 미달로 텍스트 사용 금지 (foundations/color.md § warn 텍스트 예외 참조).

## 사용 예시

```jsx
// ResponseSheet에서 슬롯 리스트
{state.slots.map((slot) => (
  <SlotCard
    key={slot.id}
    slot={slot}
    variant="respond"
    myValue={values[slot.id]}
    preset={preset}  // !already: 아직 응답 안 한 상태면 true
    onChange={(v) => setValues((prev) => ({ ...prev, [slot.id]: v }))}
  />
))}
```

## Do / Don't

✅ 각 슬롯마다 SegButton 하나씩 배치
✅ SegButton은 우측 정렬
✅ 미응답 상태에서 캘린더 프리셋 표시 시 `preset={true}` + 파선 보더
✅ 응답 이력이 있으면 (`already === true`) `preset={false}` + 실선 보더
✅ Preset 라벨은 `warn/text/default` 색만 사용

❌ SegButton 없이 표시 (응답 입력 없는 슬롯은 Tally variant)
❌ 좌측 정보 영역에 게이지·Flag 추가
❌ 여러 SegButton 배치 (하나만)
❌ Preset 라벨 색으로 `warn/default`(amber-500) 사용 (대비 미달)
❌ Preset 라벨 텍스트 변경 (고정 어휘)
❌ 실선/파선 어휘 혼용 (응답 이력에 따라 명확히 구분)

## Figma 매핑

- **마스터**: `Molecules/SlotCard`
- **Variant**: `type = respond`
- **Properties**:
  - `date` (TEXT)
  - `time` (TEXT)
  - `preset` (BOOLEAN) — 파선 보더 + Preset 라벨 표시
  - `response` (VARIANT: none | ok | hard) — Nested SegButton 상태
- **Nested instance**: SegButton (고정 nested, INSTANCE_SWAP 아님)
- **Stroke 처리**: `preset=true`일 때 dashed 1px, `preset=false`일 때 solid 1px

---

## Variant 간 승격·전환 규칙

SlotCard는 사용 흐름에 따라 variant가 전환된다. 같은 슬롯 데이터가 다른 컨텍스트에서 다른 variant로 렌더된다.

```
Respond (응답 입력 대상)
  ↓ 사용자가 응답 저장 (COORD_RESPOND)
Tally (팀 응답 집계 표시)
  ↓ 시스템/주최자가 확정
Hero (최종 확정 시간 강조)
```

**초기 상태의 특수 케이스**:
- 응답 이력 없음 → `Respond + preset=true` (파선 보더)
- 응답 이력 있음 → `Respond + preset=false` (실선 보더)
- Preset은 Respond의 modifier이며 별도 variant가 아님

**규칙**:
- 같은 슬롯의 상태 변화는 위 순서를 따른다
- 역방향 전환(Hero → Tally 등)은 허용되지 않는다. 확정 취소 시에는 새 상태로 재렌더링
- 각 variant는 독립적으로 렌더링되며, 하나의 인스턴스에서 variant를 스위칭하지 않는다
- Preset modifier는 사용자 응답 이력에 따라 자동 결정 (`preset = !already`)

## 공통 조립 규칙

### Used by

| Variant | 상위 컴포넌트 |
|---|---|
| Hero | ProposalBubble, ConfirmedBubble, OrganizerSheet (proposal phase) |
| Tally | CoordinationBubble (`.bubble__slots` 리스트) |
| Respond | ResponseSheet (`.sheet__slots` 리스트) |

### Uses

| Variant | 하위 컴포넌트 |
|---|---|
| Hero | 없음 (텍스트만) |
| Tally | Chip (Flag 위치, neutral tone) + Chip (Meta 위치, success/danger tone) |
| Respond | SegButton (우측 nested) |

### 나열 규칙

- 여러 SlotCard 나열 시 부모의 gap:
  - CoordinationBubble의 `bubble__slots` → `gap: space-3` + `padding-top: space-1` (Tally Flag 겹침 여백)
  - ResponseSheet의 `sheet__slots` → `gap: space-2`
- 개별 SlotCard에 margin을 지정하지 않는다. 여백은 항상 부모의 gap으로.

## Non-negotiable rules

### 1. 3개 variant + 1개 modifier
Hero / Tally / Respond 외의 slot variant를 만들지 않는다. Respond는 `preset` boolean modifier 하나만 허용.

### 2. Tally의 3채널 분리
Flag chip (팀 통계) / Meta chip (개인 응답) / Gauge (팀 인원수)는 독립된 채널이다. 하나로 합치거나 정보를 교차시키지 않는다. `Guidelines.md`의 IMPORTANT 규칙.

### 3. Hero는 읽기 전용
Hero는 `div` 요소로 렌더된다. 클릭 액션이 필요하면 Tally 또는 Respond variant 사용.

### 4. Preset은 respond의 modifier
Preset은 독립 variant가 아니라 respond의 modifier. `variant="preset"` 같은 표기 금지. 항상 `variant="respond"` + `preset={boolean}` 조합.

### 5. Variant는 순방향 전환만
Respond → Tally → Hero 순서. 역방향 전환은 새 상태로 재렌더링으로 처리.

### 6. 게이지 자리 확보 필수
Tally variant는 `padding-bottom: calc(24px + space-3)` 유지. 게이지가 내용과 겹치지 않도록.

### 7. Flag는 카드 보더에 걸침
Tally variant의 Flag chip은 `top: -8px` 오프셋으로 보더 위에 겹친다. 내부에 삽입하지 않는다.

### 8. 고정 텍스트 어휘 준수
아래 텍스트는 코드에 하드코딩되어 있으며 변경 금지:
- Hero 회의실: `{room} 예약됨`
- Tally Flag chip: `"지금 1순위"`
- Tally Meta chip: `"가능해요"` / `"어려워요"`
- Tally Gauge 문구: `"팀원 {N}명이 가능하대요"` / `"아직 응답을 모으는 중이에요"`
- Respond Preset 라벨: `"캘린더 기준 제안 — 확인해주세요"`

### 9. Preset 라벨 색 예외
Preset 라벨은 `warn/text/default` (amber-800). `warn/default` (amber-500)는 대비율 미달로 사용 금지.

## Common mistakes to avoid

❌ Tally variant에서 카드 전체 배경색을 개인 상태로 변경
✅ 개인 상태는 Meta chip으로만 표현. 배경은 `surface/sub/default` 고정

❌ Gauge 채움 색을 상태별로 변경 (내가 어려움이면 붉게 등)
✅ Gauge는 팀 인원수 표현. 색은 `primary/weak` 고정

❌ Preset을 별도 variant로 취급 (`variant="preset"`)
✅ Preset은 respond의 modifier. `variant="respond"` + `preset={true}`

❌ Hero variant를 여러 개 나열
✅ Hero는 확정/제안 시간 1개만. 여러 개는 Tally variant

❌ Respond variant에 게이지 추가 (응답 입력 + 팀 통계 동시 표시)
✅ 두 정보를 하나의 카드에 담지 않음. Respond는 입력, Tally는 결과

❌ SlotCard 인스턴스에서 variant를 코드로 스위칭 (같은 요소가 상태에 따라 hero → tally)
✅ 각 variant는 독립 인스턴스. 상태 변화 시 재렌더링

❌ Flag chip을 카드 내부에 배치
✅ 상단 보더에 겹치는 `top: -8px` 위치 유지

❌ Flag chip에 success/danger tone 사용
✅ Flag는 팀 통계 = neutral tone 고정

❌ Preset 라벨 색으로 `warn/default`(amber-500) 사용
✅ `warn/text/default`(amber-800). 텍스트 대비율 확보

❌ Preset 라벨 텍스트 변경 ("추천"/"제안" 등)
✅ "캘린더 기준 제안 — 확인해주세요" 고정

❌ 회의실을 Hero에서 회의실명 단독으로 표시
✅ "{room} 예약됨" 형식 유지

❌ Meta chip 텍스트 변경 ("좋아요"/"싫어요" 등)
✅ "가능해요"/"어려워요" 고정

❌ Gauge 문구를 개인 응답 상태로 대체 ("내가 응답함" 등)
✅ Gauge 문구는 팀 인원수 정보만

❌ Tally variant를 `div`로 렌더 (클릭 불가)
✅ Tally는 `button` 요소. onClick 필수

❌ Respond variant에서 preset 상태와 실선/파선 어휘 혼용
✅ preset=true → dashed 보더, preset=false → solid 보더 명확히 구분

❌ Hero의 요일·날짜·시간 순서 변경
✅ 요일 → 날짜+시간 baseline → 회의실 순서 유지