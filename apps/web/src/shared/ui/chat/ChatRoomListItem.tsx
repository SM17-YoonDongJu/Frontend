import Link from "next/link";
import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/Avatar";
import { formatRoomListTime } from "./format";
import { ROOM_STATUS_META } from "./room-status";

export interface ChatRoomListItemProps {
  name: string;
  caseNo: string;
  lastMessage: string | null;
  lastMessageAt: string;
  avatarUrl: string | null;
  roomStatus: RoomStatus;
  href: string;
  /** 분할 뷰 활성 행 하이라이트 */
  active?: boolean;
}

const EMPTY_MESSAGE = "아직 주고받은 메시지가 없어요.";

export function ChatRoomListItem({
  name,
  caseNo,
  lastMessage,
  lastMessageAt,
  avatarUrl,
  roomStatus,
  href,
  active,
}: ChatRoomListItemProps) {
  const closed = roomStatus === "CLOSED";

  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center gap-3 border-l-2 px-4 py-3.5 transition",
        active
          ? "border-gold bg-paper-2"
          : "border-transparent hover:bg-paper-2",
      )}
    >
      <Avatar src={avatarUrl} name={name} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[0.8625rem] font-bold text-ink">{name}</span>
          {closed && (
            <span className="sr-only">{ROOM_STATUS_META.CLOSED.label}</span>
          )}
          <time className="ml-auto shrink-0 text-[0.6875rem] text-ink-3">
            {formatRoomListTime(lastMessageAt)}
          </time>
        </div>

        <p className="mt-0.5 truncate text-[0.75rem] text-ink-3">
          {lastMessage ?? EMPTY_MESSAGE}
        </p>
        <span className="sr-only">사건번호 {caseNo}</span>
      </div>
    </Link>
  );
}
