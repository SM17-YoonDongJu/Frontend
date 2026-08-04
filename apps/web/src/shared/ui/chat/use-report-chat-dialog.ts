"use client";

import { useState } from "react";
import type { ReportChatBody } from "@/shared/api/chat/chat.schema";
import { useReportChat } from "@/shared/api/chat/use-report-chat";
import { toast } from "@/shared/ui/toast";

const REPORT_FAILED_MESSAGE = "신고 접수에 실패했어요. 잠시 후 다시 시도해 주세요.";

/**
 * 신고 다이얼로그 상태 + 뮤테이션 배선. customer·partner 컨테이너가 같은 배선을 복붙하지 않도록 응집한다.
 * 실패는 코드별 분기 없이 단일 경로(401은 fetch-json이 /login-required로 가로챈다).
 */
export function useReportChatDialog(chatRoomId: string) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate, isPending } = useReportChat(chatRoomId);

  const openDialog = () => {
    setErrorMessage(null);
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const submit = (body: ReportChatBody) =>
    mutate(body, {
      onSuccess: () => {
        setOpen(false);
        toast.success("신고가 접수됐어요. 운영팀이 확인 후 안내드릴게요.");
      },
      // 다이얼로그를 열어 둔 채 입력값을 보존해 재제출할 수 있게 한다.
      onError: () => setErrorMessage(REPORT_FAILED_MESSAGE),
    });

  return { open, openDialog, closeDialog, submit, pending: isPending, errorMessage };
}
