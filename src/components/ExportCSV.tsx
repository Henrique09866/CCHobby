import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HabitData, Goal } from "@/hooks/useHabits";

interface Props {
  habits: string[];
  habitData: HabitData;
  goals: Goal[];
  month: number;
  year: number;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function buildCSV(habits: string[], habitData: HabitData, goals: Goal[], month: number, year: number): string {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lines: string[] = [];

  // Header
  lines.push(["Dia", ...habits].join(","));

  // Habit rows
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayData = habitData[key] || {};
    const row = [String(d), ...habits.map((h) => (dayData[h] ? "Sim" : "Não"))];
    lines.push(row.join(","));
  }

  // Goals section
  lines.push("");
  lines.push("Metas do Mês,Status");
  goals.forEach((g) => {
    lines.push(`"${g.text.replace(/"/g, '""')}",${g.completed ? "Concluída" : "Pendente"}`);
  });

  return lines.join("\n");
}

export function ExportCSV({ habits, habitData, goals, month, year }: Props) {
  const handleExport = () => {
    const csv = buildCSV(habits, habitData, goals, month, year);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CCHobby_${MONTH_NAMES[month]}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Exportar CSV</span>
    </Button>
  );
}
