import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "바른보상 | 손해사정 매칭 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const gowunBatang = await readFile(
    join(process.cwd(), "public/fonts/GowunBatang-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          backgroundColor: "#f4f1ea",
          borderBottom: "16px solid #182740"
        }}
      >
        <div style={{ fontSize: 112, color: "#182740", letterSpacing: -2 }}>바른보상</div>
        <div style={{ width: 120, height: 3, backgroundColor: "#b0822e" }} />
        <div style={{ fontSize: 40, color: "#3c4856" }}>
          받은 보험금, 제대로 받았는지 확인하세요
        </div>
        <div style={{ fontSize: 28, color: "#7b8693" }}>www.brbosang.com</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Gowun Batang", data: gowunBatang, weight: 700, style: "normal" }]
    }
  );
}
