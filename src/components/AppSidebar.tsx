import {
  LayoutDashboard,
  CalendarDays,
  Target,
  RefreshCw,
  BarChart3,
  Clock,
  Trophy,
  Settings,
  Swords,
  Coins,
  Gift,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "calendario", title: "Calendário", icon: CalendarDays },
  { id: "metas", title: "Metas", icon: Target },
  { id: "habitos", title: "Hábitos", icon: RefreshCw },
  { id: "desafios", title: "Desafios", icon: Swords },
  { id: "recompensas", title: "Recompensas", icon: Gift },
  { id: "estatisticas", title: "Estatísticas", icon: BarChart3 },
  { id: "tempo", title: "Tempo Produtivo", icon: Clock },
  { id: "conquistas", title: "Conquistas", icon: Trophy },
  { id: "config", title: "Configurações", icon: Settings },
];

interface Props {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                const btn = (
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={isActive}
                    className="transition-all duration-200"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                );

                return (
                  <SidebarMenuItem key={item.id}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{btn}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    ) : (
                      btn
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
