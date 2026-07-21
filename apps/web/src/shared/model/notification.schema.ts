import { z } from "zod";

export const notificationTypeSchema = z.enum([
  // 고객계
  "REVIEW_COMPLETE",
  "RECEIVED_PROPOSAL",
  "CONSULT_ACCEPTED",
  "ANALYSIS_COMPLETE",
  "IDENTITY_VERIFIED",
  "CHAT_MESSAGE",
  "SETTLEMENT_NOTICE",
  "PROPOSAL_CLOSED",
  // 사정사계
  "NEW_REVIEW_REQUEST",
  "REVIEW_DEADLINE_SOON",
  "CONSULT_REQUESTED",
]);

export const notificationSchema = z.object({
  id: z.uuid(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const notificationListSchema = z.object({
  items: z.array(notificationSchema),
  unreadCount: z.number(),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationList = z.infer<typeof notificationListSchema>;
