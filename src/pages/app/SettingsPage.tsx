import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { Building2, CreditCard, Palette, User } from "lucide-react";
import { useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/config/brand";
import { api } from "@/lib/api";
import { useThemeStore } from "@/store/theme";

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "organization", label: "Organization", icon: Building2 },
  { value: "plan", label: "Plan & billing", icon: CreditCard },
  { value: "appearance", label: "Appearance", icon: Palette },
];

export function SettingsPage() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: api.me });
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const plan = brand.pricing.find((tier) => tier.name === user?.plan) ?? brand.pricing[1];
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div data-testid="settings-page">
      <PageHeader title="Settings" description="Manage your profile, workspace, plan, and interface." />
      <Tabs.Root defaultValue="profile" className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <Tabs.List className="flex gap-2 overflow-x-auto rounded-xl border bg-white p-2 lg:flex-col">
          {tabs.map(({ value, label, icon: iconComponent }) => {
            const IconComponent = iconComponent;
            return <Tabs.Trigger key={value} value={value} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 data-[state=active]:bg-brand-50 data-[state=active]:text-brand-700"><IconComponent className="h-4 w-4" />{label}</Tabs.Trigger>;
          })}
        </Tabs.List>
        <div>
          <Tabs.Content value="profile"><SettingsCard title="Profile information" description="Update your personal information and email."><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Full name<Input className="mt-1.5" defaultValue={user?.name ?? ""} /></label><label className="text-sm font-medium">Email<Input className="mt-1.5" type="email" defaultValue={user?.email ?? ""} /></label><label className="text-sm font-medium">Job title<Input className="mt-1.5" defaultValue="VP, Strategy" /></label><label className="text-sm font-medium">Timezone<Input className="mt-1.5" defaultValue="America/New_York" /></label></div><Button className="mt-6">Save changes</Button></SettingsCard></Tabs.Content>
          <Tabs.Content value="organization"><SettingsCard title="Organization" description="Manage your workspace identity and membership."><label className="block text-sm font-medium">Organization name<Input className="mt-1.5 max-w-md" defaultValue={user?.company ?? ""} /></label><div className="mt-6 rounded-lg border p-4"><p className="text-sm font-semibold">Workspace ID</p><code className="mt-1 block text-xs text-slate-500">org_northstar_demo_1248</code></div><Button className="mt-6">Save organization</Button></SettingsCard></Tabs.Content>
          <Tabs.Content value="plan"><SettingsCard title="Plan & billing" description="Review your current subscription and usage limits."><div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 p-5"><div><div className="flex items-center gap-2"><h3 className="font-bold">{plan.name} plan</h3><Badge>Active</Badge></div><p className="mt-1 text-sm text-slate-500">{plan.price}{plan.cadence ? ` ${plan.cadence}` : ""} · 8 seats</p></div><Button variant="outline">Manage billing</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["AI queries", "1,481 / 2,500"], ["Seats", "8 / 10"], ["Private sources", "12 / 25"]].map(([label, value]) => <div key={label} className="rounded-lg border p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 font-bold">{value}</p></div>)}</div></SettingsCard></Tabs.Content>
          <Tabs.Content value="appearance"><SettingsCard title="Appearance" description="Customize how Corvex Console looks for you."><div className="flex items-center justify-between rounded-lg border p-4"><div><p className="text-sm font-semibold">Dark interface</p><p className="text-xs text-slate-500">Use a darker content theme where supported.</p></div><Switch.Root checked={dark} onCheckedChange={setDark} data-testid="theme-toggle" className="relative h-6 w-11 rounded-full bg-slate-300 data-[state=checked]:bg-brand-600"><Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition data-[state=checked]:translate-x-[22px]" /></Switch.Root></div></SettingsCard></Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Card><CardContent><h2 className="font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p><div className="mt-6">{children}</div></CardContent></Card>;
}
