"use client";

import { useCallback, useEffect, useState } from "react";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { isSameRegion, type RegionValue } from "@/shared/model/regions";

const STORAGE_KEY = "bb:recent-regions";
const MAX_RECENT = 3;

function read(): RegionValue[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RegionValue =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as RegionValue).sido === "string",
      )
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function write(regions: RegionValue[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(regions));
  } catch {
    // 사파리 프라이빗 모드 등 저장 불가 — 최근 목록만 휘발시키고 선택은 계속 동작
  }
}

/** 최근 선택 지역을 최신순 최대 3개까지 localStorage에 유지한다. */
export function useRecentRegions() {
  const hydrated = useHydrated();
  const [recent, setRecent] = useState<RegionValue[]>([]);

  useEffect(() => {
    if (hydrated) setRecent(read());
  }, [hydrated]);

  const add = useCallback((region: RegionValue) => {
    setRecent((prev) => {
      const next = [region, ...prev.filter((item) => !isSameRegion(item, region))].slice(
        0,
        MAX_RECENT,
      );
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((region: RegionValue) => {
    setRecent((prev) => {
      const next = prev.filter((item) => !isSameRegion(item, region));
      write(next);
      return next;
    });
  }, []);

  return { recent, add, remove };
}
