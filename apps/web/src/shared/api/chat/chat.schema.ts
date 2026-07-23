import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

// 채팅 도메인 계약(봉투 내부 data만 — fetch-json이 봉투 해제·snake→camel 변환).
// mine/theirs 판별은 서버 isMine(GET/POST messages)로 정합 — senderId 문자열 비교 제거.

export const roomStatusSchema = z.enum(["ACTIVE", "CLOSED"]);

// match_status — 파이프라인(사정사 검수) 방만. 사정사 검색으로 만든 방은 null.
export const matchStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "ACCEPTED",
  "REJECTED",
]);

export const chatCounterpartSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  avatarUrl: z.string().nullable().default(null), // 부재 시 null(이니셜 아바타 폴백)
});

export const chatRoomSchema = z.object({
  chatRoomId: z.uuid(),
  reportId: z.uuid().nullable(), // 사정사 검색 방은 null(공유 리포트 버튼 숨김)
  proposalId: z.uuid().nullable(), // 제안 id — accept/reject 대상(검색 방은 null)
  roomStatus: roomStatusSchema,
  matchStatus: matchStatusSchema.nullable(),
  counterpart: chatCounterpartSchema,
  lastMessage: z.string().nullable(),
  lastMessageAt: z.string(),
  unreadCount: z.number().int(),
  caseNo: z.string().nullable(), // 사정사 검색 방은 리포트 없음
  reportTypeLabel: accidentTypeSchema, // accidentType 슬러그 — 표시는 accidentTypeLabel()로 변환
});

export const chatListSchema = z.object({
  rooms: z.array(chatRoomSchema),
});

// 메시지 첨부(GET/POST messages 응답) — 조회용 단기 presigned url·원본명·MIME.
export const messageAttachmentSchema = z.object({
  url: z.string(),
  name: z.string(),
  contentType: z.string(),
});

export const messageTypeSchema = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);

export const chatMessageSchema = z.object({
  messageId: z.uuid(),
  senderId: z.string(), // 명세 uuid. 낙관적 임시 메시지도 채운다.
  messageType: messageTypeSchema,
  content: z.string().nullable(), // 첨부(IMAGE/FILE) 메시지는 null 가능
  attachment: messageAttachmentSchema.nullable(),
  isMine: z.boolean(),
  createdAt: z.string(),
});

export const chatMessagesSchema = z.object({
  messages: z.array(chatMessageSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
});

// 전송 요청 — content·attachment 중 최소 1개. 첨부는 업로드 응답 메타(key)를 전달.
export const sendChatMessageAttachmentSchema = z.object({
  attachmentKey: z.string(),
  name: z.string(),
  contentType: z.string(),
});

export const sendChatMessageBodySchema = z
  .object({
    content: z.string().optional(),
    attachment: sendChatMessageAttachmentSchema.optional(),
  })
  .refine((body) => Boolean(body.content) || Boolean(body.attachment), {
    message: "content 또는 attachment 중 하나는 필요합니다.",
  });

export const sendChatMessageResponseSchema = z.object({
  messageId: z.uuid(),
  chatRoomId: z.uuid(),
  senderId: z.string(),
  messageType: messageTypeSchema,
  content: z.string().nullable(),
  attachment: messageAttachmentSchema.nullable(),
  createdAt: z.string(),
});

// 첨부 업로드 응답(POST /chats/{id}/attachments) — key 기반. 메시지 전송에 attachment로 연결.
export const uploadChatAttachmentResponseSchema = z.object({
  attachmentKey: z.string(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
});

// 상담 수락(PATCH accept) — 내 제안 ACCEPTED · 리포트 CLOSED · 방 CLOSED(형제 방도 CLOSED).
export const acceptChatResponseSchema = z.object({
  chatRoomId: z.uuid(),
  chatRoomStatus: z.literal("CLOSED"),
  reviewStatus: z.literal("ACCEPTED"),
  reportId: z.uuid(),
  reportStatus: z.string(),
});

// 상담 거절(PATCH reject) — 내 제안 REJECTED · 리포트 AWAITING_ADOPTION · 방 CLOSED.
export const rejectChatResponseSchema = z.object({
  chatRoomId: z.uuid(),
  chatRoomStatus: z.literal("CLOSED"),
  reviewStatus: z.literal("REJECTED"),
  reportId: z.uuid(),
  reportStatus: z.string(),
});

// 읽음 처리(POST read) — 이후 unread_count 0.
export const readChatResponseSchema = z.object({
  chatRoomId: z.uuid(),
  readAt: z.string(),
});

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type MatchStatus = z.infer<typeof matchStatusSchema>;
export type ChatCounterpart = z.infer<typeof chatCounterpartSchema>;
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type ChatList = z.infer<typeof chatListSchema>;
export type MessageAttachment = z.infer<typeof messageAttachmentSchema>;
export type MessageType = z.infer<typeof messageTypeSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessages = z.infer<typeof chatMessagesSchema>;
export type SendChatMessageBody = z.infer<typeof sendChatMessageBodySchema>;
export type SendChatMessageResponse = z.infer<
  typeof sendChatMessageResponseSchema
>;
export type UploadChatAttachmentResponse = z.infer<
  typeof uploadChatAttachmentResponseSchema
>;
export type AcceptChatResponse = z.infer<typeof acceptChatResponseSchema>;
export type RejectChatResponse = z.infer<typeof rejectChatResponseSchema>;
export type ReadChatResponse = z.infer<typeof readChatResponseSchema>;
