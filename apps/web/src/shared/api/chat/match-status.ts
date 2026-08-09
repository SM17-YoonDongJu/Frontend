import type { MatchStatus, RoomStatus } from "./chat.schema";

// UI 3그룹 파생(비교중 / 매칭완료 / 종료). match_status(파이프라인)와 room_status를 합쳐 계산.
export type MatchGroup = "comparing" | "matched" | "ended";

// ACCEPTED를 CLOSED보다 먼저 본다 — 수락 시 방도 CLOSED지만 표시 그룹은 '매칭 완료'.
// matchStatus null(사정사 검색 방)은 매칭 파이프라인이 없어 CLOSED면 종료, 아니면 비교로 취급.
export function toMatchGroup(
  matchStatus: MatchStatus | null,
  roomStatus: RoomStatus,
): MatchGroup {
  if (matchStatus === "ACCEPTED") return "matched";
  if (matchStatus === "REJECTED" || roomStatus === "CLOSED") return "ended";
  return "comparing";
}
