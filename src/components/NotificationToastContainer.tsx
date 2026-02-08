import { NotificationToast } from "./NotificationToast";
import type { Notification } from "@/hooks/useNotifications";

interface Props {
  toasts: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
      aria-label="Notificações ativas"
    >
      {toasts.map((t) => (
        <NotificationToast key={t.id} notification={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
