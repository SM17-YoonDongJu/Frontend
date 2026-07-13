"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { formatRegionLabel, type RegionValue } from "@/shared/model/regions";
import { RegionSelectTrigger } from "./RegionSelectTrigger";

interface RegionSelectProps {
  value: RegionValue | null;
  onChange: (value: RegionValue | null) => void;
  placeholder?: string;
  className?: string;
}

/** 시·도 → 시·군·구 2단계 지역 선택 드롭다운. 바깥 클릭·Esc로 닫힌다. */
export function RegionSelect({ value, onChange, placeholder, className }: RegionSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <RegionSelectTrigger
        label={value ? formatRegionLabel(value) : null}
        open={open}
        placeholder={placeholder}
        onToggle={() => setOpen((prev) => !prev)}
        onClear={() => {
          onChange(null);
          setOpen(false);
        }}
      />

      {open && (
        <div
          role="dialog"
          aria-label="지역 선택"
          className="absolute left-0 top-full z-20 mt-2 flex h-[28.75rem] w-96 flex-col overflow-hidden rounded-card border border-line bg-card shadow-[0_1rem_2.75rem_-1rem_rgba(21,32,46,0.35)]"
        />
      )}
    </div>
  );
}
