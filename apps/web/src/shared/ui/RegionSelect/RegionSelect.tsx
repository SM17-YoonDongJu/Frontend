"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import { useMediaQuery } from "@/shared/lib/use-media-query";
import { formatRegionLabel, isSameRegion, type RegionValue } from "@/shared/model/regions";
import { X } from "@/shared/ui/icons/X";
import { RegionSelectPanel } from "./RegionSelectPanel";
import { RegionSelectTrigger } from "./RegionSelectTrigger";
import { useRecentRegions } from "./use-recent-regions";

interface CommonProps {
  placeholder?: string;
  /** 폼 검증 오류 문구. 트리거를 오류 보더로 바꾸고 아래에 표시한다. */
  error?: string;
  /**
   * 뷰포트와 무관하게 항상 하단 시트로 연다.
   * 모달·바텀시트 안에서 쓸 때 필요 — 두 셸 모두 overflow-y-auto라 팝오버가 잘린다.
   */
  alwaysSheet?: boolean;
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
  const { placeholder, error, alwaysSheet, className } = props;
  const multiple = props.mode === "multiple";
  const committed = multiple ? props.value : props.value ? [props.value] : [];

  const [open, setOpen] = useState(false);
  // 다중 모드는 "적용"을 눌러야 확정 — 그 전까지 드래프트에 담는다.
  const [draft, setDraft] = useState<RegionValue[]>(committed);
  const selected = multiple ? draft : committed;

  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { recent, add: addRecent, remove: removeRecent } = useRecentRegions();

  // 모바일은 배경을 덮는 하단 시트(=모달), PC는 배경이 그대로 살아있는 팝오버.
  // 모달일 때만 포커스를 가두고 aria-modal을 세운다.
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSheet = alwaysSheet || isMobile;

  useFocusTrap(sheetRef, open && isSheet);

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
    addRecent([option]);
    setOpen(false);
  };

  const handleApply = () => {
    if (props.mode === "multiple") {
      props.onChange(draft);
      addRecent(draft);
    }
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <RegionSelectTrigger
        label={triggerLabel(committed)}
        open={open}
        placeholder={placeholder}
        invalid={Boolean(error)}
        onToggle={toggle}
        onClear={handleClear}
      />

      {error && <p className="mt-[0.4375rem] text-[0.75rem] font-medium text-terra">{error}</p>}

      {open && (
        <>
          {isSheet && (
            <div
              aria-hidden
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/60"
            />
          )}

          <div
            ref={sheetRef}
            role="dialog"
            aria-modal={isSheet || undefined}
            aria-label="지역 선택"
            className={cn(
              "flex flex-col overflow-hidden border border-line bg-card outline-none",
              isSheet
                ? "fixed inset-x-0 bottom-0 z-50 mx-auto h-[80dvh] max-w-[30rem] rounded-t-card-lg shadow-sheet"
                : "absolute left-0 top-full z-20 mt-2 h-[28.75rem] w-96 rounded-card shadow-[0_1rem_2.75rem_-1rem_rgba(21,32,46,0.35)]",
            )}
          >
            {isSheet && (
              <div className="flex items-center justify-between px-5 pt-5">
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
            )}

            <RegionSelectPanel
              multiple={multiple}
              selected={selected}
              recent={recent}
              onSelect={handleSelect}
              onRemoveRecent={removeRecent}
            />

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
