"use client";

import { Suspense } from "react";
import { VerificationContent } from "./_components/VerificationContent";

export default function AdjusterVerificationPage() {
  return (
    <Suspense fallback={null}>
      <VerificationContent />
    </Suspense>
  );
}
