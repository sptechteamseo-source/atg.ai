'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/**
 * Google Analytics 4 (gtag.js).
 *
 * Loaded ONLY on the canonical production host, mirroring the site's
 * "only production is live" rule (see app/robots.ts and middleware.ts). This
 * keeps localhost, *.vercel.app previews and QA/UAT traffic out of the GA
 * property. To enable analytics everywhere, remove the host check below.
 */

const GA_MEASUREMENT_ID = 'G-SV3PK7XDPT'
const PRODUCTION_HOST = 'clarant.ai'

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const host = window.location.hostname
    if (host === PRODUCTION_HOST || host === `www.${PRODUCTION_HOST}`) {
      setEnabled(true)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
