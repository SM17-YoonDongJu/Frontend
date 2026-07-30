"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useCreateContactInquiry } from "../_api/use-create-contact-inquiry";
import { contactInquiryFormSchema, type ContactInquiryForm } from "../_model/contact-inquiry.schema";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.8125rem] font-semibold text-ink-2">
      {children}
    </label>
  );
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactInquiryForm>({ resolver: zodResolver(contactInquiryFormSchema) });
  const { mutate, isPending, isSuccess, isError, reset: resetMutation } = useCreateContactInquiry();

  const onSubmit = handleSubmit((values) => {
    mutate(values, { onSuccess: () => reset() });
  });

  if (isSuccess) {
    return (
      <div className="rounded-card-lg border border-line bg-card p-6 text-center sm:p-8">
        <p className="text-[0.9375rem] font-bold text-ink">문의가 접수되었습니다</p>
        <p className="mt-2 text-[0.8125rem] text-ink-2">확인 후 입력하신 이메일로 답변드리겠습니다.</p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => resetMutation()}>
          다시 문의하기
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <FieldLabel htmlFor="contact-email">이메일</FieldLabel>
        <Input
          id="contact-email"
          type="email"
          placeholder="답변받으실 이메일 주소"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div>
        <FieldLabel htmlFor="contact-message">문의 내용</FieldLabel>
        <Input
          id="contact-message"
          multiline
          rows={5}
          placeholder="문의하실 내용을 입력해주세요."
          error={errors.message?.message}
          {...register("message")}
        />
      </div>

      {isError && (
        <p className="text-[0.8125rem] font-medium text-terra">
          문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <Button type="submit" full loading={isPending}>
        문의 보내기
      </Button>
    </form>
  );
}
