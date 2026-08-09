"use client";

import { useEffect, useRef, useState } from "react";
import { useInsuranceList } from "../../_api/use-insurance-list";
import { Bell } from "@/shared/ui/icons/Bell";
import { FileText } from "@/shared/ui/icons/FileText";
import { Lock } from "@/shared/ui/icons/Lock";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { User } from "@/shared/ui/icons/User";
import { MobileMenuRow } from "./MobileMenuRow";
import { MobileSection } from "./MobileSection";

const ICON_CLASS = "size-[1.125rem]";

/** 모바일 내 정보·설정 리스트 — 내 보험 정보 / 알림 설정(목적지 미확정 → 추후 지원 예정) / 약관 · 개인정보 처리방침. */
export function SettingsList() {
  const { data } = useInsuranceList();
  const [notice, setNotice] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showNotice = (key: string) => {
    setNotice(key);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotice(null), 2000);
  };

  const noticeText = <span className="text-[0.8125rem] text-ink-3">추후 지원 예정</span>;

  return (
    <MobileSection title="내 정보 · 설정">
      <MobileMenuRow
        icon={<ShieldCheck className={ICON_CLASS} />}
        label="내 보험 정보"
        onClick={() => showNotice("insurance")}
        right={
          notice === "insurance" ? (
            noticeText
          ) : (
            <span className="text-[0.8125rem] font-bold text-ink-3">
              가입 {data.list.length}건
            </span>
          )
        }
      />
      <MobileMenuRow
        icon={<Bell className={ICON_CLASS} />}
        label="알림 설정"
        onClick={() => showNotice("notification")}
        right={notice === "notification" ? noticeText : undefined}
      />
      <MobileMenuRow
        icon={<FileText className={ICON_CLASS} />}
        label="이용약관"
        href="/terms"
      />
      <MobileMenuRow
        icon={<Lock className={ICON_CLASS} />}
        label="개인정보 처리방침"
        href="/privacy"
      />
      <MobileMenuRow
        icon={<User className={ICON_CLASS} />}
        label="회원 탈퇴"
        href="/withdraw"
      />
    </MobileSection>
  );
}
