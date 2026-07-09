import { z } from "zod";
import { matchStatusSchema } from "./match-status";

// 채팅 도메인 계약(봉투 내부 data만 모델링 — fetch-json이 봉투 해제).
// senderId: 노션 명세 그대로 uuid(string). mine/theirs는 현재 사용자 식별자와 문자열 비교.
// ⚠️ userId uuid 전환 백엔드 확인 요청 — use-me의 userId는 number(§7-2)라 String 변환 후 비교.

export const roomStatusSchema = z.enum(["REQUESTED", "ACTIVE", "CLOSED"]);

export const chatRoomSchema = z.object({
  chatRoomId: z.string().uuid(),
  lastMessage: z.string().nullable(),
  updatedAt: z.string(),

  // B군: ⚠️ 명세 수정 예정(ERD 근거, MSW 선반영). participants[]는 ERD 6/24 폐기 → 사용 금지.
  adjusterId: z.string().uuid(), // ⚠️ 명세 수정 예정: CHATROOM.adjuster_id
  adjusterName: z.string(), // ⚠️ 명세 수정 예정: ADJUSTER_PROFILES.name (상대 표시명·역할 중립)
  avatarUrl: z.string().nullable(), // ⚠️ 명세 수정 예정: USERS.avatar_url
  reportId: z.string().uuid(), // ⚠️ 명세 수정 예정: CHATROOM.report_id (공유 리포트 열기 키)
  caseNo: z.string(), // ⚠️ 명세 수정 예정: REPORTS.case_no (표시 "#20260520-017")
  roomStatus: roomStatusSchema, // ⚠️ 명세 수정 예정: CHATROOM.status
  lastMessageAt: z.string(), // ⚠️ 명세 수정 예정: 정렬 기준(desc). updatedAt 대체

  proposalId: z.string().uuid(), // ⚠️ 명세 확장(GET /chats): report_reviews.id — 매칭 PATCH 대상
  matchStatus: matchStatusSchema, // ⚠️ 명세 확장: 방의 제안 상태(비교/매칭/종료 파생 원천)
  reportTypeLabel: z.string(), // ⚠️ 명세 확장: 배너 "후유장해 건" 표시용
});

export const chatListSchema = z.object({
  items: z.array(chatRoomSchema),
});

export const chatMessageSchema = z.object({
  messageId: z.string().uuid(),
  senderId: z.string(), // ⚠️ userId uuid 전환 백엔드 확인 요청 — 명세는 uuid, use-me.userId는 number
  content: z.string(),
  createdAt: z.string(), // ISO — 날짜 구분선·시각 표기 원천(sentAt 아님)
});

export const chatMessagesSchema = z.object({
  list: z.array(chatMessageSchema),
  nextCursor: z.string().nullable(),
});

export const sendChatMessageBodySchema = z.object({
  content: z.string().min(1),
});

export const sendChatMessageResponseSchema = z.object({
  messageId: z.string().uuid(),
  chatRoomId: z.string().uuid(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

// PATCH /chats/{chatRoomId}/close 응답 (Notion 채팅 종료 명세: ACTIVE→CLOSED)
export const closeChatResponseSchema = z.object({
  chatRoomId: z.string().uuid(),
  status: z.literal("CLOSED"),
});

export type RoomStatus = z.infer<typeof roomStatusSchema>;
export type CloseChatResponse = z.infer<typeof closeChatResponseSchema>;
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type ChatList = z.infer<typeof chatListSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessages = z.infer<typeof chatMessagesSchema>;
export type SendChatMessageBody = z.infer<typeof sendChatMessageBodySchema>;
export type SendChatMessageResponse = z.infer<
  typeof sendChatMessageResponseSchema
>;
