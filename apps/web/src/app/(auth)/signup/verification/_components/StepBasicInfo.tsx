import { Label } from "@/shared/ui/Label";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { BasicInfoFields } from "./BasicInfoFields";

interface StepBasicInfoProps {
  form: VerificationForm;
}

/** 퍼널 STEP1 — 기본 정보. */
export function StepBasicInfo({ form }: StepBasicInfoProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <Label kicker>손해사정사 파트너 등록</Label>
        <h1 className="mt-1.5 font-serif text-[1.5rem] font-bold text-ink">기본 정보</h1>
        <p className="mt-1.5 break-keep text-sm text-ink-3">자격 검증 후 공개 프로필로 등록됩니다.</p>
      </header>
      <BasicInfoFields form={form} hideLabels />
    </div>
  );
}
