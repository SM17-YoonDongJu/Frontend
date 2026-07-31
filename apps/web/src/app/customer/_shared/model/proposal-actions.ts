import type { MatchStatus } from "@/shared/api/chat/chat.schema";

/**
 * 제안 상태별 카드 액션 분기. 상태 흐름은
 * SENT(제안 도착) → COUNSELING(상담 채팅 진행) → ACCEPTED(매칭 완료) / REJECTED(종료).
 * 매칭 완료(ACCEPTED PATCH)는 COUNSELING에서만 유효하다.
 */
export type ProposalAction =
  | "REQUEST_CONSULT" // SENT — 상담 신청(채팅방 생성 API 명세없음 → 이번 스코프 비구현)
  | "IN_CONSULT" // COUNSELING — 상담채팅 진행 + 매칭 완료
  | "DONE" // ACCEPTED — 매칭 완료 표시 + 채팅 보기(읽기 전용)
  | "ENDED"; // REJECTED — 종료

export function getProposalAction(status: MatchStatus): ProposalAction {
  switch (status) {
    case "SENT":
      return "REQUEST_CONSULT";
    case "COUNSELING":
      return "IN_CONSULT";
    case "ACCEPTED":
      return "DONE";
    case "REJECTED":
      return "ENDED";
  }
}

/** 매칭 완료(ACCEPTED PATCH) 가능 여부 — 서버 전이 규칙과 동일하게 COUNSELING에서만 허용. */
export function canMatchProposal(status: MatchStatus): boolean {
  return status === "COUNSELING";
}
