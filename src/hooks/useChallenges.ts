import { useState, useCallback, useMemo } from "react";

export type ChallengeType = "tempo" | "habito" | "atividade";
export type ChallengeDuration = "diario" | "semanal" | "personalizado";

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  duration: ChallengeDuration;
  durationDays: number;
  coins: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  createdAt: string;
  redeemedAt?: string;
  redeemed: boolean;
}

const LS_CHALLENGES = "cchobby-challenges";
const LS_REWARDS = "cchobby-rewards";
const LS_COINS = "cchobby-coins";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(() => load(LS_CHALLENGES, []));
  const [rewards, setRewards] = useState<Reward[]>(() => load(LS_REWARDS, []));
  const [coins, setCoins] = useState<number>(() => load(LS_COINS, 0));

  const save = useCallback((ch: Challenge[], rw: Reward[], co: number) => {
    localStorage.setItem(LS_CHALLENGES, JSON.stringify(ch));
    localStorage.setItem(LS_REWARDS, JSON.stringify(rw));
    localStorage.setItem(LS_COINS, JSON.stringify(co));
  }, []);

  const addChallenge = useCallback((data: Omit<Challenge, "id" | "completed" | "createdAt">) => {
    setChallenges(prev => {
      const next = [...prev, { ...data, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() }];
      localStorage.setItem(LS_CHALLENGES, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeChallenge = useCallback((id: string) => {
    setChallenges(prev => {
      const ch = prev.find(c => c.id === id);
      if (!ch || ch.completed) return prev;
      const next = prev.map(c => c.id === id ? { ...c, completed: true, completedAt: new Date().toISOString() } : c);
      localStorage.setItem(LS_CHALLENGES, JSON.stringify(next));
      setCoins(co => {
        const newCo = co + ch.coins;
        localStorage.setItem(LS_COINS, JSON.stringify(newCo));
        return newCo;
      });
      return next;
    });
  }, []);

  const removeChallenge = useCallback((id: string) => {
    setChallenges(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(LS_CHALLENGES, JSON.stringify(next));
      return next;
    });
  }, []);

  const addReward = useCallback((data: Omit<Reward, "id" | "redeemed" | "createdAt">) => {
    setRewards(prev => {
      const next = [...prev, { ...data, id: crypto.randomUUID(), redeemed: false, createdAt: new Date().toISOString() }];
      localStorage.setItem(LS_REWARDS, JSON.stringify(next));
      return next;
    });
  }, []);

  const redeemReward = useCallback((id: string) => {
    setRewards(prev => {
      const rw = prev.find(r => r.id === id);
      if (!rw || rw.redeemed || coins < rw.cost) return prev;
      const next = prev.map(r => r.id === id ? { ...r, redeemed: true, redeemedAt: new Date().toISOString() } : r);
      localStorage.setItem(LS_REWARDS, JSON.stringify(next));
      setCoins(co => {
        const newCo = co - rw.cost;
        localStorage.setItem(LS_COINS, JSON.stringify(newCo));
        return newCo;
      });
      return next;
    });
  }, [coins]);

  const removeReward = useCallback((id: string) => {
    setRewards(prev => {
      const next = prev.filter(r => r.id !== id);
      localStorage.setItem(LS_REWARDS, JSON.stringify(next));
      return next;
    });
  }, []);

  const activeChallenges = useMemo(() => challenges.filter(c => !c.completed), [challenges]);
  const completedChallenges = useMemo(() => challenges.filter(c => c.completed), [challenges]);
  const availableRewards = useMemo(() => rewards.filter(r => !r.redeemed), [rewards]);
  const redeemedRewards = useMemo(() => rewards.filter(r => r.redeemed), [rewards]);

  return {
    challenges, activeChallenges, completedChallenges,
    rewards, availableRewards, redeemedRewards,
    coins,
    addChallenge, completeChallenge, removeChallenge,
    addReward, redeemReward, removeReward,
  };
}
