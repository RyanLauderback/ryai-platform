import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

export function ProductPreview() {
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
          <div className="mt-6 rounded-lg border bg-white p-3 text-sm text-slate-500">
            Search across filings, calls, and expert interviews...
          </div>
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
