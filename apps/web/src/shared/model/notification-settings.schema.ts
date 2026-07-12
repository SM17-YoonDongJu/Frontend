import { z } from "zod";

/**
 * 알림 설정 — GET·PATCH /users/me/notification-settings.
 * partner/mypage와 customer/mypage 두 그룹이 동일 API를 소비 → src/shared 승격(이슈 #105).
 * 사정사 노출 4종(newReviewRequest·consultMessage·settlementNotice·marketing),
 * 고객 노출 2종(receivedProposal·kakaoPlusFriend).
 */
export const notificationSettingsSchema = z.object({
  newReviewRequest: z.boolean(),
  consultMessage: z.boolean(),
  settlementNotice: z.boolean(),
  reviewComplete: z.boolean(),
  receivedProposal: z.boolean(),
  marketing: z.boolean(),
  // CONTRACT(명세없음, 이슈 #105): 카카오톡 플러스 친구 알림 채널(marketing과 별개).
  // 초안 .pr-assets/api-spec-draft-user-mypage.md — 백엔드 미확정.
  kakaoPlusFriend: z.boolean(),
});

export const updateNotificationSettingsBodySchema =
  notificationSettingsSchema.partial();

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type UpdateNotificationSettingsBody = z.infer<
  typeof updateNotificationSettingsBodySchema
>;
