import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  dailyProgress: { day: number; percent: number }[];
}

export function ProductivityChart({ dailyProgress }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Produtividade Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-muted-foreground" unit="%" />
              <Tooltip
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v}%`, "Progresso"]}
                labelFormatter={(l) => `Dia ${l}`}
              />
              <Line
                type="monotone"
                dataKey="percent"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
