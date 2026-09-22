import { brand } from "@/config/brand";
import { PricingTierCard } from "./PricingTierCard";

export function Pricing() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-brand-600">Simple pricing</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Build a sharper intelligence practice.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Every plan includes secure workspaces, source citations, and the full Corvex research experience.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {brand.pricing.map((tier) => (
          <PricingTierCard key={tier.name} tier={tier} variant="full" />
        ))}
      </div>
    </main>
  );
}
