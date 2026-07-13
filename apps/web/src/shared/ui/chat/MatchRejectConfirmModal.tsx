import { Modal } from "@/shared/ui/Modal";
import { X } from "@/shared/ui/icons/X";

export interface MatchRejectConfirmModalProps {
  open: boolean;
  /** "○○ 사정사와의 상담을 종료할까요?" */
  adjusterName: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 매칭 거절 확정 다이얼로그 — 비가역 액션이라 완료 모달과 대칭으로 확인을 받는다. */
export function MatchRejectConfirmModal({
  open,
  adjusterName,
  pending,
  onConfirm,
  onCancel,
}: MatchRejectConfirmModalProps) {
  const shortName = adjusterName.replace(/\s*(손해사정사|사정사)$/, "");

  return (
    <Modal
      open={open}
      title={`${shortName} 사정사와의 상담을 종료할까요?`}
      dismissible={!pending}
      onClose={onCancel}
      className="max-w-[25rem] text-center"
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-terra-soft">
        <X className="text-[1.5rem] text-terra" />
      </div>

      <p className="text-[0.8125rem] leading-relaxed text-ink-2">
        매칭을 거절하면 이 상담이 종료되고 되돌릴 수 없어요.
        <br />
        진행 중인 다른 상담은 그대로 유지돼요.
      </p>

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 rounded-button bg-paper px-5 py-3 text-[0.875rem] font-bold text-ink transition hover:brightness-[.97] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-button bg-terra px-5 py-3 text-[0.875rem] font-bold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          매칭 거절
          <X className="text-[1rem]" />
        </button>
      </div>
    </Modal>
  );
}
