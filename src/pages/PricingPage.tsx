import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand } from "@/config/brand";

export function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-brand-600">Simple pricing</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Build a sharper intelligence practice.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">Every plan includes secure workspaces, source citations, and the full Corvex research experience.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {brand.pricing.map((tier) => (
          <Card key={tier.name} className={tier.featured ? "border-brand-500 ring-2 ring-brand-100" : ""}>
            <div className="p-7">
              {tier.featured && <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600">Most popular</p>}
              <h2 className="text-xl font-bold">{tier.name}</h2>
              <p className="mt-4 text-4xl font-bold">{tier.price}<span className="text-sm font-normal text-slate-400">{tier.price.startsWith("$") && "/user/mo"}</span></p>
              <p className="mt-4 min-h-12 text-sm text-slate-500">{tier.description}</p>
              <Button className="mt-6 w-full" variant={tier.featured ? "default" : "outline"} asChild><Link to="/signup">{tier.cta}</Link></Button>
              <div className="mt-7 border-t pt-6">
                {tier.features.map((feature) => <p key={feature} className="mb-3 flex gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-brand-600" />{feature}</p>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
