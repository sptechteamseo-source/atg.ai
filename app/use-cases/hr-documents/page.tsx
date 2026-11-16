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
    heading: 'From HR documents to verified answers, automatically.',
    body: 'Upload or connect your HR repository and Clarant indexes every document, extracts key information, and builds an intelligent knowledge base. Employees and HR professionals simply ask a question and receive an answer with the exact document and section cited.',
    bullets: ['Ingests PDFs, Word documents, spreadsheets, and HR portals', 'Indexes employee handbooks, policies, offer letters, and training guides', 'Answers questions in plain English with source citations', 'Supports enterprise-wide HR knowledge management AI'],
    placeholder: 'Cited answer',
    img: '/images/From-HR-documents-to-verified-answers-automatically.png',
    imgAlt: 'AI Tool for HR Documents — reads employee handbooks and policies, extracts key information, returns cited answers',
  },
  {
    kicker: 'Why businesses use it', n: '02',
    heading: 'Because HR teams spend too much time answering the same questions.',
    body: 'HR departments manage thousands of employee documents, recruiting files, compliance records, and internal policies. Employees constantly need answers, while recruiters search resumes and hiring documents. HR knowledge management AI helps businesses centralize knowledge and provide instant access to trusted information.',
    bullets: ['Employee policy and handbook search', 'Recruiting document management', 'Candidate resume analysis', 'Onboarding documentation', 'Benefits and payroll information lookup', 'HR compliance and policy verification'],
    placeholder: 'Repetitive questions',
    img: '/images/Because-HR-teams-spend-too-much-time-answering-the-same-questions.png',
    imgAlt: 'HR knowledge management AI — centralizes employee policies, recruiting files, and compliance records',
  },
  {
    kicker: 'What you get', n: '03',
    heading: "An HR knowledge base that's searchable, reliable, and always available.",
    body: "Every answer is grounded in your organization's HR documents, ensuring employees receive accurate information while reducing repetitive work for HR teams.",
    bullets: ['Citation-backed answers from HR documents', 'Faster employee self-service', 'Reduced HR support workload', 'Consistent policy communication', 'Centralized company knowledge', 'Improved employee experience'],
    placeholder: 'Always-on knowledge base',
    img: '/images/An-HR-knowledge-base-thats-searchable-reliable-and-always-available.png',
    imgAlt: 'AI Tool for HR Documents — a searchable, reliable, always-available HR knowledge base',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your HR documents', body: 'Upload employee handbooks, HR policies, recruiting documents, training materials, offer letters, SOPs, and compliance records.' },
  { kicker: 'Step 2', n: '02', title: 'Ask questions naturally',   body: 'Ask questions like "What is our parental leave policy?", "When does health insurance begin?", "Show me candidates with Salesforce experience," or "What documents are required during onboarding?"' },
  { kicker: 'Step 3', n: '03', title: 'Verify every answer',       body: 'Every response includes the original document, section, and citation so HR teams and employees can verify information immediately.' },
  { kicker: 'Step 4', n: '04', title: 'Roll it out across the organization', body: 'Enable HR, recruiting, managers, leadership, and employees to instantly search company knowledge without waiting for manual responses.' },
]

const PROBLEMS = [
  { icon: '∞', title: 'Repetitive HR questions',   body: 'Employees find answers themselves instead of contacting HR.' },
  { icon: '⏱', title: 'Scattered HR documents',     body: 'Search policies, handbooks, and employee documents from one place.' },
  { icon: '◎', title: 'Recruiting inefficiencies',  body: 'Use an AI recruiting document assistant to search resumes, interview notes, and candidate profiles instantly.' },
  { icon: '"', title: 'Employee document search',   body: 'Enable AI employee document search across policies, onboarding documents, and HR records.' },
  { icon: '✓', title: 'Compliance management',      body: 'Keep employees aligned with company policies and regulatory requirements.' },
  { icon: '✧', title: 'Knowledge consistency',      body: 'Ensure every employee receives the same accurate, citation-backed information.' },
]

const FEATURES = [
  { icon: '≡', title: 'Employee document search',        body: 'Perform AI employee document search across HR policies, employee records, onboarding guides, and internal documents.' },
  { icon: '◎', title: 'HR knowledge management AI',       body: 'Create a centralized knowledge hub for policies, procedures, benefits, and company information.' },
  { icon: '✧', title: 'AI recruiting document assistant', body: 'Search resumes, interview feedback, hiring documentation, and candidate profiles using natural language.' },
  { icon: '"', title: 'Policy summarization',             body: 'Summarize lengthy HR policies and employee handbooks into actionable insights.' },
  { icon: '🔍', title: 'AI-powered search',               body: 'Ask questions across all HR documents and receive verified answers with citations.' },
  { icon: '↻', title: 'Secure permissions',               body: 'Protect confidential HR information using existing user permissions and access controls.' },
]

const BENEFITS = ['Faster employee support', 'Reduced HR workload', 'Better employee experience', 'Faster hiring decisions', 'Improved compliance', 'Centralized HR knowledge', 'Increased productivity', 'Better knowledge sharing']

const STATS = [
  { n: '85%',     raw: '85%',     label: 'Reduction in time spent answering repetitive employee questions', source: 'source: customer productivity surveys' },
  { n: '3×',      raw: '3×',      label: 'Faster onboarding for new employees',                             source: 'source: customer onboarding data' },
  { n: '100%',    raw: '100%',    label: 'Citation-backed answers from HR documents',                       source: 'source: Clarant platform' },
  { n: 'Minutes', raw: 'Minutes', label: 'To locate employee information that previously took hours',       source: 'source: customer feedback' },
]

const LOGOS = ['Quanta Lab', 'Helio Health', 'Northwind', 'Orbit', 'Parallax', 'Meridian', 'Atlas Robotics', 'Vector Bank', 'Lattice', 'Finch Legal', 'Cascade', 'Beacon AI']
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS] // for seamless marquee

const MORE = [
  { icon: '◎', title: 'Human Resources', desc: 'Provide employees with instant answers while reducing repetitive HR requests.',                    link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◆', title: 'Recruiting',      desc: 'Use an AI recruiting document assistant to search resumes, interview notes, and hiring documents faster.', link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◉', title: 'Operations',      desc: 'Make internal documentation searchable across every department.',                                   link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '✦', title: 'Leadership',      desc: 'Access company policies, procedures, and organizational knowledge instantly for faster decision-making.', link: 'Book a demo', href: 'https://calendly.com/nparikh-clarant/30min' },
]

export default function HrDocumentsPage() {
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
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For HR, recruiting &amp; people teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI Tool for HR Documents</em> that finds employee information in seconds.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI Tool for HR Documents from Clarant reads employee handbooks, HR policies, offer letters, resumes, onboarding guides, training materials, and compliance documents — then answers any question with the exact source cited. Reduce repetitive HR questions, speed up onboarding, and give every employee instant access to trusted company knowledge.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="https://app.clarant.ai/login">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="https://calendly.com/nparikh-clarant/30min">Schedule Demo</a>
              </div>
            </div>

            {/* Hero visual — 3 floating answer cards */}
            <div className="persona-visual hero-anim" style={{ animationDelay: '200ms' }} role="img" aria-label="Three illustrative HR answer cards">
              <div className="pv-card pv-card-a float-card" style={{ animationDelay: '400ms' }}>
                <div className="pv-h">HR question</div>
                <p className="pv-t">What is our parental leave policy?</p>
                <span className="pv-cite">● Employee Handbook · Workday · BambooHR</span>
              </div>
              <div className="pv-card pv-card-b float-card" style={{ animationDelay: '550ms' }}>
                <div className="pv-h">Answer · 6s</div>
                <p className="pv-t">12 weeks paid leave. Eligibility begins after 90 days of employment.</p>
                <span className="pv-cite">3 sources cited</span>
                <div className="pv-bar"><i className="pv-bar-fill"></i></div>
              </div>
              <div className="pv-card pv-card-c float-card" style={{ animationDelay: '700ms' }}>
                <div className="pv-h">Source · Employee Handbook 2026</div>
                <p className="pv-t">Section 4.2 — Parental Leave Policy</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI Tool for HR Documents — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              An AI Tool for HR Documents uses artificial intelligence to understand HR files, employee records, recruiting documents, policies, and internal knowledge. Instead of manually searching through folders or asking HR colleagues, employees and HR teams can ask questions in plain English and receive accurate, citation-backed answers from trusted company documents.
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
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI Tool for HR Documents: step-by-step.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36, '--reveal-delay': '60ms' } as any}>
              Getting started takes just four simple steps. Connect your HR documents, ask questions, verify the answers, and empower every employee with instant access to company knowledge.
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
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Clarant related to HR knowledge management AI.</h2>
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
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI Tool for HR Documents — features, benefits &amp; key capabilities.</h2>

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
              <span className="eyebrow">Benefits for HR teams &amp; businesses</span>
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
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes HR teams report.</h2>
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
              <span className="eyebrow" id="cs-logos-h">Trusted by HR teams at</span>
            </div>
          </div>
          <div className="logo-marquee-track" role="list" aria-label="Trusted HR teams">
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
