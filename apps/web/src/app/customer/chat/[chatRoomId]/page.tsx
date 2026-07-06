import { ChatListContent } from "@/shared/ui/chat/ChatListContent";
import { ChatListSkeleton } from "@/shared/ui/chat/ChatListSkeleton";
import { ChatSectionBoundary } from "@/shared/ui/chat/ChatSectionBoundary";
import { ChatSplitShell } from "@/shared/ui/chat/ChatSplitShell";
import { ChatThreadContent } from "@/shared/ui/chat/ChatThreadContent";
import { ChatThreadSkeleton } from "@/shared/ui/chat/ChatThreadSkeleton";

const CHAT_BASE_PATH = "/customer/chat";
const REPORT_BASE_PATH = "/customer/report";
const EMPTY_ACTION = { href: "/customer/adjusters", label: "손해사정사 찾아보기" };

export default async function CustomerChatThreadPage({
  params,
}: {
  params: Promise<{ chatRoomId: string }>;
}) {
  const { chatRoomId } = await params;

  return (
    <ChatSplitShell
      variant="thread"
      list={
        <ChatSectionBoundary
          fallback={<ChatListSkeleton />}
          errorTitle="대화 목록을 불러오지 못했어요"
        >
          <ChatListContent
            chatBasePath={CHAT_BASE_PATH}
            activeChatRoomId={chatRoomId}
            emptyAction={EMPTY_ACTION}
          />
        </ChatSectionBoundary>
      }
      main={
        <ChatSectionBoundary
          fallback={<ChatThreadSkeleton />}
          errorTitle="대화를 불러오지 못했어요"
        >
          <ChatThreadContent
            chatRoomId={chatRoomId}
            chatBasePath={CHAT_BASE_PATH}
            reportBasePath={REPORT_BASE_PATH}
          />
        </ChatSectionBoundary>
      }
    />
  );
}
