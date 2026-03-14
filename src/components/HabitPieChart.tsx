import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--chart-green))",
  "hsl(var(--chart-blue))",
  "hsl(var(--chart-pink))",
];

interface Props {
  perHabit: Record<string, number>;
  daysInMonth: number;
}

export function HabitPieChart({ perHabit, daysInMonth }: Props) {
  const data = Object.entries(perHabit).map(([name, value]) => ({
    name,
    value,
    percent: daysInMonth > 0 ? Math.round((value / daysInMonth) * 100) : 0,
  }));

  if (data.every((d) => d.value === 0)) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hábitos no Mês</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          Nenhum hábito registrado ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hábitos no Mês</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [`${v} dias`, name]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
