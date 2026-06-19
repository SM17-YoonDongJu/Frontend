"use client";

import { useEffect } from "react";
import type { UseFormWatch } from "react-hook-form";
import type { AdjustRequestDraft } from "../_model/types";

const DRAFT_KEY = "adjust-request:draft";

/** 저장된 draft 복원 (defaultValues용). 없거나 깨지면 빈 객체. */
export function loadDraft(): Partial<AdjustRequestDraft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<AdjustRequestDraft>) : {};
  } catch {
    return {};
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
}

/** form 변경을 debounce 저장. */
export function useDraftAutosave(watch: UseFormWatch<AdjustRequestDraft>) {
  useEffect(() => {
    let timer: number | undefined;
    const subscription = watch((values) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      }, 500);
    });
    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch]);
}
