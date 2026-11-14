import "@/shared/api/client";
import { analysisMetrics } from "@/shared/api/generated/sdk.gen";
import { reportAnalysisMetricsSchema } from "../_model/report-analysis-metrics.schema";
import type { ReportAnalysisMetrics } from "../_model/types";

/**
 * 생성 zod가 와이어(snake 봉투)를 먼저 검증하고, client가 봉투 해제·camel 변환한 뒤 손 zod로 화면 필드만 받는다.
 * 둘 중 어느 쪽 검증이 실패해도 ZodError — 재시도·경계 전파 없이 패널이 "불러올 수 없음"으로 처리한다.
 */
export async function getReportAnalysisMetrics(reportId: string): Promise<ReportAnalysisMetrics> {
  const { data } = await analysisMetrics({ throwOnError: true, path: { reportId } });
  return reportAnalysisMetricsSchema.parse(data);
}
