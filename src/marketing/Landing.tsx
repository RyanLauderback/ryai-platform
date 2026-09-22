import { CTA } from "./sections/CTA";
import { FeatureGrid } from "./sections/FeatureGrid";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { LogoCloud } from "./sections/LogoCloud";
import { PricingTeaser } from "./sections/PricingTeaser";
import { Testimonial } from "./sections/Testimonial";

export function Landing() {
  return (
    <>
      <main>
        <Hero />
        <LogoCloud />
        <FeatureGrid />
        <Testimonial />
        <PricingTeaser />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
