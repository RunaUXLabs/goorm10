# Radius

Mod U의 모서리 라운드 사용 규칙. 4개 값 + 명문화된 예외로 모든 컴포넌트의 모서리를 표현한다.

## 정본과 참조 관계

- 값 정본: `src/tokens.css` (`--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-full`)
- Figma 정본: `Radius` 컬렉션 (Primitive만, Semantic alias 없음)
- 전체 스타일 표: `docs/design-system/foundation-guide.md` § Radius

## 4단계 radius 토큰

| Token | Value | 성격 | 대표 사용처 |
|---|---|---|---|
| `radius-sm` | 8px | 작은 요소 | 아이콘 버튼, 입력 필드, notice, seg 컨테이너 |
| `radius-md` | 12px | 표준 카드 | 버튼, 카드(내부), 매트릭스 셀, 게이지 |
| `radius-lg` | 16px | 큰 컨테이너 | 버블, 시트 상단, 배너, 판넬 |
| `radius-full` | 999px | 원형/pill | 아바타, 칩, 배지, grab handle |

**Semantic alias 없음**. 컴포넌트는 Primitive 토큰명을 직접 참조한다.

## 라디우스 위계 원칙

요소의 **시각적 크기와 무게에 비례**해 radius를 결정한다.

```
작은 컨트롤(≤32px)     → radius-sm (8px)
중간 컴포넌트(카드, 버튼)  → radius-md (12px)
큰 컨테이너(버블, 시트)   → radius-lg (16px)
원형 요소             → radius-full (999px)
```

**규칙**:
- 큰 컨테이너 안에 작은 요소를 넣을 때, 안쪽 요소의 radius는 바깥보다 작거나 같게.
- 원형 요소(`radius-full`)는 정사각형 프레임에만 적용한다. 직사각형에 999px을 걸면 pill 모양이 되며, 이는 chip·grab handle 등 의도된 경우에만 사용.

## 실제 사용 매핑 (`styles.css` 기반)

각 컴포넌트에서 어떤 radius가 어디에 적용되는지.

### 카드·컨테이너

| 요소 | Radius | 이유 |
|---|---|---|
| `bubble` (시스템 메시지) | 4px 16px 16px 16px | 좌상단 뾰족 + 나머지 `radius-lg` — 말풍선 형태 |
| `bubble.chat__msg--center` | `radius-lg` (16px) | 시스템 명의 카드는 4면 모두 라운드 |
| `chat__text` (일반 말풍선) | 4px 16px 16px 16px | 상대방 메시지 (좌상단 뾰족) |
| `chat__text--mine` | 16px 4px 16px 16px | 내 메시지 (우상단 뾰족) |
| `sheet` (바텀시트) | `radius-lg` 상단 2모서리 | 하단은 폰 프레임에 붙음 |
| `sheet__dim` (배경) | 33px | 폰 프레임 내부 라운드에 맞춤 (예외) |
| `push` (푸시 배너) | `radius-lg` | 큰 오버레이 |

### 버튼·액션

| 요소 | Radius |
|---|---|
| `btn--md` | `radius-md` (12px) |
| `btn--sm` | `radius-sm` (8px) |
| `judge__advance` | `radius-md` |
| `push__cta` | `radius-full` (pill) |
| `pinbar` (내부 링크) | — 라디우스 없음 (bar 자체는 flat) |

### 입력·컨트롤

| 요소 | Radius |
|---|---|
| `field__value` | `radius-sm` |
| `field__input` | `radius-sm` |
| `seg` (컨테이너) | `radius-sm` |
| `chat__settings` (아이콘 버튼) | `radius-sm` |
| `focus-visible` outline | `radius-sm` |

### 카드 (내부 카드)

| 요소 | Radius |
|---|---|
| `slotcard` (기본) | `radius-md` |
| `slotcard__gauge` | 0 0 `radius-md` `radius-md` (하단만) |
| `matrix__cell` | `radius-sm` |
| `board` (현황판) | `radius-md` |
| `notice` | `radius-sm` |
| `sheet__escalation` | `radius-md` |
| `judge` (컨테이너) | `radius-lg` |
| `judge__member` (멤버 카드) | `radius-md` |
| `judge__stage` (배지) | `radius-full` |

### 원형·pill

| 요소 | Radius | 크기 |
|---|---|---|
| `avatar--sm` / `avatar--md` | `radius-full` | 28px / 40px (정사각) |
| `chip` | `radius-full` | 자동 (pill) |
| `push__cta` | `radius-full` | 자동 (pill) |
| `judge__stage` | `radius-full` | 자동 (pill) |
| `hintbar__badge` | `radius-full` | 자동 (pill) |
| `matrix__role` | `radius-full` | 20×20px (정원) |
| `sheet__grab` | `radius-full` | 44×4px (pill) |
| Scrollbar thumb | `radius-full` | 자동 |

### 폰 프레임 (기기 규격 예외)

| 요소 | Radius |
|---|---|
| `phone` 외곽 | 38px |
| `phone__notch` (Dynamic Island) | `radius-full` |

## 말풍선 뾰족 모서리 (특수 케이스)

채팅 말풍선은 **한 모서리만 4px**로 뾰족하게 만들어 방향성을 표현한다.

| 대상 | 값 | 뾰족 위치 |
|---|---|---|
| 상대방 메시지 (`chat__text`) | `4px 16px 16px 16px` | 좌상단 |
| 내 메시지 (`chat__text--mine`) | `16px 4px 16px 16px` | 우상단 |
| Bubble (시스템 메시지) | `4px 16px 16px 16px` | 좌상단 (시스템 명의) |

**4px**는 예외값이며, 이 세 컴포넌트 외에서 재현하지 않는다. 뾰족 모서리는 "누가 말했는가"의 방향을 표시하는 어휘.

시스템 메시지 중 **중앙 정렬 카드**(`.chat__msg--center .bubble`)는 뾰족 없이 4면 모두 `radius-lg`로 오버라이드한다 — 시스템 명의는 특정 방향을 갖지 않기 때문.

## 허용된 예외 목록

4개 토큰 밖의 값 중 명문화된 예외.

### 1. 말풍선 뾰족 (4px)
위 "말풍선 뾰족 모서리" 섹션 참조. 3개 컴포넌트에서만.

### 2. 폰 프레임 (기기 규격)

| 값 | 사용처 |
|---|---|
| 38px | iPhone 16 Pro 외곽 |
| 33px | Sheet dim (내부 라운드 맞춤) |
| 20px / 24px / 28px / 32px | 구형 폰 프레임 규격 (레거시) |

이들은 하드웨어 규격 재현이며 다른 컴포넌트에 확장하지 않는다.

## Figma 적용 규칙

Figma에서 radius를 적용하는 방식.

1. **단일 라디우스**: 4면 동일할 때는 corner radius에 `radius-*` Variable 바인딩.
2. **개별 모서리**: 말풍선처럼 모서리별로 다를 때는 corner별 개별 지정. 3면은 Variable, 1면은 raw 4px.
3. **원형/pill**: `radius-full`(999px)을 corner radius에 바인딩. Figma가 요소 크기에 맞춰 pill 처리.
4. **부분 라운드**: 시트 상단만, 게이지 하단만 등은 개별 corner 지정. 두 corner에 Variable, 두 corner에 0.

## Non-negotiable rules

### 1. 4단계 밖의 값 금지
`radius-sm/md/lg/full` 외 값(6px, 10px, 20px 등)을 사용하지 않는다. 예외 목록의 값(4px 말풍선, 38px 폰 프레임 등)만 허용.

### 2. Radius Semantic alias 만들지 않기
`--radius-card`, `--radius-button` 같은 semantic 명칭을 새로 만들지 않는다. Primitive 4단계로 충분.

### 3. 위계 유지
큰 컨테이너 안의 작은 요소가 더 큰 radius를 갖지 않는다. Bubble(16px) 안의 SlotCard(12px), SlotCard 안의 Chip(999px pill)은 크기가 작아지므로 예외.

### 4. 뾰족 모서리는 3개 컴포넌트만
4px 뾰족은 `chat__text`, `chat__text--mine`, `bubble`(시스템 메시지 좌상단)에서만 사용한다. 새 컴포넌트에서 뾰족을 만들지 않는다.

### 5. 원형(`radius-full`)은 의도된 경우만
- 아바타·아이콘 배지 (정사각 → 정원)
- Chip·pill·grab handle (직사각 → pill)
- 새 요소에 `radius-full`을 임의로 적용하지 않는다. Pill 모양의 의미(상태·태그)가 있을 때만.

### 6. Border는 라디우스와 독립
1px 보더가 있어도 라디우스는 요소 크기 기준으로 결정한다. 보더 두께에 따라 radius를 조정하지 않는다.

## Common mistakes to avoid

❌ 6px, 10px, 20px 등 스케일 외 라디우스 사용
✅ `radius-sm/md/lg/full` 중 선택

❌ 카드 안의 작은 배지에 `radius-lg` 사용 (부모보다 큰 라디우스)
✅ 자식은 부모보다 작거나 같은 radius. 배지는 `radius-full` 또는 `radius-sm`

❌ `--radius-card`, `--radius-button` 등 semantic alias 추가
✅ 4단계 Primitive로 커버. 컴포넌트별 매핑은 문서로 관리

❌ 새 컴포넌트에서 4px 뾰족 모서리 흉내
✅ 뾰족은 말풍선(chat/bubble) 3개 컴포넌트에서만

❌ 직사각형 컨테이너에 `radius-full` 걸어 pill 만들기 (의미 없이)
✅ Pill은 chip·배지·grab 등 어휘가 있는 경우만

❌ 시트 4면 모두 `radius-lg` 적용
✅ 상단 2모서리만. 하단은 폰 프레임에 붙으므로 0

❌ Figma에서 라디우스 값을 raw 숫자(12)로 입력
✅ `radius-md` Variable 바인딩

❌ 폰 프레임 38px 라디우스를 다른 큰 카드에 재현
✅ 38px은 기기 규격 예외. 큰 카드는 `radius-lg`(16px) 상한