import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import SportsNutrition from "./pages/SportsNutrition";
import About from "./pages/About";

import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import VerifyEmail from "./pages/VerifyEmail";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";

// User Pages
import UserDashboard from "./pages/UserDashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ConsultationRequests from "./pages/admin/ConsultationRequests";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import ContactMessages from "./pages/admin/ContactMessages";
import TestimonialManagement from "./pages/admin/TestimonialManagement";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AnalyticsTracker() {
  const [location] = useLocation();
  const track = trpc.analytics.track.useMutation();

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    track.mutate({ path: location });
    // Una visualizzazione viene registrata ad ogni cambio pagina.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      
      <Route path="/servizi">
        <PublicLayout>
          <Services />
        </PublicLayout>
      </Route>
      
      <Route path="/nutrizione-sportiva">
        <PublicLayout><SportsNutrition /></PublicLayout>
      </Route>

      <Route path="/chi-sono">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      

      <Route path="/testimonianze">
        <PublicLayout>
          <Testimonials />
        </PublicLayout>
      </Route>
      
      <Route path="/contatti">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      
      <Route path="/prenota">
        <PublicLayout>
          <Booking />
        </PublicLayout>
      </Route>
      
      <Route path="/verifica-email">
        <PublicLayout>
          <VerifyEmail />
        </PublicLayout>
      </Route>

      <Route path="/accedi">
        <PublicLayout>
          <Auth />
        </PublicLayout>
      </Route>

      <Route path="/reimposta-password">
        <PublicLayout>
          <ResetPassword />
        </PublicLayout>
      </Route>

      {/* User Protected Routes */}
      <Route path="/area-personale">
        <PublicLayout>
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        </PublicLayout>
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin">
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/consulenze">
        <ProtectedRoute requireAdmin>
          <ConsultationRequests />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/gestione-consulenze">
        <ProtectedRoute requireAdmin>
          <ConsultationManagement />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/contatti">
        <ProtectedRoute requireAdmin>
          <ContactMessages />
        </ProtectedRoute>
      </Route>
      
      
      <Route path="/admin/testimonianze">
        <ProtectedRoute requireAdmin>
          <TestimonialManagement />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <AnalyticsTracker />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
