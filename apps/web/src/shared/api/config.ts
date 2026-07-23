/**
 * 백엔드 base URL. 백엔드는 버저닝 없이 루트 경로로 서빙(/api/v1 없음).
 * 기본값 /api는 동일 오리진 프록시 프리픽스 — BACKEND_ORIGIN 리라이트가 벗겨 전달하고, 모킹 시엔 MSW가 가로챈다.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
