import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

// Booking-confirmation page: noindex (no SEO value, no duplicate-content risk)
// but follow so link equity still flows. Not added to app/sitemap.ts (its
// STATIC_ROUTES allowlist already excludes everything not listed).
export const metadata: Metadata = {
  title: 'Thank You for Booking a Demo | Clarant',
  description:
    'Your demo with the Clarant team is scheduled. Check your inbox for the calendar invite and meeting details, then see what happens next.',
  alternates: { canonical: '/thank-you' },
  robots: { index: false, follow: true },
}

const STEPS = [
  {
    n: 1,
    title: 'Check Your Inbox',
    body: 'Look for your Calendly confirmation email with the meeting date, time, and joining instructions.',
  },
  {
    n: 2,
    title: 'Get Ready for Your Demo',
    body: "Think about the documents, workflows, or business challenges you'd like to explore with Clarant.",
  },
  {
    n: 3,
    title: 'Meet Our Team',
    body: "Join your scheduled session to see how Clarant can support your team's knowledge and workflows.",
  },
]

export default function ThankYouPage() {
  return (
    <>
      <Nav basePath="/" />

      <main id="main">
        <div className="container ty-wrap">
          <div className="ty-check" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="40" height="40" role="img">
              <circle className="ty-check-circle" cx="26" cy="26" r="24" fill="none" />
              <path className="ty-check-mark" fill="none" d="M15 27 L23 35 L38 18" />
            </svg>
          </div>

          <header className="ty-header">
            <span className="eyebrow">Meeting Scheduled</span>
            <h1 className="ty-title">Thank You for Booking a Demo!</h1>
            <p className="ty-lede">
              Your meeting with the Clarant team has been scheduled successfully. We&rsquo;re looking
              forward to learning more about your business and showing you how Clarant can help your
              team find, understand, and act on information across your documents and connected tools.
            </p>
            <p className="ty-confirm">
              You&rsquo;ll receive a calendar invitation and meeting details at the email address you
              provided during booking.
            </p>
          </header>

          <section className="ty-next" aria-labelledby="ty-next-h">
            <h2 id="ty-next-h" className="ty-next-h">What Happens Next?</h2>
            <ol className="ty-steps">
              {STEPS.map((s) => (
                <li key={s.n} className="ty-step">
                  <span className="ty-step-n" aria-hidden="true">{s.n}</span>
                  <div>
                    <h3 className="ty-step-title">{s.title}</h3>
                    <p className="ty-step-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <p className="ty-outro">We look forward to connecting with you!</p>

          <div className="ty-cta">
            <a className="btn btn-accent btn-lg" href="/">Back to Homepage</a>
            <a className="btn btn-ghost btn-lg" href="/use-cases">Explore Clarant</a>
          </div>
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </>
  )
}

const CSS = `
  .ty-wrap {
    padding: clamp(48px,7vw,96px) 0 clamp(44px,6vw,80px);
    max-width: 760px; text-align: center;
  }

  .ty-check {
    width: 76px; height: 76px; margin: 0 auto clamp(22px,3vw,30px);
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%; background: var(--accent-soft);
    border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
  }
  .ty-check-circle, .ty-check-mark { stroke: var(--accent); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
  .ty-check-circle { stroke-dasharray: 151; stroke-dashoffset: 151; animation: ty-draw .5s var(--ease,ease) forwards; }
  .ty-check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: ty-draw .4s var(--ease,ease) .45s forwards; }
  @keyframes ty-draw { to { stroke-dashoffset: 0; } }

  .ty-header { margin: 0 auto clamp(32px,5vw,52px); }
  .ty-header .eyebrow { justify-content: center; }
  .ty-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(32px,5vw,52px); line-height: 1.05;
    letter-spacing: -0.03em; margin: 14px 0 18px;
  }
  .ty-lede { color: var(--fg-muted); font-size: clamp(15.5px,1.6vw,18px); line-height: 1.6; margin: 0 auto; text-wrap: pretty; }
  .ty-confirm {
    color: var(--fg); font-size: 15px; line-height: 1.6; margin: 20px auto 0;
    max-width: 560px; padding: 14px 18px;
    background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 22%, transparent);
    border-radius: var(--radius-lg, 14px);
  }

  .ty-next { max-width: 620px; margin: 0 auto; text-align: left; }
  .ty-next-h {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(22px,3vw,28px); letter-spacing: -0.02em;
    text-align: center; margin: 0 0 clamp(20px,3vw,28px);
  }
  .ty-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
  .ty-step {
    display: flex; gap: 16px; align-items: flex-start;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: var(--radius-lg, 14px); padding: 18px 20px;
  }
  .ty-step-n {
    flex: none; width: 36px; height: 36px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--accent); color: var(--accent-fg);
    font-family: var(--font-display); font-weight: 600; font-size: 16px;
  }
  .ty-step-title { font-family: var(--font-display); font-weight: 600; font-size: 16.5px; letter-spacing: -0.01em; margin: 4px 0 6px; }
  .ty-step-body { color: var(--fg-muted); font-size: 14.5px; line-height: 1.55; margin: 0; }

  .ty-outro {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(17px,2vw,20px); letter-spacing: -0.01em;
    margin: clamp(32px,5vw,48px) auto clamp(22px,3vw,30px);
  }

  .ty-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  @media (max-width: 480px) { .ty-cta .btn { width: 100%; } }

  @media (prefers-reduced-motion: reduce) {
    .ty-check-circle, .ty-check-mark { animation: none; stroke-dashoffset: 0; }
  }
`
