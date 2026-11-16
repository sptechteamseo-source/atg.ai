/* eslint-disable @next/next/no-img-element */

/* "Connect everything" — ported from the reference: a dark connector strip with
   a header and a mask-faded marquee of real brand logos + names scrolling on a
   loop (two duplicate groups). Logos are bundled locally in /public/logos
   (simpleicons SVGs + brand favicons), so there are no external runtime calls.
   The band is intentionally dark (like the reference) so every brand logo reads. */

const CONNECTORS: { name: string; logo: string }[] = [
  { name: 'HubSpot', logo: '/logos/hubspot.svg' },
  { name: 'Notion', logo: '/logos/notion.svg' },
  { name: 'Google Drive', logo: '/logos/google-drive.svg' },
  { name: 'Slack', logo: '/logos/slack.png' },
  { name: 'Fathom', logo: '/logos/fathom.png' },
  { name: 'Fireflies.ai', logo: '/logos/fireflies.png' },
  { name: 'Confluence', logo: '/logos/confluence.svg' },
  { name: 'Outlook', logo: '/logos/outlook.png' },
  { name: 'Gmail', logo: '/logos/gmail.svg' },
  { name: 'Salesforce', logo: '/logos/salesforce.png' },
  { name: 'Zoom', logo: '/logos/zoom.svg' },
  { name: 'Google Calendar', logo: '/logos/google-calendar.svg' },
  { name: 'Google Meet', logo: '/logos/google-meet.svg' },
  { name: 'Microsoft Teams', logo: '/logos/teams.png' },
  { name: 'Jira', logo: '/logos/jira.svg' },
  { name: 'Linear', logo: '/logos/linear.svg' },
  { name: 'Monday.com', logo: '/logos/monday.png' },
  { name: 'Stripe', logo: '/logos/stripe.svg' },
  { name: 'Box', logo: '/logos/box.svg' },
  { name: 'Calendly', logo: '/logos/calendly.svg' },
  { name: 'Asana', logo: '/logos/asana.svg' },
  { name: 'ClickUp', logo: '/logos/clickup.svg' },
  { name: 'Google Docs', logo: '/logos/google-docs.svg' },
  { name: 'Google Sheets', logo: '/logos/google-sheets.svg' },
  { name: 'Google Slides', logo: '/logos/google-slides.svg' },
]

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="mq-group" aria-hidden={hidden || undefined}>
      {CONNECTORS.map((c) => (
        <li key={c.name} className="mq-item">
          <img src={c.logo} alt="" width={22} height={22} loading="eager" decoding="async" className="mq-logo" />
          <span className="mq-name">{c.name}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Logos() {
  return (
    <>
      <style>{`
        .mq { background: var(--bg); border-bottom: 1px solid var(--border); overflow: hidden; padding: 0; }
        .mq-head { max-width: 1200px; margin: 0 auto; padding: clamp(32px, 4vw, 44px) clamp(20px, 4vw, 32px) 0; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 24px; }
        .mq-title { font-family: var(--font-body); font-size: 12.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #9DA3AD; margin: 0; }
        .mq-sub { font-size: 14.5px; line-height: 1.5; color: #868C96; }
        .mq-viewport {
          position: relative; max-width: 1400px; margin: 0 auto;
          padding: clamp(24px, 3vw, 32px) 0 clamp(32px, 4vw, 44px); overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
                  mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
        }
        .mq-track { display: flex; width: max-content; animation: mq-scroll 60s linear infinite; will-change: transform; }
        .mq-group { list-style: none; margin: 0; padding: 0 56px 0 0; display: flex; align-items: center; gap: 56px; flex: none; }
        .mq-item { display: flex; align-items: center; gap: 10px; flex: none; white-space: nowrap; }
        .mq-logo { display: block; width: 22px; height: 22px; object-fit: contain; opacity: 0.85; }
        .mq-name { font-size: 15px; font-weight: 500; color: #9DA3AD; }
        .mq-viewport:hover .mq-track { animation-play-state: paused; }
        @keyframes mq-scroll { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .mq-track { animation: none; } }
      `}</style>

      <section className="mq" aria-label="Connectors">
        <div className="mq-head">
          <h2 className="mq-title">Connect everything</h2>
          <p className="mq-sub">30+ native connectors. Add your own with the API.</p>
        </div>
        <div className="mq-viewport">
          <div className="mq-track">
            <Group />
            <Group hidden />
          </div>
        </div>
      </section>
    </>
  )
}
