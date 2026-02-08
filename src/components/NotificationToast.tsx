import { useEffect, useState } from "react";
import { X, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const typeConfig = {
  info: { icon: Info, bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  success: { icon: CheckCircle, bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  error: { icon: XCircle, bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
};

interface Props {
  notification: Notification;
  onDismiss: (id: string) => void;
  duration?: number;
}

export function NotificationToast({ notification, onDismiss, duration = 5000 }: Props) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => handleDismiss(), duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "pointer-events-auto w-80 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 bg-card",
        config.bg,
        visible && !exiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", config.text)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{notification.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
