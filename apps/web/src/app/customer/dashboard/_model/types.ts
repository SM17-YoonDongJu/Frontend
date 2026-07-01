import type { z } from "zod";
import type {
  reportStatusSchema,
  reportListItemSchema,
  reportListSchema,
  paginationSchema,
} from "./report-list.schema";

export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportListItem = z.infer<typeof reportListItemSchema>;
export type ReportList = z.infer<typeof reportListSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
