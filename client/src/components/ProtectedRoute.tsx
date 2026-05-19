import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useClerk } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Apri il modal di login Clerk
        openSignIn({ redirectUrl: window.location.href });
      } else if (requireAdmin && user?.role !== "admin") {
        // Utente autenticato ma non admin
        setLocation("/area-personale");
      }
    }
  }, [loading, isAuthenticated, user, requireAdmin, setLocation, openSignIn]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Apre il modal di login Clerk
  }

  if (requireAdmin && user?.role !== "admin") {
    return null; // Redirect a /area-personale
  }

  return <>{children}</>;
}
