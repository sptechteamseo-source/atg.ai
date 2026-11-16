/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react'
import { prisma } from '@/lib/prisma'
import { FAQS, QUOTES, type QuoteItem } from '@/lib/data'
import { CALENDLY_URL, LOGIN_URL } from './links'
import HomePricing from './HomePricing'
import { Check, CheckSmall } from './HomeHero'

/* The homepage sections below the hero, in the order of the Clarant design reference.
   Presentation follows the reference; the data comes from the same sources the old homepage used
   (published testimonials, the pricing tiers, the FAQ list), so the content stays managed in one place. */

const sr = { className: 'sr' } as const

/* ---------- connect strip: the integrations marquee under the hero (logos are the brands' own marks) ---------- */
const CONNECT: { name: string; src: string }[] = [
  { name: 'Microsoft Teams', src: '/assets/home/logos/teams.svg' },
  { name: 'Jira', src: '/assets/home/logos/connect/jira.svg' },
  { name: 'Linear', src: '/assets/home/logos/connect/linear.svg' },
  { name: 'Monday.com', src: '/assets/home/logos/monday.svg' },
  { name: 'Stripe', src: '/assets/home/logos/connect/stripe.svg' },
  { name: 'Box', src: '/assets/home/logos/connect/box.svg' },
  { name: 'Calendly', src: '/assets/home/logos/connect/calendly.svg' },
  { name: 'Asana', src: '/assets/home/logos/connect/asana.svg' },
  { name: 'ClickUp', src: '/assets/home/logos/connect/clickup.svg' },
]

export function ProofStrip() {
  const items = CONNECT.map((t) => (
    <li key={t.name}>
      <img src={t.src} alt={t.name} width={22} height={22} loading="lazy" />
      <span>{t.name}</span>
    </li>
  ))
  return (
    <section className="connect" id="customers" aria-labelledby="connect-h">
      <div className="connect-head">
        <h2 id="connect-h" className="connect-title">Connect everything</h2>
        <p className="connect-note">30+ native connectors. Add your own with the API.</p>
      </div>
      <div className="connect-marquee">
        <div className="connect-track">
          <ul className="connect-group">{items}</ul>
          {/* second copy only drives the seamless loop on desktop; screen readers and phones get the first copy */}
          <ul className="connect-group connect-dup" aria-hidden="true">{items}</ul>
        </div>
      </div>
    </section>
  )
}

/* ---------- integrations: tools in, next steps out ---------- */
const TOOLS: { tool: string; name: string; file: string; ext?: 'png' }[] = [
  { tool: 'gmail', name: 'Gmail', file: 'gmail.svg' },
  { tool: 'outlook', name: 'Outlook', file: 'outlook.svg' },
  { tool: 'slack', name: 'Slack', file: 'slack.svg' },
  { tool: 'teams', name: 'Teams', file: 'teams.svg' },
  { tool: 'fathom', name: 'Fathom', file: 'fathom.png' },
  { tool: 'fireflies', name: 'Fireflies', file: 'fireflies.png' },
  { tool: 'granola', name: 'Granola', file: 'granola.svg' },
  { tool: 'meetgeek', name: 'MeetGeek', file: 'meetgeek.png' },
  { tool: 'salesforce', name: 'Salesforce', file: 'salesforce.svg' },
  { tool: 'hubspot', name: 'HubSpot', file: 'hubspot.svg' },
  { tool: 'gohighlevel', name: 'GoHighLevel', file: 'gohighlevel.png' },
  { tool: 'clickup', name: 'ClickUp', file: 'clickup.svg' },
  { tool: 'asana', name: 'Asana', file: 'asana.svg' },
  { tool: 'monday', name: 'Monday.com', file: 'monday.svg' },
]

export function Integrations() {
  return (
    <section className="sec" id="integrations">
      <div className="sec-head">
        <h2 className="h2"><span className="ln">Connect your tools once.</span> <span className="ln">Clarant does the reading.</span></h2>
        <p className="lead">Email, chat, meetings, CRM and projects all report into Clarant. It hands you back a ranked decision, a brief or a draft, ready to approve. <span className="tbd">[Integration list to be confirmed]</span></p>
      </div>
      <div className="flow" id="flow">
        <div className="flow-col">
          <p className="flow-h">What comes in, all day</p>
          <ul className="tiles" aria-label="Tools Clarant connects to">
            {TOOLS.map((t) => (
              <li key={t.tool} data-tool={t.tool} title={t.name} className={t.tool === 'slack' ? 'hit' : undefined}>
                <img src={`/assets/home/logos/${t.file}`} alt={t.name} width={28} height={28} loading="lazy" />
              </li>
            ))}
          </ul>
          <div className="feed" aria-hidden="true">
            <img src="/assets/home/logos/slack.svg" alt="" width={22} height={22} />
            <div><b>New in Slack</b><span>Dana: “Need your OK on Northwind pricing before 3:00.”</span></div>
          </div>
        </div>
        <div className="wire" aria-hidden="true"><b /></div>
        <div className="core-wrap">
          <div className="core"><img src="/assets/home/clarant-mark-176.png" alt="Clarant" width={36} height={56} /></div>
          <p className="core-cap" aria-hidden="true">Linked to Dana, Northwind and your 3:00 call</p>
        </div>
        <div className="wire" aria-hidden="true"><b /></div>
        <div className="flow-col">
          <p className="flow-h">What you get, ready to approve</p>
          <ul className="outs" id="outs" aria-label="What Clarant prepares">
            <li className="on"><IconList />Decision ranked <span>Northwind pricing, first</span></li>
            <li><IconDoc />Brief prepared <span>Northwind, 3:00 PM</span></li>
            <li><IconSend />Nudge drafted <span>to Sam, for your OK</span></li>
            <li><IconFlag />Risk flagged <span>website launch</span></li>
            <li><IconEdit />CRM update drafted <span>Acme renewal</span></li>
          </ul>
        </div>
        <button className="flow-ctl" type="button" aria-label="Pause the example" hidden>
          <svg className="i-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
          <svg className="i-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>
      <p {...sr}>Example: a new message in Slack, a calendar change in Outlook, an overdue task in Asana, a missed deadline in ClickUp and a promise made on a Fathom call each flow into Clarant, which links them to the right people and accounts and prepares a ranked decision, a meeting brief, a drafted nudge, a risk flag and a CRM update.</p>
    </section>
  )
}

/* ---------- problem: the warning was there ---------- */
export function Problem() {
  return (
    <section className="sec" id="features">
      <div className="sec-head">
        <h2 className="h2"><span className="ln">The warning was there.</span> <span className="ln">It reached you too late.</span></h2>
        <p className="lead">The early warning sits in a Slack thread, a call recording or an overdue task. Nobody has time to read all of it.</p>
      </div>
      <div className="cells c3 fails">
        <div className="fail">
          <div className="vig" aria-hidden="true">
            <div className="vig-h"><span># northwind-deal</span><span className="src">Slack</span></div>
            <div className="vrow hit"><i>D</i><span><b>Dana</b> Need your OK on pricing before 3:00</span></div>
            <div className="vmore">36 newer messages</div>
            <div className="vrow"><i /><u /></div>
            <div className="vrow fade"><i /><u /></div>
          </div>
          <h3 className="h3">The buried decision</h3>
          <p className="story">Dana needed your sign-off before the 3:00 call. Her Slack message was sitting under 36 newer ones.</p>
          <p className="fix"><b>With Clarant:</b> first on your list, with the context to decide in a minute.</p>
        </div>
        <div className="fail">
          <div className="vig" aria-hidden="true">
            <div className="vig-h"><span>Vendor redlines · Sam</span><span className="tag tag-warn">1 day late</span></div>
            <ol className="vtrack">
              <li className="start"><i />Tue</li><li><i />Wed</li><li><i />Thu</li><li><i />Fri</li><li className="late"><i />Mon</li><li className="late"><i />Tue</li>
            </ol>
            <p className="vnote">Handed off last Tuesday. Due Monday. Nobody has checked in since.</p>
          </div>
          <h3 className="h3">The handoff nobody chased</h3>
          <p className="story">You gave Sam the vendor redlines in last week’s meeting. Nobody followed up, including you.</p>
          <p className="fix"><b>With Clarant:</b> a nudge to Sam is drafted the day it slips. You approve it, and you hear if nothing moves.</p>
        </div>
        <div className="fail">
          <div className="vig" aria-hidden="true">
            <div className="vig-h"><span>Website launch</span><span className="src">Overdue tasks</span></div>
            <ol className="vbars">
              <li style={{ '--v': 1 } as CSSProperties}><b>1</b><i />Oct 27</li>
              <li style={{ '--v': 3 } as CSSProperties}><b>3</b><i />Nov 4</li>
              <li style={{ '--v': 4 } as CSSProperties}><b>4</b><i />Nov 9</li>
              <li className="late" style={{ '--v': 6 } as CSSProperties}><b>6</b><i />Today</li>
            </ol>
            <p className="vnote">First slip on Oct 27. You heard about it today.</p>
          </div>
          <h3 className="h3">The slip you heard about last</h3>
          <p className="story">The website launch started slipping two weeks ago. You found out in the board meeting.</p>
          <p className="fix"><b>With Clarant:</b> flagged the day the first task went late, with the owner named.</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- product: one ranked list, handoffs with owners, trouble flagged early ---------- */
export function Product() {
  return (
    <section className="sec" id="product">
      <div className="sec-head">
        <h2 className="h2">What a great chief of staff does, without the hire.</h2>
        <p className="lead">You need the three things that can’t wait, the context to decide in a minute, and the follow-through handled.</p>
      </div>

      <div className="feat">
        <div className="copy">
          <h3 className="h3">One ranked list of what needs you</h3>
          <p className="small">Decisions, replies and risks from every tool, in one order. The order changes as decisions land, plans move and people reply, and each item says why it is where it is.</p>
          <ul className="points">
            <li><Check />Fewer items, each with the context to act in a minute</li>
            <li><Check />Updated all day, not once in the morning</li>
          </ul>
        </div>
        <div className="demo">
          <div className="card" role="group" aria-label="Example: ranked priorities">
            <div className="card-h"><span>Your top three</span><span className="micro">Re-ranked 2:14 PM</span></div>
            <div className="card-b">
              <ol className="rank">
                <li><span className="n">1</span>Approve Northwind pricing<span className="tm">Before 3:00 PM</span></li>
                <li><span className="n">2</span>Board prep: revenue slide<span className="tm">4:00 PM</span></li>
                <li><span className="n">3</span>1:1 with Priya<span className="tm">4:30 PM</span></li>
              </ol>
              <p className="note"><b>Why this is first</b>Dana can’t send the proposal until you approve pricing, and the Northwind call starts at 3:00 PM.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="feat flip">
        <div className="copy">
          <h3 className="h3">Every handoff and promise has an owner and a date</h3>
          <p className="small">Clarant picks up what you delegate and what you promise, in meetings, email and chat. Each one gets an owner and a due date, and comes back to you the day it stalls, with the nudge already written.</p>
          <ul className="points">
            <li><Check />Your team gets nudges in the tools they already use</li>
            <li><Check />Tracks what you owe others as well as what they owe you</li>
          </ul>
        </div>
        <div className="demo">
          <div className="card" role="group" aria-label="Example: handoffs">
            <div className="card-h"><span>You handed off</span><span className="micro">8 open, 1 stalled</span></div>
            <div className="card-b">
              <ul className="kv">
                <li><span><b>Sam</b> · vendor redlines</span><span className="tag tag-warn">1 day late</span></li>
                <li><span><b>Priya</b> · hiring plan</span><span className="tag tag-mute">Due Fri</span></li>
                <li><span><b>Leo</b> · Q4 board deck</span><span className="tag tag-ok">On track</span></li>
              </ul>
              <div className="draft">
                <div className="to">Drafted nudge to Sam · Slack</div>
                Sam, are the vendor redlines still on for today? Legal needs them before Thursday’s signing.
                <div className="acts"><span className="ui-btn go">Approve and send</span><span className="ui-btn">Edit</span><span className="ui-btn">Not now</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="feat">
        <div className="copy">
          <h3 className="h3">Trouble flagged while it is still small</h3>
          <p className="small">A deal going quiet, a customer raising the same issue twice, a project missing its first deadline. Clarant connects the signals across tools and tells you early, with the owner named and a next step.</p>
          <ul className="points">
            <li><Check />No status meeting needed to find out</li>
            <li><Check />Shows the evidence, so you can check it yourself</li>
          </ul>
        </div>
        <div className="demo">
          <div className="card" role="group" aria-label="Example: project at risk">
            <div className="card-h"><span>Website launch · due Nov 21</span><span className="tag tag-risk">At risk</span></div>
            <div className="card-b">
              <ul className="trail">
                <li><span className="d">Oct 27</span><span>Design review not booked<span className="s">ClickUp</span></span></li>
                <li><span className="d">Nov 4</span><span>Copy deadline missed<span className="s">ClickUp, Slack</span></span></li>
                <li><span className="d">Nov 9</span><span>Agency asked for a new date<span className="s">Gmail</span></span></li>
                <li className="flag"><span className="d">Today</span><span><b>6 tasks overdue. Owner: Leo.</b><span className="s">Suggested: ask Leo for a revised date before today’s 4:00 PM board prep.</span></span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- meetings: walk into every meeting already briefed ---------- */
export function Meetings() {
  return (
    <section className="sec" id="meetings">
      <div className="sec-head">
        <h2 className="h2">Walk into every meeting already briefed.</h2>
        <p className="lead">Ten minutes before each meeting, you get one page: who is in the room, what was said last time and what you promised. Afterwards, the follow-up is already drafted.</p>
      </div>
      <div className="prep" id="prep">
        <ol className="prep-copy">
          <li><span className="when">Before</span><h3>The brief, ten minutes out</h3><p>Attendees and their history with you, the account’s status, open promises and suggested talking points, pulled from email, calls, CRM and chat.</p></li>
          <li><span className="when">During</span><h3>Decisions and promises captured</h3><p>Clarant reads your notetaker and logs what was decided, who owns what and what you committed to.</p></li>
          <li><span className="when">After</span><h3>Follow-through drafted</h3><p>The recap email, the tasks and the CRM update are ready for your approval before you reach your next meeting.</p></li>
        </ol>
        <div className="prep-stage">
          <div className="brief-win" role="group" aria-label="Example: meeting brief for the Northwind renewal call">
            <div className="bw-h">
              <div>
                <div className="t">Northwind renewal call</div>
                <div className="micro">Today, 3:00 PM · 30 min · Google Meet</div>
                <div className="ppl"><i>MO</i><i>RK</i><i className="us">D</i><span>Maria Okafor (VP Operations), Raj Kumar (IT), Dana from your team</span></div>
              </div>
              <span className="tag tag-ok status" id="prep-status"><span className="sp" aria-hidden="true" /><span className="st">Ready at 2:50 PM</span></span>
            </div>
            <div className="bw-b">
              <div className="bw-row"><img src="/assets/home/logos/salesforce.svg" alt="" width={20} height={20} loading="lazy" /><div><div className="k">Where the account stands</div><div className="v">Renews Nov 30. Marked At Risk last week after two support escalations.</div></div></div>
              <div className="bw-row"><img src="/assets/home/logos/fathom.png" alt="" width={20} height={20} loading="lazy" /><div><div className="k">Last time · Oct 28 call</div><div className="v">Maria asked for SSO and quarterly billing before she would sign the renewal.</div></div></div>
              <div className="bw-row"><img src="/assets/home/logos/gmail.svg" alt="" width={20} height={20} loading="lazy" /><div><div className="k">You promised · Nov 3</div><div className="v">A revised SSO quote. It hasn’t gone out. <span className="tag tag-warn">Draft ready</span></div></div></div>
              <div className="bw-row"><img src="/assets/home/logos/slack.svg" alt="" width={20} height={20} loading="lazy" /><div><div className="k">Waiting on you</div><div className="v">Dana needs your OK on Q4 pricing before she can send the proposal.</div></div></div>
              <div className="bw-row"><img src="/assets/home/clarant-mark-176.png" alt="" width={13} height={20} style={{ width: 13, marginInline: 'auto' }} /><div><div className="k">Suggested talking points</div><ol><li>Confirm the SSO timeline Raj needs for their security review.</li><li>Offer quarterly billing in exchange for a two-year term.</li><li>Name Maya Chen as their dedicated support contact.</li></ol></div></div>
            </div>
            <div className="bw-f"><b>After the call, drafted for you:</b><span className="tag tag-mute">Recap email</span><span className="tag tag-mute">2 tasks in ClickUp</span><span className="tag tag-mute">Salesforce update</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- compare: not another inbox assistant, not another hire ---------- */
export function Compare() {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2 className="h2">Not another inbox assistant. Not another hire.</h2>
        <p className="lead">An inbox assistant waits to be asked, inside one app. A chief of staff takes months to hire. Clarant covers the ground between them.</p>
      </div>
      <table className="cmp">
        <thead><tr><th scope="col"><span className="sr">What you get</span></th><th scope="col">Inbox assistant</th><th scope="col">Hiring a chief of staff</th><th scope="col" className="us">Clarant</th></tr></thead>
        <tbody>
          <tr><th scope="row">What it sees</th><td data-l="Inbox assistant">One app at a time</td><td data-l="Chief of staff">What reaches them</td><td className="us" data-l="Clarant">Email, chat, meetings, CRM and projects, together</td></tr>
          <tr><th scope="row">When it works</th><td data-l="Inbox assistant">When you ask</td><td data-l="Chief of staff">Working hours</td><td className="us" data-l="Clarant">All day, without being asked</td></tr>
          <tr><th scope="row">Handoffs and promises</th><td data-l="Inbox assistant">Not tracked</td><td data-l="Chief of staff">Chased by hand</td><td className="us" data-l="Clarant">Every one tracked by owner and date, with the nudge drafted</td></tr>
          <tr><th scope="row">Who decides</th><td data-l="Inbox assistant">You, one prompt at a time</td><td data-l="Chief of staff">You, after a briefing</td><td className="us" data-l="Clarant">You. Clarant drafts, and nothing sends without approval</td></tr>
          <tr><th scope="row">Time to value</th><td data-l="Inbox assistant">Minutes</td><td data-l="Chief of staff">Months to hire and ramp up</td><td className="us" data-l="Clarant"><span className="tbd">[About 10 minutes]</span></td></tr>
        </tbody>
      </table>
      <div className="cta-in">
        <h3 className="cta-h">See what Clarant finds in your own inbox.</h3>
        <div className="actions">
          <a className="btn btn-primary" href={LOGIN_URL}>Start free trial</a>
          <a className="btn btn-line" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a 20-minute demo</a>
        </div>
      </div>
    </section>
  )
}

/* ---------- how it works: four steps ---------- */
export function How() {
  return (
    <section className="sec how" id="how">
      <div className="sec-head">
        <h2 className="h2"><span className="ln">Set up in minutes.</span> <span className="ln">No rollout. No new app.</span></h2>
        <p className="lead">Clarant works inside the tools you already use. Most leaders are set up in <span className="tbd">[10 minutes]</span>, with <span className="tbd">[nothing for the team to install]</span>.</p>
      </div>
      <ol className="cells c4">
        <li>
          <div className="viz" role="group" aria-label="Example: connecting tools">
            <ul className="mini">
              <li><img src="/assets/home/logos/gmail.svg" alt="" width={18} height={18} loading="lazy" /><span>Gmail and calendar</span><span className="tag tag-ok">Connected</span></li>
              <li><img src="/assets/home/logos/slack.svg" alt="" width={18} height={18} loading="lazy" /><span>Slack</span><span className="tag tag-ok">Connected</span></li>
              <li><img src="/assets/home/logos/fathom.png" alt="" width={18} height={18} loading="lazy" /><span>Fathom</span><span className="tag tag-ok">Connected</span></li>
              <li><img src="/assets/home/logos/salesforce.svg" alt="" width={18} height={18} loading="lazy" /><span>Salesforce</span><span className="ui-btn">Connect</span></li>
            </ul>
          </div>
          <div className="tx">
            <h3 className="h3"><span className="n" aria-hidden="true">1</span>Connect what you already use</h3>
            <p>Start with email and calendar, then add chat, your notetaker, CRM and project tools in a click each. There is no IT project, and you choose exactly what Clarant can see.</p>
          </div>
        </li>
        <li>
          <div className="viz" role="group" aria-label="Example: what Clarant learns">
            <div className="mini">
              <div className="mini-h">Clarant’s picture of your company</div>
              <div className="stats"><div><b>48</b>people</div><div><b>126</b>accounts</div><div><b>31</b>projects</div><div><b>214</b>open promises</div></div>
              <div className="link-row"><b>Northwind</b> · owner Dana · renews Nov 30 · 1 promise open</div>
            </div>
          </div>
          <div className="tx">
            <h3 className="h3"><span className="n" aria-hidden="true">2</span>Clarant learns how your company runs</h3>
            <p>It reads what is already there and maps who owns what: people, accounts, projects and every open promise. It learns your priorities from what you act on, and is useful within <span className="tbd">[the first day]</span>.</p>
          </div>
        </li>
        <li>
          <div className="viz" role="group" aria-label="Example: approving next steps">
            <ul className="mini">
              <li><span>Reply to Jordan<small>Acme renewal · draft ready</small></span><span className="ui-btn go">Approve</span></li>
              <li><span>Nudge Sam<small>Vendor redlines · 1 day late</small></span><span className="ui-btn go">Approve</span></li>
              <li><span>Northwind pricing<small>Sent to Dana, 2:16 PM</small></span><span className="tag tag-ok">Approved</span></li>
            </ul>
          </div>
          <div className="tx">
            <h3 className="h3"><span className="n" aria-hidden="true">3</span>You approve. Clarant follows through.</h3>
            <p>You get a short ranked list with the reply, nudge, task or CRM update already drafted. Approve, edit or skip. Clarant sends what you approve and comes back if nothing moves.</p>
          </div>
        </li>
        <li>
          <div className="viz" role="group" aria-label="Example: asking Clarant in Slack">
            <div className="cm">
              <div className="cm-h"><img src="/assets/home/logos/slack.svg" alt="" width={18} height={18} loading="lazy" />Clarant<span>Direct message</span></div>
              <div className="cm-b">
                <div className="cm-msg"><i className="cm-av" style={{ fontStyle: 'normal' }}>You</i><div><b>You<span>2:14 PM</span></b><mark>@Clarant</mark> prep me for my 3:00</div></div>
                <div className="cm-msg"><i className="cm-av"><img src="/assets/home/clarant-mark-176.png" alt="" width={9} height={14} /></i><div><b>Clarant<span>2:14 PM</span></b>Your brief for the 3:00 Northwind call is ready.<div className="acts"><span className="ui-btn">Open brief</span></div></div></div>
              </div>
            </div>
          </div>
          <div className="tx">
            <h3 className="h3"><span className="n" aria-hidden="true">4</span>Use it where you already work</h3>
            <p>Ask a question, get your brief or approve a draft from Microsoft Teams, Slack, iMessage or the mobile app, in the minutes between meetings. <span className="tbd">[Channel availability to be confirmed]</span></p>
          </div>
        </li>
      </ol>
    </section>
  )
}

/* ---------- control and security (dark section) ---------- */
export function Security() {
  return (
    <section className="sec dark" id="security">
      <div className="approve">
        <div>
          <h2 className="h2">It drafts. You decide.</h2>
          <p className="lead">Clarant prepares the reply, the nudge and the CRM update. Nothing goes out in your name until you approve it. You can turn on auto-send for routine actions later, one type at a time.</p>
        </div>
        <div className="msg" role="group" aria-label="Example draft awaiting approval">
          <div className="meta"><span>Draft to Jordan Lee · Acme</span><span className="tag">Waiting for you</span></div>
          <p>Hi Jordan, thanks for flagging the support delays. Starting Monday, Maya Chen will be your dedicated contact. I’ll check in before the Nov 30 renewal to make sure it’s working.</p>
          <div className="acts"><span className="ui-btn go">Approve and send</span><span className="ui-btn">Edit</span><span className="ui-btn">Not now</span></div>
        </div>
      </div>
      <div className="cells facts">
        <div><h3>SOC 2 Type II</h3><p className="small"><span className="tbd">[Independently audited controls. The report is available under NDA.]</span></p></div>
        <div><h3>Approval by default</h3><p className="small">Drafts wait for you. Auto-send is opt-in and can be switched off at any time.</p></div>
        <div><h3>You choose what it sees</h3><p className="small">Connect tool by tool. <span className="tbd">[Exclude labels, channels or people.]</span> Disconnect anytime.</p></div>
        <div><h3>Encrypted</h3><p className="small"><span className="tbd">[In transit and at rest, with SSO and SCIM for your team.]</span></p></div>
        <div><h3>Delete anytime</h3><p className="small">Disconnect a tool or cancel, and its data is deleted within <span className="tbd">[30 days]</span>.</p></div>
        <div><h3>Your data stays yours</h3><p className="small"><span className="tbd">[Not used to train AI models. Confirm before launch.]</span></p></div>
        <div className="wide"><a className="link" href="/security">Read the security overview <IconArrow /></a></div>
      </div>
    </section>
  )
}

/* ---------- proof: what people say, from the published testimonials ---------- */
interface QuoteCard { q: string; by: string; org: string; initials: string }

function deriveInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

// Published testimonials from the dashboard; falls back to the static QUOTES if none exist or the database is unreachable.
async function getQuotes(): Promise<QuoteCard[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { status: 'published' },
      orderBy: [{ order: 'asc' }, { createdat: 'desc' }],
    })
    if (rows.length === 0) return QUOTES
    return rows.map((t) => ({
      q: t.quote,
      by: t.authorname,
      org: [t.authorrole, t.company].filter(Boolean).join(' · '),
      initials: t.initials || deriveInitials(t.authorname),
    }))
  } catch (error) {
    console.error('[Homepage testimonials] DB fetch failed, using static fallback', error)
    return QUOTES
  }
}

export async function Proof() {
  const quotes: QuoteCard[] = await getQuotes()
  const [first, ...rest] = quotes
  return (
    <section className="sec" id="proof">
      <div className="sec-head">
        <h2 className="h2">What leaders say after a month with Clarant.</h2>
      </div>
      <div className="cells quotes">
        {first && (
          <figure className="big">
            <blockquote>“{first.q}”</blockquote>
            <figcaption className="by"><span className="av" aria-hidden="true">{first.initials}</span><span><b>{first.by}</b><span>{first.org}</span></span></figcaption>
          </figure>
        )}
        {rest.map((t, i) => (
          <figure key={`${t.by}-${i}`}>
            <blockquote>“{t.q}”</blockquote>
            <figcaption className="by"><span className="av" aria-hidden="true">{t.initials}</span><span><b>{t.by}</b><span>{t.org}</span></span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ---------- pricing: the tiers come from the same list as before (client component for the billing switch) ---------- */
export function Pricing() {
  return (
    <section className="sec" id="pricing">
      <div className="sec-head">
        <h2 className="h2">Pricing for one leader or the whole leadership team.</h2>
        <p className="lead">Every plan starts with a <span className="tbd">[14-day free trial, no credit card]</span>. <span className="tbd">[Plan names and features to be confirmed]</span></p>
      </div>
      <HomePricing />
    </section>
  )
}

/* ---------- FAQ ---------- */
export function FAQ() {
  return (
    <section className="sec" id="faq">
      <div className="faq">
        <div>
          <h2 className="h2">Questions leaders ask first.</h2>
          <p className="lead">Something else? <a href="mailto:support@clarant.ai">Talk to a person</a>.</p>
        </div>
        <div>
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}<span className="pm" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- close: call to action ---------- */
export function Close() {
  return (
    <section className="sec dark close" id="trial">
      <img src="/assets/home/clarant-mark-176.png" alt="" width={25} height={40} />
      <h2 className="h2">See what needs you before your next meeting.</h2>
      <p className="lead">Connect your inbox and Clarant starts on today’s list. Nothing sends without your approval.</p>
      <div className="actions">
        <a className="btn btn-primary" href={LOGIN_URL}>Start free trial</a>
        <a className="btn btn-line" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a 20-minute demo</a>
      </div>
    </section>
  )
}

/* ---------- icons used inside the sections ---------- */
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
function IconList() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
}
function IconDoc() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
}
function IconSend() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" /></svg>
}
function IconFlag() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h12l-2.5 4L17 12H5" /></svg>
}
function IconEdit() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" /></svg>
}
