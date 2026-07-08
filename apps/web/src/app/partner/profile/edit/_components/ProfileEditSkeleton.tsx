export function ProfileEditSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex h-[3.375rem] items-center px-3 lg:hidden">
        <div className="size-6 animate-pulse rounded bg-line-2" />
        <div className="ml-2 h-5 w-24 animate-pulse rounded bg-line-2" />
      </div>

      <div className="px-5 pb-28 lg:px-6 lg:py-8 lg:pb-8">
        <div className="hidden h-9 w-48 animate-pulse rounded bg-line-2 lg:block" />

        <div className="mt-6 grid gap-7 lg:grid-cols-[40.75rem_21.25rem]">
          <div className="space-y-6">
            <div className="mx-auto size-[4.875rem] animate-pulse rounded-full bg-line-2 lg:hidden" />
            <div className="h-56 animate-pulse rounded-card-lg bg-line-2 lg:h-80" />
            <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
            <div className="h-56 animate-pulse rounded-card-lg bg-line-2" />
          </div>
          <div className="hidden h-52 animate-pulse rounded-card-lg bg-line-2 lg:block" />
        </div>
      </div>
    </div>
  );
}
