'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { ArrowRight } from '@/components/icons/Icons'
import { USE_CASES, type UseCaseCard } from '@/lib/data'

const BATCH = 6 // show 6 initially, then +6 per "Load More"

/* ── Product-style thumbnail scenes ──────────────────────────────────────────
   Each card thumbnail is a mini "product UI" scene (window frame + dashboards,
   charts, panels) built from vectors → sharp at any size, no extra requests,
   no layout shift. Brand blues (#2563EB/#3B82F6/#60A5FA) via the ucBlue
   gradient; panels/borders use design-system tokens so it stays theme-native.
   Keyed by the card's `icon` value. No people, no photos. 16:9 (viewBox 320×180). */

// Reusable app-window chrome so all scenes share one visual language.
function Frame({ children }: { children: ReactNode }) {
  return (
    <g>
      <rect x="30" y="22" width="260" height="136" rx="14" fill="color-mix(in oklab, var(--bg) 88%, transparent)" stroke="var(--border)" strokeWidth="2" />
      <path d="M30 46h260" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="46" cy="34" r="3.5" fill="var(--fg-subtle)" opacity=".55" />
      <circle cx="58" cy="34" r="3.5" fill="var(--fg-subtle)" opacity=".4" />
      <circle cx="70" cy="34" r="3.5" fill="var(--fg-subtle)" opacity=".3" />
      {children}
    </g>
  )
}

// Small blue check mark centred on (cx,cy).
function Check({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="6" fill="url(#ucBlue)" />
      <path d={`M${cx - 3} ${cy}l2 2 4-4`} stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

const ART: Record<string, ReactNode> = {
  // Legal — contract doc + signature, AI review panel with checks, compliance shield
  doc: (
    <Frame>
      <rect x="44" y="58" width="104" height="92" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="56" y="70" width="56" height="7" rx="3.5" fill="url(#ucBlue)" />
      <rect x="56" y="86" width="80" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".45" />
      <rect x="56" y="98" width="80" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".45" />
      <rect x="56" y="110" width="58" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".45" />
      <path d="M56 134q7-11 14-2t14-2" stroke="url(#ucBlue)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="160" y="58" width="102" height="92" rx="8" fill="color-mix(in oklab, var(--accent) 12%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 32%, transparent)" strokeWidth="1.5" />
      <rect x="172" y="70" width="50" height="6" rx="3" fill="var(--fg-subtle)" opacity=".5" />
      <Check cx={178} cy={92} /><rect x="190" y="89" width="58" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <Check cx={178} cy={110} /><rect x="190" y="107" width="58" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <Check cx={178} cy={128} /><rect x="190" y="125" width="44" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <path d="M250 126l18 6v10c0 11-9 17-18 21-9-4-18-10-18-21v-10Z" fill="color-mix(in oklab, var(--bg) 82%, transparent)" stroke="url(#ucBlue)" strokeWidth="2" />
      <path d="M243 148l5 5 9-10" stroke="url(#ucBlue)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),

  // Research — AI search bar, result rows, knowledge graph
  search: (
    <Frame>
      <rect x="44" y="58" width="218" height="22" rx="11" fill="var(--bg-sunken)" stroke="color-mix(in oklab, var(--accent) 32%, transparent)" strokeWidth="1.5" />
      <circle cx="58" cy="69" r="5" fill="none" stroke="url(#ucBlue)" strokeWidth="2" />
      <path d="M62 73l4 4" stroke="url(#ucBlue)" strokeWidth="2" strokeLinecap="round" />
      <rect x="74" y="66" width="120" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="44" y="92" width="120" height="13" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="53" cy="98.5" r="3" fill="url(#ucBlue)" /><rect x="61" y="95.5" width="92" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="44" y="110" width="120" height="13" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="53" cy="116.5" r="3" fill="url(#ucBlue)" /><rect x="61" y="113.5" width="80" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="44" y="128" width="120" height="13" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
      <circle cx="53" cy="134.5" r="3" fill="url(#ucBlue)" /><rect x="61" y="131.5" width="88" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <path d="M196 100l24 16M220 116l30-10M220 116l8 24" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="196" cy="100" r="6" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="250" cy="106" r="6" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="228" cy="140" r="6" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="220" cy="116" r="8" fill="url(#ucBlue)" />
    </Frame>
  ),

  // Sales — CRM pipeline columns + revenue graph panel
  send: (
    <Frame>
      <rect x="44" y="58" width="42" height="92" rx="7" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="50" y="64" width="30" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".5" />
      <rect x="50" y="76" width="30" height="16" rx="4" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
      <rect x="50" y="96" width="30" height="16" rx="4" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
      <rect x="92" y="58" width="42" height="92" rx="7" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="98" y="64" width="30" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".5" />
      <rect x="98" y="76" width="30" height="16" rx="4" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
      <rect x="140" y="58" width="42" height="92" rx="7" fill="color-mix(in oklab, var(--accent) 12%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.2" />
      <rect x="146" y="64" width="30" height="5" rx="2.5" fill="url(#ucBlue)" />
      <rect x="146" y="76" width="30" height="16" rx="4" fill="var(--bg)" stroke="url(#ucBlue)" strokeWidth="1.2" />
      <rect x="196" y="58" width="66" height="92" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="204" y="68" width="30" height="6" rx="3" fill="var(--fg-subtle)" opacity=".45" />
      <path d="M204 138L218 120L232 128L254 96" stroke="url(#ucBlue)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="254" cy="96" r="3.5" fill="url(#ucBlue)" />
    </Frame>
  ),

  // Marketing — campaign area chart + stat card + engagement donut
  zap: (
    <Frame>
      <rect x="44" y="58" width="150" height="92" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="54" y="66" width="46" height="6" rx="3" fill="var(--fg-subtle)" opacity=".5" />
      <path d="M54 138L82 116L106 126L134 96L162 106L184 82L184 142L54 142Z" fill="url(#ucBlue)" opacity=".18" />
      <path d="M54 138L82 116L106 126L134 96L162 106L184 82" stroke="url(#ucBlue)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="184" cy="82" r="3.5" fill="url(#ucBlue)" />
      <rect x="204" y="58" width="58" height="43" rx="8" fill="color-mix(in oklab, var(--accent) 12%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.2" />
      <rect x="212" y="66" width="28" height="10" rx="3" fill="url(#ucBlue)" />
      <rect x="212" y="84" width="40" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="204" y="107" width="58" height="43" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <circle cx="222" cy="128" r="12" fill="none" stroke="var(--border)" strokeWidth="4" />
      <path d="M222 116a12 12 0 0 1 9 19" fill="none" stroke="url(#ucBlue)" strokeWidth="4" strokeLinecap="round" />
      <rect x="242" y="125" width="14" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
    </Frame>
  ),

  // Healthcare — patient record + plus, heartbeat, AI diagnosis panel, shield
  shield: (
    <Frame>
      <rect x="44" y="58" width="108" height="92" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="62" cy="76" r="10" fill="color-mix(in oklab, var(--accent) 16%, var(--bg))" stroke="url(#ucBlue)" strokeWidth="1.5" />
      <path d="M62 71v10M57 76h10" stroke="url(#ucBlue)" strokeWidth="2" strokeLinecap="round" />
      <rect x="80" y="70" width="58" height="6" rx="3" fill="var(--fg-subtle)" opacity=".5" />
      <rect x="80" y="82" width="42" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <path d="M54 116h14l6-14 8 24 6-14 4 8h44" stroke="url(#ucBlue)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="132" width="90" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".35" />
      <rect x="160" y="58" width="102" height="92" rx="8" fill="color-mix(in oklab, var(--accent) 10%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.5" />
      <rect x="172" y="70" width="46" height="6" rx="3" fill="var(--fg-subtle)" opacity=".5" />
      <Check cx={178} cy={94} /><rect x="190" y="91" width="58" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <Check cx={178} cy={114} /><rect x="190" y="111" width="48" height="6" rx="3" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="172" y="132" width="78" height="6" rx="3" fill="var(--fg-subtle)" opacity=".3" />
    </Frame>
  ),

  // Small Business — ops dashboard: KPI tiles + bar chart + task list
  building: (
    <Frame>
      <rect x="44" y="58" width="66" height="40" rx="7" fill="color-mix(in oklab, var(--accent) 12%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 28%, transparent)" strokeWidth="1.2" />
      <rect x="52" y="66" width="30" height="9" rx="3" fill="url(#ucBlue)" /><rect x="52" y="82" width="44" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="118" y="58" width="66" height="40" rx="7" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="126" y="66" width="26" height="9" rx="3" fill="var(--fg-subtle)" opacity=".55" /><rect x="126" y="82" width="44" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="192" y="58" width="70" height="40" rx="7" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="200" y="66" width="26" height="9" rx="3" fill="var(--fg-subtle)" opacity=".55" /><rect x="200" y="82" width="48" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="44" y="106" width="112" height="44" rx="7" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="56" y="130" width="10" height="12" rx="2" fill="url(#ucBlue)" />
      <rect x="72" y="122" width="10" height="20" rx="2" fill="url(#ucBlue)" />
      <rect x="88" y="126" width="10" height="16" rx="2" fill="url(#ucBlue)" />
      <rect x="104" y="116" width="10" height="26" rx="2" fill="url(#ucBlue)" />
      <rect x="120" y="124" width="10" height="18" rx="2" fill="url(#ucBlue)" />
      <rect x="164" y="106" width="98" height="44" rx="7" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.2" />
      <Check cx={178} cy={120} /><rect x="190" y="117" width="60" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <Check cx={178} cy={136} /><rect x="190" y="133" width="48" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
    </Frame>
  ),

  // HR — employee directory table (initials chips, status pills — no people)
  users: (
    <Frame>
      <rect x="44" y="58" width="130" height="16" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <circle cx="55" cy="66" r="4" fill="none" stroke="url(#ucBlue)" strokeWidth="1.6" /><path d="M58 69l3 3" stroke="url(#ucBlue)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="66" y="63.5" width="84" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="190" y="58" width="72" height="16" rx="8" fill="color-mix(in oklab, var(--accent) 14%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.2" />
      <rect x="200" y="63.5" width="40" height="5" rx="2.5" fill="url(#ucBlue)" />
      {[86, 106, 126].map((y, k) => (
        <g key={y}>
          <rect x="44" y={y} width="218" height="16" rx="5" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
          <rect x="50" y={y + 3} width="10" height="10" rx="3" fill="url(#ucBlue)" opacity={0.9 - k * 0.2} />
          <rect x="68" y={y + 5.5} width="70" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".45" />
          <rect x="150" y={y + 5.5} width="44" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".3" />
          <rect x="228" y={y + 3.5} width="26" height="9" rx="4.5" fill="color-mix(in oklab, var(--accent) 22%, transparent)" />
        </g>
      ))}
    </Frame>
  ),

  // Real Estate — map with pin + property listing card (house outline, no people)
  globe: (
    <Frame>
      <rect x="44" y="58" width="118" height="92" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.5" />
      <path d="M44 104h118M100 58v92M62 150l46-92" stroke="var(--border)" strokeWidth="1.5" opacity=".55" />
      <path d="M120 78c0-9 7-16 16-16s16 7 16 16c0 11-16 24-16 24s-16-13-16-24Z" fill="url(#ucBlue)" />
      <circle cx="136" cy="78" r="6" fill="var(--bg)" />
      <rect x="172" y="58" width="90" height="92" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <path d="M186 100l31-24 31 24" stroke="url(#ucBlue)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="192" y="100" width="50" height="30" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.2" />
      <rect x="184" y="138" width="40" height="7" rx="3.5" fill="url(#ucBlue)" />
      <rect x="230" y="138" width="18" height="7" rx="3.5" fill="var(--fg-subtle)" opacity=".4" />
    </Frame>
  ),

  // Insurance — coverage dashboard: layered policies + verified + coverage bars
  layers: (
    <Frame>
      <rect x="44" y="118" width="130" height="26" rx="8" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="44" y="92" width="130" height="26" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="44" y="66" width="130" height="26" rx="8" fill="color-mix(in oklab, var(--accent) 14%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.5" />
      <rect x="56" y="75" width="64" height="8" rx="4" fill="url(#ucBlue)" />
      <rect x="56" y="101" width="80" height="7" rx="3.5" fill="var(--fg-subtle)" opacity=".4" />
      <rect x="56" y="127" width="72" height="7" rx="3.5" fill="var(--fg-subtle)" opacity=".35" />
      <path d="M226 66l24 8v13c0 14-12 22-24 27-12-5-24-13-24-27V74Z" fill="color-mix(in oklab, var(--bg) 82%, transparent)" stroke="url(#ucBlue)" strokeWidth="2" />
      <path d="M216 100l7 7 13-15" stroke="url(#ucBlue)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),

  // Banking / Finance — statement dashboard: balance + mini bars + secure lock
  lock: (
    <Frame>
      <rect x="44" y="58" width="140" height="92" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="56" y="70" width="40" height="6" rx="3" fill="var(--fg-subtle)" opacity=".45" />
      <rect x="56" y="82" width="86" height="13" rx="4" fill="url(#ucBlue)" />
      <rect x="56" y="122" width="12" height="18" rx="2" fill="url(#ucBlue)" opacity=".55" />
      <rect x="74" y="114" width="12" height="26" rx="2" fill="url(#ucBlue)" opacity=".7" />
      <rect x="92" y="126" width="12" height="14" rx="2" fill="url(#ucBlue)" opacity=".55" />
      <rect x="110" y="118" width="12" height="22" rx="2" fill="url(#ucBlue)" opacity=".85" />
      <rect x="128" y="128" width="12" height="12" rx="2" fill="url(#ucBlue)" opacity=".5" />
      <rect x="196" y="58" width="66" height="92" rx="8" fill="color-mix(in oklab, var(--accent) 10%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 30%, transparent)" strokeWidth="1.5" />
      <rect x="212" y="94" width="34" height="30" rx="6" fill="color-mix(in oklab, var(--bg) 70%, transparent)" stroke="url(#ucBlue)" strokeWidth="2" />
      <path d="M219 94v-6a10 10 0 0 1 20 0v6" stroke="url(#ucBlue)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="229" cy="108" r="3.5" fill="url(#ucBlue)" />
    </Frame>
  ),

  // Operations — workflow automation: connected nodes + central bolt + progress
  bolt: (
    <Frame>
      <rect x="44" y="60" width="56" height="40" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="54" y="70" width="30" height="6" rx="3" fill="var(--fg-subtle)" opacity=".45" /><rect x="54" y="82" width="20" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".35" />
      <rect x="220" y="60" width="56" height="40" rx="8" fill="color-mix(in oklab, var(--bg) 90%, transparent)" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="230" y="70" width="30" height="6" rx="3" fill="var(--fg-subtle)" opacity=".45" /><rect x="230" y="82" width="20" height="5" rx="2.5" fill="var(--fg-subtle)" opacity=".35" />
      <path d="M100 80H136M184 80H220" stroke="var(--fg-subtle)" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <circle cx="160" cy="80" r="24" fill="color-mix(in oklab, var(--accent) 14%, var(--bg-sunken))" stroke="color-mix(in oklab, var(--accent) 32%, transparent)" strokeWidth="2" />
      <path d="M164 66l-12 16h9l-2 12 13-17h-9l1-11Z" fill="url(#ucBlue)" />
      <rect x="44" y="118" width="232" height="8" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
      <rect x="44" y="118" width="150" height="8" rx="4" fill="url(#ucBlue)" />
      <rect x="44" y="134" width="232" height="8" rx="4" fill="var(--bg-sunken)" stroke="var(--border)" strokeWidth="1" />
      <rect x="44" y="134" width="96" height="8" rx="4" fill="url(#ucBlue)" opacity=".8" />
    </Frame>
  ),
}

function UseCaseArt({ variant }: { variant: string }) {
  return (
    <svg className="uc-art" viewBox="0 0 320 180" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ucBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {ART[variant] ?? ART.doc}
    </svg>
  )
}

// Renders the PNG/WebP thumbnail once we've confirmed the file actually loads;
// until then (or if it's missing) shows the generated visual. Client-side probe
// avoids the SSR pitfall where an <img> errors before React can attach onError,
// so a not-yet-uploaded image never flashes as broken.
function CardThumb({ uc }: { uc: UseCaseCard }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!uc.image) return
    let alive = true
    const probe = new window.Image()
    probe.onload = () => { if (alive) setReady(true) }
    probe.src = uc.image
    return () => { alive = false }
  }, [uc.image])

  if (uc.image && ready) {
    return (
      <Image
        src={uc.image}
        alt={uc.title}
        fill
        loading="lazy"
        sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, 33vw"
        className="uc-media-img"
      />
    )
  }
  return (
    <>
      <span className="uc-media-glow" aria-hidden="true" />
      <UseCaseArt variant={uc.icon} />
      <span className="uc-media-overlay" aria-hidden="true" />
    </>
  )
}

export default function UseCases({ showHead = true }: { showHead?: boolean }) {
  const [visible, setVisible] = useState(BATCH)
  const gridRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  // First BATCH keep data-reveal → revealed on scroll by the global PageAnimations
  // observer (unchanged). That observer only sees mount-time nodes, so reveal each
  // newly appended batch here, reusing the same fade-up animation + --reveal-delay stagger.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    gridRef.current
      ?.querySelectorAll('.uc-card[data-reveal]:not(.revealed)')
      .forEach(el => el.classList.add('revealed'))
  }, [visible])

  const allShown = visible >= USE_CASES.length

  return (
    <>
      <style>{`
        .usecases-head { margin-bottom: 56px; }
        @media (max-width: 640px) { .usecases-head { margin-bottom: 32px; } }

        .uc-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        @media (max-width: 900px) { .uc-card-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } }
        @media (max-width: 560px) { .uc-card-grid { grid-template-columns: 1fr; } }

        /* ── Card shell (whole card is the link) ── */
        .uc-card {
          position: relative; display: flex; flex-direction: column;
          height: 100%;
          padding: 14px; gap: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          background:
            radial-gradient(130% 90% at 100% 0%, var(--accent-soft), transparent 55%),
            var(--bg-elevated);
          text-decoration: none; color: inherit;
          overflow: hidden;
          transition: transform .3s var(--ease), box-shadow .3s var(--ease), border-color .3s var(--ease);
        }
        /* Gradient border ring — subtle by default, intensifies on hover */
        .uc-card::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
          background: linear-gradient(150deg, color-mix(in oklab, var(--accent) 55%, transparent), transparent 45%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: .35; transition: opacity .3s var(--ease); pointer-events: none;
        }
        .uc-card:hover {
          transform: translateY(-6px);
          border-color: color-mix(in oklab, var(--accent) 30%, var(--border));
          box-shadow: 0 24px 60px -22px color-mix(in oklab, var(--accent) 40%, transparent);
        }
        .uc-card:hover::before { opacity: 1; }
        .uc-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        /* ── Featured visual (product-UI illustration / optional image) ── */
        .uc-media {
          position: relative; aspect-ratio: 16 / 9; border-radius: var(--radius-lg);
          overflow: hidden; isolation: isolate;
          border: 1px solid var(--border);
          background:
            radial-gradient(90% 120% at 18% 8%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%),
            linear-gradient(160deg, color-mix(in oklab, var(--accent) 12%, var(--bg-elevated)), var(--bg-sunken));
          display: flex; align-items: center; justify-content: center;
        }
        .uc-media-img { object-fit: cover; object-position: center center; transition: transform .3s var(--ease); }
        .uc-media-glow {
          position: absolute; z-index: 0; width: 62%; height: 82%; right: -10%; top: -18%; border-radius: 50%;
          background: radial-gradient(closest-side, var(--accent-glow), transparent 70%);
          filter: blur(12px); opacity: .65; transition: opacity .3s var(--ease), transform .5s var(--ease);
        }
        .uc-card:hover .uc-media-glow { opacity: 1; transform: scale(1.12); }
        /* SVG scene fills the media area; scales sharp at any size (no layout shift) */
        .uc-art {
          position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%;
          transform: scale(1); transform-origin: center;
          transition: transform .3s var(--ease);
        }
        .uc-card:hover .uc-art,
        .uc-card:hover .uc-media-img { transform: scale(1.04); }
        /* bottom fade → scene melts into the card, keeps the title area balanced */
        .uc-media-overlay {
          position: absolute; z-index: 1; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, transparent 58%, color-mix(in oklab, var(--bg-elevated) 82%, transparent));
        }

        /* category overlay */
        .uc-badge {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          font-family: var(--font-label); font-size: 11.5px; font-weight: 600;
          letter-spacing: .02em; color: var(--accent);
          padding: 5px 11px; border-radius: var(--radius-pill);
          background: color-mix(in oklab, var(--accent-soft) 80%, transparent);
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
        }

        /* ── Body ── */
        .uc-body { display: flex; flex-direction: column; gap: 10px; flex: 1; padding: 4px 8px 8px; }
        .uc-title {
          font-family: var(--font-display); font-weight: 600;
          font-size: 20px; letter-spacing: -0.02em; line-height: 1.2; margin: 0;
        }
        .uc-desc {
          color: var(--fg-muted); font-size: 14px; line-height: 1.6; margin: 0; flex: 1;
          text-wrap: pretty;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* ── CTA pill ── */
        .uc-cta {
          align-self: flex-start; margin-top: 6px;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: var(--radius-pill);
          font-family: var(--font-display); font-weight: 600; font-size: 13.5px;
          color: var(--accent);
          background: var(--accent-soft);
          border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
          transition: background var(--dur) var(--ease), color var(--dur) var(--ease),
                      gap var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
        }
        .uc-cta svg { transition: transform var(--dur) var(--ease); }
        .uc-card:hover .uc-cta {
          background: var(--accent); color: var(--accent-fg);
          border-color: var(--accent); gap: 11px;
          box-shadow: 0 0 0 6px var(--accent-glow);
        }
        .uc-card:hover .uc-cta svg { transform: translateX(3px); }

        /* ── Load more ── */
        .uc-load-row { display: flex; justify-content: center; margin-top: 44px; }
        .uc-load-more { border-radius: var(--radius-pill); }
        .uc-load-more svg { transition: transform var(--dur) var(--ease); }
        .uc-load-more:hover svg { transform: translateY(2px); }
        .uc-load-done {
          font-family: var(--font-label); font-size: 13px; font-weight: 500;
          color: var(--fg-subtle); letter-spacing: .02em;
        }

        @media (prefers-reduced-motion: reduce) {
          .uc-card, .uc-art, .uc-media-img, .uc-media-glow, .uc-cta svg { transition: none; }
          .uc-card:hover, .uc-card:hover .uc-art, .uc-card:hover .uc-media-img { transform: none; }
        }
      `}</style>

      <section id="usecases" className="usecases">
        <div className="container">
          {showHead && (
            <div className="usecases-head" data-reveal="fade-up">
              <span className="eyebrow">Use cases</span>
              <h2 className="section-title">
                Explore What You Can Do with <em>Clarant</em>
              </h2>
              <p className="section-lede">
                Clarant helps teams turn business information into useful answers and action.
                Explore how it supports different workflows across your organization.
              </p>
            </div>
          )}

          <div className="uc-card-grid" ref={gridRef}>
            {USE_CASES.slice(0, visible).map((uc, i) => {
              return (
                <a
                  key={uc.href}
                  href={uc.href}
                  className="uc-card"
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${(i % 3) * 70}ms` } as any}
                  aria-label={`${uc.title} — explore use case`}
                >
                  <div className="uc-media">
                   
                    <CardThumb uc={uc} />
                  </div>

                  <div className="uc-body">
                    <h3 className="uc-title">{uc.title}</h3>
                    <p className="uc-desc">{uc.desc}</p>
                    <span className="uc-cta" aria-hidden="true">
                      Explore Use Case <ArrowRight size={14} />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>

          <div className="uc-load-row">
            {allShown ? (
              <span className="uc-load-done" role="status">No more use cases</span>
            ) : (
              <button
                type="button"
                className="btn btn-ghost uc-load-more"
                onClick={() => setVisible(v => Math.min(v + BATCH, USE_CASES.length))}
              >
                Load more <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
