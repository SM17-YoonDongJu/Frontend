import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ContactInquiryForm } from "../_model/contact-inquiry.schema";
import { contactInquiryResponseSchema } from "../_model/contact-inquiry.schema";

/** 문의 폼 제출. 백엔드 확정 전 임시 엔드포인트(요청: Notion "POST /contact-inquiries"). */
export function createContactInquiry(body: ContactInquiryForm) {
  return fetchJson(`${API_BASE_URL}/contact-inquiries`, contactInquiryResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}
