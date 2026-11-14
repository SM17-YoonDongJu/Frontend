import type { ReportAnalysisMetrics } from "./types";

/** "AI 분석 근거" 패널 한 줄. value는 화면에 그대로 쓰는 완성 문자열. */
export interface AnalysisMetricsRowView {
  label: string;
  value: string;
}

/** 패널 한 묶음(입력·검색 근거·검증·처리 경로). 행이 0개인 묶음은 만들지 않는다. */
export interface AnalysisMetricsSectionView {
  title: string;
  rows: AnalysisMetricsRowView[];
}

/** 서버/브라우저 하이드레이션 결과가 같도록 로케일 고정. */
const LOCALE = "ko-KR";
const LIST_SEPARATOR = " · ";
const FUNNEL_SEPARATOR = " → ";
const CLAUSE_SEPARATOR = ", ";
/** 판례 검색 단계 중 한 칸만 비었을 때 그 자리 표시(나머지 단계는 그대로 보인다). */
const MISSING_FUNNEL_COUNT = "-";

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

/** 비율(0~1)을 천분율로 반올림해 부동소수 오차를 흡수한 뒤 퍼센트로 내린다. */
const PERMILLE_PER_RATIO = 1000;
const PERMILLE_PER_PERCENT = 10;
const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

/**
 * AI 문서 유형 코드(AI 레포 core/contracts.py DocType) → 한글 라벨.
 * 라벨은 고객이 서류를 올린 업로드 화면(app/customer/adjust-request/_model/document-slots.ts의 DOCUMENT_SLOTS)과
 * 같은 말로 맞춘다(#324 리더 확정). 다른 세그먼트라 import하지 않고 값만 맞춘다 — 업로드 라벨이 바뀌면 여기도 바꾼다.
 */
export const DOC_TYPE_LABEL = {
  diagnosis: "진단서",
  policy: "보험증권",
  payout_notice: "보험금 지급결과서",
  claim: "청구서",
  hospitalization_cert: "입원 확인서",
  medical_receipt: "진료비 영수증",
  other: "기타",
} as const satisfies Record<string, string>;

/** 자기 키만 본다 — 서버 문자열이 프로토타입 키(constructor 등)여도 라벨로 착각하지 않게. */
function isKnownDocType(docType: string): docType is keyof typeof DOC_TYPE_LABEL {
  return Object.hasOwn(DOC_TYPE_LABEL, docType);
}

/** 모르는 유형은 영문 코드를 노출하지 않고 "기타"로 본다. */
export function docTypeLabel(docType: string): string {
  return isKnownDocType(docType) ? DOC_TYPE_LABEL[docType] : DOC_TYPE_LABEL.other;
}

function formatCount(count: number): string {
  return `${count.toLocaleString(LOCALE)}건`;
}

function formatNullableCount(count: number | null | undefined): string | null {
  return count == null ? null : formatCount(count);
}

/**
 * 문서 유형 목록 → `보험증권 · 진단서 · 진료비 영수증 2건`.
 * 라벨 기준으로 첫 등장 순서대로 묶고(other와 모르는 값은 같은 "기타"로 합산), 2건 이상인 라벨만 건수를 붙인다.
 * 빈 배열이면 null(행 숨김).
 */
export function formatDocTypes(docTypes: readonly string[]): string | null {
  if (docTypes.length === 0) return null;

  const countByLabel = new Map<string, number>();
  for (const docType of docTypes) {
    const label = docTypeLabel(docType);
    countByLabel.set(label, (countByLabel.get(label) ?? 0) + 1);
  }

  return Array.from(countByLabel, ([label, count]) => {
    const isRepeated = count > 1;
    return isRepeated ? `${label} ${formatCount(count)}` : label;
  }).join(LIST_SEPARATOR);
}

/**
 * 비율(0~1) → `96%`. 내림 — AI 사유 "인용 검증 범위 일부(xx%)"와 같은 규칙.
 * 천분율 반올림으로 부동소수 오차를 먼저 흡수한다(0.29 → 29%, 0.912 → 91%). 결과는 0~100으로 자른다.
 */
export function formatRatioPercent(ratio: number): string {
  const permille = Math.round(ratio * PERMILLE_PER_RATIO);
  const percent = Math.floor(permille / PERMILLE_PER_PERCENT);
  return `${Math.min(Math.max(percent, MIN_PERCENT), MAX_PERCENT)}%`;
}

/** 밀리초 → `1분 13초`·`45초`·`2분`. 1초 미만으로 반올림되면 `1초 미만`. */
export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.round(ms / MS_PER_SECOND);
  if (totalSeconds < 1) return "1초 미만";

  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  if (minutes === 0) return `${seconds}초`;
  if (seconds === 0) return `${minutes}분`;
  return `${minutes}분 ${seconds}초`;
}

/**
 * 수치 응답 → 패널 섹션. 순서는 입력 → 검색 근거 → 검증 → 처리 경로로 고정.
 * 값이 null인 항목은 그 줄만 숨기고, 줄이 하나도 없는 섹션은 뺀다(패널 전체를 실패로 돌리지 않는다 — #324 D10).
 */
export function buildAnalysisMetricsSections(
  metrics: ReportAnalysisMetrics,
): AnalysisMetricsSectionView[] {
  const sections: AnalysisMetricsSectionView[] = [
    { title: "입력", rows: inputRows(metrics.input) },
    { title: "검색 근거", rows: retrievalRows(metrics.retrieval) },
    { title: "검증", rows: verificationRows(metrics.verification) },
    { title: "처리 경로", rows: pipelineRows(metrics.pipeline) },
  ];
  return sections.filter((section) => section.rows.length > 0);
}

/** 값이 없는(null) 줄은 숨긴다. */
function visibleRows(
  rows: ReadonlyArray<{ label: string; value: string | null }>,
): AnalysisMetricsRowView[] {
  return rows.flatMap(({ label, value }) => (value === null ? [] : [{ label, value }]));
}

function inputRows(input: ReportAnalysisMetrics["input"]): AnalysisMetricsRowView[] {
  if (input === null) return [];
  return visibleRows([
    { label: "문서 수", value: formatNullableCount(input.documentCount) },
    { label: "문서 유형", value: formatDocTypes(input.docTypes) },
    { label: "문서 인식 신뢰도", value: formatScoreStats(input.ocrConfidence) },
    { label: "개인정보 가림", value: formatNullableCount(input.piiMasked?.total) },
  ]);
}

/** OCR 신뢰도 {min, avg} → `평균 94% · 최저 93%`. 한쪽만 있으면 그 조각만, 둘 다 없으면 null. */
function formatScoreStats(
  stats: NonNullable<ReportAnalysisMetrics["input"]>["ocrConfidence"],
): string | null {
  if (stats === null) return null;
  const parts = [
    stats.avg === null ? null : `평균 ${formatRatioPercent(stats.avg)}`,
    stats.min === null ? null : `최저 ${formatRatioPercent(stats.min)}`,
  ].filter((part): part is string => part !== null);
  return parts.length > 0 ? parts.join(LIST_SEPARATOR) : null;
}

function retrievalRows(retrieval: ReportAnalysisMetrics["retrieval"]): AnalysisMetricsRowView[] {
  if (retrieval === null) return [];
  const { evidence, caseFunnel } = retrieval;
  return visibleRows([
    { label: "약관 근거", value: formatNullableCount(evidence?.terms) },
    { label: "장해분류표 근거", value: formatNullableCount(evidence?.schedule) },
    { label: "판례 근거", value: formatNullableCount(evidence?.case) },
    { label: "판례 검색 단계", value: formatCaseFunnel(caseFunnel) },
  ]);
}

/**
 * 판례 검색 단계 → `후보 12 → 중복 제거 9 → 관련 2 → 채택 2`.
 * caseFunnel null(= 판례 검색 단계 실패)이거나 네 값이 모두 없으면 null, 일부만 없으면 그 자리만 `-`.
 */
function formatCaseFunnel(
  caseFunnel: NonNullable<ReportAnalysisMetrics["retrieval"]>["caseFunnel"],
): string | null {
  if (caseFunnel === null) return null;
  const steps = [
    { label: "후보", count: caseFunnel.candidates },
    { label: "중복 제거", count: caseFunnel.deduped },
    { label: "관련", count: caseFunnel.relevant },
    { label: "채택", count: caseFunnel.kept },
  ];
  if (steps.every((step) => step.count === null)) return null;
  return steps
    .map(({ label, count }) => {
      const countText = count === null ? MISSING_FUNNEL_COUNT : count.toLocaleString(LOCALE);
      return `${label} ${countText}`;
    })
    .join(FUNNEL_SEPARATOR);
}

function verificationRows(
  verification: ReportAnalysisMetrics["verification"],
): AnalysisMetricsRowView[] {
  if (verification === null) return [];
  const { clauseCitations, judge } = verification;
  return visibleRows([
    { label: "인용 조항", value: formatClauseCitations(clauseCitations) },
    { label: "근거 미확인 조항", value: formatUngroundedClauses(clauseCitations?.ungrounded ?? []) },
    { label: "인용 검증 범위", value: formatJudgeCoverage(judge) },
  ]);
}

/** 인용 조항 → `3건 중 2건 근거 확인`. 인용 0건이면 `없음`, 근거 확인 수를 모르면 `3건`. */
function formatClauseCitations(
  clauseCitations: NonNullable<ReportAnalysisMetrics["verification"]>["clauseCitations"],
): string | null {
  if (clauseCitations === null || clauseCitations.cited === null) return null;
  const { cited, grounded } = clauseCitations;
  if (cited === 0) return "없음";
  if (grounded === null) return formatCount(cited);
  return `${formatCount(cited)} 중 ${formatCount(grounded)} 근거 확인`;
}

/** 근거에 없는 조항 번호(본문 첫 등장 순) → `제99조, 제12조의2`. 없으면 null. */
function formatUngroundedClauses(ungrounded: readonly string[]): string | null {
  return ungrounded.length > 0 ? ungrounded.join(CLAUSE_SEPARATOR) : null;
}

/** 인용 검증 범위 → `96%`. 검증을 돌리지 않았으면(ran=false) 범위 0% 대신 `검증하지 않음`. */
function formatJudgeCoverage(
  judge: NonNullable<ReportAnalysisMetrics["verification"]>["judge"],
): string | null {
  if (judge === null) return null;
  if (judge.ran === false) return "검증하지 않음";
  return judge.coverage === null ? null : formatRatioPercent(judge.coverage);
}

function pipelineRows(pipeline: ReportAnalysisMetrics["pipeline"]): AnalysisMetricsRowView[] {
  if (pipeline === null) return [];
  return visibleRows([
    {
      label: "분석 단계",
      value: formatNodeCount(pipeline.nodeCount, pipeline.failedNodes.length),
    },
    {
      // 단계 소요 시간의 합 — 벽시계 시간이 아니라서 라벨에 "합계"를 밝힌다.
      label: "단계별 소요 시간 합계",
      value: pipeline.totalMs === null ? null : formatDurationMs(pipeline.totalMs),
    },
  ]);
}

/** 분석 단계 수 → `12단계`, 실패가 있으면 `11단계 중 1단계 실패`(단계 이름은 내부 구현이라 노출하지 않는다). */
function formatNodeCount(nodeCount: number | null, failedCount: number): string | null {
  if (nodeCount === null) return null;
  return failedCount === 0 ? `${nodeCount}단계` : `${nodeCount}단계 중 ${failedCount}단계 실패`;
}
