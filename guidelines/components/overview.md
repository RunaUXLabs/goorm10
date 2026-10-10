# Components Overview

Mod U의 컴포넌트 시스템 사용 규칙. Figma 라이브러리에 등록된 마스터 컴포넌트를 인스턴스로 조립하는 방식을 정의한다.

## 정본과 참조 관계

- 코드 정본: `src/components/` (jsx 파일들)
- Figma 정본: 라이브러리 파일의 컴포넌트 페이지
- 상세 컴포넌트 문서: `docs/design-system/atoms|molecules|organisms/*.md`
- Make Kit용 요약: 이 폴더의 각 `{name}.md`

## 컴포넌트 카탈로그

Mod U는 6개 파일로 관리되는 컴포넌트 세트다.

| 파일 | 코드 위치 | 포함 컴포넌트 | 성격 |
|---|---|---|---|
| `primitives.md` | `primitives.jsx` | Avatar, Button, Chip, SegButton, Notice, NameFlow | 최소 단위 (atoms) |
| `icons.md` | `primitives.jsx` (SVG) | IconSettings, IconBack, IconSend, IconPin | 아이콘 4종 |
| `bubbles.md` | `bubbles.jsx` | ComposeBubble, ProposalBubble, CoordinationBubble, ConfirmedBubble, NoSlotBubble | 시스템 메시지 |
| `slotcard.md` | `SlotCard.jsx` | Hero, Tally, Respond, Preset variants | 시간 슬롯 카드 |
| `sheet.md` | `Sheet.jsx` | 바텀시트 + Compose/Respond/Escalation 섹션 | 바텀시트 |
| `chatroom.md` | `ChatRoom.jsx` | 채팅방 셸, 메시지 행 배치, PinBar/HintBar/PushBanner | 화면 셸 |

**JudgeBar는 카탈로그에 포함되지 않는다.** 테스터 컨트롤이며 프로덕트 화면 생성 시 재사용 대상이 아니다 (Guidelines.md의 IMPORTANT 참조).

## 컴포넌트 조립 원칙

### 1. 인스턴스 우선

모든 컴포넌트는 라이브러리 원본에 마스터로 존재한다. 새 화면·개선 작업 시:

1. 필요한 컴포넌트를 카탈로그에서 확인
2. 마스터 컴포넌트의 **인스턴스를 배치**
3. Variant·프로퍼티·Semantic 토큰 오버라이드로 시각 조정
4. Detach·재제작 금지

### 2. 상위 컴포넌트는 하위 컴포넌트의 인스턴스로 조립

Mod U는 원자(atoms) → 분자(molecules) → 유기체(organisms) 순으로 커진다. 상위는 하위를 **인스턴스로 조립**하며, 하위 어휘를 재생성하지 않는다.

예:
- Bubble은 내부에 Avatar·Chip·Button·Notice 인스턴스를 조립
- Sheet는 SlotCard·Button·Notice·Field 인스턴스를 조립
- ChatRoom은 Bubble·MessageBubble·PinBar·HintBar 인스턴스를 조립

### 3. 필요한 컴포넌트가 없으면 추가 제안

카탈로그에 없는 컴포넌트가 필요하면:

1. 기존 컴포넌트의 오버라이드 조합으로 해결 가능한지 먼저 확인
2. 불가능하면 **신규 컴포넌트 추가를 제안**
3. 즉석에서 프레임·그룹으로 대체 구성하지 않는다

## Base + Override 재선언

Guidelines.md의 규칙을 컴포넌트 층위에서 반복.

### Figma variant는 크기 축에만

Mod U는 컴포넌트당 **base variant 1개**만 유지한다. Figma의 물리적 variant는 **크기 축(size)**에만 사용:

- Avatar: `size: md | sm`
- Button: `size: md | sm`

이 외 색·톤·상태는 **인스턴스 오버라이드**로 처리한다.

### 코드 variant prop과의 차이

코드에서 `<Button variant="danger">`, `<Chip tone="warn">` 같은 prop은 **시각 톤 선택자**다. 내부적으로 Semantic 토큰 바인딩을 오버라이드한다.

Figma에는 이런 variant가 **없다**. Button base에 `background: danger/weak` + `text: danger/default`를 오버라이드한 인스턴스로 표현된다.

### 오버라이드 화이트리스트

각 컴포넌트에서 허용되는 오버라이드 조합은 **화이트리스트**로 관리된다. 각 컴포넌트 문서의 "Base + Override 정책" 섹션에 명시.

- 예: Button은 primary / secondary / danger / ghost 4가지 톤만 허용
- 예: Chip은 neutral / primary / danger / success / warn 5가지 톤만 허용
- 화이트리스트 밖 조합이 필요하면 **먼저 문서 갱신 제안**

## 화면별 조립 예시

### ChatRoom 화면

```
ChatRoom (organism)
├── PinBar (molecule)
├── HintBar (molecule)
├── PushBanner (molecule, 조건부)
└── 메시지 리스트
    ├── DateDivider (atom)
    ├── MessageRow (molecule)
    │   ├── Avatar (atom)
    │   ├── 이름 라벨 (atom)
    │   └── 말풍선 텍스트 (atom)
    └── SystemMessage (organism, 중앙 정렬)
        └── Bubble (organism)
            ├── Avatar들
            ├── Chip들
            ├── SlotCard들
            └── Button들
```

### Sheet 화면

```
Sheet (organism)
├── Grab handle (atom)
├── Body
│   ├── Section (compose | respond | escalation)
│   │   ├── SectionTitle (atom)
│   │   ├── Field / SlotCard / Notice
│   │   └── SegButton
│   └── ...
└── Footer
    └── Button (primary CTA)
```

## 아이콘 처리 방식

아이콘은 `Icon/*` 네이밍의 마스터 컴포넌트로 존재한다.

### 규칙

1. **currentColor**: 아이콘 색은 부모 텍스트 색을 상속받는다. 인스턴스에서 색을 직접 지정하지 않는다.
2. **크기 인라인 유지**: 코드에서 각 아이콘은 고정 크기(20/24/14px 등)를 가진다. 아이콘별 크기는 `icons.md` 참조.
3. **stroke 기반**: 모든 아이콘은 stroke 방식(fill 없음). Figma에서 outline mode 유지.
4. **신규 아이콘은 컴포넌트 등록**: 임의 SVG·이미지 삽입 금지. 필요하면 신규 마스터 컴포넌트 추가 제안.

상세: `icons.md`

## 신규 컴포넌트 추가 절차

새 컴포넌트가 필요할 때의 결정 순서.

### Step 1. 기존 컴포넌트의 오버라이드로 해결되는가?

- 색·톤·크기 차이 → 기존 컴포넌트 인스턴스에 오버라이드
- 배치·조합 차이 → 기존 컴포넌트를 조립한 새 프레임

### Step 2. 여러 곳에서 반복되는가?

- 1회성 배치 → 화면 내부 프레임으로 조립
- 2회 이상 반복 → 새 컴포넌트로 등록 검토

### Step 3. 어느 tier에 속하는가?

- 최소 단위(재사용) → Atom (primitives.md에 추가)
- 원자 2~3개 조합 → Molecule (신규 파일 또는 기존 파일에 추가)
- 화면 단위 조립 → Organism (신규 파일)

### Step 4. 등록

1. Figma 라이브러리에 마스터 컴포넌트 추가
2. `components/{name}.md` 문서 작성 (또는 기존 파일에 섹션 추가)
3. `components/overview.md`의 카탈로그 갱신
4. `docs/design-system/`의 아톰/분자/유기체 문서도 함께 갱신

## Non-negotiable rules

### 1. 마스터 컴포넌트만 사용
프로덕트 화면의 모든 요소는 라이브러리 마스터 컴포넌트의 인스턴스여야 한다. 임의 프레임·그룹으로 대체하지 않는다.

### 2. Detach 금지
컴포넌트 인스턴스를 detach해서 커스텀 구조로 변형하지 않는다. Detach가 필요한 상황은 대부분 신규 컴포넌트 추가가 필요한 상황이다.

### 3. 카탈로그 밖 컴포넌트 금지
위 카탈로그의 6개 파일에 등록되지 않은 컴포넌트는 사용하지 않는다. 필요하면 추가 절차 준수.

### 4. JudgeBar 재사용 금지
JudgeBar는 프로토타입 테스터 컨트롤이다. 프로덕트 화면 생성 시 참조·재사용하지 않는다.

### 5. 상위는 하위의 인스턴스로 조립
Bubble·Sheet·ChatRoom 같은 상위 컴포넌트는 하위 원자를 **인스턴스로** 조립한다. 원자의 스타일을 상위에서 재정의하지 않는다.

### 6. 화이트리스트 준수
각 컴포넌트의 "Base + Override 정책" 화이트리스트 밖 조합을 만들지 않는다.

### 7. 크기 variant만 물리적
Figma variant는 size 축만. Color·tone·state는 오버라이드로.

## Common mistakes to avoid

❌ 필요한 컴포넌트가 라이브러리에 없어 프레임+텍스트로 즉석 조립
✅ 신규 컴포넌트 추가 제안 후 마스터로 등록

❌ 기존 Button을 detach해서 새 스타일 만들기
✅ 오버라이드로 해결. 안 되면 새 컴포넌트 등록

❌ 상위 컴포넌트(Bubble)에서 Avatar 색·크기를 직접 CSS로 지정
✅ Avatar 인스턴스에 프로퍼티/오버라이드 적용

❌ JudgeBar의 스타일을 참고해서 다크 톤 카드 만들기
✅ JudgeBar는 앱 셸 전용. 프로덕트 화면은 Light only

❌ Danger 상태를 위해 Button-Danger variant 새로 등록
✅ Base Button에 `danger/weak` + `danger/default` 오버라이드

❌ 카탈로그에 없는 Modal·Toast·Dropdown 등을 임의 조립
✅ 신규 컴포넌트 등록 절차 준수

❌ SlotCard의 hero variant를 detach해서 tally에 hero 스타일 적용
✅ 각 variant는 별개 어휘. 필요하면 새 variant 등록 검토

❌ 아이콘을 SVG 코드로 인라인 삽입
✅ Icon/* 마스터 컴포넌트 인스턴스만 사용

❌ 화면별로 커스텀 Notice 스타일 만들기 (동그란 배지형, 아이콘 붙은 형 등)
✅ Notice의 tone 오버라이드로 해결. 필요하면 화이트리스트 확장 제안

❌ Bubble 내부에 Avatar를 직접 그림 (원 프레임 + 텍스트)
✅ Avatar 마스터 인스턴스 사용

❌ 컴포넌트 문서를 읽지 않고 인스턴스 프로퍼티만 조작
✅ 각 컴포넌트의 화이트리스트·오버라이드 규칙을 문서에서 먼저 확인