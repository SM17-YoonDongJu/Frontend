import type { z } from "zod";
import { enumWithFallback } from "@/shared/lib/enum-with-fallback";

/** 분석(OCR·AI) 처리 상태. 리포트 진행 상태(status)와 다른 축이다. */
export const analysisStateSchema = enumWithFallback([
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "BLOCKED",
  "NEEDS_REUPLOAD"
]);

export type AnalysisState = z.infer<typeof analysisStateSchema>;

/** 분석이 멈춘 상태의 상세 안내 제목과 목록 카드의 배지·문구. 이 외 상태는 undefined. */
export const ANALYSIS_STOPPED_COPY: Partial<
  Record<AnalysisState, { title: string; cardText: string; badge: string }>
> = {
  NEEDS_REUPLOAD: {
    title: "문서를 다시 올려주세요",
    cardText: "문서를 다시 올려야 해요",
    badge: "재업로드 필요"
  },
  BLOCKED: {
    title: "처리할 수 없는 요청이에요",
    cardText: "처리할 수 없는 요청이에요",
    badge: "처리 불가"
  },
  FAILED: {
    title: "문서 분석에 실패했어요",
    cardText: "문서 분석에 실패했어요",
    badge: "분석 실패"
  }
};
