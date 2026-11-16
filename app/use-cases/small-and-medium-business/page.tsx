'use client'

import { useEffect, useRef } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'
import Image  from 'next/image'
import Script from 'next/script'
import { ArrowRight } from '@/components/icons/Icons'
import React from 'react'

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
          const val = num < 10 ? (num * ease).toFixed(1).replace('.0','') : Math.round(num * ease)
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

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From scattered files to trusted business answers.',
    body: 'Upload or connect your business documents and Clarant creates a searchable knowledge layer across your organization. This AI document assistant for small and medium businesses understands the context of your files and returns grounded answers with citations from the original source.',
    bullets: [
      'Connect Google Drive, Gmail, SharePoint, Notion, HubSpot, and more',
      'Index contracts, SOPs, proposals, policies, and internal documents',
      'Search across thousands of files instantly',
      'Receive answers with source citations',
    ],
    placeholder: 'Business knowledge snapshot',
    img: '/images/From-scattered-files-to-trusted-business-answers.png',
    imgAlt: 'AI for Small Businesses — ask any business question and get citation-backed answers',
  },
  {
    kicker: 'Why businesses use it', n: '02',
    heading: "Because growing companies can't afford to waste time searching for information.",
    body: 'As businesses scale, information becomes fragmented across teams and systems. Employees spend hours looking for answers that already exist somewhere in the organization. An AI assistant for small business teams helps centralize knowledge and make it accessible to everyone.',
    bullets: [
      'Employee onboarding and training',
      'Sales enablement and proposal management',
      'Customer support knowledge access',
      'Operations and process documentation',
      'Contract and policy management',
      'Internal knowledge sharing',
    ],
    placeholder: 'Team knowledge hub',
    img: '/images/Because-growing-companies-afford-to-waste-time-searching-for-information.png',
    imgAlt: 'AI for Small Businesses — centralize knowledge and make it accessible to every team',
  },
  {
    kicker: 'What you get', n: '03',
    heading: 'Faster decisions, better collaboration, and less time searching.',
    body: "Every answer is generated from your organization's own knowledge and linked directly to the source document. Teams get a reliable way to find information without interrupting coworkers or digging through folders.",
    bullets: [
      'Citation-backed answers',
      'Faster access to company knowledge',
      'Reduced time spent searching for information',
      'Better collaboration across departments',
      'Consistent answers across teams',
    ],
    placeholder: 'Cited SMB answer',
    img: '/images/Faster-decisions-better-collaboration-and-less-time-searching.png',
    imgAlt: 'AI for Small Businesses — grounded answers linked directly to the source document',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your business data', body: 'Link your drives, emails, CRM, document repositories, and internal knowledge sources.' },
  { kicker: 'Step 2', n: '02', title: 'Ask questions naturally',    body: 'Ask questions like "What is our refund policy?", "How do we onboard a new customer?" or "Where is the latest pricing document?"' },
  { kicker: 'Step 3', n: '03', title: 'Verify the source',          body: 'Every answer includes citations from the original document, email, or knowledge source.' },
  { kicker: 'Step 4', n: '04', title: 'Empower every team',         body: 'Give employees instant access to the information they need without relying on manual searches.' },
]

const PROBLEMS = [
  { icon: '⏱', title: 'Information scattered everywhere', body: 'Bring documents, emails, and knowledge into one searchable workspace.' },
  { icon: '◈', title: 'Time wasted searching',           body: 'Find answers instantly instead of digging through folders and inboxes.' },
  { icon: '⚠', title: 'Knowledge silos',                 body: 'Make information accessible across departments and teams.' },
  { icon: '✉', title: 'Slow decision-making',            body: 'Get the information needed to make business decisions faster.' },
  { icon: '◉', title: 'Difficult onboarding',            body: 'Help new employees find answers without constant assistance.' },
  { icon: '↻', title: 'Inconsistent information',        body: 'Ensure everyone works from the same source of truth.' },
]

const FEATURES = [
  { icon: '◈', title: 'Document intelligence',   body: 'Understands business documents, contracts, policies, and procedures.' },
  { icon: '⌖', title: 'AI-powered summaries',    body: 'Summarize lengthy documents into concise, actionable insights.' },
  { icon: '✉', title: 'Enterprise search',       body: 'Search across all connected business content from one place.' },
  { icon: '◉', title: 'Knowledge extraction',    body: 'Automatically organize information into a searchable knowledge base.' },
  { icon: '⚔', title: 'Workspace integrations',  body: 'Connect tools your team already uses every day.' },
  { icon: '🔍', title: 'Citation-backed answers', body: 'Every answer links directly to the source content.' },
]

const BENEFITS = [
  'Faster employee onboarding',
  'Improved team productivity',
  'Reduced operational costs',
  'Better knowledge sharing',
  'Faster customer support',
  'Improved collaboration',
  'Better decision-making',
  'Increased efficiency',
]

const STATS = [
  { n: '15 min', raw: '15',   label: 'Saved per person before every customer-facing call',  source: 'source: 12 SMB customer surveys · 2026' },
  { n: '3×',     raw: '3×',   label: 'Faster answers to internal knowledge questions',       source: 'source: ATG SMB deployment data' },
  { n: '100%',   raw: '100%', label: 'Of answers cited to the exact source document',        source: 'source: ATG answer logs' },
  { n: '4.2h',   raw: '4.2h', label: 'Saved per team member, per week',                     source: 'source: self-reported · validated' },
]

const LOGOS = ['Brightpath', 'Cornerstone', 'Nimble Co', 'Redwood Labs', 'Sprout Studio', 'Harbor Group', 'Bloom Agency', 'Keystone SMB', 'Mosaic Works', 'Pebble Tech', 'Sunrise Digital', 'Anchor Co']
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS]

const MORE = [
  { icon: '◆', title: 'Sales teams',      desc: 'Find proposals, pricing documents, contracts, and customer information instantly.', link: 'Explore sales use case', href: '/use-cases/sales' },
  { icon: '✦', title: 'Customer support', desc: 'Access policies, product information, and customer documentation in seconds.',     link: 'Book a demo',            href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◉', title: 'Operations teams', desc: 'Centralize SOPs, process documentation, and company knowledge.',                   link: 'Book a demo',            href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◎', title: 'Leadership teams', desc: 'Get quick answers from company data without chasing information across departments.', link: 'Book a demo',          href: 'https://calendly.com/nparikh-clarant/30min' },
]

export default function SMBPage() {
  useScrollReveal()
  useCountUp()

  // Process the Instagram embed exactly once — same guarded approach as the healthcare page.
  // process() is a no-op until embed.js is loaded; the ref guard prevents a second pass
  // that would rebuild the iframe and flash it.
  const igProcessed = useRef(false)
  const processIgOnce = () => {
    if (igProcessed.current) return
    const embeds = (window as any).instgrm?.Embeds
    if (!embeds) return
    igProcessed.current = true
    embeds.process()
  }
  useEffect(() => { processIgOnce() }, [])

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={processIgOnce}
      />
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
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For founders, operators &amp; growing teams</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Small Businesses</em> that knows your whole business as well as you do.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for small businesses turns scattered business information into instant, cited answers. Find what you need across documents, emails, policies, and customer records from Clarant without wasting time searching.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="https://app.clarant.ai/login">
                  Start Free Trial <ArrowRight size={14} />
                </a>
                <a className="btn btn-ghost" href="https://calendly.com/nparikh-clarant/30min">
                  Schedule Demo
                </a>
              </div>
            </div>

            {/* Hero visual — Instagram Reel mockup (same treatment as /use-cases/healthcare) */}
            <div className="healthcare-hero-media hero-anim" style={{ animationDelay: '200ms' }}>
              <div className="ig-stage">
                <div className="hero-instagram-embed" aria-label="Instagram Reel from @ask.the.Clarant">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/reel/DcNsZfxAYXy/"
                    data-instgrm-version="14"
                    style={{ background:'#FFF', border:0, margin:0, maxWidth:540, minWidth:0, padding:0, width:'100%' }}
                  >
                    <a href="https://www.instagram.com/reel/DcNsZfxAYXy/" target="_blank" rel="noopener noreferrer">
                      View this Reel from @ask.the.Clarant on Instagram
                    </a>
                  </blockquote>
                </div>
                <span className="healthcare-ig-chip healthcare-ig-chip--a">AI for SMBs</span>
                <span className="healthcare-ig-chip healthcare-ig-chip--b">Citation-backed</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Small Businesses — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
              AI for small businesses gives growing companies an intelligent way to access the knowledge buried inside their documents. Instead of searching through emails, shared drives, spreadsheets, and folders, teams can ask questions and receive accurate answers backed by source citations. It acts as a central knowledge hub for sales, marketing, operations, customer support, finance, and leadership teams.
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
                    {item.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
                <div className="use-visual--img has-img">
                  <Image
                    src={item.img}
                    alt={item.imgAlt}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 880px) 100vw, 50vw"
                    className="use-visual-img-real"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="persona-more" aria-labelledby="howto-h">
          <div className="container">
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Small Businesses: step-by-step.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36, '--reveal-delay': '60ms' } as React.CSSProperties}>
              Getting started takes minutes. Connect your content, ask questions, verify answers, and make company knowledge accessible to every team.
            </p>
            <div className="legal-steps">
              {STEPS.map((s, i) => (
                <article className="legal-step step-hover" key={i}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
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
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Clarant related to AI for Small Businesses.</h2>
            <div className="legal-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div className="legal-problem problem-hover" key={i}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${(i % 2) * 80}ms` } as React.CSSProperties}>
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
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI Assistant for Small Business Teams — features, benefits &amp; key capabilities.</h2>
            <div className="cs-eyebrow-row"><span className="eyebrow">Key features</span></div>
            <div className="legal-feat-panel">
              {FEATURES.map((f, i) => (
                <div className="legal-feat feat-hover" key={i}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 50}ms` } as React.CSSProperties}>
                  <span className="legal-feat-ic">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.body}</p></div>
                </div>
              ))}
            </div>
            <div className="cs-eyebrow-row" style={{ marginTop: 48 }}>
              <span className="eyebrow">Benefits for small and medium businesses</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit benefit-hover" key={i}
                  data-reveal="pop"
                  style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}{/*
        <section className="persona-quote" aria-labelledby="quote-h">
          <div className="container persona-quote-inner">
            <div className="persona-quote-card quote-hover" data-reveal="fade-right">
              <div className="persona-quote-card-inner">
                <div className="name">Priya Nair</div>
                <div className="role">Co-founder &amp; CEO · Brightpath</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">We&apos;re a 12-person company competing against 200-person teams. Clarant is the unfair advantage — every person on our team can answer any customer question in seconds, cited to the exact email or doc, without interrupting each other.</q>
              <div className="persona-quote-attr">— Brightpath · 12 seats · professional services</div>
            </div>
          </div>
        </section>
*/}
        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes SMB teams report.</h2>
            <div className="persona-stat-grid" role="list">
              {STATS.map((s, i) => (
                <div className="persona-stat-cell" role="listitem" key={i}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
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
            <h2 id="more-h" className="persona-more-h" data-reveal="fade-up">Discover why growing companies choose our Document Intelligence Platform for Small Businesses.</h2>
            <div className="persona-more-grid">
              {MORE.map((m, i) => (
                <a className="persona-more-card" href={m.href} key={i}
                  data-reveal="pop"
                  style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                  <span className="persona-more-icon">{m.icon}</span>
                  <h3 className="persona-more-h3">{m.title}</h3>
                  <p className="persona-more-p">{m.desc}</p>
                  <span className="persona-more-link">{m.link} <ArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── BUILT FOR GROWING COMPANIES ── */}
        <section className="persona-more" aria-labelledby="built-h">
          <div className="container">
            <h2 id="built-h" className="persona-more-h" data-reveal="fade-up">Built for growing companies</h2>
            <p className="persona-uses-lede" data-reveal="fade-up">
              Clarant is more than an AI assistant for small business teams. It&apos;s a complete document intelligence platform for small businesses that helps organizations unlock the knowledge hidden across their documents, emails, and business systems.
            </p>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginTop: 16, '--reveal-delay': '60ms' } as React.CSSProperties}>
              Whether you&apos;re a startup, a growing company, or an established SMB, our AI document assistant for small and medium businesses helps your team work smarter, move faster, and make better decisions with confidence.
            </p>
          </div>
        </section>

        {/* ── LOGO WALL ── */}
        <section className="cs-section logo-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up">
              <span className="eyebrow" id="cs-logos-h">Trusted by small &amp; medium businesses at</span>
            </div>
          </div>
          <div className="logo-marquee-track" role="list" aria-label="Trusted SMB teams">
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

/* ─── All CSS ─── */
