# Primitives

Mod U의 최소 단위 컴포넌트 6종. 시스템의 어휘를 구성하며, 모든 상위 컴포넌트가 이들을 인스턴스로 조립한다.

## 정본과 참조 관계

- 코드 정본: `src/components/primitives.jsx`
- Figma 정본: 라이브러리의 Atoms 컴포넌트 세트
- 상세 문서: `docs/design-system/atoms/*.md`

## 포함 컴포넌트

| 컴포넌트 | 성격 | 재사용 |
|---|---|---|
| Avatar | 사용자 정체성 표시 | 최다 재사용 (테스터 바, 메시지, 현황판, 확정 요약, 매트릭스) |
| Button | 액션 트리거 | 시트 CTA, 버블 액션, 채팅 |
| Chip | 상태·태그 표시 | SlotCard flag, Notice 내부, 응답 상태 |
| SegButton | 이진 선택 (가능/어려움) | 응답 시트, 조율 버블 |
| Notice | 인라인 안내줄 | 버블·시트 내부 |
| NameFlow | 이름 목록 인라인 렌더 | 현황판 문장 |

---

# Avatar

사용자 정체성을 색+이니셜로 표시하는 원형 컴포넌트.

## 사용 조건

- **쓴다**: 사용자 식별이 필요한 모든 곳 — 메시지 발신자, 응답 현황, 확정 참석자, 테스터 컨트롤
- **쓰지 않는다**: 익명·시스템 명의 표현 (시스템 메시지 중앙 카드는 아바타 없음)

## Variant

크기 축만 물리적 variant로 존재.

| Variant | 값 | 크기 | 이니셜 폰트 |
|---|---|---|---|
| size | `md` (기본) | 40×40px | `text-md` (16px) semibold |
| size | `sm` | 28×28px | `text-xs` (12px) semibold |

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `id` | string | — | 멤버 ID 문자열 (`'runa'`, `'dan'`, `'mara'`, `'bibi'`, `'jessie'`, `'william'`). `MEMBERS[id]`로 이름 조회, `userColorOf(id)`로 색 결정 |
| `size` | `'md' \| 'sm'` | `'md'` | 크기 variant |
| `dimmed` | boolean | `false` | 감쇠 상태 (opacity 0.35) |

## 접근성

- 컴포넌트 렌더 시 자동으로 `aria-label={m.name}` 속성이 부여됨 (예: `aria-label="댄"`)
- 이니셜 텍스트는 시각적 표현이며, 스크린리더는 aria-label의 전체 이름을 읽는다
- 아바타 자체는 정보성 요소 (aria-hidden 아님)

## 색 오버라이드 정책

Avatar는 **Primitive 직접 사용 예외**다. Semantic 별칭 없이 `user/1~6`을 인덱스 round-robin으로 CSS 변수 `--avatar-bg`에 주입.

| 요소 | 토큰 |
|---|---|
| 배경 | `user/1~6` (Primitive, 인덱스 기반) |
| 이니셜 텍스트 | `text/inverse` |
| radius | `radius-full` (원형) |

**규칙**: 이 매핑은 유일하다. 배경색을 semantic 토큰으로 오버라이드하지 않는다.

## 조립 규칙

- **Used by**: MessageRow, MemberCard (JudgeBar 내부), ConfirmedBubble, MatrixRow, ChatRoom 메시지
- **Uses**: 없음 (원자)
- **간격**: 아바타 겹침(Confirmed) 시 `margin-left: -8px` + `2px border` (예외 목록 참조)

## 사용 예시

```jsx
<Avatar id="runa" size="md" />
<Avatar id="dan" size="sm" />
<Avatar id="mara" size="sm" dimmed />
```

## Do / Don't

✅ 사용자 식별이 필요한 모든 곳에 사용
✅ 6명 초과 팀은 인덱스 % 6으로 색 재사용 (`userColorOf` 내부에서 자동 처리)
✅ 응답하지 않은 멤버는 `dimmed` prop으로 감쇠 표현

❌ 아바타 배경을 semantic 토큰(`primary/default` 등)으로 변경
❌ 시스템 명의 메시지에 아바타 추가
❌ 이니셜을 이미지·아이콘으로 대체 (다른 컴포넌트 사용)
❌ 크기 md/sm 외 임의 크기 지정
❌ id에 숫자 인덱스 전달 (`<Avatar id={0} />`)
✅ 멤버 ID 문자열 사용 (`<Avatar id="runa" />`)

## Figma 매핑

- **마스터**: `Atoms/Avatar`
- **Variants**: `size = md | sm`
- **Properties**:
  - `initial` (TEXT) — 이니셜 문자
  - `dimmed` (BOOLEAN) — 감쇠 상태
- **인스턴스 오버라이드**:
  - Fill 색: user/1~6 Variable 바인딩 (인스턴스별로 인덱스 다르게)
- **Detach 금지**

---

# Button

액션 트리거. 크기 2단계 + 톤 4종.

## 사용 조건

- **쓴다**: 클릭 가능한 액션이 필요한 모든 곳
- **쓰지 않는다**: 링크 스타일이 필요한 인라인 텍스트 → `notice` 내부 링크 요소 사용

## Variant

| Variant | 값 | 크기 | 폰트 |
|---|---|---|---|
| size | `md` (기본) | padding 12×16, radius `radius-md` | `text-md` semibold |
| size | `sm` | padding 8×12, radius `radius-sm` | `text-sm` semibold |

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | 시각 톤 (오버라이드로 처리) |
| `size` | `'md' \| 'sm'` | `'md'` | 크기 variant |
| `full` | boolean | `false` | width 100% (`btn--full`) |
| `disabled` | boolean | `false` | 비활성 (opacity 0.35, cursor default) |
| `onClick` | function | — | 클릭 핸들러 |
| `children` | ReactNode | — | 버튼 내용 |

## 오버라이드 화이트리스트

허용되는 톤은 4종만.

| variant | 배경 | 텍스트 | 사용처 |
|---|---|---|---|
| primary | `primary/default` | `text/inverse` | 확정, 다음 단계, CTA |
| secondary | `primary/weak` | `primary/default` | 취소, 이전, 보조 액션 |
| danger | `danger/weak` | `danger/default` | 삭제, 이의, 위험 액션 |
| ghost | transparent | `text/sub/default` | 텍스트 링크 스타일 |

**규칙**: 이 4종 밖의 조합 금지. Success 톤이 필요하면 화이트리스트 확장 제안.

## 상태

| 상태 | 표현 |
|---|---|
| Hover (primary) | `filter: brightness(1.06)` |
| Disabled | `opacity: 0.35`, cursor default |
| Disabled (secondary) | `opacity: 0.4` |

## 조립 규칙

- **Used by**: Bubble actions, Sheet footer, ChatRoom 헤더 (Icons via ghost)
- **Uses**: 없음
- **정렬**: `bubble__actions`는 `justify-items: start`, `full` prop 사용 시 `justify-self: stretch`

## 사용 예시

```jsx
<Button variant="primary" size="md" full>지금 확정</Button>
<Button variant="secondary" size="sm">취소</Button>
<Button variant="danger" size="sm" onClick={handleReject}>이의 있어요</Button>
<Button variant="ghost" size="sm">다시 보기</Button>
```

## Do / Don't

✅ Primary CTA는 한 화면에 1개
✅ 취소/보조 액션은 secondary
✅ 위험 액션(삭제·이의)은 danger
✅ 시트 하단 주 액션은 `full` prop 사용

❌ Danger·success·warn 톤을 강조·장식용으로 사용
❌ Primary variant를 여러 버튼에 나열
❌ 새 톤(warning/info)을 위해 variant 확장
❌ 크기 md/sm 외 임의 padding 지정
❌ Border 추가로 커스텀 스타일 만들기

## Figma 매핑

- **마스터**: `Atoms/Button`
- **Variants**: `size = md | sm`
- **Properties**:
  - `label` (TEXT)
  - `full` (BOOLEAN)
  - `disabled` (BOOLEAN)
- **인스턴스 오버라이드**:
  - Fill: 화이트리스트의 배경 토큰 (`primary/default` 등)
  - Text color: 화이트리스트의 텍스트 토큰
- **variant 추가 금지**: 색은 오버라이드로만

---

# Chip

상태·태그를 표시하는 pill 형태 배지.

## 사용 조건

- **쓴다**: 상태 표시, 카테고리 태그, 카운트 라벨
- **쓰지 않는다**:
  - 클릭 가능한 필터 → Button ghost/secondary
  - 인라인 강조 텍스트 → NameFlow의 `<b>`

## Variant

단일 base. Tone은 오버라이드.

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `tone` | `'neutral' \| 'primary' \| 'danger' \| 'success' \| 'warn'` | `'neutral'` | 시각 톤 |
| `children` | ReactNode | — | 칩 내용 |

## 오버라이드 화이트리스트

| tone | 배경 | 텍스트 | 보더 | 사용처 |
|---|---|---|---|---|
| neutral | `surface/sub/default` | `text/sub/default` | `line/default` | 기본 태그 |
| primary | `primary/weak` | `primary/default` | 없음 | 확정·주 상태 |
| danger | `danger/weak` | `danger/default` | 없음 | 이의·거절 |
| success | `success/weak` | `success/default` | 없음 | 완료 |
| warn | `warn/weak` | `warn/text/default` | 없음 | 경고·주의 |

**규칙**: neutral만 보더 있음. 나머지는 배경으로 구분.

## 스펙

| 속성 | 값 |
|---|---|
| padding | `4px 8px` (`space-1 space-2`) |
| radius | `radius-full` (pill) |
| 폰트 | `text-xs` (12px) semibold |

## 조립 규칙

- **Used by**: SlotCard flag, ConfirmedBubble 상태, Sheet 옵션 표시
- **Uses**: 없음
- **위치**: SlotCard flag는 카드 보더에 걸침 (`top: -8px`, `shadow-card` 추가)

## 사용 예시

```jsx
<Chip tone="primary">1순위</Chip>
<Chip tone="danger">어려움</Chip>
<Chip tone="neutral">필참</Chip>
```

## Do / Don't

✅ 상태·카테고리·카운트 표시
✅ Neutral은 정보성 태그, tone 있는 것은 상태

❌ 클릭 가능한 요소로 사용 (필터·토글 등)
❌ Danger·warn tone을 장식으로 사용
❌ 12px 밖의 크기로 확장
❌ 여러 줄 텍스트 (한 줄 pill 유지)
❌ 아이콘 삽입 (텍스트만)

## Figma 매핑

- **마스터**: `Atoms/Chip`
- **Variants**: 없음 (단일 base)
- **Properties**:
  - `label` (TEXT)
- **인스턴스 오버라이드**:
  - Fill: 화이트리스트의 배경 토큰
  - Text color: 화이트리스트의 텍스트 토큰
  - Stroke: neutral tone만 `line/default`, 나머지는 stroke 제거

---

# SegButton

가능/어려움 이진 선택 컨트롤. 응답 어휘.

## 사용 조건

- **쓴다**: 슬롯 응답 (가능/어려움), 이진 선택이 필요한 상황
- **쓰지 않는다**:
  - 3개 이상 선택지 → 별도 컴포넌트 필요 (추가 제안)
  - 단순 토글 (on/off) → Button 사용

## Variant

단일 base. 상태로 색만 오버라이드.

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `value` | `'ok' \| 'hard' \| undefined` | `undefined` | 현재 선택 상태. 미응답 상태는 `undefined` |
| `onChange` | function | — | 선택 변경 핸들러. `('ok' \| 'hard')` 인자로 호출됨 |
| `disabled` | boolean | `false` | 전체 비활성 (opacity 0.5, `pointer-events: none`) |

## 오버라이드 화이트리스트

| 상태 | 배경 | 텍스트 | 폰트 굵기 |
|---|---|---|---|
| 미선택 (기본) | `surface/default` | `text/weak/default` | medium |
| ok 선택 | `success/weak` | `success/default` | semibold |
| hard 선택 | `danger/weak` | `danger/default` | semibold |

**규칙**: 이 3가지 상태만 존재. "매우 좋음/보통" 같은 5단계 척도로 확장 금지.

## 스펙

| 속성 | 값 |
|---|---|
| 컨테이너 배경 | `surface/default` |
| 컨테이너 보더 | 1px `line/default` |
| 컨테이너 radius | `radius-sm` |
| 아이템 padding | `8px 12px` |
| 폰트 | `text-sm` |
| 라벨 | "가능" / "어려움" 고정 |

## 조립 규칙

- **Used by**: RespondSheet (슬롯 응답), CoordinationBubble (조율 시 인라인 응답)
- **Uses**: 없음
- **접근성**: `role="radiogroup"` 유지, 키보드 포커스 시 `focus-visible` 스타일

## 사용 예시

```jsx
<SegButton value={response} onChange={setResponse} />
<SegButton value="ok" onChange={() => {}} disabled />
```

## Do / Don't

✅ 슬롯당 하나씩 사용 (여러 슬롯 응답 시 각 슬롯 옆에 배치)
✅ 응답 시트에서 슬롯 리스트와 함께 사용
✅ 마감 이후에는 `disabled`로 잠금

❌ "가능/어려움" 라벨을 다른 문구로 변경
❌ 3개 이상 옵션으로 확장
❌ 컨테이너 색을 상태에 따라 변경 (아이템만 색 변경)
❌ 크기 축소·확대 (표준 크기 유지)
❌ 미응답 상태를 `null`로 표현
✅ 미응답은 `undefined`. `value={undefined}` 또는 `value` prop 생략

❌ onChange 콜백에 `'ok'`, `'hard'` 외 값 전달
✅ 이진 선택만. 세 번째 상태가 필요하면 다른 컴포넌트 검토

## Figma 매핑

- **마스터**: `Atoms/SegButton`
- **Variants**: 없음
- **Properties**:
  - `state` (VARIANT 또는 BOOLEAN 조합) — `none | ok | hard`
  - `disabled` (BOOLEAN)
- **인스턴스 오버라이드**:
  - 각 아이템의 fill·text color를 상태별로 오버라이드
  - 라벨 텍스트는 편집 금지 (고정 어휘)

---

# Notice

인라인 안내줄. 버블·시트 내부의 보조 문장.

## 사용 조건

- **쓴다**: 규칙 안내, 마감 조건, 상태 설명 등 문장형 보조 정보
- **쓰지 않는다**:
  - 긴 본문 → Sheet 본문 텍스트
  - 배지형 짧은 라벨 → Chip
  - 강한 경고 알림 → HintBar (조립된 molecule)

## Variant

단일 base. Tone은 오버라이드.

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `tone` | `'neutral' \| 'weak' \| 'warn' \| 'danger' \| 'success'` | `'neutral'` | 시각 톤 |
| `children` | ReactNode | — | 안내 문장 |

## 오버라이드 화이트리스트

| tone | 배경 | 텍스트 | Padding |
|---|---|---|---|
| neutral | `surface/sub/default` | `text/sub/default` | `space-2 space-3` |
| weak | transparent | `text/weak/default` | 0 (텍스트만) |
| warn | `warn/weak` | `warn/text/strong` | `space-2 space-3` |
| danger | `danger/weak` | `danger/default` | `space-2 space-3` |
| success | `success/weak` | `success/default` | `space-2 space-3` |

## 스펙

| 속성 | 값 |
|---|---|
| 폰트 | `text-sm` regular |
| 줄 간격 | 1.5 (`leading-base`) |
| radius | `radius-sm` (weak tone 제외) |

**IMPORTANT**: 문장형이므로 반드시 14px 이상 유지. 12px 사용 금지.

## 조립 규칙

- **Used by**: Bubble 내부 안내, Sheet section 하단 규칙 문장, SlotCard 부가 설명
- **Uses**: 없음
- **위치**: 항상 관련 요소 하단 또는 그룹 내부

## 사용 예시

```jsx
<Notice tone="neutral">응답 마감은 오늘 오후 6시입니다.</Notice>
<Notice tone="warn">필참자 응답이 오지 않으면 주최자에게 위임됩니다.</Notice>
<Notice tone="weak">이 결정은 언제든 되돌릴 수 있습니다.</Notice>
```

## Do / Don't

✅ 안내·규칙·마감 조건 등 문장형 정보
✅ Tone으로 정보의 중요도 표현
✅ Weak tone은 배경 없는 미묘한 보조 정보

❌ 12px(`text-xs`)로 축소 (접근성 미달)
❌ Danger tone을 장식으로 사용
❌ 아이콘 삽입 (텍스트만)
❌ 여러 줄 강조 표현 → HintBar로 분리
❌ Notice 안에 Button 삽입 (액션은 별도 어휘)

## Figma 매핑

- **마스터**: `Atoms/Notice`
- **Variants**: 없음
- **Properties**:
  - `body` (TEXT) — 안내 문장
- **인스턴스 오버라이드**:
  - Fill / Text color: 화이트리스트의 tone 매핑
  - Weak tone은 fill 제거 + padding 0

---

# NameFlow

이름 목록을 인라인으로 자연스럽게 렌더링하는 텍스트 컴포넌트.

## 사용 조건

- **쓴다**: 현황판 문장의 이름 나열 ("댄, 마라, 윌리엄님의 응답을 기다리고 있어요")
- **쓰지 않는다**:
  - 아바타 목록 → Avatar 인스턴스 나열
  - 단일 이름 강조 → 일반 텍스트 + `<b>`

## Props

| Prop | Type | Default | 설명 |
|---|---|---|---|
| `ids` | string[] | — | 멤버 ID 문자열 배열 (예: `['dan', 'mara', 'william']`) |
| `suffix` | ReactNode | — | 이름 뒤에 붙는 문구 ("님의 응답을 기다리고 있어요" 등) |

## 스펙

| 속성 | 값 |
|---|---|
| 이름 강조 | `<b>` (semibold) |
| 구분자 | `, ` (마지막 이름 앞은 구분자 없음) |
| 폰트 | 부모 요소 상속 |

**중요**: NameFlow는 자체 폰트 크기·색을 갖지 않는다. 부모 컨텍스트의 텍스트 스타일을 상속.

## 조립 규칙

- **Used by**: Board(현황판), Bubble 내부 문장
- **Uses**: `MEMBERS[id].name` 데이터 참조
- **빈 배열**: `ids.length === 0`이면 렌더링하지 않음 (null 반환)

## 사용 예시

```jsx
<NameFlow ids={['dan', 'mara', 'william']} suffix="님의 응답을 기다리고 있어요" />
<NameFlow ids={waitingIds} suffix="에게 위임됩니다" />
```

**렌더 결과**: `**댄**, **마라**, **윌리엄**님의 응답을 기다리고 있어요`

## Do / Don't

✅ 부모 컨텍스트(현황판, 안내 문장)의 텍스트 흐름에 자연스럽게 삽입
✅ suffix로 문맥 맞춤 (조사·서술어)
✅ 이름 자동 볼드 처리

❌ NameFlow에 색·크기 직접 지정
❌ 아바타와 함께 사용 (아바타 목록은 별도)
❌ 4명 이상 나열 시 그대로 사용 (긴 리스트는 요약 필요 — "외 N명")

## Figma 매핑

- **마스터**: `Atoms/NameFlow`
- **Variants**: 없음
- **Properties**:
  - `names` (TEXT) — 쉼표로 구분된 이름 문자열
  - `suffix` (TEXT) — 접미 문구
- **인스턴스 처리**:
  - 이름 부분에 semibold 스타일 적용 (자동 처리)
  - 색·크기는 부모 컨테이너의 텍스트 스타일 상속

---

## 공통 규칙

### 원자 조합 시 준수사항

1. **원자를 조립할 때 새 스타일을 만들지 않는다** — Bubble이 Button을 포함할 때, Button의 padding·색을 부모 CSS로 재정의하지 않는다.
2. **원자 사이 간격은 부모의 gap으로** — 원자 자체에 margin을 지정하지 않는다.
3. **원자의 variant/tone은 데이터에 따라 결정** — 하드코딩된 톤을 여러 곳에 반복하지 않는다.

### 신규 원자 추가 절차

새 원자가 필요한 경우:

1. 기존 6개 원자의 오버라이드로 해결 가능한지 확인
2. 불가능하면 이 문서에 새 섹션 추가 + Figma 마스터 컴포넌트 등록
3. `components/overview.md`의 카탈로그 갱신
4. `docs/design-system/atoms/`에 상세 문서 추가

### Common mistakes (전체 원자 공통)

❌ 원자를 detach해서 커스텀 스타일 생성
✅ 오버라이드로 해결. 안 되면 새 원자 등록 제안

❌ 원자 안에 다른 원자 삽입 (Chip 안에 Icon, Notice 안에 Button 등)
✅ 원자는 최소 단위. 조합이 필요하면 molecule 층에서

❌ 원자의 크기·padding·radius를 화면별로 다르게 조정
✅ 시스템에 정의된 스펙 유지. 필요하면 새 variant 등록

❌ 원자의 오버라이드 화이트리스트 밖 조합 사용
✅ 화이트리스트만. 확장 필요 시 문서 갱신 제안

❌ Semantic 토큰을 우회해 raw 색·크기 값 사용
✅ 모든 값은 Figma Variables 바인딩

❌ 원자를 화면 레벨에서 재정의 (예: `.chat__text .btn { padding: 4px }`)
✅ 원자 자체를 수정하거나 새 variant 추가