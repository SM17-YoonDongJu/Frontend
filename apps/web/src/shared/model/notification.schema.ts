import { z } from "zod";

export const notificationTypeSchema = z.enum([
  "REVIEW_COMPLETE",
  "RECEIVED_PROPOSAL",
  "CONSULT_ACCEPTED",
  "ANALYSIS_COMPLETE",
  "IDENTITY_VERIFIED",
]);

export const notificationSchema = z.object({
  notificationId: z.uuid(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const notificationListSchema = z.object({
  list: z.array(notificationSchema),
});

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationList = z.infer<typeof notificationListSchema>;
