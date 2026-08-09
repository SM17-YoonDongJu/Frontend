import { Avatar } from "@/shared/ui/Avatar";
import { StarRating } from "@/shared/ui/StarRating";
import { ProfileCard } from "./ProfileCard";
import type { AdjusterReview } from "../_model/types";

function formatReviewedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}.${month}`;
}

interface AdjusterReviewsProps {
  reviews: AdjusterReview[];
  averageRating: number;
  reviewCount: number;
}

export function AdjusterReviews({ reviews, averageRating, reviewCount }: AdjusterReviewsProps) {
  const sorted = reviews.toSorted(
    (a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime(),
  );

  return (
    <ProfileCard
      title="의뢰인 후기"
      titleExtra={
        reviewCount > 0 ? (
          <span className="flex items-center gap-1.5 text-sm text-ink-3">
            <StarRating score={averageRating} max={1} />
            <span className="font-bold text-gold-ink">{averageRating.toFixed(1)}</span>
            <span>· {reviewCount}건</span>
          </span>
        ) : undefined
      }
    >
      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-3">아직 등록된 후기가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((review) => (
            <li
              key={`${review.nickname}-${review.reviewedAt}`}
              className="rounded-card border border-line bg-card p-4 shadow-xs lg:p-5"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={review.nickname}
                  size="sm"
                  className="font-sans font-semibold [--avatar-initial:0.389em]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{review.nickname}</p>
                  <p className="mt-0.5 text-xs text-ink-3">
                    {review.item} · {formatReviewedAt(review.reviewedAt)}
                  </p>
                </div>
                <StarRating score={review.score} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </ProfileCard>
  );
}
