/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'

/* "Works with the tools you already use." — ported from the reference: a category
   list (real brand logos on white tiles) beside an animated connector constellation
   — a glowing Clarant hub, pulsing wires with flowing beams, floating logo tiles and
   slow rotating rings. Logos are bundled locally in /public/logos (no external calls);
   the section is token-themed while the tiles/hub carry the reference's own treatment. */

const LOGO: Record<string, string> = {
  Gmail: '/logos/gmail.svg',
  Outlook: '/logos/outlook.png',
  'Google Calendar': '/logos/google-calendar.svg',
  'Google Drive': '/logos/google-drive.svg',
  Dropbox: '/logos/dropbox.svg',
  Notion: '/logos/notion-dark.svg',
  Slack: '/logos/slack.png',
  'Microsoft Teams': '/logos/teams.png',
  Salesforce: '/logos/salesforce.png',
  HubSpot: '/logos/hubspot.svg',
  Asana: '/logos/asana.svg',
}

const CATEGORIES: { label: string; tools: string[] }[] = [
  { label: 'Email & calendar', tools: ['Gmail', 'Outlook', 'Google Calendar'] },
  { label: 'Files & knowledge', tools: ['Google Drive', 'Dropbox', 'Notion'] },
  { label: 'Communication', tools: ['Slack', 'Microsoft Teams'] },
  { label: 'CRM & projects', tools: ['Salesforce', 'HubSpot', 'Asana'] },
]

// Constellation: 11 logos in two rings around the Clarant hub.
const OUTER = ['Salesforce', 'Gmail', 'Google Drive', 'Slack', 'Outlook', 'Dropbox']
const INNER = ['Notion', 'Google Calendar', 'HubSpot', 'Asana', 'Microsoft Teams']

function place(names: string[], radius: number, offset: number) {
  return names.map((name, i) => {
    const a = (i / names.length) * Math.PI * 2 + offset
    return { name, x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a) }
  })
}
const CHIPS = [...place(OUTER, 38, -Math.PI / 2), ...place(INNER, 21, -Math.PI / 2 + 0.6)]

export default function Integrations() {
  return (
    <>
      <style>{`
        .int-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); gap: clamp(40px, 6vw, 80px); align-items: center; }
        .int-eyebrow { font-family: var(--font-label); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; }
        .int-h { font-family: var(--font-display); font-weight: 700; font-size: clamp(30px, 3.6vw, 46px); line-height: 1.08; letter-spacing: -0.03em; color: var(--fg); margin-bottom: 18px; text-wrap: balance; }
        .int-lede { font-size: 17px; line-height: 1.7; color: var(--fg-muted); margin-bottom: 36px; max-width: 48ch; }
        .int-cats { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 20px; }
        .int-cat { display: grid; grid-template-columns: 170px 1fr; gap: 16px; align-items: center; padding-top: 18px; border-top: 1px solid var(--border); }
        @media (max-width: 480px) { .int-cat { grid-template-columns: 1fr; gap: 10px; } }
        .int-cat-label { font-family: var(--font-display); font-weight: 600; font-size: 14.5px; color: var(--fg); }
        .int-cat-tools { display: flex; gap: 10px; }
        .int-tile { width: 38px; height: 38px; border-radius: 10px; flex: none; display: inline-flex; align-items: center; justify-content: center; background: #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.12); border: 1px solid var(--border); }
        .int-tile img { display: block; width: 56%; height: 56%; object-fit: contain; }

        /* ── Constellation ── */
        .int-stage { position: relative; width: 100%; max-width: 560px; margin: 0 auto; aspect-ratio: 1 / 1; }
        .int-rings { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
        .int-rings circle { fill: none; stroke: color-mix(in oklab, var(--accent) 24%, transparent); stroke-width: .25; }
        .int-rings .r-a { animation: int-spin 140s linear infinite; transform-origin: 50px 50px; }
        .int-rings .r-b { animation: int-spin 110s linear infinite; transform-origin: 50px 50px; stroke-dasharray: 1.4 2.4; }
        .int-rings .r-c { animation: int-spinR 70s linear infinite; transform-origin: 50px 50px; stroke-dasharray: .6 3; }
        .int-wires { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; overflow: visible; }
        .int-wire { stroke: color-mix(in oklab, var(--accent) 22%, transparent); stroke-width: .3; }
        .int-beam { stroke: var(--accent); stroke-width: .6; stroke-linecap: round; stroke-dasharray: 7 93; }
        .int-hub { position: absolute; left: 50%; top: 50%; width: 22%; aspect-ratio: 1; transform: translate(-50%, -50%); z-index: 3; border-radius: 24%;
          background: radial-gradient(circle at 50% 36%, color-mix(in oklab, var(--accent) 26%, #111316), #111316);
          border: 1px solid color-mix(in oklab, var(--accent) 55%, transparent);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px -6px var(--accent-glow); }
        .int-hub img { display: block; width: 44%; height: 44%; object-fit: contain; }
        .int-hub-glow { position: absolute; left: 50%; top: 50%; width: 42%; aspect-ratio: 1; transform: translate(-50%, -50%); z-index: 2; border-radius: 50%;
          background: radial-gradient(closest-side, var(--accent-glow), transparent 70%); animation: int-glow 4s ease-in-out infinite; }
        .int-ripple { position: absolute; inset: -1px; border-radius: inherit; border: 1px solid var(--accent); animation: int-ring 4s ease-out infinite; pointer-events: none; }
        .int-chip { position: absolute; width: 11%; aspect-ratio: 1; transform: translate(-50%, -50%); z-index: 4; animation: int-float 6s ease-in-out infinite; }
        .int-chip-tile { position: absolute; inset: 0; border-radius: 22%; background: #FFFFFF; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; }
        .int-chip-tile img { display: block; width: 52%; height: 52%; object-fit: contain; }

        @keyframes int-spin { to { transform: rotate(360deg); } }
        @keyframes int-spinR { to { transform: rotate(-360deg); } }
        @keyframes int-ring { 0% { transform: scale(1); opacity: .7; } 80%, 100% { transform: scale(1.35); opacity: 0; } }
        @keyframes int-float { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 5px)); } }
        @keyframes int-glow { 0%, 100% { transform: translate(-50%, -50%) scale(.92); opacity: .55; } 50% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; } }
        @keyframes int-flow { 0% { stroke-dashoffset: 10; opacity: 0; } 8% { opacity: 1; } 70% { stroke-dashoffset: -88; opacity: 1; } 80%, 100% { stroke-dashoffset: -88; opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .int-rings .r-a, .int-rings .r-b, .int-rings .r-c, .int-hub-glow, .int-ripple, .int-chip, .int-beam { animation: none; } .int-beam { opacity: .6; } }
      `}</style>

      <section id="integrations" className="integrations">
        <div className="container int-grid">
          <div data-reveal="fade-up">
            <div className="int-eyebrow">Integrations</div>
            <h2 className="int-h">Works with the <span style={{ color: '#30b4e6' }}>tools you already use.</span></h2>
            <p className="int-lede">
              Connect the apps your team works in every day. Clarant reads from them, cites
              them, and acts in them with your approval.
            </p>
            <ul className="int-cats">
              {CATEGORIES.map((c) => (
                <li key={c.label} className="int-cat">
                  <span className="int-cat-label">{c.label}</span>
                  <span className="int-cat-tools">
                    {c.tools.map((t) => (
                      <span key={t} className="int-tile" title={t}><img src={LOGO[t]} alt={t} width={20} height={20} /></span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="int-stage" data-reveal="fade-up" style={{ '--reveal-delay': '120ms' } as CSSProperties} role="img" aria-label="Clarant connected to your tools">
            <svg className="int-rings" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="r-a" cx="50" cy="50" r="46" />
              <circle className="r-b" cx="50" cy="50" r="38" />
              <circle className="r-c" cx="50" cy="50" r="30" />
            </svg>
            <svg className="int-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {CHIPS.map((c, i) => (
                <g key={c.name}>
                  <line className="int-wire" x1="50" y1="50" x2={c.x} y2={c.y} pathLength={100} />
                  <line className="int-beam" x1="50" y1="50" x2={c.x} y2={c.y} pathLength={100} style={{ animation: `int-flow 3.6s cubic-bezier(.4,0,.6,1) ${(i * 0.32).toFixed(2)}s infinite` }} />
                </g>
              ))}
            </svg>
            <span className="int-hub-glow" aria-hidden="true" />
            <div className="int-hub">
              <span className="int-ripple" aria-hidden="true" />
              <img src="/clarant-mark.png" alt="Clarant" width={40} height={40} />
            </div>
            {CHIPS.map((c, i) => (
              <span key={c.name} className="int-chip" title={c.name} aria-hidden="true"
                style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${-(i * 0.6).toFixed(2)}s`, animationDuration: `${5.6 + (i % 3) * 0.6}s` }}>
                <span className="int-chip-tile"><img src={LOGO[c.name]} alt="" width={22} height={22} /></span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
