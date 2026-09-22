import type {
  AgentResponse,
  ApiKey,
  Connector,
  Document,
  UsageDay,
  User,
  Webhook,
} from "@/types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  me: () => request<User>("/api/me"),
  usage: () => request<UsageDay[]>("/api/usage"),
  documents: (params = "") => request<Document[]>(`/api/documents${params}`),
  document: (id: string) => request<Document>(`/api/documents/${id}`),
  queryAgent: (query: string) =>
    request<AgentResponse>("/api/agent/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
  keys: () => request<ApiKey[]>("/api/keys"),
  createKey: (name: string) =>
    request<ApiKey>("/api/keys", { method: "POST", body: JSON.stringify({ name }) }),
  revokeKey: (id: string) => request<{ success: boolean }>(`/api/keys/${id}`, { method: "DELETE" }),
  connectors: () => request<Connector[]>("/api/connectors"),
  toggleConnector: (id: string) =>
    request<Connector[]>("/api/connectors", { method: "POST", body: JSON.stringify({ id }) }),
  webhooks: () => request<Webhook[]>("/api/webhooks"),
  createWebhook: (url: string) =>
    request<Webhook[]>("/api/webhooks", { method: "POST", body: JSON.stringify({ url }) }),
};
