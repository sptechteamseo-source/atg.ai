import type { ReactNode } from 'react'
import { STEPS } from '@/lib/data'

/* "How Clarant Works?" — ported from the reference: four steps, each a 64px
   pulsing ring holding an animated SVG icon, joined by a line with a traveling
   dot, then number / title / text. The four icons (connect-plugs, analyze-radar,
   surface-feed, act-bolt) and their animations are the reference's own, with
   colors mapped to the site's tokens so they read in both themes. */

// Common stroke defaults inherit to each icon's children via the <svg>.
const svgBase = {
  width: 28, height: 28, viewBox: '0 0 24 24', 'aria-hidden': true,
  stroke: 'var(--accent)', strokeWidth: 1.6, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, fill: 'none', style: { overflow: 'visible' },
}

const STEP_ICONS: ReactNode[] = [
  // 0 — Connect: two plugs meeting, with a spark
  <svg key="connect" {...svgBase}>
    <path d="M0.5 12H3" opacity="0.6" /><path d="M21 12h2.5" opacity="0.6" />
    <g style={{ animation: 'hw-plugL 2.4s cubic-bezier(.4,0,.2,1) infinite' }}>
      <path d="M3 12h1" />
      <rect x="4" y="8.5" width="5" height="7" rx="1.5" fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
      <path d="M9 10.5h2.2M9 13.5h2.2" />
    </g>
    <g style={{ animation: 'hw-plugR 2.4s cubic-bezier(.4,0,.2,1) infinite' }}>
      <rect x="13" y="8" width="6" height="8" rx="1.5" stroke="var(--fg)" />
      <path d="M19 12h2" stroke="var(--fg)" />
    </g>
    <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'hw-spark 2.4s ease-out infinite' }}>
      <path d="M12 5.5v2M12 16.5v2M9.5 6.5l.8 1.4M14.5 6.5l-.8 1.4M9.5 17.5l.8-1.4M14.5 17.5l-.8-1.4" strokeWidth="1.3" />
    </g>
  </svg>,

  // 1 — Analyze: radar sweep with blips
  <svg key="analyze" {...svgBase}>
    <circle cx="12" cy="12" r="9.5" opacity="0.7" />
    <circle cx="12" cy="12" r="5.5" strokeDasharray="1.5 2.5" opacity="0.45" />
    <path d="M12 2.5v19M2.5 12h19" opacity="0.18" />
    <path d="M12 12 12 2.5A9.5 9.5 0 0 1 18.7 5.3Z" fill="color-mix(in oklab, var(--accent) 45%, transparent)" stroke="none"
      style={{ transformBox: 'view-box', transformOrigin: '12px 12px', animation: 'hw-spin 2.4s linear infinite' }} />
    <circle cx="16.5" cy="8.5" r="1.6" fill="var(--fg)" stroke="none" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'hw-blip 2.4s ease-out .1s infinite' }} />
    <circle cx="8" cy="15.5" r="1.6" fill="var(--accent)" stroke="none" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'hw-blip 2.4s ease-out 1.3s infinite' }} />
    <circle cx="12" cy="12" r="1.3" fill="var(--accent)" stroke="none" />
  </svg>,

  // 2 — Surface: a scrolling feed of items
  <svg key="surface" {...svgBase}>
    <defs><clipPath id="hw-feed-clip"><rect x="4" y="5" width="16" height="14" rx="2" /></clipPath></defs>
    <rect x="3" y="3" width="18" height="18" rx="3.5" />
    <g clipPath="url(#hw-feed-clip)">
      <g style={{ animation: 'hw-feed 1.1s linear infinite' }}>
        {[{ y: 8, hi: true }, { y: 14 }, { y: 20, hi: true }, { y: 26 }].map((r, i) => (
          <g key={i}>
            <circle cx="7.5" cy={r.y} r="1.2" fill={r.hi ? 'var(--accent)' : 'color-mix(in oklab, var(--fg) 50%, transparent)'} stroke="none" />
            <rect x="10" y={r.y - 1.1} width={r.hi ? 8 : 6} height="2.2" rx="1.1" fill={r.hi ? 'var(--accent)' : 'color-mix(in oklab, var(--fg) 35%, transparent)'} stroke="none" />
          </g>
        ))}
      </g>
    </g>
    <circle cx="19.5" cy="4.5" r="2.2" fill="var(--accent)" stroke="var(--bg)" strokeWidth="1" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'hw-node 1.2s ease-in-out infinite' }} />
  </svg>,

  // 3 — Act: a bolt charging up with rays
  <svg key="act" {...svgBase}>
    <defs><clipPath id="hw-bolt-clip"><path d="M13.5 2 4.5 13.5h6.5L10 22l9.5-12H13l.5-8Z" /></clipPath></defs>
    <g clipPath="url(#hw-bolt-clip)">
      <rect x="3" y="2" width="18" height="20" fill="var(--accent)" stroke="none"
        style={{ transformBox: 'fill-box', transformOrigin: 'center bottom', animation: 'hw-charge 2.4s ease-in-out infinite' }} />
    </g>
    <path d="M13.5 2 4.5 13.5h6.5L10 22l9.5-12H13l.5-8Z" />
    <g style={{ transformBox: 'view-box', transformOrigin: '12px 12px', animation: 'hw-spark 2.4s ease-out .9s infinite' }}>
      <path d="M2 7.5 3.8 8.5M22 16.5l-1.8-1M21 6l-1.6 1.2M3 18l1.6-1.2" strokeWidth="1.3" />
    </g>
  </svg>,
]

export default function HowItWorks() {
  return (
    <>
      <style>{`
        .how-h {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(30px, 3.6vw, 46px); line-height: 1.08; letter-spacing: -0.03em;
          color: var(--fg); margin-bottom: clamp(44px, 5vw, 64px);
        }
        .how-grid {
          list-style: none; margin: 0; padding: 0; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
          gap: clamp(28px, 3vw, 32px);
        }
        .how-step { display: flex; flex-direction: column; gap: 16px; }
        .how-step-row { display: flex; align-items: center; gap: 14px; }
        .how-ring {
          flex: none; width: 64px; height: 64px; border-radius: 9999px;
          border: 1px solid color-mix(in oklab, var(--accent) 45%, transparent);
          background: radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%);
          display: flex; align-items: center; justify-content: center;
          animation: hw-ring 4s ease-in-out infinite;
        }
        .how-line { position: relative; flex: 1; height: 1px; }
        .how-line.has-next { background: linear-gradient(90deg, color-mix(in oklab, var(--accent) 55%, transparent), var(--border)); }
        .how-dot {
          position: absolute; top: -2px; left: 0; width: 5px; height: 5px; border-radius: 9999px;
          background: var(--accent); box-shadow: 0 0 10px var(--accent);
          animation: hw-travel 4s linear infinite;
        }
        .how-num { font-family: var(--font-label); font-size: 12.5px; font-weight: 600; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 6px; }
        .how-title { font-family: var(--font-display); font-size: 21px; font-weight: 600; color: var(--fg); margin-bottom: 10px; }
        .how-text { font-size: 15px; line-height: 1.65; color: var(--fg-muted); }

        @keyframes hw-ring {
          0%, 100% { box-shadow: 0 0 0 0 transparent; border-color: color-mix(in oklab, var(--accent) 45%, transparent); }
          12% { box-shadow: 0 0 0 8px color-mix(in oklab, var(--accent) 12%, transparent), 0 0 24px color-mix(in oklab, var(--accent) 35%, transparent); border-color: var(--accent); }
          25% { box-shadow: 0 0 0 0 transparent; border-color: color-mix(in oklab, var(--accent) 45%, transparent); }
        }
        @keyframes hw-travel { 0% { left: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        @keyframes hw-plugL { 0%, 100% { transform: translateX(-4px); } 35%, 70% { transform: translateX(0); } }
        @keyframes hw-plugR { 0%, 100% { transform: translateX(4px); } 35%, 70% { transform: translateX(0); } }
        @keyframes hw-spark { 0%, 33% { opacity: 0; transform: scale(.3); } 42% { opacity: 1; transform: scale(1.25); } 60%, 100% { opacity: 0; transform: scale(1); } }
        @keyframes hw-spin { to { transform: rotate(360deg); } }
        @keyframes hw-blip { 0%, 100% { opacity: 0; transform: scale(.4); } 10% { opacity: 1; transform: scale(1.3); } 40% { opacity: .8; transform: scale(1); } 70% { opacity: 0; } }
        @keyframes hw-feed { from { transform: translateY(0); } to { transform: translateY(-6px); } }
        @keyframes hw-node { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
        @keyframes hw-charge { 0% { transform: scaleY(0); opacity: 1; } 55%, 85% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .how-ring, .how-dot, .how-ring svg * { animation: none !important; }
        }
      `}</style>

      <section id="product" className="how">
        <div className="container">
          <h2 className="how-h" data-reveal="fade-up">How Clarant <span style={{ color: '#30b4e6' }}>Works?</span></h2>
          <ol className="how-grid">
            {STEPS.map((s, i) => (
              <li key={s.n} className="how-step" data-reveal="fade-up" style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                <div className="how-step-row">
                  <span className="how-ring" style={{ animationDelay: `${i}s` }}>{STEP_ICONS[i]}</span>
                  <span className={`how-line ${i < STEPS.length - 1 ? 'has-next' : ''}`} aria-hidden="true">
                    {i < STEPS.length - 1 && <span className="how-dot" style={{ animationDelay: `${i + 0.4}s` }} />}
                  </span>
                </div>
                <div>
                  <div className="how-num">{s.n}</div>
                  <h3 className="how-title">{s.title}</h3>
                  <p className="how-text">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
