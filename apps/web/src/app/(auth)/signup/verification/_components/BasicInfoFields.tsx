"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { VerificationForm } from "../_hooks/use-verification-form";

interface BasicInfoFieldsProps {
  form: VerificationForm;
  /** 모바일 퍼널: Figma는 placeholder-only 인풋 → 시각 라벨 숨김(sr-only 유지). */
  hideLabels?: boolean;
}

/** 기본 정보 필드(이름·등록번호·연락처·이메일). 데스크톱=2열, 모바일=1열. */
export function BasicInfoFields({ form, hideLabels }: BasicInfoFieldsProps) {
  const labelClass = hideLabels ? "sr-only" : undefined;

  return (
    <div className={cn("grid grid-cols-1 gap-[1.125rem]", !hideLabels && "md:grid-cols-2")}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-name" className={labelClass}>
          이름
        </Label>
        <Input
          id="verification-name"
          value={form.name}
          onChange={(event) => form.setName(event.target.value)}
          placeholder="홍길동"
          autoComplete="name"
          error={form.errors.name}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-license-no" className={labelClass}>
          손해사정사 등록번호
        </Label>
        <Input
          id="verification-license-no"
          value={form.licenseNo}
          onChange={(event) => form.setLicenseNo(event.target.value)}
          placeholder="제0000호"
          hint={hideLabels ? undefined : "금융감독원 등록번호"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-phone" className={labelClass}>
          연락처
        </Label>
        <Input
          id="verification-phone"
          type="tel"
          value={form.phone}
          onChange={(event) => form.setPhone(event.target.value)}
          placeholder="010-0000-0000"
          autoComplete="tel"
          error={form.errors.phone}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-email" className={labelClass}>
          이메일
        </Label>
        <Input
          id="verification-email"
          type="email"
          value={form.email}
          onChange={(event) => form.setEmail(event.target.value)}
          placeholder="name@email.com"
          autoComplete="email"
          error={form.errors.email}
        />
      </div>
    </div>
  );
}
