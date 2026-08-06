"use client";

import { Suspense } from "react";
import { SignupFunnel } from "./_components/SignupFunnel";
import { SignupRedirectGate } from "./_components/SignupRedirectGate";

export default function SignupPage() {
  return (
    <SignupRedirectGate>
      <Suspense fallback={null}>
        <SignupFunnel />
      </Suspense>
    </SignupRedirectGate>
  );
}
