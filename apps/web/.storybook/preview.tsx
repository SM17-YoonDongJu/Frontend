import type { Preview } from "@storybook/nextjs-vite";
// #12 디자인 토큰 + Tailwind v4 유틸 주입
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      options: {
        paper: { name: "paper", value: "#f4f1ea" },
        card: { name: "card", value: "#ffffff" }
      }
    },
    a11y: {
      // 'todo' = 위반을 테스트 UI에만 표시 / 'error' = CI 실패 / 'off' = 끔
      test: "todo"
    }
  },
  initialGlobals: {
    backgrounds: { value: "paper" }
  }
};

export default preview;
