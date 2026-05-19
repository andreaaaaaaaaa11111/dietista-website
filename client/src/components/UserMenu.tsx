import { useAuth } from "@/_core/hooks/useAuth";
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
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { Link } from "wouter";

export default function UserMenu() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { openSignIn } = useClerk();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout effettuato");
      window.location.href = "/";
    } catch {
      toast.error("Errore durante il logout");
    }
  };

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button onClick={() => openSignIn()}>
        Accedi
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
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
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
        
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Esci</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
