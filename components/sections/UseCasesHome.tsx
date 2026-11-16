import { ArrowUpRight, Layers, type IconProps } from '@/components/icons/Icons'

/* Homepage "Explore What You Can Do with Clarant" — reference-matched list layout.
   Separate from the shared <UseCases /> card grid (that one still powers /use-cases).
   Pure-black section, cyan accents, 2×2 on desktop → 1 column on mobile. */

// Section-only line icons (scales / book / trending) — the shared Icons map has no
// equivalents; Layers + ArrowUpRight are reused from it.
const Scales = (p: IconProps) => (
  <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v18M7 21h10M5 7l-3 6a3 3 0 0 0 6 0l-3-6ZM19 7l-3 6a3 3 0 0 0 6 0l-3-6ZM5 7h14" />
  </svg>
)
const Book = (p: IconProps) => (
  <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 6c-2-1.3-4-1.5-7-1.5V18c3 0 5 .2 7 1.5 2-1.3 4-1.5 7-1.5V4.5C16 4.5 14 4.7 12 6ZM12 6v13.5" />
  </svg>
)
const Trending = (p: IconProps) => (
  <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 17l6-6 4 4 7-7M15 5h6v6" />
  </svg>
)

const ITEMS = [
  { Icon: Scales,   title: 'AI for Legal Documents',     href: '/use-cases/ai-for-legal-documents',
    desc: 'Review contracts, find important clauses, and extract key details from legal documents to support faster document review.' },
  { Icon: Book,     title: 'AI for Research',            href: '/use-cases/researcher',
    desc: 'Search relevant information, summarize lengthy documents, and turn complex material into clear, useful findings.' },
  { Icon: Trending, title: 'AI for Sales',               href: '/use-cases/sales',
    desc: 'Bring customer conversations and business information together to prepare for meetings, find deal details, and follow up on the next steps.' },
  { Icon: Layers,   title: 'AI for Business Operations', href: '/use-cases/business-operations-strategy-management',
    desc: 'Find process information, review project updates, and identify pending tasks to help your team keep work moving.' },
]

export default function UseCasesHome() {
  return (
    <>
      <style>{`
        .uc2 { background: var(--bg); }
        .uc2-head { max-width: 640px; margin-bottom: 48px; }
        .uc2-h {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(30px, 3.6vw, 46px); line-height: 1.06; letter-spacing: -0.03em;
          color: var(--fg); margin: 0 0 20px;
        }
        .uc2-lede { color: var(--fg-muted); font-size: 17px; line-height: 1.7; margin: 0; max-width: 52ch; }

        .uc2-rows { border-top: 1px solid var(--border); }
        .uc2-row {
          display: grid; grid-template-columns: 1fr 1fr;
          column-gap: clamp(32px, 6vw, 96px);
          border-bottom: 1px solid var(--border);
        }
        .uc2-item {
          display: grid; grid-template-columns: auto 1fr auto; gap: 18px; align-items: start;
          padding: 28px 0;
          text-decoration: none; color: inherit;
        }
        .uc2-tile {
          width: 44px; height: 44px; border-radius: 12px; flex: none;
          display: inline-flex; align-items: center; justify-content: center;
          color: #00C8F5; background: rgba(0, 200, 245, 0.07);
          border: 1px solid rgba(0, 200, 245, 0.35);
          transition: background .25s ease, border-color .25s ease;
        }
        .uc2-title { font-family: var(--font-display); font-weight: 700; font-size: 19px; color: var(--fg); margin: 0 0 8px; letter-spacing: -0.01em; }
        .uc2-desc { color: var(--fg-muted); font-size: 14.5px; line-height: 1.6; margin: 0; max-width: 42ch; }
        .uc2-arrow { color: #00C8F5; margin-top: 2px; transition: transform .25s ease; }
        .uc2-item:hover .uc2-arrow { transform: translate(2px, -2px); }
        .uc2-item:hover .uc2-tile { background: rgba(0, 200, 245, 0.14); border-color: rgba(0, 200, 245, 0.6); }
        .uc2-item:focus-visible { outline: 2px solid #00C8F5; outline-offset: 4px; border-radius: 8px; }

        @media (max-width: 760px) {
          .uc2-row { grid-template-columns: 1fr; }
          .uc2-row > .uc2-item + .uc2-item { border-top: 1px solid var(--border); }
          .uc2-head { margin-bottom: 32px; }
          .uc2-desc { max-width: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .uc2-arrow, .uc2-tile { transition: none; }
          .uc2-item:hover .uc2-arrow { transform: none; }
        }
      `}</style>

      <section id="usecases" className="uc2 section">
        <div className="container">
          <div className="uc2-head" data-reveal="fade-up">
            <h2 className="uc2-h">Explore What You<br />Can Do with <span style={{ color: '#30b4e6' }}>Clarant</span></h2>
            <p className="uc2-lede">
              Clarant helps teams turn business information into useful answers and action.
              Explore how it supports different workflows across your organization.
            </p>
          </div>

          <div className="uc2-rows">
            {[ITEMS.slice(0, 2), ITEMS.slice(2, 4)].map((row, r) => (
              <div className="uc2-row" key={r}>
                {row.map(({ Icon, title, desc, href }, i) => (
                  <a key={href} href={href} className="uc2-item" data-reveal="fade-up"
                    style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
                    aria-label={`${title} — explore use case`}>
                    <span className="uc2-tile"><Icon size={22} /></span>
                    <span>
                      <h3 className="uc2-title">{title}</h3>
                      <p className="uc2-desc">{desc}</p>
                    </span>
                    <ArrowUpRight size={18} className="uc2-arrow" />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
