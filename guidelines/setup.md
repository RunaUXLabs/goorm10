# Setup

Figma Make가 Mod U 디자인 시스템 파일을 열어 **개선/확장 작업**을 시작하기 전에 알아야 할 환경 설정. 이 파일은 "무엇이 이미 준비되어 있고, 무엇을 참조해야 하는가"를 규정한다.

## Source of truth

**Figma 라이브러리 파일** = `모두의 시간 (Mod U)`
- 이 파일이 디자인 시스템의 **정본**이다.
- 라이브러리 원본(마스터 컴포넌트·Variables)과 인스턴스 소비 파일이 **동일 Figma 파일 내에 공존**한다.
- 새 화면·컴포넌트를 만들 때는 이 파일 안에서 작업한다. 외부 자산을 임포트하지 않는다.

**참고 자료 (읽기 전용)**
- GitHub 리포지토리 `RunaUXLabs/modu` — 프로토타입 코드. 디자인 의도와 컴포넌트 계약을 확인할 때 참조.
- `docs/design-system/` (리포지토리 내) — 사람용 컴포넌트 문서. Make Kit 작업 중 직접 링크하지 않는다.

## Variables

4개 컬렉션으로 분리. 각 컬렉션은 **Primitive → Semantic 2계층**.

| Collection | 역할 |
|---|---|
| Color | 색상 토큰. Primitive(gray/slate/blue/red/green/amber/alpha/user) → Semantic(bg/surface/text/primary/danger/success/warn/…) |
| Radius | radius-sm(8) / md(12) / lg(16) / full(999) |
| Spacing | space-1~6 (4·8·12·16·20·24px) |
| Typography | Body 스케일 xs/sm/md/lg/xl + fontFamily/weight/lineHeight |

**Mode**: Light only. 다크 모드는 현재 정의되지 않는다. `-dark` 접미가 붙은 semantic 토큰은 앱 셸(테스터 사이드바) 전용이며, 프로덕트 화면 생성 시 사용하지 않는다.

**규칙**:
- 컴포넌트는 **Semantic만 참조**한다. Primitive를 컴포넌트에서 직접 바인딩하지 않는다. (예외: 유저 아바타 색 `user/1~6`)
- Semantic이 없는 값이 필요하면 **먼저 토큰 추가를 제안**하고, raw 값을 임의로 넣지 않는다.
- 상세: `foundations/color.md`, `foundations/spacing.md`, `foundations/radius.md`, `foundations/typography.md`

## Components

모든 컴포넌트는 라이브러리 원본에 **마스터 컴포넌트**로 준비되어 있다. 새로 그리지 않는다.

**참조 규칙**:
1. 신규 화면·개선 작업 시 반드시 기존 마스터 컴포넌트의 **인스턴스**를 사용한다.
2. 시각적 조정은 **variant 선택 + 프로퍼티 오버라이드**로만 처리한다. Detach하지 않는다.
3. 필요한 컴포넌트가 없으면 **먼저 신규 컴포넌트 추가를 제안**하고, 즉석에서 프레임으로 대체하지 않는다.
4. 컴포넌트 카탈로그와 사용 규칙: `components/overview.md`

**배제 대상 (IMPORTANT)**:
- `JudgeBar` — 프로토타입 테스터 컨트롤. 개선/재사용 대상이 아니다. `overview.md`의 Product logic 참조.

## Icons

- 4개 아이콘이 각각 **마스터 컴포넌트**로 존재한다.
- 네이밍: `Icon/Settings`, `Icon/Back`, `Icon/Send`, `Icon/Pin`
- 새 아이콘이 필요하면 **먼저 마스터 컴포넌트 추가를 제안**한다. 이미지·임의 SVG를 삽입하지 않는다.
- 아이콘 색은 currentColor 방식으로 부모 텍스트 색을 따른다. `stroke` 색을 직접 지정하지 않는다.

## Frame conventions

**프로덕트 화면 (ChatRoom, Sheet, 신규 화면 전부)**
- 폭: **390px 고정** (모바일 메신저 컨텍스트)
- 높이: 콘텐츠에 따라 자유. 세로 스크롤 허용.
- 배경: `bg/default` (Semantic)

**앱 셸 (라이브러리 파일의 시연용 레이아웃)**
- 좌측 사이드(440px) + 우측 스테이지(390px)의 데스크톱 2단 구조.
- 이 셸 자체는 개선/재생성 대상이 아니다. 신규 화면은 **stage 내부(390px)**에만 배치한다.

## Fonts

- **Pretendard Variable** 단일 패밀리
- Figma 파일에 웨이트별로 로드되어 있다 (400/500/600/700).
- Fallback: Inter (Typography 컬렉션의 `fontFamily/secondary`에 정의)
- Figma Make가 텍스트를 생성할 때 반드시 Typography 컬렉션의 Variable을 바인딩한다. 폰트명을 직접 입력하지 않는다.

## Scope of Make Kit

이 킷은 아래 작업을 지원한다.

- ✅ **컴포넌트 내부 개선** — variant 추가, 프로퍼티 조정, 시각 다듬기
- ✅ **화면 레이아웃 개선** — 기존 화면(ChatRoom, Sheet 등)의 구조 재구성
- ✅ **신규 화면 추가** — 설정, 온보딩 등 새 페이지 (390px 프레임)

**공통 제약**
- 모든 색·간격·라디우스·타이포는 Variables 바인딩. raw 값 금지.
- 기존 컴포넌트가 있으면 인스턴스로 조립. 프리미티브부터 재구성하지 않는다.
- 제품 규칙(`overview.md`의 Product logic) 위반 금지 — 특히 시스템 명의 원칙, 무응답 처리 계층, 조율 모드 폴백 성격.

## Pre-flight checklist

작업 시작 전 아래 확인:

- [ ] `overview.md` 읽음 (제품 성격 + Non-negotiable rules)
- [ ] `foundations/overview.md` 읽음 (토큰 시스템 개요)
- [ ] 사용할 컴포넌트의 `components/{name}.md` 읽음
- [ ] 새 화면인 경우 `composition/overview.md` 읽음
- [ ] 작업 결과에 raw 색·간격 값이 없는지 검증