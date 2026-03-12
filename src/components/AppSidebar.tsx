import {
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  Wheat,
  Map,
  Sprout,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Produtores", url: "/produtores", icon: Users },
  { title: "Empresas", url: "/empresas", icon: Building2 },
  { title: "Lançamentos", url: "/lancamentos", icon: Receipt },
  { title: "Colheitas", url: "/colheitas", icon: Wheat },
  { title: "Talhões", url: "/talhoes", icon: Map },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/40 px-4 py-4 glass-panel rounded-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-sidebar-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AgroHarvest
              </span>
              <span className="text-xs text-sidebar-muted-foreground/80 font-medium">
                Olimpio de Oliveira
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar-background/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/80">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-muted-foreground">
            © 2026 Olimpio de Oliveira
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
