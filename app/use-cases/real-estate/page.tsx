'use client'

import { useEffect } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'
import Image  from 'next/image'
import { ArrowRight } from '@/components/icons/Icons'

/* ─── Scroll-reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─── Count-up hook ─── */
function useCountUp() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-countup]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = el.dataset.countup || ''
        const suffix = target.replace(/[\d.]+/, '')
        const num = parseFloat(target)
        if (isNaN(num)) { el.textContent = target; io.unobserve(el); return }
        const dur = 1600; const startTime = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val = num < 10 ? (num * ease).toFixed(num % 1 !== 0 ? 0 : 0) : Math.round(num * ease)
          el.textContent = val + suffix
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = target
        }
        requestAnimationFrame(tick)
        io.unobserve(el)
      })
    }, { threshold: 0.5 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function ImageSlot({ placeholder = 'Drop an image' }: { placeholder?: string }) {
  return (
    <div className="img-slot-frame">
      <div className="img-slot-ring" />
      <div className="img-slot-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
        <span className="img-slot-cap">{placeholder}</span>
      </div>
    </div>
  )
}

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From property document to cited answer, automatically.',
    body: 'Upload or connect your real estate files and Clarant analyzes every document, extracts important information, and builds a searchable understanding of your portfolio. Ask a question and receive a grounded answer with the exact clause or section cited.',
    bullets: ['Ingests leases, purchase agreements, disclosures, PDFs, and Word documents', 'Extracts tenant details, rent terms, renewal dates, obligations, and property information', 'Performs AI Lease Document Analysis across large document collections', 'Answers questions in plain English with source citations'],
    placeholder: 'Cited clause',
    img: '/images/From-property-document-to-cited-answer-automatically.png',
    imgAlt: 'AI for Real Estate — reads leases and purchase agreements, extracts key terms, returns cited answers',
  },
  {
    kicker: 'Why businesses use it', n: '02',
    heading: 'Because real estate documents grow faster than teams can review them.',
    body: 'Brokers, real estate agencies, investors, and property management companies manage thousands of contracts, leases, disclosures, and transaction documents every year. Manual review slows transactions and increases the risk of missed details.',
    bullets: ['Lease reviews and renewals', 'Property acquisition due diligence', 'Real estate contract review', 'Compliance and disclosure verification', 'Portfolio document management', 'Transaction support and research'],
    placeholder: 'Document overload',
    img: '/images/Because-real-estate-documents-grow-faster-than-teams-can-review-them.png',
    imgAlt: 'AI for Real Estate — keeps up with growing lease, contract, and disclosure volume',
  },
  {
    kicker: 'What you get', n: '03',
    heading: 'Faster transactions, fewer missed details, and complete visibility.',
    body: 'Every answer returned by Clarant is grounded in your documents and linked directly to the source. Teams can move faster while maintaining confidence in the information they use.',
    bullets: ['Citation-backed answers across every document', 'Faster lease and contract reviews', 'Improved compliance and audit readiness', 'Better collaboration across teams', 'Centralized access to property knowledge'],
    placeholder: 'Complete visibility',
    img: '/images/Faster-transactions-fewer-missed-details-and-complete-visibility.png',
    imgAlt: 'AI for Real Estate — grounds every answer in your property documents with source citations',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your documents', body: 'Upload leases, contracts, disclosures, property records, transaction documents, and portfolio files. Clarant indexes everything securely.' },
  { kicker: 'Step 2', n: '02', title: 'Ask in plain English',   body: 'Ask questions such as "What is the rent escalation clause in this lease?", "When does this tenant\'s lease expire?" or "What contingencies exist in this purchase agreement?"' },
  { kicker: 'Step 3', n: '03', title: 'Verify the cited source', body: 'Every answer includes the exact clause, section, and document reference, so users can confirm information immediately.' },
  { kicker: 'Step 4', n: '04', title: 'Scale across your business', body: 'Empower brokers, agents, property managers, legal teams, and operations teams with instant access to property knowledge.' },
]

const PROBLEMS = [
  { icon: '∞', title: 'Contract review delays',    body: 'Review leases and purchase agreements in seconds instead of hours.' },
  { icon: '⏱', title: 'Slow transaction workflows', body: 'Find critical information instantly and keep deals moving.' },
  { icon: '◎', title: 'Document overload',          body: 'Search thousands of property documents from one interface.' },
  { icon: '"', title: 'Hidden risks',               body: 'Identify unusual clauses, obligations, and renewal terms earlier.' },
  { icon: '✓', title: 'Scattered information',      body: 'Create a centralized knowledge hub for all real estate records.' },
  { icon: '✧', title: 'Manual searching',           body: 'Get cited answers instead of opening multiple files and folders.' },
]

const FEATURES = [
  { icon: '≡', title: 'Real estate document intelligence', body: 'Understands leases, contracts, disclosures, and transaction records.' },
  { icon: '◎', title: 'Property document summaries',       body: 'Generate concise summaries of lengthy real estate agreements.' },
  { icon: '✧', title: 'Real estate contract AI',           body: 'Analyze contracts, identify key obligations, and surface potential risks.' },
  { icon: '"', title: 'Lease clause extraction',           body: 'Automatically organize lease terms, renewal dates, rent schedules, and obligations.' },
  { icon: '🔍', title: 'AI Lease Document Analysis',       body: 'Review lease portfolios and identify critical information at scale.' },
  { icon: '↻', title: 'AI Document Search for Brokers',    body: 'Ask questions across property records, contracts, and transaction documents with instant citations.' },
]

const BENEFITS = ['Faster contract reviews', 'Reduced administrative workload', 'Improved compliance', 'Better transaction visibility', 'Increased productivity', 'Faster deal execution', 'Better client service', 'More informed decisions']

const STATS = [
  { n: '85%',     raw: '85%',     label: 'Faster review of leases and property agreements',                source: 'source: customer productivity surveys' },
  { n: '4×',      raw: '4×',      label: 'Faster due diligence and transaction preparation',              source: 'source: customer-reported workflows' },
  { n: '100%',    raw: '100%',    label: 'Citation-backed answers across uploaded property documents',    source: 'source: Clarant platform data' },
  { n: 'Minutes', raw: 'Minutes', label: 'To locate information that previously required hours of searching', source: 'source: customer feedback' },
]

const LOGOS = ['Quanta Lab', 'Helio Health', 'Northwind', 'Orbit', 'Parallax', 'Meridian', 'Atlas Robotics', 'Vector Bank', 'Lattice', 'Finch Legal', 'Cascade', 'Beacon AI']
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS] // for seamless marquee

const MORE = [
  { icon: '◎', title: 'Brokers & agents',       desc: 'Access contracts, disclosures, and transaction details instantly without searching through folders.', link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◆', title: 'Property managers',      desc: 'Review lease obligations, renewal terms, and tenant agreements faster.',                              link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◉', title: 'Operations teams',       desc: 'Make property knowledge searchable across offices, markets, and portfolios.',                         link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '✦', title: 'Real estate investors',  desc: 'Analyze acquisition documents, leases, and portfolio records with confidence.',                       link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
]

export default function RealEstatePage() {
  useScrollReveal()
  useCountUp()

  return (
    <>
      <Nav basePath="/" />
      <main id="main">

        {/* ── HERO ── */}
        <section className="persona-hero" aria-labelledby="ph1">
          <div className="persona-hero-bg" aria-hidden="true">
            <div className="grid"></div>
            <div className="glow"></div>
            <div className="glow-pulse"></div>
          </div>
          <div className="container persona-hero-inner">
            <div>
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For brokers, agents &amp; property teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Real Estate</em> that unlocks answers hidden inside property documents.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for Real Estate from Clarant helps brokers, agents, property managers, and real estate teams instantly find answers across contracts, leases, disclosures, and property documents — with every answer backed by source citations.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="https://app.clarant.ai/login">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="https://calendly.com/nparikh-clarant/30min">Schedule Demo</a>
              </div>
            </div>

            {/* Hero visual — 3 floating answer cards */}
            <div className="persona-visual hero-anim" style={{ animationDelay: '200ms' }} role="img" aria-label="Three illustrative real estate answer cards">
              <div className="pv-card pv-card-a float-card" style={{ animationDelay: '400ms' }}>
                <div className="pv-h">Property question</div>
                <p className="pv-t">What is the rent escalation clause in this lease?</p>
                <span className="pv-cite">● 3 leases · DocuSign · Drive</span>
              </div>
              <div className="pv-card pv-card-b float-card" style={{ animationDelay: '550ms' }}>
                <div className="pv-h">Answer · 7s</div>
                <p className="pv-t">3% annual increase, compounding, starting in year 2 of the term.</p>
                <span className="pv-cite">2 clauses cited</span>
                <div className="pv-bar"><i className="pv-bar-fill"></i></div>
              </div>
              <div className="pv-card pv-card-c float-card" style={{ animationDelay: '700ms' }}>
                <div className="pv-h">Source · Master Lease 2026</div>
                <p className="pv-t">§5.3 — Rent Escalation &amp; Adjustments</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Real Estate — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              AI for Real Estate is software that understands real estate documents, identifies key terms, lease obligations, renewal dates, property details, and transaction risks, then answers questions in plain English with citations back to the original document. It transforms scattered real estate records into a searchable knowledge base for brokers, agents, property managers, investors, and operations teams.
            </p>
            {EXPLAINED.map((item, i) => (
              <div key={i}
                className={`use-row${i % 2 === 1 ? ' is-reversed' : ''}`}
                data-reveal={i % 2 === 0 ? 'fade-left' : 'fade-right'}
              >
                <div>
                  <div className="use-step-num"><span>{item.n}</span> {item.kicker}</div>
                  <h3 className="use-h">{item.heading}</h3>
                  <p className="use-p">{item.body}</p>
                  <ul className="use-list">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className={`use-visual--img${(item as any).img ? ' has-img' : ''}`}>
                  {(item as any).img ? (
                    <Image
                      src={(item as any).img}
                      alt={(item as any).imgAlt ?? item.placeholder}
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
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Real Estate: step-by-step.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36, '--reveal-delay': '60ms' } as any}>
              Getting started takes four simple steps. Connect your documents, ask questions, verify answers, and make property information instantly accessible across your organization.
            </p>
            <div className="legal-steps">
              {STEPS.map((s, i) => (
                <article className="legal-step step-hover" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 90}ms` } as any}>
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
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Clarant related to AI for Real Estate.</h2>
            <div className="legal-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div className="legal-problem problem-item" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${(i%2)*80}ms` } as any}>
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
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI for Real Estate — features, benefits &amp; key capabilities.</h2>

            <div className="cs-eyebrow-row"><span className="eyebrow">Key features</span></div>
            <div className="legal-feat-panel">
              {FEATURES.map((f, i) => (
                <div className="legal-feat feat-item" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i*50}ms` } as any}>
                  <span className="legal-feat-ic">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.body}</p></div>
                </div>
              ))}
            </div>

            <div className="cs-eyebrow-row" style={{ marginTop: 48 }}>
              <span className="eyebrow">Benefits for real estate teams</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit benefit-chip" key={i} data-reveal="pop" style={{ '--reveal-delay': `${i*60}ms` } as any}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes real estate teams report.</h2>
            <div className="persona-stat-grid" role="list">
              {STATS.map((s, i) => (
                <div className="persona-stat-cell" role="listitem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i*80}ms` } as any}>
                  <div className="persona-stat-n" data-countup={s.raw}>{s.n}</div>
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
                <a className="persona-more-card more-card" href={m.href} key={i} data-reveal="pop" style={{ '--reveal-delay': `${i*70}ms` } as any}>
                  <span className="persona-more-icon">{m.icon}</span>
                  <h3 className="persona-more-h3">{m.title}</h3>
                  <p className="persona-more-p">{m.desc}</p>
                  <span className="persona-more-link">{m.link} <ArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO WALL — marquee ── */}
        <section className="cs-section logo-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up">
              <span className="eyebrow" id="cs-logos-h">Trusted by real estate teams at</span>
            </div>
          </div>
          <div className="logo-marquee-track" role="list" aria-label="Trusted real estate teams">
            <div className="logo-marquee">
              {LOGOS_DOUBLED.map((l, i) => (
                <div className="logo-marquee-item" role="listitem" key={i}>{l}</div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  )
}

/* ─── All CSS (keyframes & scroll-reveal system are in globals.css) ─── */
