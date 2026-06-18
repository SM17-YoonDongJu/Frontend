"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FunnelFooter } from "./_components/FunnelFooter";
import { FunnelProgress } from "./_components/FunnelProgress";
import { Step1AccidentType } from "./_components/Step1AccidentType";
import { useDraftAutosave, loadDraft } from "./_hooks/use-draft";
import { useFunnel } from "./_hooks/use-funnel";
import { FUNNEL_STEPS } from "./_model/funnel-config";
import { adjustRequestDraftSchema } from "./_model/report-request.schema";
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
    resolver: zodResolver(adjustRequestDraftSchema),
    defaultValues: loadDraft(),
    mode: "onChange",
  });
  useDraftAutosave(form.watch);

  const step = FUNNEL_STEPS[funnel.currentStep - 1]!; // currentStep은 1..total로 clamp됨

  const handleNext = async () => {
    const ok = await form.trigger(step.fields);
    if (!ok) return;
    if (funnel.isLast) return; // 제출은 이후 슬라이스
    funnel.next();
  };

  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-8">
      <FunnelProgress current={funnel.currentStep} total={funnel.total} title={step.title} />

      <FormProvider {...form}>
        <div className="mt-6 rounded-card-lg border border-line bg-card p-6">
          {funnel.currentStep === 1 ? (
            <Step1AccidentType />
          ) : (
            <StepPlaceholder title={step.title} />
          )}
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
