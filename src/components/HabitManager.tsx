import { useState } from "react";
import { Plus, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  habits: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export function HabitManager({ habits, onAdd, onRemove }: Props) {
  const [newHabit, setNewHabit] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    onAdd(newHabit.trim());
    setNewHabit("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Hábitos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerenciar Hábitos</DialogTitle>
          <DialogDescription>Adicione ou remova hábitos do seu acompanhamento diário.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Novo hábito..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={handleAdd} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {habits.map((h) => (
            <div
              key={h}
              className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
            >
              <span className="text-sm">{h}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onRemove(h)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
