"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { AdjusterProfileSkeleton } from "./AdjusterProfileSkeleton";
import { AdjusterProfileView } from "./AdjusterProfileView";

const ERROR_MESSAGES = {
  USER_NOT_FOUND: {
    title: "손해사정사를 찾을 수 없어요",
    desc: "삭제되었거나 잘못된 주소예요.",
  },
};

export function AdjusterProfileBoundary({ adjusterId }: { adjusterId: string }) {
  return (
    <AsyncBoundary
      fallback={<AdjusterProfileSkeleton />}
      errorLayout="page"
      errorTitle="프로필을 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <AdjusterProfileView adjusterId={adjusterId} />
    </AsyncBoundary>
  );
}
