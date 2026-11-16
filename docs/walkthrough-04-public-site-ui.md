# 🎨 Walkthrough 4 — Public Site & UI (Real Line-by-Line)

> Files covered: `hooks/useInView.ts`, `useMounted.ts`, `useScrollNav.ts`, `useTypewriter.ts`,
> `lib/blog-helpers.ts`, `app/providers.tsx`, `app/blog/page.tsx` (client list),
> `app/blog/[slug]/page.tsx` (server detail + SEO + JSON-LD), `components/ui/PageAnimations.tsx`.

---

## 🗺️ Public Site Ka Map

```
Server Components (SEO, DB):  app/page.tsx, app/blog/[slug]/page.tsx
Client Components (interactive): app/blog/page.tsx, sections/*, BlogPostClient
Custom hooks (hooks/*):  scroll/animation/typing/hydration helpers
Animation engine: PageAnimations (data-reveal, data-countup) + globals.css keyframes
Theme: app/providers.tsx (next-themes, dark default)
```

---

## 1️⃣ Custom Hooks — Chhote Par Powerful (`hooks/`)

> **Rule:** Custom hook = ek function jo `use` se shuru ho aur andar React hooks use kare. Reusable logic ko package karta.

### `useMounted.ts` — Hydration Guard (Sabse Simple)
```tsx
'use client'
import { useState, useEffect } from 'react'

export function useMounted() {
  const [mounted, setMounted] = useState(false)         // line 6 — server par false
  useEffect(() => setMounted(true), [])                 // line 7 — client par mount hote hi true
  return mounted
}
```
- **Input:** kuch nahi. **Output:** `boolean`.
- **Logic:** Server render par `false` (kyunki `useEffect` server par chalता hi nahi). Browser mein mount hone par `useEffect` chalta → `true`.
- **Why? (⭐ hydration concept):** Server ko `localStorage`/`window` ka pata nahi (e.g. theme). Agar seedha theme-based UI render karein to **server HTML ≠ client HTML** → React "hydration mismatch" error. `useMounted` se hum theme-dependent cheez **tab tak skip** karte jab tak client par mount na ho:
  ```tsx
  if (!mounted) return <div style={{width:34,height:34}} />  // placeholder
  return <ThemeIcon />  // ab safe
  ```

### `useScrollNav.ts` — Scroll Threshold
```tsx
export function useScrollNav(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)  // line 9
    onScroll()                                          // line 10 — ⭐ turant ek baar
    window.addEventListener('scroll', onScroll, { passive: true })  // line 11
    return () => window.removeEventListener('scroll', onScroll)     // line 12 — cleanup
  }, [threshold])                                       // line 13
  return scrolled
}
```
- **Input:** `threshold` (px, default 8). **Output:** `boolean` (8px se zyada scroll hua?).
- **Line 10:** ⭐ `onScroll()` turant call — taaki agar page already scrolled load ho (refresh on mid-page), initial state sahi ho. (Sirf listener lagate to first scroll tak galat rehta.)
- **Line 11 `{ passive: true }`:** Browser ko batao yeh listener `preventDefault` nahi karega → smooth scroll perf.
- **Line 12 cleanup:** Component hatne par listener remove (memory leak roko). Har `useEffect` jo listener lagaye, cleanup must.
- **Use:** Navbar — scroll par background/border add karne ke liye.

### `useTypewriter.ts` — Typing Animation
```tsx
export function useTypewriter(text: string, speed: number = 16): { out: string; done: boolean } {
  const [out, setOut] = useState('')                    // line 9 — abhi tak typed
  const [done, setDone] = useState(false)

  useEffect(() => {
    setOut(''); setDone(false)                          // line 13 — text badle to reset
    if (!text) return
    let i = 0
    const id = setInterval(() => {                      // line 18
      i += 2 + Math.floor(Math.random() * 3)            // line 19 — ⭐ 2-4 chars/tick (natural)
      if (i >= text.length) { setOut(text); setDone(true); clearInterval(id) }  // line 20
      else setOut(text.slice(0, i))                     // line 25 — slice
    }, speed)
    return () => clearInterval(id)                      // line 29 — cleanup
  }, [text, speed])                                     // line 30 — text/speed badle to restart
  return { out, done }
}
```
- **Input:** `text` + `speed`. **Output:** `{ out (abhi tak ka text), done (poora ho gaya?) }`.
- **Line 19:** ⭐ Har tick par **2-4 random chars** (na ki ek-ek) — yeh typing ko natural/fast lagता hai (mechanical nahi).
- **Line 25 `text.slice(0, i)`:** String ka pehla `i` part dikhao.
- **Line 29 cleanup:** `clearInterval` — warna text badle par purana interval chalta rahega (multiple typers = bug).
- **Use:** Hero demo mein AI answer ko "type" karke dikhana.

### `useInView.ts` — Scroll Reveal (IntersectionObserver)
```tsx
export function useInView(options = {}): { ref, inView } {
  const ref = useRef<Element | null>(null)              // line 9 — element attach
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {   // line 16
      if (entry.isIntersecting) {
        setInView(true)                                 // line 19 — dikha!
        observer.disconnect()                           // line 20 — ⭐ ek baar, phir band
      }
    }, { threshold: 0.15, ...options })                 // line 23 — 15% visible = trigger
    observer.observe(el)
    return () => observer.disconnect()                  // line 27 — cleanup
  }, [])                                                // line 28
  return { ref, inView }
}
```
- **Input:** observer options. **Output:** `{ ref (element par lagao), inView (screen par aaya?) }`.
- **Line 16 `IntersectionObserver`:** Browser API jo batata element viewport mein hai ya nahi (scroll listener se efficient).
- **Line 20 `observer.disconnect()`:** ⭐ Ek baar `inView` hone ke baad observer band — animation dobara nahi chalegी (one-shot reveal). Perf bhi achhi.
- **Line 23 `threshold: 0.15`:** Element ka 15% dikhe to trigger.
- **Usage:**
  ```tsx
  const { ref, inView } = useInView()
  <div ref={ref} className={inView ? 'visible' : 'hidden'}>...</div>
  ```

> **Note:** `PageAnimations` (niche) bhi IntersectionObserver use karta — par woh **DOM attribute-based** (`data-reveal`) hai, hook ke `ref`-based ke ulta. Do approaches same goal ke liye.

---

## 2️⃣ `lib/blog-helpers.ts` — SSR-Safe Helpers

> **"SSR-safe" matlab:** Server aur client dono par **same output** de (warna hydration error). Isliye yeh `toLocaleDateString` jaisी locale-dependent cheez **avoid** karta.

### `processContent` — line 16 (⭐ auto TOC)
```tsx
export function processContent(content): ProcessedContent {
  if (!content) return { html: '', toc: [] }
  const toc: TocItem[] = []
  const html = content.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,              // line 22 — h2/h3 match
    (_, level, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, '').trim() // line 24 — inner tags strip
      const id = text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        .substring(0, 60) || `section-${toc.length}`    // line 30 — slug-style id
      toc.push({ id, label: text })                     // line 31 — TOC entry
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`  // line 32 — id inject
    }
  )
  return { html, toc }
}
```
- **Input:** blog HTML. **Output:** `{ html (id-injected), toc (table of contents) }`.
- **Line 22 regex:** Har `<h2>`/`<h3>` dhoondo. `\1` backreference (opening tag se matching closing).
- **Line 24:** Heading ke andar ke nested tags hatao (sirf text rakho).
- **Line 30:** Text se `id` banao ("RAG Patterns" → "rag-patterns", max 60 char). Khali ho to `section-0`.
- **Line 32:** Original `<h2>` ko `id="..."` ke saath wapas. Yeh `id` se TOC links jump kar sakte (`#rag-patterns`).
- **Why:** Blog page par sticky "Table of Contents" sidebar — auto, content se generate.

### `getInitials` — line 40
```tsx
export function getInitials(name: string): string {
  return (name || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
```
- **Input:** "Jordan Reyes" → **Output:** "JR". Avatar circles ke liye.

### `formatDate` / `formatDateShort` — line 60, 67 (⭐ SSR-safe)
```tsx
const MONTHS_LONG = ['January', ..., 'December']        // line 50 — hardcoded
export function formatDate(dateStr): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`  // line 63
}
```
- **Input:** ISO date string → **Output:** "May 21, 2026".
- **Line 63 `getUTCMonth/getUTCDate`:** ⭐ **UTC use kiya, local nahi.** Aur month **hardcoded array** (`toLocaleString` nahi). **Why?** Server (UTC, maybe US locale) aur client (user ka timezone/locale) different output de sakte → hydration mismatch. UTC + hardcoded months **dono par identical** → safe.

---

## 3️⃣ `app/providers.tsx` — Theme (Client)
```tsx
'use client'
import { ThemeProvider } from 'next-themes'
export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"                            // line 9 — <html data-theme="dark">
      defaultTheme="dark"                               // line 10 — default dark
      enableSystem={false}                              // line 11 — OS preference ignore
      storageKey="atg-theme"                            // line 12 — localStorage key
    >{children}</ThemeProvider>
  )
}
```
- **Line 9 `attribute="data-theme"`:** Theme `<html data-theme="dark">` set karta. CSS `[data-theme="dark"] { --bg: ... }` se colors switch.
- **Line 10-11:** Default dark, system preference ignore (consistent brand look).
- **Line 12:** User ki choice `localStorage["atg-theme"]` mein persist.
- **Root layout** isko `<body>` ke around wrap karta (`app/layout.tsx` line 23).

---

## 4️⃣ `app/blog/[slug]/page.tsx` — Server Detail (⭐ SEO + Cache + JSON-LD)

> Yeh **Server Component** hai (no `'use client'`). Sabse advanced public page — DB fetch, SEO metadata, structured data, fir client ko serialize karke deta.

### Typed payload + cached fetch — line 14, 23
```tsx
import { cache } from 'react'

type BlogWithRelations = Prisma.blogGetPayload<{ include: { author: {...}, category: {...}, tags: {...} } }>  // line 14

const getBlog = cache(async (slug: string) => {         // line 23 — ⭐ React cache
  return await prisma.blog.findUnique({
    where: { slug, status: 'published' },               // line 25 — sirf published
    include: { author: { select: {...} }, category: {...}, tags: { include: { tag: {...} } } },
  })
})
```
- **Line 14 `Prisma.blogGetPayload<...>`:** ⭐ Prisma se **auto-derived type** — `include` ke hisaab se exact return type. Manually type likhne ki zaroorat nahi; schema badle to type auto-update.
- **Line 23 `cache(...)`:** ⭐ **React's `cache`** — same argument se dobara call ho to DB **dobara hit nahi**, cached result. Yeh kyun chahiye? Niche `generateMetadata` aur `BlogPostPage` **dono** `getBlog(slug)` call karte. Bina cache ke **2 DB queries**; cache se **1**. Same-request dedup.
- **Line 25 `status: 'published'`:** Draft blogs public par nahi dikhte (sirf published).

### `generateMetadata` — line 44 (⭐ dynamic SEO)
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)                      // cached — no extra query
  if (!blog) return { title: 'Post not found' }
  const title = blog.seotitle ?? blog.title             // line 49 — SEO override ya fallback
  const description = blog.seodescription ?? blog.excerpt ?? ''
  const image = blog.ogimage ?? blog.coverimage ?? ''   // line 51
  return {
    title, description,
    openGraph: { title, description, type: 'article', images: image ? [{ url: image, width: 1200, height: 630 }] : [] },  // line 56
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : [] },  // line 62
  }
}
```
- **Line 44 `generateMetadata`:** Next.js ka special function — har blog ka **dynamic `<title>`, `<meta>`, OG tags** server par generate. SEO + social sharing ke liye critical.
- **Line 49-51 `??` chains:** SEO title na ho to normal title; OG image na ho to cover image. Graceful fallbacks.
- **Line 56/62:** OpenGraph (Facebook/LinkedIn) + Twitter card — link share par rich preview.

### Related posts — line 78 (⭐ fill strategy)
```tsx
const related: RelatedPost[] = await (async () => {
  const sameCategory = await prisma.blog.findMany({     // line 79 — same category, exclude self
    where: { status: 'published', id: { not: blog.id }, categoryid: blog.categoryid ?? undefined },
    take: 3, orderBy: { publishedat: 'desc' }, select: {...},
  })
  if (sameCategory.length >= 3) return sameCategory      // line 94 — 3 mile? bas
  const extra = await prisma.blog.findMany({             // line 96 — kam pade to fill
    where: { status: 'published', id: { notIn: [blog.id, ...sameCategory.map(r => r.id)] } },  // line 99
    take: 3 - sameCategory.length,                       // line 101 — sirf jitne kam
    orderBy: { publishedat: 'desc' }, select: {...},
  })
  return [...sameCategory, ...extra]                     // line 110
})()
```
- **Line 78 IIFE:** `(async () => {...})()` — turant-chalता async function (inline logic ke liye).
- **Line 79-94:** Pehle **same category** ke 3 related (current blog chhod ke). 3 mil gaye → bas.
- **Line 96-101:** ⭐ Kam mile (e.g. 1) to **kisi bhi category** se baaki (`3 - 1 = 2`) bhar do. `notIn` se duplicates avoid. Hamesha 3 related dikhne ki guarantee.

### JSON-LD structured data — line 116 (⭐ Google rich results)
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BlogPosting', headline: blog.title, datePublished: ..., author: {...} },  // line 120
    { '@type': 'BreadcrumbList', itemListElement: [Home, Blog, ...(category ? [category] : [])] },  // line 134
    ...(faqItems.length > 0 ? [{ '@type': 'FAQPage', mainEntity: faqItems.map(...) }] : []),  // line 146
  ],
}
...
<Script id="blog-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />  // line 196
```
- **Line 116 JSON-LD:** Google ko machine-readable data — search results mein **rich snippets** (author, date, FAQ accordions, breadcrumbs).
- **Line 146:** FAQ ho tabhi `FAQPage` schema add (conditional spread). Yeh Google par expandable Q&A dikha sakta.
- **Line 196 `<Script type="application/ld+json">`:** Schema ko `<head>` mein inject. `dangerouslySetInnerHTML` — kyunki JSON string raw daalni hai.

### Serialization — line 158 (⭐ Date → string)
```tsx
const serializedBlog: SerializedBlog = {
  ...,
  publishedat: blog.publishedat?.toISOString() ?? null, // line 172 — Date → string
  updatedat: blog.updatedat.toISOString(),
  createdat: blog.createdat.toISOString(),
  author: {...}, category: blog.category ? {...} : null, tags: blog.tags.map(...),
}
return <><Script .../><BlogPostClient blog={serializedBlog} related={related} /></>  // line 202
```
- **Line 172:** ⭐ **Server → Client ko data dete waqt `Date` objects ko `string` (ISO) banao.** React Server→Client props ko serialize karta — `Date` cleanly serialize nahi hota. Isiliye `.toISOString()`. (`SerializedBlog` type mein dates `string` hain, isiliye `blog-helpers.formatDate` strings leta.)
- **Line 202:** Sab data ready → `BlogPostClient` (Client Component) ko de do, jo interactive rendering (scroll progress, TOC, share) sambhalता.

> **⭐ Server/Client split ka perfect example:** Server = DB + SEO + heavy data; Client = interactivity. Best of both.

---

## 5️⃣ `app/blog/page.tsx` — Blog List

> **🔄 REFACTORED (current code):** The old "static-first" approach below was **removed**.
> `app/blog/page.tsx` is now a **Server Component** that fetches published posts directly via
> Prisma and passes them as props to a new `app/blog/BlogIndex.tsx` (client) for filter/search.
> Loading = `app/blog/loading.tsx` (skeleton), errors = `app/blog/error.tsx`. No `STATIC_POSTS`,
> no `useEffect` fetch, no fallback — only real DB records, server-rendered for SEO.
> The historical explanation is kept below for learning context.

### (Historical) Old Client List — ⭐ Static Fallback + API
```tsx
'use client'
const STATIC_POSTS: Post[] = [ {...9 hardcoded posts...} ]  // line 40 — fallback content

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All')   // line 70 — tag filter
  const [posts, setPosts] = useState<Post[]>(STATIC_POSTS)  // line 71 — ⭐ static se start
  const searchRef = useRef<HTMLInputElement | null>(null)   // line 72

  useEffect(() => {                                         // line 74 — API se real posts
    fetch('/api/blogs?status=published')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data.length > 0) {         // line 81 — DB mein posts hain?
          const dbPosts = data.data.map((blog, i) => ({     // line 82 — DB → UI shape
            href: `/blog/${blog.slug}`,
            ph: PH_COLORS[i % PH_COLORS.length],            // line 84 — rotating placeholder color
            coverImage: blog.coverimage ?? '',
            tag: blog.tag ?? 'General',
            initials: blog.author.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(),  // line 89
            dateLabel: new Date(...).toLocaleDateString('en-US', { month:'short', day:'numeric' }),  // line 92
            readMin: blog.readmin,
          }))
          setPosts(dbPosts)                                 // line 95 — static ko replace
        }
      })
      .catch(() => { /* silently keep static */ })          // line 98 — ⭐ fail = static rehne do
  }, [])

  useEffect(() => {                                         // line 103 — ⭐ Cmd/Ctrl+K search
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)  // cleanup
  }, [])
```
- **Line 71 `useState(STATIC_POSTS)`:** ⭐ **Static-first pattern.** Page turant 9 hardcoded posts dikhaता (instant load, no empty flash). Phir API se real data aaye to replace.
- **Line 74-98:** Mount par `/api/blogs?status=published`. Success + posts hain → DB posts se replace (line 95). **Fail ya khali → static rehne do** (line 98 silent catch). **Graceful degradation** — DB down ho to bhi page kuch dikhaता.
- **Line 82-94:** DB shape ko UI `Post` shape mein transform (initials nikaalna, date format, placeholder color assign).
- **Line 84 `PH_COLORS[i % ...]`:** Cover image na ho to rotating placeholder color (ph-a, ph-b, ...) — visual variety.
- **Line 103-112:** ⭐ **Cmd+K / Ctrl+K** se search input focus (modern app shortcut). Global `keydown` listener + cleanup.

> **⚠️ Note (historical):** Pehle listing client-side + static fallback thi; detail server-side. Ab **dono server-side** (real DB + SEO) hain — listing `BlogIndex` client child se sirf filter/search karti hai.

---

## 6️⃣ `components/ui/PageAnimations.tsx` — Animation Engine (⭐ Declarative)

> Ek hi `<PageAnimations />` page mein drop karo, fir kisi bhi element par `data-reveal` ya `data-countup` attribute lagao — animation ho jaayegी. Returns `null` (koi UI nahi, sirf behavior).

### Scroll reveal — line 18
```tsx
useEffect(() => {
  const els = Array.from(document.querySelectorAll('[data-reveal]'))  // line 19 — sab reveal els
  if (!els.length) return
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target) }  // line 23
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })  // line 25
  els.forEach(el => io.observe(el))
  return () => io.disconnect()                          // line 28 — cleanup
}, [pathname])                                          // line 29 — ⭐ route change par re-scan
```
- **Line 19:** Page ke saare `[data-reveal]` elements collect (e.g. `<div data-reveal="fade-up">`).
- **Line 23:** Element screen par aate hi `revealed` class add (CSS keyframe trigger — `globals.css` mein). `unobserve` = ek baar (one-shot).
- **Line 25 `rootMargin: '0px 0px -40px 0px'`:** Bottom se 40px pehle trigger (element thoda andar aaye tab).
- **Line 29 `[pathname]`:** ⭐ Route change par dobara scan (naye page ke naye elements observe). Single-page navigation mein zaroori.

### Count-up — line 32 (⭐ requestAnimationFrame)
```tsx
useEffect(() => {
  const els = Array.from(document.querySelectorAll('[data-countup]'))  // line 33
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return
    const el = e.target as HTMLElement
    const target = el.dataset.countup ?? ''             // line 39 — "88%"
    const suffix = target.replace(/[\d.]+/, '')         // line 40 — "%" (number hatao)
    const num = parseFloat(target)                      // line 41 — 88
    io.unobserve(el)
    if (isNaN(num)) { el.textContent = target; return } // line 43 — non-number? as-is
    const dur = 1600; const t0 = performance.now()      // line 44 — 1.6s animation
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)           // line 46 — progress 0→1
      const ease = 1 - Math.pow(1 - p, 3)               // line 47 — ⭐ ease-out cubic
      el.textContent = (num < 10 ? (num*ease).toFixed(1).replace('.0','') : Math.round(num*ease)) + suffix  // line 48
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target  // line 49
    }
    requestAnimationFrame(tick)                         // line 51
  }), { threshold: 0.5 })                               // line 53 — 50% visible
  ...
}, [pathname])
```
- **Line 39-41:** `data-countup="88%"` → number `88` + suffix `"%"` alag.
- **Line 44-51 animation loop:** `requestAnimationFrame` (smooth 60fps). `p` = progress 0→1 over 1.6s.
- **Line 47 ease-out cubic:** `1 - (1-p)³` — shuru fast, end slow (natural feel). Linear se behtar.
- **Line 48:** Number ko `0 → 88` tak count karke `%` lagao. Chhote numbers (`<10`) ke liye 1 decimal.
- **Line 49:** `p < 1` to agla frame; warna exact target set (rounding errors avoid).
- **Use:** Stats sections — "1,200+ teams", "98% accuracy" ko 0 se count-up animation.

> **⭐ Declarative animation pattern:** Logic ek jagah (`PageAnimations`), trigger HTML attributes se. Koi bhi developer bina JS likhe `data-reveal="fade-up"` laga ke animation paa sakta. Clean separation.

---

## 🎨 Section Components (Pattern Overview)

`components/sections/*` (Hero, Features, FAQ, Pricing, etc.) sabhi:
- Mostly **Client Components** (interactivity — tabs, toggles, typing).
- Data **`lib/data.ts`** se (static marketing content — DB nahi).
- Styles **inline `<style>`** tags (component-scoped).
- Custom hooks use karte (`useTypewriter` in Hero, `useScrollNav` in Nav, `useMounted` for theme).
- `Icons` (`components/icons/Icons.tsx`) se dynamic icon lookup: `const Icon = Icons[f.icon]; <Icon />`.

**Example — Hero.tsx** (representative):
- `useTypewriter` → AI answer ko type karke dikhana.
- `useMounted` → theme-aware logo (`logo-dark.svg` vs `logo-light.svg`) hydration-safe.
- Static `SUGGESTIONS`/`ANSWERS` (lib/data) → demo Q&A.
- `Marks` (Connectors.tsx) → source citation icons.

> Yeh sab **homepage** (`app/page.tsx`) mein ek ke baad ek compose hote — Hero, Logos, Features, HowItWorks, Showcase, UseCases, Testimonials, Pricing, FAQ, CTA.

---

## 🔄 Blog Page — Complete Data Flow

### Public list (`/blog`)
```
BlogPage (Client) mounts → STATIC_POSTS turant dikhao
   → useEffect: fetch /api/blogs?status=published
        → success → transform → setPosts(dbPosts)   [real data]
        → fail    → static rehne do                 [graceful]
   → filter chips (activeFilter) + Cmd+K search
```

### Public detail (`/blog/[slug]`)
```
BlogPostPage (Server)
   ├─ generateMetadata → getBlog(slug) [cached] → <title>, OG, Twitter
   ├─ getBlog(slug) [cached — same query reused, no 2nd DB hit]
   ├─ related posts (same-category fill strategy)
   ├─ JSON-LD (BlogPosting + Breadcrumb + FAQ)
   ├─ serialize (Date → ISO string)
   └─ <BlogPostClient blog={...} related={...} />   [interactivity]
         └─ processContent() → TOC + id-injected HTML
         └─ scroll progress bar, sticky TOC, share buttons
```

---

## ⚠️ Public/UI Layer — Key Lessons
| Concept | Kahan | Kyun |
|---|---|---|
| `useMounted` hydration guard | theme UI | Server≠client mismatch roko |
| `cache()` from React | blog/[slug] | Same-request DB dedup (metadata+page) |
| `generateMetadata` | blog/[slug] | Per-page dynamic SEO + OG tags |
| JSON-LD `<Script>` | blog/[slug] | Google rich results |
| Date → ISO string | server→client props | React serialization limit |
| SSR-safe dates (UTC + hardcoded months) | blog-helpers | No hydration mismatch |
| Static-first + API replace | blog/page | Instant load + graceful degradation |
| Declarative animations (`data-reveal`) | PageAnimations | Logic once, trigger via HTML |
| `requestAnimationFrame` + ease-out | count-up | Smooth 60fps |
| Always cleanup listeners/observers | every useEffect | Memory leaks roko |

---

## 📚 Saare 4 Docs — Index
1. `walkthrough-01-auth.md` — Auth & security (proxy, NextAuth, RBAC, actions)
2. `walkthrough-02-database-and-apis.md` — Schema, Prisma, all route handlers
3. `walkthrough-03-dashboard-cms.md` — Server pages + client forms, Sidebar
4. `walkthrough-04-public-site-ui.md` — Hooks, blog pages, animations, theme

*Plus `PROJECT_GUIDE.md` (root) — high-level architecture + learning guide.*
