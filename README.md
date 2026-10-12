# goorm10
구름 10회차 협업 연습용 레포입니다.

## 설치

```bash
node -v
pnpm -v
pnpm i
pnpm dev
```

팀 개발 환경은 pnpm 12 기준으로 맞춥니다. pnpm 12에서는 의존성 설치 스크립트가 기본적으로 차단되므로, 이 프로젝트에서 필요한 `@tailwindcss/oxide`, `esbuild`는 `pnpm-workspace.yaml`의 `allowBuilds`에 승인되어 있습니다.
