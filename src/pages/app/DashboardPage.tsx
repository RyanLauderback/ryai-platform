import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Bot, FileSearch, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { brand } from "@/config/brand";
import { api } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const activity = [
  { title: "Brief generated", detail: "Enterprise AI budgets", time: "12 min ago", icon: Bot },
  { title: "Document indexed", detail: "Nvidia earnings call Q4", time: "1 hr ago", icon: FileSearch },
  { title: "Monitor updated", detail: "Semiconductor capex", time: "3 hrs ago", icon: Search },
];

export function DashboardPage() {
  const { data = [] } = useQuery({ queryKey: ["usage"], queryFn: api.usage });
  const user = useAuthStore((state) => state.user);
  const recent = data.slice(-30);
  const totals = recent.reduce(
    (sum, day) => ({
      queries: sum.queries + day.queries,
      documents: sum.documents + day.documents,
      tokens: sum.tokens + day.tokens,
    }),
    { queries: 0, documents: 0, tokens: 0 },
  );
  const cards = [
    { label: "AI queries", value: formatNumber(totals.queries), change: "+18%", icon: Bot },
    { label: "Documents viewed", value: formatNumber(totals.documents), change: "+12%", icon: FileSearch },
    { label: "Tokens processed", value: formatNumber(totals.tokens), change: "+24%", icon: ArrowUpRight },
    { label: "Active teammates", value: "14", change: "+2", icon: Users },
  ];

  return (
    <div data-testid="dashboard-page">
      <PageHeader
        title={`${brand.console.greeting}, ${user?.name.split(" ")[0] || "Maya"}`}
        description="Here is what is happening across your intelligence workspace."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, change, icon: iconComponent }) => {
          const IconComponent = iconComponent;
          return (
            <Card key={label}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><IconComponent className="h-4 w-4" /></div>
                  <span className="text-xs font-semibold text-emerald-600">{change}</span>
                </div>
                <p className="mt-4 text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label} · last 30 days</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent>
            <div className="mb-5">
              <h2 className="font-bold">Research activity</h2>
              <p className="text-xs text-slate-500">Daily AI queries over the last 30 days</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recent}>
                  <defs><linearGradient id="dashboard-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#356df3" stopOpacity={0.3} /><stop offset="95%" stopColor="#356df3" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="date" tick={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="queries" stroke="#356df3" strokeWidth={2} fill="url(#dashboard-fill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="font-bold">Recent activity</h2>
            <div className="mt-4 divide-y">
              {activity.map(({ title, detail, time, icon: iconComponent }) => {
                const IconComponent = iconComponent;
                return (
                  <div className="flex gap-3 py-4" key={detail}>
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100"><IconComponent className="h-3.5 w-3.5 text-slate-600" /></div>
                    <div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="truncate text-xs text-slate-500">{detail}</p></div>
                    <span className="ml-auto whitespace-nowrap text-[11px] text-slate-400">{time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5">
        <h2 className="mb-3 font-bold">Quick actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {brand.console.quickPrompts.map((prompt) => (
            <Link key={prompt} to={`/app/assistant?prompt=${encodeURIComponent(prompt)}`} className="rounded-xl border bg-white p-4 text-sm font-medium shadow-sm transition hover:border-brand-300 hover:text-brand-700">
              {prompt}<ArrowUpRight className="mt-3 h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
