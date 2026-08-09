"use client";

import { Suspense } from "react";
import type { ReviewListItem } from "../../_shared/model/types";
import { DraftContent } from "./DraftContent";
import { DraftPlaceholder } from "./DraftPlaceholder";
import { DraftSkeleton } from "./DraftSkeleton";

export function ReviewDraftPanel({ item }: { item: ReviewListItem | null }) {
  return (
    <aside className="lg:sticky lg:top-20">
      {item === null ? (
        <DraftPlaceholder />
      ) : (
        <Suspense fallback={<DraftSkeleton />}>
          <DraftContent item={item} />
        </Suspense>
      )}
    </aside>
  );
}
