import { z } from "zod";
import type { RoomStatus } from "./chat.schema";

// report_reviews.status 원천. GET /reports/{id}/proposals status와 동일 축.
export const matchStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "REJECTED",
  "ACCEPTED",
]);
export type MatchStatus = z.infer<typeof matchStatusSchema>;

// UI 3그룹 파생(비교중 / 매칭완료 / 종료). CLOSED(roomStatus)도 종료로 흡수.
export type MatchGroup = "comparing" | "matched" | "ended";

// 방 종료는 두 축(matchStatus·roomStatus) 중 하나라도 종료면 종료로 본다.
export function toMatchGroup(
  matchStatus: MatchStatus,
  roomStatus: RoomStatus,
): MatchGroup {
  if (matchStatus === "ACCEPTED") return "matched";
  if (matchStatus === "REJECTED" || roomStatus === "CLOSED") return "ended";
  return "comparing";
}

// 입력 가능 여부: 비교중·매칭완료만 전송 가능. 종료는 read-only.
export function isChatWritable(group: MatchGroup): boolean {
  return group !== "ended";
}
