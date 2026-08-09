import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReviewStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

interface ReviewStatusMeta {
  label: string;
  tone: Tone;
  /** 채택 뱃지의 체크 아이콘 노출 여부. */
  hasCheck: boolean;
}

const REVIEW_STATUS_META: Record<ReviewStatus, ReviewStatusMeta> = {
  SENT: { label: "전송 완료", tone: "neutral", hasCheck: false },
  COUNSELING: { label: "상담 전환", tone: "gold", hasCheck: false },
  REJECTED: { label: "반려", tone: "neutral", hasCheck: false },
  ACCEPTED: { label: "채택", tone: "green", hasCheck: true },
};

const FALLBACK_META: ReviewStatusMeta = { label: "", tone: "neutral", hasCheck: false };

export function reviewStatusMeta(status: ReviewStatus): ReviewStatusMeta {
  return REVIEW_STATUS_META[status] ?? FALLBACK_META;
}
