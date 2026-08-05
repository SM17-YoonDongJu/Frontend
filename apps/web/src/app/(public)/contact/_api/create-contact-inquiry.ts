import "@/shared/api/client";
import { client } from "@/shared/api/generated/client.gen";
import type { ContactInquiryForm } from "../_model/contact-inquiry.schema";
import { contactInquiryResponseSchema } from "../_model/contact-inquiry.schema";

/**
 * 문의 폼 제출. 명세에 아직 없는 엔드포인트라 생성 SDK에 함수가 없다 —
 * 공용 client를 직접 호출해 응답 래퍼 해제·case 변환·에러 정규화는 그대로 태운다.
 * (요청: Notion "POST /contact-inquiries", 확정되면 생성 SDK로 교체)
 */
export async function createContactInquiry(body: ContactInquiryForm) {
  const { data } = await client.post({
    url: "/contact-inquiries",
    body,
    throwOnError: true,
  });

  return contactInquiryResponseSchema.parse(data);
}
