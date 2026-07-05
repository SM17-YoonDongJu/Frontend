"use client";

import { useMemo, useState } from "react";
import type { ChatRoom } from "@/shared/api/chat/chat.schema";
import { Search } from "@/shared/ui/icons/Search";
import { ChatRoomListItem } from "./ChatRoomListItem";

export interface ChatRoomListPanelProps {
  rooms: ChatRoom[];
  activeChatRoomId?: string;
  buildHref: (chatRoomId: string) => string;
}

export function ChatRoomListPanel({
  rooms,
  activeChatRoomId,
  buildHref,
}: ChatRoomListPanelProps) {
  const [query, setQuery] = useState("");

  const filteredRooms = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rooms;
    return rooms.filter((room) => {
      const haystack = `${room.adjusterName} ${room.lastMessage ?? ""}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [rooms, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-3 pt-1">
        <h1 className="font-serif text-[1.4375rem] font-bold text-ink">메시지</h1>
      </div>

      <div className="px-5 pb-2">
        <div className="flex items-center gap-2.5 rounded-input border border-line bg-card px-4 py-3 focus-within:border-gold focus-within:ring-[3px] focus-within:ring-gold-soft">
          <Search className="shrink-0 text-[1.125rem] text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="대화 검색"
            aria-label="대화 검색"
            className="w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-3"
          />
        </div>
      </div>

      {rooms.length === 0 ? (
        <PanelEmpty
          title="진행 중인 상담이 없어요"
          description="손해사정사와 상담이 시작되면 여기에 표시돼요."
        />
      ) : filteredRooms.length === 0 ? (
        <PanelEmpty title="검색 결과가 없어요" description="다른 검색어로 찾아보세요." />
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => (
            <li key={room.chatRoomId} className="border-b border-line-2 last:border-b-0">
              <ChatRoomListItem
                name={room.adjusterName}
                caseNo={room.caseNo}
                lastMessage={room.lastMessage}
                lastMessageAt={room.lastMessageAt}
                avatarUrl={room.avatarUrl}
                roomStatus={room.roomStatus}
                href={buildHref(room.chatRoomId)}
                active={room.chatRoomId === activeChatRoomId}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PanelEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[0.9375rem] font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-[0.8125rem] text-ink-3">{description}</p>
    </div>
  );
}
