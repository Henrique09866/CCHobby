import { Sparkles, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function DashboardHeader({ children }: Props) {
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

  const themeButton = (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Alternar tema"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">CCHobby</h1>
      </div>

      {/* Desktop: all actions visible */}
      <div className="hidden items-center gap-3 sm:flex">
        {children}
        {themeButton}
      </div>

      {/* Mobile: dropdown menu */}
      <div className="flex items-center gap-2 sm:hidden">
        {themeButton}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Menu de ações">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex flex-col gap-2 p-3 z-50 bg-popover"
          >
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}