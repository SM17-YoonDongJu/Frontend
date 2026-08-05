import { z } from "zod";
import {
  CreateAdjusterApplicationRequestSchema,
  CreateAdjusterApplicationResponseSchema,
} from "@/shared/api/generated/zod.gen";
import type {
  AdjusterApplicationResponse as GenAdjusterApplicationStatus,
  CreateAdjusterApplicationResponse as GenCreateAdjusterApplicationResponse,
} from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// 소속: 독립(개업) / 손해사정법인 소속
export const affiliationSchema = z.enum(["INDEPENDENT", "FIRM"]);
export type AffiliationType = z.infer<typeof affiliationSchema>;

// 자격 구분(자격증 유형) — UI 단일 선택값(한글 literal). 전송 필드가 아닌 화면 전용 상태.
export const specialitySchema = z.enum(["신체", "종합"]);
export type Speciality = z.infer<typeof specialitySchema>;

// 제출 서류(GET .../me 실응답) — 백엔드 AdjusterApplicationResponse.Document{type,status}.
// 서류별 심사 상태만 내려온다(파일명·URL 없음).
export const submittedDocumentSchema = z.object({
  type: z.string(),
  status: z.enum(["PENDING", "APPROVED", "RESUBMIT_REQUIRED"]),
});
export type SubmittedDocument = z.infer<typeof submittedDocumentSchema>;

// 신청/심사 상태 — 서버 enum(admin accept/reject와 동일)
export const applicationStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

// ── 신청 body ──
// 생성 스키마 베이스 + 우리 제약(licenseImageUrl/registrationImageUrl url() 형식, affiliation enum,
// career nonnegative) override. phone은 CONTRACT였으나 2026-08-05 실측 명세에 이미 필수로 포함됨.
export const adjusterApplicationBodySchema = CreateAdjusterApplicationRequestSchema.extend({
  licenseNo: z.string().nullish(),
  licenseImageUrl: z.string().url().nullish(),
  career: z.number().int().nonnegative().nullish(),
  introduction: z.string().nullish(),
  affiliation: affiliationSchema,
  registrationImageUrl: z.string().url(),
});
export type AdjusterApplicationBody = z.infer<typeof adjusterApplicationBodySchema>;

// 자격증 번호와 사본 중 최소 하나 필수(명세 명시) → MISSING_REQUIRED_FIELD 대응.
const licenseEitherRequired = (
  value: { licenseNo?: string | null; licenseImageUrl?: string | null },
) => Boolean(value.licenseNo) || Boolean(value.licenseImageUrl);

// 확장 초안: .pr-assets/api-spec-draft-adjuster-verification.md
export const adjusterApplicationExtendedBodySchema = adjusterApplicationBodySchema.refine(
  licenseEitherRequired,
  {
    message: "자격증 번호 또는 사본 중 하나는 필수입니다.",
    path: ["licenseNo"],
  },
);
export type AdjusterApplicationExtendedBody = z.infer<
  typeof adjusterApplicationExtendedBodySchema
>;

// ── 신청 응답(201) ──
// 생성 스키마 그대로 사용 — status는 명세도 string(enum 미확정).
export const adjusterApplicationResponseSchema = CreateAdjusterApplicationResponseSchema;
export type AdjusterApplicationResponse = z.infer<
  typeof adjusterApplicationResponseSchema
>;

// ── 상태 조회 응답(GET .../me) ──
export const adjusterApplicationStatusSchema = z.object({
  applicationId: z.string().uuid(),
  status: applicationStatusSchema,
  submittedAt: z.string(),
  name: z.string(),
  specialties: z.array(z.string()),
  licenseNo: z.string().nullable(),
  documents: z.array(submittedDocumentSchema),
  rejectedAt: z.string().nullable(),
  rejectReason: z.string().nullable(),
});
export type AdjusterApplicationStatus = z.infer<
  typeof adjusterApplicationStatusSchema
>;

type _AdjusterApplicationStatusDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<AdjusterApplicationStatus, "documents">, GenAdjusterApplicationStatus>
>;
type _AdjusterApplicationResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<AdjusterApplicationResponse, GenCreateAdjusterApplicationResponse>
>;

// ── FE 파생 view 상태 ──
// 서버 status(PENDING|APPROVED|REJECTED) + 404(신청 이력 없음 → NOT_APPLIED)를 합친 화면 분기용 값.
export type VerificationView =
  | "NOT_APPLIED"
  | "PENDING"
  | "REJECTED"
  | "APPROVED";

// 404는 조회 훅에서 null로 흡수 → null이면 NOT_APPLIED, 그 외 서버 status 그대로.
export function deriveVerificationView(
  data: AdjusterApplicationStatus | null,
): VerificationView {
  return data === null ? "NOT_APPLIED" : data.status;
}
