"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ProfileCard } from "./ProfileCard";

export function AdjusterIntro({ introduction }: { introduction: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => setClamped(el.scrollHeight > el.clientHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [introduction]);

  return (
    <ProfileCard title="소개">
      <p
        ref={textRef}
        className={cn(
          "text-sm leading-relaxed text-ink-2",
          !expanded && "line-clamp-3 lg:line-clamp-none",
        )}
      >
        {introduction}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-semibold text-gold-ink lg:hidden"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </ProfileCard>
  );
}
