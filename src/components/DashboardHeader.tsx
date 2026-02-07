import { Sparkles } from "lucide-react";

export function DashboardHeader() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">CCHobby</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {greeting}! 👋
      </p>
    </header>
  );
}
