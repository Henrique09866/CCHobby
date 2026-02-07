import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Goal } from "@/hooks/useHabits";
import { cn } from "@/lib/utils";

interface Props {
  goals: Goal[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function MonthlyGoals({ goals, onAdd, onRemove, onToggle, onEdit }: Props) {
  const [newGoal, setNewGoal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (!newGoal.trim()) return;
    onAdd(newGoal.trim());
    setNewGoal("");
  };

  const startEdit = (g: Goal) => {
    setEditingId(g.id);
    setEditText(g.text);
  };

  const confirmEdit = () => {
    if (editingId && editText.trim()) {
      onEdit(editingId, editText.trim());
    }
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Metas do Mês</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add */}
        <div className="flex gap-2">
          <Input
            placeholder="Nova meta..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="h-9 text-sm"
          />
          <Button size="sm" onClick={handleAdd} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {goals.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhuma meta adicionada.
          </p>
        )}

        {goals.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3 transition-colors"
          >
            <Checkbox
              checked={g.completed}
              onCheckedChange={() => onToggle(g.id)}
            />
            {editingId === g.id ? (
              <>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                  className="h-8 flex-1 text-sm"
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={confirmEdit}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                <span className={cn("flex-1 text-sm", g.completed && "line-through text-muted-foreground")}>
                  {g.text}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(g)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemove(g.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
