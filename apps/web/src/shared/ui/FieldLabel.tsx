import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export interface FieldLabelProps {
  /** 지정하면 label 요소로 렌더해 인풋과 연결, 없으면 span */
  htmlFor?: string;
  /** 우측 글자수 카운터. 데스크톱에서만 노출 */
  counter?: string;
  className?: string;
  children: ReactNode;
}

const TEXT_CLASS = "text-[0.8125rem] font-semibold text-ink-2";

export function FieldLabel({ htmlFor, counter, className, children }: FieldLabelProps) {
  return (
    <div className={cn("mb-2 flex items-center justify-between", className)}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={TEXT_CLASS}>
          {children}
        </label>
      ) : (
        <span className={TEXT_CLASS}>{children}</span>
      )}
      {counter && <span className="hidden text-[0.75rem] text-ink-3 lg:inline">{counter}</span>}
    </div>
  );
}
