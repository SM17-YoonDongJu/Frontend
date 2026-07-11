"use client";

import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Button } from "@/shared/ui/Button";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { useVerificationFunnel } from "../_hooks/use-verification-funnel";
import { StepBasicInfo } from "./StepBasicInfo";
import { StepDocuments } from "./StepDocuments";
import { StepExpertise } from "./StepExpertise";
import { SubmitErrorNotice } from "./SubmitErrorNotice";
import { VerificationProgress } from "./VerificationProgress";

interface VerificationFunnelProps {
  form: VerificationForm;
}

/** 모바일 3스텝 퍼널 셸(?step=). 검증·상태는 공유 form을 소비. */
export function VerificationFunnel({ form }: VerificationFunnelProps) {
  const funnel = useVerificationFunnel();

  const handlePrimary = () => {
    if (funnel.isLast) {
      form.submit();
      return;
    }
    if (form.validateStep(funnel.step)) funnel.next();
  };

  return (
    <div className="flex min-h-dvh flex-col pb-4 pt-3">
      <VerificationProgress
        current={funnel.stepNumber}
        total={funnel.total}
        onBack={funnel.isFirst ? undefined : funnel.back}
      />

      <div className="flex-1 py-7">
        {funnel.step === "basic" && <StepBasicInfo form={form} />}
        {funnel.step === "expertise" && <StepExpertise form={form} />}
        {funnel.step === "documents" && <StepDocuments form={form} />}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-3 bg-paper pt-3">
        {form.submitErrorCode && (
          <SubmitErrorNotice code={form.submitErrorCode} onGoStatus={form.goStatus} />
        )}

        <Button
          full
          size="lg"
          variant={funnel.isLast ? "gold" : "primary"}
          loading={funnel.isLast && form.isSubmitting}
          disabled={funnel.isLast && (form.isUploading || form.isSubmitting)}
          onClick={handlePrimary}
          icon={<ArrowRight className="text-[1.125rem]" />}
        >
          {funnel.isLast ? "등록 신청하기" : "다음"}
        </Button>

        {funnel.isLast && (
          <button
            type="button"
            onClick={form.goDashboard}
            className="py-1.5 text-center text-sm font-semibold text-ink-3 transition hover:text-ink"
          >
            나중에 하기
          </button>
        )}
      </div>
    </div>
  );
}
