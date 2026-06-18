import type { z } from "zod";
import type { reportStatusSchema, reportDetailSchema } from "./report-detail.schema";

export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportDetail = z.infer<typeof reportDetailSchema>;
