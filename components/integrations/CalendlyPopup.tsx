'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

/**
 * Site-wide Calendly integration. Mounted once in the root layout.
 *
 * Every "Book a Demo" / "Schedule Demo" CTA across the site is a plain
 * <a href="https://calendly.com/..."> anchor. We delegate clicks at the document
 * level: any click that lands on a Calendly anchor opens our own branded modal
 * with Calendly embedded INLINE (same widget.js, same booking URL) instead of
 * navigating away or using Calendly's default popup chrome. One listener covers
 * every current and future CTA.
 *
 * Booking URL is taken verbatim from the clicked anchor — never rewritten.
 * After a successful booking, Calendly posts a `calendly.event_scheduled`
 * message (origin https://calendly.com); only then do we redirect to /thank-you.
 * Closing the modal, picking a date, or picking a time do NOT redirect.
 */

const CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css'
const CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js'

type Calendly = { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void }
const getCalendly = () =>
  (window as unknown as { Calendly?: Calendly }).Calendly

export default function CalendlyPopup() {
  const [url, setUrl] = useState<string | null>(null)
  const embedRef = useRef<HTMLDivElement>(null)

  // Open our modal on any Calendly CTA click; redirect only on a booking.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="calendly.com"]',
      ) as HTMLAnchorElement | null
      if (!anchor) return
      e.preventDefault() // never navigate away / open a new tab

      if (getCalendly()) {
        setUrl(anchor.href)
      } else {
        // ponytail: widget.js not ready (rare, pre-hydration click); fall back to
        // the plain link so the user still reaches the scheduler.
        window.location.href = anchor.href
      }
    }

    function onMessage(e: MessageEvent) {
      if (e.origin !== 'https://calendly.com') return
      if (e.data?.event === 'calendly.event_scheduled') {
        // Relative path keeps the current origin: production → https://clarant.ai/thank-you;
        // preview/localhost stays put so the flow is testable without bouncing to prod.
        window.location.href = '/thank-you'
      }
    }

    document.addEventListener('click', onClick)
    window.addEventListener('message', onMessage)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('message', onMessage)
    }
  }, [])

  // While open: embed the inline widget, lock body scroll, close on Escape.
  useEffect(() => {
    if (!url) return
    const parent = embedRef.current
    if (parent) {
      parent.innerHTML = '' // avoid stacking embeds if reopened
      getCalendly()?.initInlineWidget({ url, parentElement: parent })
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUrl(null)
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [url])

  return (
    <>
      <link rel="stylesheet" href={CALENDLY_CSS} />
      <Script src={CALENDLY_JS} strategy="afterInteractive" />

      {url && (
        <div
          className="cal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Book a Demo with Clarant"
          onClick={() => setUrl(null)} // backdrop click closes; no redirect
        >
          <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
            <header className="cal-head">
              <div>
                <h2 className="cal-title">Book a Demo with Clarant</h2>
                <p className="cal-sub">
                  See how Clarant can simplify your team&apos;s document intelligence.
                </p>
              </div>
              <button
                type="button"
                className="cal-close"
                aria-label="Close"
                onClick={() => setUrl(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="cal-body">
              <div ref={embedRef} className="cal-embed" style={{ minWidth: 320, height: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* ponytail: styles live with the component (one file). Tokens from globals.css;
          surface is kept white in both themes to match Calendly's own light iframe. */}
      <style>{`
        .cal-overlay {
          position: fixed; inset: 0; z-index: 2147483000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          background: rgba(20, 22, 28, .55);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          animation: calFade .22s var(--ease, cubic-bezier(.2,0,0,1)) both;
        }
        .cal-modal {
          display: flex; flex-direction: column;
          width: 100%; max-width: 1000px;
          height: min(92vh, 760px);
          background: #ffffff; color: #191A1F;
          border-radius: 20px;
          box-shadow: 0 24px 64px -16px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.12);
          overflow: hidden;
          animation: calPop .26s var(--ease, cubic-bezier(.2,0,0,1)) both;
        }
        .cal-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; padding: 22px 24px 18px;
          border-bottom: 1px solid #ECECEF;
          background: linear-gradient(180deg, #FFFFFF, #FBFCFD);
        }
        .cal-title {
          font-family: var(--font-display, 'Space Grotesk', system-ui, sans-serif);
          font-weight: 700; letter-spacing: -0.02em;
          font-size: 22px; line-height: 1.1; margin: 0; color: #191A1F;
        }
        .cal-sub {
          margin: 6px 0 0; font-size: 14.5px; line-height: 1.45;
          color: #52525B; max-width: 52ch;
        }
        .cal-close {
          flex: none; width: 38px; height: 38px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 9999px; border: 1px solid #E4E4E7;
          background: #fff; color: #52525B;
          transition: color .15s, background .15s, border-color .15s, transform .15s;
        }
        .cal-close:hover { color: #191A1F; background: #F4F4F5; border-color: #D1D1D6; }
        .cal-close:active { transform: scale(.94); }
        .cal-close:focus-visible { outline: 2px solid var(--accent, #30b4e6); outline-offset: 2px; }
        .cal-body { flex: 1; min-height: 0; background: #fff; }
        .cal-embed { height: 100%; }
        .cal-embed iframe { border-radius: 0; }

        @keyframes calFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes calPop {
          from { opacity: 0; transform: translateY(12px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }

        /* Tablet */
        @media (max-width: 840px) {
          .cal-overlay { padding: 16px; }
          .cal-modal { height: min(94vh, 720px); border-radius: 18px; }
          .cal-head { padding: 18px 20px 16px; }
          .cal-title { font-size: 20px; }
        }

        /* Mobile — near full-screen, accessible close, scrollable */
        @media (max-width: 560px) {
          .cal-overlay { padding: 0; }
          .cal-modal {
            width: 100%; height: 100dvh; max-width: none;
            border-radius: 0;
          }
          .cal-head { padding: 16px 16px 14px; }
          .cal-title { font-size: 18px; }
          .cal-sub { font-size: 13.5px; }
          .cal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .cal-embed { height: 100%; min-height: 560px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cal-overlay, .cal-modal { animation: none; }
        }
      `}</style>
    </>
  )
}
