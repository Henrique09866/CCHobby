import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotificationType } from "@/hooks/useNotifications";

interface Props {
  onSchedule: (data: {
    title: string;
    message: string;
    type: NotificationType;
    scheduledAt?: string;
    repeat?: "daily" | "weekly" | null;
  }) => void;
}

export function NotificationScheduler({ onSchedule }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setMessage("");
    setType("info");
    setDate("");
    setTime("");
    setRepeat("none");
    setError("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !message.trim()) {
      setError("Título e mensagem são obrigatórios.");
      return;
    }

    let scheduledAt: string | undefined;
    if (date && time) {
      const dt = new Date(`${date}T${time}`);
      if (dt.getTime() <= Date.now()) {
        setError("A data/hora deve ser no futuro.");
        return;
      }
      scheduledAt = dt.toISOString();
    } else if (date || time) {
      setError("Preencha data e hora, ou deixe ambos em branco para envio imediato.");
      return;
    }

    onSchedule({
      title: title.trim(),
      message: message.trim(),
      type,
      scheduledAt,
      repeat: repeat === "none" ? null : repeat,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Agendar notificação">
          <CalendarClock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Nova Notificação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="notif-title">Título</Label>
            <Input
              id="notif-title"
              placeholder="Ex: Hora de meditar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notif-msg">Mensagem</Label>
            <Input
              id="notif-msg"
              placeholder="Ex: 10 minutos de meditação guiada"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as NotificationType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">ℹ️ Informação</SelectItem>
                <SelectItem value="success">✅ Sucesso</SelectItem>
                <SelectItem value="warning">⚠️ Aviso</SelectItem>
                <SelectItem value="error">❌ Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="notif-date">Data</Label>
              <Input
                id="notif-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notif-time">Hora</Label>
              <Input
                id="notif-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Repetir</Label>
            <Select value={repeat} onValueChange={(v) => setRepeat(v as typeof repeat)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não repetir</SelectItem>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button onClick={handleSubmit} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            {date && time ? "Agendar" : "Enviar agora"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
