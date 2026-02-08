import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notification, NotificationType } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeLabels: Record<NotificationType, string> = {
  info: "Informação",
  success: "Sucesso",
  warning: "Aviso",
  error: "Erro",
};

const typeColors: Record<NotificationType, string> = {
  info: "text-blue-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

interface Props {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onRemove: (id: string) => void;
}

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onRemove,
}: Props) {
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notificações</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onMarkAllRead} className="h-7 text-xs gap-1">
              <CheckCheck className="h-3 w-3" /> Ler todas
            </Button>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-7 text-xs gap-1 text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" /> Limpar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 border-b px-4 py-2 overflow-x-auto">
          <Filter className="h-3 w-3 text-muted-foreground shrink-0" />
          {(["all", "info", "success", "warning", "error"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap",
                filter === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t === "all" ? "Todas" : typeLabels[t]}
            </button>
          ))}
        </div>

        {/* List */}
        <ScrollArea className="max-h-80">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((n) => {
                const Icon = typeIcons[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", typeColors[n.type])} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(n.scheduledAt || n.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!n.read && (
                        <button
                          onClick={() => onMarkRead(n.id)}
                          className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Marcar como lida"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onRemove(n.id)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
