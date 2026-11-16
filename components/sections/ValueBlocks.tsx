import type { ReactNode } from 'react'
import Image from 'next/image'

/* "Team collaboration" + "Business intelligence" — ported from the reference:
   two mirrored two-column blocks, each with text and a framed visual (an offset
   accent border behind a 4:3 rounded card) holding a supplied illustration.
   Colors mapped to the site's tokens; fonts + section spacing are the site's. */

// Shared workspace illustration (supplied). Shown in full (object-fit: contain,
// intrinsic ratio) rather than cropped, so every person/laptop stays visible.
function TeamScene() {
  return (
    <Image
      src="/dark-saas-collaboration-dashboard.webp"
      alt="A team collaborating in a shared Clarant workspace"
      width={1214}
      height={1294}
      sizes="(max-width: 860px) 100vw, 560px"
      style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
      priority={false}
    />
  )
}

// Business insights illustration (supplied). Shown in full (object-fit: contain,
// intrinsic ratio) rather than cropped, so the whole dashboard scene stays visible.
function InsightsScene() {
  return (
    <Image
      src="/neon-ai-collaboration-dashboard.webp"
      alt="A Clarant user reviewing business insights and reports"
      width={1536}
      height={1024}
      sizes="(max-width: 860px) 100vw, 560px"
      style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
      priority={false}
    />
  )
}

interface Block {
  id: string
  eyebrow: string
  title: string
  subhead: string
  body: { text: string; lead?: boolean }[]
  visual: ReactNode
  reverse?: boolean
  sunken?: boolean
  contain?: boolean
}

const BLOCKS: Block[] = [
  {
    id: 'team',
    eyebrow: 'Team collaboration',
    title: 'One Shared Intelligence Layer for Your Team',
    subhead: 'Give Everyone a Better Way to Work with Information.',
    body: [
      { text: 'When knowledge is spread across people and platforms, teams spend valuable time tracking answers and repeating work.', lead: true },
      { text: 'Clarant allows workspace owners to invite teammates into a shared environment where they can ask questions and work with available business information. This helps teams collaborate, prepare useful documents, and coordinate the next steps.' },
    ],
    visual: <TeamScene />,
    contain: true,
  },
  {
    id: 'intelligence',
    eyebrow: 'Business intelligence',
    title: 'Support Better Business Decisions',
    subhead: 'Turn Business Information into Useful Insights.',
    body: [
      { text: 'An artificial intelligence platform can help businesses make better use of the information they already have. Clarant helps teams retrieve relevant details, summarize information, prepare reports, and identify priorities, all within one connected workspace.' },
    ],
    visual: <InsightsScene />,
    reverse: true,
    contain: true,
  },
]

export default function ValueBlocks() {
  return (
    <>
      <style>{`
        .vb { overflow: hidden; }
        .vb.is-sunken { background: var(--bg-sunken); }
        .vb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
          gap: clamp(48px, 7vw, 104px); align-items: center;
        }
        .vb-eyebrow { font-family: var(--font-label); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
        .vb-h { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 3.6vw, 46px); line-height: 1.08; letter-spacing: -0.03em; color: var(--fg); margin-bottom: 16px; text-wrap: balance; }
        .vb-sub { font-family: var(--font-display); font-size: 18px; font-weight: 500; line-height: 1.4; color: var(--accent); margin-bottom: 28px; }
        .vb-body { display: flex; flex-direction: column; gap: 20px; }
        .vb-body p { font-size: 16px; line-height: 1.7; color: var(--fg-muted); margin: 0; text-wrap: pretty; }
        .vb-body p.is-lead { font-family: var(--font-display); font-size: 19px; line-height: 1.55; color: var(--fg); font-weight: 500; }

        /* framed visual: offset accent border behind a 4:3 rounded card */
        .vb-frame { position: relative; width: 100%; max-width: 560px; margin: 0 auto; padding: 0 clamp(10px, 2vw, 16px) clamp(10px, 2vw, 16px) 0; }
        .vb-frame-border { position: absolute; top: clamp(10px, 2vw, 16px); left: clamp(10px, 2vw, 16px); right: 0; bottom: 0; border-radius: 24px; border: 1px solid color-mix(in oklab, var(--accent) 35%, transparent); }
        .vb-card { position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 20px; overflow: hidden; background: var(--bg-elevated); border: 1px solid var(--border); }
        /* contain mode: card height follows the full image (no 4:3 crop) */
        .vb-card.is-contain { aspect-ratio: auto; }
        .vb.is-reverse .vb-grid { direction: rtl; }
        .vb.is-reverse .vb-grid > * { direction: ltr; }
        @media (max-width: 860px) { .vb.is-reverse .vb-grid { direction: ltr; } }
      `}</style>

      {BLOCKS.map((b) => (
        <section key={b.id} id={b.id} className={`vb ${b.reverse ? 'is-reverse' : ''} ${b.sunken ? 'is-sunken' : ''}`}>
          <div className="container vb-grid">
            <div className="vb-frame" data-reveal={b.reverse ? 'fade-left' : 'fade-right'}>
              <span className="vb-frame-border" aria-hidden="true" />
              <div className={`vb-card ${b.contain ? 'is-contain' : ''}`}>{b.visual}</div>
            </div>
            <div data-reveal={b.reverse ? 'fade-right' : 'fade-left'}>
              <div className="vb-eyebrow">{b.eyebrow}</div>
              <h2 className="vb-h">{b.title}</h2>
              <h3 className="vb-sub">{b.subhead}</h3>
              <div className="vb-body">
                {b.body.map((p, i) => (
                  <p key={i} className={p.lead ? 'is-lead' : ''}>{p.text}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
