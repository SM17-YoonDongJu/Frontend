import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const avatarVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-navy text-center font-serif text-white",
  {
    variants: {
      size: {
        sm: "size-9 text-[0.95rem]",
        md: "size-[2.875rem] text-[1.2rem]",
        lg: "size-14 text-[1.5rem]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** 이미지 URL. 없으면 name 첫 글자로 폴백 */
  src?: string | null;
  /** 표시명 — 이니셜 폴백·대체텍스트 원천 */
  name: string;
  className?: string;
}

export function Avatar({ src, name, size, className }: AvatarProps) {
  const initial = name.trim().charAt(0) || "?";

  return (
    <span className={cn(avatarVariants({ size }), className)} aria-hidden>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
