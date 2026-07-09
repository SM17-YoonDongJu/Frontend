"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AdjustRequestDraft } from "../_model/types";

const DRAFT_KEY = "adjust-request:draft";

/** 저장된 draft 로드. 없거나 깨지면 null(팝업 노출 판단용). */
function loadDraft(): Partial<AdjustRequestDraft> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<AdjustRequestDraft>) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
}

/**
 * 저장된 입력이 있으면 팝업으로 불러오기/삭제를 묻고, 결정 전에는 자동저장을 보류한다.
 * (결정 전 자동저장 시 저장본이 빈 폼으로 덮어써지는 것을 방지 — 파트너 use-review-draft 준용.)
 */
export function useDraftPrompt(form: UseFormReturn<AdjustRequestDraft>) {
  const [savedDraft] = useState(loadDraft);
  const [resolved, setResolved] = useState(savedDraft === null);

  useEffect(() => {
    if (!resolved) return;
    let timer: number | undefined;
    const subscription = form.watch((values) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      }, 500);
    });
    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [resolved, form]);

  return {
    open: !resolved,
    restore: () => {
      if (savedDraft) form.reset(savedDraft);
      setResolved(true);
    },
    discard: () => {
      clearDraft();
      form.reset({});
      setResolved(true);
    },
  };
}
