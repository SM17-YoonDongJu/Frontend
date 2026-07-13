"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  // 한 핸들러에서 여러 지역을 연달아 기록해도 직전 결과 위에 쌓이도록 최신값을 ref로 들고 간다.
  const latest = useRef<RegionValue[]>([]);

  const commit = useCallback((next: RegionValue[]) => {
    latest.current = next;
    setRecent(next);
    write(next);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const stored = read();
    latest.current = stored;
    setRecent(stored);
  }, [hydrated]);

  /** 앞에 오는 지역일수록 최신으로 남는다. */
  const add = useCallback(
    (regions: RegionValue[]) => {
      let next = latest.current;
      for (const region of regions.toReversed()) {
        next = [region, ...next.filter((item) => !isSameRegion(item, region))];
      }
      commit(next.slice(0, MAX_RECENT));
    },
    [commit],
  );

  const remove = useCallback(
    (region: RegionValue) => {
      commit(latest.current.filter((item) => !isSameRegion(item, region)));
    },
    [commit],
  );

  return { recent, add, remove };
}
