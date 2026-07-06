import { Scale } from "@/shared/ui/icons/Scale";

export function PartnerModeBanner() {
  return (
    <div className="flex items-center gap-2 rounded-button bg-navy px-3.5 py-2">
      <Scale className="text-[0.9375rem] text-white" />
      <span className="text-[0.75rem] font-semibold tracking-[-0.01rem] text-white">
        파트너 모드
      </span>
    </div>
  );
}
