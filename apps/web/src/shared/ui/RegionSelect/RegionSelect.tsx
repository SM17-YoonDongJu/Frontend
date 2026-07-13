"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import { formatRegionLabel, isSameRegion, type RegionValue } from "@/shared/model/regions";
import { X } from "@/shared/ui/icons/X";
import { RegionSelectPanel } from "./RegionSelectPanel";
import { RegionSelectTrigger } from "./RegionSelectTrigger";

interface CommonProps {
  placeholder?: string;
  className?: string;
}

interface SingleProps extends CommonProps {
  mode?: "single";
  value: RegionValue | null;
  onChange: (value: RegionValue | null) => void;
}

interface MultipleProps extends CommonProps {
  mode: "multiple";
  value: RegionValue[];
  onChange: (value: RegionValue[]) => void;
}

type RegionSelectProps = SingleProps | MultipleProps;

function triggerLabel(selected: RegionValue[]): string | null {
  const [first, ...rest] = selected;
  if (!first) return null;
  const label = formatRegionLabel(first);
  return rest.length > 0 ? `${label} 외 ${rest.length}곳` : label;
}

/**
 * 시·도 → 시·군·구 2단계 지역 선택 드롭다운.
 * PC는 트리거 아래 팝오버, 모바일은 하단 시트. 바깥 클릭·Esc로 닫힌다.
 */
export function RegionSelect(props: RegionSelectProps) {
  const { placeholder, className } = props;
  const multiple = props.mode === "multiple";
  const selected = multiple ? props.value : props.value ? [props.value] : [];

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useFocusTrap(sheetRef, open);

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

  const handleClear = () => {
    if (props.mode === "multiple") props.onChange([]);
    else props.onChange(null);
    setOpen(false);
  };

  const handleSelect = (option: RegionValue) => {
    if (props.mode === "multiple") {
      const exists = props.value.some((item) => isSameRegion(item, option));
      props.onChange(
        exists
          ? props.value.filter((item) => !isSameRegion(item, option))
          : [...props.value, option],
      );
      return;
    }
    props.onChange(option);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <RegionSelectTrigger
        label={triggerLabel(selected)}
        open={open}
        placeholder={placeholder}
        onToggle={() => setOpen((prev) => !prev)}
        onClear={handleClear}
      />

      {open && (
        <>
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/60 md:hidden"
          />

          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="지역 선택"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex h-[80dvh] flex-col overflow-hidden rounded-t-card-lg border border-line bg-card outline-none",
              "md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-full md:z-20 md:mt-2 md:h-[28.75rem] md:w-96 md:rounded-card md:shadow-[0_1rem_2.75rem_-1rem_rgba(21,32,46,0.35)]",
            )}
          >
            <div className="flex items-center justify-between px-5 pt-5 md:hidden">
              <h2 className="font-serif text-[1.0625rem] font-bold text-ink">지역 선택</h2>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-lg text-ink-3 transition hover:bg-paper hover:text-ink"
              >
                <X />
              </button>
            </div>

            <RegionSelectPanel multiple={multiple} selected={selected} onSelect={handleSelect} />
          </div>
        </>
      )}
    </div>
  );
}
