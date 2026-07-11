import Link from "next/link";
import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import type { MatchStatus } from "@/shared/api/chat/match-status";
import { toMatchGroup } from "@/shared/api/chat/match-status";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/Avatar";
import { Check } from "@/shared/ui/icons/Check";
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
  /** 매칭 상태(customer 그룹 목록). 미전달(partner)이면 roomStatus 기반 렌더 유지 */
  matchStatus?: MatchStatus;
  /** 사건 유형 라벨(예 "후유장해"). customer 그룹 목록에서 이름 옆 "· {label}" 표시. 미전달(partner)이면 미표시 */
  reportTypeLabel?: string;
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
  matchStatus,
  reportTypeLabel,
}: ChatRoomListItemProps) {
  const group = matchStatus ? toMatchGroup(matchStatus, roomStatus) : null;
  // partner(미전달)는 기존 roomStatus 기반, customer는 매칭 그룹 파생을 따른다.
  const ended = group ? group === "ended" : roomStatus === "CLOSED";
  const matched = group === "matched";

  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex items-center gap-3 border-l-[3px] px-4 py-3.5 transition",
        // Figma 95:4577 — 활성 행: 골드소프트 배경 + 좌측 3px 골드 바
        active
          ? matched
            ? "border-green bg-green-soft"
            : "border-gold bg-gold-soft"
          : "border-transparent hover:bg-paper-2",
        // Figma 1012:11467 — 종료된 상담 행은 흐리게
        ended && "opacity-[.55]",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={avatarUrl}
          name={name}
          className="md:size-[2.625rem] md:text-[1.1rem]"
        />
        {matched && (
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-card bg-green text-white"
          >
            <Check className="text-[0.5rem]" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[0.8625rem] font-bold text-ink">{name}</span>
          {reportTypeLabel && (
            // Figma 1011:9706 — 이름 옆 사건 유형(10px·ink-3)
            <span className="shrink-0 text-[0.625rem] text-ink-3">· {reportTypeLabel}</span>
          )}
          {ended && (
            <span className="sr-only">{ROOM_STATUS_META.CLOSED.label}</span>
          )}
          {matched && <span className="sr-only">매칭 완료</span>}
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
