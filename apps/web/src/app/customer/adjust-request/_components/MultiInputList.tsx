"use client";

import { Input } from "@/shared/ui/Input";

interface MultiInputListProps {
  /** 행 라벨 접두어 — "{label} {n}" 형태로 렌더 (예: "진단명"). */
  label: string;
  /** 추가 버튼 문구 (예: "진단명 추가"). */
  addLabel: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  /** 유지할 최소 행 수(그 이하로는 삭제 불가). 기본 1. */
  minRows?: number;
}

/** 라벨 + 입력 + 삭제(−) 행을 여러 개 쌓고 하단에서 추가하는 복수 입력 리스트. */
export function MultiInputList({
  label,
  addLabel,
  values,
  onChange,
  placeholder,
  minRows = 1,
}: MultiInputListProps) {
  const rows = values.length > 0 ? values : [""];

  const updateRow = (index: number, next: string) => {
    onChange(rows.map((v, i) => (i === index ? next : v)));
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...rows, ""]);
  };

  return (
    <div className="flex flex-col gap-4">
      {rows.map((value, index) => (
        <div key={index}>
          <span className="mb-2 block text-[0.8125rem] font-bold text-ink-2">
            {label} {index + 1}
          </span>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder={placeholder}
              value={value}
              onChange={(e) => updateRow(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={rows.length <= minRows}
              aria-label={`${label} ${index + 1} 삭제`}
              className="flex h-[2.875rem] w-[2.375rem] shrink-0 items-center justify-center rounded-input border border-line bg-card text-[1.0625rem] leading-none text-ink-3 transition hover:border-ink/40 hover:text-terra disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink-3"
            >
              −
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="flex h-11 items-center justify-center gap-1.5 rounded-input border border-line bg-paper-2 text-[0.875rem] font-bold text-ink-2 transition hover:border-ink/40"
      >
        <span className="text-[1.0625rem] leading-none">+</span>
        {addLabel}
      </button>
    </div>
  );
}
