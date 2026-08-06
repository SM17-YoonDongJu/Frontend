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
  /**
   * 카운터 위치. `outside`(기본)는 입력 박스 아래 좌측에 `0/500자`,
   * `inside`는 박스 안 우측 하단에 `0/500`. inside는 겹쳐 놓는 자리라 단위·보조 안내를 넣지 않는다.
   */
  counterPlacement?: "outside" | "inside";
  /** 세로 리사이즈 허용 여부. inside 카운터가 핸들 자리와 겹치면 끈다. */
  resizable?: boolean;
  /** 입력 잠금(제출 중 등) */
  disabled?: boolean;
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
  counterPlacement = "outside",
  resizable = true,
  disabled = false,
  className,
}: TextareaProps) {
  const showCounter = maxLength != null;
  const insideCounter = showCounter && counterPlacement === "inside";
  const showFooterRow = (showCounter && !insideCounter) || footerRight != null;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = maxLength != null ? event.target.value.slice(0, maxLength) : event.target.value;
    onChange(next);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          rows={rows}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            "w-full rounded-input border border-line bg-card px-3.5 py-3 text-[0.9375rem] leading-relaxed text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-[.42]",
            resizable ? "resize-y" : "resize-none",
            insideCounter && "pb-8", // 카운터가 겹쳐 앉는 자리 확보
          )}
        />
        {insideCounter && (
          <span
            className={cn(
              "pointer-events-none absolute bottom-3 right-3.5 text-[0.75rem] text-ink-3",
              counterClassName,
            )}
          >
            {value.length.toLocaleString()}/{maxLength!.toLocaleString()}
          </span>
        )}
      </div>
      {showFooterRow && (
        <div className="flex items-center justify-between gap-3 text-[0.75rem] text-ink-3">
          {showCounter && !insideCounter ? (
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
