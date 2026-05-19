import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/servizi", label: "Servizi" },
    { href: "/chi-sono", label: "Chi Sono" },
    { href: "/testimonianze", label: "Testimonianze" },
    { href: "/contatti", label: "Contatti" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <span className="flex items-center cursor-pointer">
            <img 
              src="/logo-completo.png" 
              alt="Arianna Pelliccioni Dietista" 
              className="h-10 md:h-12 w-auto dark:brightness-0 dark:invert"
            />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  isActive(item.href) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {!isAdmin && (
            <Link href="/prenota">
              <span className="inline-block">
                <Button variant="outline">Prenota Consulenza</Button>
              </span>
            </Link>
          )}
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                    isActive(item.href) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            {!isAdmin && (
              <Link href="/prenota">
                <span className="block">
                  <Button className="w-full" variant="outline" onClick={() => setMobileMenuOpen(false)}>
                    Prenota Consulenza
                  </Button>
                </span>
              </Link>
            )}
            <div className="pt-2">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
