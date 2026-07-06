"use client";

import { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { useCreateReport } from "./_api/use-create-report";
import { SubmitComplete } from "./_components/SubmitComplete";
import { FunnelFooter } from "./_components/FunnelFooter";
import { FunnelProgress } from "./_components/FunnelProgress";
import { Step1AccidentType } from "./_components/Step1AccidentType";
import { Step2TreatmentDetail } from "./_components/Step2TreatmentDetail";
import { Step3AccidentDate } from "./_components/Step3AccidentDate";
import { Step4OfferedAmount } from "./_components/Step4OfferedAmount";
import { Step5Documents } from "./_components/Step5Documents";
import { Step6Confirm } from "./_components/Step6Confirm";
import { useDraftAutosave, loadDraft, clearDraft } from "./_hooks/use-draft";
import { useFunnel } from "./_hooks/use-funnel";
import { FUNNEL_STEPS, firstIncompleteStep } from "./_model/funnel-config";
import { toCreateReportBody } from "./_model/report-request.schema";
import type { AdjustRequestDraft, CreateReportResponse } from "./_model/types";

function AdjustRequestFunnel() {
  const funnel = useFunnel();
  const createReport = useCreateReport();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateReportResponse | null>(null);

  const form = useForm<AdjustRequestDraft>({
    defaultValues: loadDraft(),
  });
  useDraftAutosave(form.watch);

  const step = FUNNEL_STEPS[funnel.currentStep - 1]!; // currentStep은 1..total로 clamp됨

  // 단계 가드: 선행 단계 미완 상태로 직접 진입(?step=N) 시 첫 미완 단계로 돌림
  useEffect(() => {
    const allowed = firstIncompleteStep(form.getValues());
    if (funnel.currentStep > allowed) funnel.goTo(allowed, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnel.currentStep]);

  const validateStep = () => {
    const parsed = step.schema.safeParse(form.getValues());
    form.clearErrors();
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const name = issue.path.join(".");
        if (name) form.setError(name as FieldPath<AdjustRequestDraft>, { message: issue.message });
      }
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setSubmitError(null);
    createReport.mutate(toCreateReportBody(form.getValues()), {
      onSuccess: (data) => {
        clearDraft();
        setResult(data);
      },
      onError: (e) => setSubmitError(e.message),
    });
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (funnel.isLast) {
      handleSubmit();
      return;
    }
    funnel.next();
  };

  if (result) {
    return (
      <SubmitComplete
        result={result}
        onRestart={() => {
          setResult(null);
          form.reset({});
          funnel.goTo(1, { replace: true });
        }}
      />
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[47.5rem] px-4 pb-28 pt-5 sm:pb-12 sm:pt-8">
      <FunnelProgress
        current={funnel.currentStep}
        total={funnel.total}
        title={step.title}
        isFirst={funnel.isFirst}
        onBack={funnel.prev}
      />

      <FormProvider {...form}>
        <div className="mt-6 sm:rounded-card-lg sm:border sm:border-line sm:bg-card sm:p-6">
          {funnel.currentStep === 1 && <Step1AccidentType />}
          {funnel.currentStep === 2 && <Step2TreatmentDetail />}
          {funnel.currentStep === 3 && <Step3AccidentDate />}
          {funnel.currentStep === 4 && <Step4OfferedAmount />}
          {funnel.currentStep === 5 && <Step5Documents />}
          {funnel.currentStep === 6 && <Step6Confirm />}
        </div>
      </FormProvider>

      {submitError && (
        <p className="mt-3 text-[0.8125rem] font-medium text-terra">{submitError}</p>
      )}

      <FunnelFooter
        isFirst={funnel.isFirst}
        isLast={funnel.isLast}
        loading={createReport.isPending}
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
