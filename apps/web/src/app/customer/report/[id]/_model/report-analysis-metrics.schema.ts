import { z } from "zod";
import type {
  MetricsCaseFunnel,
  MetricsClauseCitations,
  MetricsConfidence,
  MetricsEvidence,
  MetricsInput,
  MetricsJudge,
  MetricsPiiMasked,
  MetricsPipeline,
  MetricsRetrieval,
  MetricsScoreStats,
  MetricsVerification,
  ReportAnalysisMetricsResponse,
} from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";
import { enumWithFallback } from "@/shared/lib/enum-with-fallback";

/**
 * 리포트 AI 분석 근거 수치. 출처: GET /reports/{reportId}/analysis-metrics(백엔드 ReportAnalysisMetricsResponse, PR #399).
 * 필드·null 의미의 단일 출처: AI 레포 src/report_worker/README.md「리포트 수치」.
 * 화면이 쓰는 필드만 받는다 — verification.disability(손상명=건강정보)는 표시하지 않기로 해(#324 D6)
 * 파싱에서 떨어뜨려 쿼리 캐시에도 남기지 않는다. 와이어 모양 전체는 SDK의 생성 zod가 먼저 검증한다.
 * nullable 키는 생략 없이 null로 온다(백엔드 record 직렬화) → `.nullable()`(키 필수). 배열은 계약상 항상 있다.
 */
export const metricsUnavailableReasonSchema = enumWithFallback([
  "NO_DRAFT",
  "LEGACY_REPORT",
  "UNAVAILABLE",
]);

const metricsConfidenceSchema = z.object({
  // 상세 confidenceLevel과 같은 컬럼. 화면 분기는 상세 값을 쓴다(계약 대조·후속 프리뷰용).
  level: enumWithFallback(["LOW", "MEDIUM", "HIGH"]).nullable(),
  // 화면에 그대로 쓰는 고정 문구, LOW 사유가 먼저. HIGH면 빈 배열.
  reasons: z.array(z.string()),
});

const metricsScoreStatsSchema = z.object({
  min: z.number().nullable(),
  avg: z.number().nullable(),
});

const metricsPiiMaskedSchema = z.object({
  total: z.number().int().nullable(),
});

const metricsInputSchema = z.object({
  documentCount: z.number().int().nullable(),
  docTypes: z.array(z.string()),
  // null = 유효한 값 없음
  ocrConfidence: metricsScoreStatsSchema.nullable(),
  piiMasked: metricsPiiMaskedSchema.nullable(),
});

const metricsEvidenceSchema = z.object({
  terms: z.number().int().nullable(),
  schedule: z.number().int().nullable(),
  // 와이어 키가 case 그대로
  case: z.number().int().nullable(),
});

const metricsCaseFunnelSchema = z.object({
  candidates: z.number().int().nullable(),
  deduped: z.number().int().nullable(),
  relevant: z.number().int().nullable(),
  kept: z.number().int().nullable(),
});

const metricsRetrievalSchema = z.object({
  evidence: metricsEvidenceSchema.nullable(),
  // null = 판례 검색 단계 실패
  caseFunnel: metricsCaseFunnelSchema.nullable(),
});

const metricsClauseCitationsSchema = z.object({
  cited: z.number().int().nullable(),
  grounded: z.number().int().nullable(),
  // 근거에 없는 조항 번호(예: 제99조), 본문 첫 등장 순
  ungrounded: z.array(z.string()),
});

const metricsJudgeSchema = z.object({
  ran: z.boolean().nullable(),
  // 0~1, 소수 2자리
  coverage: z.number().nullable(),
});

const metricsVerificationSchema = z.object({
  clauseCitations: metricsClauseCitationsSchema.nullable(),
  judge: metricsJudgeSchema.nullable(),
});

const metricsPipelineSchema = z.object({
  nodeCount: z.number().int().nullable(),
  failedNodes: z.array(z.string()),
  // 단계 소요 합(벽시계 아님)
  totalMs: z.number().int().nullable(),
});

export const reportAnalysisMetricsSchema = z.object({
  available: z.boolean(),
  unavailableReason: metricsUnavailableReasonSchema.nullable(),
  version: z.number().int().nullable(),
  confidence: metricsConfidenceSchema.nullable(),
  input: metricsInputSchema.nullable(),
  retrieval: metricsRetrievalSchema.nullable(),
  verification: metricsVerificationSchema.nullable(),
  pipeline: metricsPipelineSchema.nullable(),
});

// AssertFieldsExistInSpec은 최상위 키만 대조한다 — 중첩 객체마다 따로 단언한다.
type _ReportAnalysisMetricsDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof reportAnalysisMetricsSchema>, ReportAnalysisMetricsResponse>
>;
type _MetricsConfidenceDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsConfidenceSchema>, MetricsConfidence>
>;
type _MetricsInputDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsInputSchema>, MetricsInput>
>;
type _MetricsScoreStatsDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsScoreStatsSchema>, MetricsScoreStats>
>;
type _MetricsPiiMaskedDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsPiiMaskedSchema>, MetricsPiiMasked>
>;
type _MetricsRetrievalDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsRetrievalSchema>, MetricsRetrieval>
>;
type _MetricsEvidenceDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsEvidenceSchema>, MetricsEvidence>
>;
type _MetricsCaseFunnelDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsCaseFunnelSchema>, MetricsCaseFunnel>
>;
type _MetricsVerificationDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsVerificationSchema>, MetricsVerification>
>;
type _MetricsClauseCitationsDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsClauseCitationsSchema>, MetricsClauseCitations>
>;
type _MetricsJudgeDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsJudgeSchema>, MetricsJudge>
>;
type _MetricsPipelineDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof metricsPipelineSchema>, MetricsPipeline>
>;
