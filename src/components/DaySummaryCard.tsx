import { CheckCircle2, Clock, TrendingUp, Hourglass, Trophy, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { HabitData } from "@/hooks/useHabits";
import { useMemo } from "react";

interface Props {
  habits: string[];
  habitData: HabitData;
}

/** Estimated productive minutes per habit (could be user-configurable later) */
const HABIT_MINUTES: Record<string, number> = {
  Academia: 50,
  Leitura: 30,
  Meditação: 15,
  Estudo: 80,
  Sono: 0,
};
const DEFAULT_MINUTES = 30;

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}min`;
  return min === 0 ? `${h}h` : `${h}h${String(min).padStart(2, "0")}`;
}

function getInsight(rate: number) {
  if (rate >= 100) return { emoji: "🏆", text: "Rotina completa! Você cumpriu tudo hoje.", color: "text-chart-green" };
  if (rate >= 80) return { emoji: "🟢", text: `Hoje você manteve ${rate}% da rotina. Ótimo ritmo!`, color: "text-chart-green" };
  if (rate >= 50) return { emoji: "🟡", text: "Bom progresso hoje. Dá para melhorar amanhã.", color: "text-chart-orange" };
  return { emoji: "🔴", text: "Dia mais leve. Que tal retomar o foco amanhã?", color: "text-destructive" };
}

export function DaySummaryCard({ habits, habitData }: Props) {
  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const stats = useMemo(() => {
    const dayData = habitData[today] || {};
    const completed = habits.filter((h) => dayData[h]);
    const pending = habits.filter((h) => !dayData[h]);
    const rate = habits.length > 0 ? Math.round((completed.length / habits.length) * 100) : 0;
    const productiveMin = completed.reduce(
      (acc, h) => acc + (HABIT_MINUTES[h] ?? DEFAULT_MINUTES),
      0
    );
    return { completed: completed.length, pending: pending.length, rate, productiveMin };
  }, [habits, habitData, today]);

  const insight = getInsight(stats.rate);

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          Resumo do Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-3">
            <CheckCircle2 className="h-4 w-4 text-chart-green" />
            <div>
              <p className="text-xs text-muted-foreground">Concluídos</p>
              <p className="text-lg font-bold">{stats.completed}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-3">
            <Hourglass className="h-4 w-4 text-chart-orange" />
            <div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-lg font-bold">{stats.pending}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-3">
            <Clock className="h-4 w-4 text-chart-blue" />
            <div>
              <p className="text-xs text-muted-foreground">Tempo Produtivo</p>
              <p className="text-lg font-bold">{formatMinutes(stats.productiveMin)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-3">
            <Trophy className="h-4 w-4 text-chart-purple" />
            <div>
              <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-lg font-bold">{stats.rate}%</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progresso de hoje</span>
            <span>{stats.rate}%</span>
          </div>
          <Progress value={stats.rate} className="h-2.5" />
        </div>

        {/* Dynamic insight */}
        <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
          <Lightbulb className={`mt-0.5 h-4 w-4 shrink-0 ${insight.color}`} />
          <p className="text-sm leading-relaxed">
            <span className="mr-1">{insight.emoji}</span>
            {insight.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
