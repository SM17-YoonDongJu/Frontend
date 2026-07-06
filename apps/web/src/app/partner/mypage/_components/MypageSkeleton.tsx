export function MypageSkeleton() {
  return (
    <div className="mt-5.5">
      <div className="h-34 animate-pulse rounded-[1.25rem] bg-line-2" />
      <div className="mt-5.5 grid grid-cols-3 gap-2.5 md:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-29 animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
      <div className="mt-5.5 grid grid-cols-1 items-start gap-5.5 md:grid-cols-[minmax(0,1fr)_21.25rem] md:gap-7">
        <div className="h-77 animate-pulse rounded-card bg-line-2" />
        <div className="h-49 animate-pulse rounded-card bg-line-2" />
      </div>
    </div>
  );
}
