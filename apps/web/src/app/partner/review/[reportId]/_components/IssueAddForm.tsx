"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";

const MANWON = 10_000;

function parseManwon(text: string): number | null {
  const digits = text.replace(/[^\d-]/g, "");
  return digits && digits !== "-" ? Number(digits) * MANWON : null;
}

export interface IssueAddFormProps {
  onAdd: (title: string, description: string, impactAmount: number | null) => void;
}

export function IssueAddForm({ onAdd }: IssueAddFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const canSubmit = title.trim().length > 0;

  function reset() {
    setTitle("");
    setDescription("");
    setAmount("");
    setOpen(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onAdd(title.trim(), description.trim(), parseManwon(amount));
    reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-card border border-dashed border-gold-2 bg-gold-soft/30 py-3 text-[0.875rem] font-semibold text-gold-ink transition hover:bg-gold-soft/60"
      >
        + 쟁점 추가
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-card border border-gold-2 bg-gold-soft/40 p-4">
      <p className="text-[0.84375rem] font-semibold text-ink">신규 쟁점 추가</p>

      <div>
        <Label htmlFor="add-issue-title">쟁점 제목</Label>
        <Input
          id="add-issue-title"
          className="mt-1.5"
          placeholder="예: 통원 치료비 추가 청구"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="add-issue-desc">판단 근거</Label>
        <Input
          id="add-issue-desc"
          multiline
          rows={2}
          className="mt-1.5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="add-issue-amount">영향 금액</Label>
        <Input
          id="add-issue-amount"
          type="number"
          inputMode="numeric"
          className="mt-1.5"
          suffix="만원"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled={!canSubmit} onClick={handleSubmit}>
          추가
        </Button>
        <Button size="sm" variant="ghost" onClick={reset}>
          취소
        </Button>
      </div>
    </div>
  );
}
