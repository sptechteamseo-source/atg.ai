import Nav            from '@/components/layout/Nav'
import Footer         from '@/components/layout/Footer'
import UseCases       from '@/components/sections/UseCases'
import CTA            from '@/components/sections/CTA'
import PageAnimations from '@/components/ui/PageAnimations'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'
import { ArrowRight } from '@/components/icons/Icons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Business Use Cases Across Industries | Clarant',
  description:
    'See how Clarant AI helps sales, marketing, healthcare, legal, HR, insurance, and other teams find answers across business documents.',
  alternates: { canonical: '/use-cases' },
}

export default function UseCasesPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/use-cases" name="Use Cases" />
      <PageAnimations />
      <Nav />
      <main>
        <section className="uc-page-hero">
          <div className="container" data-reveal="fade-up">
            <span className="eyebrow">Use cases</span>
            <h1 className="section-title">AI Use Cases</h1>
            <p className="section-lede">
              See how different teams — from Legal and Sales to Healthcare, Banking, and Operations — use
              Clarant to find cited answers across their documents, email, CRM, and business systems.
            </p>
            <a className="btn btn-accent btn-lg" href="https://app.clarant.ai/login" style={{ marginTop: 24 }}>
              Start Free Trial <ArrowRight size={15} />
            </a>
          </div>
        </section>

        <UseCases showHead={false} />
        <CTA />
      </main>
      <Footer />

      <style>{`
        .uc-page-hero { padding: clamp(48px, 8vw, 96px) 0 8px; text-align: center; }
        .uc-page-hero .section-lede { margin-left: auto; margin-right: auto; }
      `}</style>
    </>
  )
}
