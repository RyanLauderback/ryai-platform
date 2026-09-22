import { ArrowRight, Check, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { brand } from "@/config/brand";

function ProductPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
      <div className="grid min-h-[410px] grid-cols-[170px_1fr] overflow-hidden rounded-xl bg-slate-50 text-left">
        <div className="hidden bg-ink p-4 text-white sm:block">
          <Logo light />
          <div className="mt-10 space-y-2 text-xs text-slate-400">
            {["Overview", "Explorer", "Assistant", "Monitoring"].map((item, index) => (
              <div key={item} className={index === 1 ? "rounded-md bg-white/10 px-3 py-2 text-white" : "px-3 py-2"}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Research explorer</p>
              <h3 className="mt-1 font-bold">Enterprise AI infrastructure</h3>
            </div>
            <Badge>42 sources</Badge>
          </div>
          <div className="mt-6 rounded-lg border bg-white p-3 text-sm text-slate-500">Search across filings, calls, and expert interviews...</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Demand signals accelerate", "Capex guidance trends", "Cloud backlog comparison", "Expert channel checks"].map((title, index) => (
              <div key={title} className="rounded-lg border bg-white p-4">
                <div className="mb-4 h-2 w-12 rounded bg-brand-100" />
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {index + 7} verified sources surfaced with relevant context and key passages.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <>
      <main>
        <section className="overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#eaf0ff_0%,white_50%)] px-5 pb-20 pt-24 text-center sm:pt-32">
          <Badge className="mb-5"><Sparkles className="mr-1.5 h-3 w-3" /> Intelligence that compounds</Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-[-0.04em] text-ink sm:text-6xl">{brand.hero.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">{brand.tagline}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild data-testid="hero-cta">
              <Link to="/signup">{brand.hero.primaryCta}<ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing"><Play className="h-4 w-4" />{brand.hero.secondaryCta}</Link>
            </Button>
          </div>
          <ProductPreview />
        </section>

        <section className="border-y bg-slate-50 px-5 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[.2em] text-slate-400">Trusted by forward-looking teams</p>
          <div className="mx-auto mt-7 flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-5">
            {brand.customers.map((customer) => <span key={customer} className="font-bold tracking-widest text-slate-400">{customer}</span>)}
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-600">One connected workspace</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every intelligence workflow, finally in one place.</h2>
            <p className="mt-4 text-slate-600">{brand.description}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {brand.modules.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="security" className="bg-ink px-5 py-20 text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-mint" />
            <blockquote className="mt-7 text-2xl font-medium leading-10 sm:text-3xl">“{brand.testimonial.quote}”</blockquote>
            <p className="mt-6 font-semibold">{brand.testimonial.author}</p>
            <p className="text-sm text-slate-400">{brand.testimonial.role}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Scale intelligence, not overhead.</h2>
            <p className="mt-3 text-slate-600">Flexible plans for every stage of your research practice.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {brand.pricing.map((tier) => (
              <Card key={tier.name} className={tier.featured ? "border-brand-500 ring-2 ring-brand-100" : ""}>
                <div className="p-6">
                  <h3 className="font-bold">{tier.name}</h3>
                  <p className="mt-3 text-3xl font-bold">{tier.price}<span className="text-sm font-normal text-slate-500">{tier.price.startsWith("$") && "/user/mo"}</span></p>
                  <p className="mt-3 text-sm text-slate-500">{tier.description}</p>
                  <div className="mt-5 space-y-2">
                    {tier.features.slice(0, 3).map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-brand-600" />{feature}</p>)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center"><Button variant="outline" asChild><Link to="/pricing">Compare all plans <ArrowRight className="h-4 w-4" /></Link></Button></div>
        </section>

        <section className="px-5 pb-20">
          <div className="mx-auto max-w-6xl rounded-3xl bg-brand-600 px-6 py-14 text-center text-white sm:px-14">
            <h2 className="text-3xl font-bold">Make your next decision with the full picture.</h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">Start with a preloaded demo workspace. No credit card, setup, or data connection required.</p>
            <Button className="mt-7 bg-white text-brand-700 hover:bg-brand-50" asChild><Link to="/signup">Explore Corvex Console</Link></Button>
          </div>
        </section>
      </main>
      <footer className="border-t px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><Logo /><p className="mt-2 text-xs text-slate-500">{brand.legal}</p></div>
          <div className="flex gap-5 text-sm text-slate-500"><Link to="/pricing">Pricing</Link><Link to="/login">Log in</Link><span>Privacy</span></div>
        </div>
      </footer>
    </>
  );
}
