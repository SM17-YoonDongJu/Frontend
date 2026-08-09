import { cva, type VariantProps } from "class-variance-authority";
import { getInitial } from "@/shared/lib/initial";
import { cn } from "@/shared/lib/utils";

// wrapper의 font-size가 지름(size-[1em])을 결정하고, 이니셜 글리프는 내부 span이
// --avatar-initial(기본 0.42em) 비율로 파생한다. 임의·반응형 크기는 className의
// text-* 하나로 지름·글자를 함께 움직인다. 예: className="text-[5.25rem] lg:text-[6rem]"
const avatarVariants = cva(
  "inline-flex size-[1em] shrink-0 select-none items-center justify-center overflow-hidden rounded-full text-center font-serif",
  {
    variants: {
      size: {
        sm: "text-[2.25rem]",
        md: "text-[2.875rem]",
        lg: "text-[3.5rem]",
      },
      tone: {
        navy: "bg-navy text-white",
        // StatusBadge의 gold(bg-gold-soft)와 달리 "navy 배경 + 골드 이니셜"을 뜻한다
        gold: "bg-navy text-gold",
        ink: "bg-ink text-white",
        // 다크 히어로 위 반투명 배경
        glass: "bg-white/10 text-white",
      },
    },
    defaultVariants: { size: "md", tone: "navy" },
  },
);

export { avatarVariants };

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** 이미지 URL. 없으면 name 첫 글자로 폴백 */
  src?: string | null;
  /** 표시명 — 이니셜 폴백·대체텍스트 원천 */
  name: string;
  /** 지정 시 role="img"+aria-label로 스크린리더에 노출, 미지정 시 순수 장식(aria-hidden) */
  label?: string;
  className?: string;
}

export function Avatar({ src, name, size, tone, label, className }: AvatarProps) {
  return (
    <span
      className={cn(avatarVariants({ size, tone }), className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span className="text-[length:var(--avatar-initial,0.42em)] leading-none">
          {getInitial(name)}
        </span>
      )}
    </span>
  );
}
