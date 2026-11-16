// Server component — renders JSON-LD into the static HTML (no 'use client'),
// so crawlers see it in source. Reused for Organization + FAQPage + Article +
// BreadcrumbList schema.

// Escape `<` as < so a dynamic value containing "</script>" (or any markup)
// can never break out of the <script> tag or inject content. Valid JSON, and
// the standard safe-serialization approach for inline JSON-LD.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
