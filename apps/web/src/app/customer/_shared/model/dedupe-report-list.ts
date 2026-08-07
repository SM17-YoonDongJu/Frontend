import type { ReportListItem } from "./report-list.schema";

/**
 * 리포트 목록 응답은 제안 1건당 행 1개로 내려온다 — 제안이 여러 건이면 같은 reportId가 반복된다.
 * (dev 실측: 리포트 7건인 계정에 17행, pagination.totalElements가 제안 수와 일치)
 * 백엔드가 리포트 단위 반환으로 고치면(백엔드 요청 카드, 이슈 #262) 이 함수와 호출부를 지운다.
 */
export function dedupeByReportId(list: ReportListItem[]): ReportListItem[] {
  const seen = new Set<string>();
  const deduped: ReportListItem[] = [];

  for (const item of list) {
    if (seen.has(item.reportId)) continue;
    seen.add(item.reportId);
    deduped.push(item);
  }

  return deduped;
}
