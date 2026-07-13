"use client";

import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Button } from "@/shared/ui/Button";
import { Label } from "@/shared/ui/Label";
import type { VerificationForm as VerificationFormState } from "../_hooks/use-verification-form";
import { BasicInfoFields } from "./BasicInfoFields";
import { DocumentFields } from "./DocumentFields";
import { DocumentSecurityNote } from "./DocumentSecurityNote";
import { ExpertiseFields } from "./ExpertiseFields";
import { SubmitErrorNotice } from "./SubmitErrorNotice";
import { VerificationHeader } from "./VerificationHeader";

interface VerificationFormProps {
  form: VerificationFormState;
}

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function FormCard({ title, description, children }: FormCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-card border border-line bg-card p-7 md:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[1.0625rem] font-bold text-ink">{title}</h2>
        {description && <p className="text-[0.78125rem] text-ink-3">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** 데스크톱(md↑) 단일 페이지 폼. Figma 131-10583: 자격 정보 + 증빙 서류 2카드. */
export function VerificationForm({ form }: VerificationFormProps) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-paper">
      <VerificationHeader
        breadcrumb={[
          { label: "가입", state: "done" },
          { label: "자격 인증", state: "active" },
          { label: "심사", state: "todo" },
        ]}
      />

      <form
        className="mx-auto w-full max-w-[45rem] px-6 pb-16 pt-11"
        onSubmit={(event) => {
          event.preventDefault();
          form.submit();
        }}
      >
        <div className="flex flex-col gap-2.5">
          <Label kicker>손해사정사 인증</Label>
          <h1 className="font-serif text-[1.875rem] font-bold text-ink">자격 정보를 인증해주세요</h1>
          <p className="break-keep text-[0.8125rem] leading-relaxed text-ink-3">
            금융감독원 등록 정보와 증빙으로 심사해요. 영업일 기준 2~3일이 걸립니다.
          </p>
        </div>

        <div className="mt-[1.125rem] flex flex-col gap-[1.125rem]">
          <FormCard title="자격 정보">
            <BasicInfoFields form={form} showContact={false} />
            <ExpertiseFields form={form} showProfileExtras={false} />
          </FormCard>

          <FormCard title="증빙 서류" description="PDF 또는 이미지, 최대 20MB">
            <DocumentFields form={form} />
          </FormCard>

          <DocumentSecurityNote />

          {form.submitErrorCode && (
            <SubmitErrorNotice code={form.submitErrorCode} onGoStatus={form.goStatus} />
          )}

          <div className="flex items-center justify-between pt-1.5">
            <button
              type="button"
              onClick={form.goDashboard}
              className="px-1 py-2.5 text-[0.9375rem] font-semibold text-ink-3 transition hover:text-ink"
            >
              나중에 하기
            </button>
            <Button
              type="submit"
              size="lg"
              loading={form.isSubmitting}
              disabled={form.isUploading || form.isSubmitting}
              icon={<ArrowRight className="text-[1.125rem]" />}
            >
              인증 신청하기
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
