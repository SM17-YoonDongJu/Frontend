"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { useUploadDocument } from "../_api/use-upload-document";
import {
  DOCUMENT_SLOTS,
  type DocumentSlotKey,
  type DocumentSlots,
  REQUIRED_DOCUMENT_SLOTS,
} from "../_model/document-slots";
import type { AdjustRequestDraft } from "../_model/types";
import { DocumentSlot, type SlotStatus } from "./DocumentSlot";
import { FileDropzone } from "./FileDropzone";
import { UploadFileItem, type UploadStatus } from "./UploadFileItem";

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const ACCEPT_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 20 * 1024 * 1024;
const SIZE_ERROR = "PDF·이미지, 최대 20MB만 올릴 수 있어요.";

interface SlotEntry {
  status: SlotStatus;
  url?: string;
  fileName?: string;
  error?: string;
  file?: File;
}
type SlotMap = Partial<Record<DocumentSlotKey, SlotEntry>>;

/** 기타 서류(데스크톱 드롭존) 항목. file 없음 = 이전 세션 복원 url. */
interface ExtraItem {
  id: string;
  status: UploadStatus;
  name: string;
  size: number;
  url?: string;
  error?: string;
  previewUrl?: string;
  file?: File;
}

function fileNameFromUrl(url: string): string {
  try {
    const base = new URL(url).pathname.split("/").filter(Boolean).pop();
    return base ? decodeURIComponent(base) : "첨부 파일";
  } catch {
    return "첨부 파일";
  }
}

export function Step5Documents() {
  const { getValues, setValue, watch } = useFormContext<AdjustRequestDraft>();
  const upload = useUploadDocument();

  const [slots, setSlots] = useState<SlotMap>({});
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
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

  const startSlotUpload = (key: DocumentSlotKey, file: File) => {
    setSlots((prev) => ({ ...prev, [key]: { status: "uploading", fileName: file.name, file } }));
    upload.mutate(file, {
      onSuccess: (data) =>
        setSlots((prev) => ({ ...prev, [key]: { status: "done", url: data.url, fileName: file.name } })),
      onError: (e) =>
        setSlots((prev) => ({ ...prev, [key]: { status: "error", error: e.message, fileName: file.name, file } })),
    });
  };

  const pickSlotFile = (key: DocumentSlotKey, file: File) => {
    if (!ACCEPT_MIME.includes(file.type) || file.size > MAX_SIZE) {
      setSlots((prev) => ({ ...prev, [key]: { status: "error", error: SIZE_ERROR, fileName: file.name } }));
      return;
    }
    startSlotUpload(key, file);
  };

  const removeSlot = (key: DocumentSlotKey) =>
    setSlots((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const startExtraUpload = (item: ExtraItem) => {
    if (!item.file) return;
    const file = item.file;
    setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", error: undefined } : i)));
    upload.mutate(file, {
      onSuccess: (data) =>
        setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "done", url: data.url } : i))),
      onError: (e) =>
        setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: e.message } : i))),
    });
  };

  const addExtraFiles = (files: File[]) => {
    const valid: File[] = [];
    const bad: string[] = [];
    for (const f of files) {
      if (!ACCEPT_MIME.includes(f.type) || f.size > MAX_SIZE) bad.push(f.name);
      else valid.push(f);
    }
    setRejected(bad);

    const newItems: ExtraItem[] = valid.map((f) => ({
      id: crypto.randomUUID(),
      status: "uploading",
      name: f.name,
      size: f.size,
      file: f,
      previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setExtras((prev) => [...prev, ...newItems]);
    newItems.forEach(startExtraUpload);
  };

  const removeExtra = (id: string) =>
    setExtras((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });

  // accidentType은 localStorage draft에서 옴 → SSR/첫 렌더엔 없음.
  // 하이드레이션 불일치 방지로 마운트 후(hydrated)에만 라벨 노출.
  const accidentType = watch("accidentType");
  const caseLabel = hydrated && accidentType ? accidentTypeLabel(accidentType) : "";
  const missingRequired = REQUIRED_DOCUMENT_SLOTS.filter((d) => slots[d.key]?.status !== "done");

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.625rem]">
          관련 서류를 올려주세요
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          {caseLabel ? `${caseLabel} ` : ""}케이스에 필요한 서류예요. 각 칸에 맞는 파일을 올려주세요 (PDF 또는 이미지,
          최대 20MB).
        </p>
      </div>

      <div className="hidden sm:block">
        <FileDropzone
          onFiles={addExtraFiles}
          accept={ACCEPT}
          title="파일을 끌어다 놓거나 각 칸의 ‘올리기’로 업로드"
          hint="PDF, JPG, PNG"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {DOCUMENT_SLOTS.map((def) => {
          const s = slots[def.key];
          const status = s?.status ?? "idle";
          return (
            <DocumentSlot
              key={def.key}
              def={def}
              status={status}
              fileName={s?.fileName}
              errorMessage={s?.error}
              accept={ACCEPT}
              onPickFile={(file) => pickSlotFile(def.key, file)}
              onRetry={s?.file ? () => startSlotUpload(def.key, s.file as File) : undefined}
              onRemove={status === "done" ? () => removeSlot(def.key) : undefined}
            />
          );
        })}
      </div>

      {missingRequired.length > 0 && (
        <p className="flex items-center gap-1.5 text-[0.75rem] text-ink-3">
          <AlertTriangle className="shrink-0 text-[0.875rem] text-gold-ink" />
          정확한 분석을 위해 {missingRequired.map((d) => d.label).join("·")} 첨부를 권장해요.
        </p>
      )}

      {(rejected.length > 0 || extras.length > 0) && (
        <div className="flex flex-col gap-2">
          {rejected.length > 0 && (
            <p className="text-[0.78125rem] text-terra">업로드 불가(형식·용량): {rejected.join(", ")}</p>
          )}
          {extras.map((item) => (
            <UploadFileItem
              key={item.id}
              name={item.name}
              size={item.size}
              status={item.status}
              previewUrl={item.previewUrl}
              errorMessage={item.error}
              onRetry={() => startExtraUpload(item)}
              onRemove={() => removeExtra(item.id)}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 rounded-card bg-gold-soft px-4 py-3 text-gold-ink">
        <ShieldCheck className="mt-0.5 shrink-0 text-[1rem]" />
        <p className="text-[0.75rem]">
          <span className="sm:hidden">주민번호·계좌 등 민감정보는 자동으로 가려져요.</span>
          <span className="hidden sm:inline">
            주민번호·계좌 등 민감정보는 업로드 시 자동으로 가려지며, 분석 목적 외에는 사용되지 않습니다.
          </span>
        </p>
      </div>
    </section>
  );
}
