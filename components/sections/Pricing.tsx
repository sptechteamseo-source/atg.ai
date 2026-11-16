'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'
import { TIERS } from '@/lib/data'

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <>
      <style>{`
        .pricing-head { text-align: center; margin-bottom: 56px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .pricing-head .section-lede { margin-left: auto; margin-right: auto; }
        .billing-toggle { display: inline-flex; padding: 4px; border-radius: 9999px; border: 1px solid var(--border); background: var(--bg-elevated); margin-top: 24px; }
        .bt { background: transparent; border: 0; padding: 9px 16px; border-radius: 9999px; font-family: var(--font-display); font-weight: 500; font-size: 13px; color: var(--fg-muted); display: inline-flex; align-items: center; gap: 8px; }
        .bt.is-active { background: var(--fg); color: var(--bg); }
        .bt-save { font-size: 10.5px; padding: 2px 6px; border-radius: 4px; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
        .bt.is-active .bt-save { background: var(--accent); color: var(--accent-fg); }
        .tiers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: stretch; }
        @media (max-width: 1100px) { .tiers { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .tiers { grid-template-columns: 1fr; } }
        .tier {
          padding: 32px 28px; display: flex; flex-direction: column; gap: 6px; position: relative;
          transition: transform var(--dur) var(--ease),
                      box-shadow var(--dur) var(--ease),
                      border-color var(--dur) var(--ease);
        }
        .tier:hover {
          transform: translateY(-6px);
          border-color: color-mix(in oklab, var(--accent) 40%, transparent);
          box-shadow: 0 18px 40px -22px color-mix(in oklab, var(--accent) 30%, transparent);
        }
        @media (max-width: 640px) {
          .pricing-head { margin-bottom: 32px; }
          .tier { padding: 24px 18px; }
          .tier-price-num { font-size: 40px; }
          .pricing-foot { flex-direction: column; text-align: center; font-size: 12px; }
        }
        .tier-badge {
          position: absolute; top: -12px; left: 28px;
          padding: 5px 10px; border-radius: 9999px;
          background: var(--accent); color: var(--accent-fg);
          font-family: var(--font-display); font-weight: 600; font-size: 11.5px; letter-spacing: .03em;
        }
        .tier-name { font-family: var(--font-display); font-weight: 600; font-size: 22px; letter-spacing: -0.02em; transition: color .2s; }
        .tier:hover .tier-name { color: var(--accent); }
        .tier-tag { color: var(--fg-muted); font-size: 13.5px; }
        .tier-price { display: flex; align-items: baseline; gap: 4px; margin-top: 18px; }
        @keyframes priceHop { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
        .tier-price-num {
          font-family: var(--font-display); font-weight: 600; font-size: 48px; letter-spacing: -0.03em;
          color: var(--accent); display: inline-block;
        }
        .tier:hover .tier-price-num { animation: priceHop .45s var(--ease); }
        .tier-price-suffix { color: var(--fg-muted); font-size: 14px; }
        .tier-billing { font-size: 12.5px; }
        .tier-cta {
          margin-top: 18px; justify-content: center;
          transition: background var(--dur) var(--ease),
                      color var(--dur) var(--ease),
                      border-color var(--dur) var(--ease),
                      transform var(--dur) var(--ease);
        }
        .tier:hover .tier-cta {
          background: var(--accent);
          color: var(--accent-fg);
          border-color: var(--accent);
          transform: scale(1.02);
        }
        .tier-features { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border); padding-top: 22px; }
        .tier-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--fg-muted); }
        .tier-features svg { color: var(--accent); flex-shrink: 0; margin-top: 3px; }
        .feat-label { color: var(--fg-muted); }
        .feat-value { color: var(--fg); font-weight: 600; }
        .pricing-foot { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 36px; color: var(--fg-subtle); font-size: 13px; }

        /* Coming Soon (Team) card */
        .tier.is-soon { opacity: 0.82; }
        .tier.is-soon:hover { transform: none; border-color: var(--border); box-shadow: none; }
        .tier.is-soon:hover .tier-name { color: inherit; }
        .tier-badge-soon {
          position: absolute; top: -12px; left: 28px;
          padding: 5px 10px; border-radius: 9999px;
          background: var(--bg-elevated); color: var(--fg-muted);
          border: 1px solid var(--border);
          font-family: var(--font-display); font-weight: 600; font-size: 11.5px; letter-spacing: .03em;
        }
        .tier-price-soon {
          font-family: var(--font-display); font-weight: 600; font-size: 30px; letter-spacing: -0.02em;
          color: var(--fg-muted);
        }
        .tier-cta.is-disabled { cursor: not-allowed; opacity: 0.6; pointer-events: none; }
      `}</style>

      <section id="pricing" className="pricing">
        <div className="container">
          <div className="pricing-head" data-reveal="fade-up">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title">Simple, per-seat. <em>Honest</em>.</h2>
            <p className="section-lede">No usage limits to learn. No surprise overages. Cancel anytime.</p>

            <div className="billing-toggle" role="tablist">
              <button
                className={`bt ${!annual ? 'is-active' : ''}`}
                onClick={() => setAnnual(false)}
                role="tab" aria-selected={!annual}
              >
                Monthly
              </button>
              <button
                className={`bt ${annual ? 'is-active' : ''}`}
                onClick={() => setAnnual(true)}
                role="tab" aria-selected={annual}
              >
                Annual <span className="bt-save">Save 17%</span>
              </button>
            </div>
          </div>

          <div className="tiers">
            {TIERS.map((t, i) => (
              <div key={t.name} className={`tier card${t.comingSoon ? ' is-soon' : ''}`} data-reveal="pop" style={{'--reveal-delay':`${i*80}ms`} as any}>
                {t.featured && <div className="tier-badge">{t.tag}</div>}
                {t.comingSoon && <div className="tier-badge-soon">Coming Soon</div>}
                <div className="tier-name">{t.name}</div>
                <div className="tier-tag">{t.featured ? 'Everything you need on Pro' : t.tag}</div>

                <div className="tier-price">
                  {t.comingSoon ? (
                    <span className="tier-price-soon">Coming Soon</span>
                  ) : t.priceM == null ? (
                    <span className="tier-price-num">Custom</span>
                  ) : (
                    <>
                      <span className="tier-price-num">${annual ? t.priceA : t.priceM}</span>
                      <span className="tier-price-suffix"></span>
                    </>
                  )}
                </div>
                <div className="tier-billing muted">
                  {t.comingSoon
                    ? 'Available soon'
                    : t.priceM == null
                    ? 'Annual contract'
                    : annual ? 'Billed annually' : 'Billed monthly'}
                </div>

                {t.comingSoon ? (
                  <span className="btn btn-ghost tier-cta is-disabled" aria-disabled="true">
                    {t.cta}
                  </span>
                ) : (
                  <a href="https://app.clarant.ai/login" className="btn btn-ghost tier-cta">
                    {t.cta} <Icons.arrowRight size={14} />
                  </a>
                )}

                <ul className="tier-features">
                  {t.features.map((f) => {
                    const idx = f.indexOf(':')
                    return (
                      <li key={f}>
                        <Icons.check size={14} />
                        {idx === -1 ? (
                          <span>{f}</span>
                        ) : (
                          <span>
                            <span className="feat-label">{f.slice(0, idx + 1)}</span>{' '}
                            <span className="feat-value">{f.slice(idx + 1).trim()}</span>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-foot">
            <Icons.shield size={14} /> Data residency in US, EU, AU
          </div>
        </div>
      </section>
    </>
  )
}
