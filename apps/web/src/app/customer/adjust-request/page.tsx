"use client";

import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { FunnelFooter } from "./_components/FunnelFooter";
import { FunnelProgress } from "./_components/FunnelProgress";
import { Step1AccidentType } from "./_components/Step1AccidentType";
import { Step2TreatmentDetail } from "./_components/Step2TreatmentDetail";
import { Step3AccidentDate } from "./_components/Step3AccidentDate";
import { useDraftAutosave, loadDraft } from "./_hooks/use-draft";
import { useFunnel } from "./_hooks/use-funnel";
import { FUNNEL_STEPS } from "./_model/funnel-config";
import type { AdjustRequestDraft } from "./_model/types";

function StepPlaceholder({ title }: { title: string }) {
  return (
    <section className="py-10 text-center text-ink-3">
      <p className="font-serif text-[18px] text-ink">{title}</p>
      <p className="mt-1 text-[13px]">준비 중인 단계입니다.</p>
    </section>
  );
}

function AdjustRequestFunnel() {
  const funnel = useFunnel();
  const form = useForm<AdjustRequestDraft>({
    defaultValues: loadDraft(),
  });
  useDraftAutosave(form.watch);

  const step = FUNNEL_STEPS[funnel.currentStep - 1]!; // currentStep은 1..total로 clamp됨

  const handleNext = () => {
    const result = step.schema.safeParse(form.getValues());
    form.clearErrors();
    if (!result.success) {
      for (const issue of result.error.issues) {
        const name = issue.path.join("."); // 중첩/배열 경로 포함 (예: hospitalizations.0.start)
        if (name) {
          form.setError(name as FieldPath<AdjustRequestDraft>, { message: issue.message });
        }
      }
      return;
    }
    if (funnel.isLast) return; // 제출은 이후 슬라이스
    funnel.next();
  };

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-8">
      <FunnelProgress current={funnel.currentStep} total={funnel.total} title={step.title} />

      <FormProvider {...form}>
        <div className="mt-6 rounded-card-lg border border-line bg-card p-6">
          {funnel.currentStep === 1 && <Step1AccidentType />}
          {funnel.currentStep === 2 && <Step2TreatmentDetail />}
          {funnel.currentStep === 3 && <Step3AccidentDate />}
          {funnel.currentStep > 3 && <StepPlaceholder title={step.title} />}
        </div>
      </FormProvider>

      <FunnelFooter
        isFirst={funnel.isFirst}
        isLast={funnel.isLast}
        onPrev={funnel.prev}
        onNext={handleNext}
      />
    </div>
  );
}

export default function AdjustRequestPage() {
  return (
    <Suspense fallback={null}>
      <AdjustRequestFunnel />
    </Suspense>
  );
}
