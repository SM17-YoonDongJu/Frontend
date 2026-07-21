import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { IssueReviewStatus, ReviewReportStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

/** 리포트 상태 표시 라벨/톤 (domain-glossary §5). */
export const REPORT_STATUS_META: Record<ReviewReportStatus, { label: string; tone: Tone }> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "gold" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "navy" },
  COUNSELING: { label: "상담 중", tone: "green" },
  CLOSED: { label: "종결", tone: "neutral" },
  NOT_SELECTED: { label: "선택 받지 못함", tone: "neutral" },
};

/** 쟁점 검수 방향 표시 라벨. 미검수는 null(라벨 없음). */
export const ISSUE_STATUS_LABEL: Record<IssueReviewStatus, string> = {
  ACCEPTED: "인정",
  MODIFIED: "수정",
  EXCLUDED: "제외",
  ADDED: "추가",
};

/** 인정/수정/제외 토글 옵션 (ADDED는 신규추가 폼 전용, 미검수는 null). */
export const ISSUE_STATUS_OPTIONS: { value: Exclude<IssueReviewStatus, "ADDED">; label: string }[] = [
  { value: "ACCEPTED", label: "인정" },
  { value: "MODIFIED", label: "수정" },
  { value: "EXCLUDED", label: "제외" },
];
