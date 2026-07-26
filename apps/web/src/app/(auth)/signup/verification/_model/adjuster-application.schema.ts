import { z } from "zod";

// 소속: 독립(개업) / 손해사정법인 소속
export const affiliationSchema = z.enum(["INDEPENDENT", "FIRM"]);
export type AffiliationType = z.infer<typeof affiliationSchema>;

// 자격 구분(자격증 유형) — UI 단일 선택값(한글 literal). 전송 필드가 아닌 화면 전용 상태.
export const specialitySchema = z.enum(["신체", "종합"]);
export type Speciality = z.infer<typeof specialitySchema>;

// 제출 서류(GET .../me 실응답) — 업로드 파일 메타. 서류별 검토 상태는 실응답에 없음.
export const submittedDocumentSchema = z.object({
  s3Url: z.string(),
  name: z.string(),
  reportType: z.string(),
  fileType: z.string(),
});
export type SubmittedDocument = z.infer<typeof submittedDocumentSchema>;

// 신청/심사 상태 — 서버 enum(admin accept/reject와 동일)
export const applicationStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

// ── 신청 body ──
// 실제 BE 필드명은 `specialties`(전문분야 배열, minItems 1).
// UI 확장 필드(phone)는 아래 .extend()로 분리해 명세/확장을 구분한다.
export const adjusterApplicationBodySchema = z.object({
  name: z.string(),
  specialties: z.array(z.string()).min(1),
  licenseNo: z.string().nullish(),
  licenseImageUrl: z.string().url().nullish(),
  career: z.number().int().nonnegative().nullish(),
  introduction: z.string().nullish(),
  affiliation: affiliationSchema,
  region: z.string(),
  registrationImageUrl: z.string().url(),
});
export type AdjusterApplicationBody = z.infer<typeof adjusterApplicationBodySchema>;

// 자격증 번호와 사본 중 최소 하나 필수(명세 명시) → MISSING_REQUIRED_FIELD 대응.
const licenseEitherRequired = (
  value: { licenseNo?: string | null; licenseImageUrl?: string | null },
) => Boolean(value.licenseNo) || Boolean(value.licenseImageUrl);

// UI 확장 body — 명세 필드 + phone(백엔드 정의 요청 중).
// 확장 초안: .pr-assets/api-spec-draft-adjuster-verification.md
export const adjusterApplicationExtendedBodySchema = adjusterApplicationBodySchema
  .extend({
    phone: z.string(),
  })
  .refine(licenseEitherRequired, {
    message: "자격증 번호 또는 사본 중 하나는 필수입니다.",
    path: ["licenseNo"],
  });
export type AdjusterApplicationExtendedBody = z.infer<
  typeof adjusterApplicationExtendedBodySchema
>;

// ── 신청 응답(201) ──
export const adjusterApplicationResponseSchema = z.object({
  applicationId: z.string().uuid(),
  // 실제 스펙 type: string.
  status: z.string(),
});
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
