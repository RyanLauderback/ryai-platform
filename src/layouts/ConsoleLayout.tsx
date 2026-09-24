import {
  BarChart3,
  Bot,
  ChevronLeft,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const navigation = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard, end: true },
  { label: "Explorer", href: "/app/explorer", icon: Search },
  { label: "Assistant", href: "/app/assistant", icon: Bot },
  { label: "Integrations", href: "/app/integrations", icon: KeyRound },
  { label: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export function ConsoleLayout() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Logo light />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <ChevronLeft />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Console navigation">
        {navigation.map(({ label, href, icon: iconComponent, end }) => {
          const IconComponent = iconComponent;
          return (
            <NavLink
              key={href}
              to={href}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white",
                  isActive && "bg-white/10 text-white",
                )
              }
            >
              <IconComponent className="h-4 w-4" />
              {label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
            {user?.name
              .split(" ")
              .map((part) => part[0])
              .join("") || "MC"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "Maya Chen"}</p>
            <p className="truncate text-xs text-slate-500">{user?.company || "Northstar Capital"}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex w-full items-center gap-2 text-xs text-slate-400 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>
      {open && (
        <>
          <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-ink lg:hidden">{sidebar}</aside>
        </>
      )}
      <div className="lg:pl-64">
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-5 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu />
          </button>
          <div className="ml-4"><Logo /></div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
