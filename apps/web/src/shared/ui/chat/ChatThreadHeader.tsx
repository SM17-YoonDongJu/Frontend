import Link from "next/link";
import type { RoomStatus } from "@/shared/api/chat/chat.schema";
import { Avatar } from "@/shared/ui/Avatar";
import { ArrowLeft } from "@/shared/ui/icons/ArrowLeft";
import { FileText } from "@/shared/ui/icons/FileText";
import { ROOM_STATUS_META } from "./room-status";

export interface ChatThreadHeaderProps {
  name: string;
  caseNo: string;
  roomStatus: RoomStatus;
  reportHref: string;
  /** 모바일 뒤로가기 — 없으면 버튼 미노출 */
  onBack?: () => void;
}

export function ChatThreadHeader({
  name,
  caseNo,
  roomStatus,
  reportHref,
  onBack,
}: ChatThreadHeaderProps) {
  const subtitle = `${caseNo} · ${ROOM_STATUS_META[roomStatus].label}`;

  return (
    <header className="flex items-center gap-2.5 border-b border-line-2 bg-paper px-4 py-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="목록으로"
          className="-ml-1 flex size-8 items-center justify-center rounded-full text-[1.25rem] text-ink transition hover:bg-paper-2 md:hidden"
        >
          <ArrowLeft />
        </button>
      )}

      <Avatar name={name} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.85rem] font-bold text-ink">{name}</p>
        <p className="truncate text-[0.6875rem] text-ink-3">{subtitle}</p>
      </div>

      <Link
        href={reportHref}
        aria-label="공유 리포트 열기"
        className="flex size-9 items-center justify-center rounded-button border border-line text-[1.125rem] text-ink transition hover:bg-paper-2"
      >
        <FileText />
      </Link>
    </header>
  );
}
