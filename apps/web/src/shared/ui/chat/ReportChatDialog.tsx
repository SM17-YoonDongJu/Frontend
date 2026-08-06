"use client";

import { useEffect, useState } from "react";
import {
  REPORT_DETAIL_MAX_LENGTH,
  type ChatReportReason,
  type ReportChatBody,
} from "@/shared/api/chat/chat.schema";
import { cn } from "@/shared/lib/utils";
import { Modal } from "@/shared/ui/Modal";
import { Textarea } from "@/shared/ui/Textarea";
import { CHAT_REPORT_REASON_OPTIONS } from "./report-reason";

export interface ReportChatDialogProps {
  open: boolean;
  /** 상대 이름 — 안내 문구용 */
  counterpartName: string;
  /** 제출 중 — 버튼 로딩·입력 비활성·dismiss 차단(이중 제출 방지) */
  pending?: boolean;
  /** 인라인 에러 문구(null이면 미표시) */
  errorMessage?: string | null;
  onSubmit: (body: ReportChatBody) => void;
  onClose: () => void;
}

const DETAIL_FIELD_ID = "chat-report-detail";

/** 채팅 상대 신고 다이얼로그(프레젠테이셔널). 서버 통신은 모르고 입력·제출 요청만 다룬다. */
export function ReportChatDialog({
  open,
  counterpartName,
  pending = false,
  errorMessage = null,
  onSubmit,
  onClose,
}: ReportChatDialogProps) {
  const [reason, setReason] = useState<ChatReportReason | null>(null);
  const [detail, setDetail] = useState("");

  // 열릴 때만 초기화 — 실패 후에는 입력값을 보존해 재제출할 수 있게 둔다.
  useEffect(() => {
    if (!open) return;
    setReason(null);
    setDetail("");
  }, [open]);

  const detailRequired = reason === "OTHER";
  const detailFilled = detail.trim().length > 0;
  const submittable = reason !== null && (!detailRequired || detailFilled) && !pending;

  const submit = () => {
    if (reason === null || !submittable) return;
    onSubmit({ reason, reasonDetail: detail.trim() || null });
  };

  return (
    <Modal
      open={open}
      kicker="신고"
      title="이 대화를 신고할까요?"
      dismissible={!pending}
      onClose={onClose}
      className="max-w-[27.5rem]"
    >
      <p className="text-[0.8125rem] leading-relaxed text-ink-2">
        신고 내용은 운영팀만 확인하며, 상대방에게는 알려지지 않아요.
      </p>
      <span className="sr-only">신고 대상: {counterpartName}</span>

      <fieldset className="mt-5 flex flex-col gap-2" disabled={pending}>
        <legend className="sr-only">신고 사유</legend>
        {CHAT_REPORT_REASON_OPTIONS.map((option) => {
          const selected = reason === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-card border px-4 py-3 text-[0.875rem] transition focus-within:ring-[3px] focus-within:ring-gold-soft",
                selected
                  ? "border-gold bg-gold-soft/40 font-semibold text-ink"
                  : "border-line-2 bg-paper-2 text-ink-2 hover:border-gold-2 hover:bg-gold-soft/30",
                pending && "cursor-not-allowed opacity-[.42]",
              )}
            >
              <input
                type="radio"
                name="chat-report-reason"
                value={option.value}
                checked={selected}
                onChange={() => setReason(option.value)}
                disabled={pending}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  selected ? "border-gold" : "border-line",
                )}
              >
                {selected && <span className="size-2 rounded-full bg-gold" />}
              </span>
              {option.label}
            </label>
          );
        })}
      </fieldset>

      <div className="mt-4">
        <label htmlFor={DETAIL_FIELD_ID} className="text-[0.8125rem] font-semibold text-ink">
          상세 사유
          <span className="ml-1 text-[0.75rem] font-normal text-ink-3">
            (기타 선택 시 필수)
          </span>
        </label>
        <div className="mt-2">
          <Textarea
            id={DETAIL_FIELD_ID}
            value={detail}
            onChange={setDetail}
            maxLength={REPORT_DETAIL_MAX_LENGTH}
            rows={4}
            counterPlacement="inside"
            resizable={false}
            placeholder="어떤 점이 문제였는지 알려주시면 확인에 도움이 돼요."
            disabled={pending}
          />
        </div>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-3 rounded-card bg-terra-soft px-3.5 py-2.5 text-[0.8125rem] text-terra"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="flex-1 rounded-button bg-paper px-5 py-3 text-[0.875rem] font-bold text-ink transition hover:brightness-[.97] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!submittable}
          className="flex-1 rounded-button bg-terra px-5 py-3 text-[0.875rem] font-bold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          {pending ? "접수 중..." : "신고하기"}
        </button>
      </div>
    </Modal>
  );
}
