import { Link, useLocation } from "wouter";
import {
  Activity,
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";
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

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/gestione-consulenze": "Gestione consulenze",
  "/admin/contatti": "Messaggi di contatto",
  "/admin/testimonianze": "Testimonianze",
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const currentTitle = pageTitles[location] ?? "Area amministrativa";
  const initials = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("")
    .toUpperCase() || "A";

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-5 pt-7">
        <Link href="/">
          <span className="inline-flex cursor-pointer items-center rounded-2xl bg-white/75 px-3 py-2 shadow-sm ring-1 ring-black/[0.05] transition hover:bg-white">
            <img src="/logo-completo.png" alt="Arianna Pelliccioni Dietista" className="h-12 w-auto" />
          </span>
        </Link>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
          <ShieldCheck className="h-3.5 w-3.5" />
          Area riservata
        </div>
      </div>

      <div className="mx-4 rounded-[22px] border border-white/80 bg-white/70 p-3.5 shadow-[0_12px_35px_rgba(24,61,43,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 border border-emerald-100 shadow-sm">
            <AvatarFallback className="bg-emerald-50 font-semibold text-emerald-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" title="Connessa" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Navigazione</p>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <span
                    onClick={() => setDrawerOpen(false)}
                    className={`group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-[#153927] text-white shadow-[0_10px_28px_rgba(24,61,43,0.22)]"
                        : "text-slate-600 hover:bg-white/85 hover:text-slate-950 hover:shadow-sm"
                    }`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${active ? "bg-white/15" : "bg-slate-100 group-hover:bg-emerald-50"}`}>
                      <Icon className={`h-[18px] w-[18px] ${active ? "text-white" : "text-slate-500 group-hover:text-emerald-700"}`} />
                    </span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200/70 p-4">
        <div className="space-y-1 rounded-[20px] bg-white/55 p-2 ring-1 ring-white/70">
          <Link href="/">
            <Button
              variant="ghost"
              className="h-11 w-full justify-start rounded-xl text-slate-700 hover:bg-white"
              onClick={() => setDrawerOpen(false)}
            >
              <Home className="mr-3 h-[18px] w-[18px]" />
              Torna alla Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="h-11 w-full justify-start rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-700"
            onClick={async () => {
              await logout();
              toast.success("Logout effettuato");
              window.location.href = "/";
            }}
          >
            <LogOut className="mr-3 h-[18px] w-[18px]" />
            Esci
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-shell relative min-h-screen overflow-x-hidden bg-[#f3f6f3] text-slate-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute right-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute bottom-[-15rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-lime-100/45 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-emerald-950/20 bg-primary text-white shadow-[0_10px_35px_rgba(15,56,38,0.18)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[84px] max-w-[1500px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Apri menu amministrazione"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_5px_18px_rgba(7,31,20,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/">
            <span className="hidden items-center rounded-2xl bg-white px-3 py-2 shadow-[0_8px_24px_rgba(7,31,20,0.18)] ring-1 ring-white/70 transition hover:-translate-y-0.5 sm:inline-flex">
              <img src="/logo-completo.png" alt="Arianna Pelliccioni Dietista" className="h-9 w-auto lg:h-10" />
            </span>
          </Link>

          <div className="mx-1 hidden h-9 w-px bg-white/20 sm:block" />

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/75">Amministrazione</p>
            <h1 className="truncate font-sans text-lg font-semibold tracking-tight text-white sm:text-xl">{currentTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-emerald-50 backdrop-blur-xl sm:flex">
              <Activity className="h-3.5 w-3.5" />
              Dati aggiornati
            </div>
            <Avatar className="h-10 w-10 border border-white/25 shadow-sm">
              <AvatarFallback className="bg-white/15 text-sm font-semibold text-white">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[320px] border-r border-white/80 bg-[#f5f8f5]/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-[320px]">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu amministrazione</SheetTitle>
          </SheetHeader>
          <NavContent />
        </SheetContent>
      </Sheet>

      <main className="relative z-10 min-h-[calc(100vh-84px)]">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
