'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ArrowRight } from '@/components/icons/Icons'

interface NavLink {
  label: string
  href: string
  absolute?: boolean
}

// Absolute (`/#…`) so homepage-section links resolve from ANY page, not just
// the homepage. From /usecases, `#features` would wrongly become /usecases#features.
const NAV_LINKS: NavLink[] = [
  { label: 'Product',  href: '/#product'  },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing',  href: '/#pricing'  },
  { label: 'FAQ',      href: '/#faq'      },
]

const EXTRA_LINKS: NavLink[] = [
  { label: 'Blog',    href: '/blog',    absolute: true },
]

interface NavProps {
  basePath?: string
}

export default function Nav({ basePath = '' }: NavProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  // Scroll border effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on scroll
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
      <style>{`
        /* ── Shared nav shell ──────────────────────────── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: color-mix(in oklab, var(--bg) 80%, transparent);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-bottom: 1px solid transparent;
          transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
        }
        .nav--scrolled { border-bottom-color: var(--border); }

        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; gap: 16px;
        }

        /* ── Logo / brand ──────────────────────────────── */
        .brand {
          display: inline-flex; align-items: center;
          text-decoration: none; color: var(--fg);
          font-family: var(--font-display);
          font-weight: 600; font-size: 26px; letter-spacing: -0.025em;
          flex-shrink: 0;
        }
        .brand-mark { display: inline-flex; align-items: center; width: 40px; height: 50px; flex-shrink: 0; }
        .brand-logo { width: 40px; height: 44px; object-fit: cover; }
        .brand-logo--dark { display: none; }
        [data-theme="dark"] .brand-logo--light { display: none; }
        [data-theme="dark"] .brand-logo--dark  { display: block; }
        .brand-tld { color: #00a48d; font-weight: 700; }
span.brand-word {
    margin-left: -5px;
}
        /* ── Desktop nav links ─────────────────────────── */
        .nav-links { display: flex; gap: 2px; align-items: center; }
        .nav-link {
          padding: 8px 11px;
          font-family: var(--font-display); font-size: 13.5px; font-weight: 500;
          color: var(--fg-muted); text-decoration: none; border-radius: 8px;
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--fg); background: var(--bg-elevated); opacity: 1; }

        /* ── Desktop right actions ─────────────────────── */
        .nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

        /* ── Hamburger button (mobile only) ────────────── */
        .nav-hamburger {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 8px;
          background: transparent; border: 1px solid var(--border);
          color: var(--fg); cursor: pointer;
          transition: background var(--dur-fast) var(--ease);
          flex-shrink: 0;
        }
        .nav-hamburger:hover { background: var(--bg-elevated); }

        /* ── Mobile full-screen menu ───────────────────── */
        .nav-mobile {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0; bottom: 0;
          background: var(--bg);
          z-index: 99;
          flex-direction: column;
          overflow-y: auto;
          border-top: 1px solid var(--border);
          animation: mobileMenuIn 0.22s var(--ease);
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile--open { display: flex; }

        .nav-mobile-links {
          display: flex; flex-direction: column;
          flex: 1;
        }
        .nav-mobile-link {
          display: flex; align-items: center;
          padding: 16px var(--gutter);
          color: var(--fg);
          font-size: 1.05rem;
          font-weight: 500;
          font-family: var(--font-display);
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: background var(--dur-fast) var(--ease);
        }
        .nav-mobile-link:hover { background: var(--bg-elevated); opacity: 1; }

        .nav-mobile-actions {
          padding: 20px var(--gutter) 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid var(--border);
          margin-top: 8px;
        }
        .nav-mobile-btn {
          justify-content: center;
          width: 100%;
          padding: 14px;
        }

        /* ── Responsive breakpoints ────────────────────── */
        @media (max-width: 880px) {
          .nav-links   { display: none; }
          .nav-hamburger { display: flex; }
        }

        @media (max-width: 480px) {
          .brand-word { font-size: 15px; }
          /* Hide "Get started" text label on very small, show only icon */
          .nav-cta-label { display: none; }
        }
      `}</style>

      {/* ── Sticky nav bar ─────────────────────────────── */}
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="container nav-inner">

          {/* Logo — always returns to the homepage from any page */}
          <a href="/" className="brand" aria-label="Clarant home">
            <span className="brand-mark" aria-hidden="true">
              <Image src="/Clarant_dark.svg" alt="" width={40} height={50} className="brand-logo brand-logo--light" />
              <Image src="/Clarant_dark.svg"  alt="" width={40} height={50} className="brand-logo brand-logo--dark"  />
            </span>
            <span className="brand-word">
             Clarant{/*<span className="brand-tld">ai</span>*/}
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="nav-links" aria-label="Primary">
            {/* Product + Features */}
            {NAV_LINKS.slice(0, 2).map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}

            {/* Use cases — dedicated page */}
            <a href="/use-cases" className="nav-link">Use Cases</a>

            {/* Pricing + FAQ */}
            {NAV_LINKS.slice(2).map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}

            {EXTRA_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="nav-actions">
           <ThemeToggle />

            {/* Get started — always visible */}
            <a className="btn btn-primary btn-sm" href="https://app.clarant.ai/login">
              <span className="nav-cta-label">Get started</span>
              <ArrowRight size={14} />
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              suppressHydrationWarning
            >
              {menuOpen ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6"  y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6"  x2="21" y2="6"  />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-down menu ──────────────────────── */}
      <div
        className={`nav-mobile ${menuOpen ? 'nav-mobile--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="nav-mobile-links">
          {NAV_LINKS.slice(0, 2).map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
          {/* Use cases — dedicated page */}
          <a href="/use-cases" className="nav-mobile-link" onClick={closeMenu}>
            Use Cases
          </a>
          {NAV_LINKS.slice(2).map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
          {EXTRA_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={closeMenu}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="nav-mobile-actions">
         
      

          <a
            href="https://app.clarant.ai/login"
            className="btn btn-accent nav-mobile-btn"
            onClick={closeMenu}
          >
            Get started <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </>
  )
}
