import { Button } from "@/shared/ui/Button";

export interface AdjusterContactProps {
  nickname?: string | null;
  career?: string | null;
}

export function AdjusterContact({ nickname, career }: AdjusterContactProps) {
  if (!nickname) return null;

  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-gold-soft text-[15px] font-semibold text-gold-ink">
          {nickname.slice(0, 1)}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-ink">{nickname} 손해사정사</p>
          {career && <p className="text-[12.5px] text-ink-3">{career}</p>}
        </div>
      </div>
      <Button full className="mt-4">
        이 의견으로 상담하기
      </Button>
    </div>
  );
}
