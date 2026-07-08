import type { ComponentType } from "react";
import { Check } from "@/shared/ui/icons/Check";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";
import { User } from "@/shared/ui/icons/User";
import { FileText } from "@/shared/ui/icons/FileText";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import type { NotificationType } from "../_model/notification.schema";

interface IconStyle {
  Icon: ComponentType<{ className?: string }>;
  boxClassName: string;
  iconClassName: string;
}

const ICON_STYLE_BY_TYPE: Record<NotificationType, IconStyle> = {
  REVIEW_COMPLETE: { Icon: Check, boxClassName: "bg-green-soft", iconClassName: "text-green" },
  RECEIVED_PROPOSAL: { Icon: MessageSquare, boxClassName: "bg-gold-soft", iconClassName: "text-gold-ink" },
  CONSULT_ACCEPTED: { Icon: User, boxClassName: "bg-paper-2", iconClassName: "text-ink-2" },
  ANALYSIS_COMPLETE: { Icon: FileText, boxClassName: "bg-gold-soft", iconClassName: "text-gold-ink" },
  IDENTITY_VERIFIED: { Icon: ShieldCheck, boxClassName: "bg-green-soft", iconClassName: "text-green" },
};

interface NotificationTypeIconProps {
  type: NotificationType;
}

export function NotificationTypeIcon({ type }: NotificationTypeIconProps) {
  const { Icon, boxClassName, iconClassName } = ICON_STYLE_BY_TYPE[type];

  return (
    <span
      className={`flex size-[2.375rem] shrink-0 items-center justify-center rounded-[0.625rem] ${boxClassName}`}
    >
      <Icon className={`size-[1.1875rem] ${iconClassName}`} />
    </span>
  );
}
