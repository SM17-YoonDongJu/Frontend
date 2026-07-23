/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@insurance/bridge', '@insurance/shared'],
  // BACKEND_ORIGIN(서버 전용 env) 설정 시 /api를 백엔드로 프록시 — 쿠키 퍼스트파티 유지, CORS 불필요
  // 백엔드는 버저닝 없이 루트 경로로 서빙 → /api 프리픽스를 벗겨 전달
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
