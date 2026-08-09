import { Avatar } from "@/shared/ui/Avatar";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { Modal } from "@/shared/ui/Modal";

export interface MatchConfirmModalProps {
  open: boolean;
  /** "○○ 사정사로 매칭할까요?" */
  adjusterName: string;
  /** 매칭 시 함께 종료되는 다른 상담들. */
  endingConsultations: { name: string }[];
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 매칭 완료 확정 다이얼로그. Modal 셸(포커스 트랩·Esc·오버레이) 재사용. */
export function MatchConfirmModal({
  open,
  adjusterName,
  endingConsultations,
  pending,
  onConfirm,
  onCancel,
}: MatchConfirmModalProps) {
  // Figma 1012:11155 제목은 "김도현 사정사로" — 표시명의 (손해)사정사 접미사를 떼고 "사정사로" 부착
  const shortName = adjusterName.replace(/\s*(손해사정사|사정사)$/, "");

  return (
    <Modal
      open={open}
      title={`${shortName} 사정사로 매칭할까요?`}
      dismissible={!pending}
      onClose={onCancel}
      className="max-w-[25rem] text-center"
    >
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold-soft">
        <CheckCircle className="text-[1.5rem] text-ink" />
      </div>

      <p className="text-[0.8125rem] leading-relaxed text-ink-2">
        매칭을 완료하면 이 사정사와 정식으로 진행돼요.
        <br />
        진행 중이던 다른 상담은 자동으로 종료돼요.
      </p>

      {endingConsultations.length > 0 && (
        <div className="mt-5 text-left">
          <p className="text-[0.75rem] font-bold text-gold-ink">
            함께 종료되는 상담 {endingConsultations.length}건
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {endingConsultations.map((consultation) => (
              <li
                key={consultation.name}
                className="flex items-center gap-2.5 rounded-input bg-paper-2 px-3 py-2.5"
              >
                <Avatar name={consultation.name} size="sm" />
                <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-semibold text-ink">
                  {consultation.name}
                </span>
                <span className="shrink-0 text-[0.75rem] text-ink-3">상담 종료</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-button bg-paper px-5 py-3 text-[0.875rem] font-bold text-ink transition hover:brightness-[.97] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-button bg-ink px-5 py-3 text-[0.875rem] font-bold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          매칭 완료
          <CheckCircle className="text-[1rem]" />
        </button>
      </div>
    </Modal>
  );
}
