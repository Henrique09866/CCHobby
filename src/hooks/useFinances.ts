import { useState, useCallback, useMemo } from "react";

export interface Expense {
  id: string;
  name: string;
  value: number;
  category: string;
  type: "fixa" | "variavel";
}

const STORAGE_KEY = "cchobby-finance-data";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { income: 0, expenses: [] };
}

function saveData(income: number, expenses: Expense[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ income, expenses }));
}

export function useFinances() {
  const initial = loadData();
  const [income, setIncomeState] = useState<number>(initial.income);
  const [expenses, setExpenses] = useState<Expense[]>(initial.expenses);

  const persist = useCallback((inc: number, exp: Expense[]) => {
    saveData(inc, exp);
  }, []);

  const setIncome = useCallback((value: number) => {
    setIncomeState(value);
    setExpenses((prev) => {
      persist(value, prev);
      return prev;
    });
  }, [persist]);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setExpenses((prev) => {
      const next = [...prev, { ...expense, id: crypto.randomUUID() }];
      setIncomeState((inc) => { persist(inc, next); return inc; });
      return next;
    });
  }, [persist]);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((e) => e.id !== id);
      setIncomeState((inc) => { persist(inc, next); return inc; });
      return next;
    });
  }, [persist]);

  const updateExpense = useCallback((id: string, data: Partial<Omit<Expense, "id">>) => {
    setExpenses((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
      setIncomeState((inc) => { persist(inc, next); return inc; });
      return next;
    });
  }, [persist]);

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.value, 0), [expenses]);
  const balance = useMemo(() => income - totalExpenses, [income, totalExpenses]);
  const usagePercent = useMemo(() => (income > 0 ? Math.round((totalExpenses / income) * 100) : 0), [income, totalExpenses]);

  return {
    income, setIncome,
    expenses, addExpense, removeExpense, updateExpense,
    totalExpenses, balance, usagePercent,
  };
}
