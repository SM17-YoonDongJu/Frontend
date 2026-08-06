import { CoverageBlock } from "./CoverageBlock";

export interface CoverageBasisSectionsProps {
  applicableGuarantees: string[];
  omittedSpecialContract: string[];
  basisTermsPrecedents: string[];
}

export function CoverageBasisSections({
  applicableGuarantees,
  omittedSpecialContract,
  basisTermsPrecedents,
}: CoverageBasisSectionsProps) {
  return (
    <div className="space-y-[1.125rem] md:grid md:grid-cols-2 md:items-start md:gap-6 md:space-y-0">
      <CoverageBlock title="적용 가능 보장" items={applicableGuarantees} icon="check" />
      <CoverageBlock title="누락 가능 특약" items={omittedSpecialContract} icon="warning" />
      <CoverageBlock title="근거 약관·판례" items={basisTermsPrecedents} icon="scale" />
    </div>
  );
}
