export interface Feature {
  icon: string;
  title: string;
  body: string;
}

export interface Step {
  n: string;
  title: string;
  body: string;
  bullets: string[];
}

export interface Persona {
  icon: string;
  role: string;
  title: string;
  asks: string[];
  proof: string;
}

export interface Quote {
  q: string;
  by: string;
  org: string;
  initials: string;
}

export interface Stat {
  n: string;
  l: string;
}

export interface Tier {
  name: string;
  tag: string;
  priceM: number | null;
  priceA: number | null;
  cta: string;
  ctaStyle: "ghost" | "accent";
  featured?: boolean;
  features: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Source {
  tag: string;
  title: string;
  icon: string;
}

export interface Answer {
  text: string;
  sources: Source[];
}

export interface Thread {
  who: string;
  q: string;
  t: string;
}

export interface ConnectorSource {
  name: string;
  count: number;
  status: string;
}
