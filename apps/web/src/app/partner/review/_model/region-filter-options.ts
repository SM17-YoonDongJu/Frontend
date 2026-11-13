import { formatRegionLabel, SIDO_LIST } from "@/shared/model/regions";

export interface RegionFilterOption {
  /** 백엔드 region 필터에 그대로 보내는 값. 사용자 지역 목록에 이 값이 정확히 들어 있는 건만 걸린다. */
  value: string;
  label: string;
}

export interface RegionFilterGroup {
  label: string;
  options: RegionFilterOption[];
}

/**
 * 지역 필터 옵션 — 전국 시·도 단위 그룹.
 * 받아 온 목록 페이지에서 뽑지 않는다: 항목의 region은 지역이 여럿이면 "·"로 이어 붙인 문자열이라
 * 그대로는 필터 값으로 걸리지 않고, 첫 페이지에 없는 지역은 옵션에서 빠진다(#326).
 */
export const REGION_FILTER_GROUPS: RegionFilterGroup[] = SIDO_LIST.map((sido) => ({
  label: sido.name,
  options: [
    { sido: sido.name, district: null },
    ...sido.districts.map((district) => ({ sido: sido.name, district })),
  ].map((value) => {
    const label = formatRegionLabel(value);
    return { value: label, label };
  }),
}));

const REGION_FILTER_VALUES: ReadonlySet<string> = new Set(
  REGION_FILTER_GROUPS.flatMap((group) => group.options.map((option) => option.value)),
);

export function isRegionFilterValue(value: string): boolean {
  return REGION_FILTER_VALUES.has(value);
}
