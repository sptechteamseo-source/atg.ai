import type { ReactNode } from 'react'

/* "Most enterprise AI waits for you to ask" — ported from the reference: a two
   column layout with the pitch on the left and, on the right, a disabled ask
   pill, a "Never asked" connector, and three accent cards of work that slips.
   Exact reference icons; colors mapped to the site's tokens for light/dark. */

const NEVER_ASKED: { icon: ReactNode; text: string }[] = [
  {
    // file-text
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" />
        <path d="M9 13h6" /><path d="M9 17h4" />
      </svg>
    ),
    text: 'The proposal you promised on Tuesday’s call',
  },
  {
    // mail
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
      </svg>
    ),
    text: 'The client who stopped replying',
  },
  {
    // clock
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
      </svg>
    ),
    text: 'The deal that hasn’t moved in three weeks',
  },
]

export default function Showcase() {
  return (
    <>
      <style>{`
        .pro-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
          gap: clamp(48px, 7vw, 112px); align-items: center;
        }
        .pro-eyebrow {
          font-family: var(--font-label); font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px;
        }
        .pro-h {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(30px, 3.6vw, 46px); line-height: 1.04;
          letter-spacing: -0.035em; color: var(--fg); margin-bottom: 28px; text-wrap: balance;
        }
        .pro-lede { font-size: clamp(16px, 1.45vw, 18px); line-height: 1.7; color: var(--fg-muted); max-width: 48ch; text-wrap: pretty; }
        .pro-lede strong { color: var(--fg); font-weight: 500; }

        .pro-ask {
          display: flex; align-items: center; gap: 12px; height: 56px;
          padding: 0 8px 0 18px; border-radius: 9999px;
          border: 1px solid var(--border); background: var(--bg-elevated); opacity: 0.6;
        }
        .pro-ask-ph { flex: 1; font-size: 15px; color: var(--fg-subtle); }
        .pro-ask-go { width: 40px; height: 40px; border-radius: 9999px; background: var(--bg-sunken); display: flex; align-items: center; justify-content: center; color: var(--fg-subtle); }
        .pro-connect { display: flex; align-items: center; gap: 12px; padding: 18px 0 18px 26px; }
        .pro-connect-line { width: 1px; height: 36px; border-left: 1px dashed color-mix(in oklab, var(--fg) 22%, transparent); }
        .pro-connect-label { font-family: var(--font-label); font-size: 12.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-subtle); }
        .pro-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .pro-item {
          display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 14px;
          border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent);
          background: color-mix(in oklab, var(--accent) 6%, transparent);
          transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
        }
        .pro-item:hover { transform: translateX(3px); box-shadow: 0 14px 34px -22px var(--accent-glow); }
        .pro-item-ic {
          flex: none; width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; color: var(--accent);
          background: var(--bg); border: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
        }
        .pro-item-text { font-size: 16.5px; line-height: 1.45; color: var(--fg); }
      `}</style>

      <section className="proactive">
        <div className="container pro-grid">
          <div data-reveal="fade-up">
            <div className="pro-eyebrow">Proactive intelligence</div>
            <h2 className="pro-h">Most enterprise AI waits for you to ask</h2>
            <p className="pro-lede">
              Most enterprise AI platforms are built around a question box. They index your
              company&apos;s knowledge and answer well once you know what to ask.{' '}
              <strong>What slips is the work nobody thought to ask about:</strong>
            </p>
          </div>

          <div data-reveal="fade-up" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            <div className="pro-ask" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--fg-subtle)' }}>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <span className="pro-ask-ph">Ask a question…</span>
              <span className="pro-ask-go">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </div>

            <div className="pro-connect" aria-hidden="true">
              <span className="pro-connect-line" />
              <span className="pro-connect-label">Never asked</span>
            </div>

            <ul className="pro-list">
              {NEVER_ASKED.map((n) => (
                <li key={n.text} className="pro-item">
                  <span className="pro-item-ic" aria-hidden="true">{n.icon}</span>
                  <span className="pro-item-text">{n.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
