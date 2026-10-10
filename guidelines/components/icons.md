# Icons

Mod U의 아이콘 4종. 최소 어휘로 유지되며, 모든 아이콘은 마스터 컴포넌트로 등록되어 있다.

## 정본과 참조 관계

- 코드 정본: `src/components/primitives.jsx` (SVG 인라인 함수)
- Figma 정본: `Icon/*` 마스터 컴포넌트
- 상세 문서: `docs/design-system/atoms/icons.md`

## 포함 아이콘

| 아이콘 | Figma 컴포넌트 | 코드 함수 | 크기 | 사용처 |
|---|---|---|---|---|
| Settings | `Icon/Settings` | `IconSettings` | 20×20 | 채팅 헤더 우측 |
| Back | `Icon/Back` | `IconBack` | 24×24 | 채팅 헤더 좌측 |
| Send | `Icon/Send` | `IconSend` | 20×20 | 채팅 입력창 |
| Pin | `Icon/Pin` | `IconPin` | 14×14 | PinBar 좌측 |

## 공통 스펙

모든 아이콘이 공유하는 시각 언어.

### Stroke 기반

| 속성 | 값 |
|---|---|
| Fill | 없음 (`fill="none"`) |
| Stroke color | `currentColor` (부모 텍스트 색 상속) |
| Stroke width | 1.8 (Pin은 2) |
| Stroke linecap | round |
| Stroke linejoin | round |

**규칙**: 모든 아이콘은 stroke 방식이다. Fill 방식 아이콘을 추가하지 않는다.

### currentColor 원칙

아이콘 색은 부모 요소의 `color` 속성을 상속한다. 인스턴스에서 stroke 색을 직접 지정하지 않는다.

```jsx
// 예: 부모 색을 상속
<button className="chat__settings" style={{ color: 'var(--color-text-sub)' }}>
  <IconSettings />
</button>
```

부모의 텍스트 색이 바뀌면 아이콘 색도 자동으로 함께 바뀐다. Hover·상태 변화에 유연하게 대응.

### 접근성

| 속성 | 값 |
|---|---|
| `aria-hidden` | `"true"` (장식 아이콘) |
| 대체 텍스트 | 부모 버튼의 `aria-label` 또는 텍스트 라벨에서 제공 |

**규칙**: 아이콘은 장식으로 취급한다. 의미 전달은 함께 배치된 텍스트·라벨이 담당.

---

# IconSettings

톱니바퀴 형태. 설정 진입점.

## 사양

| 속성 | 값 |
|---|---|
| 크기 | 20×20 |
| viewBox | `0 0 24 24` |
| Stroke width | 1.8 |
| 구성 | circle(중앙) + gear path |

## 사용처

- 채팅 헤더 우측 (`chat__settings`) — 방 설정 진입

## Figma 매핑

- **마스터**: `Icon/Settings`
- **Variants**: 없음
- **크기**: 20×20 프레임 고정
- **Stroke color**: currentColor (인스턴스에서 오버라이드 금지)

---

# IconBack

좌측 방향 화살표. 뒤로가기.

## 사양

| 속성 | 값 |
|---|---|
| 크기 | 24×24 |
| viewBox | `0 0 24 24` |
| Stroke width | 1.8 |
| Path | `M15 18l-6-6 6-6` |

## 사용처

- 채팅 헤더 좌측 (`chat__back`) — 이전 화면으로 이동

## Figma 매핑

- **마스터**: `Icon/Back`
- **Variants**: 없음
- **크기**: 24×24 프레임 고정
- **Stroke color**: currentColor

---

# IconSend

종이비행기 형태. 메시지 전송.

## 사양

| 속성 | 값 |
|---|---|
| 크기 | 20×20 |
| viewBox | `0 0 24 24` |
| Stroke width | 1.8 |
| Path | 종이비행기 (라인 + 다각형) |

## 사용처

- 채팅 입력창 우측 (`chat__send`) — 메시지 전송

## Figma 매핑

- **마스터**: `Icon/Send`
- **Variants**: 없음
- **크기**: 20×20 프레임 고정
- **Stroke color**: currentColor

---

# IconPin

압정 형태. 고정된 정보 표시.

## 사양

| 속성 | 값 |
|---|---|
| 크기 | 14×14 (다른 아이콘보다 작음) |
| viewBox | `0 0 24 24` |
| Stroke width | 2 (다른 아이콘보다 두꺼움) |
| Path | 압정 (상단 라인 + 하단 삼각형) |

**주의**: IconPin은 다른 아이콘과 다른 크기·굵기를 가진다. PinBar 안의 인라인 요소로 작게 사용되기 때문.

## 사용처

- PinBar 좌측 (`pinbar` 내부) — 고정 정보 표식

## Figma 매핑

- **마스터**: `Icon/Pin`
- **Variants**: 없음
- **크기**: 14×14 프레임 고정
- **Stroke color**: currentColor

---

## 크기 규칙

Mod U의 아이콘은 3단계 크기로 존재한다.

| 크기 | 아이콘 | 컨텍스트 |
|---|---|---|
| 24px | Back | 헤더 주요 액션 |
| 20px | Settings, Send | 헤더·입력창 표준 크기 |
| 14px | Pin | 인라인 배지 크기 |

**규칙**:
- 새 아이콘 추가 시 위 3단계 중 컨텍스트에 맞는 크기 선택
- 임의 크기(16, 18, 22 등) 사용 금지
- 같은 아이콘을 여러 크기로 확장할 필요가 있으면 **크기 variant를 추가**하지 말고, 각 크기별로 별도 마스터 컴포넌트로 등록 (예: `Icon/Settings-20`, `Icon/Settings-16`)

## 조립 규칙

### 아이콘은 인라인 요소로 배치

- 항상 텍스트·버튼과 함께 배치
- 단독으로 큰 그래픽 요소로 사용 금지
- 아이콘 옆에 라벨이 있으면 gap은 `space-1` (4px) 또는 `space-2` (8px)

### 아이콘 버튼 패턴

아이콘만으로 구성된 버튼은 아래 규칙 준수:

| 속성 | 값 |
|---|---|
| Padding | `space-1` (4px) |
| Radius | `radius-sm` |
| Hover | 부모 텍스트 색 변경 (currentColor 상속) |
| Aria label | 필수 (버튼의 목적을 텍스트로) |

예: `chat__settings` (아이콘 버튼 형태)

```jsx
<button
  className="chat__settings"
  aria-label="채팅방 설정"
>
  <IconSettings />
</button>
```

## 신규 아이콘 추가 절차

새 아이콘이 필요한 경우.

### Step 1. 기존 아이콘으로 대체 가능한가?

- 유사한 의미의 기존 아이콘이 있으면 재사용
- 없으면 다음 단계

### Step 2. 정말 아이콘이 필요한가?

- 텍스트 라벨로 충분한 경우 아이콘 없이 진행
- 아이콘이 반드시 필요한 경우(공간 제약, 반복 사용) 다음 단계

### Step 3. 마스터 컴포넌트 등록

1. Figma에 `Icon/{Name}` 마스터 컴포넌트 생성
   - 크기: 20×20 우선 (다른 크기 필요 시 명확한 이유 있어야 함)
   - viewBox: `0 0 24 24`
   - Stroke width: 1.8 (미세 아이콘은 2)
   - `fill="none"`, `stroke="currentColor"`, `stroke-linecap="round"`, `stroke-linejoin="round"`
2. 코드에 `Icon{Name}` 함수 추가 (`primitives.jsx`)
3. 이 문서(`icons.md`)에 새 섹션 추가
4. `components/overview.md`의 아이콘 언급 갱신

### Step 4. 문서 갱신

- 사용처 명시
- 크기·굵기·viewBox 기록
- 다른 아이콘과의 차이점 있으면 명시

## Do / Don't

✅ 아이콘 색은 부모 텍스트 색 상속 (`currentColor`)
✅ Figma 마스터 컴포넌트 인스턴스만 사용
✅ 장식 아이콘은 `aria-hidden="true"`
✅ 아이콘 버튼은 반드시 `aria-label` 제공
✅ 스펙된 3단계 크기(24/20/14) 중 선택
✅ Stroke 방식 유지 (fill 없음)

❌ SVG 코드를 화면에 인라인 삽입 (마스터 컴포넌트 미사용)
❌ 아이콘 stroke·fill 색을 인스턴스에서 직접 지정
❌ Fill 방식 아이콘 추가
❌ 임의 크기(16, 18, 22px 등) 사용
❌ 아이콘만 크게 확대해서 일러스트처럼 사용
❌ 아이콘 옆 텍스트 없이 단독 사용 (aria-label로만 접근성 확보)
❌ Stroke width를 화면별로 조정 (1.8 또는 2 고정)
❌ 여러 아이콘을 겹쳐 조합 (compound icon 만들지 않음)
❌ 애니메이션 효과 추가 (정적 아이콘 유지)
❌ 컬러 아이콘·그라데이션·이미지로 대체

## Figma 컴포넌트 세트 구조

```
Icons (Page)
├── Icon/Settings
├── Icon/Back
├── Icon/Send
└── Icon/Pin
```

- 각 아이콘은 **별도 마스터 컴포넌트**로 등록 (component set 아님)
- Variant 없이 단일 컴포넌트
- 네이밍: `Icon/{PascalCase}` 형식 준수
- 새 아이콘 추가 시 동일 규칙 따름

## Common mistakes to avoid

❌ 필요한 아이콘이 없어 이모지·특수문자로 대체
✅ 신규 아이콘 추가 절차 준수

❌ Material Icons·Feather Icons 등 외부 아이콘 세트 임포트
✅ Mod U 내부 아이콘만 사용. 외부 세트 금지

❌ 아이콘 hover 시 stroke 색을 인스턴스에서 오버라이드
✅ 부모 요소의 `color`를 hover에서 변경 (currentColor 상속)

❌ Pin 아이콘을 다른 곳에서 20px로 확대 사용
✅ 각 아이콘은 스펙된 크기 유지. 새 크기가 필요하면 별도 컴포넌트 등록

❌ 새 아이콘을 24px로 등록 (Back과 헷갈릴 크기)
✅ 표준 크기 20px 우선. 명확한 이유가 있을 때만 24px

❌ 컬러 아이콘·그라데이션 아이콘 추가
✅ 단색 stroke 유지. 색은 부모 상속

❌ 아이콘에 배경(fill 색)을 추가해 배지처럼 사용
✅ 배지가 필요하면 Chip 사용. 아이콘은 stroke만

❌ 아이콘 stroke width를 1로 얇게 조정
✅ 1.8 또는 2 유지. Stroke 굵기는 시스템 일관성

❌ Figma에서 아이콘 컴포넌트를 flatten해서 shape로 변경
✅ 벡터 path 유지. Detach·flatten 금지