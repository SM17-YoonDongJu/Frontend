import { cn } from "@/shared/lib/utils";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  nickname: string;
  /** 크기·글자 크기를 소비처가 지정(예: "size-16 text-[1.625rem]") */
  className?: string;
}

/** 아바타 — 이미지 있으면 표시, 없으면 이름 첫 글자. 원형 surface. */
export function ProfileAvatar({ avatarUrl, nickname, className }: ProfileAvatarProps) {
  return (
    <div
      role="img"
      aria-label={`${nickname} 프로필 사진`}
      style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 bg-cover bg-center",
        className,
      )}
    >
      {!avatarUrl && (
        <span className="font-serif font-bold text-white">{nickname.charAt(0)}</span>
      )}
    </div>
  );
}
