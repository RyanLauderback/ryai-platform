import * as Switch from "@radix-ui/react-switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, KeyRound, Link2, Plus, Trash2, Webhook } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { ApiKey, Connector } from "@/types";

const snippets = {
  curl: `curl https://api.corvex.example/v1/search \\\n  -H "Authorization: Bearer $CORVEX_API_KEY" \\\n  -d '{"query":"enterprise AI spending"}'`,
  Python: `from corvex import Corvex\n\nclient = Corvex(api_key=os.environ["CORVEX_API_KEY"])\nresults = client.search("enterprise AI spending")`,
  TypeScript: `import { Corvex } from "@corvex/sdk";\n\nconst client = new Corvex({ apiKey: process.env.CORVEX_API_KEY });\nconst results = await client.search("enterprise AI spending");`,
};

export function IntegrationsPage() {
  const client = useQueryClient();
  const { data: keys = [] } = useQuery({ queryKey: ["keys"], queryFn: api.keys });
  const { data: connectors = [] } = useQuery({ queryKey: ["connectors"], queryFn: api.connectors });
  const { data: webhooks = [] } = useQuery({ queryKey: ["webhooks"], queryFn: api.webhooks });
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [snippet, setSnippet] = useState<keyof typeof snippets>("curl");
  const [webhookUrl, setWebhookUrl] = useState("");

  const create = useMutation({
    mutationFn: api.createKey,
    onSuccess: (key) => {
      client.setQueryData<ApiKey[]>(["keys"], (current = []) => [key, ...current]);
      setCreateOpen(false);
      setName("");
      setSecret(key.secret ?? "");
    },
  });
  const revoke = useMutation({
    mutationFn: api.revokeKey,
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: ["keys"] });
      const previous = client.getQueryData<ApiKey[]>(["keys"]);
      client.setQueryData<ApiKey[]>(["keys"], (current = []) => current.filter((key) => key.id !== id));
      return { previous };
    },
    onError: (_error, _id, context) => client.setQueryData(["keys"], context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: ["keys"] }),
  });
  const toggle = useMutation({
    mutationFn: api.toggleConnector,
    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: ["connectors"] });
      const previous = client.getQueryData<Connector[]>(["connectors"]);
      client.setQueryData<Connector[]>(["connectors"], (current = []) =>
        current.map((connector) =>
          connector.id === id
            ? { ...connector, status: connector.status === "connected" ? "available" : "connected" }
            : connector,
        ),
      );
      return { previous };
    },
    onError: (_error, _id, context) => client.setQueryData(["connectors"], context?.previous),
    onSuccess: (data) => client.setQueryData(["connectors"], data),
  });
  const addWebhook = useMutation({
    mutationFn: api.createWebhook,
    onSuccess: (data) => {
      client.setQueryData(["webhooks"], data);
      setWebhookUrl("");
    },
  });

  return (
    <div data-testid="integrations-page">
      <PageHeader title="Integrations & API" description="Connect Corvex to your data stack and operational workflows." actions={<Button onClick={() => setCreateOpen(true)} data-testid="create-key-open"><Plus className="h-4 w-4" />Create API key</Button>} />
      <Card>
        <CardContent>
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><KeyRound className="h-5 w-5" /></div><div><h2 className="font-bold">API keys</h2><p className="text-xs text-slate-500">Authenticate server-side applications. Secrets are shown once.</p></div></div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-y bg-slate-50 text-xs text-slate-500"><tr><th className="px-3 py-3">Name</th><th>Key</th><th>Created</th><th>Last used</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y" data-testid="key-table">
                {keys.map((key) => <tr key={key.id}><td className="px-3 py-4 font-medium">{key.name}</td><td className="font-mono text-xs">{key.prefix}••••</td><td className="text-xs text-slate-500">{key.createdAt}</td><td className="text-xs text-slate-500">{key.lastUsed}</td><td className="text-right"><Button variant="danger" size="icon" aria-label={`Revoke ${key.name}`} data-testid={`revoke-${key.id}`} onClick={() => revoke.mutate(key.id)}><Trash2 className="h-4 w-4" /></Button></td></tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card><CardContent>
          <h2 className="font-bold">Model Context Protocol</h2><p className="mt-1 text-xs text-slate-500">Expose a secure Corvex research server to compatible AI clients.</p>
          <div className="mt-5 flex items-center justify-between rounded-lg border p-4"><div><p className="text-sm font-semibold">Corvex MCP server</p><p className="font-mono text-[11px] text-slate-400">https://mcp.corvex.example/sse</p></div><Switch.Root data-testid="mcp-toggle" defaultChecked className="relative h-6 w-11 rounded-full bg-slate-300 data-[state=checked]:bg-brand-600"><Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition data-[state=checked]:translate-x-[22px]" /></Switch.Root></div>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-xs leading-6 text-slate-300">{`{\n  "mcpServers": {\n    "corvex": { "url": "https://mcp.corvex.example/sse" }\n  }\n}`}</pre>
        </CardContent></Card>
        <Card><CardContent>
          <h2 className="font-bold">Quick start</h2>
          <div className="mt-4 flex gap-2">{Object.keys(snippets).map((tab) => <Button key={tab} size="sm" variant={snippet === tab ? "default" : "outline"} onClick={() => setSnippet(tab as keyof typeof snippets)}>{tab}</Button>)}</div>
          <pre className="mt-4 min-h-40 overflow-x-auto whitespace-pre-wrap rounded-lg bg-ink p-4 text-xs leading-6 text-slate-300">{snippets[snippet]}</pre>
        </CardContent></Card>
      </div>

      <h2 className="mb-3 mt-7 font-bold">Connected apps</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {connectors.map((connector) => (
          <Card key={connector.id}><CardContent><div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 font-bold text-slate-600">{connector.name[0]}</div><h3 className="mt-4 font-bold">{connector.name}</h3><p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{connector.description}</p><Button className="mt-4 w-full" size="sm" variant={connector.status === "connected" ? "outline" : "default"} onClick={() => toggle.mutate(connector.id)}>{connector.status === "connected" ? <><Check className="h-3 w-3" />Connected</> : <><Link2 className="h-3 w-3" />Connect</>}</Button></CardContent></Card>
        ))}
      </div>

      <Card className="mt-5"><CardContent>
        <div className="flex items-center gap-3"><Webhook className="h-5 w-5 text-brand-600" /><div><h2 className="font-bold">Webhooks</h2><p className="text-xs text-slate-500">Notify your systems when research events occur.</p></div></div>
        <div className="mt-4 flex gap-2"><Input placeholder="https://your-app.example/webhook" value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} /><Button disabled={!webhookUrl.trim()} onClick={() => addWebhook.mutate(webhookUrl)}>Add webhook</Button></div>
        <div className="mt-4 space-y-2">{webhooks.map((hook) => <div key={hook.id} className="flex items-center justify-between rounded-lg border p-3 text-xs"><span className="truncate font-mono">{hook.url}</span><Badge className="ml-3">{hook.event}</Badge></div>)}</div>
      </CardContent></Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen} title="Create API key"><label className="text-sm font-medium">Key name<Input className="mt-2" placeholder="e.g. Production app" value={name} onChange={(event) => setName(event.target.value)} data-testid="key-name" /></label><p className="mt-2 text-xs text-slate-500">Use a name that identifies where this key will be stored.</p><Button className="mt-5 w-full" onClick={() => create.mutate(name)} disabled={!name.trim()} data-testid="create-key-submit">Create key</Button></Dialog>
      <Dialog open={Boolean(secret)} onOpenChange={(open) => !open && setSecret("")} title="Copy your secret key"><div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">This secret will only be displayed once. Store it somewhere secure.</div><div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 p-3"><code className="min-w-0 flex-1 truncate text-xs" data-testid="key-secret">{secret}</code><Button size="icon" variant="ghost" aria-label="Copy secret" onClick={() => void navigator.clipboard?.writeText(secret)}><Copy className="h-4 w-4" /></Button></div><Button className="mt-5 w-full" onClick={() => setSecret("")}>I have saved my key</Button></Dialog>
    </div>
  );
}
