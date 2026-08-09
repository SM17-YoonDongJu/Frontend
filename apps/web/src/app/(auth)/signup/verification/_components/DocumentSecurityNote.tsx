import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

/** 증빙 서류 하단 잠금 안내 배너(Figma 131-10583 문구 그대로). */
export function DocumentSecurityNote() {
  return (
    <div className="flex items-center gap-2.5 rounded-[0.875rem] bg-gold-soft px-[1.125rem] py-3.5">
      <ShieldCheck className="shrink-0 text-[1.125rem] text-gold-ink" />
      <p className="break-keep text-[0.8125rem] leading-relaxed text-gold-ink">
        제출 서류는 자격 심사 목적으로만 사용되며 외부에 공개되지 않습니다.
      </p>
    </div>
  );
}
