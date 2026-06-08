"use client";

import { use } from "react";
import type { ReactNode } from "react";

const mockingReadyPromise: Promise<void> =
  typeof window !== "undefined" && process.env.NODE_ENV === "development"
    ? import("./browser").then(async ({ worker }) => {
        await worker.start({ onUnhandledRequest: "bypass" });
      })
    : Promise.resolve();

export function MockProvider({ children }: { children: ReactNode }) {
  use(mockingReadyPromise);
  return children;
}
