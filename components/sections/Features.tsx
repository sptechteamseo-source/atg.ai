/* "The Problem" — ported directly from the reference design: a two-column layout
   (heading left, two paragraphs right; the second with a top rule). Colors mapped
   to the site's tokens so it renders in both themes; fonts + section spacing are
   the site's. id="features" preserved for the footer anchor. */

export default function Features() {
  return (
    <>
      <style>{`
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
          gap: clamp(32px, 6vw, 96px); align-items: start;
        }
        .problem-eyebrow {
          font-family: var(--font-label); font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent);
          margin-bottom: 18px;
        }
        .problem-h {
          font-family: var(--font-display); font-weight: 700;
          font-size: clamp(30px, 3.6vw, 46px); line-height: 1.08;
          letter-spacing: -0.03em; color: var(--fg); text-wrap: balance;
        }
        .problem-body { display: flex; flex-direction: column; gap: 22px; padding-top: 6px; }
        .problem-p1 { font-size: 17px; line-height: 1.7; color: var(--fg-muted); text-wrap: pretty; }
        .problem-p2 {
          font-size: 19px; line-height: 1.6; color: var(--fg); font-weight: 500;
          padding-top: 22px; border-top: 1px solid var(--border); text-wrap: pretty;
          font-family: var(--font-display);
        }
      `}</style>

      <section id="features" className="problem">
        <div className="container problem-grid">
          <div>
            <div className="problem-eyebrow">The problem</div>
            <h2 className="problem-h">Your Business Has the Answers. <span style={{ color: '#30b4e6' }}>Finding Them Takes Time.</span></h2>
          </div>
          <div className="problem-body">
            <p className="problem-p1">
              Important information lives across emails, documents, team conversations, and
              business applications. Finding the right details often means switching between
              tools, asking colleagues, and piecing information together manually.
            </p>
            <p className="problem-p2">
              Clarant works as an AI assistant for business, helping your team spend less time
              searching and more time getting work done without searching through every application.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
