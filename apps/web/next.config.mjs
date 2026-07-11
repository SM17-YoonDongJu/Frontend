import { execSync } from 'node:child_process';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@insurance/bridge', '@insurance/shared'],
};

// SDK v9부터 Next.js Build ID 폴백이 제거돼 release 미명시 시 소스맵 매칭이 조용히 깨진다.
function resolveRelease() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return undefined;
  }
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // 소스맵 업로드는 토큰이 주입된 빌드(main/dev push CI)에서만 수행, 없으면 자동 스킵
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // 고정 문자열만 허용(Turbopack) — 미설정 시 광고차단기에 클라이언트 이벤트 유실
  tunnelRoute: '/monitoring',
  release: { name: resolveRelease() },
});
