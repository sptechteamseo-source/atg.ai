/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { FOOTER_LINKS } from '@/lib/data'
import { LOGIN_URL } from './links'

/* Homepage header and footer: the design's layout, the same destinations as the site's existing header and footer.
   The shared Nav and Footer are used on every other page and are left as they are. */

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Use Cases', href: '/use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '/blog' },
]

export function HomeNav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="brand" href="/" aria-label="Clarant home">
          <img src="/assets/home/clarant-mark-176.png" alt="" width={17} height={26} />Clarant
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="nav-cta">
          <ThemeToggle />
          <a className="signin" href={LOGIN_URL}>Sign in</a>
          <a className="btn btn-primary btn-sm" href={LOGIN_URL}>Start free trial</a>
          <button className="menu-btn" type="button" aria-expanded="false" aria-controls="mnav">
            <span className="sr">Menu</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
              <path className="i-menu" d="M4 7h16M4 12h16M4 17h16" />
              <path className="i-close" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
      <nav className="mnav" id="mnav" aria-label="Mobile" hidden>
        {NAV.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
        <a href={LOGIN_URL}>Sign in</a>
      </nav>
    </header>
  )
}

export function HomeFooter() {
  const groups = Object.entries(FOOTER_LINKS)
  return (
    <footer>
      <div className="frame">
        <div className="fgrid">
          <div>
            <a className="brand" href="/" aria-label="Clarant home">
              <img src="/assets/home/clarant-mark-176.png" alt="" width={17} height={26} />Clarant
            </a>
            <p className="small" style={{ marginTop: 12, maxWidth: '26em' }}>The AI chief of staff for business leaders.</p>
          </div>
          {groups.map(([title, links]) => (
            <div key={title}>
              <h2>{title}</h2>
              <ul>
                {links.map((l) => (
                  <li key={`${title}-${l.label}`}>
                    {l.href.startsWith('/') ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="fbase">
          <span>© 2026 Clarant</span>
          <span>
            <Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms-of-service">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
