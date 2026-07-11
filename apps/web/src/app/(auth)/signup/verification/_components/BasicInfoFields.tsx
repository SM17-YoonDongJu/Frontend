"use client";

import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { VerificationForm } from "../_hooks/use-verification-form";

interface BasicInfoFieldsProps {
  form: VerificationForm;
}

/** 기본 정보 필드(이름·등록번호·연락처·이메일). 데스크톱=2열, 모바일=1열. */
export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-[1.125rem] md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-name">이름</Label>
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
        <Label htmlFor="verification-license-no">손해사정사 등록번호</Label>
        <Input
          id="verification-license-no"
          value={form.licenseNo}
          onChange={(event) => form.setLicenseNo(event.target.value)}
          placeholder="제0000호"
          hint="금융감독원 등록번호"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-phone">연락처</Label>
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
        <Label htmlFor="verification-email">이메일</Label>
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
