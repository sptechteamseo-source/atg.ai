/* eslint-disable @next/next/no-img-element */
import { CALENDLY_URL, LOGIN_URL } from './links'

/* Hero: the headline, the two calls to action, and the looping product story. The story is driven by
   motion.ts (it finds these elements by their classes). Without script it rests on the window with
   the first draft waiting. */

export default function HomeHero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1 className="display">
          The AI chief of staff for <span className="mark">business leaders<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 6.5C52 3.2 118 8.4 176 5.4S262 2.6 297 4.6" strokeWidth={4} vectorEffect="non-scaling-stroke" /><path d="M46 11.2C102 8.6 170 12 256 8.8" strokeWidth={2.5} vectorEffect="non-scaling-stroke" /></svg></span>.
        </h1>
        <p className="lead">Clarant reads your email, meetings, CRM and projects all day, tells you the few things that need you, and drafts the next step. Nothing goes out until you approve it.</p>
        <div className="actions">
          <a className="btn btn-primary" href={LOGIN_URL}>Start free trial</a>
          <a className="btn btn-line" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a 20-minute demo</a>
        </div>
        <ul className="trust">
          <li><Check />Nothing sends without your approval</li>
          <li><Check /><span className="tbd">[SOC 2 Type II audited]</span></li>
          <li><Check /><span className="tbd">[14-day free trial, no credit card]</span></li>
        </ul>
      </div>

      <div className="hero-stage">
        <div className="hs live" id="hs">
          <p className="hs-cap">Three need you. The other 44 can wait.</p>
          <div className="hs-scene">
            <div className="hs-feed" aria-hidden="true">
              <ul className="hs-apps">
                <li><img src="/assets/home/logos/gmail.svg" alt="" width={24} height={24} /><b>17</b></li>
                <li><img src="/assets/home/logos/slack.svg" alt="" width={24} height={24} /><b>14</b></li>
                <li><img src="/assets/home/logos/hubspot.svg" alt="" width={24} height={24} /><b>4</b></li>
                <li><img src="/assets/home/logos/asana.svg" alt="" width={24} height={24} /><b>4</b></li>
                <li><img src="/assets/home/logos/outlook.svg" alt="" width={24} height={24} /><b>5</b></li>
                <li><img src="/assets/home/logos/fathom.png" alt="" width={24} height={24} /><b>3</b></li>
              </ul>
              <ul className="hs-notes">
                <li><img src="/assets/home/logos/gmail.svg" alt="" width={22} height={22} /><span><b>Gmail · Maria Okafor</b><small>Third outage this month. We need to talk.</small></span></li>
                <li><img src="/assets/home/logos/slack.svg" alt="" width={22} height={22} /><span><b>Slack · Dana</b><small>Heads up: Acme is frustrated with support.</small></span></li>
                <li><img src="/assets/home/logos/hubspot.svg" alt="" width={22} height={22} /><span><b>HubSpot · New inquiry</b><small>Jordan Lee asked for pricing for 40 seats.</small></span></li>
                <li><img src="/assets/home/logos/asana.svg" alt="" width={22} height={22} /><span><b>Asana · Sam</b><small>Vendor redlines: due yesterday, still open.</small></span></li>
                <li><img src="/assets/home/logos/outlook.svg" alt="" width={22} height={22} /><span><b>Outlook · Calendar</b><small>Board prep moved to Thursday, 10:00 AM.</small></span></li>
                <li><img src="/assets/home/logos/fathom.png" alt="" width={22} height={22} /><span><b>Fathom · Acme call</b><small>4 action items, 1 promise from you.</small></span></li>
              </ul>
            </div>

            <div className="hs-core" aria-hidden="true">
              <div className="core"><img src="/assets/home/clarant-mark-176.png" alt="" width={36} height={56} /></div>
              <p>Reading 47 updates</p>
              <ul className="mini hs-checks">
                <li><i><Tick /></i>Matched to people and accounts</li>
                <li><i><Tick /></i>Checked against dates and promises</li>
                <li><i><Tick /></i>Ranked by what needs you</li>
              </ul>
            </div>

            <div className="card hs-win">
              <div className="card-h"><span className="hs-brand"><img src="/assets/home/clarant-mark-176.png" alt="" width={12} height={18} />Clarant</span><span className="micro">Tuesday, 2:14 PM</span></div>
              <div className="card-b">
                <p className="hs-t">3 things need you</p>
                <ol className="hs-pri">
                  <li className="open">
                    <button className="hs-row" type="button" aria-expanded="true" aria-controls="hs-m1">
                      <span className="n"><span>1</span><CheckSmall /></span>
                      <span>
                        <span className="hs-kind"><span className="tag tag-risk">Client escalation</span><img src="/assets/home/logos/gmail.svg" alt="" width={16} height={16} /><img src="/assets/home/logos/slack.svg" alt="" width={16} height={16} /><img src="/assets/home/logos/fathom.png" alt="" width={16} height={16} /></span>
                        <b>Acme’s renewal is at risk</b>
                      </span>
                      <Chevron />
                    </button>
                    <div className="hs-more" id="hs-m1"><div>
                      <p className="hs-why">Maria’s third complaint this month. Acme renews in 12 days.</p>
                      <div className="draft">
                        <div className="to">Drafted reply to Maria Okafor · Gmail</div>
                        Maria, I’m sorry about the outages. I’d like to walk you through our fix. Are you free today at 4:00?
                        <div className="acts"><button className="ui-btn go" type="button">Approve and send</button><span className="hs-or">or edit it first</span><span className="tag tag-ok">Sent to Maria with your approval</span></div>
                      </div>
                    </div></div>
                  </li>
                  <li>
                    <button className="hs-row" type="button" aria-expanded="false" aria-controls="hs-m2">
                      <span className="n"><span>2</span><CheckSmall /></span>
                      <span>
                        <span className="hs-kind"><span className="tag tag-ok">Potential lead</span><img src="/assets/home/logos/hubspot.svg" alt="" width={16} height={16} /></span>
                        <b>Jordan Lee is waiting on pricing</b>
                      </span>
                      <Chevron />
                    </button>
                    <div className="hs-more" id="hs-m2"><div>
                      <p className="hs-why">A 40-seat inquiry, two days old, with no reply yet.</p>
                      <div className="draft">
                        <div className="to">Drafted reply to Jordan Lee · Gmail</div>
                        Jordan, thanks for waiting. Pricing for 40 seats is attached. Do you have 20 minutes on Thursday?
                        <div className="acts"><button className="ui-btn go" type="button">Approve and send</button><span className="hs-or">or edit it first</span><span className="tag tag-ok">Sent to Jordan with your approval</span></div>
                      </div>
                    </div></div>
                  </li>
                  <li>
                    <button className="hs-row" type="button" aria-expanded="false" aria-controls="hs-m3">
                      <span className="n"><span>3</span><CheckSmall /></span>
                      <span>
                        <span className="hs-kind"><span className="tag tag-warn">Stalled handoff</span><img src="/assets/home/logos/asana.svg" alt="" width={16} height={16} /></span>
                        <b>Sam’s vendor redlines are late</b>
                      </span>
                      <Chevron />
                    </button>
                    <div className="hs-more" id="hs-m3"><div>
                      <p className="hs-why">You handed this to Sam last week. It was due yesterday.</p>
                      <div className="draft">
                        <div className="to">Drafted nudge to Sam · Slack</div>
                        Sam, the vendor redlines were due yesterday. Can you send them by end of day?
                        <div className="acts"><button className="ui-btn go" type="button">Approve and send</button><span className="hs-or">or edit it first</span><span className="tag tag-ok">Sent to Sam with your approval</span></div>
                      </div>
                    </div></div>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="hs-rail" role="group" aria-label="The example, part by part" hidden>
            <button className="hs-step" type="button"><i className="hs-bar"><b /></i><em>1</em><span>Updates arrive</span></button>
            <button className="hs-step" type="button"><i className="hs-bar"><b /></i><em>2</em><span>Clarant reads</span></button>
            <button className="hs-step" type="button" aria-current="step"><i className="hs-bar"><b /></i><em>3</em><span>Top priorities</span></button>
            <button className="hs-step" type="button"><i className="hs-bar"><b /></i><em>4</em><span>You approve</span></button>
            <button className="flow-ctl" id="hs-ctl" type="button" aria-label="Pause the example" hidden>
              <svg className="i-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
              <svg className="i-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>
          <span className="hs-cur" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 3l14 8.6-6.3 1.5L9.4 19.4z" /></svg></span>
        </div>
        <p className="sr">Example: 47 updates arrive from Gmail, Slack, HubSpot, Asana, Outlook and Fathom. Clarant reads them and shows the three that need you: a client escalation, a potential lead and a stalled handoff. Each comes with a drafted next step, and it is sent only after you approve it.</p>
      </div>
    </section>
  )
}

export function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function CheckSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function Tick() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
