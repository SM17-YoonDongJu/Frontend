"use client";

import type { ReactNode } from "react";
import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { SectionSkeleton } from "./SectionSkeleton";

interface SectionBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorTitle?: string;
}

export function SectionBoundary({ children, fallback, errorTitle }: SectionBoundaryProps) {
  return (
    <AsyncBoundary
      fallback={fallback ?? <SectionSkeleton />}
      errorLayout="card"
      errorTitle={errorTitle}
    >
      {children}
    </AsyncBoundary>
  );
}
