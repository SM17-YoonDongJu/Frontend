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
  const committed = multiple ? props.value : props.value ? [props.value] : [];

  const [open, setOpen] = useState(false);
  // 다중 모드는 "적용"을 눌러야 확정 — 그 전까지 드래프트에 담는다.
  const [draft, setDraft] = useState<RegionValue[]>(committed);
  const selected = multiple ? draft : committed;

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

  const toggle = () => {
    // 열 때마다 확정값으로 드래프트를 되돌린다 — 적용 없이 닫은 선택은 버린다.
    if (!open) setDraft(committed);
    setOpen((prev) => !prev);
  };

  const handleClear = () => {
    if (props.mode === "multiple") props.onChange([]);
    else props.onChange(null);
    setDraft([]);
    setOpen(false);
  };

  const handleSelect = (option: RegionValue) => {
    if (props.mode === "multiple") {
      setDraft((prev) =>
        prev.some((item) => isSameRegion(item, option))
          ? prev.filter((item) => !isSameRegion(item, option))
          : [...prev, option],
      );
      return;
    }
    props.onChange(option);
    setOpen(false);
  };

  const handleApply = () => {
    if (props.mode === "multiple") props.onChange(draft);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <RegionSelectTrigger
        label={triggerLabel(committed)}
        open={open}
        placeholder={placeholder}
        onToggle={toggle}
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

            {multiple && (
              <div className="flex items-center justify-between border-t border-line-2 px-4 py-3">
                <p className="text-[0.8125rem] text-ink-3">{draft.length}곳 선택됨</p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDraft([])}
                    className="rounded-button px-3 py-2 text-[0.8125rem] font-semibold text-ink-2 transition hover:bg-paper"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="rounded-button bg-ink px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96]"
                  >
                    적용 ({draft.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
