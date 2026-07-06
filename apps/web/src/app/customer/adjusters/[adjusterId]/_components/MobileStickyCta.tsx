"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";

export function MobileStickyCta({ adjusterId }: { adjusterId: string }) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-2 bg-paper-2/95 px-5 pb-[max(env(safe-area-inset-bottom),0.8125rem)] pt-[0.8125rem] lg:hidden">
      <Button
        full
        onClick={() => router.push(`/customer/chat?adjusterId=${adjusterId}`)}
        icon={
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        }
      >
        상담 신청
      </Button>
    </div>
  );
}
