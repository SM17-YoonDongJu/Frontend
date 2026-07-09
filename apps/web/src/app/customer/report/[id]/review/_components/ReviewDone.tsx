"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/Button";
import { Check } from "@/shared/ui/icons/Check";
import {
  clearReviewDonePreview,
  readReviewDonePreview,
  type ReviewDonePreview,
} from "../_hooks/done-preview";
import { SubmittedReviewCard } from "./SubmittedReviewCard";

export function ReviewDone({ reportId }: { reportId: string }) {
  const router = useRouter();
  const detailHref = `/customer/report/${reportId}`;
  const [preview, setPreview] = useState<ReviewDonePreview | null>(null);
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    const stored = readReviewDonePreview(reportId);
    if (!stored) {
      router.replace(detailHref);
      return;
    }
    consumedRef.current = true;
    setPreview(stored);
    return () => clearReviewDonePreview(reportId);
  }, [reportId, detailHref, router]);

  if (!preview) return null;

  return (
    <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center px-4 py-16 text-center">
      <div className="flex size-[4.5rem] items-center justify-center rounded-full bg-green-soft text-green">
        <Check className="size-8" />
      </div>
      <h1 className="mt-6 font-serif text-[1.75rem] font-bold text-ink">리뷰가 등록되었어요</h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-3">
        {preview.adjusterName} 프로필에 공개됩니다.
        <br />
        소중한 후기 감사합니다.
      </p>

      <div className="mt-8 w-full">
        <SubmittedReviewCard nickname={preview.nickname} score={preview.score} content={preview.content} />
      </div>

      <div className="mt-8 flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:justify-center">
        <Link
          href={detailHref}
          className={cn(buttonVariants({ variant: "outline", size: "md" }), "hidden lg:inline-flex")}
        >
          내 리포트로
        </Link>
        <Link
          href="/customer/dashboard"
          className={cn(buttonVariants({ variant: "primary", size: "md", full: true }), "lg:w-auto")}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
