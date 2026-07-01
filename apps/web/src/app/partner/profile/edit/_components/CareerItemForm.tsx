"use client";

import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import type { ProfileFormValues } from "../_model/types";

interface CareerItemFormProps {
  index: number;
  register: UseFormRegister<ProfileFormValues>;
  error?: { period?: string; company?: string };
  onRemove: () => void;
}

export function CareerItemForm({ index, register, error, onRemove }: CareerItemFormProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-[8.75rem] shrink-0">
        <Input
          placeholder="2019 ~ 현재"
          aria-label={`경력 ${index + 1} 기간`}
          error={error?.period}
          {...register(`careers.${index}.period`)}
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="OO손해사정법인 · 보상 심사팀"
          aria-label={`경력 ${index + 1} 내용`}
          error={error?.company}
          {...register(`careers.${index}.company`)}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`경력 ${index + 1} 삭제`}
        className="flex size-[2.875rem] shrink-0 items-center justify-center rounded-input border border-line text-ink-3 transition hover:border-terra hover:text-terra"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 7h14M10 11v6M14 11v6M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
