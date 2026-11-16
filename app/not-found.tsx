import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Page not found — Clarant',
  description: 'The page you’re looking for doesn’t exist or has moved.',
}

export default function NotFound() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav basePath="/" />

      <main id="main" className="nf-main">
        <div className="container nf-wrap">
          <span className="nf-code" aria-hidden="true">404</span>
          <h1 className="nf-title">This page wandered off.</h1>
          <p className="nf-text">
            The page you&rsquo;re looking for doesn&rsquo;t exist, was moved, or the link was
            mistyped. Let&rsquo;s get you back on track.
          </p>

          <div className="nf-actions">
            <Link href="/" className="btn btn-accent">Back to home</Link>
            <Link href="/blog" className="btn btn-ghost">Read the blog</Link>
          </div>

          <nav className="nf-links" aria-label="Popular pages">
            <span className="nf-links-label">Popular:</span>
            <Link href="/#features">Features</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/security">Security</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  )
}

const CSS = `
  .nf-main { display: flex; align-items: center; }
  .nf-wrap {
    padding: clamp(64px,12vw,140px) 0; text-align: center;
    max-width: 620px; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center;
  }
  .nf-code {
    font-family: var(--font-display); font-weight: 700;
    font-size: clamp(72px,16vw,140px); line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(180deg, var(--accent), color-mix(in oklab, var(--accent) 40%, transparent));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .nf-title {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(26px,4vw,40px); letter-spacing: -0.025em;
    margin: 12px 0 12px;
  }
  .nf-text { color: var(--fg-muted); font-size: 16px; line-height: 1.6; margin: 0 0 28px; text-wrap: pretty; }
  .nf-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .nf-links {
    margin-top: 36px; display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
    align-items: center; font-size: 13.5px;
  }
  .nf-links-label { color: var(--fg-subtle); }
  .nf-links a { color: var(--fg-muted); text-decoration: none; }
  .nf-links a:hover { color: var(--accent); opacity: 1; }
`
