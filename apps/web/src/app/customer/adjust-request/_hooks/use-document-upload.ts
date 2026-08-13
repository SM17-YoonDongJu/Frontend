"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
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

export interface DocumentUploadValue {
  state: { extras: ExtraItem[] };
  derived: {
    accept: string;
    caseLabel: string;
    missingRequired: DocumentSlotDef[];
    slotViews: SlotView[];
  };
  actions: {
    pickSlotFile: (key: DocumentSlotKey, file: File) => void;
    retrySlot: (key: DocumentSlotKey) => void;
    removeSlot: (key: DocumentSlotKey) => void;
    retryExtra: (item: ExtraItem) => void;
    removeExtra: (id: string) => void;
  };
}

function fileNameFromUrl(url: string): string {
  try {
    const base = new URL(url).pathname.split("/").filter(Boolean).pop();
    return base ? decodeURIComponent(base) : "첨부 파일";
  } catch {
    return "첨부 파일";
  }
}

/**
 * 서류 업로드 상태. 반드시 단계(step) 밖 = 퍼널에서 호출한다.
 * 단계 컴포넌트에서 호출하면 다음 단계로 넘어가는 순간 언마운트되면서
 * 진행 중이던 업로드의 응답 url이 폼에 반영되지 못하고 유실된다.
 *
 * ready=false 동안은 draft 복원 결정(이어서 작성/새로 시작) 전이므로 복원을 미룬다.
 */
export function useDocumentUploadState(
  form: UseFormReturn<AdjustRequestDraft>,
  ready: boolean,
): DocumentUploadValue {
  const { getValues, setValue, watch } = form;
  const { mutateAsync: uploadFile } = useUploadDocument();

  const [slots, setSlots] = useState<SlotMap>({});
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 슬롯별 최신 요청 표식. 같은 슬롯에 재선택·삭제가 겹칠 때
  // 늦게 도착한 응답이 최신 상태를 덮어쓰지 않게 한다.
  const latestRequest = useRef<Partial<Record<DocumentSlotKey, number>>>({});

  // 복원: documentSlots → 슬롯, 슬롯에 없는 documentUrls → 기타 서류.
  // (File은 복원 불가 → url·파일명만. SSR 불일치 방지로 마운트 후 1회.)
  useEffect(() => {
    if (!ready || hydrated) return;
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
    // url이 곧 고유 식별자 — crypto.randomUUID는 비보안 컨텍스트(http LAN 접속 등)에서 없을 수 있다.
    const restoredExtras: ExtraItem[] = [...new Set(draftUrls)]
      .filter((u) => !slotUrls.has(u))
      .map((u) => ({ id: u, status: "done", name: fileNameFromUrl(u), size: 0, url: u }));

    setSlots(nextSlots);
    setExtras(restoredExtras);
    setHydrated(true);
  }, [ready, getValues, hydrated]);

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

  // mutate 콜백이 아니라 mutateAsync를 쓴다 — mutation 훅의 관찰자는 하나뿐이라
  // 여러 슬롯을 연달아 올리면 앞선 mutate의 onSuccess가 호출되지 않는다.
  const runSlotUpload = useCallback(
    async (key: DocumentSlotKey, file: File) => {
      const token = (latestRequest.current[key] ?? 0) + 1;
      latestRequest.current[key] = token;
      setSlots((prev) => ({ ...prev, [key]: { status: "uploading", fileName: file.name, file } }));
      try {
        const { url } = await uploadFile(file);
        if (latestRequest.current[key] !== token) return;
        setSlots((prev) => ({ ...prev, [key]: { status: "done", url, fileName: file.name } }));
      } catch (e) {
        if (latestRequest.current[key] !== token) return;
        setSlots((prev) => ({
          ...prev,
          [key]: { status: "error", error: uploadErrorMessage(e), fileName: file.name, file },
        }));
      }
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
      void runSlotUpload(key, file);
    },
    [runSlotUpload],
  );

  const retrySlot = useCallback(
    (key: DocumentSlotKey) => {
      const file = slots[key]?.file;
      if (file) void runSlotUpload(key, file);
    },
    [slots, runSlotUpload],
  );

  const removeSlot = useCallback((key: DocumentSlotKey) => {
    // 진행 중 응답이 삭제된 슬롯을 되살리지 않도록 표식을 넘긴다.
    latestRequest.current[key] = (latestRequest.current[key] ?? 0) + 1;
    setSlots((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const runExtraUpload = useCallback(
    async (item: ExtraItem, file: File) => {
      setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "uploading", error: undefined } : i)));
      try {
        const { url } = await uploadFile(file);
        setExtras((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "done", url } : i)));
      } catch (e) {
        setExtras((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: uploadErrorMessage(e) } : i)),
        );
      }
    },
    [uploadFile],
  );

  const retryExtra = useCallback(
    (item: ExtraItem) => {
      if (item.file) void runExtraUpload(item, item.file);
    },
    [runExtraUpload],
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

const DocumentUploadContext = createContext<DocumentUploadValue | null>(null);

/** 퍼널이 소유한 업로드 상태를 단계 컴포넌트로 내려보낸다(단계는 상태를 소유하지 않는다). */
export function DocumentUploadProvider({
  value,
  children,
}: {
  value: DocumentUploadValue;
  children: ReactNode;
}) {
  return createElement(DocumentUploadContext.Provider, { value }, children);
}

export function useDocumentUpload(): DocumentUploadValue {
  const value = useContext(DocumentUploadContext);
  if (!value) {
    throw new Error("useDocumentUpload must be used within DocumentUploadProvider");
  }
  return value;
}
