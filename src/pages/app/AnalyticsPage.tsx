import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { aggregateUsage, bucketWeekly } from "@/lib/analytics";
import { formatNumber } from "@/lib/utils";

const users = [
  { name: "Maya Chen", role: "Admin", queries: 418, documents: 142, lastActive: "Now" },
  { name: "James Okafor", role: "Analyst", queries: 361, documents: 119, lastActive: "8 min ago" },
  { name: "Sofia Rossi", role: "Researcher", queries: 286, documents: 98, lastActive: "1 hr ago" },
  { name: "Theo Martin", role: "Analyst", queries: 174, documents: 62, lastActive: "Yesterday" },
  { name: "Nina Gupta", role: "Viewer", queries: 85, documents: 48, lastActive: "2 days ago" },
];

export function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data = [] } = useQuery({ queryKey: ["usage"], queryFn: api.usage });
  const totals = useMemo(() => aggregateUsage(data, days), [data, days]);
  const weekly = useMemo(() => bucketWeekly(totals.selected), [totals.selected]);
  const donut = [
    { name: "Generative search", value: Math.round(totals.queries * 0.46), color: "#356df3" },
    { name: "Assistant", value: Math.round(totals.queries * 0.31), color: "#56d6b1" },
    { name: "Agents", value: Math.round(totals.queries * 0.23), color: "#8b5cf6" },
  ];

  return (
    <div data-testid="analytics-page">
      <PageHeader
        title="Usage analytics"
        description="Understand adoption, research volume, and workspace engagement."
        actions={
          <select aria-label="Analytics date range" data-testid="analytics-range" value={days} onChange={(event) => setDays(Number(event.target.value))} className="h-10 rounded-lg border bg-white px-3 text-sm">
            <option value={30}>Last 30 days</option><option value={60}>Last 60 days</option><option value={90}>Last 90 days</option>
          </select>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Queries", totals.queries], ["Documents", totals.documents], ["Tokens", totals.tokens], ["Avg. active users", totals.averageUsers]].map(([label, value]) => (
          <Card key={label}><CardContent><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{formatNumber(Number(value))}</p><p className="mt-2 text-xs text-emerald-600">↑ vs previous period</p></CardContent></Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Query volume" description="Daily research queries">
          <LineChart data={totals.selected}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} /><YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="queries" stroke="#356df3" strokeWidth={2} dot={false} /></LineChart>
        </ChartCard>
        <ChartCard title="Documents accessed" description="Weekly source engagement">
          <BarChart data={weekly}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} /><YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="documents" fill="#56d6b1" radius={[4, 4, 0, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title="Token consumption" description="Daily model processing volume">
          <AreaChart data={totals.selected}><defs><linearGradient id="tokens-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity=".35" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity=".02" /></linearGradient></defs><XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} /><YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip /><Area type="monotone" dataKey="tokens" stroke="#8b5cf6" fill="url(#tokens-fill)" /></AreaChart>
        </ChartCard>
        <Card><CardContent><h2 className="font-bold">Queries by product</h2><p className="text-xs text-slate-500">Share of workspace activity</p><div className="mt-2 grid grid-cols-[1fr_130px] items-center"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip /><Pie data={donut} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>{donut.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-3">{donut.map((entry) => <div key={entry.name} className="text-xs"><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: entry.color }} />{entry.name}</div>)}</div></div></CardContent></Card>
      </div>
      <Card className="mt-5"><CardContent><h2 className="font-bold">User activity</h2><p className="text-xs text-slate-500">Engagement across your workspace</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y bg-slate-50 text-xs text-slate-500"><tr><th className="px-3 py-3">User</th><th>Role</th><th>Queries</th><th>Documents</th><th>Last active</th></tr></thead><tbody className="divide-y">{users.map((user) => <tr key={user.name}><td className="px-3 py-4 font-medium">{user.name}</td><td className="text-slate-500">{user.role}</td><td>{user.queries}</td><td>{user.documents}</td><td className="text-slate-500">{user.lastActive}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactElement }) {
  return <Card><CardContent><h2 className="font-bold">{title}</h2><p className="text-xs text-slate-500">{description}</p><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></CardContent></Card>;
}
