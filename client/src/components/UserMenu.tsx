import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Calendar, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useState } from "react";

interface UserMenuProps {
  onDark?: boolean;
}

export default function UserMenu({ onDark = false }: UserMenuProps) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button
        asChild
        className={onDark ? "bg-white text-[#153927] hover:bg-emerald-50 hover:text-[#153927]" : undefined}
      >
        <a href={getLoginUrl()}>Accedi</a>
      </Button>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const isAdmin = user.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 focus:outline-none">
          <Avatar className={`h-10 w-10 cursor-pointer border-2 transition-colors ${onDark ? "border-white/30 hover:border-white" : "border-primary/20 hover:border-primary"}`}>
            <AvatarFallback className={onDark ? "bg-white/15 font-semibold text-white" : "bg-primary/10 font-semibold text-primary"}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary w-fit">
                Admin
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isAdmin ? (
          <DropdownMenuItem onClick={() => setLocation("/admin")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Pannello di Controllo</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setLocation("/area-personale")}>
            <User className="mr-2 h-4 w-4" />
            <span>Area Personale</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={async () => {
            setLoggingOut(true);
            await logout();
            toast.success("Logout effettuato");
            window.location.href = "/";
          }}
          disabled={loggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Esci</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
