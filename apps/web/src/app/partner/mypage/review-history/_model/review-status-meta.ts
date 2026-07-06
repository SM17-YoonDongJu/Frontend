import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReviewStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

interface ReviewStatusMeta {
  /** 표시 라벨 fallback. 실제 렌더는 서버 제공 statusLabel 우선. */
  label: string;
  tone: Tone;
  /** 종결 뱃지의 체크 아이콘 노출 여부. */
  hasCheck: boolean;
}

const REVIEW_STATUS_META: Record<ReviewStatus, ReviewStatusMeta> = {
  CONSULTATION: { label: "상담 전환", tone: "gold", hasCheck: false },
  CLOSED: { label: "종결", tone: "green", hasCheck: true },
  SENT: { label: "전송 완료", tone: "neutral", hasCheck: false },
  NOT_SELECTED: { label: "미선정", tone: "neutral", hasCheck: false },
};

const FALLBACK_META: ReviewStatusMeta = { label: "", tone: "neutral", hasCheck: false };

export function reviewStatusMeta(status: ReviewStatus): ReviewStatusMeta {
  return REVIEW_STATUS_META[status] ?? FALLBACK_META;
}
