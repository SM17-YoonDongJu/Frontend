"use client";

import { useMutation } from "@tanstack/react-query";
import { createContactInquiry } from "./create-contact-inquiry";

/** 문의 폼 제출 뮤테이션. 성공 시 컴포넌트가 완료 화면으로 전환. */
export function useCreateContactInquiry() {
  return useMutation({ mutationFn: createContactInquiry });
}
