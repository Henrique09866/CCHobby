import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Gift, Plus, Lock, ShoppingBag, Coins, History } from "lucide-react";
import type { Reward } from "@/hooks/useChallenges";

interface Props {
  coins: number;
  rewards: Reward[];
  availableRewards: Reward[];
  redeemedRewards: Reward[];
  onAdd: (data: Omit<Reward, "id" | "redeemed" | "createdAt">) => void;
  onRedeem: (id: string) => void;
  onRemove: (id: string) => void;
}

export function RewardsDashboard({ coins, availableRewards, redeemedRewards, onAdd, onRedeem, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(20);

  const handleSave = () => {
    if (!name.trim() || cost < 1) return;
    onAdd({ name: name.trim(), description: description.trim(), cost });
    setName(""); setDescription(""); setCost(20);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Coin balance */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo atual</p>
              <p className="text-3xl font-bold">🪙 {coins}</p>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{availableRewards.length} disponíveis</p>
            <p>{redeemedRewards.length} resgatadas</p>
          </div>
        </CardContent>
      </Card>

      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Loja de Recompensas</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Adicionar Recompensa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Recompensa</DialogTitle>
              <DialogDescription>Crie uma recompensa pessoal para resgatar com coins.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Nome da recompensa" value={name} onChange={e => setName(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck={false} />
              <Input placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck={false} />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">🪙 Custo:</span>
                <Input type="number" min={1} className="w-24" value={cost} onChange={e => setCost(Number(e.target.value))} />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!name.trim() || cost < 1}>Salvar Recompensa</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available rewards */}
      {availableRewards.length === 0 && redeemedRewards.length === 0 && (
        <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma recompensa criada. Adicione suas recompensas pessoais!</CardContent></Card>
      )}

      {availableRewards.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map(rw => {
            const canAfford = coins >= rw.cost;
            return (
              <Card key={rw.id} className={`transition-all ${canAfford ? "border-primary/20 hover:border-primary/50 hover:shadow-md" : "opacity-60 border-muted"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {canAfford ? <ShoppingBag className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                      {rw.name}
                    </CardTitle>
                    <Badge variant={canAfford ? "default" : "secondary"}>🪙 {rw.cost}</Badge>
                  </div>
                  {rw.description && <CardDescription>{rw.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button size="sm" className="flex-1" disabled={!canAfford} onClick={() => onRedeem(rw.id)}>
                    {canAfford ? "Resgatar" : "Coins insuficientes"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onRemove(rw.id)}>✕</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Redeemed history */}
      {redeemedRewards.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Histórico</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {redeemedRewards.map(rw => (
              <Card key={rw.id} className="opacity-60">
                <CardContent className="py-3 flex items-center justify-between">
                  <span className="text-sm line-through">{rw.name}</span>
                  <Badge variant="outline" className="text-xs">-{rw.cost} 🪙</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
