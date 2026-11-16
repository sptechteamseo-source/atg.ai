"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import { useScrollNav } from "@/hooks/useScrollNav";
import { ArrowRight } from "@/components/icons/Icons";

const navLinks = [
  { href: "#product",  label: "Product"   },
  { href: "#features", label: "Features"  },
  { href: "#usecases", label: "Use cases" },
  { href: "#pricing",  label: "Pricing"   },
  { href: "#faq",      label: "FAQ"       },
];

/* ── Hamburger icon ── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor"
         strokeWidth={1.75} strokeLinecap="round">
      {/* Top bar — rotates to \ */}
      <line
        x1="3" y1={open ? "11" : "6"}  x2="19" y2={open ? "11" : "6"}
        style={{ transform: open ? "rotate(45deg)"  : "rotate(0deg)",
                 transformOrigin: "11px 11px",
                 transition: "transform 220ms cubic-bezier(.2,0,0,1), y1 220ms, y2 220ms" }}
      />
      {/* Middle bar — fades out */}
      <line
        x1="3" y1="11" x2="19" y2="11"
        style={{ opacity: open ? 0 : 1,
                 transition: "opacity 150ms ease" }}
      />
      {/* Bottom bar — rotates to / */}
      <line
        x1="3" y1={open ? "11" : "16"} x2="19" y2={open ? "11" : "16"}
        style={{ transform: open ? "rotate(-45deg)" : "rotate(0deg)",
                 transformOrigin: "11px 11px",
                 transition: "transform 220ms cubic-bezier(.2,0,0,1), y1 220ms, y2 220ms" }}
      />
    </svg>
  );
}

export default function Navbar() {
  const scrolled   = useScrollNav(8);
  const { theme }  = useTheme();
  const mounted    = useMounted();
  const [open, setOpen] = useState(false);

  /* Close menu on route hash change (link click) */
  const close = () => setOpen(false);

  /* Lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Top bar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderBottom: `1px solid ${(scrolled || open) ? "var(--border)" : "transparent"}`,
        transition: "border-color var(--dur) var(--ease), background var(--dur) var(--ease)",
      }}>
        <div className="container" style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          height: 64, gap: 16,
        }}>

          {/* Brand logo */}
          <a href="#top" onClick={close} aria-label="clarant" style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            textDecoration: "none", color: "var(--fg)",
            fontFamily: "var(--font-display)",
            fontWeight: 600, fontSize: 17, letterSpacing: "-0.025em",
            flexShrink: 0,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", width: 28, height: 28 }}>
              {mounted && (
                <Image
                  src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
                  alt="" width={28} height={28} priority
                />
              )}
            </span>
            <span>
              clarant
              <span style={{ color: "var(--fg-subtle)", fontWeight: 500 }}>.ai</span>
            </span>
          </a>

          {/* Desktop nav links (hidden < 880px) */}
          <nav aria-label="Primary" className="nav-desktop" style={{
            display: "flex", gap: 2, flex: 1, justifyContent: "center",
          }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link-item" style={{
                padding: "8px 12px",
                fontFamily: "var(--font-display)",
                fontSize: 14, fontWeight: 500,
                color: "var(--fg-muted)",
                textDecoration: "none",
                borderRadius: 8,
                transition: "color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)",
              }}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
        {
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/*  toggle start */}
            {/*<ThemeToggle />*/}
            {/* end */}

            {/* Sign in — desktop only */}
            <a href="#signin" className="nav-signin-desktop" style={{
              padding: "8px 12px",
              fontFamily: "var(--font-display)",
              fontSize: 14, fontWeight: 500,
              color: "var(--fg-muted)",
              textDecoration: "none",
              borderRadius: 8,
              transition: "color var(--dur-fast) var(--ease)",
            }}>
              Sign in
            </a>

            {/* CTA — desktop only */}
            <a href="#cta" className="nav-cta-desktop btn btn-primary btn-sm"
               style={{ textDecoration: "none" }}>
              Get started <ArrowRight size={14} />
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="nav-hamburger"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{
                display: "none",
                alignItems: "center", justifyContent: "center",
                width: 38, height: 38, borderRadius: 9,
                background: open ? "var(--bg-elevated)" : "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                cursor: "pointer",
                transition: "background var(--dur-fast) var(--ease)",
                flexShrink: 0,
              }}
            >
              <HamburgerIcon open={open} />
            </button>
          </div>}
        </div>

        <style>{`
          /* Desktop styles */
          .nav-link-item:hover {
            color: var(--fg) !important;
            background: var(--bg-elevated) !important;
          }

          /* Mobile breakpoint — hide desktop items, show hamburger */
          @media (max-width: 880px) {
            .nav-desktop        { display: none !important; }
            .nav-signin-desktop { display: none !important; }
            .nav-cta-desktop    { display: none !important; }
            .nav-hamburger      { display: inline-flex !important; }
          }
        `}</style>
      </header>

      {/* ── Mobile menu drawer ── */}
      <div
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 65,          /* just below the header */
          left: 0, right: 0, bottom: 0,
          zIndex: 99,
          /* slide down when open, slide up when closed */
          transform: open ? "translateY(0)" : "translateY(-110%)",
          opacity: open ? 1 : 0,
          transition: "transform 300ms cubic-bezier(.2,0,0,1), opacity 200ms ease",
          pointerEvents: open ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Blurred backdrop panel */}
        <div style={{
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          overflowY: "auto",
          maxHeight: "calc(100vh - 65px)",
        }}>
          <div className="container" style={{ paddingTop: 20, paddingBottom: 28 }}>

            {/* Nav links */}
            <nav aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 4px",
                    fontFamily: "var(--font-display)",
                    fontSize: 18, fontWeight: 600,
                    color: "var(--fg)",
                    textDecoration: "none",
                    borderBottom: i < navLinks.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "color var(--dur-fast) var(--ease)",
                    /* stagger slide-in animation */
                    animation: open
                      ? `mobileNavIn 300ms ${i * 40}ms var(--ease) both`
                      : "none",
                  }}
                >
                  {link.label}
                  <ArrowRight size={16} style={{ color: "var(--fg-subtle)" }} />
                </a>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />

            {/* CTA buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href="#cta"
                onClick={close}
                className="btn btn-accent"
                style={{
                  textDecoration: "none",
                  justifyContent: "center",
                  fontSize: 16,
                  padding: "14px 22px",
                  animation: open ? `mobileNavIn 300ms 240ms var(--ease) both` : "none",
                }}
              >
                Start free <ArrowRight size={16} />
              </a>
              <a
                href="#signin"
                onClick={close}
                className="btn btn-ghost"
                style={{
                  textDecoration: "none",
                  justifyContent: "center",
                  fontSize: 16,
                  padding: "14px 22px",
                  animation: open ? `mobileNavIn 300ms 280ms var(--ease) both` : "none",
                }}
              >
                Sign in
              </a>
            </div>
          </div>
        </div>

        {/* Tap-outside overlay to close */}
        <div
          onClick={close}
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
          }}
        />
      </div>

      <style>{`
        @keyframes mobileNavIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Only show hamburger on mobile */
        .nav-hamburger { display: none; }
        @media (max-width: 880px) {
          .nav-hamburger { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
