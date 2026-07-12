"use client";

import { useInsuranceList } from "../../_api/use-insurance-list";
import { Bell } from "@/shared/ui/icons/Bell";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { MobileMenuRow } from "./MobileMenuRow";
import { MobileSection } from "./MobileSection";

const ICON_CLASS = "size-[1.125rem]";

/** 모바일 내 정보·설정 리스트 — 내 보험 정보 / 알림 설정 / 고객센터·약관. */
export function SettingsList() {
  const { data } = useInsuranceList();

  return (
    <MobileSection title="내 정보 · 설정">
      <MobileMenuRow
        icon={<ShieldCheck className={ICON_CLASS} />}
        label="내 보험 정보"
        right={
          <span className="text-[0.8125rem] font-bold text-ink-3">
            가입 {data.list.length}건
          </span>
        }
      />
      <MobileMenuRow icon={<Bell className={ICON_CLASS} />} label="알림 설정" />
      <MobileMenuRow
        icon={<MessageCircle className={ICON_CLASS} />}
        label="고객센터 · 약관"
      />
    </MobileSection>
  );
}
