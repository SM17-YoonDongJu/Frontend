import type { ChatReportReason } from "@/shared/api/chat/chat.schema";

/** 신고 사유 표시 라벨. 코드·네트워크는 영문 enum만 쓰고 한글은 화면 표시에만 쓴다. */
export const CHAT_REPORT_REASON_OPTIONS: { value: ChatReportReason; label: string }[] = [
  { value: "SPAM", label: "스팸·광고" },
  { value: "ABUSE", label: "욕설·비방·괴롭힘" },
  { value: "FRAUD", label: "사기 의심" },
  { value: "PRIVACY_VIOLATION", label: "개인정보 침해" },
  { value: "OTHER", label: "기타" },
];
