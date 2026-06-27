// Figma 변환 검증용 스크린샷 헬퍼 (값 하드코딩 없음 — 전 페이지 재사용).
// 구현 페이지를 PNG로 찍어 Figma get_screenshot과 눈으로 대조한다.
//
// 사용 (PowerShell 툴에서 — Bash 툴은 node가 PATH에 없음):
//   node scripts/figma-shot.mjs --url http://localhost:3000/abc --out shot.png
//   node scripts/figma-shot.mjs --url .../abc --out card.png --selector "text=정우성" --closest article
//   node scripts/figma-shot.mjs --url .../abc --out full.png --full
//
// 전제: dev 서버가 떠 있어야 함(pnpm --filter web dev → localhost:3000).
// 이 파일은 apps/web 안에 있어야 @playwright/test 모듈이 해석됨.

import { chromium } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
}

const url = arg("url");
// 기본 출력은 레포 밖 OS temp — PNG가 git에 섞이지 않게. 찍고 대조 후 삭제.
const out = arg("out", join(tmpdir(), "figma-shot.png"));
const selector = arg("selector");
const closest = arg("closest"); // 선택자 요소의 상위 컨테이너로 확장(예: article)
const full = arg("full", false);
const width = Number(arg("width", 1280));
const scale = Number(arg("scale", 2));

if (!url) {
  console.error("필수: --url <주소>");
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 1200 },
  deviceScaleFactor: scale
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const resp = await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

if (selector) {
  // 한글/중복 텍스트 함정: 부분매칭 권장, 카드 단위 비교는 --closest article
  let target = page.locator(selector).first();
  if (closest) {
    const box = await target.evaluate((el, sel) => {
      const r = (el.closest(sel) ?? el).getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }, closest);
    await page.screenshot({
      path: out,
      clip: { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8 }
    });
  } else {
    await target.screenshot({ path: out });
  }
} else {
  await page.screenshot({ path: out, fullPage: Boolean(full) });
}

console.log(`saved ${out} (status ${resp?.status()}, console errors: ${errors.length || "none"})`);
await browser.close();
