import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";

interface RoomStatusMeta {
  label: string;
  tone: NonNullable<StatusBadgeProps["tone"]>;
}

export const ROOM_STATUS_META: Record<RoomStatus, RoomStatusMeta> = {
  REQUESTED: { label: "상담 요청됨", tone: "gold" },
  ACTIVE: { label: "상담 진행 중", tone: "green" },
  CLOSED: { label: "상담 종료", tone: "neutral" },
};
