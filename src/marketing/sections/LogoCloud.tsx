import { brand } from "@/config/brand";

export function LogoCloud() {
  return (
    <section className="border-y bg-slate-50 px-5 py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[.2em] text-slate-400">
        Trusted by forward-looking teams
      </p>
      <div className="mx-auto mt-7 flex max-w-5xl flex-wrap justify-center gap-x-12 gap-y-5">
        {brand.customers.map((customer) => (
          <span key={customer} className="font-bold tracking-widest text-slate-400">
            {customer}
          </span>
        ))}
      </div>
    </section>
  );
}
