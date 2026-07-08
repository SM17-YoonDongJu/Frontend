import { type ChangeEvent, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface TextareaProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  "aria-label"?: string;
  /** 글자수 카운터 뒤에 붙는 보조 안내(" · 개인정보…") */
  counterHint?: string;
  /** 카운터 줄 우측 슬롯 */
  footerRight?: ReactNode;
  /** 카운터(글자수·보조 안내) 텍스트에 붙는 클래스 — 예: 모바일 숨김 `hidden lg:inline` */
  counterClassName?: string;
  className?: string;
}

export function Textarea({
  id,
  value,
  onChange,
  maxLength,
  rows = 6,
  placeholder,
  "aria-label": ariaLabel,
  counterHint,
  footerRight,
  counterClassName,
  className,
}: TextareaProps) {
  const showCounter = maxLength != null;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = maxLength != null ? event.target.value.slice(0, maxLength) : event.target.value;
    onChange(next);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full resize-y rounded-input border border-line bg-card px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft"
      />
      {(showCounter || footerRight) && (
        <div className="flex items-center justify-between gap-3 text-[0.75rem] text-ink-3">
          {showCounter ? (
            <span className={counterClassName}>
              {value.length.toLocaleString()}/{maxLength!.toLocaleString()}자{counterHint}
            </span>
          ) : (
            <span />
          )}
          {footerRight}
        </div>
      )}
    </div>
  );
}
