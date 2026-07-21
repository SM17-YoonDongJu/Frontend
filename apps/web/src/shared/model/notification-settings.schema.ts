import { z } from "zod";

/**
 * 알림 설정 — GET·PATCH /users/me/notification-settings (명세 V21, 10필드).
 * partner/mypage와 customer/mypage 두 그룹이 동일 API를 소비 → src/shared 승격(이슈 #105).
 * API는 role 무관 전체 토글 반환 — 역할별 노출은 FE 담당:
 * 사정사 = newReviewRequest·consultMessage·reviewDeadlineSoon·settlementNotice·marketing,
 * 고객 = reviewComplete·receivedProposal·consultAccepted·analysisComplete·identityVerified·marketing.
 */
export const notificationSettingsSchema = z.object({
  newReviewRequest: z.boolean(),
  consultMessage: z.boolean(),
  settlementNotice: z.boolean(),
  reviewDeadlineSoon: z.boolean(),
  reviewComplete: z.boolean(),
  receivedProposal: z.boolean(),
  consultAccepted: z.boolean(),
  analysisComplete: z.boolean(),
  identityVerified: z.boolean(),
  marketing: z.boolean(),
  // CONTRACT(명세없음-등재 요청 중, 이슈 #105): 카카오톡 플러스 친구 알림. Figma에 행이 존재해 UI 유지, 백엔드 등재 요청 중.
  // 확정 응답엔 이 키가 없다 → 필수로 두면 실서버에서 알림 설정 파싱이 통째로 깨진다. 키 부재 허용(nullish → false).
  kakaoPlusFriend: z
    .boolean()
    .nullish()
    .transform((value) => value ?? false),
});

export const updateNotificationSettingsBodySchema =
  notificationSettingsSchema.partial();

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type UpdateNotificationSettingsBody = z.infer<
  typeof updateNotificationSettingsBodySchema
>;
