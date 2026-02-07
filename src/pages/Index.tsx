import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { HabitCalendar } from "@/components/HabitCalendar";
import { ProductivityChart } from "@/components/ProductivityChart";
import { HabitPieChart } from "@/components/HabitPieChart";
import { MonthlyGoals } from "@/components/MonthlyGoals";
import { useHabits } from "@/hooks/useHabits";

const Index = () => {
  const {
    habits, habitData, goals,
    selectedMonth, selectedYear, selectedDay,
    setSelectedMonth, setSelectedYear, setSelectedDay,
    toggleHabit, getDayProgress, monthStats,
    addGoal, removeGoal, toggleGoal, editGoal, dateKey,
  } = useHabits();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <DashboardHeader />

        <div className="space-y-6">
          <SummaryCards
            progressPercent={monthStats.progressPercent}
            totalDone={monthStats.totalDone}
            streak={monthStats.streak}
            maxStreak={monthStats.maxStreak}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <HabitCalendar
              month={selectedMonth}
              year={selectedYear}
              habits={habits}
              habitData={habitData}
              selectedDay={selectedDay}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              onSelectDay={setSelectedDay}
              onToggleHabit={toggleHabit}
              getDayProgress={getDayProgress}
              dateKey={dateKey}
            />
            <MonthlyGoals
              goals={goals}
              onAdd={addGoal}
              onRemove={removeGoal}
              onToggle={toggleGoal}
              onEdit={editGoal}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProductivityChart dailyProgress={monthStats.dailyProgress} />
            <HabitPieChart perHabit={monthStats.perHabit} daysInMonth={monthStats.daysInMonth} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
