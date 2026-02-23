/** @type {import('next').NextConfig} */
const nextConfig = {
  // 백엔드 API URL 환경 변수 검증
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
