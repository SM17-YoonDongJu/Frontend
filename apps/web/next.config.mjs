/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@insurance/bridge', '@insurance/shared'],
  // BACKEND_ORIGIN(서버 전용 env) 설정 시 /api/v1을 백엔드로 프록시 — 쿠키 퍼스트파티 유지, CORS 불필요
  async rewrites() {
    const backendOrigin = process.env.BACKEND_ORIGIN;
    if (!backendOrigin) return [];
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin.replace(/\/$/, '')}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
