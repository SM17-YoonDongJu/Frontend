"use client";

import { useState } from "react";
import { useWithdraw } from "@/shared/api/use-withdraw";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

export function WithdrawPanel() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate, isPending, isError, error, reset } = useWithdraw();

  const requestWithdraw = () => {
    reset();
    setConfirmOpen(false);
    mutate();
  };

  return (
    <div className="mt-6">
      {isError && (
        <div
          role="alert"
          className="mb-4 rounded-card border border-terra-2 bg-terra-soft px-4 py-3"
        >
          <p className="text-[0.875rem] font-semibold text-terra">
            회원 탈퇴를 처리하지 못했어요
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">
            {error.message}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            loading={isPending}
            onClick={() => mutate()}
          >
            다시 시도
          </Button>
        </div>
      )}

      <Button variant="danger" full loading={isPending} onClick={() => setConfirmOpen(true)}>
        {isPending ? "탈퇴 처리 중" : "회원 탈퇴"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title="정말 탈퇴하시겠어요?"
        description="제안·채팅·리포트 이력이 모두 삭제되며 복구할 수 없습니다."
        confirmLabel="탈퇴하기"
        cancelLabel="취소"
        confirmTone="danger"
        onConfirm={requestWithdraw}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
