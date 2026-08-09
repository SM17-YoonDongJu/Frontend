import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { HomeInProgressCase } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

interface InProgressStatusMeta {
  label: string;
  tone: Tone;
}

const FALLBACK_TONE: Tone = "neutral";

export function inProgressStatusMeta(
  item: Pick<HomeInProgressCase, "reportStatus" | "reviewStatus" | "stageLabel">,
): InProgressStatusMeta {
  const { reportStatus, reviewStatus, stageLabel } = item;

  if (reportStatus === "CLOSED" || reviewStatus === "ACCEPTED") {
    return { label: "완료", tone: "green" };
  }
  if (reviewStatus === "COUNSELING") {
    return { label: "상담 중", tone: "gold" };
  }
  if (reviewStatus === "SENT") {
    return { label: "고객 검토 대기", tone: "neutral" };
  }
  if (reportStatus === "AWAITING_INSPECTION") {
    return { label: "검수 중", tone: "gold" };
  }

  return { label: stageLabel, tone: FALLBACK_TONE };
}

export const IN_PROGRESS_STAGE_LABELS = ["검수", "고객 검토", "상담", "완료"] as const;

export function inProgressStageIndex(
  item: Pick<HomeInProgressCase, "reportStatus" | "reviewStatus" | "progressPercent">,
): number {
  const { reportStatus, reviewStatus, progressPercent } = item;

  if (reportStatus === "CLOSED" || reviewStatus === "ACCEPTED") return 3;
  if (reviewStatus === "COUNSELING") return 2;
  if (reviewStatus === "SENT") return 1;
  if (reportStatus === "AWAITING_INSPECTION") return 0;

  if (progressPercent >= 100) return 3;
  if (progressPercent >= 67) return 2;
  if (progressPercent >= 34) return 1;
  return 0;
}
