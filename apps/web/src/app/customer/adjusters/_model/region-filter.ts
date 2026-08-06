import { formatRegionLabel, type RegionValue } from "@/shared/model/regions";

/**
 * `GET /adjusters`의 `region` 쿼리 파라미터 직렬화. 라벨을 콤마로 잇는다("서울 강남구,경기 성남시").
 * 같은 선택이 항상 같은 문자열이 되도록 정렬해 쿼리키 캐시가 흔들리지 않게 한다.
 *
 * ⚠️ 임시 계약 — 명세의 `region`은 단일값·시·도 단위(activity_region contains)라 이 포맷과 다르다.
 * 백엔드 확정 후 이 함수만 교체한다.
 */
export function serializeRegions(values: RegionValue[]): string | undefined {
  if (values.length === 0) return undefined;
  return values.map(formatRegionLabel).toSorted().join(",");
}
