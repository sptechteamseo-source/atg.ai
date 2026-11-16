// Runnable check for breadcrumbSchema. No framework — `npx tsx lib/breadcrumbs.check.ts`.
import assert from 'node:assert/strict'
import { breadcrumbSchema } from './breadcrumbs'

// Nested route with a real leaf title → 3 crumbs, absolute prod URLs, no slug leak.
const uc = breadcrumbSchema('/use-cases/banking-financial-document-analysis', 'Banking & Financial Document Analysis')
assert.deepEqual(uc.itemListElement.map((i) => i.name), ['Home', 'Use Cases', 'Banking & Financial Document Analysis'])
assert.deepEqual(uc.itemListElement.map((i) => i.item), [
  'https://clarant.ai/',
  'https://clarant.ai/use-cases',
  'https://clarant.ai/use-cases/banking-financial-document-analysis',
])
assert.deepEqual(uc.itemListElement.map((i) => i.position), [1, 2, 3])

// Blog leaf title comes from data, not the slug.
const blog = breadcrumbSchema('/blog/best-ai-pdf-chat-tools-for-researchers', 'Best AI PDF Chat Tools for Researchers')
assert.equal(blog.itemListElement[2].name, 'Best AI PDF Chat Tools for Researchers')
assert.equal(blog.itemListElement[1].name, 'Blog')

// Listing page without a leaf name uses the known segment label, not a slug.
const list = breadcrumbSchema('/use-cases')
assert.deepEqual(list.itemListElement.map((i) => i.name), ['Home', 'Use Cases'])

// Home is always absolute production, never localhost.
assert.ok(uc.itemListElement.every((i) => i.item.startsWith('https://clarant.ai')))

console.log('breadcrumbs.check.ts: OK')
