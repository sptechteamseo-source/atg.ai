'use client'

import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import Image from 'next/image'
import { ArrowRight } from '@/components/icons/Icons'
import PageAnimations from '@/components/ui/PageAnimations'

function ImageSlot({ placeholder = 'Drop an image' }: { placeholder?: string }) {
  return (
    <div className="img-slot-frame">
      <div className="img-slot-ring" />
      <div className="img-slot-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span className="img-slot-cap">{placeholder}</span>
      </div>
    </div>
  )
}

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From marketing data to cited answers, automatically.',
    body: 'Upload or connect your marketing documents, reports, dashboards, CRM data, and knowledge sources. Our platform organizes information across systems and creates a searchable intelligence layer for your entire team.',
    bullets: [
      'Connects marketing reports, CRM platforms, and campaign data',
      'Searches across content, presentations, and performance reports',
      'Answers questions in plain English with citations',
      'Makes institutional marketing knowledge instantly accessible',
    ],
    placeholder: 'Campaign snapshot',
    img: '/images/From-marketing-data-to-cited-answers-automatically.png',
    imgAlt: 'AI for Marketing Teams — connects marketing reports, CRM and campaign data to give cited answers',
  },
  {
    kicker: 'Why businesses use it', n: '02',
    heading: 'Because marketing moves fast, and information is everywhere.',
    body: 'Marketing teams work across multiple tools, channels, reports, and stakeholders. Finding answers often means opening dozens of dashboards, spreadsheets, presentations, and documents. AI Tools for Marketing Teams help centralize knowledge and accelerate decision-making.',
    bullets: [
      'Campaign performance analysis',
      'Content performance reviews',
      'Marketing reporting',
      'Customer journey analysis',
      'Competitive research',
      'Lead generation optimization',
    ],
    placeholder: 'Campaign snapshot',
    img: '/images/Because-marketing-moves-fast-and-information-is-everywhere.png',
    imgAlt: 'AI for Marketing Teams — centralizes marketing knowledge across tools, channels and reports',
  },
  {
    kicker: 'What you get', n: '03',
    heading: 'Faster insights, smarter campaigns, and better decisions.',
    body: "Every answer is grounded in your organization's data and documents. Marketing teams gain a single place to search, analyze, and understand performance across campaigns and channels.",
    bullets: [
      'Citation-backed marketing answers',
      'Faster campaign analysis',
      'Centralized marketing knowledge',
      'Reduced manual reporting',
      'Better alignment across teams',
    ],
    placeholder: 'Cited answer',
    img: '/images/Faster-insights-smarter-campaigns-and-better-decisions.png',
    imgAlt: 'AI for Marketing Teams — grounded, cited answers across campaigns and channels',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your marketing systems', body: 'Upload reports or connect tools such as CRM platforms, campaign dashboards, content repositories, and marketing documents.' },
  { kicker: 'Step 2', n: '02', title: 'Ask questions in plain English', body: 'Ask questions like "Which campaign generated the most qualified leads?", "What content drove the highest engagement last quarter?" or "Which channel delivered the best ROI?"' },
  { kicker: 'Step 3', n: '03', title: 'Verify every answer', body: 'Every response includes citations to the original report, document, or source so your team can validate findings instantly.' },
  { kicker: 'Step 4', n: '04', title: 'Scale across the marketing organization', body: 'Enable demand generation, content, operations, leadership, and growth teams to access insights without waiting for reports.' },
]

const PROBLEMS = [
  { icon: '⚡', title: 'Faster reporting', body: 'Find campaign performance metrics instantly instead of building reports manually.' },
  { icon: '◈', title: 'Better campaign analysis', body: 'Identify trends, opportunities, and performance drivers across channels.' },
  { icon: '↻', title: 'Easier knowledge access', body: 'Search across reports, presentations, strategies, and documentation in one place.' },
  { icon: '◉', title: 'Marketing automation', body: 'Support smarter workflows using AI Marketing Automation Tools that surface insights automatically.' },
  { icon: '⌖', title: 'Improved decision-making', body: 'Use data-backed answers to optimize budgets, campaigns, and resources.' },
  { icon: '✓', title: 'Higher productivity', body: 'Reduce time spent searching for information and increase execution speed.' },
]

const FEATURES = [
  { icon: '⌖', title: 'Marketing intelligence', body: 'Search and analyze reports, campaign results, customer insights, and content assets.' },
  { icon: '✎', title: 'Campaign summarization', body: 'Convert lengthy reports into concise summaries of key performance indicators.' },
  { icon: '↻', title: 'Performance analysis', body: "Understand what's driving results across campaigns and channels." },
  { icon: '◉', title: 'Knowledge management', body: 'Centralize marketing documents, playbooks, and historical performance data.' },
  { icon: '⚔', title: 'AI-powered search', body: 'Ask questions and receive cited answers from your marketing knowledge base.' },
  { icon: '🔍', title: 'AI marketing automation tools', body: 'Automate recurring research, reporting, and information retrieval workflows.' },
]

const BENEFITS = [
  'Faster campaign optimization',
  'Better visibility into performance',
  'Reduced reporting workload',
  'Improved collaboration',
  'Faster decision-making',
  'Increased productivity',
  'Better use of marketing data',
  'More efficient operations',
]

const STATS = [
  { n: '3.5h', label: 'Saved per marketer, per week on research & reporting', source: 'source: 8 marketing customer surveys · 2026' },
  { n: '2.4×', label: 'More content shipped without adding headcount', source: 'source: Cascade deployment' },
  { n: '100%', label: 'Of answers cited to your own data & assets', source: 'source: ATG answer logs' },
  { n: '38%', label: 'Higher CTR from messaging grounded in past wins', source: 'source: customer-reported A/B tests' },
]

const LOGOS = ['Northwind', 'Lattice', 'Orbit', 'Ridgeline', 'Vector Bank', 'Cascade', 'Helio Health', 'Beacon AI', 'Parallax', 'Atlas Robotics', 'Finch Legal', 'Quanta Lab']

const MORE = [
  { icon: '◆', title: 'Revenue teams', desc: 'Connect marketing and sales insights to identify pipeline opportunities faster.', link: 'Explore sales use case', href: '/use-cases/sales' },
  { icon: '✦', title: 'Customer success', desc: 'Access campaign history, customer communications, and engagement insights instantly.', link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◉', title: 'Operations teams', desc: 'Make processes, reports, and organizational knowledge searchable across departments.', link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◎', title: 'Research teams', desc: 'Analyze market reports, customer studies, and competitive intelligence from a single platform.', link: 'Explore researcher', href: '/use-cases/researcher' },
]

export default function MarketingPage() {
  return (
    <>
      <PageAnimations />
      <Nav basePath="/" />
      <main id="main">

        {/* ── HERO ── */}
        <section className="persona-hero" aria-labelledby="ph1">
          <div className="persona-hero-bg" aria-hidden="true">
            <div className="grid"></div>
            <div className="glow"></div>
          </div>
          <div className="container persona-hero-inner">
            <div>
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For marketers, content &amp; brand teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Marketing Teams</em> that knows your brand inside out.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for Marketing Teams from Clarant helps teams find campaign insights, analyze performance, and access marketing knowledge with citation-backed answers. Spend less time searching and more time driving results.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="https://app.clarant.ai/login">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="https://calendly.com/nparikh-clarant/30min">Schedule Demo</a>
              </div>
            </div>
            <div className="persona-visual hero-anim" role="img" aria-label="Three illustrative marketing answer cards" style={{ animationDelay: '200ms' }}>
              <div className="pv-card pv-card-a">
                <div className="pv-h">Question</div>
                <p className="pv-t">What messaging worked best for our Q1 launch?</p>
                <span className="pv-cite">● Analytics · Docs · Campaigns</span>
              </div>
              <div className="pv-card pv-card-b">
                <div className="pv-h">Answer · 5s</div>
                <p className="pv-t">&ldquo;Ship faster&rdquo; outperformed &ldquo;Save time&rdquo; by 38% CTR. Webinar drove 2.1× pipeline vs. ebook.</p>
                <span className="pv-cite">4 sources cited</span>
                <div className="pv-bar"><i></i></div>
              </div>
              <div className="pv-card pv-card-c">
                <div className="pv-h">Source · GA4 · Q1 report</div>
                <p className="pv-t">Landing variant B — 4.2% CTR vs. 3.0% control · n = 18k</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Marketing Teams — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              AI for Marketing Teams is software that understands marketing data, campaign performance, customer feedback, content assets, and business reports, then answers questions in plain English with every answer backed by source citations. It helps marketing teams spend less time searching for information and more time executing campaigns that drive growth.
            </p>
            {EXPLAINED.map((item, i) => (
              <div key={i} className={`use-row${i % 2 === 1 ? ' is-reversed' : ''}`} data-reveal={i % 2 === 0 ? 'fade-left' : 'fade-right'}>
                <div>
                  <div className="use-step-num"><span>{item.n}</span> {item.kicker}</div>
                  <h3 className="use-h">{item.heading}</h3>
                  <p className="use-p">{item.body}</p>
                  <ul className="use-list">
                    {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
                <div className={`use-visual--img${item.img ? ' has-img' : ''}`} aria-hidden={!item.img}>
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.imgAlt ?? item.placeholder}
                      width={1536}
                      height={1024}
                      sizes="(max-width: 880px) 100vw, 50vw"
                      className="use-visual-img-real"
                    />
                  ) : (
                    <ImageSlot placeholder={item.placeholder} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="persona-more" aria-labelledby="howto-h">
          <div className="container">
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Marketing Teams: step-by-step.</h2>
            <p className="persona-uses-lede" style={{ marginBottom: 36 }}>
              Getting started takes minutes. Connect your marketing data, ask questions, verify insights, and empower your team with instant access to information.
            </p>
            <div className="legal-steps">
              {STEPS.map((s, i) => (
                <article className="legal-step" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 90}ms` } as any}>
                  <div className="legal-step-kicker">{s.kicker}</div>
                  <div className="legal-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ── */}
        <section className="persona-more" aria-labelledby="problems-h">
          <div className="container">
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">How can AI help marketing teams?</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36 }}>
              Modern marketing organizations use AI to eliminate manual work and uncover insights faster.
            </p>
            <div className="legal-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div className="legal-problem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${(i % 2) * 80}ms` } as any}>
                  <span className="legal-problem-ic">{p.icon}</span>
                  <div><h3>{p.title}</h3><p>{p.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES & BENEFITS ── */}
        <section className="persona-more" aria-labelledby="features-h" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI Tools for Marketing Teams — features, benefits &amp; key capabilities.</h2>
            <div className="cs-eyebrow-row"><span className="eyebrow">Key features</span></div>
            <div className="legal-feat-panel">
              {FEATURES.map((f, i) => (
                <div className="legal-feat" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 50}ms` } as any}>
                  <span className="legal-feat-ic">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.body}</p></div>
                </div>
              ))}
            </div>
            <div className="cs-eyebrow-row" style={{ marginTop: 48 }}>
              <span className="eyebrow">Benefits for marketing teams</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit" key={i} data-reveal="pop" style={{ '--reveal-delay': `${i * 60}ms` } as any}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        {/*
        <section className="persona-quote" aria-labelledby="quote-h">
          <div className="container persona-quote-inner">
            <div className="persona-quote-card" data-reveal="fade-right">
              <div className="persona-quote-card-inner">
                <div className="name">Naomi Ito</div>
                <div className="role">Head of Marketing · Cascade</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">My team used to lose a day every launch digging up what we&apos;d said before and what actually worked. Now we ask one question and get a cited answer in seconds — on-brand, on-message, and backed by our own data.</q>
              <div className="persona-quote-attr">— Cascade · 90-person marketing org · B2B SaaS</div>
            </div>
          </div>
        </section>
/*} 
        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes marketing teams report.</h2>
            <div className="persona-stat-grid" role="list">
              {STATS.map((s, i) => (
                <div className="persona-stat-cell" role="listitem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 80}ms` } as any}>
                  <div className="persona-stat-n" data-countup={s.n}>{s.n}</div>
                  <div className="persona-stat-l">{s.label}</div>
                  <div className="persona-stat-source">{s.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCOVER MORE ── */}
        <section className="persona-more" aria-labelledby="more-h">
          <div className="container">
            <h2 id="more-h" className="persona-more-h" data-reveal="fade-up">Discover how other teams use Clarant.</h2>
            <div className="persona-more-grid">
              {MORE.map((m, i) => (
                <a className="persona-more-card" href={m.href} key={i} data-reveal="pop" style={{ '--reveal-delay': `${i * 70}ms` } as any}>
                  <span className="persona-more-icon">{m.icon}</span>
                  <h3 className="persona-more-h3">{m.title}</h3>
                  <p className="persona-more-p">{m.desc}</p>
                  <span className="persona-more-link">{m.link} <ArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO WALL ── */}
        <section className="cs-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up"><span className="eyebrow" id="cs-logos-h">Trusted by marketing teams at</span></div>
            <div className="cs-logos" role="list">
              {LOGOS.map((l) => <div className="cs-logo" role="listitem" key={l}>{l}</div>)}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  )
}
