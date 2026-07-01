"use client";

// 공개 검색 카드의 상담 방식 표시(고정) — 프로필 수정 화면에서 편집 대상 아님
const CONSULT_METHODS = ["전화", "방문"] as const;

interface PreviewCardProps {
  nickname: string;
  headline: string;
  specialties: string[];
  career: number;
  activityRegion: string;
  avatarUrl: string | null;
}

export function PreviewCard({
  nickname,
  headline,
  specialties,
  career,
  activityRegion,
  avatarUrl,
}: PreviewCardProps) {
  const initial = nickname.trim().charAt(0) || "?";
  const metaParts = [
    career > 0 ? `경력 ${career}년` : null,
    activityRegion.trim() || null,
  ].filter(Boolean);

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1 text-[0.8125rem] text-ink-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        검색 카드 미리보기
      </p>

      <div className="rounded-card-lg border border-line bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-[2.75rem] items-center justify-center overflow-hidden rounded-full bg-ink text-[1rem] font-bold text-white">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-bold text-ink">{nickname} 손해사정사</p>
            {metaParts.length > 0 && (
              <p className="truncate text-[0.8125rem] text-ink-3">{metaParts.join(" · ")}</p>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-[0.875rem] font-medium text-ink-2">
          {headline.trim() || "한 줄 소개가 여기에 표시돼요"}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {specialties.map((item) => (
            <span
              key={item}
              className="rounded-chip border border-line bg-paper-2 px-2.5 py-1 text-[0.75rem] font-medium text-ink-2"
            >
              {item}
            </span>
          ))}
          {CONSULT_METHODS.map((method) => (
            <span
              key={method}
              className="rounded-chip bg-gold-soft px-2.5 py-1 text-[0.75rem] font-medium text-gold-ink"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[0.75rem] text-ink-3">
        입력하는 대로 미리보기가 갱신돼요. 소개 전문은 프로필 상세에 노출돼요.
      </p>
    </div>
  );
}
