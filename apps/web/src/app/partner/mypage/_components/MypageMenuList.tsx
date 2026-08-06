import { Bell } from "@/shared/ui/icons/Bell";
import { FileText } from "@/shared/ui/icons/FileText";
import { Lock } from "@/shared/ui/icons/Lock";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { User } from "@/shared/ui/icons/User";
import { LogoutButton } from "./LogoutButton";
import { MenuRow } from "./MenuRow";

interface MypageMenuListProps {
  reviewCount: number;
  onNotificationClick?: () => void;
  onCredentialClick?: () => void;
}

export function MypageMenuList({
  reviewCount,
  onNotificationClick,
  onCredentialClick,
}: MypageMenuListProps) {
  return (
    <nav className="flex flex-col gap-3 md:block md:divide-y md:divide-line-2 md:rounded-card md:border md:border-line md:bg-card md:shadow-sm">
      <MenuRow
        icon={<User />}
        title="프로필 관리"
        description="공개 프로필 편집"
        badge="편집"
        href="/partner/profile/edit"
      />
      <MenuRow
        icon={<FileText />}
        title="검수 내역"
        description={`${reviewCount}건`}
        href="/partner/review"
      />
      <div className="md:hidden">
        <MenuRow icon={<Bell />} title="알림 설정" href="/partner/mypage/notifications" />
      </div>
      <div className="hidden md:block">
        <MenuRow icon={<Bell />} title="알림 설정" onClick={onNotificationClick} />
      </div>
      <MenuRow
        icon={<ShieldCheck />}
        title="인증 · 자격 증빙"
        description="검증 완료"
        onClick={onCredentialClick}
      />
      <MenuRow icon={<FileText />} title="이용약관" href="/terms" />
      <MenuRow icon={<Lock />} title="개인정보 처리방침" href="/privacy" />
      <MenuRow icon={<User />} title="회원 탈퇴" href="/withdraw" />
      <div className="md:border-t md:border-line-2 md:px-2.5 md:pt-2 md:pb-1">
        <LogoutButton />
      </div>
    </nav>
  );
}
