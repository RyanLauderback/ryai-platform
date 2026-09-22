export type User = { id: string; name: string; email: string; company: string; plan: string };

export type Document = {
  id: string;
  title: string;
  company: string;
  sector: string;
  source: string;
  date: string;
  excerpt: string;
  body: string;
  tags: string[];
};

export type UsageDay = {
  date: string;
  queries: number;
  documents: number;
  tokens: number;
  activeUsers: number;
};

export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  secret?: string;
};

export type Connector = {
  id: string;
  name: string;
  description: string;
  status: "connected" | "available";
  category: string;
};

export type Webhook = { id: string; url: string; event: string; active: boolean };

export type AgentResponse = {
  answer: string;
  citations: { id: string; title: string }[];
};
