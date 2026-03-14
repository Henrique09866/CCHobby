import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { DaySummaryCard } from "@/components/DaySummaryCard";
import { HabitCalendar } from "@/components/HabitCalendar";
import { ProductivityChart } from "@/components/ProductivityChart";
import { HabitPieChart } from "@/components/HabitPieChart";
import { MonthlyGoals } from "@/components/MonthlyGoals";
import { HabitManager } from "@/components/HabitManager";

import { NotificationPanel } from "@/components/NotificationPanel";
import { NotificationScheduler } from "@/components/NotificationScheduler";
import { NotificationToastContainer } from "@/components/NotificationToastContainer";
import { ChallengeManager } from "@/components/ChallengeManager";
import { RewardsDashboard } from "@/components/RewardsDashboard";
import { CoinDisplay } from "@/components/CoinDisplay";
import { FinanceDashboard } from "@/components/FinanceDashboard";
import { useHabits } from "@/hooks/useHabits";
import { useNotifications } from "@/hooks/useNotifications";
import { useChallenges } from "@/hooks/useChallenges";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const {
    habits, habitData, goals,
    selectedMonth, selectedYear, selectedDay,
    setSelectedMonth, setSelectedYear, setSelectedDay,
    toggleHabit, getDayProgress, monthStats,
    addGoal, removeGoal, toggleGoal, editGoal, dateKey,
    addHabit, removeHabit,
  } = useHabits();

  const {
    notifications, toasts, unreadCount,
    addNotification, dismissToast,
    markRead, markAllRead, clearAll, removeNotification,
  } = useNotifications();

  const {
    challenges, activeChallenges, completedChallenges,
    rewards, availableRewards, redeemedRewards,
    coins,
    addChallenge, completeChallenge, removeChallenge,
    addReward, redeemReward, removeReward,
  } = useChallenges();

  const renderSection = () => {
    switch (activeSection) {
      case "calendario":
        return (
          <HabitCalendar
            month={selectedMonth} year={selectedYear} habits={habits} habitData={habitData}
            selectedDay={selectedDay} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear}
            onSelectDay={setSelectedDay} onToggleHabit={toggleHabit} getDayProgress={getDayProgress} dateKey={dateKey}
          />
        );
      case "metas":
        return <MonthlyGoals goals={goals} onAdd={addGoal} onRemove={removeGoal} onToggle={toggleGoal} onEdit={editGoal} />;
      case "habitos":
        return (
          <div className="space-y-6">
            <HabitManager habits={habits} onAdd={addHabit} onRemove={removeHabit} />
            <HabitCalendar
              month={selectedMonth} year={selectedYear} habits={habits} habitData={habitData}
              selectedDay={selectedDay} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear}
              onSelectDay={setSelectedDay} onToggleHabit={toggleHabit} getDayProgress={getDayProgress} dateKey={dateKey}
            />
          </div>
        );
      case "desafios":
        return (
          <ChallengeManager
            challenges={challenges} activeChallenges={activeChallenges} completedChallenges={completedChallenges}
            onAdd={addChallenge} onComplete={completeChallenge} onRemove={removeChallenge}
          />
        );
      case "recompensas":
        return (
          <RewardsDashboard
            coins={coins} rewards={rewards} availableRewards={availableRewards} redeemedRewards={redeemedRewards}
            onAdd={addReward} onRedeem={redeemReward} onRemove={removeReward}
          />
        );
      case "financas":
        return <FinanceDashboard />;
      case "estatisticas":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductivityChart dailyProgress={monthStats.dailyProgress} />
            <HabitPieChart perHabit={monthStats.perHabit} daysInMonth={monthStats.daysInMonth} />
          </div>
        );
      case "tempo":
        return <DaySummaryCard habits={habits} habitData={habitData} />;
      case "conquistas":
        return (
          <SummaryCards progressPercent={monthStats.progressPercent} totalDone={monthStats.totalDone}
            streak={monthStats.streak} maxStreak={monthStats.maxStreak} />
        );
      case "config":
        return (
          <div className="space-y-4">
            <HabitManager habits={habits} onAdd={addHabit} onRemove={removeHabit} />
            <NotificationScheduler onSchedule={addNotification} />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <SummaryCards progressPercent={monthStats.progressPercent} totalDone={monthStats.totalDone}
              streak={monthStats.streak} maxStreak={monthStats.maxStreak} />
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Calendar - takes more space */}
              <div className="lg:col-span-5">
                <HabitCalendar
                  month={selectedMonth} year={selectedYear} habits={habits} habitData={habitData}
                  selectedDay={selectedDay} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear}
                  onSelectDay={setSelectedDay} onToggleHabit={toggleHabit} getDayProgress={getDayProgress} dateKey={dateKey}
                />
              </div>
              {/* Goals */}
              <div className="lg:col-span-4">
                <MonthlyGoals goals={goals} onAdd={addGoal} onRemove={removeGoal} onToggle={toggleGoal} onEdit={editGoal} />
              </div>
              {/* Day summary */}
              <div className="lg:col-span-3">
                <DaySummaryCard habits={habits} habitData={habitData} />
              </div>
            </div>
            {/* Charts row - full width */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ProductivityChart dailyProgress={monthStats.dailyProgress} />
              <HabitPieChart perHabit={monthStats.perHabit} daysInMonth={monthStats.daysInMonth} />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col min-w-0">
          <NotificationToastContainer toasts={toasts} onDismiss={dismissToast} />
          <div className="mx-auto w-full max-w-[1600px] px-6 pb-12">
            <header className="flex items-center gap-2 py-4">
              <SidebarTrigger />
              <div className="flex-1">
                <DashboardHeader>
                  <CoinDisplay coins={coins} />
                  <NotificationScheduler onSchedule={addNotification} />
                  <NotificationPanel notifications={notifications} unreadCount={unreadCount}
                    onMarkRead={markRead} onMarkAllRead={markAllRead} onClearAll={clearAll} onRemove={removeNotification} />
                  
                  <HabitManager habits={habits} onAdd={addHabit} onRemove={removeHabit} />
                </DashboardHeader>
              </div>
            </header>
            {renderSection()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
