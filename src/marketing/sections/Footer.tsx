import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { brand } from "@/config/brand";

export function Footer() {
  return (
    <footer className="border-t px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 text-xs text-slate-500">{brand.legal}</p>
        </div>
        <div className="flex gap-5 text-sm text-slate-500">
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Log in</Link>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
