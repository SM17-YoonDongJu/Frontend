import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";
import type {
  Attachment,
  ChatMessageResponse as GenChatMessageResponse,
  ChatRoomSummaryResponse,
  ConsultationDecisionResponse,
  ReadResponse,
} from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// 채팅 도메인 계약(응답 래퍼 내부 data만 — client가 래퍼 해제·snake→camel 변환).
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

export const chatRoomSchema = z
  .object({
    chatRoomId: z.uuid(),
    reportId: z.uuid().nullable(), // 사정사 검색 방은 null(공유 리포트 버튼 숨김)
    // 명세 필드명은 report_review_id(→ reportReviewId). 구 응답 proposal_id도 허용하고 proposalId로 정규화.
    proposalId: z.uuid().nullish(), // 제안 id — accept/reject 대상(검색 방은 null)
    reportReviewId: z.uuid().nullish(),
    roomStatus: roomStatusSchema,
    matchStatus: matchStatusSchema.nullable(),
    counterpart: chatCounterpartSchema,
    lastMessage: z.string().nullable(),
    lastMessageAt: z.string().nullable(), // 메시지 없는 방(생성 직후)은 null
    unreadCount: z.number().int(),
    caseNo: z.string().nullable(), // 사정사 검색 방은 리포트 없음
    reportTypeLabel: accidentTypeSchema.nullable(), // accidentType 슬러그(표시는 accidentTypeLabel()) — 사정사 검색 방은 null
  })
  .transform(({ reportReviewId, ...room }) => ({
    ...room,
    proposalId: room.proposalId ?? reportReviewId ?? null,
  }));

export const chatListSchema = z.object({
  rooms: z.array(chatRoomSchema),
});

// 첨부 업로드 응답(BE UploadAttachmentResponse) — key 기반. 전송 요청 attachments도 이 shape 그대로 전달.
export const chatAttachmentSchema = z.object({
  attachmentKey: z.string(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
});

// 메시지 응답의 첨부(BE ChatMessageResponse.Attachment) — 조회 시점 단기 presigned GET URL 포함, key는 없음.
// 업로드 응답과 shape이 달라 별도 스키마로 분리한다.
export const chatMessageAttachmentSchema = z.object({
  url: z.string(),
  name: z.string(),
  contentType: z.string(),
  size: z.number().int(),
});

export const messageTypeSchema = z.enum(["TEXT", "IMAGE", "FILE", "SYSTEM"]);

export const chatMessageSchema = z.object({
  messageId: z.uuid(),
  senderId: z.string().nullable(), // SYSTEM 메시지(상담 시작/종료 안내)는 발신자 없음 → null
  messageType: messageTypeSchema,
  content: z.string().nullable(), // 첨부(IMAGE/FILE) 메시지는 null 가능
  attachment: chatMessageAttachmentSchema.nullable(),
  isMine: z.boolean(),
  createdAt: z.string(),
});

export const chatMessagesSchema = z.object({
  messages: z.array(chatMessageSchema),
  nextCursor: z.string().nullable(),
  hasNext: z.boolean(),
});

// 전송 요청(BE SendMessageRequest) — content·attachments 중 최소 1개. 첨부는 업로드 응답 메타를 배열로 전달.
export const sendChatMessageBodySchema = z
  .object({
    content: z.string().optional(),
    attachments: z.array(chatAttachmentSchema).optional(),
  })
  .refine(
    (body) => Boolean(body.content) || (body.attachments?.length ?? 0) > 0,
    { message: "content 또는 attachments 중 하나는 필요합니다." },
  );

// 전송 응답(BE ChatMessageResponse) — 조회 목록과 동일 레코드를 공유(chatRoomId·isMine 포함).
export const sendChatMessageResponseSchema = z.object({
  messageId: z.uuid(),
  chatRoomId: z.uuid(),
  senderId: z.string().nullable(),
  messageType: messageTypeSchema,
  content: z.string().nullable(),
  attachment: chatMessageAttachmentSchema.nullable(),
  isMine: z.boolean(),
  createdAt: z.string(),
});

// 첨부 업로드 응답(POST /chats/{id}/attachments) — 발급 key 포함 Attachment 그대로.
export const uploadChatAttachmentResponseSchema = chatAttachmentSchema;

// 상담 수락(PATCH accept) — 내 제안 ACCEPTED · 리포트 CLOSED. 내 방은 CLOSED하지 않고 ACTIVE로 유지(형제 방만 CLOSED).
export const acceptChatResponseSchema = z.object({
  chatRoomId: z.uuid(),
  // CONTRACT: 명세는 CLOSED, 기존 FE는 ACTIVE literal로 고정돼 있었다 → 드리프트 회피로 enum 수용.
  chatRoomStatus: roomStatusSchema,
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
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type ChatList = z.infer<typeof chatListSchema>;
export type ChatAttachment = z.infer<typeof chatAttachmentSchema>;
export type ChatMessageAttachment = z.infer<typeof chatMessageAttachmentSchema>;
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

// counterpart는 nested 커스텀 스키마라 얕은 키 대조 대상에서 제외.
type _ChatRoomDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<ChatRoom, "counterpart">, ChatRoomSummaryResponse>
>;
type _ChatAttachmentDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<ChatAttachment, Attachment>
>;
type _ChatMessageDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<ChatMessage, "attachment">, GenChatMessageResponse>
>;
type _SendChatMessageResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<SendChatMessageResponse, "attachment">, GenChatMessageResponse>
>;
type _AcceptChatResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<AcceptChatResponse, ConsultationDecisionResponse>
>;
type _RejectChatResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<RejectChatResponse, ConsultationDecisionResponse>
>;
type _ReadChatResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<ReadChatResponse, ReadResponse>
>;
