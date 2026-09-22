import {
  Bot,
  ChartNoAxesCombined,
  Database,
  Radar,
  Search,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type PricingTier = {
  name: string;
  price: string;
  description: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

export type Module = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const brand = {
  company: "Corvex Intelligence",
  product: "Corvex Console",
  tagline: "One platform for market intelligence. Search, reason, decide.",
  description:
    "Unify trusted market data, primary research, and AI workflows in one decision-ready workspace.",
  legal: "Corvex Intelligence is a fictional company. This site is a portfolio demonstration.",
  theme: {
    primary: "#356df3",
    ink: "#0d1526",
    mint: "#56d6b1",
    surface: "#f7f9fc",
  },
  nav: [
    { label: "Platform", href: "/#platform" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/#security" },
  ],
  hero: {
    eyebrow: "Decision intelligence, reimagined",
    title: "From fragmented signals to confident strategy.",
    primaryCta: "Start exploring",
    secondaryCta: "View pricing",
  },
  modules: [
    {
      title: "Generative Search",
      description: "Ask nuanced questions across private and public market sources.",
      icon: Search,
    },
    {
      title: "Deep Research",
      description: "Build source-backed briefs with transparent reasoning and citations.",
      icon: Radar,
    },
    {
      title: "Workflow Agents",
      description: "Automate recurring research, synthesis, and competitive monitoring.",
      icon: Workflow,
    },
    {
      title: "Financial Data",
      description: "Explore normalized fundamentals, estimates, and transaction signals.",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Monitoring",
      description: "Track companies, sectors, and themes with real-time intelligence feeds.",
      icon: Bot,
    },
    {
      title: "Connectors & API",
      description: "Bring intelligence into the tools and models your team already uses.",
      icon: Database,
    },
  ] satisfies Module[],
  customers: ["NORTHSTAR", "MERIDIAN", "ALTURA", "BRIGHTON", "QUORUM", "FIELDSTONE"],
  testimonial: {
    quote:
      "Corvex condensed a week of market mapping into a morning—and gave our investment committee the source trail to trust every conclusion.",
    author: "Elena Park",
    role: "VP Strategy, Northstar Capital",
  },
  pricing: [
    {
      name: "Starter",
      price: "$49",
      description: "For individual analysts moving faster.",
      cta: "Start free",
      features: ["1 seat", "250 AI queries / month", "Core market sources", "CSV export"],
    },
    {
      name: "Team",
      price: "$149",
      description: "For research teams building shared conviction.",
      cta: "Start team trial",
      featured: true,
      features: [
        "Up to 10 seats",
        "2,500 AI queries / month",
        "Private data connectors",
        "Workflow agents",
        "API access",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations operationalizing intelligence.",
      cta: "Contact sales",
      features: [
        "Unlimited seats",
        "Custom usage",
        "SSO & SCIM",
        "Dedicated environment",
        "Priority support",
      ],
    },
  ] satisfies PricingTier[],
  auth: {
    loginTitle: "Welcome back",
    signupTitle: "Create your workspace",
    demoLabel: "Continue with demo account",
  },
  console: {
    greeting: "Good morning",
    quickPrompts: [
      "Compare semiconductor capex guidance this quarter",
      "What is changing in enterprise AI budgets?",
      "Summarize recent renewable energy M&A",
    ],
  },
} as const;
