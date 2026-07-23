"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChatRoom } from "@/shared/api/chat/chat.schema";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import type { MatchGroup } from "@/shared/api/chat/match-status";
import { toMatchGroup } from "@/shared/api/chat/match-status";
import { cn } from "@/shared/lib/utils";
import { ChatBubble } from "@/shared/ui/icons/ChatBubble";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { Search } from "@/shared/ui/icons/Search";
import { ChatListComparisonBanner } from "./ChatListComparisonBanner";
import { ChatRoomListItem } from "./ChatRoomListItem";

interface MatchGroupMeta {
  key: MatchGroup;
  label: string;
  labelClass: string;
  countClass: string;
}

// Figma 1012:10975·11440·11462 — 상태 그룹 섹션 헤더(라벨·카운트 톤).
const MATCH_GROUP_SECTIONS: MatchGroupMeta[] = [
  {
    key: "comparing",
    label: "상담 중 · 비교",
    labelClass: "text-gold-ink",
    countClass: "bg-gold-soft text-gold-ink",
  },
  {
    key: "matched",
    label: "진행 중 · 매칭 완료",
    labelClass: "text-green",
    countClass: "bg-green-soft text-green",
  },
  {
    key: "ended",
    label: "종료된 상담",
    labelClass: "text-ink-3",
    countClass: "bg-paper text-ink-3",
  },
];

/** 대화가 없을 때 안내 CTA(역할별) — customer는 손해사정사 찾기로 이동, partner는 없음 */
export interface ChatEmptyAction {
  href: string;
  label: string;
}

export interface ChatRoomListPanelProps {
  rooms: ChatRoom[];
  activeChatRoomId?: string;
  buildHref: (chatRoomId: string) => string;
  emptyAction?: ChatEmptyAction;
  /** customer=true(상태 그룹 섹션) / partner 미전달=false(현행 평면) */
  grouped?: boolean;
}

export function ChatRoomListPanel({
  rooms,
  activeChatRoomId,
  buildHref,
  emptyAction,
  grouped,
}: ChatRoomListPanelProps) {
  const [query, setQuery] = useState("");
  // 아코디언 접힘 그룹 — 기본은 "종료된 상담"만 접힘(사용자 확정)
  const [collapsed, setCollapsed] = useState<Set<MatchGroup>>(() => new Set(["ended"]));

  const toggleGroup = (key: MatchGroup) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const filteredRooms = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rooms;
    return rooms.filter((room) => {
      const haystack = `${room.counterpart.name} ${room.lastMessage ?? ""}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [rooms, query]);

  // 비교 배너용 — 비교중 그룹 방(모바일 목록 상단 배너 노출·수 계산)
  const comparingRooms = useMemo(
    () =>
      filteredRooms.filter(
        (room) => toMatchGroup(room.matchStatus, room.roomStatus) === "comparing",
      ),
    [filteredRooms],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Figma — 모바일 제목 23px(663:3655) · 데스크톱 20px + 하단 구분선(95:4574) */}
      <div className="px-5 pb-3 pt-1 md:border-b md:border-line-2 md:pb-3.5 md:pt-4">
        <h1 className="font-serif text-[1.4375rem] font-bold text-ink md:text-[1.25rem]">메시지</h1>
      </div>

      {/* 대화 검색 — Figma 데스크톱(95:4573)엔 검색창 없음 */}
      <div className="px-5 pb-2 md:hidden">
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
        <ChatRoomsEmpty action={emptyAction} />
      ) : filteredRooms.length === 0 ? (
        <PanelEmpty title="검색 결과가 없어요" description="다른 검색어로 찾아보세요." />
      ) : grouped ? (
        /* customer — 매칭 그룹 섹션(상담 중·비교 / 진행 중·매칭 완료 / 종료된 상담) */
        <div className="flex-1 overflow-y-auto pb-5 md:pb-0">
          {comparingRooms[0] && (
            // Figma 1011:9251 — 모바일 목록 상단 비교 배너(데스크톱 목록엔 없음)
            <ChatListComparisonBanner
              reportTypeLabel={accidentTypeLabel(comparingRooms[0].reportTypeLabel)}
              comparingCount={comparingRooms.length}
              className="md:hidden"
            />
          )}
          {MATCH_GROUP_SECTIONS.map((section) => {
            const sectionRooms = filteredRooms.filter(
              (room) => toMatchGroup(room.matchStatus, room.roomStatus) === section.key,
            );
            if (sectionRooms.length === 0) return null;

            const isCollapsed = collapsed.has(section.key);

            return (
              // Figma 1011:9252 — 모바일은 그룹 라벨을 카드 밖 상단에, 방들은 흰 라운드 카드. 데스크톱은 평면 섹션
              <section key={section.key} className="px-5 pt-2 first:pt-1 md:p-0">
                {/* 아코디언 헤더 — 클릭 시 섹션 펼침/접힘 */}
                <button
                  type="button"
                  onClick={() => toggleGroup(section.key)}
                  aria-expanded={!isCollapsed}
                  className="flex w-full items-center gap-1.5 px-0.5 py-2 text-left md:bg-paper-2 md:px-5 md:py-2.5 md:transition md:hover:brightness-[.98]"
                >
                  <span
                    className={cn(
                      "text-[0.75rem] font-bold md:text-[0.6875rem]",
                      section.labelClass,
                    )}
                  >
                    {section.label}
                  </span>
                  <span
                    className={cn(
                      "flex min-w-[1.125rem] justify-center rounded-full px-1.5 py-0.5 text-center text-[0.6875rem] font-bold",
                      section.countClass,
                    )}
                  >
                    {sectionRooms.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      "ml-auto text-[1rem] text-ink-3 transition-transform",
                      isCollapsed && "-rotate-90",
                    )}
                  />
                </button>
                {!isCollapsed && (
                  <ul className="overflow-hidden rounded-card border border-line bg-card shadow-card md:rounded-none md:border-0 md:bg-transparent md:shadow-none">
                    {sectionRooms.map((room) => (
                      <li
                        key={room.chatRoomId}
                        className="border-b border-line-2 last:border-b-0"
                      >
                        <ChatRoomListItem
                          name={room.counterpart.name}
                          caseNo={room.caseNo}
                          lastMessage={room.lastMessage}
                          lastMessageAt={room.lastMessageAt}
                          avatarUrl={room.counterpart.avatarUrl}
                          roomStatus={room.roomStatus}
                          matchStatus={room.matchStatus ?? undefined}
                          reportTypeLabel={accidentTypeLabel(room.reportTypeLabel)}
                          href={buildHref(room.chatRoomId)}
                          active={room.chatRoomId === activeChatRoomId}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Figma 663:3663 — 모바일은 방 목록을 흰 카드로 감싸고, 데스크톱(95:4571)은 패널에 바로 얹음 */
        <div className="flex-1 overflow-y-auto px-5 pb-5 md:px-0 md:pb-0">
          <ul className="overflow-hidden rounded-card border border-line bg-card shadow-card md:rounded-none md:border-0 md:bg-transparent md:shadow-none">
            {filteredRooms.map((room) => (
              <li key={room.chatRoomId} className="border-b border-line-2 last:border-b-0">
                <ChatRoomListItem
                  name={room.counterpart.name}
                  caseNo={room.caseNo}
                  lastMessage={room.lastMessage}
                  lastMessageAt={room.lastMessageAt}
                  avatarUrl={room.counterpart.avatarUrl}
                  roomStatus={room.roomStatus}
                  href={buildHref(room.chatRoomId)}
                  active={room.chatRoomId === activeChatRoomId}
                />
              </li>
            ))}
          </ul>
        </div>
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

/** 대화 없음 빈 상태 (Figma 916:23603) — 말풍선 일러스트 + 안내 + 역할별 CTA */
function ChatRoomsEmpty({ action }: { action?: ChatEmptyAction }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
      {/* 두 말풍선 일러스트 — 뒤 회색(점 3개) + 앞 골드 */}
      <div className="relative h-[4.875rem] w-[7.5rem]" aria-hidden>
        <div className="absolute left-[0.375rem] top-5 flex h-[3.625rem] w-[4.625rem] items-center justify-center gap-1 rounded-[1.125rem] rounded-bl-[0.25rem] border border-line bg-card shadow-raised">
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
          <span className="size-1.5 rounded-[0.1875rem] bg-line" />
        </div>
        <div className="absolute left-[3.625rem] top-0 flex h-[2.875rem] w-[3.625rem] items-center justify-center rounded-[1rem] rounded-br-[0.25rem] border border-gold-2 bg-gold-soft">
          <ChatBubble className="text-[1.25rem] text-gold-ink" />
        </div>
      </div>

      <p className="mt-6 text-[1rem] font-bold text-ink">아직 진행 중인 대화가 없어요</p>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
        사정사에게 상담을 신청하거나 받은 제안을 수락하면
        <br />
        여기서 대화가 시작돼요.
      </p>

      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-button bg-paper px-4 py-2 text-[0.8125rem] font-bold text-ink transition hover:brightness-[.97]"
        >
          {action.label}
          <Search className="text-[0.9375rem] text-ink-3" />
        </Link>
      )}
    </div>
  );
}
