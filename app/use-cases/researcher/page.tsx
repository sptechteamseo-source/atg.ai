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
    heading: 'From research paper to cited insight, automatically.',
    body: 'Upload or connect your research documents and Clarant builds a searchable understanding of every paper. Using advanced AI Document Intelligence for Researchers, it identifies key concepts, findings, methodologies, and references across your document collection.',
    bullets: ['Ingests PDFs, journals, reports, whitepapers, and research papers', 'Extracts findings, methodologies, citations, and conclusions', 'Answers questions with source-backed citations', 'Searches across hundreds of documents simultaneously'],
    placeholder: 'Extracted findings',
    img: '/images/From-a-folder-of-PDFs-to-a-cited-synthesis-New.png',
    imgAlt: 'AI Research Assistant — reads PDFs and reference libraries, extracts findings and methodologies, returns cited answers',
  },
  {
    kicker: 'Why researchers use it', n: '02',
    heading: "Because literature reviews shouldn't take weeks.",
    body: 'Researchers spend countless hours searching through papers, comparing findings, identifying relevant sources, and synthesizing information. AI Document Intelligence for Researchers helps streamline the entire research workflow.',
    bullets: ['Literature reviews and academic research', 'Research paper comparison and synthesis', 'Evidence gathering and citation discovery', 'Competitive and market research', 'Policy and regulatory analysis', 'Scientific and technical research'],
    placeholder: 'This week in your field',
    img: '/images/Because-the-literature-grows-faster-than-anyone.png',
    imgAlt: 'AI Research Assistant — keeps you current on fast-moving fields, surfaces new papers and flags contradicting studies',
  },
  {
    kicker: 'What you get', n: '03',
    heading: 'Faster research, better insights, and complete traceability.',
    body: 'Every answer is grounded in your uploaded research materials and linked directly to the original source. Researchers can move faster without sacrificing accuracy or credibility.',
    bullets: ['Citation-backed answers for every query', 'Faster literature reviews and evidence gathering', 'Complete visibility into source material', 'Consistent analysis across large document collections', 'Reduced time spent searching and summarizing'],
    placeholder: 'Cited synthesis',
       img: '/images/A-literature-process-thats-faster.png',
    imgAlt: 'AI Research Assistant — grounds every answer in your research materials with citations to the source',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Connect your research documents', body: 'Upload research papers, academic journals, reports, whitepapers, theses, and other knowledge sources. Clarant indexes and organizes everything automatically.' },
  { kicker: 'Step 2', n: '02', title: 'Ask research questions',  body: 'Ask questions like "What are the main findings across these studies?", "Which papers discuss reinforcement learning?" or "What methodologies were used in these experiments?"' },
  { kicker: 'Step 3', n: '03', title: 'Verify every citation',     body: 'Every answer includes direct citations so you can quickly validate findings and jump to the source material.' },
  { kicker: 'Step 4', n: '04', title: 'Scale your research workflow', body: 'Use the platform across research teams, universities, consulting firms, think tanks, and innovation groups.' },
]

const PROBLEMS = [
  { icon: '∞', title: 'Time-consuming literature reviews', body: 'Analyze hundreds of papers without reading every page manually.' },
  { icon: '⏱', title: 'Information overload',     body: 'Surface the most relevant findings instantly.' },
  { icon: '◎', title: 'Research discovery',       body: 'Find connections, trends, and supporting evidence across documents.' },
  { icon: '"', title: 'Missed insights',          body: 'Identify important findings hidden across multiple sources.' },
  { icon: '✓', title: 'Knowledge fragmentation',  body: 'Centralize research documents in one searchable workspace.' },
  { icon: '✧', title: 'Citation verification',    body: 'Every answer includes source references for confidence and accuracy.' },
]

const FEATURES = [
  { icon: '≡', title: 'Research Paper Analysis Tool', body: 'Analyze methodologies, findings, limitations, and conclusions across research papers.' },
  { icon: '◎', title: 'Research Paper Summarization', body: 'Generate concise summaries of lengthy papers, reports, and academic publications.' },
  { icon: '✧', title: 'Semantic research search', body: 'Ask questions naturally and find relevant information across your entire library.' },
  { icon: '"', title: 'Cross-document analysis',  body: 'Compare findings, methodologies, and results across multiple studies.' },
  { icon: '🔍', title: 'Citation-backed answers', body: 'Every insight is linked directly to the original source.' },
  { icon: '↻', title: 'Knowledge extraction',    body: 'Automatically surface trends, themes, and key concepts.' },
]

const BENEFITS = ['Faster literature reviews', 'Improved research quality', 'Better evidence gathering', 'Reduced manual effort', 'Increased productivity', 'Faster knowledge discovery', 'More reliable insights', 'Better collaboration']

const STATS = [
  { n: '10×',  raw: '10×',  label: 'Faster literature reviews across research teams', source: 'source: 9 research customer surveys · 2026' },
  { n: '100%', raw: '100%', label: 'Of claims cited to the source paper & page',      source: 'source: ATG answer logs' },
  { n: '8h',   raw: '8h',   label: 'Saved per researcher, per week',                  source: 'source: self-reported · validated' },
  { n: '12k',  raw: '12k',  label: 'Papers searchable in a typical lab library',      source: 'source: median ATG deployment' },
]

const LOGOS = ['Quanta Lab', 'Helio Health', 'Northwind', 'Orbit', 'Parallax', 'Meridian', 'Atlas Robotics', 'Vector Bank', 'Lattice', 'Finch Legal', 'Cascade', 'Beacon AI']
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS] // for seamless marquee

const MORE = [
  { icon: '◎', title: 'Researchers',     desc: 'Analyze academic papers, compare studies, and uncover insights faster with source-backed answers.', link: 'Book a demo',            href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '◆', title: 'Revenue teams',   desc: 'Turn market reports, industry studies, and analyst research into actionable insights.',               link: 'Explore sales use case', href: '/use-cases/sales' },
  { icon: '◉', title: 'Operations teams', desc: 'Make institutional knowledge searchable across teams, projects, and regions.',                        link: 'Book a demo',            href: 'https://calendly.com/nparikh-clarant/30min' },
  { icon: '✦', title: 'Customer success', desc: 'Access product documentation, research findings, and customer insights instantly.',                   link: 'Book a demo',            href: 'https://calendly.com/nparikh-clarant/30min' },
]

export default function ResearcherPage() {
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
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For researchers, analysts &amp; academics</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI Research Assistant</em> that reads every paper for you.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI Research Assistant from Clarant reads research papers, journals, reports, theses, datasets, and academic documents — then answers questions with the exact source cited. Accelerate literature reviews, uncover insights faster, and spend more time on discovery instead of searching through hundreds of pages.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="https://app.clarant.ai/login">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="https://calendly.com/nparikh-clarant/30min">Schedule Demo</a>
              </div>
            </div>

            {/* Hero visual — 3 floating answer cards */}
            <div className="persona-visual hero-anim" style={{ animationDelay: '200ms' }} role="img" aria-label="Three illustrative research answer cards">
              <div className="pv-card pv-card-a float-card" style={{ animationDelay: '400ms' }}>
                <div className="pv-h">Research question</div>
                <p className="pv-t">What methods did 2024 studies on gut–brain axis use?</p>
                <span className="pv-cite">● 38 papers · PubMed · Zotero</span>
              </div>
              <div className="pv-card pv-card-b float-card" style={{ animationDelay: '550ms' }}>
                <div className="pv-h">Synthesis · 9s</div>
                <p className="pv-t">26 used RCTs, 8 meta-analyses. Common limitation: small samples (n&lt;50).</p>
                <span className="pv-cite">12 papers cited</span>
                <div className="pv-bar"><i className="pv-bar-fill"></i></div>
              </div>
              <div className="pv-card pv-card-c float-card" style={{ animationDelay: '700ms' }}>
                <div className="pv-h">Source · Chen et al. 2024</div>
                <p className="pv-t">Methods §3.2 — randomized, double-blind, n = 42</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI Research Assistant — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              An AI Research Assistant helps researchers, analysts, students, scientists, and knowledge workers understand large volumes of information quickly. It reads and analyzes research documents, identifies key findings, methodologies, and conclusions, then provides grounded answers with citations back to the original source. Instead of manually reviewing dozens of papers, users can get trusted insights in seconds.
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
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI Research Assistant: step-by-step.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36, '--reveal-delay': '60ms' } as any}>
              Getting started takes just a few minutes. Upload your research documents, ask questions, verify sources, and accelerate your research process.
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
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Clarant related to AI Document Intelligence for Researchers.</h2>
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
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI Document Intelligence for Researchers — features, benefits &amp; key capabilities.</h2>

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
              <span className="eyebrow">Benefits for researchers and organizations</span>
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

        {/* ── QUOTE ── */}
        {/*
        <section className="persona-quote" aria-labelledby="quote-h">
          <div className="container persona-quote-inner">
            <div className="persona-quote-card" data-reveal="fade-right">
              <div className="persona-quote-card-inner">
                <div className="name">Dr. Lena Müller</div>
                <div className="role">Principal Investigator · Quanta Lab</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">A literature review that used to eat three weeks of my postdocs&apos; time now takes an afternoon — and every claim cites the exact paper and page, so peer reviewers can follow our reasoning.</q>
              <div className="persona-quote-attr">— Quanta Lab · 40 researchers · life sciences</div>
            </div>
          </div>
        </section>
/*}
        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes research teams report.</h2>
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
              <span className="eyebrow" id="cs-logos-h">Trusted by research teams at</span>
            </div>
          </div>
          <div className="logo-marquee-track" role="list" aria-label="Trusted research teams">
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
