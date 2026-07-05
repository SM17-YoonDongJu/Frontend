export function MypageSkeleton() {
  return (
    <div className="mt-5.5">
      <div className="h-34 animate-pulse rounded-card-lg bg-line-2" />
      <div className="mt-5.5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-29 animate-pulse rounded-card-lg bg-line-2" />
        ))}
      </div>
      <div className="mt-5.5 grid grid-cols-1 items-start gap-7 md:grid-cols-3">
        <div className="h-77 animate-pulse rounded-card-lg bg-line-2 md:col-span-2" />
        <div className="h-49 animate-pulse rounded-card-lg bg-line-2" />
      </div>
    </div>
  );
}
