import { z } from "zod";
import type {
  AdjusterApplicationResponse as GenAdjusterApplicationStatus,
  CreateAdjusterApplicationRequest,
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

// ── 신청 body ──
// 생성 스키마 베이스 + 우리 제약(licenseImageUrl/registrationImageUrl url() 형식, affiliation enum,
// career nonnegative) override. phone은 CONTRACT였으나 2026-08-05 실측 명세에 이미 필수로 포함됨.
export const adjusterApplicationBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  specialties: z.array(z.string()),
  region: z.string(),
  affiliation: affiliationSchema,
  registrationImageUrl: z.string().url(),
  licenseNo: z.string().nullish(),
  licenseImageUrl: z.string().url().nullish(),
  career: z.number().int().nonnegative().nullish(),
  introduction: z.string().nullish(),
});

type _AdjusterApplicationBodyDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<
    z.infer<typeof adjusterApplicationBodySchema>,
    CreateAdjusterApplicationRequest
  >
>;

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
// 생성 스키마는 와이어 필드명(snake)인데 client가 응답을 camel로 바꿔 넘기므로 여기선 쓸 수 없다.
// 응답 스키마를 스펙 필드명으로 옮기는 작업(#283)이 끝나면 생성 스키마로 되돌린다.
// status는 명세도 string(enum 미확정).
export const adjusterApplicationResponseSchema = z.object({
  applicationId: z.uuid(),
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

type _AdjusterApplicationStatusDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<AdjusterApplicationStatus, "documents">, GenAdjusterApplicationStatus>
>;
type _AdjusterApplicationResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<AdjusterApplicationResponse, GenCreateAdjusterApplicationResponse>
>;
