"use client";

import { use } from "react";
import type { ReactNode } from "react";

// CI E2E는 production 빌드(next build && next start)로 돌므로 NODE_ENV 대신 플래그로도 켠다.
const mockingEnabled =
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ||
  process.env.NODE_ENV === "development";

const mockingReadyPromise: Promise<void> =
  typeof window !== "undefined" && mockingEnabled
    ? import("./browser").then(async ({ worker }) => {
        await worker.start({ onUnhandledRequest: "bypass" });
      })
    : Promise.resolve();

export function MockProvider({ children }: { children: ReactNode }) {
  use(mockingReadyPromise);
  return children;
}
