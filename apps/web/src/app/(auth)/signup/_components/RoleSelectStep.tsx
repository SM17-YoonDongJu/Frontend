import type { UserType } from "@/shared/model/user";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Scale } from "@/shared/ui/icons/Scale";
import { User } from "@/shared/ui/icons/User";
import { Button } from "@/shared/ui/Button";
import { RoleCard } from "./RoleCard";

interface RoleSelectStepProps {
  selected: UserType | null;
  onSelect: (userType: UserType) => void;
  onStart: () => void;
}

/** Step1: 역할 선택(일반 사용자/손해사정사 단일선택) → 시작하기. */
export function RoleSelectStep({ selected, onSelect, onStart }: RoleSelectStepProps) {
  return (
    <div>
      <h1 className="font-serif text-[1.625rem] font-bold leading-tight text-ink">
        어떤 역할로 시작하시겠어요?
      </h1>
      <p className="mt-2 text-sm text-ink-3">
        역할은 나중에 마이페이지에서 추가하거나 전환할 수 있어요.
      </p>

      <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="역할 선택">
        <RoleCard
          icon={<User />}
          title="일반 사용자"
          description="받은 보험금이 적정한지 분석받고 싶어요"
          hint="바로 시작할 수 있어요"
          selected={selected === "insured_person"}
          onSelect={() => onSelect("insured_person")}
        />
        <RoleCard
          icon={<Scale />}
          title="손해사정사"
          description="사건을 검수하고 의뢰인과 상담하고 싶어요"
          hint="자격 인증 후 활동할 수 있어요"
          badge="자격 인증 필요"
          selected={selected === "adjuster"}
          onSelect={() => onSelect("adjuster")}
        />
      </div>

      <Button
        full
        size="lg"
        className="mt-6"
        disabled={selected === null}
        onClick={onStart}
        icon={<ArrowRight className="text-[1.1rem]" />}
      >
        시작하기
      </Button>

      <p className="mt-4 text-center text-[0.78rem] text-ink-3">
        손해사정사를 선택하면 자격 인증 페이지로 이동해요.
      </p>
    </div>
  );
}
