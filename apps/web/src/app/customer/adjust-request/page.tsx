"use client";

import { Suspense, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { useCreateReport } from "./_api/use-create-report";
import { SubmitComplete } from "./_components/SubmitComplete";
import { FunnelFooter } from "./_components/FunnelFooter";
import { FunnelProgress } from "./_components/FunnelProgress";
import { Step1AccidentType } from "./_components/Step1AccidentType";
import { Step2TreatmentDetail } from "./_components/Step2TreatmentDetail";
import { Step3AccidentDate } from "./_components/Step3AccidentDate";
import { Step4OfferedAmount } from "./_components/Step4OfferedAmount";
import { Step5Question } from "./_components/Step5Question";
import { Step6Documents } from "./_components/Step6Documents";
import { Step7Confirm } from "./_components/Step7Confirm";
import { useDraftPrompt, clearDraft } from "./_hooks/use-draft";
import { useFunnel } from "./_hooks/use-funnel";
import { FUNNEL_STEPS, firstIncompleteStep } from "./_model/funnel-config";
import type { FunnelStepKey } from "./_model/funnel-config";
import { toCreateReportBody } from "./_model/report-request.schema";
import type { AdjustRequestDraft, CreateReportResponse } from "./_model/types";

/** 단계 key → 화면. 단계를 추가하면 이 매핑 누락이 타입 에러로 잡힌다. */
const STEP_COMPONENTS: Record<FunnelStepKey, ComponentType> = {
  accidentType: Step1AccidentType,
  treatment: Step2TreatmentDetail,
  date: Step3AccidentDate,
  insurance: Step4OfferedAmount,
  question: Step5Question,
  document: Step6Documents,
  consent: Step7Confirm,
};

function AdjustRequestFunnel() {
  const funnel = useFunnel();
  const createReport = useCreateReport();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateReportResponse | null>(null);

  const form = useForm<AdjustRequestDraft>({ defaultValues: {} });
  const draftPrompt = useDraftPrompt(form);

  const step = FUNNEL_STEPS[funnel.currentStep - 1]!; // currentStep은 1..total로 clamp됨
  const StepView = STEP_COMPONENTS[step.key];

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
    <div className="mx-auto min-h-[100dvh] w-full max-w-[45rem] px-4 pb-28 pt-5 sm:pb-12 sm:pt-8 md:px-10">
      <FunnelProgress
        current={funnel.currentStep}
        total={funnel.total}
        title={step.title}
        isFirst={funnel.isFirst}
        onBack={funnel.prev}
      />

      <FormProvider {...form}>
        <div className="mt-6 sm:rounded-card-lg sm:border sm:border-line sm:bg-card sm:p-6 md:p-8">
          <StepView />
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

      <Modal
        open={draftPrompt.open}
        title="작성하던 내용이 있어요"
        dismissible={false}
        onClose={draftPrompt.discard}
        className="max-w-sm"
      >
        <p className="text-[0.875rem] leading-relaxed text-ink-2">
          이전에 작성하던 분석 신청 내용이 남아 있습니다. 이어서 작성할까요? 새로 시작하면 저장된 내용은 지워집니다.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={draftPrompt.discard}>
            새로 시작
          </Button>
          <Button size="sm" onClick={draftPrompt.restore}>
            이어서 작성
          </Button>
        </div>
      </Modal>
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
