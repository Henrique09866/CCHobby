import { useState, useEffect, useCallback, useRef } from "react";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  scheduledAt?: string;
  read: boolean;
  dismissed: boolean;
  repeat?: "daily" | "weekly" | null;
}

const STORAGE_KEY = "cchobby-notifications";

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(items: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let idCounter = Date.now();
function genId() {
  return (++idCounter).toString(36);
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Persist
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Schedule pending notifications
  useEffect(() => {
    const now = Date.now();
    notifications.forEach((n) => {
      if (n.scheduledAt && !n.dismissed && !timersRef.current.has(n.id)) {
        const fireAt = new Date(n.scheduledAt).getTime();
        const delay = fireAt - now;
        if (delay > 0) {
          const timer = setTimeout(() => {
            fireToast(n);
            timersRef.current.delete(n.id);
            // Handle repeat
            if (n.repeat) {
              const next = new Date(n.scheduledAt!);
              if (n.repeat === "daily") next.setDate(next.getDate() + 1);
              else if (n.repeat === "weekly") next.setDate(next.getDate() + 7);
              setNotifications((prev) =>
                prev.map((x) =>
                  x.id === n.id ? { ...x, scheduledAt: next.toISOString(), read: false } : x
                )
              );
            }
          }, delay);
          timersRef.current.set(n.id, timer);
        } else if (delay > -60000) {
          // Fire if within last minute
          fireToast(n);
        }
      }
    });

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const fireToast = useCallback((n: Notification) => {
    setToasts((prev) => [...prev, { ...n, dismissed: false }]);
  }, []);

  const addNotification = useCallback(
    (data: {
      title: string;
      message: string;
      type: NotificationType;
      scheduledAt?: string;
      repeat?: "daily" | "weekly" | null;
    }) => {
      const n: Notification = {
        id: genId(),
        title: data.title,
        message: data.message,
        type: data.type,
        createdAt: new Date().toISOString(),
        scheduledAt: data.scheduledAt,
        read: false,
        dismissed: false,
        repeat: data.repeat,
      };
      setNotifications((prev) => [n, ...prev]);
      // Immediate if no schedule
      if (!data.scheduledAt) {
        fireToast(n);
      }
    },
    [fireToast]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    toasts,
    unreadCount,
    addNotification,
    dismissToast,
    markRead,
    markAllRead,
    clearAll,
    removeNotification,
  };
}
