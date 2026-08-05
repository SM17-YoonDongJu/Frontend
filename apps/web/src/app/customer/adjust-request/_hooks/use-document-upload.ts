"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { uploadErrorMessage } from "@/shared/api/upload-file";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { validateUploadFile } from "@/shared/model/upload.schema";
import { useUploadDocument } from "../_api/use-upload-document";
import type { SlotStatus } from "../_components/DocumentSlot";
import type { UploadStatus } from "../_components/UploadFileItem";
import {
  DOCUMENT_SLOTS,
  type DocumentSlotDef,
  type DocumentSlotKey,
  type DocumentSlots,
  REQUIRED_DOCUMENT_SLOTS,
} from "../_model/document-slots";
import type { AdjustRequestDraft } from "../_model/types";

const ACCEPT = ".pdf,.jpg,.jpeg,.png";

interface SlotEntry {
  status: SlotStatus;
  url?: string;
  fileName?: string;
  error?: string;
  file?: File;
}
type SlotMap = Partial<Record<DocumentSlotKey, SlotEntry>>;

/** 기타 서류 항목 — 슬롯에 없는 documentUrls 복원용(신규 추가 경로 없음). */
export interface ExtraItem {
  id: string;
  status: UploadStatus;
  name: string;
  size: number;
  url?: string;
  error?: string;
  previewUrl?: string;
  file?: File;
}

/** 슬롯 카드 1장에 필요한 표시값 묶음. 뷰는 이 값을 그대로 내려보내기만 한다. */
export interface SlotView {
  def: DocumentSlotDef;
  status: SlotStatus;
  fileName?: string;
  error?: string;
  canRetry: boolean;
}

function fileNameFromUrl(url: string): string {
  try {
    const base = new URL(url).pathname.split("/").filter(Boolean).pop();
    return base ? decodeURIComponent(base) : "첨부 파일";
  } catch {
    return "첨부 파일";
  }
}

export function useDocumentUpload() {
  const { getValues, setValue, watch } = useFormContext<AdjustRequestDraft>();
  const { mutate: uploadFile } = useUploadDocument();

  const [slots, setSlots] = useState<SlotMap>({});
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 복원: documentSlots → 슬롯, 슬롯에 없는 documentUrls → 기타 서류.
  // (File은 복원 불가 → url·파일명만. SSR 불일치 방지로 마운트 후 1회.)
  useEffect(() => {
    if (hydrated) return;
    const draftSlots = getValues("documentSlots");
    const draftUrls = getValues("documentUrls") ?? [];

    const nextSlots: SlotMap = {};
    const slotUrls = new Set<string>();
    for (const def of DOCUMENT_SLOTS) {
      const v = draftSlots?.[def.key];
      if (v?.url) {
        nextSlots[def.key] = { status: "done", url: v.url, fileName: v.fileName };
        slotUrls.add(v.url);
      }
    }
    const restoredExtras: ExtraItem[] = draftUrls
      .filter((u) => !slotUrls.has(u))
      .map((u) => ({ id: crypto.randomUUID(), status: "done", name: fileNameFromUrl(u), size: 0, url: u }));

    setSlots(nextSlots);
    setExtras(restoredExtras);
    setHydrated(true);
  }, [getValues, hydrated]);

  // canonical documentSlots + 파생 documentUrls(슬롯 순서 + 기타) 폼 반영.
  useEffect(() => {
    if (!hydrated) return;
    const canonical: DocumentSlots = {};
    const urls: string[] = [];
    for (const def of DOCUMENT_SLOTS) {
      const s = slots[def.key];
      if (s?.status === "done" && s.url) {
        canonical[def.key] = { url: s.url, fileName: s.fileName ?? "" };
        urls.push(s.url);
      }
    }
    for (const e of extras) {
      if (e.status === "done" && e.url) urls.push(e.url);
    }
    setValue("documentSlots", Object.keys(canonical).length ? canonical : undefined);
    setValue("documentUrls", urls.length ? urls : null);
  }, [slots, extras, hydrated, setValue]);

  const startSlotUpload = useCallback(
    (key: DocumentSlotKey, file: File) => {
      setSlots((prev) => ({ ...prev, [key]: { status: "uploading", fileName: file.name, file } }));
      uploadFile(file, {
        onSuccess: (data) =>
          setSlots((prev) => ({ ...prev, [key]: { status: "done", url: data.url, fileName: file.name } })),
        onError: (e) =>
          setSlots((prev) => ({
            ...prev,
            [key]: { status: "error", error: uploadErrorMessage(e), fileName: file.name, file },
          })),
      });
    },
    [uploadFile],
  );

  const pickSlotFile = useCallback(
    (key: DocumentSlotKey, file: File) => {
      const invalid = validateUploadFile(file, "report_document");
      if (invalid) {
        setSlots((prev) => ({ ...prev, [key]: { status: "error", error: invalid, fileName: file.name } }));
        return;
      }
      startSlotUpload(key, file);
    },
    [startSlotUpload],
  );

  const retrySlot = useCallback(
    (key: DocumentSlotKey) => {
      const file = slots[key]?.file;
      if (file) startSlotUpload(key, file);
    },
    [slots, startSlotUpload],
  );

  const removeSlot = useCallback(
    (key: DocumentSlotKey) =>
      setSlots((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      }),
    [],
  );

  const retryExtra = useCallback(
    (item: ExtraItem) => {
      if (!item.file) return;
      const file = item.file;
      setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", error: undefined } : i)));
      uploadFile(file, {
        onSuccess: (data) =>
          setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "done", url: data.url } : i))),
        onError: (e) =>
          setExtras((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: uploadErrorMessage(e) } : i)),
          ),
      });
    },
    [uploadFile],
  );

  const removeExtra = useCallback(
    (id: string) =>
      setExtras((prev) => {
        const target = prev.find((i) => i.id === id);
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
        return prev.filter((i) => i.id !== id);
      }),
    [],
  );

  // accidentType은 localStorage draft에서 옴 → SSR/첫 렌더엔 없음.
  // 하이드레이션 불일치 방지로 마운트 후(hydrated)에만 라벨 노출.
  const accidentType = watch("accidentType");

  const derived = useMemo(() => {
    const slotViews: SlotView[] = DOCUMENT_SLOTS.map((def) => {
      const s = slots[def.key];
      return {
        def,
        status: s?.status ?? "idle",
        fileName: s?.fileName,
        error: s?.error,
        canRetry: s?.file !== undefined,
      };
    });
    return {
      accept: ACCEPT,
      caseLabel: hydrated && accidentType ? accidentTypeLabel(accidentType) : "",
      missingRequired: REQUIRED_DOCUMENT_SLOTS.filter((d) => slots[d.key]?.status !== "done"),
      slotViews,
    };
  }, [slots, hydrated, accidentType]);

  const actions = useMemo(
    () => ({ pickSlotFile, retrySlot, removeSlot, retryExtra, removeExtra }),
    [pickSlotFile, retrySlot, removeSlot, retryExtra, removeExtra],
  );

  return { state: { extras }, derived, actions };
}
