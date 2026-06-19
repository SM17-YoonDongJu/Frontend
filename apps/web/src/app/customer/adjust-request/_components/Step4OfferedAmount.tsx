"use client";

import { Controller, useFormContext } from "react-hook-form";
import { blockNonNumericKeys, toNonNegativeInt } from "@/shared/lib/number-input";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Input } from "@/shared/ui/Input";
import type { AdjustRequestDraft } from "../_model/types";

export function Step4OfferedAmount() {
  const { control, watch, setValue, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;
  const notOffered = watch("insuranceNotOffered") ?? false;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[22px] font-bold text-ink">제안받은 보험금이 있나요?</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-3">
          보험사에서 안내한 금액을 적어주세요. 없으면 아래를 선택하세요.
        </p>
      </div>

      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink-2">제안받은 보험금</span>
        <Controller
          control={control}
          name="insuranceOffered"
          render={({ field }) => (
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="예) 8500000"
              suffix="원"
              className="max-w-[280px]"
              disabled={notOffered}
              value={notOffered ? "" : (field.value ?? "")}
              onKeyDown={blockNonNumericKeys}
              onChange={(e) => field.onChange(toNonNegativeInt(e.target.value))}
              error={errors.insuranceOffered?.message}
            />
          )}
        />
      </div>

      <Checkbox
        checked={notOffered}
        onChange={(c) => {
          setValue("insuranceNotOffered", c);
          if (c) setValue("insuranceOffered", null, { shouldValidate: true });
        }}
        label="아직 제안받지 않았어요"
      />
    </section>
  );
}
