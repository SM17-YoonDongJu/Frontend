import type { ReportListItem } from "../_model/types";

export function useLatestProposableReport(
  list: ReportListItem[],
): string | null {
  const candidates = list.filter((item) => item.proposalCount > 0);
  if (candidates.length === 0) return null;

  return candidates.reduce((latest, item) =>
    item.createdAt > latest.createdAt ? item : latest,
  ).reportId;
}
