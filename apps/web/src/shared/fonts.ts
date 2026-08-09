import { Gowun_Batang, Inter } from "next/font/google";

/**
 * 본문 산세(Inter) + 타이틀 세리프(Gowun Batang) 로더.
 * next/font 로더는 클라이언트 컴포넌트에서 호출할 수 없어, 여기(비클라이언트 모듈)에 모아
 * layout·global-error가 클래스 문자열만 import 해서 <html>에 부여한다.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  variable: "--font-gowun-batang",
  display: "swap",
  preload: false
});

export const fontVariables = `${inter.variable} ${gowunBatang.variable}`;
