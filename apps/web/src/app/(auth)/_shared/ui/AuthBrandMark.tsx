import { Scale } from "@/shared/ui/icons/Scale";

export function AuthBrandMark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-[1.875rem] items-center justify-center rounded-lg bg-gold text-white">
        <Scale className="size-[1.1875rem]" />
      </span>
      <span className="font-serif text-[1.25rem] font-bold tracking-[-0.025rem] text-ink">바른보상</span>
    </span>
  );
}
