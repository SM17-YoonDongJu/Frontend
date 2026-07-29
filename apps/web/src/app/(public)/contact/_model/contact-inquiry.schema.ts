import { z } from "zod";

/** 문의 폼 입력 스키마. 백엔드 확정 전 임시 프론트 검증(요청: Notion "POST /contact-inquiries"). */
export const contactInquiryFormSchema = z.object({
  email: z.email("올바른 이메일 형식으로 입력해주세요."),
  message: z.string().min(10, "문의 내용을 10자 이상 입력해주세요.").max(1000, "문의 내용은 1000자 이내로 입력해주세요."),
});

export type ContactInquiryForm = z.infer<typeof contactInquiryFormSchema>;

export const contactInquiryResponseSchema = z.object({
  received: z.boolean(),
});
