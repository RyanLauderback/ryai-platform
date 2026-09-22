import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { PricingTierCard } from "../PricingTierCard";

export function PricingTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Scale intelligence, not overhead.</h2>
        <p className="mt-3 text-slate-600">Flexible plans for every stage of your research practice.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {brand.pricing.map((tier) => (
          <PricingTierCard key={tier.name} tier={tier} variant="teaser" />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link to="/pricing">
            Compare all plans <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
