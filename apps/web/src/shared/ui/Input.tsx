import { type ChangeEventHandler, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

const control =
  "w-full rounded-input border bg-card text-[14.5px] text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft";

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-ink-3"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface InputProps {
  /** "text"(기본) · "select" · 그 외 input type. multiline=true면 textarea */
  type?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  error?: string;
  /** 우측 접미 — 단위 문자열 또는 노드(버튼 등) */
  suffix?: ReactNode;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  id?: string;
  name?: string;
  disabled?: boolean;
  /** select일 때 <option> 목록 */
  children?: ReactNode;
  /** 래퍼에 적용 */
  className?: string;
}

export function Input({
  type = "text",
  multiline,
  rows = 4,
  hint,
  error,
  suffix,
  placeholder,
  value,
  defaultValue,
  onChange,
  id,
  name,
  disabled,
  children,
  className
}: InputProps) {
  const border = error ? "border-terra" : "border-line";
  const shared = { id, name, value, defaultValue, placeholder, disabled };

  let field: ReactNode;
  if (multiline) {
    field = (
      <textarea
        {...shared}
        rows={rows}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
        className={cn(control, border, "resize-y px-[14px] py-3 leading-relaxed")}
      />
    );
  } else if (type === "select") {
    field = (
      <div className="relative">
        <select
          {...shared}
          onChange={onChange as ChangeEventHandler<HTMLSelectElement>}
          className={cn(control, border, "h-[46px] cursor-pointer appearance-none pl-[14px] pr-[38px]")}
        >
          {children}
        </select>
        <Chevron />
      </div>
    );
  } else {
    field = (
      <div className="relative flex items-center">
        <input
          {...shared}
          type={type}
          onChange={onChange as ChangeEventHandler<HTMLInputElement>}
          className={cn(control, border, "h-[46px]", suffix ? "pl-[14px] pr-[90px]" : "px-[14px]")}
        />
        {suffix && (
          <div className="absolute right-[6px] flex items-center">
            {typeof suffix === "string" ? <span className="pr-2 text-[13px] text-ink-3">{suffix}</span> : suffix}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-[7px]", className)}>
      {field}
      {error ? (
        <span className="text-[12px] font-medium text-terra">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-ink-3">{hint}</span>
      ) : null}
    </div>
  );
}
