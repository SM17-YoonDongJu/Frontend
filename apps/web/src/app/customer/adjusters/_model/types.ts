import type { z } from "zod";
import type {
  adjusterListSchema,
  adjusterListItemSchema,
  adjusterListPaginationSchema,
  adjusterListMetaSchema,
} from "@/app/customer/_shared/model/adjuster-list.schema";

export type AdjusterList = z.infer<typeof adjusterListSchema>;
export type AdjusterListItem = z.infer<typeof adjusterListItemSchema>;
export type AdjusterListPagination = z.infer<typeof adjusterListPaginationSchema>;
export type AdjusterListMeta = z.infer<typeof adjusterListMetaSchema>;

export type SortKey = "rating" | "review" | "career" | "consultCount";
