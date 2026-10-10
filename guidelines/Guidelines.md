# Mod U Design System — Guidelines Overview

Mod U(모두의 시간)는 팀 채팅방 안에서 "침묵은 동의"라는 원칙으로 회의 시간을 자동 확정하는 인터랙티브 프로토타입입니다. 이 파일은 Figma Make가 Mod U의 디자인 시스템으로 화면을 생성할 때 가장 먼저 읽는 파일입니다. 전체 철학과 규칙을 여기서 요약하고, 세부 내용은 아래 파일들로 라우팅합니다.

## Product character

- **제품 성격**: B2C 인터랙티브 프로토타입, 모바일 메신저 UI (390px 고정 폭)
- **톤**: 침착하고 절제된 시스템 — 사람이 재촉하지 않고, 시스템이 조용히 진행 상황을 알려준다
- **핵심 시각 원칙**:
  - `bg/default` 위에 `surface/default`가 떠 있는 2단 구조로 위계를 만든다. 불필요한 보더는 추가하지 않는다.
  - 팔레트는 뉴트럴 중심. `primary`는 확인·주요 액션에만 sparse하게 사용하고, 상태색(`danger`/`success`/`warn`)은 기능 전용이며 장식적으로 쓰지 않는다.
  - 엘리베이션은 정의된 3단계(`shadow-card` / `shadow-sheet` / `shadow-banner`)만 사용한다.
- **Out of scope**: 데스크톱 레이아웃, 다크모드 전용 화면, 3D/일러스트 헤비 UI, 브랜드 마케팅 페이지. 이 킷은 모바일 메신저 컨텍스트에 한정된다.

## Reading order

### 항상 먼저 (컨텍스트 로드용)
1. `overview.md` (이 파일) — 제품 성격과 규칙
2. `setup.md` — 토큰 임포트, 폰트, 빌드 설정
3. `foundations/overview.md` — 토큰 시스템 개요

### 작업 시작 시
- **컴포넌트 사용** → `components/overview.md`에서 카탈로그 확인 → `components/{name}.md`로 variant/props 확인
- **색/토큰 사용** → `foundations/color.md`의 결정 트리로 어떤 토큰을 쓸지 확인
- **화면 조합·신규 구성** → `composition/overview.md`
- **시스템 메시지(버블) 작성** → `components/bubbles.md` + 아래 Product logic 규칙 준수

가이드라인을 읽지 않고 컴포넌트를 사용하지 않는다.

## Non-negotiable rules

### Product logic (제품 규칙)

IMPORTANT: 버블(`bubbles.jsx`)은 항상 **시스템 명의**의 중앙 카드로 게시한다. 특정 참석자(주최자 포함)의 개인 말풍선처럼 렌더링하지 않는다. 독촉·불참 정리·확정 통보의 주어는 언제나 시스템/규칙이다.

IMPORTANT: 필참자의 무응답은 시스템이 능동적으로 쫓아가 처리하고(계층1 — 잠정 확정), 선택 참석자의 무응답은 그대로 존중하고 응답을 요구하지 않는다. 입력이 결과에 영향을 주는 순간에만 응답을 요청한다.

IMPORTANT: 조율 모드(계층2)는 이의 발생이나 교집합 부재 등 **예외 상황에서만** 진입하는 폴백이다. 기본 플로우로 다루지 않는다.

IMPORTANT: `JudgeBar.jsx`는 제품 밖 테스터 컨트롤 레이어다. 실제 프로덕트 화면을 생성할 때는 참고하거나 재사용하지 않는다.

### System usage (시스템 사용 규칙)

- 모든 색상·간격·라디우스는 `tokens.css`의 토큰만 참조한다. 컴포넌트 CSS에 raw 값을 하드코딩하지 않는다.
- 모든 치수는 4px 배수를 따른다. 허용 예외(타입 스케일 14/18px, 폰 프레임 390px, 자간, 1px 보더)는 각 foundations 파일에 명문화되어 있다.
- 조율 카드에서 색 칩(개인 상태)과 하단 게이지(집단 쏠림)는 서로 다른 시각 채널이다. 하나로 합쳐서 표현하지 않는다.
- 타이포그래피는 Pretendard Variable 단일 패밀리를 쓰고, 위계는 caption(12) < sub(14) < body(16) < title(18) < display(24) 순서를 따른다.