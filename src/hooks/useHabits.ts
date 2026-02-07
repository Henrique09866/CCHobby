import { useState, useEffect, useCallback, useMemo } from "react";

export interface HabitDay {
  [habitName: string]: boolean;
}

export interface HabitData {
  [dateKey: string]: HabitDay; // "2026-02-07"
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_HABITS = ["Academia", "Leitura", "Meditação", "Estudo", "Sono"];

const STORAGE_KEYS = {
  habits: "cchobby-habits",
  habitData: "cchobby-habit-data",
  goals: "cchobby-goals",
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<string[]>(() =>
    loadJSON(STORAGE_KEYS.habits, DEFAULT_HABITS)
  );
  const [habitData, setHabitData] = useState<HabitData>(() =>
    loadJSON(STORAGE_KEYS.habitData, {})
  );
  const [goals, setGoals] = useState<Goal[]>(() =>
    loadJSON(STORAGE_KEYS.goals, [])
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
  }, [habits]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.habitData, JSON.stringify(habitData));
  }, [habitData]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  }, [goals]);

  const dateKey = useCallback(
    (day: number) =>
      `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    [selectedMonth, selectedYear]
  );

  const toggleHabit = useCallback(
    (day: number, habit: string) => {
      const key = dateKey(day);
      setHabitData((prev) => {
        const dayData = prev[key] || {};
        return { ...prev, [key]: { ...dayData, [habit]: !dayData[habit] } };
      });
    },
    [dateKey]
  );

  const getDayProgress = useCallback(
    (day: number) => {
      const key = dateKey(day);
      const dayData = habitData[key];
      if (!dayData || habits.length === 0) return 0;
      const done = habits.filter((h) => dayData[h]).length;
      return done / habits.length;
    },
    [dateKey, habitData, habits]
  );

  // Monthly stats
  const monthStats = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    let totalDone = 0;
    let totalPossible = 0;
    const perHabit: Record<string, number> = {};
    habits.forEach((h) => (perHabit[h] = 0));

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(d);
      const dayData = habitData[key];
      if (dayData) {
        habits.forEach((h) => {
          if (dayData[h]) {
            totalDone++;
            perHabit[h] = (perHabit[h] || 0) + 1;
          }
        });
      }
      totalPossible += habits.length;
    }

    const progressPercent = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Streak calculation (consecutive days with all habits done, ending today or most recent)
    const today = new Date();
    let streak = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(d);
      const dayData = habitData[key];
      const allDone = dayData && habits.every((h) => dayData[h]);
      if (allDone) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    streak = currentStreak;

    // Daily progress for chart
    const dailyProgress: { day: number; percent: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(d);
      const dayData = habitData[key];
      let done = 0;
      if (dayData) {
        habits.forEach((h) => {
          if (dayData[h]) done++;
        });
      }
      dailyProgress.push({
        day: d,
        percent: habits.length > 0 ? Math.round((done / habits.length) * 100) : 0,
      });
    }

    return { progressPercent, totalDone, streak, maxStreak, perHabit, dailyProgress, daysInMonth };
  }, [habitData, habits, selectedMonth, selectedYear, dateKey]);

  // Goals CRUD
  const addGoal = useCallback((text: string) => {
    setGoals((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }]);
  }, []);
  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);
  const toggleGoal = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  }, []);
  const editGoal = useCallback((id: string, text: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, text } : g))
    );
  }, []);

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const removeHabit = useCallback((name: string) => {
    setHabits((prev) => prev.filter((h) => h !== name));
  }, []);

  return {
    habits,
    habitData,
    goals,
    selectedMonth,
    selectedYear,
    selectedDay,
    setSelectedMonth,
    setSelectedYear,
    setSelectedDay,
    toggleHabit,
    getDayProgress,
    monthStats,
    addGoal,
    removeGoal,
    toggleGoal,
    editGoal,
    dateKey,
    addHabit,
    removeHabit,
  };
}
