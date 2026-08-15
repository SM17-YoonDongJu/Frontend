import { z } from "zod";
import type { ReportCardListResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";
import { tolerantEnum } from "@/shared/lib/tolerant-enum";

/**
 * 고객 리포트 목록 정본 — 대시보드·받은 제안·검수 내역·내 리포트 목록 공유(이슈 #128 통합).
 * 과거 dashboard/_model/report-list.schema.ts(12필드)와 이 파일(16필드)이 이중 정의였던 것을
 * 이 단일본으로 통합. 응답 래퍼(status/message/code)는 client가 해제 — 여기선 data 페이로드만 모델링.
 */
// 백엔드 ReportResponseSupport.customerStatus — CLOSED는 고객 노출 시 MATCHED로 매핑되어 CLOSED는 내려오지 않는다.
export const reportListStatusSchema = tolerantEnum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
  "NOT_SELECTED",
]);

export const reportListItemSchema = z.object({
  reportId: z.uuid(),
  status: reportListStatusSchema,
  // 백엔드 row.accidentType() null 가능(사고유형 미확정).
  accidentType: z.string().nullable(),
  createdAt: z.string(),
  reportNo: z.string(),
  // 미검수(AWAITING_INSPECTION) 리포트는 청구액 미산정 — null 가능.
  claimedMinAmount: z.number().int().nonnegative().nullable(),
  claimedMaxAmount: z.number().int().nonnegative().nullable(),
  proposalCount: z.number().int(),
  reviewedAt: z.string().nullable(),
  adjusterNickname: z.string().nullable(),

  // title은 2026-08-05 실측 명세에 이미 포함됨(과거 "확인필요" 메모는 outdated).
  title: z.string().nullish(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
  // 받은 제안 목록 "NEW N" 배지용 신규 도착 제안 수(이슈 #78, 여전히 명세 미포함).
  newProposalCount: z.number().int().optional(),

  // offeredAmount·treatment도 2026-08-05 실측 명세에 이미 포함됨(구 "list 응답 미포함" 드리프트 메모는 정정됨).
  offeredAmount: z.number().int().nonnegative().nullable().optional(),
  treatment: z.string().nullable().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const reportListSchema = z.object({
  list: z.array(reportListItemSchema),
  pagination: paginationSchema,
});

export type ReportListItemStatus = z.infer<typeof reportListStatusSchema>;
export type ReportListItem = z.infer<typeof reportListItemSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ReportListResponse = z.infer<typeof reportListSchema>;

// 구 dashboard/_model 이름 호환 별칭(통합 후 기존 소비처 무변경 보장, 이슈 #128).
export { reportListStatusSchema as reportStatusSchema };
export type ReportStatus = z.infer<typeof reportListStatusSchema>;
export type ReportList = z.infer<typeof reportListSchema>;

// confirmedMinAmount·confirmedMaxAmount·rating·newProposalCount는 여전히 명세 미포함(FE 확장).
type _ReportListItemDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<
    Omit<ReportListItem, "confirmedMinAmount" | "confirmedMaxAmount" | "rating" | "newProposalCount">,
    NonNullable<ReportCardListResponse["list"]>[number]
  >
>;
