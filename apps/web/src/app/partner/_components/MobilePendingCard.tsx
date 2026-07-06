"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import type { ReviewListItem } from "../review/_model/types";
import { formatReviewDue } from "../_model/review-due";

interface MobilePendingCardProps {
  item: ReviewListItem;
  navigatingId: string | null;
  onNavigate: (reportId: string) => void;
}

export function MobilePendingCard({ item, navigatingId, onNavigate }: MobilePendingCardProps) {
  const due = formatReviewDue(item.reviewDeadline, new Date());
  const isNavigating = navigatingId === item.reportId;
  const isBlocked = navigatingId !== null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isBlocked) {
      event.preventDefault();
      return;
    }
    onNavigate(item.reportId);
  };

  return (
    <div className="rounded-card border border-line bg-card p-4">
      <div className="flex items-center gap-2">
        <StatusBadge tone="gold">{accidentTypeLabel(item.accidentType)}</StatusBadge>
        <span className="flex items-center gap-1 text-[0.6875rem] text-ink-3">
          <span className="size-[0.3125rem] rounded-full bg-gold" />
          {item.region}
        </span>
      </div>

      <p className="mt-2 truncate text-[0.8125rem] font-semibold text-ink">{item.title}</p>

      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[0.75rem] font-bold ${due.urgent ? "text-terra" : "text-ink-3"}`}>
          {due.label}
        </span>
        <Link
          href={`/partner/review/${item.reportId}`}
          onClick={handleClick}
          aria-disabled={isBlocked}
          tabIndex={isBlocked ? -1 : undefined}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}${
            isBlocked && !isNavigating ? " pointer-events-none opacity-50" : ""
          }`}
        >
          검수 시작
          {isNavigating ? <Spinner /> : <ArrowRight className="text-[0.9375rem]" />}
        </Link>
      </div>
    </div>
  );
}
