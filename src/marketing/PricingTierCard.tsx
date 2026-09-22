import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PricingTier } from "@/config/brand";

type PricingTierCardProps = {
  tier: PricingTier;
  variant: "full" | "teaser";
};

export function PricingTierCard({ tier, variant }: PricingTierCardProps) {
  const full = variant === "full";
  const features = full ? tier.features : tier.features.slice(0, 3);

  return (
    <Card className={tier.featured ? "border-brand-500 ring-2 ring-brand-100" : ""}>
      <div className={full ? "p-7" : "p-6"}>
        {full && tier.featured && (
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600">Most popular</p>
        )}
        <h2 className={full ? "text-xl font-bold" : "font-bold"}>{tier.name}</h2>
        <p className={full ? "mt-4 text-4xl font-bold" : "mt-3 text-3xl font-bold"}>
          {tier.price}
          {tier.cadence && <span className="text-sm font-normal text-slate-500">{tier.cadence}</span>}
        </p>
        <p className={full ? "mt-4 min-h-12 text-sm text-slate-500" : "mt-3 text-sm text-slate-500"}>
          {tier.description}
        </p>
        {full && (
          <Button className="mt-6 w-full" variant={tier.featured ? "default" : "outline"} asChild>
            <Link to="/signup">{tier.cta}</Link>
          </Button>
        )}
        <div className={full ? "mt-7 border-t pt-6" : "mt-5 space-y-2"}>
          {features.map((feature) => (
            <p key={feature} className={full ? "mb-3 flex gap-2 text-sm" : "flex items-center gap-2 text-sm"}>
              <Check className="h-4 w-4 shrink-0 text-brand-600" />
              {feature}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}
