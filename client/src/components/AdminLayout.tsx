import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  MessageSquare, 
  LogOut,
  Menu,
  Star,
  Home
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logout effettuato");
      window.location.href = "/";
    },
  });

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/gestione-consulenze", label: "Gestione Consulenze", icon: Calendar },
    { href: "/admin/contatti", label: "Messaggi Contatto", icon: MessageSquare },
    { href: "/admin/testimonianze", label: "Testimonianze", icon: Star },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "A";

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/">
          <span className="text-2xl font-bold text-primary cursor-pointer block" style={{ fontFamily: "'Playfair Display', serif" }}>
            Studio Dietista
          </span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Pannello Amministrazione</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <span
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setDrawerOpen(false)}
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Torna alla Home</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Esci</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header con Menu Button */}
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4 container">
          <h1 className="text-xl font-bold text-primary">Pannello di Controllo</h1>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Drawer Sidebar */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="min-h-screen">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
