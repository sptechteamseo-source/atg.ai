'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

/* Hero — ported directly from the reference design: a laptop device mockup whose
   screen runs a scripted Clarant demo (connect Gmail → ask Clara to create, then
   update, a Zoom meeting). The device is intrinsically dark (a screen); the hero
   copy + CTAs use the site's tokens so they read in light and dark. Timeline,
   copy, meeting details and the clarant-mark.png asset are the reference's own. */

const DEMO_M1 = 'Create a Zoom meeting titled Marketplace Review tomorrow at 1:00 PM, 30 minutes, timezone America/Los_Angeles. Agenda: 1. Product demo 2. Questions.'
const DEMO_M2 = 'Update my Zoom meeting Marketplace Review: move it to 7:00 PM and add Next steps to the agenda.'
const DEMO_H1 = 'Your Zoom meeting has been scheduled.'
const A = '#30B4E6'

interface Detail { label: string; pre: string; hi?: string; post?: string; link?: string }
const DET1: Detail[] = [
  { label: 'Topic', pre: 'Marketplace Review' },
  { label: 'Date & Time', pre: 'Tomorrow at 1:00 PM America/Los_Angeles' },
  { label: 'Duration', pre: '30 minutes' },
  { label: 'Agenda', pre: 'Product demo, Questions' },
  { label: 'Join Link', pre: '', link: 'Join Meeting' },
]
const DET2: Detail[] = [
  { label: 'Topic', pre: 'Marketplace Review' },
  { label: 'Date & Time', pre: 'Tomorrow at ', hi: '7:00 PM', post: ' America/Los_Angeles' },
  { label: 'Duration', pre: '30 minutes' },
  { label: 'Agenda', pre: 'Product demo, Questions, ', hi: 'Next steps' },
]

// Gmail logo (featured in the connect modal) — full colour.
const GmailLogo = () => (
  <svg viewBox="0 0 256 193" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
    <path d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z" fill="#4285F4" />
    <path d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798z" fill="#34A853" />
    <path d="m58.182 93.14-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z" fill="#EA4335" />
    <path d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z" fill="#FBBC04" />
    <path d="M0 49.504 26.759 69.57 58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.231z" fill="#C5221F" />
  </svg>
)

// Connector cards — Gmail uses the real logo; the rest use brand-coloured letter tiles.
const CARDS: { name: string; letter?: string; bg?: string; logo?: boolean; desc: string }[] = [
  { name: 'HubSpot', letter: 'H', bg: '#FF7A59', desc: 'Connect your HubSpot CRM via OAuth to search contacts, companies, deals, and users.' },
  { name: 'Slack', letter: 'S', bg: '#611F69', desc: 'Connect to Slack to share messages, create canvases, search threads, and read channel history.' },
  { name: 'Outlook', letter: 'O', bg: '#0F6CBD', desc: 'Connect your Microsoft account to read emails, create drafts, and send messages.' },
  { name: 'Salesforce', letter: 'S', bg: '#00A1E0', desc: 'Connect to your Salesforce org to read, create, update, and delete Salesforce objects.' },
  { name: 'Gmail', logo: true, desc: 'Connect your Gmail account to search, read emails, and create drafts.' },
  { name: 'Zoom', letter: 'Z', bg: '#0B5CFF', desc: 'Connect Zoom to access meetings, cloud recordings, transcripts, Team Chat, and webinars.' },
]

interface DemoState { g: number; sc: 'gmail' | 'chat'; c1: number; s1: boolean; t1: boolean; r1: number; h1: number; c2: number; s2: boolean; t2: boolean; r2: number; press: boolean; fade: boolean }
const INIT: DemoState = { g: 0, sc: 'gmail', c1: 0, s1: false, t1: false, r1: 0, h1: 0, c2: 0, s2: false, t2: false, r2: 0, press: false, fade: false }
const FINAL: DemoState = { ...INIT, sc: 'chat', c1: DEMO_M1.length, s1: true, r1: 8, h1: DEMO_H1.length, c2: DEMO_M2.length, s2: true, r2: 7 }

const MARK = '/clarant-mark.png'

function ClarantLaptop() {
  const [d, setD] = useState<DemoState>(INIT)
  const deviceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setD(FINAL); return }

    const alive = { v: true }
    let started = false
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))
    const set = (p: Partial<DemoState>) => { if (alive.v) setD((s) => ({ ...s, ...p })) }
    const type = async (key: 'c1' | 'c2', text: string) => {
      for (let i = 1; i <= text.length; i++) {
        if (!alive.v) return
        set({ [key]: i } as Partial<DemoState>)
        const ch = text[i - 1]
        await wait(/[,.:]/.test(ch) ? 170 + Math.random() * 140 : ch === ' ' ? 40 + Math.random() * 50 : 22 + Math.random() * 36)
      }
    }

    const run = async () => {
      while (alive.v) {
        setD({ ...INIT }); await wait(800)
        set({ g: 1 }); await wait(900); set({ g: 2 }); await wait(1150); set({ g: 3 }); await wait(1400); set({ g: 4 }); await wait(1000); set({ g: 5 }); await wait(1200)
        set({ sc: 'chat' }); await wait(1000)
        await type('c1', DEMO_M1); await wait(500)
        set({ press: true }); await wait(160); set({ press: false, s1: true }); await wait(450)
        set({ t1: true }); await wait(1600); set({ t1: false, r1: 1 }); await wait(400)
        for (let i = 1; i <= DEMO_H1.length; i += 2) { set({ h1: i }); await wait(26) }
        set({ h1: DEMO_H1.length }); await wait(300)
        for (let r = 2; r <= 8; r++) { set({ r1: r }); await wait(330) }
        await wait(1500)
        await type('c2', DEMO_M2); await wait(500)
        set({ press: true }); await wait(160); set({ press: false, s2: true }); await wait(450)
        set({ t2: true }); await wait(1500); set({ t2: false, r2: 1 }); await wait(400)
        for (let r = 2; r <= 7; r++) { set({ r2: r }); await wait(360) }
        await wait(3400)
        set({ fade: true }); await wait(600)
      }
    }

    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !started) { started = true; run() }
    }), { threshold: 0.25 })
    if (deviceRef.current) io.observe(deviceRef.current)
    return () => { alive.v = false; io.disconnect() }
  }, [])

  // ── derived flags (ported from demoVals) ──
  const chat = d.sc === 'chat'
  const r1done = d.r1 >= 8
  const modalOn = d.g >= 1 && d.g < 5
  const gmailConnected = d.g >= 5
  const det1 = DET1.slice(0, Math.max(0, d.r1 - 2))
  const det2 = DET2.slice(0, Math.max(0, d.r2 - 3))
  let input = ''
  if (chat && !d.s1) input = DEMO_M1.slice(0, d.c1)
  else if (chat && r1done && !d.s2) input = DEMO_M2.slice(0, d.c2)
  const ready = (chat && !d.s1 && d.c1 === DEMO_M1.length) || (chat && r1done && !d.s2 && d.c2 === DEMO_M2.length)
  const typingPhase = chat && (!d.s1 || (r1done && !d.s2))
  const gLabel = d.g >= 4 ? 'Connected' : d.g === 3 ? 'Connecting…' : 'Connect'

  const row = (icon: React.ReactNode, label: React.ReactNode) => (
    <span className="lt-navitem">{icon}{label}</span>
  )
  const nav = (p: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lt-navic"><path d={p} /></svg>

  return (
    <div className="lt-device" ref={deviceRef} role="img" aria-label="Clarant demo: connecting Gmail, then asking Clara to create and update a Zoom meeting">
      <div className="lt-glow" aria-hidden="true" />
      <div className="lt-body">
        <span className="lt-cam" aria-hidden="true" />
        <div className="lt-screen">
          {/* Sidebar */}
          <aside className="lt-side">
            <div className="lt-brand">
              <span className="lt-brand-name"><Image src={MARK} alt="" width={20} height={20} className="lt-mark" />Clarant</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9DA3AD" strokeWidth="1.8" className="lt-panelic"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
            </div>
            {row(nav('M12 5v14M5 12h14'), 'New Chat')}
            {row(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lt-navic"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>, 'Search')}
            {row(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="lt-navic"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg>, <>Intelligence<span className="lt-soon">Soon</span></>)}
            {row(nav('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'), 'Chats')}
            {row(nav('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), 'Workspaces')}
            {row(nav('M4 4v16M8 4v16M12 4l4 16'), <>Library<span style={{ flex: 1 }} /></>)}
            <span className="lt-divider" />
            <span className="lt-recent-head">RECENT CHATS</span>
            <span className={`lt-recent ${d.s1 ? 'is-active' : ''}`}>Create A Zoom Meeting Titled…</span>
            <span className="lt-recent">Move The Marketplace Review T…</span>
            <span className="lt-recent">Get All My Latest Gmails?</span>
            <span className="lt-recent">Get All My Zoom Meetings?</span>
          </aside>

          {/* Main */}
          <div className="lt-main">
            {/* Chat scene */}
            <div className="lt-scene" style={{ opacity: chat && !d.fade ? 1 : 0, pointerEvents: chat ? 'auto' : 'none' }}>
              <div className="lt-chat-title">{d.s1 ? 'Create A Zoom Meeting Titled Marketplace' : 'New Chat'}</div>
              <div className="lt-thread">
                {chat && !d.s1 && (
                  <div className="lt-empty">
                    <Image src={MARK} alt="" width={40} height={40} className="lt-empty-mark" />
                    <span className="lt-empty-text">How can Clara help today?</span>
                  </div>
                )}
                {d.s1 && <div className="lt-user dm-in">{DEMO_M1}</div>}
                {d.t1 && <Thinking />}
                {d.r1 >= 1 && (
                  <div className="lt-ai">
                    <ThoughtHead />
                    <div>{DEMO_H1.slice(0, d.h1)}{d.r1 === 1 && <span className="lt-stream-caret" />}</div>
                    {d.r1 >= 2 && <b className="lt-ai-label dm-in">Meeting Details:</b>}
                    <ul className="lt-detlist">
                      {det1.map((x) => (
                        <li key={x.label} className="dm-in"><b>{x.label}:</b> {x.pre}{x.hi && <span className="lt-hi">{x.hi}</span>}{x.link && <span className="lt-link">{x.link}</span>}</li>
                      ))}
                    </ul>
                    {r1done && <ResultIcons />}
                  </div>
                )}
                {d.s2 && <div className="lt-user dm-in">{DEMO_M2}</div>}
                {d.t2 && <Thinking />}
                {d.r2 >= 1 && (
                  <div className="lt-ai">
                    <ThoughtHead />
                    {d.r2 >= 2 && <span className="lt-updated dm-in"><svg viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="lt-check"><path d="M20 6 9 17l-5-5" /></svg>Meeting details updated</span>}
                    {d.r2 >= 3 && <b className="lt-ai-label dm-in">Meeting Details:</b>}
                    <ul className="lt-detlist">
                      {det2.map((x) => (
                        <li key={x.label} className="dm-in"><b>{x.label}:</b> {x.pre}{x.hi && <span className="lt-hi">{x.hi}</span>}{x.post}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="lt-input">
                <span className="lt-input-plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg></span>
                <div className="lt-input-box">
                  <span>
                    {!input && <span className="lt-ph">{d.s1 ? 'Ask a follow-up question…' : 'Ask Clara anything…'}</span>}
                    {input}
                    {typingPhase && <span className="lt-caret" />}
                  </span>
                </div>
                <span className={`lt-send ${ready ? 'is-ready' : ''} ${d.press ? 'is-press' : ''}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                </span>
              </div>
            </div>

            {/* Gmail / Connectors scene */}
            <div className="lt-scene lt-gscene" style={{ opacity: chat ? 0 : 1, pointerEvents: chat ? 'none' : 'auto' }}>
              <div className="lt-gbg" style={{ filter: modalOn ? 'blur(2px)' : 'none', opacity: modalOn ? 0.45 : 1 }}>
                <div className="lt-ghead">
                  <span className="lt-gicon"><svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" /></svg></span>
                  <div><div className="lt-gtitle">Connectors</div><div className="lt-gsub">Connect your tools to Clarant and search across them securely.</div></div>
                </div>
                <div className="lt-gsearch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>Search connectors by name or description…</div>
                <div className="lt-gcards">
                  {CARDS.map((c) => {
                    const conn = c.name === 'Gmail' && gmailConnected
                    return (
                      <div key={c.name} className="lt-gcard" style={{ borderColor: conn ? 'rgba(48,180,230,0.55)' : 'rgba(255,255,255,0.08)' }}>
                        <span className="lt-gcard-logo" style={c.logo ? undefined : { background: c.bg }}>
                          {c.logo ? <GmailLogo /> : <span className="lt-gcard-letter">{c.letter}</span>}
                        </span>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="lt-gcard-name">{c.name}{conn && <span className="lt-gcard-chip dm-in">Connected</span>}</div>
                          <div className="lt-gcard-desc">{c.desc}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="lt-goverlay" style={{ opacity: modalOn ? 1 : 0 }} />
              <div className="lt-gmodal" style={{ opacity: modalOn ? 1 : 0, transform: `translate(-50%, -50%) scale(${modalOn ? 1 : 0.94})` }}>
                <div className="lt-gmodal-box">
                  <div className="lt-gmodal-bar" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="#9DA3AD" strokeWidth="2" strokeLinecap="round" className="lt-gmodal-x"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  <div className="lt-gmodal-body">
                    <span className="lt-gmodal-icon"><GmailLogo /></span>
                    <div className="lt-gmodal-name">Gmail</div>
                    <div className="lt-gmodal-desc">Connect your Gmail account to search, read emails, and create drafts.</div>
                    <div className="lt-gmodal-auth"><svg viewBox="0 0 24 24" fill="none" stroke="#9DA3AD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lt-auth-ic"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><div><div className="lt-auth-label">Authentication</div><div className="lt-auth-val">Oauth</div></div></div>
                  </div>
                  <div className="lt-gmodal-foot">
                    <span className="lt-gmodal-cancel">Cancel</span>
                    <span className="lt-gmodal-connect" style={{ background: d.g >= 4 ? A : '#FFFFFF', transform: d.g === 3 ? 'scale(.96)' : 'none' }}>
                      {d.g === 3 && <span className="lt-gspin" />}{gLabel}
                    </span>
                  </div>
                  <div className="lt-cursor" aria-hidden="true" style={{ left: d.g >= 2 ? '84%' : '120%', top: d.g >= 2 ? '88%' : '135%', opacity: modalOn ? 1 : 0 }}>
                    <span className="lt-ripple" style={{ animation: d.g === 3 ? 'dm-click .6s ease-out' : 'none' }} />
                    <svg viewBox="0 0 16 18" className="lt-cursor-svg"><path d="M1 1v14l3.8-3.6 2.6 5.6 2.4-1.1-2.6-5.5H13L1 1Z" fill="#fff" stroke="#16171A" strokeWidth="1" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lt-hinge"><span className="lt-notch" /></div>
    </div>
  )
}

const Thinking = () => (
  <div className="lt-thinking dm-in"><Image src={MARK} alt="" width={14} height={14} className="lt-think-mark" />Clara is thinking<span className="lt-dots"><span /><span /><span /></span></div>
)
const ThoughtHead = () => (
  <div className="lt-thought dm-in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lt-thought-ic"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><b>Thought processed</b><span className="lt-thought-steps">2 steps</span><span style={{ flex: 1 }} /><svg viewBox="0 0 24 24" fill="none" stroke="#868C96" strokeWidth="2" className="lt-thought-chev"><path d="m6 9 6 6 6-6" /></svg></div>
)
const ResultIcons = () => (
  <div className="lt-resicons dm-in">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v11M15 5.9 14 10h5.8a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.4 21H7V10l4-8a3 3 0 0 1 4 3.9Z" /></svg>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V3M9 18.1 10 14H4.2a2 2 0 0 1-2-2.3l1.4-7A2 2 0 0 1 5.6 3H17v11l-4 8a3 3 0 0 1-4-3.9Z" /></svg>
  </div>
)

export default function Hero() {
  return (
    <>
      <style>{`
        .hero { position: relative; overflow: hidden; padding-top: 40px; padding-bottom: var(--section-pad-y); }
        .hero-glow-bg { position: absolute; top: 4%; right: -8%; width: 60%; height: 90%; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at 55% 45%, var(--accent-glow), transparent 62%); }
        .hero-row { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr; gap: clamp(36px, 5vw, 56px); align-items: center; }
        @media (min-width: 768px) { .hero-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr); } }
        .hero-copy { min-width: 0; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-label); font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 22px; }
        .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 9999px; background: var(--accent); }
        .hero-title { font-family: var(--font-display); font-size: clamp(40px, 5.4vw, 68px); font-weight: 700; line-height: 1.02; letter-spacing: -0.035em; color: var(--fg); margin-bottom: 24px; text-wrap: balance; }
        .hero-title em { font-style: normal; color: var(--accent); }
        .hero-lede { font-size: clamp(16px, 1.4vw, 18px); line-height: 1.65; color: var(--fg-muted); margin-bottom: 36px; max-width: 52ch; text-wrap: pretty; }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 12px; }
        .hero-device-col { min-width: 0; display: flex; justify-content: center; }

        /* ── Laptop device (intrinsically dark) ── */
        .lt-device { position: relative; width: min(100%, 720px); }
        .lt-glow { position: absolute; inset: -6% -4%; z-index: -1; background: radial-gradient(closest-side, var(--accent-glow), transparent 70%); filter: blur(30px); }
        .lt-body { position: relative; padding: 10px 10px 13px; border-radius: 16px 16px 6px 6px;
          background: linear-gradient(180deg, #24272D, #141619);
          box-shadow: 0 40px 80px -36px rgba(48,180,230,0.35), inset 0 0 0 1px rgba(255,255,255,0.07); }
        .lt-cam { position: absolute; top: 4px; left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 9999px; background: #3A3E46; }
        .lt-screen { position: relative; aspect-ratio: 18 / 12; border-radius: 6px; overflow: hidden; background: #1A1B1E;
          container-type: inline-size; display: grid; grid-template-columns: 27% minmax(0, 1fr);
          font-family: var(--font-body); color: #E4E6EA; }
        .lt-hinge { position: relative; height: 14px; margin: 0 -7%; border-radius: 2px 2px 14px 14px;
          background: linear-gradient(180deg, #3A3D44 0%, #23252A 100%); box-shadow: 0 18px 26px -14px rgba(0,0,0,0.9); }
        .lt-notch { position: absolute; top: 0; left: 50%; width: 16%; height: 5px; margin-left: -8%; border-radius: 0 0 8px 8px; background: #1A1C20; }

        /* ── Sidebar ── */
        .lt-side { background: #121316; border-right: 1px solid rgba(255,255,255,0.07); padding: 2.4cqw 1.6cqw; display: flex; flex-direction: column; gap: .2cqw; min-width: 0; overflow: hidden; }
        .lt-brand { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4cqw; padding: 0 .6cqw; }
        .lt-brand-name { display: flex; align-items: center; gap: .7cqw; font-family: var(--font-display); font-size: 3.68cqw; font-weight: 700; color: #FFFFFF; }
        .lt-mark { width: 2.6cqw !important; height: 2.6cqw !important; object-fit: contain; }
        .lt-panelic { width: 1.8cqw; height: 1.8cqw; }
        .lt-navitem { display: flex; align-items: center; gap: 1cqw; padding: .75cqw 1cqw; font-size: 2.08cqw; font-weight: 500; color: #E4E6EA; white-space: nowrap; }
        .lt-navic { width: 1.5cqw; height: 1.5cqw; flex: none; }
        .lt-soon { font-size: 1.36cqw; font-weight: 600; color: #30B4E6; background: rgba(48,180,230,0.14); padding: .25cqw .6cqw; border-radius: .5cqw; }
        .lt-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 1.2cqw 0; }
        .lt-recent-head { font-size: 1.52cqw; font-weight: 600; letter-spacing: .1em; color: #9DA3AD; padding: 0 1cqw; margin-bottom: .6cqw; }
        .lt-recent { padding: .75cqw 1cqw; font-size: 1.92cqw; border-radius: 1cqw; color: #C9CDD3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background .3s, color .3s; }
        .lt-recent.is-active { background: #FFFFFF; color: #16171A; }

        /* ── Main / scenes ── */
        .lt-main { position: relative; min-width: 0; overflow: hidden; }
        .lt-scene { position: absolute; inset: 0; display: flex; flex-direction: column; transition: opacity .5s ease; }
        .lt-chat-title { padding: 1.7cqw 3cqw; font-size: 2.32cqw; font-weight: 600; color: #FFFFFF; border-bottom: 1px solid rgba(255,255,255,0.07); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lt-thread { flex: 1; min-height: 0; overflow: hidden; padding: 2.4cqw 4cqw 1.6cqw; display: flex; flex-direction: column; gap: 1.8cqw; }
        .lt-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1cqw; opacity: .9; }
        .lt-empty-mark { width: 4.5cqw !important; height: 4.5cqw !important; object-fit: contain; }
        .lt-empty-text { font-family: var(--font-display); font-size: 3.2cqw; font-weight: 600; color: #FFFFFF; }
        .lt-user { align-self: flex-end; max-width: 80%; background: #FFFFFF; color: #16171A; border-radius: 1.4cqw; padding: 1.2cqw 1.6cqw; font-size: 2cqw; line-height: 1.55; }
        .lt-thinking { display: flex; align-items: center; gap: .8cqw; font-size: 1.92cqw; color: #9DA3AD; }
        .lt-think-mark { width: 1.8cqw !important; height: 1.8cqw !important; object-fit: contain; }
        .lt-dots { display: inline-flex; gap: .35cqw; margin-left: .2cqw; }
        .lt-dots span { width: .5cqw; height: .5cqw; border-radius: 9999px; background: #30B4E6; animation: lp-dot 1s ease-in-out infinite; }
        .lt-dots span:nth-child(2) { animation-delay: .15s; } .lt-dots span:nth-child(3) { animation-delay: .3s; }
        .lt-ai { display: flex; flex-direction: column; gap: 1cqw; font-size: 2cqw; line-height: 1.55; color: #E4E6EA; }
        .lt-thought { display: flex; align-items: center; gap: .7cqw; }
        .lt-thought-ic { width: 1.3cqw; height: 1.3cqw; flex: none; }
        .lt-thought b { font-size: 1.76cqw; font-weight: 600; color: #FFFFFF; }
        .lt-thought-steps { font-size: 1.68cqw; color: #868C96; }
        .lt-thought-chev { width: 1.2cqw; height: 1.2cqw; }
        .lt-stream-caret { display: inline-block; width: .15cqw; height: 1.2em; margin-left: .15cqw; vertical-align: text-bottom; background: #30B4E6; animation: lp-blink 1s step-end infinite; }
        .lt-ai-label { font-weight: 700; color: #FFFFFF; }
        .lt-detlist { margin: 0; padding-left: 1.6cqw; display: flex; flex-direction: column; gap: .35cqw; }
        .lt-detlist li b { color: #FFFFFF; font-weight: 700; }
        .lt-hi { color: #30B4E6; font-weight: 600; }
        .lt-link { color: #FFFFFF; text-decoration: underline; text-underline-offset: .3cqw; }
        .lt-resicons { display: flex; gap: 1.2cqw; color: #868C96; }
        .lt-resicons svg { width: 1.3cqw; height: 1.3cqw; flex: none; }
        .lt-updated { align-self: flex-start; display: inline-flex; align-items: center; gap: .6cqw; padding: .4cqw 1cqw; border-radius: 9999px; border: 1px solid rgba(48,180,230,0.45); background: rgba(48,180,230,0.1); font-size: 1.76cqw; font-weight: 600; color: #30B4E6; }
        .lt-check { width: 1.1cqw; height: 1.1cqw; }
        .lt-input { margin: 0 4cqw 2.2cqw; display: flex; align-items: flex-end; gap: 1cqw; padding: 1cqw 1cqw 1cqw 1.4cqw; border-radius: 2cqw; border: 1px solid rgba(255,255,255,0.12); background: #232428; }
        .lt-input-plus { flex: none; width: 2.4cqw; height: 2.4cqw; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; color: #C9CDD3; }
        .lt-input-plus svg { width: 1.2cqw; height: 1.2cqw; }
        .lt-input-box { flex: 1; min-width: 0; max-height: 5.8cqw; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; font-size: 2cqw; line-height: 1.55; padding: .35cqw 0; color: #FFFFFF; }
        .lt-ph { color: #7D838D; }
        .lt-caret { display: inline-block; width: .15cqw; height: 1.2em; margin-left: .1cqw; vertical-align: text-bottom; background: #FFFFFF; animation: lp-blink 1s step-end infinite; }
        .lt-send { flex: none; width: 2.6cqw; height: 2.6cqw; border-radius: 9999px; display: flex; align-items: center; justify-content: center; background: #3A3B40; color: #7D838D; transition: background .25s, color .25s, transform .15s, box-shadow .25s; }
        .lt-send svg { width: 1.3cqw; height: 1.3cqw; }
        .lt-send.is-ready { background: #FFFFFF; color: #000000; box-shadow: 0 0 0 .4cqw rgba(255,255,255,0.12); }
        .lt-send.is-press { transform: scale(.85); }

        /* ── Gmail / connectors scene ── */
        .lt-gbg { position: absolute; inset: 0; padding: 2.8cqw 3.2cqw; transition: filter .4s, opacity .4s; overflow: hidden; }
        .lt-ghead { display: flex; align-items: center; gap: 1.4cqw; margin-bottom: 2cqw; }
        .lt-gicon { flex: none; width: 4.4cqw; height: 4.4cqw; border-radius: 9999px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; }
        .lt-gicon svg { width: 2cqw; height: 2cqw; }
        .lt-gtitle { font-family: var(--font-display); font-size: 4.16cqw; font-weight: 600; color: #FFFFFF; line-height: 1.1; }
        .lt-gsub { font-size: 1.84cqw; color: #A9AEB7; margin-top: .3cqw; }
        .lt-gsearch { display: flex; align-items: center; gap: .9cqw; padding: 1cqw 1.4cqw; border-radius: 1cqw; border: 1px solid rgba(255,255,255,0.12); background: #202125; font-size: 1.84cqw; color: #9DA3AD; margin-bottom: 1.8cqw; }
        .lt-gsearch svg { width: 1.3cqw; height: 1.3cqw; flex: none; }
        .lt-gcards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2cqw; }
        .lt-gcard { display: flex; align-items: flex-start; gap: 1.1cqw; padding: 1.3cqw; border-radius: 1.4cqw; background: #202125; border: 1px solid rgba(255,255,255,0.08); transition: border-color .4s; }
        .lt-gcard-logo { flex: none; width: 3.4cqw; height: 3.4cqw; border-radius: .9cqw; background: #FFFFFF; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .lt-gcard-logo > svg { width: 2.1cqw; height: 2.1cqw; }
        .lt-gcard-letter { font-family: var(--font-display); font-size: 2cqw; font-weight: 700; color: #FFFFFF; }
        .lt-gcard-name { display: flex; align-items: center; gap: .7cqw; font-size: 2cqw; font-weight: 600; color: #FFFFFF; }
        .lt-gcard-chip { font-size: 1.36cqw; font-weight: 600; color: #30B4E6; background: rgba(48,180,230,0.14); padding: .2cqw .6cqw; border-radius: 9999px; }
        .lt-gcard-desc { font-size: 1.6cqw; line-height: 1.45; color: #A9AEB7; margin-top: .3cqw; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .lt-goverlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); transition: opacity .4s; }
        .lt-gmodal { position: absolute; left: 50%; top: 50%; width: 52%; transition: opacity .35s ease, transform .35s cubic-bezier(.2,0,0,1); }
        .lt-gmodal-box { position: relative; background: #26272B; border: 1px solid rgba(255,255,255,0.1); border-radius: 2cqw; box-shadow: 0 2cqw 5cqw rgba(0,0,0,0.5); }
        .lt-gmodal-bar { height: 4.6cqw; background: #2E2F34; border-radius: 2cqw 2cqw 0 0; }
        .lt-gmodal-x { position: absolute; top: 1.6cqw; right: 1.6cqw; width: 1.3cqw; height: 1.3cqw; }
        .lt-gmodal-body { padding: 0 2.6cqw 2.2cqw; margin-top: -2.6cqw; }
        .lt-gmodal-icon { display: flex; width: 5.2cqw; height: 5.2cqw; border-radius: 1.2cqw; background: #1A1B1E; border: 1px solid rgba(255,255,255,0.1); align-items: center; justify-content: center; margin-bottom: 1.4cqw; overflow: hidden; padding: 1.1cqw; }
        .lt-gmodal-name { font-family: var(--font-display); font-size: 3.36cqw; font-weight: 700; color: #FFFFFF; margin-bottom: .6cqw; }
        .lt-gmodal-desc { font-size: 1.92cqw; line-height: 1.5; color: #C9CDD3; margin-bottom: 1.6cqw; }
        .lt-gmodal-auth { display: flex; gap: .8cqw; font-size: 1.84cqw; }
        .lt-auth-ic { width: 1.3cqw; height: 1.3cqw; flex: none; color: #9DA3AD; margin-top: .15cqw; }
        .lt-auth-label { font-weight: 600; color: #FFFFFF; }
        .lt-auth-val { color: #A9AEB7; margin-top: .2cqw; }
        .lt-gmodal-foot { display: flex; justify-content: flex-end; gap: 1cqw; padding: 1.6cqw 2.2cqw; border-top: 1px solid rgba(255,255,255,0.08); }
        .lt-gmodal-cancel { padding: .9cqw 1.8cqw; border-radius: 9999px; background: #34353A; font-size: 1.92cqw; font-weight: 600; color: #FFFFFF; }
        .lt-gmodal-connect { display: inline-flex; align-items: center; gap: .7cqw; padding: .9cqw 1.8cqw; border-radius: 9999px; font-size: 1.92cqw; font-weight: 600; color: #000000; transition: background .3s, transform .15s; }
        .lt-gspin { display: inline-block; width: 1.1cqw; height: 1.1cqw; border-radius: 9999px; border: .2cqw solid rgba(0,0,0,0.2); border-top-color: #000; animation: dm-spin .7s linear infinite; }
        .lt-cursor { position: absolute; z-index: 3; pointer-events: none; transition: left 1s cubic-bezier(.4,0,.2,1), top 1s cubic-bezier(.4,0,.2,1), opacity .3s; }
        .lt-cursor-svg { position: relative; display: block; width: 2cqw; height: 2.3cqw; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); }
        .lt-ripple { position: absolute; left: -.6cqw; top: -.6cqw; width: 3cqw; height: 3cqw; border-radius: 9999px; background: rgba(48,180,230,0.45); opacity: 0; }

        .dm-in { animation: dm-in .4s cubic-bezier(.2,0,0,1) both; }
        @keyframes dm-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        @keyframes lp-dot { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
        @keyframes lp-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes dm-spin { to { transform: rotate(360deg); } }
        @keyframes dm-click { from { transform: scale(.2); opacity: .8; } to { transform: scale(1.8); opacity: 0; } }

        @media (max-width: 640px) {
          .hero { padding-top: 24px; }
          .hero-device-col { padding: 0; }
        }
      `}</style>

      <section id="top" className="hero">
        <div className="hero-glow-bg" aria-hidden="true" />
        <div className="container">
          <div className="hero-row">
            <div className="hero-copy">
              <div className="hero-eyebrow"><span className="hero-eyebrow-dot" />Clarant AI</div>
              <h1 className="hero-title">Your Business Knowledge. <em>Ready for Action.</em></h1>
              <p className="hero-lede">
                Stop searching across documents, emails, and business apps to get work done.
                Clarant AI connects your business information to answer questions, act across
                connected tools, and create documents using the information you already have.
              </p>
              <div className="hero-cta">
                <a href="https://app.clarant.ai/login" className="btn btn-accent btn-lg">Start Free Trial</a>
                <a href="https://calendly.com/nparikh-clarant/30min" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">Book a Demo</a>
              </div>
            </div>
            <div className="hero-device-col">
              <ClarantLaptop />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
