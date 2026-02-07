import { TrendingUp, CheckCircle2, Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  progressPercent: number;
  totalDone: number;
  streak: number;
  maxStreak: number;
}

const cards = [
  { key: "progress", label: "Progresso do Mês", icon: TrendingUp, color: "text-primary", suffix: "%" as string | undefined },
  { key: "done", label: "Hábitos Concluídos", icon: CheckCircle2, color: "text-accent-foreground", suffix: undefined as string | undefined },
  { key: "streak", label: "Sequência Atual", icon: Flame, color: "text-primary", suffix: " dias" as string | undefined },
  { key: "max", label: "Maior Sequência", icon: Trophy, color: "text-accent-foreground", suffix: " dias" as string | undefined },
] as const;

export function SummaryCards({ progressPercent, totalDone, streak, maxStreak }: Props) {
  const values: Record<string, number> = {
    progress: progressPercent,
    done: totalDone,
    streak,
    max: maxStreak,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.key} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-xl font-bold">
                {values[c.key]}
                {c.suffix ?? ""}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
