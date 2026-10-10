# Color

Mod U의 색 시스템 사용 규칙. Primitive/Semantic 2계층 구조와 Base + Override 아키텍처의 실제 적용 방법을 정의한다.

## 정본과 참조 관계

- **값의 정본**: `src/tokens.css` → `DESIGN-SYSTEM.md`(루트) → md-to-figma로 Figma Variables 이식
- 이 문서는 **사용 규칙과 결정 방법**에 집중한다. 전체 토큰 목록·HEX값·대비율은 `docs/design-system/foundation-guide.md` 참조.
- Figma 작업 시에는 Variables 패널의 `Color` 컬렉션을 정본으로 본다.

## 2계층 구조

| 계층 | 성격 | 컴포넌트 참조 가능 여부 |
|---|---|---|
| **Primitive** | 원시값 (gray, slate, blue, red, green, amber, alpha, user) | ❌ 직접 참조 금지 (예외: `user/1~6`) |
| **Semantic** | 용도별 alias (bg, surface, text, primary, danger, success, warn 등) | ✅ 컴포넌트는 이것만 참조 |

Semantic은 항상 Primitive 토큰명으로 바인딩되어 있다. HEX가 직접 적히지 않는다. 이 규칙 덕분에 팔레트를 교체해도 컴포넌트를 수정하지 않는다.

## 결정 트리

색을 선택할 때 이 순서로 판단한다.

### Step 1. 어떤 목적인가?

| 목적 | 시작할 Semantic 그룹 |
|---|---|
| 앱 전체 배경 | `bg/default` |
| 카드·버블·시트 배경 | `surface/default` |
| 중첩된 표면 (카드 안의 서브 영역) | `surface/sub/default` |
| 본문 텍스트 | `text/default` |
| 보조 텍스트 (라벨·설명) | `text/sub/default` |
| 약한 텍스트 (힌트·캡션) | `text/weak/default` |
| 반전 텍스트 (진한 배경 위) | `text/inverse` |
| 주요 액션 | `primary/default` |
| 주요 액션 배경 (연한 톤) | `primary/weak` |
| 위험/이의 표현 | `danger/default` |
| 성공/확정 표현 | `success/default` |
| 경고 배경/아이콘 | `warn/default` |
| **경고 텍스트** | `warn/text/default` 또는 `warn/text/strong` ⚠️ |
| 구분선·보더 | `line/default` |
| 시트 backdrop | `dim` |
| 푸시 오버레이 | `overlay` |
| 유저 아바타 배경 | `user/1~6` (Primitive 직접 사용) |

### Step 2. Semantic 안에서 어떤 단계인가?

같은 그룹 내 하위 토큰 선택 원칙.

- **`/default`** — 기본. 대부분 이걸 쓴다.
- **`/weak`** — 배경으로 톤을 얹을 때 (예: `danger/weak` = 옅은 붉은 배경 + `danger/default` 텍스트 조합)
- **`/strong`** — 강조가 필요할 때 (예: `warn/text/strong`은 힌트바·notice의 강한 경고)
- **`/sub`** — 계층적으로 한 단계 낮출 때 (예: `text/sub`, `surface/sub`)
- **`/inverse`** — 반전 (예: primary 배경 위 흰 텍스트)

### Step 3. `-dark` 접미가 붙었는가?

- `-dark`가 붙은 semantic 토큰은 **앱 셸(테스터 사이드바) 전용**이다.
- 프로덕트 화면(390px 프레임 내부)에서는 사용하지 않는다.
- 예: `surface/dark`, `surface/sub/dark`, `text/dark`, `text/label/dark`, `line/dark` 등
- 이유: Mod U는 Light only 프로덕트지만, 시연용 앱 셸의 좌측 사이드바는 다크 톤이라 별도 토큰 세트가 존재한다.

## Base + Override 아키텍처

Mod U는 **컴포넌트당 base variant 1개**만 유지하고, 색 차이는 **인스턴스에 Semantic 토큰을 오버라이드**하여 만든다.

### Figma variant vs 코드 variant prop

용어가 두 층위에서 다르게 쓰인다. 반드시 구분한다.

| 층위 | "variant"의 뜻 | Mod U에서 |
|---|---|---|
| Figma component set | 물리적 배리언트 축 | **크기(md/sm)에만 사용** |
| 코드 컴포넌트 prop | 시각 톤 선택자 | 내부에서 Semantic 토큰 오버라이드로 변환 |

즉, 코드에서 `<Button variant="danger">`라고 써도 Figma에는 danger variant가 **없다**. Figma에서는 base Button에 `background: danger/weak` + `text: danger/default`를 오버라이드한 인스턴스가 된다.

### 규칙

1. 새 색 조합이 필요하면 **먼저 오버라이드로 해결 가능한지 확인**한다.
2. 오버라이드 조합은 컴포넌트별 화이트리스트에 등록된 것만 사용한다.
3. 화이트리스트에 없는 조합이 필요하면 **먼저 문서 갱신을 제안**하고 즉석에서 만들지 않는다.

## 컴포넌트별 색 매핑 (실제 사용 기준)

`styles.css`에서 실제로 사용되는 조합. 상세 카탈로그는 각 컴포넌트 문서 참조.

### Button (`btn`)

| variant | 배경 | 텍스트 |
|---|---|---|
| primary | `primary/default` | `text/inverse` |
| secondary | `primary/weak` | `primary/default` |
| danger | `danger/weak` | `danger/default` |
| ghost | transparent | `text/sub/default` |

### Chip (`chip`)

| tone | 배경 | 텍스트 |
|---|---|---|
| neutral | `surface/sub/default` (+`line/default` 보더) | `text/sub/default` |
| primary | `primary/weak` | `primary/default` |
| danger | `danger/weak` | `danger/default` |
| success | `success/weak` | `success/default` |
| warn | `warn/weak` | `warn/text/default` |

### Notice (`notice`)

| tone | 배경 | 텍스트 |
|---|---|---|
| neutral | `surface/sub/default` | `text/sub/default` |
| weak | transparent | `text/weak/default` |
| warn | `warn/weak` | `warn/text/strong` |
| danger | `danger/weak` | `danger/default` |
| success | `success/weak` | `success/default` |

### SegButton (`seg`)

| 상태 | 배경 | 텍스트 |
|---|---|---|
| 기본 | `surface/default` (+`line/default` 보더) | `text/weak/default` |
| ok 선택 | `success/weak` | `success/default` |
| hard 선택 | `danger/weak` | `danger/default` |

### Bubble (`bubble`, `chat__text`)

| 요소 | 색 |
|---|---|
| 배경 | `surface/default` |
| 본문 텍스트 | `text/default` |
| 앱 이름 라벨 | `primary/default` |
| 서브타이틀 | `text/sub/default` |
| 내 메시지 배경 | `primary/weak` |

### SlotCard — Hero (제안된 시간 강조)

| 요소 | 색 |
|---|---|
| 배경 | `primary/weak` |
| 요일 라벨 | `primary/default` |
| 날짜/시간 | `text/default` + `primary/default` |
| 회의실 | `text/sub/default` |

### SlotCard — Tally (쏠림 표시)

| 요소 | 색 |
|---|---|
| 배경 | `surface/sub/default` (+`line/default` 보더) |
| Hover 보더 | `primary/default` |
| 게이지 배경 | `surface/default` |
| 게이지 채움 | `primary/weak` |
| 게이지 문구 | `primary/default` |

### Sheet (`sheet`)

| 요소 | 색 |
|---|---|
| Backdrop | `dim` |
| 표면 | `surface/default` |
| 섹션 타이틀 | `text/weak/default` (+ `line/default` 언더라인) |
| Grab handle | `line/default` |

### PushBanner (`push`)

| 요소 | 색 |
|---|---|
| 배경 | `overlay` |
| 앱 이름 | `primary/dark` (다크 배경 위 강조) |
| 본문 | `text/inverse` |
| CTA 배경 | `primary/default` |

### HintBar (`hintbar`)

| 요소 | 색 |
|---|---|
| 배경 | `warn/weak` |
| 본문 | `warn/text/strong` |
| 액션 링크 | `warn/text/strong` (underline) |

### PinBar (`pinbar`)

| 요소 | 색 |
|---|---|
| 배경 | `primary/weak` |
| 본문 | `primary/default` |
| CTA | `text/sub/default` |

### Avatar (`avatar`)

| 요소 | 색 |
|---|---|
| 배경 | `user/1~6` (인덱스 기반 round-robin, Primitive 직접) |
| 이니셜 텍스트 | `text/inverse` |

## Non-negotiable rules

### 1. 상태색은 기능 전용
`danger` / `success` / `warn`은 **상태 표현에만** 사용한다. 장식·강조·브랜드 표현에 상태색을 쓰지 않는다.

### 2. warn 텍스트 예외
`warn/default`(amber-500, `#ff9500`)는 **배경·아이콘 전용**이다. 흰 배경 위 대비율이 2.1:1이라 WCAG AA 미달로 텍스트 사용 금지.

경고 텍스트는:
- 기본: `warn/text/default` (amber-800, 5.6:1)
- 강조: `warn/text/strong` (amber-900, 힌트바·강한 경고)

### 3. 유저 아바타 색은 Primitive 직접 사용
`user/1~6`은 Semantic 별칭이 없다. 인덱스 기반 round-robin(`userColorOf(id)`)으로 Primitive를 그대로 컴포넌트 로컬 변수 `--avatar-bg`에 주입한다. 이 예외는 **아바타 배경색에만** 적용되며, 다른 곳에서 Primitive 직접 참조 금지.

### 4. Primary는 sparse하게
`primary/default`는 확인·주요 액션에만 사용한다. 한 화면에 primary CTA는 원칙적으로 하나. 나열 요소를 primary로 채우지 않는다.

배경 톤으로 쓰는 `primary/weak`은 이 규칙에 해당하지 않는다 (강조가 아니라 정보 그룹핑 용도).

### 5. `-dark` 토큰 격리
`surface/dark`, `text/dark`, `line/dark` 등 `-dark` 접미 토큰은 앱 셸(테스터 사이드바·JudgeBar) 전용이다. 프로덕트 화면(390px 프레임 내부)에서 사용 시 오작동으로 간주한다.

프로덕트 화면에서 진한 배경이 필요하면 `overlay`(푸시 배너)를 사용한다. 이 외에 다크 톤이 필요한 경우는 존재하지 않는다.

### 6. Hex 직접 입력 금지
모든 색은 Figma Variables 바인딩으로만 적용한다. 코드에서도 `tokens.css`의 CSS Variable만 사용한다. Hex(`#1b64da`)나 rgb를 컴포넌트에 직접 쓰지 않는다.

**단 하나의 예외**: `styles.css`의 `hintbar__badge` 배경(`#8a5a00`)은 warn 계열 프리미티브 리터럴로 남아있다. 이는 향후 정리 대상이며 신규 작업에서는 재현하지 않는다.

## Common mistakes to avoid

❌ 새 색 조합을 위해 **새 variant를 추가**한다
✅ Base 인스턴스에 Semantic 토큰 오버라이드

❌ **Primitive를 컴포넌트에 직접 바인딩** (`gray-900`, `blue-600` 등)
✅ Semantic 사용 (`text/default`, `primary/default`)
예외: 아바타 배경색만 `user/1~6` 직접 사용

❌ **경고 텍스트에 `warn/default`** (amber-500) 사용
✅ `warn/text/default` 또는 `warn/text/strong`

❌ 강조를 위해 **primary를 여러 곳에** 나열
✅ Primary CTA는 한 화면에 1개. 나머지는 secondary/ghost

❌ 브랜드 강조나 장식을 위해 **danger/success/warn 사용**
✅ 상태 표현이 아니면 뉴트럴 팔레트에서 선택

❌ 다크 톤이 필요해서 **`surface/dark` 사용**
✅ 프로덕트 화면은 Light only. `overlay`만 예외적으로 사용 가능

❌ Hex를 직접 입력 (`#1b64da` 등)
✅ Figma Variables / CSS Variable 바인딩만 사용

❌ 카드 배경으로 `bg/default` 사용
✅ `surface/default` (앱 배경 위에 뜬 표면이라는 위계 유지)

❌ 카드 안의 서브 영역에 다시 `surface/default` 사용 (경계가 사라짐)
✅ `surface/sub/default`로 한 단계 낮춘 표면 사용