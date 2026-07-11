import { Label } from "@/shared/ui/Label";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { ExpertiseFields } from "./ExpertiseFields";

interface StepExpertiseProps {
  form: VerificationForm;
}

/** 퍼널 STEP2 — 전문성. */
export function StepExpertise({ form }: StepExpertiseProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <Label kicker>손해사정사 파트너 등록</Label>
        <h1 className="mt-1.5 font-serif text-[1.5rem] font-bold text-ink">전문성</h1>
        <p className="mt-1.5 break-keep text-sm text-ink-3">전문분야와 경력을 알려주세요.</p>
      </header>
      <ExpertiseFields form={form} hideLabels />
    </div>
  );
}
