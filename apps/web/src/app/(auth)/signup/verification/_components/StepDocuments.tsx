import { Label } from "@/shared/ui/Label";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { DocumentFields } from "./DocumentFields";

interface StepDocumentsProps {
  form: VerificationForm;
}

/** 퍼널 STEP3 — 자격 증빙. */
export function StepDocuments({ form }: StepDocumentsProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <Label kicker>손해사정사 파트너 등록</Label>
        <h1 className="mt-1.5 font-serif text-[1.5rem] font-bold text-ink">자격 증빙</h1>
        <p className="mt-1.5 break-keep text-sm text-ink-3">
          자격증·경력증명서를 올려주세요. PDF 또는 이미지, 각 최대 20MB.
        </p>
      </header>
      <DocumentFields form={form} />
    </div>
  );
}
