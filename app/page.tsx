import PageAnimations from '@/components/ui/PageAnimations'
import JsonLd         from '@/components/seo/JsonLd'
import { FAQS }       from '@/lib/data'
import type { Metadata } from 'next'
import '@/components/home/home.css'
import HomeMotion     from '@/components/home/HomeMotion'
import HomeHero       from '@/components/home/HomeHero'
import { HomeNav, HomeFooter } from '@/components/home/HomeChrome'
import {
  ProofStrip, Integrations, Problem, Product, Meetings,
  Compare, How, Security, Proof, Pricing, FAQ, Close,
} from '@/components/home/HomeSections'

export const metadata: Metadata = {
  title: 'AI Document Assistant for Business | Clarant',
  description:
    "Search documents, emails, and business apps with Clarant AI. Get instant, source-backed answers from your company's knowledge in one place.",
  alternates: { canonical: '/' },
}

// FAQPage schema built from the SAME FAQS the <FAQ /> section renders below, so
// structured data always matches the visible content. Only on this page because
// these FAQs are only shown here.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

// Homepage layout follows the Clarant design reference (section order, structure and presentation).
// Its styles are scoped under .clarant-home (components/home/home.css) so no other page is affected.
export default function HomePage() {
  return (
    <>
      <PageAnimations />
      {FAQS.length > 0 && <JsonLd data={faqSchema} />}
      <HomeMotion>
        <a className="skip" href="#main">Skip to content</a>
        <HomeNav />
        <main id="main">
          <div className="frame" id="top">
            <HomeHero />
            <ProofStrip />
            <Integrations />
            <Problem />
            <Product />
            <Meetings />
            <Compare />
            <How />
            <Security />
            <Proof />
            <Pricing />
            <FAQ />
            <Close />
          </div>
        </main>
        <HomeFooter />
      </HomeMotion>
    </>
  )
}
