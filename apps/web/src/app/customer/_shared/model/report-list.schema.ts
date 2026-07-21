import { z } from "zod";

/**
 * 고객 리포트 목록 정본 — 대시보드·받은 제안·검수 내역·내 리포트 목록 공유(이슈 #128 통합).
 * 과거 dashboard/_model/report-list.schema.ts(12필드)와 이 파일(16필드)이 이중 정의였던 것을
 * 이 단일본으로 통합. 봉투(status/message/code)는 fetchJson이 해제 — 여기선 data 페이로드만 모델링.
 */
export const reportListStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
  "NOT_SELECTED",
]);

export const reportListItemSchema = z.object({
  reportId: z.uuid(),
  status: reportListStatusSchema,
  accidentType: z.string(),
  createdAt: z.string(),
  reportNo: z.string(),
  claimedMinAmount: z.number().int().nonnegative(),
  claimedMaxAmount: z.number().int().nonnegative(),
  proposalCount: z.number().int(),
  reviewedAt: z.string().nullable(),
  adjusterNickname: z.string().nullable(),

  // 🏷확인필요(FE) list 확장 — optional, MSW로만 채움(노션 명세 반영됨).
  title: z.string().optional(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
  // 받은 제안 목록 "NEW N" 배지용 신규 도착 제안 수(이슈 #78).
  newProposalCount: z.number().int().optional(),

  // CONTRACT(naming-dictionary §확정 #24 / list 응답 미포함, FE 임시 추가 — 드리프트 항목 10): offeredAmount 보험사 제안금액.
  // 구 dashboard 스키마에서 통합 보존 — optional로 완화(대시보드 외 화면은 미사용).
  offeredAmount: z.number().int().nonnegative().nullable().optional(),
  // CONTRACT(상세 GET /reports/{id}의 정식 필드 treatment / list 응답 미포함, FE 임시 추가 — 드리프트 항목 10): 진료 항목.
  // 구 dashboard 스키마에서 통합 보존 — optional로 완화.
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
