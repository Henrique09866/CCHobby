import { useState, useCallback, useMemo } from "react";

export interface Expense {
  id: string;
  name: string;
  value: number;
  category: string;
  type: "fixa" | "variavel";
}

export interface MonthData {
  income: number;
  expenses: Expense[];
}

const STORAGE_KEY = "cchobby-finance-data";

function getMonthKey(month: number, year: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function loadAllData(): Record<string, MonthData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration: old format had { income, expenses } at root
      if (parsed.income !== undefined && parsed.expenses !== undefined && !parsed.__versioned) {
        const now = new Date();
        const key = getMonthKey(now.getMonth(), now.getFullYear());
        const migrated: Record<string, MonthData> = {
          [key]: { income: parsed.income, expenses: parsed.expenses },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return parsed;
    }
  } catch {}
  return {};
}

function saveAllData(data: Record<string, MonthData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useFinances() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [allData, setAllData] = useState<Record<string, MonthData>>(loadAllData);

  const monthKey = getMonthKey(selectedMonth, selectedYear);
  const currentData = allData[monthKey] || { income: 0, expenses: [] };
  const income = currentData.income;
  const expenses = currentData.expenses;

  const updateMonth = useCallback((key: string, updater: (d: MonthData) => MonthData) => {
    setAllData((prev) => {
      const current = prev[key] || { income: 0, expenses: [] };
      const next = { ...prev, [key]: updater(current) };
      saveAllData(next);
      return next;
    });
  }, []);

  const setIncome = useCallback((value: number) => {
    updateMonth(monthKey, (d) => ({ ...d, income: value }));
  }, [monthKey, updateMonth]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    updateMonth(monthKey, (d) => ({
      ...d,
      expenses: [...d.expenses, { ...expense, id: crypto.randomUUID() }],
    }));
  }, [monthKey, updateMonth]);

  const removeExpense = useCallback((id: string) => {
    updateMonth(monthKey, (d) => ({
      ...d,
      expenses: d.expenses.filter((e) => e.id !== id),
    }));
  }, [monthKey, updateMonth]);

  const updateExpense = useCallback((id: string, data: Partial<Omit<Expense, "id">>) => {
    updateMonth(monthKey, (d) => ({
      ...d,
      expenses: d.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
  }, [monthKey, updateMonth]);

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.value, 0), [expenses]);
  const balance = useMemo(() => income - totalExpenses, [income, totalExpenses]);
  const usagePercent = useMemo(() => (income > 0 ? Math.round((totalExpenses / income) * 100) : 0), [income, totalExpenses]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.value;
    });
    return Object.entries(map).map(([category, value]) => ({ category, value }));
  }, [expenses]);

  // Monthly comparison: get data for the previous month
  const getMonthData = useCallback((m: number, y: number): MonthData => {
    const key = getMonthKey(m, y);
    return allData[key] || { income: 0, expenses: [] };
  }, [allData]);

  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const prevData = getMonthData(prevMonth, prevYear);
  const prevTotal = useMemo(() => prevData.expenses.reduce((s, e) => s + e.value, 0), [prevData]);

  return {
    income, setIncome,
    expenses, addExpense, removeExpense, updateExpense,
    totalExpenses, balance, usagePercent,
    categoryData,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    prevTotal, prevData,
    monthKey,
  };
}
