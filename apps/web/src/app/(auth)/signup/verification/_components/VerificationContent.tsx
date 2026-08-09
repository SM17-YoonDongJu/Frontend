"use client";

import { useIsDesktop } from "../_hooks/use-is-desktop";
import { useVerificationForm } from "../_hooks/use-verification-form";
import { VerificationForm } from "./VerificationForm";
import { VerificationFunnel } from "./VerificationFunnel";

export function VerificationContent() {
  const isDesktop = useIsDesktop();
  // 뷰포트별 노출 필드 차이(데스크톱=연락처·이메일 미노출)를 검증에 반영.
  const form = useVerificationForm(isDesktop === true);

  // mount 전엔 레이아웃 확정 보류(하이드레이션 불일치 방지).
  if (isDesktop === null) return null;
  return isDesktop ? <VerificationForm form={form} /> : <VerificationFunnel form={form} />;
}
