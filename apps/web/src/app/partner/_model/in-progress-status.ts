import type { InProgressStatus } from "./types";

export const IN_PROGRESS_STATUS_META: Record<
  InProgressStatus,
  { label: string; tone: "gold" | "navy" | "green" }
> = {
  REVIEWING: { label: "검수 중", tone: "gold" },
  CUSTOMER_REVIEW: { label: "고객 검토", tone: "green" },
};
