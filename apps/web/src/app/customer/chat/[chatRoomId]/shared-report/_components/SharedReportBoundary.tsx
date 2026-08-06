"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { SharedReportSkeleton } from "./SharedReportSkeleton";
import { SharedReportView } from "./SharedReportView";

const ERROR_MESSAGES = {
  CHAT_NOT_A_MEMBER: {
    title: "접근 권한이 없어요",
    desc: "참여 중인 상담방의 리포트만 볼 수 있어요.",
  },
  CHAT_ROOM_NOT_FOUND: {
    title: "상담방을 찾을 수 없어요",
    desc: "종료되었거나 잘못된 주소예요.",
  },
  REPORT_NOT_FOUND: {
    title: "검수 리포트가 아직 없어요",
    desc: "사정사가 검수를 마치면 여기서 확인할 수 있어요.",
  },
  PROPOSAL_NOT_FOUND: {
    title: "검수 리포트가 아직 없어요",
    desc: "사정사가 검수를 마치면 여기서 확인할 수 있어요.",
  },
};

export function SharedReportBoundary({ chatRoomId }: { chatRoomId: string }) {
  return (
    <AsyncBoundary
      fallback={<SharedReportSkeleton />}
      errorLayout="page"
      errorTitle="검수 리포트를 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <SharedReportView chatRoomId={chatRoomId} />
    </AsyncBoundary>
  );
}
