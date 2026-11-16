import type {
  Feature,
  Step,
  Persona,
  Quote,
  Stat,
  Tier,
  FaqItem,
  Answer,
} from "./types";

export const SUGGESTIONS = [
  "What's our refund policy for enterprise customers?",
  "Summarize the Acme renewal — risks, asks, next step",
  "Who at Globex owns the security review?",
  "What did marketing decide about the Q3 launch date?",
];

export const ANSWERS: Record<string, Answer> = {
  "What's our refund policy for enterprise customers?": {
    text: "Enterprise customers on annual contracts can request a pro-rated refund within 30 days of renewal. Refunds require sign-off from the account owner and are processed in 5–7 business days. Multi-year contracts are non-refundable after day 30 but can be paused for up to 90 days.",
    sources: [
      { tag: "Notion",  title: "Customer Success Playbook · Refunds",   icon: "Notion"  },
      { tag: "Drive",   title: "FY26 Master Services Agreement.pdf",      icon: "Drive"   },
      { tag: "HubSpot", title: "Policy: Annual contract handling",        icon: "HubSpot" },
    ],
  },
  "Summarize the Acme renewal — risks, asks, next step": {
    text: "Acme's $480K renewal is on the table for May 22. Two risks surfaced on the last call: SSO must ship before signature, and procurement is asking for a 12% volume discount. Lena (their CTO) is the champion. Next step: send the SSO timeline + a tiered discount proposal by Friday.",
    sources: [
      { tag: "Salesforce", title: "Opportunity · Acme Corp Renewal FY26", icon: "Salesforce" },
      { tag: "Fathom",     title: "Call · Acme QBR · May 5",              icon: "Fathom"     },
      { tag: "Gmail",      title: "Re: discount tiers — procurement",      icon: "Gmail"      },
    ],
  },
  "Who at Globex owns the security review?": {
    text: "At Globex, Priya Shah (Head of InfoSec) owns the security review. She's working with Marco Diaz on SOC 2 evidence. The current blocker is our pen-test report, which Priya needs by May 18 to keep the timeline.",
    sources: [
      { tag: "Outlook",   title: "Thread · Globex security checklist", icon: "Outlook"   },
      { tag: "Fireflies", title: "Call · Globex kickoff · Apr 28",     icon: "Fireflies" },
    ],
  },
  "What did marketing decide about the Q3 launch date?": {
    text: "Marketing locked the Q3 launch for August 14. The decision was made on the May 6 GTM sync — pushed two weeks later than the original draft so the comms team can ship the new positioning deck and the customer story video alongside.",
    sources: [
      { tag: "Notion", title: "GTM Sync · May 6 notes",      icon: "Notion" },
      { tag: "Slack",  title: "#launch-q3 · pinned message", icon: "Slack"  },
    ],
  },
};

export const FEATURES: Feature[] = [
  {
    icon: "cite",
    title: "Every answer cited",
    body: "Hover any line to see the exact passage from the exact document. No hallucinated facts, ever — and your team can verify in one click.",
  },
  {
    icon: "link",
    title: "Connect what you already use",
    body: "Native connectors for Gmail, Outlook, Drive, Salesforce, Notion, HubSpot, Slack, Fathom, Fireflies and more. New tools sync in minutes.",
  },
 
  {
    icon: "bolt",
    title: "Workspaces, not silos",
    body: "Group documents, accounts and teammates by workspace. Sales sees pipeline. Support sees tickets. Everyone gets the same retrieval engine.",
  },
  {
    icon: "layers",
    title: "Long-context + retrieval",
    body: "Hybrid search ranks across your full corpus, then a long-context model reads the top passages end-to-end. The result: answers that cite five sources, not one.",
  },
  {
    icon: "lock",
    title: "Private by default",
    body: "Your data is never used to train shared models. Bring your own keys, choose your region, or self-host the retrieval layer if you need to.",
  },
];

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Connect your stack",
    body: "Click an integration, sign in once. Clarant indexes your docs, mail, CRM and meeting transcripts in the background. No data ever leaves a region.",
    bullets: ["30+ native connectors", "5-minute setup", "Permissions inherited"],
  },
  {
    n: "02",
    title: "Ask in plain English",
    body: "Open the Clarant from the web app, Slack, or your browser sidebar. Ask a question the way you'd ask a teammate — no special syntax, no keywords.",
    bullets: ["Web · Slack · Chrome", "Voice or text", "Multi-turn threads."],
  },
  {
    n: "03",
    title: "Get answers with sources",
    body: "Clarant scans every connected source, ranks the most relevant passages, and answers with citations you can verify. Save the thread, share it, or pipe it into a workflow.",
    bullets: ["Citations on every line", "Audit log per query", "Export to Notion, Drive"],
  },
];

export const PERSONAS: Persona[] = [
  {
    icon: "users",
    role: "Revenue",
    title: "Close more without context-switching",
    asks: [
      "Why is the Acme renewal slipping?",
      "Top objections from this quarter's losses",
      "Draft a follow-up to last week's QBR notes",
    ],
    proof: "Sales reps save ~40 min per deal on prep",
  },
  {
    icon: "message",
    role: "Customer Success",
    title: "Answer once, learn forever",
    asks: [
      "Has any customer reported this error before?",
      "What's our SLA for region EU-2?",
      "Summarize last month's escalations",
    ],
    proof: "Support teams cut ticket time by 60%",
  },
  {
    icon: "building",
    role: "Operations",
    title: "Institutional memory, on tap",
    asks: [
      "What did legal decide about the new MSA clause?",
      "Why did we pick Stripe over Adyen in 2023?",
      "Pull every doc tagged 'compliance' from Q1",
    ],
    proof: "Ops leads stop interrupting senior staff",
  },
];

export const QUOTES: Quote[] = [
  {
    q: "We replaced four search bars with one. Sales answers their own questions now — and they trust the answers because every line has a citation.",
    by: "Director of RevOps",
    org: "Fintech, 600 seats",
    initials: "JM",
  },
  {
    q: "Clarant pays for itself in the first week. We used to lose two days a month chasing context across Drive, Salesforce, and Slack. That's gone.",
    by: "Head of Customer Success",
    org: "B2B SaaS, 220 seats",
    initials: "SP",
  },
  {
    q: "The audit log alone is worth it. We can show legal exactly which documents informed every answer the team relied on.",
    by: "Chief of Staff",
    org: "Health-tech, 1,400 seats",
    initials: "RK",
  },
];

export const STATS: Stat[] = [
  { n: "1,200+", l: "Teams using Clarant" },
  { n: "98%",    l: "Answer accuracy in pilots" },
  { n: "<1s",    l: "Median first-token latency" },
  { n: "30+",    l: "Native connectors" },
];

export const TIERS: Tier[] = [
  {
    name: "Starter",
    tag: "For small teams",
    priceM: 19,
    priceA: 15,
    cta: "Start free",
    ctaStyle: "ghost",
    features: [
      "Up to 5 users",
      "5 connectors",
      "10K queries/month",
      "Standard support",
      "SSO via Google · Microsoft",
    ],
  },
  {
    name: "Pro",
    tag: "Most popular",
    priceM: 49,
    priceA: 39,
    cta: "Start 14-day trial",
    ctaStyle: "accent",
    featured: true,
    features: [
      "Unlimited users",
      "All 30+ connectors",
      "Unlimited queries",
      "Workspaces & roles",
      "SAML SSO, audit log",
      "Priority support",
    ],
  },
  {
    name: "Pro Plus",
    tag: "For 500+ seats",
    priceM: null,
    priceA: null,
    cta: "Talk to sales",
    ctaStyle: "ghost",
    features: [
      "Custom connectors & API",
      "Dedicated infra (region pinning)",
      "BYO model keys",
    
      "DLP & retention controls",
      "Solutions engineer",
    ],
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "How does clarant keep my data secure?",
    a: "Clarant inherits the access controls of every connector — if you can't see a doc in Drive, neither can the answer. We're  II audited, support SAML SSO, regional data residency (US, EU, AU), and full audit logging. Your data is never used to train shared models.",
  },
  {
    q: "What happens to documents when I disconnect a source?",
    a: "Indexed content is purged within minutes. We retain the audit log of past queries (per your retention policy) but the underlying source data is gone the moment the connector is removed.",
  },
  {
    q: "Which file types and connectors are supported?",
    a: "Out of the box: Gmail, Outlook, Google Drive, OneDrive, Notion, Confluence, Salesforce, HubSpot, Slack, Teams, Fathom, Fireflies, Linear, Jira, Asana, Zendesk, Intercom and more. Files: PDF, DOCX, PPTX, XLSX, CSV, MD, plain text. The API supports custom sources.",
  },
  {
    q: "How accurate are the answers?",
    a: "In customer pilots we see 98% answer accuracy on questions that have a verifiable answer in the corpus. Clarant cites sources on every line and refuses to answer when retrieval confidence is low — which is rarer in marketing copy than in real life, but still essential.",
  },
  {
    q: "Can I bring my own model keys?",
    a: "Yes — Team and Enterprise plans support BYO keys for OpenAI, Anthropic, Azure OpenAI and AWS Bedrock. Enterprise can pin to a specific region or run the retrieval layer self-hosted.",
  },
  {
    q: "Do you train on my data?",
    a: "No. Your data stays in your workspace and is never used to train shared models. Embeddings are stored encrypted at rest and tied to your tenant.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are answering real questions in under an hour. Connecting Gmail, Drive and Salesforce takes about 5 minutes; full sync runs in the background.",
  },
];

export const CONNECTORS = [
  "Gmail","Outlook","Salesforce","HubSpot","Notion","Drive",
  "Slack","Fathom","Fireflies","Confluence","Jira","Linear","Zendesk","Asana",
];
