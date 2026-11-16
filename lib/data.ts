// ── Data types ────────────────────────────────────────────────────────────────

export interface AnswerSource {
  tag: string
  title: string
  icon: string
}

export interface AnswerItem {
  text: string
  sources: AnswerSource[]
}

export interface FeatureItem {
  icon: string
  title: string
  body: string
}

export interface StepItem {
  n: string
  title: string
  body: string
  bullets: string[]
}

export interface PersonaItem {
  icon: string
  role: string
  title: string
  desc: string
  asks: string[]
  helps: string[]
}

export interface QuoteItem {
  q: string
  by: string
  org: string
  initials: string
}

export interface StatItem {
  n: string
  l: string
}

export interface TierItem {
  name: string
  tag: string
  priceM: number | null
  priceA: number | null
  cta: string
  ctaStyle: string
  featured?: boolean
  comingSoon?: boolean
  features: string[]
}

export interface FaqDataItem {
  q: string
  a: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface ShowcaseThread {
  who: string
  q: string
  t: string
}

export interface ShowcaseSource {
  name: string
  count: number
  status: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const SUGGESTIONS: string[] = [
  "What's our refund policy for enterprise customers?",
  "Summarize the Acme renewal — risks, asks, next step",
  "Who at Globex owns the security review?",
  "What did marketing decide about the Q3 launch date?",
]

export const ANSWERS: Record<string, AnswerItem> = {
  "What's our refund policy for enterprise customers?": {
    text: "Enterprise customers on annual contracts can request a pro-rated refund within 30 days of renewal. Refunds require sign-off from the account owner and are processed in 5–7 business days. Multi-year contracts are non-refundable after day 30 but can be paused for up to 90 days.",
    sources: [
      { tag: "Notion",  title: "Customer Success Playbook · Refunds", icon: "Notion"  },
      { tag: "Drive",   title: "FY26 Master Services Agreement.pdf",  icon: "Drive"   },
      { tag: "HubSpot", title: "Policy: Annual contract handling",    icon: "HubSpot" },
    ],
  },
  "Summarize the Acme renewal — risks, asks, next step": {
    text: "Acme's $480K renewal is on the table for May 22. Two risks surfaced on the last call: SSO must ship before signature, and procurement is asking for a 12% volume discount. Lena (their CTO) is the champion. Next step: send the SSO timeline + a tiered discount proposal by Friday.",
    sources: [
      { tag: "Salesforce", title: "Opportunity · Acme Corp Renewal FY26", icon: "Salesforce" },
      { tag: "Fathom",     title: "Call · Acme QBR · May 5",             icon: "Fathom"     },
      { tag: "Gmail",      title: "Re: discount tiers — procurement",     icon: "Gmail"      },
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
}

export const FEATURES: FeatureItem[] = [
  {
    icon: "cite",
    title: "Answers grounded only in your documents",
    body: "Unlike generic AI tools, Clarant never searches the web and never invents facts. Every answer comes only from uploaded files, transcripts, URLs, or pasted text inside your workspace.",
  },
  {
    icon: "link",
    title: "Paragraph-level citations on every answer",
    body: "Hover over any answer to see the exact paragraph and exact source file behind every response.Verify information instantly without digging through documents manually.",
  },

  {
    icon: "bolt",
    title: "AI-powered document search across everything",
    body: "Search thousands of files in seconds. Ask: what changed in the contract, which customers reported billing issues, what are the risks mentioned in this agreement, etc. ",
  },
  {
    icon: "bolt",
    title: "Create workspaces, not document chaos",
    body: "Organize documents by team, client, project, or department. Sales sees deal docs. Legal sees contracts. Support sees customer knowledge. Everyone gets fast, trusted answers from the same retrieval engine. ",
  },
  {
    icon: "layers",
    title: " Enterprise AI Search with permissions",
    body: "Access stays secure inside each workspace. If a user doesn’t have access to a document, they won’t see answers from it. ",
  },
  {
    icon: "lock",
    title: "Private and secure by default",
    body: "Your data is never used to train shared AI models. Regional hosting, audit logs, and enterprise security available.",
  },
]

// Homepage "How Clarant Works?" steps — four steps, copy sourced verbatim from
// the reference design. bullets left empty: the reference steps are title + one
// line only (no sub-points to invent).
export const STEPS: StepItem[] = [
  {
    n: "01",
    title: "Connect",
    body: "Link the tools your team already uses.",
    bullets: [],
  },
  {
    n: "02",
    title: "Analyze",
    body: "Identify commitments, updates, and pending work across connected information.",
    bullets: [],
  },
  {
    n: "03",
    title: "Surface",
    body: "Get a personalized brief of priorities, with supporting evidence.",
    bullets: [],
  },
  {
    n: "04",
    title: "Act",
    body: "Let Clarant draft emails, schedule meetings, create tasks, or update CRM records based on your permissions.",
    bullets: [],
  },
]

export const PERSONAS: PersonaItem[] = [
  {
    icon: "shield",
    role: "Healthcare",
    title: "Healthcare teams find answers faster",
    desc: "Search policies, patient documents, compliance records, SOPs, and healthcare knowledge sources with cited answers that support faster, more confident decisions.",
    asks: [
      "Which policies apply to this process?",
      "What compliance requirements are mentioned?",
      "Summarize this patient-related document",
    ],
    helps: ["Policy search", "Compliance answers", "SOP lookup", "Document summaries"],
  },
  {
    icon: "users",
    role: "Sales",
    title: "Sales teams close with better context",
    desc: "Find renewal details, customer commitments, contract terms, meeting notes, CRM insights, and past conversations without switching between tools.",
    asks: [
      "Which contracts renew this quarter?",
      "What did the customer ask for last time?",
      "Draft a follow-up from the QBR notes",
    ],
    helps: ["Renewal tracking", "Contract terms", "CRM context", "Follow-up drafts"],
  },
  {
    icon: "zap",
    role: "Marketing",
    title: "Marketing teams understand performance faster",
    desc: "Analyze campaign reports, content performance, customer research, briefs, and marketing documents from one searchable AI workspace.",
    asks: [
      "Which campaign performed best this quarter?",
      "What content topics are driving engagement?",
      "Summarize this marketing report",
    ],
    helps: ["Campaign analysis", "Content insights", "Report summaries", "Customer research"],
  },
  {
    icon: "doc",
    role: "Legal Documents",
    title: "Legal teams review documents with confidence",
    desc: "Search contracts, agreements, policies, obligations, clauses, and compliance documents with citation-backed answers from the source.",
    asks: [
      "What are the termination terms?",
      "Which obligations are listed in this agreement?",
      "Find liability limits in this contract",
    ],
    helps: ["Clause search", "Risk detection", "Obligation tracking", "Source citations"],
  },
  {
    icon: "search",
    role: "Researcher",
    title: "Researchers accelerate literature reviews",
    desc: "Analyze papers, journals, reports, theses, and academic documents to uncover findings, compare methods, and verify citations faster.",
    asks: [
      "What are the main findings across these papers?",
      "Which studies mention this method?",
      "Compare conclusions across these reports",
    ],
    helps: ["Paper summaries", "Citation checks", "Method comparison", "Literature review"],
  },
  {
    icon: "building",
    role: "Small & Medium Business",
    title: "Growing teams centralize business knowledge",
    desc: "Make documents, emails, processes, customer information, and internal knowledge searchable so teams can get answers quickly.",
    asks: [
      "Where is this process documented?",
      "What did we promise this customer?",
      "Summarize this internal policy",
    ],
    helps: ["Process lookup", "Customer history", "Internal policies", "Team knowledge"],
  },
]

export interface UseCaseCard {
  icon: string       // key in components/icons/Icons.tsx
  category: string   // badge label
  title: string
  desc: string
  href: string
  image?: string     // optional featured image (public/ path); falls back to a generated visual
}

// Homepage Use Cases grid. One card per shipped /use-cases/* page.
// desc = each page's own meta description (single source of truth — keep in sync
// with the page's layout.tsx metadata rather than inventing new copy here).
// Order = "published" order; the grid shows the first 6, then Load More.
// image = PNG/WebP thumbnail in /public/images/use-cases/. Drop the file in and
// the card renders it; until then the card falls back to a generated visual
// (see UseCases.tsx) so nothing looks broken.
export const USE_CASES: UseCaseCard[] = [
  { icon: "doc",      category: "Legal",       title: "AI for Legal Documents",         href: "/use-cases/ai-for-legal-documents",
    image: "/images/use-cases/AI-for-Legal-Documents.webp",
    desc: "Create, review, analyze, and automate legal documents with AI. Improve contract accuracy and accelerate legal workflows." },
  { icon: "search",   category: "Research",    title: "AI for Research",                href: "/use-cases/researcher",
    image: "/images/use-cases/AI-for-Research.webp",
    desc: "Analyze data, summarize findings, and uncover insights across academic, market, and business research with AI intelligence." },
  { icon: "send",     category: "Sales",       title: "AI for Sales",                   href: "/use-cases/sales",
    image: "/images/use-cases/AI-for-Sales.webp",
    desc: "Automate prospect research, outreach, CRM updates, and follow-ups while improving engagement and revenue growth." },
  { icon: "zap",      category: "Marketing",   title: "AI for Marketing",               href: "/use-cases/marketing",
    image: "/images/use-cases/AI-for-Marketing.webp",
    desc: "Accelerate campaign planning and competitive analysis. Ask across briefs, reports, and brand guidelines for faster insights." },
  { icon: "shield",   category: "Healthcare",  title: "AI for Healthcare",              href: "/use-cases/healthcare",
    image: "/images/use-cases/AI-for-Healthcare.webp",
    desc: "Automate patient support, medical research, documentation, and administrative workflows with a healthcare AI assistant." },
  { icon: "building", category: "Business",    title: "AI for Small & Medium Business", href: "/use-cases/small-and-medium-business",
    image: "/images/use-cases/AI-for-Small-Medium-Business.webp",
    desc: "Automate tasks, improve customer support, and increase productivity so growing teams find answers fast." },
  { icon: "users",    category: "HR",          title: "AI for HR Documents",            href: "/use-cases/hr-documents",
    image: "/images/use-cases/hr.webp",
    desc: "Instantly find employee information, policies, onboarding files, and HR records with secure AI document search." },
  { icon: "globe",    category: "Real Estate", title: "AI for Real Estate",             href: "/use-cases/real-estate",
    image: "/images/use-cases/real-estate.webp",
    desc: "Streamline property management, contracts, and leasing with AI-powered document search and knowledge management." },
  { icon: "layers",   category: "Insurance",   title: "AI for Insurance",               href: "/use-cases/insurance",
    image: "/images/use-cases/insurance.webp",
    desc: "Search policies, claims, customer files, and underwriting documents to improve workflows, compliance, and service." },
  { icon: "lock",     category: "Finance",     title: "AI for Banking",                 href: "/use-cases/banking-financial-document-analysis",
    image: "/images/use-cases/banking.webp",
    desc: "Analyze banking and financial documents faster with AI-powered search, summaries, and citation-backed insights." },
  { icon: "bolt",     category: "Operations",  title: "AI for Business Operations",     href: "/use-cases/business-operations-strategy-management",
    image: "/images/use-cases/operations.webp",
    desc: "Find insights, automate workflows, and make faster decisions across operations and strategy management." },
]

export const QUOTES: QuoteItem[] = [
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
]

export const STATS: StatItem[] = [
  { n: "1,200+", l: "Teams using Clarant" },
  { n: "98%",    l: "Answer accuracy in pilots" },
  { n: "<1s",    l: "Median first-token latency" },
  { n: "30+",    l: "Native connectors" },
]

export const TIERS: TierItem[] = [
  {
    name: "Starter",
    tag: "Get started for free",
    priceM: 0,
    priceA: 0,
    cta: "Get Started",
    ctaStyle: "ghost",
    features: [
        "Total Storage: 1 GB storage",
      "File Upload Limit: 20 MB",
      "Document Types: PDF",
      "Workspaces: 1",
     
      "Docs/Workspace: 10",
          "Connected Apps: 1",
      "Q&A: 20 / day",
  
    ],
  },
  {
    name: "Pro",
    tag: "Most popular",
    priceM: 24,
    priceA: 20,
    cta: "Get Started",
    ctaStyle: "accent",
    featured: true,
    features: [
      "Total Storage: 10 GB",
      "File Upload Limit: 100 MB",
      "Document Types: PDF, DOCX, MD, PPTX, TXT, EPUB, MP3, WAV, M4A, FLAC, OGG, MP4, AVI, MOV, MKV",
      "Workspaces: 50",
      
      "Docs/Workspace: 100",
       "Connected Apps: 5",
      "Q&A: 200 / day",
     
    ],
  },
  {
    name: "Pro Plus",
    tag: "Everything you need on Pro Plus",
    priceM: 30,
    priceA: 25,
    cta: "Get Started",
    ctaStyle: "ghost",
    features: [
       "Total Storage: 100 GB",
      "File Upload Limit: 300 MB",
      "Document Types: PDF, DOCX, MD, PPTX, TXT, EPUB, MP3, WAV, M4A, FLAC, OGG, MP4, AVI, MOV, MKV",
      "Workspaces: 200",
     
      "Docs/Workspace: 200",
       "Connected Apps: Unlimited",
      "Q&A: 500 / day",
     
    ],
  },
  {
    name: "Team",
    tag: "Team Functionality Launched",
    priceM: 30,
    priceA: 25,
    cta: "Choose Team",
    ctaStyle: "ghost",
    
    features: [
       "Total Storage: 100 GB",
      "File Upload Limit: 300 MB",
      "Document Types: PDF, DOCX, MD, PPTX, TXT, EPUB, MP3, WAV, M4A, FLAC, OGG, MP4, AVI, MOV, MKV",
      "Workspaces: 200",
     
      "Docs/Workspace: 200",
       "Connected Apps: 10",
         "Team Functionality",
      "Document Generation",
      "Q&A: 500 / day",
    
     
    ],
  },
]

export const FAQS: FaqDataItem[] = [
  {
    q: "How does clarant keep my data secure?",
    a: "Clarant inherits the access controls of every connector — if you can't see a doc in Drive, neither can the answer. We're audited, support SAML SSO, regional data residency (US, EU, AU), and full audit logging. Your data is never used to train shared models.",
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
]

export const CONNECTOR_LIST: string[] = [
  "Gmail","Outlook","Salesforce","HubSpot","Notion","Drive",
  "Slack","Fathom","Fireflies","Confluence","Jira","Linear","Zendesk","Asana",
]

// Footer links. Internal destinations use absolute, root-relative paths ("/...")
// so they resolve correctly from ANY route (e.g. /blog, /use-cases/*) rather
// than as relative/hash links. Homepage sections use "/#<section-id>" so they
// navigate home first, then scroll. Anchor ids must match the live sections:
// Features=#features, How it works=#product, Pricing=#pricing.
export const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Product: [
    { label: "Features",     href: "/#features" },
    { label: "How it works", href: "/#product"  },
    { label: "Pricing",      href: "/#pricing"  },
    { label: "Changelog",    href: "/#unified-search"  },
  ],
  "Use cases": [
    { label: "AI for Legal Documents", href: "/use-cases/ai-for-legal-documents" },
    { label: "Researcher",             href: "/use-cases/researcher" },
    { label: "Sales",                  href: "/use-cases/sales" },
    { label: "Marketing",              href: "/use-cases/marketing" },
    { label: "Healthcare",             href: "/use-cases/healthcare" },
     { label: "Small & Medium Businesses",             href: "/use-cases/small-and-medium-business" },
    { label: "HR Documents",           href: "/use-cases/hr-documents" },
    { label: "Real Estate",            href: "/use-cases/real-estate" },
    { label: "Insurance",              href: "/use-cases/insurance" },
    { label: "Banking",              href: "/use-cases/banking-financial-document-analysis" },
    { label: "Business Operations",              href: "/use-cases/business-operations-strategy-management" },
  ],
  Company: [
    // External app link (full navigation is intentional here).
    { label: "About",    href: "https://app.clarant.ai/login" },
   
    { label: "Blog",     href: "/blog" },
    { label: "Docs",     href: "/docs" },
    { label: "Security", href: "/security" },
  ],
}

export const SHOWCASE_THREADS: ShowcaseThread[] = [
  { who: "Maya · Sales",    q: "Compare Globex and Initech security postures",         t: "12m"  },
  { who: "Noor · Support",  q: "Top 5 reasons customers churned in Q1",                t: "2h"   },
  { who: "Diego · Ops",     q: "What did legal say about the new MSA clause?",         t: "yesterday" },
  { who: "Priya · CS",      q: "Renewal forecast for July — confidence by deal",       t: "yesterday" },
  { who: "Sam · Product",   q: "Which features are top-requested in Fathom calls?",    t: "2d"   },
]

export const SHOWCASE_SOURCES: ShowcaseSource[] = [
  { name: "Salesforce", count: 4218,  status: "Synced 2m ago"  },
  { name: "Notion",     count: 9410,  status: "Synced 4m ago"  },
  { name: "Gmail",      count: 28412, status: "Live"           },
  { name: "Drive",      count: 6720,  status: "Synced 8m ago"  },
  { name: "Fathom",     count: 312,   status: "Live"           },
  { name: "HubSpot",    count: 1880,  status: "Synced 11m ago" },
]
