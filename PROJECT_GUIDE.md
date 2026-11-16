# 🧠 ATG Marketing — Poora Project Samjho (Hinglish Mentoring Guide)

> Yeh document ek senior developer ki tarah, beginner ko samjhaane ke style mein likha gaya hai.
> Sab kuch Hinglish (Hindi + English) mein hai, examples ke saath.

---

## 0. Sabse Pehle — Ek Important Baat (READ THIS FIRST)

Yeh **normal Next.js nahi hai**. Yeh **Next.js 15.5** hai jisme kuch **breaking changes** hain. Sabse bada change jo is project mein dikhta hai:

| Purana Next.js (jo tumne seekha hoga) | Is project mein (Next 15.5) |
|---|---|
| `middleware.ts` file, `export function middleware()` | **`proxy.ts`** file, `export const proxy = ...` |

Matlab — jo cheez pehle "middleware" kehlaati thi (har request ke beech mein chalने wala code), ab uska naam **proxy** ho gaya hai. File project ke **root** mein hai (`proxy.ts`) aur Next.js use **automatically** uthaa leta hai — koi extra config nahi chahiye.

👉 **Lesson:** Jab bhi koi cheez "ajeeb" lage jo tumhari training/tutorials se match na kare, to `node_modules/next/dist/docs/` ke andar docs padho. (Yeh baat project ke `AGENTS.md` mein bhi likhi hai.)

---

## 1. Tech Stack — Project Kis Cheez Se Bana Hai

| Layer | Technology | Kaam |
|---|---|---|
| Framework | **Next.js 15.5** (App Router) | Frontend + Backend dono ek hi project mein |
| Language | **TypeScript** | JavaScript + types (safety) |
| UI Library | **React 19** | Components banane ke liye |
| Database | **MongoDB** | Saara dynamic data (blogs, users, etc.) |
| ORM | **Prisma 5.22** | Database se baat karne ka safe tareeka |
| Auth | **NextAuth v5 (beta)** | Login / session / roles |
| Password | **bcryptjs** | Password ko hash karke save karna |
| Validation | **Zod** | User input check karna |
| Image storage | **Cloudinary** | Images upload + host karna |
| Styling | **CSS-in-JS (inline `<style>`)** + Tailwind v4 (utility) | Design |
| Theme | **next-themes** | Dark / light mode |

**Bada picture:** Yeh ek **marketing website + CMS (Content Management System)** hai company "clarant.ai" ke liye.
- **Public side:** Homepage, blog, use-cases, customer stories, contact form (sabhi log dekh sakte hain).
- **Admin side (`/dashboard`):** Login ke baad content manage karna — blogs/use-cases/testimonials/users (sirf logged-in staff).

---

## 2. Folder Structure Tree (Poora Map)

```
PublicSite/
├── proxy.ts                  ← ⭐ MIDDLEWARE (naya naam!) — route protection
├── prisma/
│   ├── schema.prisma         ← Database ka blueprint (models/tables)
│   ├── seed.ts               ← Demo data daalne ki script
│   └── migrate-pg-to-mongo.ts← Purane Postgres se Mongo migration
│
├── lib/                      ← Core logic (dimaag wale files)
│   ├── prisma.ts             ← DB connection (singleton)
│   ├── auth.ts               ← NextAuth full config (login logic)
│   ├── auth.config.ts        ← Halka auth config (edge/middleware ke liye)
│   ├── rbac.ts               ← Role-based permissions (kaun kya kar sakta)
│   ├── cloudinary.ts         ← Image upload (server-only)
│   ├── blog-helpers.ts       ← Blog content/date helpers
│   ├── data.ts / constants.ts← Static marketing content (DB nahi)
│   ├── types.ts              ← Marketing data ke types
│   └── utils.ts              ← cn() helper (className merge)
│
├── types/
│   ├── index.ts              ← App-wide types + NextAuth extend
│   └── css.d.ts              ← .css import allow karne ke liye
│
├── app/                      ← ⭐ APP ROUTER — saare pages + APIs yahan
│   ├── layout.tsx            ← Root layout (sab pages ke around)
│   ├── page.tsx              ← Homepage (/)
│   ├── providers.tsx         ← ThemeProvider wrapper
│   ├── globals.css           ← Global styles + animation keyframes
│   │
│   ├── actions/auth.ts       ← ⭐ Server Actions (login/signup/reset)
│   │
│   ├── (auth)/               ← Auth pages group (URL mein (auth) nahi aata)
│   │   ├── layout.tsx        ← Centered card layout
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── api/                  ← ⭐ ROUTE HANDLERS (backend endpoints)
│   │   ├── auth/[...nextauth]/route.ts  ← NextAuth ka catch-all
│   │   ├── analytics/route.ts
│   │   ├── blogs/route.ts + [id]/route.ts
│   │   ├── categories/route.ts + [id]/route.ts
│   │   ├── tags/route.ts + [id]/route.ts
│   │   ├── testimonials/route.ts + [id]/route.ts
│   │   ├── use-cases/route.ts + [id]/route.ts
│   │   ├── users/route.ts + [id]/route.ts + profile/route.ts
│   │   ├── contact/route.ts
│   │   └── upload/route.ts   ← Cloudinary image upload
│   │
│   ├── blog/                 ← Public blog (list + [slug] detail)
│   ├── use-cases/            ← Persona pages (marketing, sales, etc.)
│   ├── contact/page.tsx
│   │
│   └── dashboard/            ← ⭐ ADMIN PANEL (protected by proxy.ts)
│       ├── layout.tsx        ← auth() check + Sidebar
│       ├── page.tsx          ← Overview stats
│       ├── analytics/
│       ├── blogs/ (page + BlogForm + new + [id]/edit)
│       ├── use-cases/ (page + UseCaseForm + new + [id]/edit)
│       ├── testimonials/ (page + TestimonialForm + new + [id]/edit)
│       ├── categories/ (page + CategoriesClient)
│       ├── tags/ (page + TagsClient)
│       ├── users/ (page + UserManagement)
│       ├── profile/ (page + ProfileForm)
│       └── settings/ (page + SettingsForm)
│
├── components/
│   ├── layout/     ← Nav, Navbar, Footer, Providers, ThemeToggle
│   ├── sections/   ← Hero, Features, FAQ, CTA, Pricing, Testimonials, ...
│   ├── dashboard/  ← Sidebar, Header, StatsCard, DeleteButton, ...
│   ├── ui/         ← PageAnimations, RobotCursor, VideoModal, ThemeToggle
│   ├── connectors/ ← Connectors.tsx (SVG logos)
│   └── icons/      ← Icons.tsx, ConnectorMarks.tsx
│
├── hooks/          ← useInView, useMounted, useScrollNav, useTypewriter
└── public/         ← Images, fonts, SVGs, logos
```

---

## 3. Next.js Architecture (App Router) — Concept Clear Karo

### 3.1 Server Component vs Client Component (SABSE ZAROORI CONCEPT)

App Router mein har component **by default Server Component** hota hai. Matlab woh **server par chalta hai**, DB se directly baat kar sakta hai, lekin usme `useState`/`onClick` jaisi browser cheezein nahi chal sakti.

Agar tumhe interactivity chahiye (button click, form, hooks), to file ke **top par `'use client'`** likhna padta hai → woh **Client Component** ban jaata hai.

```tsx
// Server Component (default) — DB query kar sakta hai
export default async function Page() {
  const blogs = await prisma.blog.findMany()   // ✅ direct DB
  return <List blogs={blogs} />
}
```

```tsx
'use client'   // ← yeh line client component bana deti hai
import { useState } from 'react'
export default function Form() {
  const [name, setName] = useState('')          // ✅ hooks allowed
  return <input onChange={e => setName(e.target.value)} />
}
```

**Is project ka pattern (yaad rakho):**
> **Server Component** data fetch karta hai (Prisma se) → **Client Component** ko props mein data deta hai → Client Component form/interaction handle karta hai → Client Component **`fetch()`** se API ko call karta hai.

Example: `dashboard/blogs/[id]/edit/page.tsx` (Server) DB se blog laata hai → `BlogForm.tsx` (Client) ko deta hai → user edit karke save karta hai → `BlogForm` `PUT /api/blogs/[id]` call karta hai.

### 3.2 Layouts

- `app/layout.tsx` → **Root layout.** `<html>`, `<body>`, `<Providers>` (theme). Saare pages iske andar render hote hain. Yahan global `metadata` (SEO title/description) define hai.
- `app/(auth)/layout.tsx` → Auth pages ka centered card design.
- `app/dashboard/layout.tsx` → **Protected layout.** `await auth()` karke check karta hai user logged-in hai ya nahi; nahi to `redirect('/login')`. Phir `Sidebar` + content dikhata hai.
- `app/blog/layout.tsx` → bas CSS import karne ke liye chhota wrapper.

### 3.3 Route Groups — `(auth)`

`(auth)` folder ke brackets ka matlab: yeh folder **URL mein nahi aata**. Toh `app/(auth)/login/page.tsx` ka URL sirf `/login` hai, `/auth/login` nahi. Yeh sirf **files ko group karke ek common layout** dene ke liye hai.

### 3.4 Dynamic Routes — `[slug]` aur `[id]`

- `app/blog/[slug]/page.tsx` → `/blog/rag-isnt-dead` jaise URLs handle karta hai. `slug` ek variable hai.
- `app/api/blogs/[id]/route.ts` → `/api/blogs/<koi-bhi-id>` handle karta hai.

### 3.5 Route Handlers (Backend APIs)

`app/api/.../route.ts` files **backend endpoints** hain. Inme tum HTTP methods export karte ho:

```ts
export async function GET(req)  { ... }   // data padhna
export async function POST(req) { ... }   // naya banana
export async function PUT(req)  { ... }   // poora update
export async function PATCH(req){ ... }   // thoda update
export async function DELETE(req){ ... }  // delete
```

### 3.6 Proxy (Middleware) — `proxy.ts`

Yeh har matching request se **pehle** chalta hai (page load hone se bhi pehle). Iska kaam: **route protection**.

```ts
// proxy.ts (simplified)
const protectedPaths = ['/dashboard']                       // login chahiye
const authPaths = ['/login','/signup','/forgot-password','/reset-password']

// /dashboard pe ja rahe ho bina login? → /login bhej do
if (isProtected && !session) return redirect('/login?callbackUrl=...')

// pehle se logged-in ho aur /login khol rahe ho? → /dashboard bhej do
if (isAuthPage && session) return redirect('/dashboard')
```

`config.matcher` batata hai yeh kin routes par chale:
```ts
matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password', '/reset-password']
```

**Important:** proxy **edge runtime** par chalta hai, isliye yeh DB import nahi karta. Sirf JWT token check karta hai (`lib/auth.config.ts` — halka config, koi Prisma nahi). Yeh ek deliberate design hai — edge fast hota hai aur Node-only packages (Prisma/cloudinary) wahan nahi chal sakte.

---

## 4. Database Architecture (MongoDB + Prisma)

### 4.1 Kaun sa DB aur connection kahan?

- **Database:** MongoDB (`provider = "mongodb"` in `prisma/schema.prisma`).
- **Connection file:** `lib/prisma.ts`.

```ts
// lib/prisma.ts — connection URL resolution
url: process.env.MONGODB_URI ?? process.env.DATABASE_URL
```
- Pehle `MONGODB_URI` try karta hai (production/Vercel), fir `DATABASE_URL` (Prisma CLI + local dev).
- **Singleton pattern:** `globalForPrisma.prisma` use karta hai taaki dev mode mein hot-reload par baar-baar naye connections na bane.

```ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient({...})
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
> **Why?** Next.js dev mode files ko baar-baar reload karta hai. Bina singleton ke har reload par naya `PrismaClient` banta → "too many connections" error. Singleton ek hi instance reuse karta hai.

### 4.2 Models (MongoDB "collections" — SQL ki "tables" jaisi)

`prisma/schema.prisma` mein 8 models hain:

| Model | Kaam | Key fields |
|---|---|---|
| **users** | Staff accounts | name, email, password (hashed), role, bio, jobtitle, twitter, linkedin, resettoken |
| **blog** | Blog posts | title, slug, content, excerpt, coverimage, ogimage, seotitle, faq(Json), status, readmin, authorid, categoryid |
| **blogcategory** | Categories | name, slug |
| **blogtag** | Tags | name, slug |
| **blogtagmap** | Blog↔Tag join (many-to-many) | blogid, tagid (cascade delete) |
| **usecase** | Use-case pages | title, slug, persona, pagedata(Json), metric, industry, teamtype, status, authorid |
| **testimonial** | Customer quotes | quote, authorname, company, initials, seats, status, order |
| **contactsubmission** | Contact form entries | name, email, company, message, status |

**Relationships:**
- `users` 1—∞ `blog` (ek user ke kai blogs) — `blog.authorid → users.id`
- `users` 1—∞ `usecase`
- `blogcategory` 1—∞ `blog`
- `blog` ∞—∞ `blogtag` (via `blogtagmap` join table)

**Enums:**
```prisma
enum role   { admin  editor  author }
enum status { draft  published  archived }
```

**ID note:** `id String @id @default(cuid()) @map("_id")` — Mongo apne ID ko `_id` kehta hai, Prisma usse `id` ke roop mein expose karta hai. CUID = collision-resistant unique string.

### 4.3 CRUD Operations (Prisma syntax)

```ts
prisma.blog.findMany({ where, include, orderBy })   // READ (list)
prisma.blog.findUnique({ where: { id } })           // READ (one)
prisma.blog.create({ data })                         // CREATE
prisma.blog.update({ where: { id }, data })          // UPDATE
prisma.blog.delete({ where: { id } })                // DELETE
prisma.blog.count({ where })                         // COUNT
```

**⚠️ MongoDB gotcha:** Mongo mein SQL jaisi **Foreign Key constraints nahi hoti**. Isliye delete karne se pehle code **manually** check karta hai:
- Category delete: pehle `prisma.blog.count({ where: { categoryid } })` → agar blogs hain to 409 error.
- User delete: pehle blogs + usecases count → agar content hai to "reassign first" error.
- Tag delete: yeh safe hai kyunki `blogtagmap` par `onDelete: Cascade` hai (auto cleanup).

### 4.4 Kaun sa page kaun si query use karta hai

| Page / Action | Prisma Query | Operation |
|---|---|---|
| `dashboard/page.tsx` | `blog.count`, `usecase.count`, `users.count`, recent `findMany` | READ stats |
| `dashboard/blogs/page.tsx` | `blog.findMany` (author role → sirf apne) | READ |
| `blog/[slug]/page.tsx` | `blog.findUnique({slug, status:published})` + related `findMany` | READ (public) |
| `api/blogs` POST | `blog.create` | CREATE |
| `api/blogs/[id]` PUT/DELETE | `blog.update` / `blog.delete` | UPDATE/DELETE |
| `actions/auth.ts signup` | `users.findUnique` + `users.create` | CREATE |
| `actions/auth.ts resetPassword` | `users.findFirst` + `users.update` | UPDATE |
| `api/contact` POST | `contactsubmission.create` | CREATE |
| `api/analytics` GET | 10 parallel `count`/`findMany` | READ |

---

## 5. Authentication Flow (NextAuth v5 + JWT)

### 5.1 Login Process (step-by-step)

```
User /login page (Client Component)
   │  form submit → server action `login(formData)`
   ▼
app/actions/auth.ts → login()
   │  signIn('credentials', { email, password, redirectTo })
   ▼
lib/auth.ts → Credentials.authorize()
   │  1. Zod se email/password validate
   │  2. prisma.users.findUnique({ email })
   │  3. bcrypt.compare(password, user.password)
   │  4. sahi → user object return; galat → null
   ▼
JWT token banta hai (callbacks.jwt) → role token mein daala jaata hai
   ▼
Browser cookie mein JWT save → /dashboard redirect
```

### 5.2 Session Handling — JWT strategy

`lib/auth.ts` mein `session: { strategy: 'jwt' }`. Matlab **koi session table DB mein nahi** — sab kuch ek **signed JWT cookie** mein hai.

Do callbacks important hain:
- **`jwt` callback:** Pehli baar login par `user.id` aur `role` token mein daalta hai. Baad ke requests par DB se dobara check karta hai user abhi bhi exist karta hai (self-healing — agar user delete ho gaya to token invalid). DB down ho to `try/catch` purana token rakh leta hai (logout nahi karta).
- **`session` callback:** Token se `id` aur `role` ko `session.user` mein copy karta hai taaki client padh sake.

### 5.3 Do alag auth config kyun? (Important design)

| File | Use | DB? |
|---|---|---|
| `lib/auth.ts` | Full config — login/Credentials/Prisma | ✅ Haan (Node runtime) |
| `lib/auth.config.ts` | Halka config — sirf JWT check | ❌ Nahi (edge-safe) |

`proxy.ts` (middleware) **edge** par chalta hai jahan Prisma nahi chal sakta. Isliye woh `auth.config.ts` (bina DB) use karta hai. Actual login `lib/auth.ts` mein hota hai.

### 5.4 Protected Routes (3 layers ki security)

1. **proxy.ts (gate)** — `/dashboard/*` par bina login → `/login`.
2. **dashboard/layout.tsx (double-check)** — `await auth()` server par; no session → `redirect('/login')`.
3. **API + RBAC (action-level)** — har sensitive API `requirePermission('...')` call karti hai.

### 5.5 RBAC — Role Based Access Control (`lib/rbac.ts`)

3 roles, har ek ke alag permissions:

```
admin  → sab kuch (users, roles, blogs, use-cases, testimonials, analytics, settings)
editor → content manage + publish + analytics (users nahi)
author → sirf apne blogs/use-cases create + edit (publish nahi)
```

Key functions:
```ts
hasPermission(role, 'manage:blogs')        // true/false
requirePermission('manage:blogs')          // server: session check + throw if no perm
canEdit(role, userId, resourceAuthorId)    // admin/editor=all, author=sirf apna
```

> **Pattern:** API route ke shuru mein `await requirePermission('manage:blogs')`. Agar fail ho to `UNAUTHORIZED`/`FORBIDDEN` throw → catch block 401/403 return karta hai.

### 5.6 Password Reset Flow

```
forgot-password → forgotPassword() → crypto random token + 1hr expiry → DB mein save
   → (prod mein email; abhi console.log mein link)
reset-password?token=xxx → resetPassword() → token valid + not expired check
   → naya password bcrypt hash → token clear → /login?message=password-reset
```
Security touch: agar email exist na kare tab bhi "success" return karta hai (email enumeration rokne ke liye).

---

## 6. API Documentation (Complete Endpoint Reference)

> Har API ek consistent shape return karti hai:
> Success: `{ success: true, data: ... }` · Error: `{ success: false, error: "..." }`

### Auth
| Endpoint | Method | Body | Auth | Kaam |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | — | — | NextAuth ke saare internal endpoints (signin/signout/session) |

### Blogs
| Endpoint | Method | Body | Auth | DB |
|---|---|---|---|---|
| `/api/blogs` | GET | — | Public | `blog.findMany` (+author,category) |
| `/api/blogs` | POST | title, slug, content, excerpt, coverimage, ogimage, seo*, faq[], tag, status, readmin, categoryid | `manage:blogs` | `blog.create` |
| `/api/blogs/[id]` | GET | — | Public | `blog.findUnique` (+tags) |
| `/api/blogs/[id]` | PUT | (partial blog fields) | `manage:blogs` + `canEdit` | `blog.update` |
| `/api/blogs/[id]` | DELETE | — | admin only | `blog.delete` |

Special logic: `status === 'published'` par `publishedat` set hota hai (sirf pehli baar).

### Categories / Tags (same shape)
| Endpoint | Method | Body | Auth |
|---|---|---|---|
| `/api/categories` | GET / POST | `{name, slug}` | GET public / POST `manage:blogs` |
| `/api/categories/[id]` | PUT / DELETE | `{name, slug}` | `manage:blogs`; DELETE admin only (+ FK check) |
| `/api/tags` | GET / POST | `{name, slug}` | same |
| `/api/tags/[id]` | PUT / DELETE | `{name, slug}` | same (cascade cleanup) |

### Testimonials
| Endpoint | Method | Body | Auth |
|---|---|---|---|
| `/api/testimonials?status=published&all=` | GET | — | Public |
| `/api/testimonials` | POST | quote, authorname, authorrole, company, initials, seats, status, order | `manage:testimonials` |
| `/api/testimonials/[id]` | GET/PUT/DELETE | (partial) | PUT/DELETE → `manage:testimonials`; DELETE admin |

### Use-Cases
| Endpoint | Method | Body | Auth |
|---|---|---|---|
| `/api/use-cases?status=&persona=` | GET | — | Public |
| `/api/use-cases` | POST | title, slug, persona, excerpt, content, pagedata(JSON), metric, industry, teamtype, status | `manage:use-cases` |
| `/api/use-cases/[id]` | GET/PUT/DELETE | (partial) | PUT → `manage:use-cases`+`canEdit`; DELETE admin |

### Users
| Endpoint | Method | Body | Auth |
|---|---|---|---|
| `/api/users` | GET/POST | name, email, password(8+), role | `manage:users` (admin) |
| `/api/users/[id]` | GET/PUT/DELETE | (partial; password optional) | `manage:users`; DELETE: self-delete & content guard |
| `/api/users/profile` | GET/PATCH | name, email, password, bio, jobtitle, twitter, linkedin, image | `auth()` (apni hi profile) |

### Utility
| Endpoint | Method | Body | Auth | Kaam |
|---|---|---|---|---|
| `/api/contact` | POST | name, email, company, role, teamsize, message | Public | `contactsubmission.create` |
| `/api/upload` | POST | FormData `{ file }` | logged-in | Cloudinary upload → `{ url, publicId, width, height }` |
| `/api/analytics` | GET | — | `view:analytics` | counts + monthly chart data |

---

## 7. Important Functions — Input / Output / Logic / Why

### `cn(...inputs)` — `lib/utils.ts`
- **Input:** class names (strings/objects/arrays)
- **Output:** ek clean className string
- **Logic:** `twMerge(clsx(inputs))` — clsx conditional classes join karta, twMerge Tailwind conflicts hata deta (`px-2 px-4` → `px-4`)
- **Why:** Tailwind classes ko safely combine karne ke liye. **(Yeh wahi file thi jisne deploy fail kiya tha — `tailwind-merge` package missing tha.)**

### `requirePermission(permission)` — `lib/rbac.ts`
- **Input:** permission string (e.g. `'manage:blogs'`)
- **Output:** session object (ya throw `UNAUTHORIZED`/`FORBIDDEN`)
- **Logic:** `auth()` se session lo → role nikaalo → `hasPermission` check
- **Why:** Har protected API ke top par ek-line security guard.

### `authorize(credentials)` — `lib/auth.ts`
- **Input:** `{ email, password }`
- **Output:** user object (login success) ya `null` (fail)
- **Logic:** Zod validate → DB se user → `bcrypt.compare` → return
- **Why:** NextAuth ko batata hai login valid hai ya nahi.

### `processContent(content)` — `lib/blog-helpers.ts`
- **Input:** blog HTML string
- **Output:** `{ html, toc }` — html mein h2/h3 ko `id` mil jaati, toc = table of contents
- **Why:** Blog page par "jump links" / sticky TOC banane ke liye.

### `getBlog(slug)` — `app/blog/[slug]/page.tsx` (wrapped in React `cache()`)
- **Input:** slug
- **Output:** blog + author + category + tags
- **Logic:** `cache()` ke andar `prisma.blog.findUnique` — ek hi request mein do baar call (metadata + page) hone par bhi **DB sirf ek baar hit** hota hai
- **Why:** Performance — duplicate query avoid.

### `uploadImageToCloudinary(buffer, folder)` — `lib/cloudinary.ts`
- **Input:** image buffer + folder name
- **Output:** `{ url, publicId, width, height, format, bytes }`
- **Why:** Images Cloudinary par store; sirf URL DB mein save hota hai. `import 'server-only'` se yeh galti se client mein import nahi ho sakti.

---

## 8. React Hooks — Project Mein Kahan, Kyun

### Built-in hooks
- **`useState`** — local data (form inputs, loading, error, modal open). Har Client form mein.
- **`useEffect`** — side effects: mount par API fetch (`blog/page.tsx`, `CategoriesClient`), scroll listeners, keyboard shortcuts.
- **`useRef`** — DOM reference (file input `fileRef`) ya "slug touched" jaisa flag jo re-render trigger na kare.
- **`useMemo`** — `Sidebar.tsx` mein role ke hisaab se nav items filter karna (har render par recompute na ho).
- **`useRouter`** (`next/navigation`) — save ke baad `router.push('/dashboard/blogs')` + `router.refresh()`.
- **`usePathname`** — Sidebar mein current active link highlight.
- **`useSearchParams`** — login page par `?callbackUrl`/`?message` padhna (Suspense ke andar wrap karna padta hai).
- **`useSession`** / `auth()` — client mein session, server mein `auth()`.

### Custom hooks (`hooks/`)
| Hook | Signature | Andar | Kaam |
|---|---|---|---|
| `useInView(options)` | `{ ref, inView }` | useState+useEffect+useRef | Element screen par aaya? (scroll animations) |
| `useMounted()` | `boolean` | useState+useEffect | Hydration guard — client par mount hua? (theme mismatch rokne) |
| `useScrollNav(threshold=8)` | `boolean` | useState+useEffect | Page scroll hua? (navbar background change) |
| `useTypewriter(text, speed=16)` | `{ out, done }` | useState+useEffect | Text ko ek-ek letter type karne wala animation (Hero demo) |

> **useMounted ka concept:** Server par `theme` pata nahi hota (browser localStorage server par nahi). Toh agar seedha theme-based UI render karo to server HTML ≠ client HTML → "hydration error". `useMounted` pehle render par `false`, mount ke baad `true` — tab tak theme UI skip kar dete hain.

---

## 9. Dependency Map — Page → Component → API → Database

### Public Blog flow
```
/blog/[slug] (Server page.tsx)
   └─ prisma.blog.findUnique(slug)  ─────────────► MongoDB (blog + author + category + tags)
   └─ <BlogPostClient blog={...} /> (Client)
          └─ processContent() → TOC + HTML render
          └─ (koi API call nahi — data props se aata hai)
```

### Contact form flow
```
/contact (Client page.tsx)
   └─ form submit → fetch POST /api/contact   ─────► api/contact/route.ts
                                                        └─ Zod validate
                                                        └─ prisma.contactsubmission.create ─► MongoDB
   └─ response { success } → "Message sent!" screen
```

### Dashboard blog edit flow (poora chain)
```
/dashboard/blogs/[id]/edit (Server page.tsx)
   └─ auth() check (login?)
   └─ prisma.blog.findUnique(id) ──────────────────► MongoDB
   └─ prisma.blogcategory.findMany() (dropdown)
   └─ <BlogForm initialData={blog} categories={...} /> (Client)
          ├─ image upload → fetch POST /api/upload ──► Cloudinary → url
          └─ save → fetch PUT /api/blogs/[id] ───────► api/blogs/[id]/route.ts
                                                          └─ requirePermission('manage:blogs')
                                                          └─ canEdit() check
                                                          └─ prisma.blog.update ──────────► MongoDB
          └─ success → router.push('/dashboard/blogs') + refresh()
```

### Login flow
```
/login (Client) → server action login() → lib/auth.ts authorize()
   └─ prisma.users.findUnique ─► MongoDB
   └─ bcrypt.compare → JWT cookie → /dashboard
proxy.ts har /dashboard request par JWT check karta hai
```

---

## 10. User Flow Diagrams

### A) Visitor (public user)
```
Homepage (/) → Blog (/blog) → Blog post (/blog/[slug])
            → Use-cases (/use-cases/marketing)
            → Contact (/contact) → form submit → DB
   (koi login nahi chahiye)
```

### B) New staff member
```
/signup → account ban gaya (role: author) → auto-login → /dashboard
   → /dashboard/blogs/new → blog likho → save (draft)
   → editor/admin publish karega (author publish nahi kar sakta)
```

### C) Admin
```
/login → /dashboard (full access)
   → /dashboard/users → naye users banao / roles change karo
   → /dashboard/analytics → stats dekho
   → /dashboard/settings → apni profile/password
   → kisi bhi content ko edit/delete kar sakta hai
```

### D) Password reset
```
/forgot-password → email daalo → token generate (DB)
   → email link /reset-password?token=xxx → naya password
   → /login?message=password-reset
```

---

## 11. File-by-File Quick Reference (Type + Kaam)

### Server Components (DB access, no hooks)
`app/layout.tsx`, `app/page.tsx`, `app/dashboard/layout.tsx`, `app/dashboard/page.tsx`, `app/dashboard/analytics/page.tsx`, saare `dashboard/*/page.tsx` (lists + new + edit wrappers), `app/blog/[slug]/page.tsx`, `components/dashboard/Header.tsx`, `components/layout/Footer.tsx`, `components/sections/Features.tsx`, `HowItWorks.tsx`, `Testimonials.tsx`, `Logos.tsx`.

### Client Components (`'use client'` — hooks/interactivity)
Saare `*Form.tsx` (BlogForm, UseCaseForm, TestimonialForm, ProfileForm, SettingsForm), `*Client.tsx` (CategoriesClient, TagsClient), `UserManagement.tsx`, `Sidebar.tsx`, `DeleteButton.tsx`, `MobileMenuButton.tsx`, auth pages (login/signup/etc.), `blog/page.tsx`, `BlogPostClient.tsx`, `contact/page.tsx`, `use-cases/*/page.tsx`, `Nav.tsx`, `Navbar.tsx`, `Hero.tsx`, `FAQ.tsx`, `CTA.tsx`, `Pricing.tsx`, `UseCases.tsx`, `Showcase.tsx`, sab `ui/*`.

### Server Actions / Route Handlers (backend)
`app/actions/auth.ts` (login/signup/logout/forgot/reset), saare `app/api/*/route.ts`.

### Core libs (mat chhedo bina samjhe)
`lib/prisma.ts`, `lib/auth.ts`, `lib/auth.config.ts`, `lib/rbac.ts`, `prisma/schema.prisma`, `proxy.ts`.

---

## 12. Learning Guide — Agar Tum Maintain Karoge

### 🥇 Sabse Pehle Kya Seekho (priority order)
1. **Server vs Client Components** — App Router ka core. Yeh samjhe bina kuch samajh nahi aayega.
2. **Prisma basics** — `findMany`, `create`, `update`, `where`, `include`. `lib/prisma.ts` + `schema.prisma` padho.
3. **NextAuth flow** — `lib/auth.ts`, `app/actions/auth.ts`, `proxy.ts` ek saath padho.
4. **RBAC** — `lib/rbac.ts` (chhoti file, badi importance).
5. **Route Handlers** — ek simple API (`api/contact/route.ts`) se start karo, fir `api/blogs/[id]/route.ts`.
6. **React hooks** — `useState`/`useEffect`/`useRouter` form components mein.

### 🌟 Sabse Important Files (project ka dil)
| File | Kyun important |
|---|---|
| `prisma/schema.prisma` | Poore data ka structure yahin se. |
| `lib/prisma.ts` | DB connection — galat hua to kuch nahi chalega. |
| `lib/auth.ts` | Login/session ka core. |
| `proxy.ts` | Route protection — galat hua to security hole. |
| `lib/rbac.ts` | Permissions — galat hua to wrong access. |
| `app/dashboard/layout.tsx` | Admin gate. |
| `app/actions/auth.ts` | Login/signup/reset logic. |

### ⚠️ Bina Samjhe MAT Chhedo (high blast-radius)
- **`prisma/schema.prisma`** — field rename/delete = data loss + saari queries toot sakti hain. Change ke baad `prisma generate` + `prisma db push` zaroori.
- **`lib/prisma.ts`** — connection logic. Galti = pura app down.
- **`lib/auth.ts` / `lib/auth.config.ts`** — dono ko sync rakhna padta hai (jwt/session callbacks). Ek badla doosra nahi = login break.
- **`proxy.ts`** — `matcher` galat = ya sab kuch khul jaayega ya sab block ho jaayega. Edge runtime mein DB import mat karna.
- **`lib/rbac.ts` `permissions` object** — yahan permission rename kiya to API ke `requirePermission('...')` strings bhi update karne padenge.
- **API response shape `{success, data/error}`** — saare client `fetch` isi shape par depend karte hain. Badla to har form todna padega.

### 🟢 Safe to Edit (kam risk)
- `lib/data.ts`, `lib/constants.ts` — marketing text/pricing (static).
- `components/sections/*` — visual sections.
- CSS / inline styles.
- `app/use-cases/*/page.tsx` — static persona pages.

### 🔧 Roz Kaam Aane Wale Commands
```bash
npm run dev          # local development
npm run build        # production build (prisma generate + next build)
npm run db:push      # schema changes ko DB par bhejo
npm run db:studio    # DB GUI (data dekho/edit karo)
npm run db:seed      # demo data daalo
```

### 🔑 Seed Login Credentials (local testing)
| Role | Email | Password |
|---|---|---|
| admin | admin@askClarant.ai | Admin@1234 |
| editor | editor@askClarant.ai | Editor@1234 |
| author | author@askClarant.ai | Author@1234 |

---

## 13. Recap — Ek Line Mein Poora Project

> **Next.js 15.5 (App Router) + MongoDB + Prisma + NextAuth** se bana ek marketing site + admin CMS. Public pages (mostly static + thoda dynamic blog) sabke liye; `/dashboard` admin panel `proxy.ts` middleware + `auth()` + RBAC ke 3 layers se protected. Server Components DB se data laate hain, Client Components forms handle karte hain aur `/api/*` route handlers ko `fetch` karte hain, jo Prisma se MongoDB par CRUD karte hain. Saari API ek consistent `{ success, data/error }` shape return karti hain.

---
*Generated as a mentoring guide. Koi specific file par aur detail chahiye to bolo — uska line-by-line breakdown kar dunga.*
