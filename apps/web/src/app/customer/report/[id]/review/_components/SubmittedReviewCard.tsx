import { Avatar } from "@/shared/ui/Avatar";
import { StarRating } from "@/shared/ui/StarRating";

export function SubmittedReviewCard({
  nickname,
  score,
  content,
}: {
  nickname: string;
  score: number;
  content: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-card p-4 text-left">
      <Avatar name={nickname} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[0.875rem] font-bold text-ink">{nickname} 님</span>
          <StarRating score={score} size={0.8125} />
        </div>
        {content && <p className="mt-1 truncate text-[0.8125rem] text-ink-2">{content}</p>}
      </div>
    </div>
  );
}
