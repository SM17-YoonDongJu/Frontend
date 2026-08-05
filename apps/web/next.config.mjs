/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@insurance/bridge'],
  // BACKEND_ORIGIN(서버 전용 env) 설정 시 /api를 백엔드로 프록시 — 쿠키 퍼스트파티 유지, CORS 불필요
  // 백엔드는 버저닝 없이 루트 경로로 서빙 → /api 프리픽스를 벗겨 전달
  // 프록시 배포에서만 NEXT_PUBLIC_API_BASE_URL=/api를 함께 주입해 사용(기본 base URL은 프리픽스 없음)
  async rewrites() {
    const backendOrigin = process.env.BACKEND_ORIGIN;
    if (!backendOrigin) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin.replace(/\/$/, '')}/:path*`,
      },
    ];
  },
};

export default nextConfig;
