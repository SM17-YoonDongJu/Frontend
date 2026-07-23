/**
 * 백엔드 base URL. 백엔드는 버저닝·프리픽스 없이 루트 경로로 서빙 — 기본값도 프리픽스 없음(모킹 시 MSW가 상대경로를 가로챈다).
 * 프록시 배포 시에만 env로 /api를 주입해 BACKEND_ORIGIN 리라이트가 벗겨 전달.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
