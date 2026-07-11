import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // DSN 미주입 환경(로컬 dev·CI E2E·MSW)은 전송 자체를 차단한다
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "production",
  // 에러 수집만 — 성능 계측 도입 시 plans/sentry-adoption.md 운영 절 참고
  tracesSampleRate: 0,
});

// oxlint-disable-next-line import/namespace -- 클라이언트 전용 export를 서버 엔트리 기준으로 해석하는 오탐
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
