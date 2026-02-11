import { Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function DashboardHeader({ children }: Props) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("cchobby-theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("cchobby-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">CCHobby</h1>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDark((d) => !d)}
          aria-label="Alternar tema"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
