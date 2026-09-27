import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import { ProductPreview } from "./ProductPreview";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#eaf0ff_0%,white_50%)] px-5 pb-20 pt-24 text-center sm:pt-32">
      <Badge className="mb-5">
        <Sparkles className="mr-1.5 h-3 w-3" /> Intelligence that compounds
      </Badge>
      <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-[-0.04em] text-ink sm:text-6xl">
        {brand.hero.title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        {brand.hero.subcopy}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild data-testid="hero-cta">
          <Link to="/signup">
            {brand.hero.primaryCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/pricing">
            <Play className="h-4 w-4" />
            {brand.hero.secondaryCta}
          </Link>
        </Button>
      </div>
      <ProductPreview />
    </section>
  );
}
