import { ChatEmptyPane } from "@/shared/ui/chat/ChatEmptyPane";
import { ChatListContent } from "@/shared/ui/chat/ChatListContent";
import { ChatListSkeleton } from "@/shared/ui/chat/ChatListSkeleton";
import { ChatSectionBoundary } from "@/shared/ui/chat/ChatSectionBoundary";
import { ChatSplitShell } from "@/shared/ui/chat/ChatSplitShell";

const CHAT_BASE_PATH = "/customer/chat";
const EMPTY_ACTION = { href: "/customer/adjusters", label: "손해사정사 찾아보기" };

export default function CustomerChatPage() {
  return (
    <ChatSplitShell
      variant="list"
      list={
        <ChatSectionBoundary
          fallback={<ChatListSkeleton />}
          errorTitle="대화 목록을 불러오지 못했어요"
        >
          <ChatListContent chatBasePath={CHAT_BASE_PATH} emptyAction={EMPTY_ACTION} grouped />
        </ChatSectionBoundary>
      }
      main={<ChatEmptyPane />}
    />
  );
}
