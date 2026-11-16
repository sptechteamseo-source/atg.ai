import type { ReactNode } from 'react'

/* "One AI Platform to Find, Understand, and Act" — ported from the reference:
   a responsive auto-fit grid of four capabilities, each a borderless column with
   a top rule, an accent icon chip, title and description. Exact reference SVG
   icons; colors mapped to the site's tokens for light/dark. id="unified-search"
   preserved for the footer anchor. */

interface Capability {
  icon: ReactNode
  title: string
  desc: string
}

const CAPABILITIES: Capability[] = [
  {
    // file-search
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
        <circle cx="11.5" cy="14.5" r="2.5" /><path d="m13.3 16.3 1.7 1.7" />
      </svg>
    ),
    title: 'Find Answers in Your Documents',
    desc: 'Upload documents and ask questions in plain language. Clarant finds relevant details and answers using your files, without public web searches.',
  },
  {
    // zap
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Act Across Your Business Apps',
    desc: 'Connect Gmail, Outlook, Slack, and Notion through MCP. Ask Clarant to complete supported tasks and share the results with you.',
  },
  {
    // file-pen
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
      </svg>
    ),
    title: 'Create Documents Using Real Business Information',
    desc: 'Generate reports, summaries, and drafts using information from your uploaded files and connected apps, keeping outputs relevant to your business.',
  },
  {
    // bell
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    title: 'Identify What Needs Attention',
    desc: 'Surface important updates, identify pending tasks, and organize next steps so your team knows what needs attention and what to do next.',
  },
]

export default function UnifiedSearch() {
  return (
    <>
      <style>{`
        .plat-head { max-width: 720px; margin-bottom: clamp(44px, 5vw, 64px); }
        .plat-h {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(30px, 3.6vw, 46px); line-height: 1.08;
          letter-spacing: -0.03em; color: var(--fg); margin-bottom: 18px; text-wrap: balance;
        }
        .plat-lede { font-size: 17px; line-height: 1.7; color: var(--fg-muted); }
        .plat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
          gap: clamp(32px, 3vw, 40px);
        }
        .plat-col {
          padding-top: 24px; border-top: 1px solid color-mix(in oklab, var(--fg) 14%, transparent);
        }
        .plat-ic {
          display: flex; width: 44px; height: 44px; border-radius: 12px;
          align-items: center; justify-content: center; margin-bottom: 20px;
          color: var(--accent);
          border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
          background: color-mix(in oklab, var(--accent) 8%, transparent);
        }
        .plat-col-title {
          font-family: var(--font-display); font-size: 19px; font-weight: 600;
          line-height: 1.3; color: var(--fg); margin-bottom: 10px;
        }
        .plat-col-desc { font-size: 15px; line-height: 1.65; color: var(--fg-muted); }
      `}</style>

      <section id="unified-search" className="platform">
        <div className="container">
          <div className="plat-head" data-reveal="fade-up">
            <h2 className="plat-h">One AI Platform to Find, <span style={{ color: '#30b4e6' }}>Understand, and Act</span></h2>
            <p className="plat-lede">
              Clarant brings together the capabilities of an AI business assistant, a document
              search solution, and a connected business workspace.
            </p>
          </div>
          <div className="plat-grid">
            {CAPABILITIES.map((c, i) => (
              <div key={c.title} className="plat-col" data-reveal="fade-up" style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                <span className="plat-ic" aria-hidden="true">{c.icon}</span>
                <h3 className="plat-col-title">{c.title}</h3>
                <p className="plat-col-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
