import { Card } from "@/components/ui/card";
import { brand } from "@/config/brand";

export function FeatureGrid() {
  return (
    <section id="platform" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-600">One connected workspace</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Every intelligence workflow, finally in one place.
        </h2>
        <p className="mt-4 text-slate-600">{brand.description}</p>
      </div>
      <div id="solutions" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {brand.modules.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
