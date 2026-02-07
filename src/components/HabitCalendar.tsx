import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { HabitData } from "@/hooks/useHabits";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  month: number;
  year: number;
  habits: string[];
  habitData: HabitData;
  selectedDay: number | null;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onSelectDay: (d: number | null) => void;
  onToggleHabit: (day: number, habit: string) => void;
  getDayProgress: (day: number) => number;
  dateKey: (day: number) => string;
}

export function HabitCalendar({
  month, year, habits, habitData, selectedDay,
  onMonthChange, onYearChange, onSelectDay, onToggleHabit, getDayProgress, dateKey,
}: Props) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (month === 0) { onMonthChange(11); onYearChange(year - 1); }
    else onMonthChange(month - 1);
    onSelectDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { onMonthChange(0); onYearChange(year + 1); }
    else onMonthChange(month + 1);
    onSelectDay(null);
  };

  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-base">
            {MONTH_NAMES[month]} {year}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => (
            <div key={`blank-${b}`} />
          ))}
          {days.map((d) => {
            const progress = getDayProgress(d);
            const isSelected = selectedDay === d;
            return (
              <button
                key={d}
                onClick={() => onSelectDay(isSelected ? null : d)}
                className={cn(
                  "relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  progress === 1 && !isSelected && "bg-primary/20 font-semibold",
                  progress > 0 && progress < 1 && !isSelected && "bg-accent/40"
                )}
              >
                {d}
                {progress > 0 && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Habit panel for selected day */}
        {selectedDay !== null && (
          <div className="mt-4 rounded-xl border bg-muted/50 p-4">
            <p className="mb-3 text-sm font-semibold">
              Hábitos — {selectedDay} de {MONTH_NAMES[month]}
            </p>
            <div className="space-y-2">
              {habits.map((h) => {
                const key = dateKey(selectedDay);
                const checked = !!(habitData[key] && habitData[key][h]);
                return (
                  <label
                    key={h}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggleHabit(selectedDay, h)}
                    />
                    <span className={cn("text-sm", checked && "line-through text-muted-foreground")}>
                      {h}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
