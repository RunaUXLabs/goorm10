# Elevation

Mod U의 그림자 시스템 사용 규칙. 3단계 shadow로 표면의 상하 관계를 표현한다. Variables가 아닌 **Figma Effect Styles**로 관리된다.

## 정본과 참조 관계

- 값 정본: `src/tokens.css` (`--shadow-card` / `--shadow-sheet` / `--shadow-banner`)
- Figma 정본: **Effect Styles** (Variables 컬렉션 아님)
- 전체 스타일 표: `docs/design-system/foundation-guide.md` § Effects

**중요**: Elevation은 Color/Radius/Spacing/Typography처럼 Variable로 등록되지 않는다. Figma의 **Effect Style**로 존재하며, 컴포넌트에 style로 바인딩한다.

## 3단계 shadow

| Style | Y | Blur | Color | 층위 |
|---|---|---|---|---|
| `shadow-card` | 1px | 3px | rgba(0,0,0,0.06) | 표면 위 카드 (얕음) |
| `shadow-sheet` | -8px | 24px | rgba(0,0,0,0.12) | 하단에서 올라온 시트 (상승) |
| `shadow-banner` | 4px | 16px | rgba(0,0,0,0.16) | 최상위 알림·오버레이 (강조) |

**규칙**: 각 shadow는 서로 다른 층위를 표현한다. 같은 화면에서 여러 shadow를 임의 조합하지 않고, 아래 매핑을 따른다.

## 층위 개념

Mod U는 3개 층위로 표면 관계를 정의한다.

```
Layer 3 (최상위)  : shadow-banner  → Push, alert
Layer 2 (상승)    : shadow-sheet    → Bottom sheet, modal
Layer 1 (카드)    : shadow-card     → Bubble, slotcard hero
Layer 0 (배경)    : shadow 없음     → 앱 배경, 중첩 표면
```

**규칙**:
- 같은 층위의 요소는 같은 shadow를 쓴다.
- 층위를 올릴 때 shadow 강도(blur·opacity)가 커진다.
- 층위를 표현할 필요 없는 요소(중첩 표면, 인라인 요소)에는 shadow를 걸지 않는다.

## 실제 사용 매핑 (`styles.css` 기반)

### shadow-card (Layer 1)

| 요소 | 이유 |
|---|---|
| `bubble` (시스템 메시지) | 채팅 배경 위 카드 |
| `chat__text` (말풍선) | 채팅 배경 위 말풍선 |
| `slotcard__flag .chip` | 카드 보더 위에 걸친 배지 (미세 부양감) |

### shadow-sheet (Layer 2)

| 요소 | 이유 |
|---|---|
| `sheet` (바텀시트) | 하단에서 올라온 표면 — Y 음수(-8px)로 상단 그림자 표현 |

### shadow-banner (Layer 3)

| 요소 | 이유 |
|---|---|
| `push` (푸시 알림) | 최상위 오버레이 |

### shadow 없음

| 요소 | 이유 |
|---|---|
| `bg/default` (앱 배경) | 배경 자체 |
| `surface/sub/default` (중첩 표면) | 부모 표면 안이므로 층위 불필요 |
| `slotcard--tally` (기본 카드) | 배경 위지만 보더로 구분 |
| `board`, `notice`, `matrix__cell` | 부모 컨테이너 내부 요소 |
| `chip`, `btn`, `avatar` | 인라인 요소 (예외: SlotCard flag chip) |
| `pinbar`, `hintbar` | 상단 고정 바 (헤더 컨텍스트, 층위 불필요) |
| `judge` (테스터 컨트롤) | 다크 배경 위 카드지만 shadow 대신 border로 구분 |

## Shadow의 방향성

`shadow-sheet`는 **음수 Y값(-8px)**로 위에서 아래가 아닌 **아래에서 위로** 올라온 표현을 만든다.

- 일반 카드(`shadow-card`): Y=1px → 아래로 살짝 떠 있음
- 시트(`shadow-sheet`): Y=-8px → 위로 상승 (하단 부착 컨테이너)
- 배너(`shadow-banner`): Y=4px → 아래로 강하게 떠 있음 (최상위)

이 방향성은 시트가 폰 화면 하단에서 올라오는 물리적 모델과 정합된다.

## Figma Effect Style 적용 규칙

1. **Effect Style 3개만 유지**: `shadow-card` / `shadow-sheet` / `shadow-banner`.
2. **컴포넌트에 style 바인딩**: raw shadow 값을 인스턴스에 직접 입력하지 않는다.
3. **오버라이드 금지**: 컴포넌트 인스턴스에서 shadow를 detach하거나 값을 조정하지 않는다.
4. **다중 shadow 금지**: 하나의 요소에 여러 shadow를 겹쳐 쌓지 않는다.
5. **Inner shadow 금지**: Mod U에는 inner shadow가 없다. drop shadow만 사용.

## 허용된 예외 목록

3단계 Effect Style 밖의 특수 표현.

### 1. 폰 프레임 그림자 (기기 규격)

`.phone`의 외곽 그림자는 시스템 shadow와 별개.

```css
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2);
```

- 이유: 데스크톱 캔버스 위의 물리적 폰 재현
- 사용: `.phone` 하나만. 다른 컴포넌트에서 재현하지 않는다.
- Figma: 별도 Effect Style로 등록하지 않음. 폰 프레임 컴포넌트에만 인스턴스 값으로 유지.

### 2. Filter (밝기 조정)

버튼 hover 시 `filter: brightness(1.06)` 사용.

- 이유: 색을 변경하지 않고 인터랙션 피드백만 제공
- 사용: `btn--primary:hover`
- Figma: 대응 없음 (인터랙션 프로토타이핑 시에만)

### 3. Opacity (비활성·감쇠)

특정 상태 표현에 opacity 값 사용.

| 값 | 사용처 |
|---|---|
| 0.35 | 버튼 disabled (`btn:disabled`, `judge__advance:disabled`) |
| 0.4 | 보조 버튼 disabled (`btn--secondary:disabled`) |
| 0.5 | Seg 전체 비활성 (`seg--disabled`) |
| 0.35 | Avatar dimmed (`avatar--dimmed`) |

- 이유: 상태 표현. 색을 바꾸지 않고 감쇠로 표현.
- Figma: layer opacity 값으로 적용.

### 4. Gradient (그라데이션)

Sheet footer의 스크롤 포그.

```css
background: linear-gradient(to top, var(--color-surface) 25%, transparent);
```

- 이유: 본문 내용이 넘친다는 것을 시각적으로 암시
- 사용: `sheet__footer::before`
- Figma: Sheet 컴포넌트 내부 요소로 linear gradient fill.

## Elevation과 Border의 관계

Mod U는 층위 표현에 **shadow 또는 border 중 하나**만 사용한다. 둘 다 걸지 않는다.

| 요소 | 층위 표현 방식 |
|---|---|
| Bubble, chat__text | shadow-card |
| SlotCard tally | 1px border (`line/default`) |
| SlotCard hero | 배경색 (`primary/weak`) |
| Sheet | shadow-sheet |
| Push | shadow-banner |
| Judge (다크) | 1px border (`line/dark`) |
| Notice, board | 배경색 (`surface/sub`) |

**규칙**: 카드에 shadow를 걸었다면 border를 추가하지 않는다. 반대도 동일.

**예외**: 시스템 메시지 중앙 카드(`.chat__msg--center .bubble`)는 shadow-card + 1px border를 함께 걸어 시스템 명의의 무게를 표현한다. 이 예외는 시스템 명의 원칙 때문이며 다른 컴포넌트에서 재현하지 않는다.

## Non-negotiable rules

### 1. 3단계 Effect Style만 사용
`shadow-card` / `shadow-sheet` / `shadow-banner` 외 그림자를 만들지 않는다. 새 층위가 필요하면 **먼저 Effect Style 추가를 제안**한다.

### 2. Shadow는 Variable이 아니다
Color/Radius/Spacing/Typography와 달리 Elevation은 Effect Style로 관리된다. Variables 컬렉션에 등록하지 않는다.

### 3. 층위 매핑 준수
- Layer 1(카드) = shadow-card
- Layer 2(시트) = shadow-sheet
- Layer 3(배너) = shadow-banner
- 임의로 층위를 바꾸지 않는다.

### 4. 다중 shadow 금지
하나의 요소에 shadow를 겹쳐 쌓지 않는다 (폰 프레임 예외 제외).

### 5. Inner shadow 금지
Drop shadow만 사용한다. Inner shadow, glow는 시스템 어휘가 아니다.

### 6. Shadow와 Border 병용 금지
층위 표현은 shadow 또는 border 중 하나만. 시스템 명의 중앙 카드 예외를 다른 컴포넌트에서 재현하지 않는다.

### 7. 인스턴스 오버라이드 금지
컴포넌트 인스턴스에서 shadow의 blur·offset·color를 조정하지 않는다. 필요하면 새 Effect Style로 등록.

## Common mistakes to avoid

❌ 임의 shadow 값 사용 (`0 2px 8px rgba(0,0,0,0.1)` 등)
✅ 3개 Effect Style 중 선택. 필요하면 새 스타일 등록 제안

❌ `shadow-card`, `shadow-sheet`를 Variables 컬렉션에 추가
✅ Effect Style로만 관리. Variable 아님

❌ 카드에 shadow + border 동시 적용
✅ 하나만 선택. 시스템 명의 중앙 카드만 예외

❌ 강조를 위해 여러 shadow 겹쳐 쌓기
✅ 단일 shadow. 강조는 색·크기로

❌ Inner shadow, glow 효과 추가
✅ Drop shadow만. 발광 효과는 시스템 어휘 아님

❌ Hover 시 shadow 값 크게 변경
✅ Hover는 `filter: brightness()` 또는 border-color로. Shadow는 층위 표현 전용

❌ SlotCard tally에 shadow-card 추가 (border 이미 있음)
✅ Tally는 border로 층위 표현. Shadow 없음

❌ Push banner에 shadow-card 사용 (층위 낮음)
✅ Push는 최상위 → shadow-banner

❌ 폰 프레임 그림자를 다른 큰 카드에 재현
✅ 폰 프레임 그림자는 기기 규격 예외. 카드는 shadow-card 상한

❌ Figma에서 shadow 값을 raw로 입력 (0, 1, 3, rgba…)
✅ Effect Style 바인딩만 사용

❌ 인스턴스에서 shadow의 blur를 24 → 16으로 조정
✅ 오버라이드 금지. 새 Effect Style이 필요하면 등록 제안