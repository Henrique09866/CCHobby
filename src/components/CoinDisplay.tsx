import { Coins } from "lucide-react";

interface Props {
  coins: number;
}

export function CoinDisplay({ coins }: Props) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold">
      <Coins className="h-4 w-4 text-primary" />
      <span>🪙 {coins}</span>
    </div>
  );
}
