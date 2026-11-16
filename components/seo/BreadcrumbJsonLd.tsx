// Server component — drops a route-driven BreadcrumbList into a page's HTML.
// One line per page: <BreadcrumbJsonLd path={url} name="Page Title" />.
// `name` sets the current (leaf) crumb's label; omit it to fall back to the
// segment's known label. Reuses the escaping JsonLd renderer.
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/breadcrumbs'

export default function BreadcrumbJsonLd({ path, name }: { path: string; name?: string }) {
  return <JsonLd data={breadcrumbSchema(path, name)} />
}
