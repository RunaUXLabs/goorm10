# Spacing

Mod U의 여백 시스템 사용 규칙. 4px 그리드를 기반으로 6단계 spacing 토큰 + 명문화된 예외로 모든 여백을 표현한다.

## 정본과 참조 관계

- 값 정본: `src/tokens.css` (`--space-1` ~ `--space-6`)
- Figma 정본: `Spacing` 컬렉션 (Primitive만, Semantic alias 없음)
- 전체 스타일 표: `docs/design-system/foundation-guide.md` § Spacing

## 4px 그리드 원칙

모든 치수(패딩·마진·오프셋·gap·크기)는 **4px 배수**를 따른다. 4의 배수가 아닌 값은 예외 목록에 등록된 것만 허용한다.

이 원칙은 시각 리듬을 만들고 Figma auto-layout·CSS grid의 gap 값과 자연스럽게 정합된다.

## 6단계 spacing 토큰

| Token | Value | 대표 사용처 |
|---|---|---|
| `space-1` | 4px | 아주 좁은 gap (아이콘-텍스트, 세부 인접) |
| `space-2` | 8px | 기본 gap (칩·배지·인라인 요소) |
| `space-3` | 12px | 그룹 내 여백 (카드 내부 요소 간) |
| `space-4` | 16px | 카드 padding, 섹션 내 여백 |
| `space-5` | 20px | 시트 좌우 padding |
| `space-6` | 24px | 섹션 간 여백, 하단 안전 여백 |

**Semantic alias 없음**. 컴포넌트는 Primitive 토큰명을 직접 참조한다 (`var(--space-4)` 등).

## 여백 위계 원칙

`styles.css`에서 실제로 적용되는 여백의 계층 구조.

```
필드 내부 요소 간 (4px)     → space-1
같은 그룹 내 요소 간 (8~12px) → space-2 / space-3
그룹·행 간 (16px)            → space-4
섹션 간 (24px)               → space-6
```

**규칙**: 시각적으로 가까운 관계일수록 좁게, 개념적으로 분리된 그룹일수록 넓게. 이 위계를 뒤집지 않는다.

## 실제 사용 매핑 (`styles.css` 기반)

각 컴포넌트에서 spacing이 어떻게 배치되는지.

### 페이지 셸

| 위치 | 값 |
|---|---|
| 좌우 여백 (`.layout`) | 24px (`space-6`) |
| 좌우 gap | 48px (예외 — 데스크톱 시연용) |
| `layout__tagline` margin-top | `space-2` (8px) |
| `layout__how` margin | `space-5` 상하 |
| `layout__how` gap | `space-2` |

### JudgeBar

섹션 순서: **단계 설명(`judge__desc`) → 시점 전환 → 시간 흐름**

| 위치 | 클래스 | 값 |
|---|---|---|
| 컨테이너 padding | `.judge` | `space-4` |
| 컨테이너 gap (섹션 간) | `.judge` | `space-4` |
| 아바타 그리드 gap | `.judge__avatars` | `space-2` |
| 멤버 카드 padding | `.judge__member` | `space-2` |
| 시간 흐름 내부 행 간 gap | `.judge__row--time` | `space-2` |
| 라벨-배지 행 gap | `.judge__time-header` | `space-2` |
| 버튼 행 gap | `.judge__time-actions` | `space-2` |
| stage 배지 gap | `.judge__stages` | `space-1` |

### ChatRoom

| 위치 | 값 |
|---|---|
| 헤더 padding | `54px space-4 space-3` (상: 노치 회피 예외) |
| 헤더 gap | `space-3` |
| 스크롤 영역 padding | `space-4 space-4 space-6` |
| 메시지 gap | `space-2` |
| 메시지 간 margin-bottom | `space-4` |
| 시스템 메시지(`--center`) margin | `0 space-1 space-4` |
| 날짜 구분선 margin-bottom | `space-4` |
| 입력창 padding | `space-3 space-4 28px` (하: 홈 인디케이터 회피 예외) |

### Bubble

| 위치 | 값 |
|---|---|
| padding | `space-4` |
| gap (내부 요소 간) | `space-3` |
| head 내부 gap | 2px (예외 — 라벨-타이틀 미세 조정) |
| slots gap | `space-3` |
| slots padding-top | `space-1` (플래그 겹침 방지) |
| actions gap | `space-2` |

### SlotCard

| 위치 | 값 |
|---|---|
| Hero padding | `space-4` |
| Hero gap | `space-1` |
| Hero main gap | `space-2` |
| Tally padding | `space-3` |
| Tally padding-bottom | `calc(24px + space-3)` (게이지 자리) |
| Tally gap | `space-2` |
| Tally info gap | 2px (예외 — 날짜-시간 미세) |
| Flag position | `top: -8px`, `right: space-3` |
| Gauge text left | `space-3` |
| Respond padding | `space-3` |

### Sheet

| 위치 | 값 |
|---|---|
| Body padding | `space-3 space-5 space-5` |
| Body gap (섹션 간) | `space-6` |
| Grab margin | `space-3 auto space-2` |
| Footer padding | `space-3 space-5 space-6` |
| Section gap | `space-2` |
| Section title margin-bottom | `space-1` |
| Section title gap | `space-2` |
| Slots/reasons/actions gap | `space-2` |
| Escalation padding | `space-3` |
| Escalation gap | `space-2` |

### Compose (생성 시트)

| 위치 | 값 |
|---|---|
| fields gap | `space-3` |
| field gap | `space-1` |
| field row gap | `space-2` |
| field options gap | `space-2` |

### Primitives

| 컴포넌트 | 여백 |
|---|---|
| Button md padding | `12px 16px` (`space-3 space-4`) |
| Button sm padding | `8px 12px` (`space-2 space-3`) |
| Chip padding | `4px 8px` (`space-1 space-2`) |
| Seg item padding | `8px 12px` (`space-2 space-3`) |
| Notice padding | `space-2 space-3` |
| Notice weak padding | 0 (텍스트만) |

### Push / Pin / Hint 바

| 위치 | 값 |
|---|---|
| Push padding | `space-3 space-4` |
| Push position | `top: 40px`, `left/right: 12px` |
| Push gap | `space-2` |
| Push CTA padding | `5px 10px` (예외 — 컴팩트 배지) |
| Pinbar padding | `space-2 space-4` |
| Pinbar gap | `space-2` |
| Hintbar padding | `space-2 space-4` |
| Hintbar gap | `space-2` |

### Matrix (주최자 현황)

| 위치 | 값 |
|---|---|
| matrix gap | `space-2` |
| matrix__row gap | `space-2` |
| matrix__name gap | `space-2` |
| matrix__cell padding | `8px 0` (`space-2` 상하) |
| matrix__cell 폭 | 64px (예외 — 3열 그리드) |
| matrix__role 크기 | 20px × 20px (예외 — 배지 크기) |

### Confirmed

| 위치 | 값 |
|---|---|
| 인원 요약 gap | `space-2` |
| 아바타 겹침 margin-left | `-8px` (`-space-2`, 겹침 표현) |
| 아바타 border | 2px (예외 — 겹침 구분선) |

## 허용된 예외 목록

4px 그리드 밖의 값 중 명문화된 예외. 이 목록 밖의 값은 사용하지 않는다.

### 1. 미세 조정 (1~3px)

| 값 | 사용처 | 이유 |
|---|---|---|
| 1px | 보더 두께 (`line/default` 사용) | 시각적 최소 단위 |
| 2px | 라벨-타이틀 gap (`bubble__head`, `slotcard__info`) | 텍스트 리듬 미세 조정 |
| 2px | 아바타 겹침 border | 겹침 구분선 |
| 3px | 멤버 카드 내부 gap (`judge__member`) | 이름-설명 미세 조정 |

### 2. 컴포넌트 내부 패딩 (혼합 값)

| 값 | 사용처 |
|---|---|
| `5px 10px` | Push CTA (컴팩트 배지) |
| `8px 12px` | Button sm, Seg item, Field input/value |
| `12px 16px` | Button md |
| `4px 8px` | Chip, Judge stage |

이들은 각각 `space-*` 조합으로 환산 가능하며, Figma에서는 auto-layout padding 좌우/상하를 분리 지정한다.

### 3. 레이아웃 규격 (기기·화면 폭)

| 값 | 사용처 |
|---|---|
| 390px | 폰 프레임 폭 (모바일 규격) |
| 402px | iPhone 16 Pro 폭 (`.phone` 최신 규격) |
| 440px | 사이드바 폭 (`layout__side`) |
| 420px | 사이드바 max-width (반응형) |
| 720/780/874px | 폰 프레임 세로 규격 |
| 48px | 페이지 좌우 gap (데스크톱 시연) |

이들은 하드웨어·컨테이너 규격이며 여백 시스템과 별개.

### 4. 노치·홈 인디케이터 회피

| 값 | 사용처 |
|---|---|
| 54px | 채팅 헤더 상단 padding (Dynamic Island 회피) |
| 28px | 입력창 하단 padding (홈 인디케이터 회피) |
| 40px | Push banner top offset |
| 12px | Push banner 좌우 여백 |

폰 프레임 내부의 안전 영역 확보용. 다른 화면에서 재현하지 않는다.

### 5. 그리드 셀 크기

| 값 | 사용처 |
|---|---|
| 44px × 4px | Sheet grab handle |
| 64px | Matrix cell 폭 |
| 20px × 20px | Matrix role 배지 |
| 28px | Avatar sm |
| 40px | Avatar md |
| 126px × 37px | Dynamic Island |

컴포넌트 고유 크기는 예외로 두되, 새 컴포넌트에서는 4px 배수를 우선한다.

### 6. 음수 오프셋

| 값 | 사용처 |
|---|---|
| `-8px` | SlotCard flag top (보더 걸침) |
| `-8px` | Confirmed avatar margin-left (겹침) |

## Figma auto-layout 사용 규칙

Figma에서 spacing을 적용하는 방식.

1. **Gap**: auto-layout의 gap 값은 반드시 `space-*` Variable로 바인딩한다.
2. **Padding**: auto-layout padding은 4방향 각각 Variable 바인딩. 좌우/상하가 다르면 개별 지정.
3. **Absolute 위치**: 음수 오프셋(플래그, 겹침 아바타)은 x/y 좌표를 raw 값으로 입력 가능하되 위 예외 목록 값만 허용.
4. **Frame 크기**: 컴포넌트 자체 크기는 hug/fill 우선. 고정 크기가 필요하면 예외 목록의 값 사용.

## Non-negotiable rules

### 1. 4px 배수 원칙
모든 여백은 `space-1~6` 또는 예외 목록의 값