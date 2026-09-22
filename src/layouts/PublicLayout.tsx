import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" aria-label="Corvex home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {brand.nav.map((item) => (
              <Link key={item.label} to={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-950">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
          <button className="rounded p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="border-t bg-white p-5 md:hidden">
            {[...brand.nav, { label: "Log in", href: "/login" }].map((item) => (
              <Link key={item.label} to={item.href} onClick={() => setOpen(false)} className="block py-3 font-medium">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <Outlet />
    </div>
  );
}
