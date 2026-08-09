import { SkeletonBlock } from "./SkeletonBlock";

export function ReviewFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <SkeletonBlock className="h-[4.5rem]" />
      <SkeletonBlock className="h-[10rem]" />
      <SkeletonBlock className="h-[14rem]" />
    </div>
  );
}
