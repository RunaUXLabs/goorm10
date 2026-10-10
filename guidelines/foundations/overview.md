# Foundations Overview

Mod U의 시각 시스템 기초. Figma Make가 화면을 개선·생성할 때 참조해야 할 **정본 값의 위치와 사용 규칙**을 정의한다.

## Where the values live

| 자산 | 위치 | 유형 |
|---|---|---|
| Color | Figma Variables · `Color` 컬렉션 | Primitive + Semantic 2계층 |
| Radius | Figma Variables · `Radius` 컬렉션 | Primitive만 |
| Spacing | Figma Variables · `Spacing` 컬렉션 | Primitive만 |
| Typography | Figma Variables · `Typography` 컬렉션 | fontFamily/weight/size/lineHeight |
| Elevation | Figma **Effect Styles** | shadow 3단계 (Variable 아님) |

**Motion(전환·애니메이션)은 Figma 자산으로 존재하지 않는다.** 코드 프로토타입의 CSS 애니메이션에만 정의되어 있으며, Figma Make Kit 작업 범위 밖이다. 인터랙션이 필요한 경우 GitHub 프로토타입(`RunaUXLabs/modu`)의 `styles.css`를 참조한다.

## Reading order

1. `color.md` — 가장 자주 참조. Primitive/Semantic 구분과 결정 트리
2. `typography.md` — 5단계 위계와 최소 문장 크기 규칙
3. `spacing.md` — 4px 그리드와 허용 예외
4. `radius.md` — 컴포넌트 유형별 매핑
5. `elevation.md` — shadow 3단계 사용처

## Non-negotiable rules

### 1. Variables 우선, raw 값 금지
- 모든 색·간격·라디우스·타이포는 Figma Variables 바인딩으로만 적용한다.
- Effect Styles(shadow)는 Style로 적용한다. 임의 shadow를 직접 만들지 않는다.
- 정의된 토큰/스타일로 표현할 수 없는 값이 필요하면 **먼저 토큰 추가를 제안**하고 raw 값을 넣지 않는다.

### 2. Semantic 우선, Primitive 직접 사용 금지
- 컴포넌트는 **Semantic 토큰만 바인딩**한다.
- Primitive를 컴포넌트에서 직접 참조하지 않는다.
- **예외**: 유저 아바타 색 `user/1~6`은 Primitive를 그대로 사용한다. (Semantic 별칭 없음)

### 3. Light only
- 다크 모드는 현재 정의되지 않는다.
- `-dark` 접미가 붙은 semantic 토큰(예: `surface/dark`, `text/dark`)은 앱 셸의 테스터 사이드바 전용이다. **프로덕트 화면 생성 시 사용하지 않는다.**

### 4. 4px 그리드
- 모든 치수는 4px 배수를 따른다.
- 명문화된 예외만 허용: 타입 스케일 14/18px, 폰 프레임 폭 390px, 자간, 1px 보더.
- 상세 예외 목록은 `spacing.md`.

### 5. 상태색은 기능 전용
- `danger` / `success` / `warn`은 상태 표현에만 사용한다.
- 장식·강조·브랜드 표현에 상태색을 쓰지 않는다.
- `warn/default`(amber/500)는 **배경·아이콘 전용**이며 텍스트에 사용 금지. 경고 텍스트는 `warn/text/default` 또는 `warn/text/strong`.

### 6. Base + Override 아키텍처

Mod U는 컴포넌트당 **base variant 1개**만 유지하고, 색·톤·상태 차이는 **Semantic 토큰 오버라이드**로 표현한다.

- Figma의 variant는 **크기 축(md/sm 등)에만 사용**한다.
- 시각 톤(primary/danger/success/warn 등)은 새 variant가 아니라 base 인스턴스에 semantic 토큰을 바인딩하여 얻는다.
- 새 variant를 추가하기 전에 오버라이드로 해결 가능한지 먼저 확인한다.
- 각 컴포넌트가 허용하는 오버라이드 조합은 `components/{name}.md`의 "Base + Override 정책" 섹션에 화이트리스트로 정의되어 있다.
- 상세 결정 트리와 색 오버라이드 예시는 `color.md` 참조.

## Quick reference

작업 중 자주 찾게 될 값들.

| 목적 | 토큰 |
|---|---|
| 앱 배경 | `bg/default` |
| 카드·버블 배경 | `surface/default` |
| 본문 텍스트 | `text/default` |
| 보조 텍스트 | `text/sub/default` |
| 주요 액션 | `primary/default` |
| 카드 라디우스 | `radius-sm` (8) ~ `radius-lg` (16) |
| 버튼·아바타 라디우스 | `radius-full` (999, pill/원형) |
| 카드 그림자 | Effect Style `shadow-card` |
| 시트 그림자 | Effect Style `shadow-sheet` |
| 기본 간격 단위 | `space-2` (8), `space-4` (16) |

세부 규칙과 결정 트리는 각 하위 파일 참조.