"use client";

import type { ReactNode } from "react";
import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { NotificationListSkeleton } from "./NotificationListSkeleton";

interface NotificationBoundaryProps {
  children: ReactNode;
}

export function NotificationBoundary({ children }: NotificationBoundaryProps) {
  return (
    <AsyncBoundary
      fallback={<NotificationListSkeleton />}
      errorLayout="card"
      errorTitle="알림을 불러오지 못했어요"
      errorClassName="mx-5 mt-5"
    >
      {children}
    </AsyncBoundary>
  );
}
