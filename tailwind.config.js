/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind가 스캔할 파일 경로
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // PromptHub 커스텀 색상
      colors: {
        // 배경색 계열 (다크모드)
        bg: {
          primary:   "#111111",   // 메인 배경
          secondary: "#1a1a1a",   // 카드/사이드바 배경
          tertiary:  "#222222",   // 입력창/호버 배경
          border:    "#2a2a2a",   // 테두리
        },
        // 보라색 (Primary Color)
        purple: {
          DEFAULT: "#6366f1",
          light:   "#818cf8",
          dark:    "#4f46e5",
        },
      },
      // 커스텀 폰트
      fontFamily: {
        sans: ["Inter", "Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
};
