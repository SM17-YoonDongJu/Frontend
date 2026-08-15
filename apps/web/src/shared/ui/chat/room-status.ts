import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";

interface RoomStatusMeta {
  label: string;
  tone: NonNullable<StatusBadgeProps["tone"]>;
}

export const ROOM_STATUS_META: Record<RoomStatus, RoomStatusMeta> = {
  ACTIVE: { label: "상담 진행 중", tone: "green" },
  CLOSED: { label: "상담 종료", tone: "neutral" },
  // 명세에 없는 상태 — 단정하지 않고 중립 배지로 보여준다.
  UNKNOWN: { label: "확인 필요", tone: "neutral" },
};
