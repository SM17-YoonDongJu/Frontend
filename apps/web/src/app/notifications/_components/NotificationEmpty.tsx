import { Bell } from "@/shared/ui/icons/Bell";
import { Check } from "@/shared/ui/icons/Check";

/** 빈 알림 상태 (Figma 916-23681). 알림 설정 화면은 미구현이라 버튼은 준비 중 처리. */
export function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center px-6 pt-16 text-center">
      <div className="relative flex size-[8.25rem] items-center justify-center rounded-full border border-line">
        <div className="flex size-[6.5rem] items-center justify-center rounded-full bg-gold-soft">
          <Bell className="text-[2.375rem] text-ink" />
        </div>
        <span className="absolute right-[0.625rem] top-2 flex size-[1.625rem] items-center justify-center rounded-full border border-line bg-card drop-shadow-[0px_4px_5px_rgba(21,32,46,0.08)]">
          <Check className="size-[0.8125rem] text-ink" />
        </span>
      </div>

      <h3 className="mt-[1.625rem] text-[1.125rem] font-bold text-ink">새 알림이 없어요</h3>
      <p className="mt-2 text-[0.8125rem] leading-4 text-ink-2">
        검수 완료·새 제안·상담 응답 소식이 오면 여기에서
        <br />
        가장 먼저 알려드릴게요.
      </p>

      <button
        type="button"
        aria-disabled
        title="준비 중"
        className="mt-7 flex h-[2.125rem] w-[16.25rem] cursor-default items-center justify-center rounded-button bg-paper text-[0.8125rem] font-bold text-ink"
      >
        알림 설정 확인하기
      </button>
    </div>
  );
}
