import type { ReactNode } from "react";
import {
  VerificationHeader,
  type BreadcrumbItem,
} from "../../_components/VerificationHeader";

export function StatusShell({
  breadcrumb,
  children,
}: {
  breadcrumb: BreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <div className="md:fixed md:inset-0 md:overflow-y-auto md:bg-paper">
      <div className="hidden md:block">
        <VerificationHeader breadcrumb={breadcrumb} />
      </div>
      <div className="mx-auto flex min-h-dvh w-full max-w-[34rem] flex-col justify-center px-2 py-10 md:min-h-[calc(100dvh-4rem)] md:py-16">
        {children}
      </div>
    </div>
  );
}
