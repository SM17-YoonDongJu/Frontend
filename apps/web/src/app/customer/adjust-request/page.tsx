"use client";

import { Suspense } from "react";
import { AdjustRequestFunnel } from "./_components/AdjustRequestFunnel";

export default function AdjustRequestPage() {
  return (
    <Suspense fallback={null}>
      <AdjustRequestFunnel />
    </Suspense>
  );
}
