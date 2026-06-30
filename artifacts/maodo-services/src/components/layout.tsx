import { Link, useLocation } from "wouter";
import { WhatsAppFab } from "./whatsapp-fab";
import { Home, Briefcase, GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/formations", label: "Formations", icon: GraduationCap },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 w-full border-b bg-background/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl tracking-tight text-primary">
            Maodo<span className="text-foreground">Numérique</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    location === href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Hamburger mobile */}
          <button
            className="sm:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="sm:hidden border-t bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col px-4 py-2 gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                  <span
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location === href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col w-full pb-16 sm:pb-0">
        {children}
      </main>

      {/* ── Navigation mobile basse ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-around h-16 max-w-sm mx-auto px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <span className="flex flex-col items-center gap-0.5 py-2 px-4">
                  <Icon
                    className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="absolute bottom-2 w-1 h-1 rounded-full bg-primary" style={{ marginTop: "auto" }} />
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <WhatsAppFab />
    </div>
  );
}
