'use client'

import { useState } from 'react'
import { Icons, ArrowRight, Search, Spark } from '@/components/icons/Icons'
import { USE_CASES } from '@/lib/data'

/* ── AI Command Center + Interactive Industry Explorer ────────────────────────
   Styled entirely on the site design tokens (--bg/--fg/--accent/--border and the
   shared .eyebrow/.section-title/.section-lede classes) so it inherits the exact
   look of the Showcase section directly above it and transitions seamlessly in
   both light and dark. All 11 industries are visible at once in the rail so the
   "many industries, one AI" message lands before any scroll; hovering/selecting
   one drives a crossfading live preview. Reuses USE_CASES + Icons — no new deps,
   CSS-only animation. */

export default function UseCaseExplorer() {
  const [active, setActive] = useState(0)
  const uc = USE_CASES[active]

  return (
    <section id="usecases" className="cc">
      <div className="cc-bg" aria-hidden="true" />

      <div className="container">
        <header className="cc-head" data-reveal="fade-up">
          <span className="eyebrow">AI Command Center</span>
          <h2 className="section-title">
            One AI. <em>Every industry you work in.</em>
          </h2>
          <p className="section-lede">
            Clarant speaks the language of industries — from contracts to
            claims to campaigns. Pick a domain and see the answers it unlocks.
          </p>
        </header>

        <div className="cc-panel" data-reveal="fade-up">
          {/* Fake command bar — sets the "product surface" tone */}
          <div className="cc-bar" aria-hidden="true">
            <Search size={16} />
            <span className="cc-bar-text">
              Clarant across <b>{uc.category}</b>…
            </span>
            <kbd className="cc-kbd">⌘K</kbd>
          </div>

          <div className="cc-grid">
            {/* Industry rail */}
            <div className="cc-rail" role="tablist" aria-label="Industries">
              {USE_CASES.map((item, i) => {
                const Icon = Icons[item.icon] ?? Spark
                const on = i === active
                return (
                  <button
                    key={item.href}
                    role="tab"
                    aria-selected={on}
                    className={`cc-item${on ? ' on' : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                  >
                    <span className="cc-item-ic"><Icon size={17} /></span>
                    <span className="cc-item-txt">
                      <span className="cc-item-cat">{item.category}</span>
                      <span className="cc-item-title">{item.title}</span>
                    </span>
                    <ArrowRight size={15} className="cc-item-arw" />
                  </button>
                )
              })}
            </div>

            {/* Live preview */}
            <div className="cc-preview" role="tabpanel">
              <span className="cc-preview-glow" aria-hidden="true" />

              <div className="cc-preview-body" key={active}>
                <span className="cc-preview-ic">
                  {(() => {
                    const Icon = Icons[uc.icon] ?? Spark
                    return <Icon size={26} />
                  })()}
                </span>
                <span className="cc-preview-cat">{uc.category}</span>
                <h3 className="cc-preview-title">{uc.title}</h3>
                <p className="cc-preview-desc">{uc.desc}</p>
                <a className="cc-preview-cta" href={uc.href}>
                  Explore use case <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="cc-foot">
            <span className="cc-foot-meta">
              <b>{USE_CASES.length}</b> industries · one assistant
            </span>
            <a className="cc-foot-link" href="/use-cases">
              Explore all use cases <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .cc {
          position: relative; isolation: isolate; overflow: hidden;
          background: var(--bg);
          color: var(--fg);
        }
        /* Soft accent lighting — token-based so it stays subtle in both themes
           and never breaks the transition from the section above. */
        .cc-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
        .cc-bg::before {
          content: ""; position: absolute; border-radius: 50%; filter: blur(90px);
          width: 620px; height: 620px; top: -220px; left: -120px;
          background: radial-gradient(closest-side,
            color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%);
        }

        /* ── Header — inherits shared .eyebrow / .section-title / .section-lede ── */
        .cc-head { max-width: 760px; margin-bottom: 48px; }

        /* ── Panel — same surface as .card in the section above ── */
        .cc-panel {
          position: relative; border-radius: var(--radius-lg); overflow: hidden;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          transition: box-shadow .35s var(--ease), border-color var(--dur) var(--ease);
        }
        .cc-panel:hover {
          box-shadow: 0 24px 60px -24px color-mix(in oklab, var(--accent) 18%, transparent);
        }

        .cc-bar {
          display: flex; align-items: center; gap: 11px;
          padding: 15px 20px;
          border-bottom: 1px solid var(--border);
          color: var(--fg-subtle); font-size: 14px;
          background: var(--bg);
        }
        .cc-bar > svg { color: var(--accent); flex-shrink: 0; }
        .cc-bar-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cc-bar-text b { color: var(--fg); font-weight: 600; }
        .cc-kbd {
          font-family: var(--font-mono); font-size: 11px; color: var(--fg-muted);
          padding: 3px 8px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--bg-elevated);
        }

        .cc-grid {
          display: grid; grid-template-columns: minmax(0, 355px) 1fr;
          gap: 0; min-height: 420px;
        }

        /* ── Rail ── */
        .cc-rail {
          display: flex; flex-direction: column;
          padding: 12px; gap: 3px;
          border-right: 1px solid var(--border);
          max-height: 520px; overflow-y: auto;
        }
        .cc-item {
          display: flex; align-items: center; gap: 13px;
          width: 100%; text-align: left; cursor: pointer;
          padding: 11px 13px; border-radius: var(--radius-md);
          border: 1px solid transparent; background: transparent; color: inherit;
          transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease), transform var(--dur) var(--ease);
        }
        .cc-item:hover { background: var(--bg); }
        .cc-item-ic {
          display: grid; place-items: center; flex-shrink: 0;
          width: 38px; height: 38px; border-radius: 11px;
          color: var(--fg-muted);
          background: var(--bg);
          border: 1px solid var(--border);
          transition: color var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease);
        }
        .cc-item-txt { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
        .cc-item-cat {
          font-family: var(--font-label); font-size: 11px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase; color: var(--fg-subtle);
          transition: color var(--dur) var(--ease);
        }
        .cc-item-title {
          font-family: var(--font-display); font-size: 14.5px; font-weight: 500;
          color: var(--fg); line-height: 1.25;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cc-item-arw {
          color: var(--fg-subtle); flex-shrink: 0;
          opacity: 0; transform: translateX(-4px);
          transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease), color var(--dur) var(--ease);
        }
        .cc-item.on {
          background: var(--accent-soft);
          border-color: color-mix(in oklab, var(--accent) 35%, transparent);
        }
        .cc-item.on .cc-item-ic {
          color: var(--accent-fg);
          background: var(--accent);
          border-color: transparent;
          box-shadow: 0 6px 18px -6px color-mix(in oklab, var(--accent) 70%, transparent);
        }
        .cc-item.on .cc-item-cat { color: var(--accent); }
        .cc-item.on .cc-item-arw { opacity: 1; transform: translateX(0); color: var(--accent); }

        /* ── Preview ── */
        .cc-preview {
          position: relative; overflow: hidden;
          padding: clamp(28px, 4vw, 44px);
          display: flex; align-items: center;
          background: var(--bg-elevated);
        }
        .cc-preview-glow {
          position: absolute; z-index: 0; width: 340px; height: 340px;
          top: -80px; right: -60px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(closest-side, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%);
          filter: blur(30px);
        }
        .cc-preview-body {
          position: relative; z-index: 1; max-width: 460px;
          display: flex; flex-direction: column; align-items: flex-start;
          animation: ccFade .45s var(--ease);
        }
        @keyframes ccFade {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cc-preview-ic {
          display: grid; place-items: center;
          width: 58px; height: 58px; border-radius: 16px; color: var(--accent-fg);
          background: var(--accent);
          box-shadow: 0 12px 30px -8px color-mix(in oklab, var(--accent) 60%, transparent);
        }
        .cc-preview-cat {
          margin-top: 20px;
          font-family: var(--font-label); font-size: 12px; font-weight: 600;
          letter-spacing: .1em; text-transform: uppercase; color: var(--accent);
        }
        .cc-preview-title {
          margin: 8px 0 0; font-family: var(--font-display); font-weight: 600;
          font-size: clamp(24px, 3.4vw, 34px); line-height: 1.1; letter-spacing: -0.02em;
          color: var(--fg);
        }
        .cc-preview-desc {
          margin: 14px 0 0; font-size: 15.5px; line-height: 1.65;
          color: var(--fg-muted);
        }
        .cc-preview-cta {
          margin-top: 26px; display: inline-flex; align-items: center; gap: 9px;
          padding: 12px 22px; border-radius: 9999px;
          font-family: var(--font-display); font-weight: 600; font-size: 14.5px;
          color: var(--accent-fg); text-decoration: none;
          background: var(--accent); border: 1px solid var(--accent);
          box-shadow: 0 0 0 0 var(--accent-glow);
          transition: box-shadow var(--dur) var(--ease), gap var(--dur) var(--ease), transform var(--dur) var(--ease);
        }
        .cc-preview-cta svg { transition: transform var(--dur) var(--ease); }
        .cc-preview-cta:hover {
          gap: 12px; box-shadow: 0 0 0 7px var(--accent-glow);
          transform: translateY(-1px);
        }
        .cc-preview-cta:hover svg { transform: translateX(3px); }

        /* ── Footer ── */
        .cc-foot {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 16px 22px; border-top: 1px solid var(--border);
          background: var(--bg);
        }
        .cc-foot-meta { font-size: 13.5px; color: var(--fg-subtle); }
        .cc-foot-meta b { color: var(--fg); font-weight: 700; }
        .cc-foot-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-weight: 600; font-size: 14px;
          color: var(--accent); text-decoration: none;
          transition: gap var(--dur) var(--ease), color var(--dur) var(--ease);
        }
        .cc-foot-link svg { transition: transform var(--dur) var(--ease); }
        .cc-foot-link:hover { color: var(--fg); gap: 11px; }
        .cc-foot-link:hover svg { transform: translateX(3px); }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .cc-grid { grid-template-columns: 1fr; min-height: 0; }
          .cc-rail {
            flex-direction: row; overflow-x: auto; max-height: none;
            border-right: none; border-bottom: 1px solid rgba(255,255,255,.07);
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
          }
          .cc-item { flex-direction: column; align-items: flex-start; gap: 9px;
            min-width: 140px; scroll-snap-align: start; }
          .cc-item-arw { display: none; }
          .cc-item-title { white-space: normal; }
          .cc-preview { padding: 30px 24px 36px; }
        }
        @media (max-width: 460px) {
          .cc-foot { flex-direction: column; align-items: flex-start; gap: 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-preview-body { animation: none; }
          .cc-item, .cc-item-ic, .cc-preview-cta, .cc-foot-link,
          .cc-item-arw, .cc-preview-cta svg, .cc-foot-link svg { transition: none; }
        }
      `}</style>
    </section>
  )
}
