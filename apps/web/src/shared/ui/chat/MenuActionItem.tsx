import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import type { ChatThreadHeaderMenuAction } from "./ChatThreadHeader";

export function MenuActionItem({
  action,
  onSelect
}: {
  action: ChatThreadHeaderMenuAction;
  onSelect: () => void;
}) {
  const danger = action.tone === "danger";
  const className = cn(
    "flex w-full items-center gap-3 px-3.5 py-3 text-left text-[0.8125rem] font-semibold transition",
    danger ? "text-terra hover:bg-terra-soft/60" : "text-ink hover:bg-paper-2",
    action.disabled && "pointer-events-none cursor-not-allowed opacity-[.42]",
    action.mobileOnly && "md:hidden"
  );
  const content = (
    <>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-[0.9375rem]",
          danger ? "bg-terra-soft text-terra" : "bg-paper-2 text-ink-2"
        )}
      >
        {action.icon}
      </span>
      {action.label}
    </>
  );

  if (action.href) {
    return (
      <Link
        href={action.href}
        role="menuitem"
        aria-disabled={action.disabled}
        className={className}
        onClick={onSelect}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={action.disabled}
      className={className}
      onClick={() => {
        onSelect();
        action.onClick?.();
      }}
    >
      {content}
    </button>
  );
}
