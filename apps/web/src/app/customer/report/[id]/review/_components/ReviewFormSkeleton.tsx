function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-card bg-line-2 ${className}`} />;
}

export function ReviewFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Block className="h-[4.5rem]" />
      <Block className="h-[10rem]" />
      <Block className="h-[14rem]" />
    </div>
  );
}
