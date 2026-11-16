'use client'

import { useState } from 'react'
import { TIERS } from '@/lib/data'
import { Check } from './HomeHero'
import { LOGIN_URL } from './links'

/* Pricing tiers from the shared TIERS list, with the monthly / annual switch the homepage always had. */
export default function HomePricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <>
      <div className="home-pricing-top">
        <div className="home-billing" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={annual} className={annual ? 'is-on' : undefined} onClick={() => setAnnual(true)}>Billed annually</button>
          <button type="button" aria-pressed={!annual} className={!annual ? 'is-on' : undefined} onClick={() => setAnnual(false)}>Billed monthly</button>
        </div>
        <p className="small">Data residency in US, EU, AU</p>
      </div>

      <div className="cells plans">
        {TIERS.map((t) => (
          <div key={t.name}>
            <div>
              <h3 className="h3">{t.name}</h3>
              <p className="small">{t.featured ? 'Everything you need on Pro' : t.tag}</p>
            </div>
            <div className="price">
              {t.comingSoon ? (
                <span className="home-soon">Coming soon</span>
              ) : t.priceM == null ? (
                'Custom'
              ) : (
                <>
                  ${annual ? t.priceA : t.priceM} <small>{annual ? 'per month, billed annually' : 'per month, billed monthly'}</small>
                </>
              )}
            </div>
            <ul>
              {t.features.map((f) => {
                const idx = f.indexOf(':')
                return (
                  <li key={f}>
                    <Check />
                    {idx === -1 ? f : <><b>{f.slice(0, idx + 1)}</b> {f.slice(idx + 1).trim()}</>}
                  </li>
                )
              })}
            </ul>
            {t.comingSoon ? (
              <span className="btn btn-line" aria-disabled="true">{t.cta}</span>
            ) : (
              <a className={`btn ${t.featured ? 'btn-primary' : 'btn-line'}`} href={LOGIN_URL}>{t.cta}</a>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
