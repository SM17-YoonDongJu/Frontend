import { NotificationsView } from "./_components/NotificationsView";

export default function NotificationSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-6 py-8">
      <p className="text-[0.75rem] font-semibold text-gold-ink">내 정보</p>
      <h1 className="mt-1 font-serif text-[1.5rem] font-bold text-ink">알림 설정</h1>
      <div className="mt-5 rounded-card-lg border border-line bg-card p-5">
        <NotificationsView />
      </div>
    </div>
  );
}
