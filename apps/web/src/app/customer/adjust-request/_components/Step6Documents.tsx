"use client";

import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { useDocumentUpload } from "../_hooks/use-document-upload";
import { DocumentSlot } from "./DocumentSlot";
import { UploadFileItem } from "./UploadFileItem";

export function Step6Documents() {
  const { state, derived, actions } = useDocumentUpload();

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.625rem]">
          관련 서류를 올려주세요
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          {derived.caseLabel ? `${derived.caseLabel} ` : ""}케이스에 필요한 서류예요. 각 칸에 맞는 파일을 올려주세요
          (PDF 또는 이미지, 최대 20MB).
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {derived.slotViews.map((slot) => (
          <DocumentSlot
            key={slot.def.key}
            def={slot.def}
            status={slot.status}
            fileName={slot.fileName}
            errorMessage={slot.error}
            accept={derived.accept}
            onPickFile={(file) => actions.pickSlotFile(slot.def.key, file)}
            onRetry={slot.canRetry ? () => actions.retrySlot(slot.def.key) : undefined}
            onRemove={slot.status === "done" ? () => actions.removeSlot(slot.def.key) : undefined}
          />
        ))}
      </div>

      {derived.missingRequired.length > 0 && (
        <p className="flex items-center gap-1.5 text-[0.75rem] text-ink-3">
          <AlertTriangle className="shrink-0 text-[0.875rem] text-gold-ink" />
          정확한 분석을 위해 {derived.missingRequired.map((d) => d.label).join("·")} 첨부를 권장해요.
        </p>
      )}

      {state.extras.length > 0 && (
        <div className="flex flex-col gap-2">
          {state.extras.map((item) => (
            <UploadFileItem
              key={item.id}
              name={item.name}
              size={item.size}
              status={item.status}
              previewUrl={item.previewUrl}
              errorMessage={item.error}
              onRetry={() => actions.retryExtra(item)}
              onRemove={() => actions.removeExtra(item.id)}
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
