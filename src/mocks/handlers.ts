import { delay, http, HttpResponse } from "msw";
import { documents, initialConnectors, initialKeys, initialWebhooks, usage } from "./data";

let keys = initialKeys.map((key) => ({ ...key }));
let connectors = initialConnectors.map((connector) => ({ ...connector }));
let webhooks = initialWebhooks.map((webhook) => ({ ...webhook }));

export function resetMockData() {
  keys = initialKeys.map((key) => ({ ...key }));
  connectors = initialConnectors.map((connector) => ({ ...connector }));
  webhooks = initialWebhooks.map((webhook) => ({ ...webhook }));
}

export const handlers = [
  http.get("/api/me", () =>
    HttpResponse.json({
      id: "usr_demo",
      name: "Maya Chen",
      email: "demo@corvex.example",
      company: "Northstar Capital",
      plan: "Team",
    }),
  ),
  http.get("/api/usage", () => HttpResponse.json(usage)),
  http.get("/api/documents", ({ request }) => {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") ?? "").toLowerCase();
    const sector = url.searchParams.get("sector") ?? "";
    const source = url.searchParams.get("source") ?? "";
    const range = url.searchParams.get("range") ?? "all";
    const filtered = documents.filter((document) => {
      const text = `${document.title} ${document.excerpt} ${document.company}`.toLowerCase();
      const recentEnough =
        range === "all" ||
        new Date(document.date).getTime() >=
          new Date("2024-12-31").getTime() - Number(range) * 86_400_000;
      return (
        (!query || text.includes(query)) &&
        (!sector || document.sector === sector) &&
        (!source || document.source === source) &&
        recentEnough
      );
    });
    return HttpResponse.json(filtered);
  }),
  http.get("/api/documents/:id", ({ params }) => {
    const document = documents.find((item) => item.id === params.id);
    return document
      ? HttpResponse.json(document)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.post("/api/agent/query", async ({ request }) => {
    const { query } = (await request.json()) as { query: string };
    await delay(120);
    return HttpResponse.json({
      answer: `Across the available research, ${query.toLowerCase()} is being shaped by disciplined investment and durable enterprise demand. Management teams are prioritizing measurable returns, while maintaining strategic spending in AI infrastructure. Near-term buying cycles remain selective, but the underlying pipeline is constructive.`,
      citations: documents.slice(0, 3).map(({ id, title }) => ({ id, title })),
    });
  }),
  http.get("/api/keys", () => HttpResponse.json(keys)),
  http.post("/api/keys", async ({ request }) => {
    const { name } = (await request.json()) as { name: string };
    const suffix = String(keys.length + 31).padStart(4, "0");
    const key = {
      id: `key-${Date.now()}`,
      name: name || "Untitled key",
      prefix: `cvx_live_${suffix}`,
      secret: `cvx_live_${suffix}_demo_secret_reveal_once`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "Never",
    };
    keys = [key, ...keys];
    return HttpResponse.json(key, { status: 201 });
  }),
  http.delete("/api/keys/:id", ({ params }) => {
    keys = keys.filter((key) => key.id !== params.id);
    return HttpResponse.json({ success: true });
  }),
  http.get("/api/connectors", () => HttpResponse.json(connectors)),
  http.post("/api/connectors", async ({ request }) => {
    const { id } = (await request.json()) as { id: string };
    connectors = connectors.map((connector) =>
      connector.id === id
        ? { ...connector, status: connector.status === "connected" ? "available" : "connected" }
        : connector,
    );
    return HttpResponse.json(connectors);
  }),
  http.get("/api/webhooks", () => HttpResponse.json(webhooks)),
  http.post("/api/webhooks", async ({ request }) => {
    const { url } = (await request.json()) as { url: string };
    webhooks = [
      ...webhooks,
      { id: `hook-${Date.now()}`, url, event: "document.created", active: true },
    ];
    return HttpResponse.json(webhooks);
  }),
];
