"use client";

import type { ReactNode } from "react";
import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";

interface ChatSectionBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  errorTitle?: string;
}

export function ChatSectionBoundary({ children, fallback, errorTitle }: ChatSectionBoundaryProps) {
  return (
    <AsyncBoundary
      fallback={fallback}
      errorLayout="fill"
      errorTitle={errorTitle ?? "대화를 불러오지 못했어요"}
    >
      {children}
    </AsyncBoundary>
  );
}
