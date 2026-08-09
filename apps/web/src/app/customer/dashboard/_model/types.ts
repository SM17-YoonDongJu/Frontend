// 리포트 목록 타입은 customer/_shared/model 정본을 재노출(이슈 #128 스키마 통합).
// 기존 dashboard 소비처의 import 경로(../_model/types)를 유지하기 위한 얇은 재노출 레이어.
export type {
  ReportStatus,
  ReportListItem,
  ReportList,
  Pagination,
} from "@/app/customer/_shared/model/report-list.schema";
