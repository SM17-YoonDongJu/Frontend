"use client";

import { useState } from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import type { ProfileFormValues } from "../_model/types";
import { CareerItemForm } from "./CareerItemForm";
import { ConfirmDialog } from "./ConfirmDialog";

interface CareerSectionProps {
  control: Control<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export function CareerSection({ control, register, errors }: CareerSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "careers" });
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);

  return (
    <section className="space-y-4 rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[1.125rem] font-bold text-ink">주요 경력</h2>
        <span className="text-[0.8125rem] text-ink-3">공개 프로필에 순서대로 표시돼요</span>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-input border border-dashed border-line bg-paper-2 px-4 py-6 text-center text-[0.8125rem] text-ink-3">
          아직 등록한 경력이 없어요. 아래에서 추가해 주세요.
        </p>
      ) : (
        <div className="space-y-2.5">
          {fields.map((field, index) => (
            <CareerItemForm
              key={field.id}
              index={index}
              register={register}
              error={{
                period: errors.careers?.[index]?.period?.message,
                company: errors.careers?.[index]?.company?.message,
              }}
              onRemove={() => setPendingRemove(index)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => append({ period: "", company: "" })}
        className="flex w-full items-center justify-center gap-1.5 rounded-input border border-dashed border-line py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:border-gold-2 hover:text-gold-ink"
      >
        <span className="text-[1.125rem] leading-none">+</span> 경력 추가
      </button>

      <ConfirmDialog
        open={pendingRemove !== null}
        title="이 경력을 삭제할까요?"
        description="공개 프로필에서도 함께 사라져요."
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmTone="danger"
        onConfirm={() => {
          if (pendingRemove !== null) remove(pendingRemove);
          setPendingRemove(null);
        }}
        onCancel={() => setPendingRemove(null)}
      />
    </section>
  );
}
