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
    { href: "/nutrizione-sportiva", label: "Nutrizione Sportiva" },
    { href: "/chi-sono", label: "Chi Sono" },
    { href: "/testimonianze", label: "Testimonianze" },
    { href: "/contatti", label: "Contatti" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-950/20 bg-primary text-white shadow-[0_10px_35px_rgba(15,56,38,0.16)] backdrop-blur-2xl">
      <div className="container flex h-[76px] items-center justify-between">
        <Link href="/">
          <span className="flex cursor-pointer items-center rounded-2xl bg-white px-3 py-2 shadow-[0_8px_24px_rgba(7,31,20,0.18)] ring-1 ring-white/70 transition hover:-translate-y-0.5">
            <img 
              src="/logo-completo.png" 
              alt="Arianna Pelliccioni Dietista" 
              className="h-9 w-auto md:h-10"
            />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={`text-sm font-medium transition-colors hover:text-white cursor-pointer ${
                  isActive(item.href)
                    ? "text-white underline decoration-white decoration-2 underline-offset-8"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center space-x-4">
          {!isAdmin && (
            <Link href="/prenota">
              <span className="inline-block">
                <Button className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#153927]" variant="outline">
                  Prenota Consulenza
                </Button>
              </span>
            </Link>
          )}
          <UserMenu onDark />
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={mobileMenuOpen}
          className="rounded-xl border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20 xl:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-primary xl:hidden">
          <nav className="container py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <span
                  className={`text-sm font-medium transition-colors hover:text-white cursor-pointer ${
                    isActive(item.href) ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            {!isAdmin && (
              <Link href="/prenota">
                <span className="block">
                  <Button className="w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#153927]" variant="outline" onClick={() => setMobileMenuOpen(false)}>
                    Prenota Consulenza
                  </Button>
                </span>
              </Link>
            )}
            <div className="pt-2">
              <UserMenu onDark />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
