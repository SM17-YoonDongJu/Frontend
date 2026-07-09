"use client";

import { Button } from "@/shared/ui/Button";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";

/** 404에서 브라우저 히스토리 뒤로가기. Server인 not-found에서 분리한 클라이언트 액션. */
export function NotFoundBackButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="lg"
      full
      className={className}
      iconLeft={<ChevronLeft className="text-[1.1875rem]" />}
      onClick={() => window.history.back()}
    >
      이전 페이지로
    </Button>
  );
}
