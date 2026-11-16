import { Icons } from '@/components/icons/Icons'

export default function CTA() {
  return (
    <>
      <style>{`
        .cta { padding: 0 0 var(--section-pad-y); }
        @keyframes ctaGlow { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
        .cta-card {
          position: relative; border-radius: var(--radius-lg); border: 1px solid var(--border);
          background: var(--bg-elevated); overflow: hidden;
          padding: clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px);
          transition: border-color .3s;
        }
        .cta-card:hover { border-color: color-mix(in oklab,var(--accent) 40%,transparent); }
        .cta-bg { position: absolute; inset: 0; opacity: .35; mask-image: radial-gradient(ellipse 90% 70% at 80% 50%, black 0%, transparent 65%); }
        .cta-card::after {
          content: ""; position: absolute; right: -10%; top: -30%; width: 600px; height: 600px;
          background: radial-gradient(closest-side, var(--accent-glow), transparent 70%);
          filter: blur(20px); pointer-events: none;
          animation: ctaGlow 5s ease-in-out infinite;
        }
        .cta-inner { position: relative; max-width: 720px; }
        .cta-title { font-family: var(--font-display); font-weight: 600; font-size: clamp(36px, 5vw, 64px); line-height: 1; letter-spacing: -0.03em; }
        .cta-lede { color: var(--fg-muted); font-size: clamp(16px, 1.3vw, 18px); margin-top: 16px; max-width: 540px; line-height: 1.55; }
        .cta-actions { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
        .cta-foot { margin-top: 14px; font-size: 13px; }
        @media (max-width: 480px) {
          .cta-actions { flex-direction: column; }
          .cta-actions .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <section id="cta" className="cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg dot-grid" aria-hidden="true" />
            <div className="cta-inner" data-reveal="fade-up">
              <h2 className="cta-title">
                Ask once.<br />Trust the answer.
              </h2>
              <p className="cta-lede">
                Spin up a workspace, connect your stack, and get your first cited
                answer in the next ten minutes.
              </p>
              <div className="cta-actions">
                <a
                  href="https://app.clarant.ai/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent btn-lg"
                >
                  Start Free Trial <Icons.arrowRight size={15} />
                </a>
                <a
                  href="https://calendly.com/nparikh-clarant/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg"
                >
                  <Icons.play size={13} /> Book Demo
                </a>
              </div>
              <div className="cta-foot muted">
                No credit card · 14-day Team trial · Set up in 10 min
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
