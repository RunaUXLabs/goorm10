# Typography

Mod U의 텍스트 위계와 사용 규칙. 단일 폰트 패밀리 + 5단계 크기 + 4단계 굵기의 최소 시스템으로 모든 화면을 커버한다.

## 정본과 참조 관계

- 값 정본: `src/tokens.css` (`--text-*`, `--weight-*`, `--leading-*`, `--font-family`)
- Figma 정본: `Typography` 컬렉션 (fontFamily / fontWeight / size / lineHeight)
- 전체 스타일 표: `docs/design-system/foundation-guide.md` § Typography

## Font family

**Pretendard Variable** 단일 패밀리. Figma·코드 모두 이 폰트로만 렌더링한다.

```css
--font-family: "Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont,
               system-ui, "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
```

**Figma Variables 매핑** (md-to-figma 변환 규칙):
- `fontFamily/primary` = Pretendard Variable (디자인 의도)
- `fontFamily/secondary` = Inter (폴백)

폰트가 없는 환경에서는 secondary로 지능적으로 바인딩 전환된다. 폰트명을 화면에 직접 입력하지 않는다.

## 5단계 크기 위계

| Token | Size | Role | 대표 사용처 |
|---|---|---|---|
| `text-xs` | 12px | **caption** | 라벨, 캡션, 힌트, 배지, 날짜 구분선 |
| `text-sm` | 14px | **sub** | 보조 텍스트, 칩, 현황판, 문장형 안내 |
| `text-md` | 16px | **body** | 본문 (모든 화면 기준선) |
| `text-lg` | 18px | **title** | 시트·버블 타이틀 |
| `text-xl` | 24px | **display** | 페이지 타이틀 (`layout__title`) |

**위계 규칙**: caption(12) < sub(14) < body(16) < title(18) < display(24)

한 화면에 5단계를 모두 사용하지 않는다. 일반적으로 **body + 위/아래 1~2단계** 조합으로 충분하다.

## 4단계 굵기

| Token | Weight | 사용 원칙 |
|---|---|---|
| `weight-regular` | 400 | 본문 기본 |
| `weight-medium` | 500 | 라벨·필드 라벨 |
| `weight-semibold` | 600 | 강조 텍스트, 칩, 액션 |
| `weight-bold` | 700 | 타이틀, 배지, 아바타 이니셜 |

**규칙**: 굵기로 위계를 만들지 말고 **크기와 색으로 위계를 만든다**. 굵기는 같은 크기 안에서 강조/기본을 나눌 때만 쓴다.

## 줄 간격 (line-height)

| Token | Value | 사용처 |
|---|---|---|
| `leading-tight` | 1.3 | 타이틀·display (조밀한 시각 밀도) |
| `leading-base` | 1.5 | 본문·보조 텍스트 (가독성 우선) |

**규칙**:
- 문장형 텍스트는 `leading-base` (1.5)
- 짧은 타이틀/라벨은 `leading-tight` (1.3)
- Figma Variables에서는 `%` 표기(150%, 130%)로 입력한다.

## 접근성 · 문장형 텍스트 최소 크기

**IMPORTANT**: 문장형 텍스트는 **14px 이상**을 사용한다. 12px(`text-xs`)는 **라벨·캡션·배지 등 어휘 단위**에만 허용된다.

### 12px 허용 예시
- 배지·태그 (`chip`, `hintbar__badge`)
- 필드 라벨 (`field__editicon`, `field__source`)
- 날짜 구분선 (`chat__date`)
- 캡션·출처 표기

### 12px 금지 예시
- 안내 문장 (`hintbar` 본문, `notice`, `board__deadline`)
- 도움말 문구
- 리스트 항목의 설명 줄 (`layout__how small`)

이 규칙은 `styles.css` 곳곳에 주석으로 명시되어 있다 (예: "문장형 보조 텍스트는 14px 이상 (접근성 패스)").

## 실제 사용 매핑 (`styles.css` 기반)

각 컴포넌트에서 어떤 크기·굵기·색을 조합하는지.

### 페이지 셸

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `layout__title` (제품명) | `text-xl` | bold | `text/inverse` |
| `layout__tagline` | `text-md` | regular | `text/tagline` |
| `layout__how` (설명 리스트) | `text-sm` | regular | `text/sub/dark` |

### 채팅 셸 (ChatRoom)

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `chat__title` (방 이름) | `text-lg` | regular | `text/default` |
| `chat__count` (인원수) | `text-lg` | regular | `text/weak/default` |
| `chat__date` (날짜 구분선) | `text-xs` | regular | `text/weak/default` |
| `chat__name` (발신자명) | `text-xs` | regular | `text/sub/default` |
| `chat__text` (말풍선 본문) | `text-md` | regular | `text/default` |
| `chat__input` (입력창 placeholder) | `text-md` | regular | `text/weak/default` |

### Bubble (시스템 메시지)

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `bubble__app` (앱 이름) | `text-xs` | semibold | `primary/default` |
| `bubble__title` | `text-md` | bold | `text/default` |
| `bubble__subtitle` | `text-sm` | regular | `text/sub/default` |

### SlotCard

| 요소 | Size | Weight | Color |
|---|---|---|---|
| Hero: `slotcard__day` (요일) | `text-sm` | semibold | `primary/default` |
| Hero: `slotcard__date/time` | `text-lg` | bold | `text/default` / `primary/default` |
| Hero: `slotcard__room` | `text-sm` | regular | `text/sub/default` |
| Tally: `slotcard__date` | `text-md` | semibold | `text/default` |
| Tally: `slotcard__time` | `text-sm` | regular | `text/sub/default` |
| Tally: `slotcard__count` | `text-sm` | semibold | `primary/default` |
| Tally: `slotcard__gaugetext` | `text-sm` | semibold | `primary/default` |

### Sheet

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `sheet__title` | `text-lg` | bold | `text/default` |
| `sheet__sectiontitle` (라벨) | `text-xs` | bold | `text/weak/default` |
| `field__label` | `text-sm` | medium | `text/sub/default` |
| `field__value` | `text-md` | semibold | `text/default` |
| `field__source` | `text-xs` | regular | `text/weak/default` |

### Push / Pin / Hint 바

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `push__app` (앱 이름) | `text-xs` | semibold | `primary/dark` |
| `push__text` (본문) | `text-sm` | regular | `text/inverse` |
| `push__cta` | `text-xs` | semibold | `text/inverse` |
| `pinbar` 본문 | `text-sm` | semibold | `primary/default` |
| `pinbar__cta` | `text-xs` | regular | `text/sub/default` |
| `hintbar__badge` | `text-xs` | bold | `warn/weak` (자간 0.6px) |
| `hintbar` 본문 | `text-sm` | regular | `warn/text/strong` |

### Primitives

| 요소 | Size | Weight |
|---|---|---|
| `btn--md` | `text-md` | semibold |
| `btn--sm` | `text-sm` | semibold |
| `chip` | `text-xs` | semibold |
| `seg__item` | `text-sm` | medium / semibold(선택 시) |
| `notice` | `text-sm` | regular |
| `avatar--md` (이니셜) | `text-md` | semibold |
| `avatar--sm` (이니셜) | `text-xs` | semibold |

### Matrix (주최자 현황)

| 요소 | Size | Weight | Color |
|---|---|---|---|
| `matrix__name` | `text-sm` | medium | `text/default` |
| `matrix__name--head` | `text-xs` | semibold | `text/weak/default` |
| `matrix__cell` | `text-sm` | regular / bold(상태 시) | 상태별 |
| `matrix__cell--head` | `text-xs` | regular | `text/weak/default` |
| `matrix__role` (필/선 배지) | `text-xs` | bold | 역할별 |

### JudgeBar (앱 셸 전용 — 참고용, 프로덕트 재사용 금지)

| 요소 | Size | Weight |
|---|---|---|
| `judge__desc` (단계 설명 — 최상단 배치) | `text-sm` | regular |
| `judge__principle` | `text-xs` | regular |
| `judge__label` (섹션 라벨) | `text-xs` | semibold (자간 0.4px) |
| `judge__membername` | `text-sm` | semibold |
| `judge__memberdesc` | `text-xs` | regular |
| `judge__stage` (배지) | `text-xs` | semibold |
| `judge__stage-sep` (`›` 구분자) | `text-xs` | regular |
| `judge__advance` (버튼) | `text-sm` | semibold |

## Base + Override 원칙과의 관계

Typography는 **크기·굵기·색을 조합해 오버라이드**하는 방식으로 사용한다. 새 텍스트 스타일 컴포넌트를 만들지 않는다.

- Figma의 텍스트 스타일은 `text-xs`~`text-xl` 5개 크기 스타일만 유지한다.
- Weight·color는 **인스턴스 레벨에서 Variables 바인딩**으로 오버라이드한다.
- "Caption Bold Warn" 같은 조합 스타일을 등록하지 않는다.

### 새 텍스트 위계가 필요할 때

1. 먼저 기존 5단계 조합으로 표현 가능한지 확인
2. 불가능하면 **결정 순서를 크기 → 굵기 → 색**으로 시도
3. 그래도 부족하면 새 크기 토큰 추가 제안 (임의 값 사용 금지)

## Non-negotiable rules

### 1. 5단계 밖의 크기 금지
`text-xs`(12) / `text-sm`(14) / `text-md`(16) / `text-lg`(18) / `text-xl`(24) 외 값을 사용하지 않는다. 20px, 22px 같은 중간 크기가 필요하면 **먼저 토큰 추가를 제안**한다.

### 2. 문장형은 14px 이상
안내·힌트·설명 문장은 `text-sm` 이상. `text-xs`는 라벨·배지·캡션에만 사용한다. 이 규칙은 접근성(WCAG) 준수를 위한 것이며 예외를 만들지 않는다.

### 3. 굵기는 4단계만
400/500/600/700만 사용한다. 300, 800, 900 같은 굵기를 임의로 넣지 않는다. Pretendard Variable이 지원하더라도 시스템 어휘 밖의 굵기는 금지.

### 4. 위계는 크기+색, 굵기는 보조
같은 위계 안에서 강조를 만들 때만 굵기를 올린다. 굵기만으로 상하 위계를 만들지 않는다.

### 5. 자간(letter-spacing) 예외
- 기본은 `0px`이다.
- 예외: 대문자·라벨 계열에서 가독성을 위해 `0.4px`~`0.6px` 허용
  - `judge__label` (0.4px)
  - `hintbar__badge` (0.6px)
  - `sheet__sectiontitle` (0.6px)
- 이 외 임의 자간 조정 금지.

### 6. 폰트 패밀리 단일
Pretendard Variable 외 다른 폰트를 섞지 않는다. 코드에서 이모지·특수문자를 위해 별도 폰트를 지정하지 않는다.

### 7. 줄 간격은 2단계만
`leading-tight`(1.3) 또는 `leading-base`(1.5). 1.4, 1.6 등 중간값을 임의로 넣지 않는다.

## Common mistakes to avoid

❌ 안내 문장에 `text-xs`(12px) 사용 (접근성 미달)
✅ 문장형은 `text-sm`(14px) 이상

❌ 강조를 위해 굵기만 올리고 크기·색은 동일하게 유지
✅ 크기나 색으로 위계를 만들고 굵기는 보조

❌ 20px, 22px 등 스케일 외 크기 사용
✅ 5단계 중 선택. 필요하면 토큰 추가 제안

❌ Figma에서 "Caption Bold Warn" 같은 조합 텍스트 스타일 생성
✅ 크기 스타일 5개만 유지. 굵기·색은 인스턴스 오버라이드

❌ 다른 폰트(Roboto, Noto Sans 등)를 위해 별도 스타일 추가
✅ Pretendard Variable 단일. 폴백은 시스템이 자동 처리

❌ letter-spacing을 시각 조정용으로 임의 사용 (예: `-0.5px`)
✅ 라벨 계열 예외 3개 외 `0px` 유지

❌ 굵기 800/900 사용 (Variable 폰트 지원해도)
✅ 400/500/600/700만 사용

❌ 줄 간격을 1.4, 1.6 등 임의값으로 지정
✅ `leading-tight`(1.3) / `leading-base`(1.5) 두 값만