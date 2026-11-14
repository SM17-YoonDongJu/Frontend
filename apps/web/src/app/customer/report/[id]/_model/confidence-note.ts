import type { ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";
import type { AnalysisMetricsState } from "./analysis-metrics-state";

/** 등급 문구 — 게이지와 같은 상세 confidenceLevel 기준. */
export const CONFIDENCE_NOTE: Record<ConfidenceLevel, string> = {
  HIGH: "신뢰도 높음 — 현재 자료 기준 단계적으로 검토하는 보수적 범위입니다.",
  MEDIUM: "신뢰도 보통 — 추가 자료 확보 시 범위가 조정될 수 있어요.",
  LOW: "신뢰도 낮음 — 자료가 부족해 변동 폭이 커요. 자료 보강을 권해요.",
};

/** LOW인데 원인이 약관 데이터 공백일 때 — 고객이 할 수 없는 자료 보강 권유를 뺀 문구(#324 D3). */
export const LOW_TERMS_GAP_NOTE = "신뢰도 낮음 — 약관 근거가 부족해 변동 폭이 커요.";

/**
 * 약관 데이터 공백 사유 — 우리 약관 코퍼스가 비어서 생기는 LOW라 고객이 자료를 더 내도 등급이 바뀌지 않는다.
 * 출처: AI 레포 src/report_worker/README.md「신뢰도 등급」표(rag_empty·policy_not_in_db)
 *       + metrics.py REASON_RAG_EMPTY·REASON_POLICY_NOT_IN_DB(백엔드가 글자 그대로 내려준다).
 * 사유가 코드가 아닌 문장이라 정확 일치로만 본다. AI 문구가 바뀌면 매칭이 끊겨
 * "기존 LOW 문구 + 사유 목록"으로 퇴화한다(화면은 깨지지 않는다).
 * TODO(후속): 백엔드·AI에 사유 코드 요청.
 */
export const TERMS_DATA_GAP_REASONS: ReadonlySet<string> = new Set([
  "약관 근거를 찾지 못함",
  "가입 상품 약관이 DB에 없어 일반 약관으로 분석",
]);

export function hasTermsDataGapReason(reasons: readonly string[]): boolean {
  return reasons.some((reason) => TERMS_DATA_GAP_REASONS.has(reason));
}

export interface ConfidenceNoteView {
  /** 등급 문구. null이면 문구 없이 사유만 보이거나(등급 없음) 박스를 그리지 않는다(LOW 보류). */
  note: string | null;
  /** 서버 사유 문자열 — 순서·문구 그대로. 수치가 없으면 빈 배열. */
  reasons: string[];
  /** 데스크톱 등급 문구 박스를 그릴지. */
  showDesktop: boolean;
  /** 모바일 박스를 그릴지 — 사유가 있을 때만(#324 D2). */
  showMobile: boolean;
}

/**
 * 등급 문구·사유 표시를 한 번에 정한다(#324 D2·D3·D4). 컴포넌트는 이 결과만 보고 그린다.
 * @param level 상세 confidenceLevel(UNKNOWN은 null로 바꿔서 넘긴다)
 */
export function resolveConfidenceNote(
  level: ConfidenceLevel | null,
  metrics: AnalysisMetricsState,
): ConfidenceNoteView {
  const reasons = metrics.status === "ready" ? (metrics.metrics.confidence?.reasons ?? []) : [];
  const note = resolveNote(level, metrics.status, reasons);
  return {
    note,
    reasons,
    showDesktop: note !== null || reasons.length > 0,
    showMobile: reasons.length > 0,
  };
}

function resolveNote(
  level: ConfidenceLevel | null,
  metricsStatus: AnalysisMetricsState["status"],
  reasons: readonly string[],
): string | null {
  if (level === null) return null;
  if (level !== "LOW") return CONFIDENCE_NOTE[level];
  // LOW는 수치가 정해질 때까지 비워 둔다 — 자료 보강 권유가 먼저 보였다가 바뀌지 않게(D4).
  if (metricsStatus === "loading") return null;
  return hasTermsDataGapReason(reasons) ? LOW_TERMS_GAP_NOTE : CONFIDENCE_NOTE.LOW;
}
