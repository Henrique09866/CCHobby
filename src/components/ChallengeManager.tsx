import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Target, Plus, CheckCircle2, Trash2, Trophy, Clock, Dumbbell, Repeat } from "lucide-react";
import type { Challenge, ChallengeType, ChallengeDuration } from "@/hooks/useChallenges";

const TYPE_LABELS: Record<ChallengeType, { label: string; icon: typeof Clock }> = {
  tempo: { label: "Tempo", icon: Clock },
  habito: { label: "Hábito Diário", icon: Repeat },
  atividade: { label: "Atividade Física", icon: Dumbbell },
};

const DURATION_LABELS: Record<ChallengeDuration, string> = {
  diario: "Diário",
  semanal: "Semanal",
  personalizado: "Personalizado",
};

interface Props {
  challenges: Challenge[];
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  onAdd: (data: Omit<Challenge, "id" | "completed" | "createdAt">) => void;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ChallengeManager({ activeChallenges, completedChallenges, onAdd, onComplete, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ChallengeType>("habito");
  const [duration, setDuration] = useState<ChallengeDuration>("diario");
  const [durationDays, setDurationDays] = useState(1);
  const [coins, setCoins] = useState(20);

  const handleSave = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), description: description.trim(), type, duration, durationDays: duration === "diario" ? 1 : duration === "semanal" ? 7 : durationDays, coins });
    setName(""); setDescription(""); setType("habito"); setDuration("diario"); setDurationDays(1); setCoins(20);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Desafios</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Criar Desafio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Desafio</DialogTitle>
              <DialogDescription>Defina seu desafio e a recompensa em coins.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Nome do desafio" value={name} onChange={e => setName(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck={false} />
              <Input placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck={false} />
              <Select value={type} onValueChange={v => setType(v as ChallengeType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tempo">⏱ Tempo</SelectItem>
                  <SelectItem value="habito">🔁 Hábito Diário</SelectItem>
                  <SelectItem value="atividade">🏋️ Atividade Física</SelectItem>
                </SelectContent>
              </Select>
              <Select value={duration} onValueChange={v => setDuration(v as ChallengeDuration)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              {duration === "personalizado" && (
                <Input type="number" min={1} placeholder="Dias" value={durationDays} onChange={e => setDurationDays(Number(e.target.value))} />
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">🪙 Coins:</span>
                <Input type="number" min={1} className="w-24" value={coins} onChange={e => setCoins(Number(e.target.value))} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!name.trim()}>Salvar Desafio</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeChallenges.length === 0 && completedChallenges.length === 0 && (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum desafio criado ainda. Crie seu primeiro desafio!</CardContent></Card>
      )}

      {activeChallenges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ativos</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeChallenges.map(ch => {
              const TypeIcon = TYPE_LABELS[ch.type].icon;
              return (
                <Card key={ch.id} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-primary" />
                        {ch.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-primary border-primary/30">🪙 {ch.coins}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {ch.description && <p className="text-sm text-muted-foreground">{ch.description}</p>}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{TYPE_LABELS[ch.type].label}</Badge>
                      <Badge variant="secondary">{DURATION_LABELS[ch.duration]}{ch.duration === "personalizado" ? ` (${ch.durationDays}d)` : ""}</Badge>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => onComplete(ch.id)} className="flex-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Concluir
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onRemove(ch.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {completedChallenges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Concluídos</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {completedChallenges.map(ch => (
              <Card key={ch.id} className="opacity-70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-chart-green" />
                    <span className="line-through">{ch.name}</span>
                    <Badge className="bg-chart-green/20 text-chart-green border-0">+{ch.coins} 🪙</Badge>
                  </CardTitle>
                </CardHeader>
                {ch.description && <CardContent className="pt-0"><p className="text-sm text-muted-foreground">{ch.description}</p></CardContent>}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
