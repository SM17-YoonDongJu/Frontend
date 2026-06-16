import {
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from "react";
import { cn } from "@/shared/lib/utils";
import { Chevron } from "@/shared/ui/icons/Chevron";

const control =
  "w-full rounded-input border bg-card text-[14.5px] text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft";

/** 네이티브 input 속성(required·autoComplete·maxLength·aria-*·data-* 등)을 모두 상속.
 *  우리가 직접 다루는 키만 Omit 후 커스텀 정의로 대체한다. */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "defaultValue"> {
  /** "text"(기본) · "select" · 그 외 input type. multiline=true면 textarea */
  type?: string;
  multiline?: boolean;
  rows?: number;
  hint?: string;
  error?: string;
  /** 우측 접미 — 단위 문자열 또는 노드(버튼 등) */
  suffix?: ReactNode;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
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
  value,
  defaultValue,
  onChange,
  children,
  className,
  ...rest
}: InputProps) {
  const border = error ? "border-terra" : "border-line";
  const shared = { value, defaultValue, ...rest };

  let field: ReactNode;
  if (multiline) {
    field = (
      <textarea
        {...(shared as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        rows={rows}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement>}
        className={cn(control, border, "resize-y px-[14px] py-3 leading-relaxed")}
      />
    );
  } else if (type === "select") {
    field = (
      <div className="relative">
        <select
          {...(shared as SelectHTMLAttributes<HTMLSelectElement>)}
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
