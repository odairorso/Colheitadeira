import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Sprout } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full gradient-bg overflow-hidden relative">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 z-10">
          <header className="h-16 flex items-center border-b border-border/40 px-6 glass-panel shrink-0 sticky top-0 z-20">
            <SidebarTrigger className="mr-4 hover:bg-secondary/80 transition-colors" />
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <Sprout className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg gradient-text tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                AgroHarvest
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
