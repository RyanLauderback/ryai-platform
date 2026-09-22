import type { ApiKey, Connector, Document, UsageDay, Webhook } from "@/types";

const companies = [
  ["Nvidia", "Semiconductors"],
  ["Microsoft", "Software"],
  ["Tesla", "Automotive"],
  ["JPMorgan Chase", "Financials"],
  ["NextEra Energy", "Energy"],
  ["Salesforce", "Software"],
  ["Snowflake", "Software"],
  ["Eli Lilly", "Healthcare"],
] as const;

const sourceTypes = ["Earnings call", "SEC filing", "Expert interview", "Industry report"] as const;

const themes = [
  "capital expenditure outlook",
  "enterprise demand signals",
  "pricing power and margins",
  "AI infrastructure investment",
  "supply chain normalization",
] as const;

export const documents: Document[] = Array.from({ length: 40 }, (_, index) => {
  const [company, sector] = companies[index % companies.length];
  const source = sourceTypes[index % sourceTypes.length];
  const theme = themes[index % themes.length];
  const month = String(12 - (index % 10)).padStart(2, "0");
  const day = String((index * 3) % 27 + 1).padStart(2, "0");
  return {
    id: `doc-${index + 1}`,
    title: `${company}: ${theme} update`,
    company,
    sector,
    source,
    date: `2024-${month}-${day}`,
    excerpt: `${company} executives discussed ${theme}, highlighting durable customer demand and a disciplined approach to investment.`,
    body: `${company} provided a detailed update on ${theme}. Management described customer conversations as constructive, while noting that purchase cycles remain measured. The company is prioritizing high-return programs and expects operating leverage to improve as newer initiatives scale.\n\nAnalysts focused on the pace of demand, competitive differentiation, and the durability of margin improvement. Management reiterated that investments will be matched to observable milestones rather than broad market forecasts.\n\nThe source indicates a balanced outlook: near-term comparisons remain demanding, but structural drivers are intact. Investors should monitor customer additions, backlog conversion, and incremental margins over the next two quarters.`,
    tags: [sector, theme.split(" ")[0], source],
  };
});

export const usage: UsageDay[] = Array.from({ length: 90 }, (_, index) => {
  const date = new Date(Date.UTC(2024, 9, 1 + index));
  const wave = Math.round(Math.sin(index / 6) * 10);
  return {
    date: date.toISOString().slice(0, 10),
    queries: 44 + wave + (index % 9),
    documents: 21 + Math.round(wave / 2) + (index % 5),
    tokens: 18500 + index * 142 + wave * 220,
    activeUsers: 8 + (index % 7),
  };
});

export const initialKeys: ApiKey[] = [
  { id: "key-1", name: "Production research", prefix: "cvx_live_91ad", createdAt: "2024-11-08", lastUsed: "2 min ago" },
  { id: "key-2", name: "Data pipeline", prefix: "cvx_live_44bf", createdAt: "2024-10-14", lastUsed: "Yesterday" },
  { id: "key-3", name: "Local development", prefix: "cvx_test_b112", createdAt: "2024-09-21", lastUsed: "6 days ago" },
  { id: "key-4", name: "Notebook", prefix: "cvx_test_f08e", createdAt: "2024-08-02", lastUsed: "Never" },
];

export const initialConnectors: Connector[] = [
  { id: "slack", name: "Slack", description: "Deliver alerts and research briefs.", status: "connected", category: "Collaboration" },
  { id: "snowflake", name: "Snowflake", description: "Query governed warehouse data.", status: "available", category: "Data warehouse" },
  { id: "salesforce", name: "Salesforce", description: "Enrich account and opportunity context.", status: "available", category: "CRM" },
  { id: "drive", name: "Google Drive", description: "Index decks, documents, and research.", status: "connected", category: "Documents" },
  { id: "s3", name: "Amazon S3", description: "Sync private document collections.", status: "available", category: "Storage" },
];

export const initialWebhooks: Webhook[] = [
  { id: "hook-1", url: "https://example.invalid/corvex", event: "research.completed", active: true },
];

export const conversations = [
  { id: "conversation-1", title: "Enterprise AI budgets", updated: "Today" },
  { id: "conversation-2", title: "Energy M&A landscape", updated: "Yesterday" },
  { id: "conversation-3", title: "Semiconductor capex", updated: "Dec 12" },
];
