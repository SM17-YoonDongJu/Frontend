import { z } from "zod";

/** 알림 설정 — GET·PATCH /users/me/notification-settings. 사정사 화면 노출은 4종(newReviewRequest·consultMessage·settlementNotice·marketing). */

export const notificationSettingsSchema = z.object({
  newReviewRequest: z.boolean(),
  consultMessage: z.boolean(),
  settlementNotice: z.boolean(),
  reviewComplete: z.boolean(),
  receivedProposal: z.boolean(),
  marketing: z.boolean(),
});

export const updateNotificationSettingsBodySchema =
  notificationSettingsSchema.partial();
