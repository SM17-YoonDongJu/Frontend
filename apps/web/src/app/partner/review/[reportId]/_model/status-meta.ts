import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReviewIssueStatus, ReviewReportStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

/** 리포트 상태 표시 라벨/톤 (domain-glossary §5). */
export const REPORT_STATUS_META: Record<ReviewReportStatus, { label: string; tone: Tone }> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "gold" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "navy" },
  COUNSELING: { label: "상담 중", tone: "green" },
  MATCHED: { label: "매칭 완료", tone: "neutral" },
};

/** 쟁점 검수 상태 표시 라벨. PENDING은 미검토. */
export const ISSUE_STATUS_LABEL: Record<ReviewIssueStatus, string> = {
  PENDING: "미검토",
  ACCEPTED: "인정",
  MODIFIED: "수정",
  EXCLUDED: "제외",
};

/** 인정/수정/제외 토글 옵션 (PENDING 제외 — 초기 미선택 표현). */
export const ISSUE_STATUS_OPTIONS: { value: Exclude<ReviewIssueStatus, "PENDING">; label: string }[] = [
  { value: "ACCEPTED", label: "인정" },
  { value: "MODIFIED", label: "수정" },
  { value: "EXCLUDED", label: "제외" },
];
