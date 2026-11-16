# 🗄️ Walkthrough 2 — Database & APIs (Real Line-by-Line)

> Files covered: `prisma/schema.prisma`, `lib/prisma.ts`, `lib/cloudinary.ts`,
> `app/api/blogs/route.ts`, `app/api/blogs/[id]/route.ts`, `app/api/contact/route.ts`,
> `app/api/upload/route.ts`, `app/api/users/route.ts`, `app/api/users/[id]/route.ts`,
> `app/api/analytics/route.ts`, `app/api/categories/[id]/route.ts`.

---

## 🗺️ Mental Model

```
Client (form) ──fetch()──► app/api/.../route.ts ──prisma──► MongoDB
                                  │
                                  ├─ requirePermission()   (security)
                                  ├─ zodSchema.safeParse()  (validation)
                                  └─ Response.json({success, data/error})
```
Har API ka **same 4-step skeleton** hota hai:
1. **Auth check** (`requirePermission` ya `auth()`)
2. **Validate** (`zodSchema.safeParse(body)`)
3. **DB operation** (`prisma.X.create/update/...`)
4. **Respond** (`Response.json({ success, data })`)

---

## 1️⃣ `prisma/schema.prisma` — Database Blueprint

```prisma
generator client {                 // line 1
  provider = "prisma-client-js"
}

datasource db {                    // line 9
  provider = "mongodb"             // line 10 — DB type
  url      = env("DATABASE_URL")   // line 11 — CLI ke liye
}
```
- **Line 1-3 `generator`:** Prisma se `@prisma/client` (TypeScript-typed DB client) generate hota hai. `npm run build` mein `prisma generate` isi se chalता hai.
- **Line 10:** Database **MongoDB** hai (SQL nahi). Iska matlab — no JOINs at DB level, no FK constraints.
- **Line 11:** `env("DATABASE_URL")` — yeh **sirf Prisma CLI** (generate/push/studio) ke liye. **Runtime** par `lib/prisma.ts` `MONGODB_URI` use karta hai (next section).

### `users` model — line 14
```prisma
model users {
  id               String    @id @default(cuid()) @map("_id")   // line 15
  name             String
  email            String    @unique                            // line 17
  password         String                                       // hashed
  role             role      @default(author)                   // line 19 — enum
  image            String?                                       // ? = optional
  bio              String?
  jobtitle         String?
  twitter          String?
  linkedin         String?
  resettoken       String?                                       // password reset
  resettokenexpiry DateTime?
  createdat        DateTime  @default(now())                     // line 28
  updatedat        DateTime  @updatedAt                          // line 29 — auto
  blogs            blog[]                                        // line 30 — 1-to-many
  usecases         usecase[]
}
```
- **Line 15:** `id String @id @default(cuid()) @map("_id")` — MongoDB documents ki ID ko `_id` kehte hain. `@map("_id")` Prisma ke `id` field ko Mongo ke `_id` se jodta hai. `cuid()` = auto random unique string.
- **Line 17 `@unique`:** Do users ka same email nahi ho sakta. `findUnique({where:{email}})` isiliye kaam karta hai.
- **Line 19 `role @default(author)`:** Naya user by default `author`.
- **Line 28-29:** `createdat` create par auto-set, `updatedat` har update par auto-refresh (`@updatedAt`).
- **Line 30 `blogs blog[]`:** **Relation** — ek user ke kai blogs. Yeh DB column nahi, Prisma ka virtual link. `include: { author: true }` isi se kaam karta.

### `blog` model — line 34
```prisma
model blog {
  id             String        @id @default(cuid()) @map("_id")
  title          String
  slug           String        @unique          // line 37 — URL identifier, unique
  excerpt        String?
  content        String                          // HTML
  coverimage     String?                         // Cloudinary URL
  ogimage        String?
  seotitle       String?
  seodescription String?
  faq            Json?                            // line 45 — [{q,a}] array
  tag            String?
  status         status        @default(draft)   // line 48
  readmin        Int           @default(5)        // read minutes
  publishedat    DateTime?                        // null jab tak publish na ho
  ...
  authorid       String                           // line 53 — FK value
  categoryid     String?                          // line 54
  author         users         @relation(fields: [authorid], references: [id])   // line 55
  category       blogcategory? @relation(fields: [categoryid], references: [id]) // line 56
  tags           blogtagmap[]                     // line 57 — many-to-many
}
```
- **Line 37 `slug @unique`:** `/blog/<slug>` URL banata hai. Unique taaki do blogs same URL na lein.
- **Line 45 `faq Json?`:** Mongo flexible hai — yahan poora `[{q,a}]` array ek hi field mein store hota.
- **Line 53-56:** Yeh **relation** ka asli mechanism. `authorid` (actual stored value) + `author` (Prisma virtual link via `@relation`). `categoryid` optional (`?`) — blog bina category ke ho sakta.
- **Line 57 `tags blogtagmap[]`:** Many-to-many via join table.

### Join table & enums — line 74+
```prisma
model blogtagmap {                              // line 74 — blog ↔ tag bridge
  id     String  @id @default(cuid()) @map("_id")
  blogid String
  tagid  String
  blog   blog    @relation(fields: [blogid], references: [id], onDelete: Cascade)  // line 78
  tag    blogtag @relation(fields: [tagid], references: [id], onDelete: Cascade)
  @@unique([blogid, tagid])                     // line 81 — duplicate pair nahi
}

enum role   { admin  editor  author }           // line 132
enum status { draft  published  archived }      // line 138
```
- **Line 78 `onDelete: Cascade`:** Blog ya tag delete hone par yeh map entries **auto-delete**. Isiliye tag delete safe hai (categories nahi — unme cascade nahi).
- **Line 81 `@@unique([blogid, tagid])`:** Ek blog par same tag do baar nahi lag sakta.
- **Line 132/138 enums:** Allowed values fix. DB level par bhi enforce.

---

## 2️⃣ `lib/prisma.ts` — Connection (Singleton)

```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }  // line 20

export const prisma =
  globalForPrisma.prisma ??                       // line 23 — reuse agar hai
  new PrismaClient({
    datasources: {
      db: { url: process.env.MONGODB_URI ?? process.env.DATABASE_URL },  // line 27
    },
    log: ['error'],                               // line 30
  })

if (process.env.NODE_ENV !== 'production') {      // line 33
  globalForPrisma.prisma = prisma
}
```
- **Line 23 `?? new PrismaClient`:** Agar `globalForPrisma.prisma` pehle se hai to use reuse karo, warna naya banao. Yeh **singleton pattern** hai.
- **Line 27:** **Runtime connection** — `MONGODB_URI` pehle (Vercel/Atlas), fir `DATABASE_URL` (local). Yeh schema ke `DATABASE_URL` ko override karta hai. So production mein sirf `MONGODB_URI` set karna kaafi.
- **Line 30 `log: ['error']`:** Sirf errors log (queries nahi — noise kam).
- **Line 33:** **Why?** Next.js dev mode files baar-baar reload karta hai. Har reload par naya `PrismaClient` = "too many connections" crash. Dev mein global par store karke reuse. Production mein har serverless instance fresh, isliye global skip.

---

## 3️⃣ Pattern A — Public GET + Protected POST (`blogs/route.ts`)

### Validation schema — line 6
```ts
const blogSchema = z.object({
  title:   z.string().min(1, 'Title is required'),   // line 7
  slug:    z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),                     // line 9 — optional
  content: z.string().min(1, 'Content is required'),
  coverimage: z.string().nullable().optional(),       // line 11 — null bhi chalega
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),  // line 15
  status: z.enum(['draft','published','archived']).default('draft'),    // line 17
  readmin: z.number().min(1).default(5),              // line 18
  categoryid: z.string().optional(),
})
```
- **Line 7:** Required field, custom error message.
- **Line 9 `.optional()`:** Field ho ya na ho, dono OK.
- **Line 11 `.nullable().optional()`:** `null`, missing, ya string — teeno OK (image clear karne ke liye `null`).
- **Line 15:** FAQ array of `{q, a}` objects.
- **Line 17-18 `.default(...)`:** Na bheja to default value.

### GET — line 23 (PUBLIC, no auth)
```ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl       // line 25
    const status = searchParams.get('status')      // ?status=published
    const tag    = searchParams.get('tag')

    const blogs = await prisma.blog.findMany({
      where: {
        ...(status ? { status: status as any } : {}),  // line 31 — conditional filter
        ...(tag    ? { tag }                   : {}),
      },
      include: {                                     // line 34 — relations laao
        author:   { select: { id: true, name: true, email: true } },  // line 35
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdat: 'desc' },                // line 38 — newest first
    })
    return Response.json({ success: true, data: blogs })  // line 41
  } catch (error) {
    console.error('[GET /api/blogs]', error)
    return Response.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
```
- **Line 25-27:** Query params se filter (`/api/blogs?status=published&tag=Engineering`).
- **Line 31 `...(status ? {status} : {})`:** ⭐ **Conditional spread** — agar `status` hai to `{status: ...}` object spread karo, warna `{}`. Yeh dynamic `where` clause banata bina if-else ke. Beginner ke liye yaad rakhne layak trick.
- **Line 34-37 `include` + `select`:** `include` relation laata hai; `select` mein sirf needed fields (poora author object nahi — password leak na ho). Yeh ek **mini-JOIN** hai jo Prisma application level par karta (Mongo mein DB JOIN nahi).
- **Line 38:** Newest blog pehle.
- **Line 41:** Standard success shape.

### POST — line 49 (PROTECTED)
```ts
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission('manage:blogs')   // line 51 — STEP 1: auth
    const body   = await request.json()                        // line 53
    const parsed = blogSchema.safeParse(body)                  // line 54 — STEP 2: validate
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })  // line 58
    }
    const d = parsed.data
    const publishedat = d.status === 'published' ? new Date() : undefined  // line 64

    const blog = await prisma.blog.create({                    // line 66 — STEP 3: DB
      data: {
        title: d.title, slug: d.slug,
        excerpt: d.excerpt || undefined,                       // line 71 — "" → undefined
        content: d.content,
        ...,
        status: d.status, readmin: d.readmin, publishedat,
        ...(d.faq && d.faq.length > 0 ? { faq: d.faq } : {}),  // line 83 — non-empty only
        author: { connect: { id: session.user.id } },          // line 86 — ⭐ relation connect
        ...(d.categoryid ? { category: { connect: { id: d.categoryid } } } : {}),  // line 89
      },
      include: { author: {...}, category: {...} },             // line 94 — created blog wapas relations ke saath
    })
    return Response.json({ success: true, data: blog }, { status: 201 })  // line 100
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return Response.json({...}, { status: 401 })  // line 103
    if (error.message === 'FORBIDDEN')    return Response.json({...}, { status: 403 })  // line 106
    return Response.json({ success: false, error: ... }, { status: 500 })
  }
}
```
- **Line 51:** `requirePermission` throw karta hai agar permission nahi → catch block 401/403 (line 103-108). Yeh hai security gate.
- **Line 64:** `publishedat` tabhi set jab status `published`. Draft mein `undefined` (DB mein null rehta).
- **Line 71 `d.excerpt || undefined`:** Empty string `""` ko `undefined` bana do (field set hi mat karo). `||` falsy values (`""`, `null`) ko `undefined` mein convert.
- **Line 83:** FAQ tabhi store jab array khali na ho.
- **Line 86 `author: { connect: { id: ... } }`:** ⭐ Relation set karne ka tarika — `authorid` directly nahi, balki `connect` se. Author = **abhi logged-in user** (`session.user.id`). Author khud decide nahi karता kiska blog hai — server decide karta (security).
- **Line 89:** Category optional — bheja to connect.
- **Line 100 `status: 201`:** 201 = "Created" (HTTP convention for successful POST).

---

## 4️⃣ Pattern B — GET/PUT/DELETE with `[id]` (`blogs/[id]/route.ts`)

### Dynamic param — line 24
```ts
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // line 26 — ⭐ params ab Promise hai!
) {
  const { id } = await params                        // line 29 — await zaroori
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { author: {...}, category: true, tags: { include: { tag: true } } },  // line 36 — nested include
  })
  if (!blog) return Response.json({ success: false, error: 'Blog not found' }, { status: 404 })  // line 41
  return Response.json({ success: true, data: blog })
}
```
- **Line 26 `params: Promise<{ id: string }>`:** ⚠️ **Next.js 15 breaking change** — `params` ab ek **Promise** hai (pehle plain object tha). `await params` karna padta hai. Yeh "not the Next.js you know" ka ek aur example.
- **Line 36 `tags: { include: { tag: true } }`:** Nested include — `blogtagmap` laao, aur har map ke andar ka `tag` bhi. Many-to-many resolve.
- **Line 41:** Na mila to 404.

### PUT — line 52 (ownership check)
```ts
const session = await requirePermission('manage:blogs')   // line 57
const { id }  = await params
const blog = await prisma.blog.findUnique({ where: { id } })  // line 60 — pehle fetch
if (!blog) return 404                                       // line 61

if (!canEdit(session.user.role as any, session.user.id, blog.authorid)) {  // line 66 — ⭐ ownership
  return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
}

const publishedat = d.status === 'published' && !blog.publishedat ? new Date() : undefined  // line 83

const updateData: Record<string, any> = {}                  // line 89 — empty object banao
if (d.title   !== undefined) updateData.title   = d.title    // line 91 — sirf bheja hua field
if (d.excerpt !== undefined) updateData.excerpt = d.excerpt || null  // line 96 — "" → null (clear)
...
if (d.categoryid !== undefined) {                            // line 104
  updateData.category = d.categoryid
    ? { connect: { id: d.categoryid } }                      // category set
    : { disconnect: true }                                   // category hata do
}
if (d.faq !== undefined) updateData.faq = d.faq.length > 0 ? d.faq : null  // line 112
if (publishedat) updateData.publishedat = publishedat        // line 115

const updated = await prisma.blog.update({ where: { id }, data: updateData, include: {...} })  // line 117
```
- **Line 66 `canEdit`:** Admin/editor koi bhi blog edit; author **sirf apna** (`session.user.id === blog.authorid`). Warna 403.
- **Line 83:** `publishedat` **sirf pehli baar** publish par set (`!blog.publishedat` = abhi tak null tha). Re-publish par original date safe rehti.
- **Line 89-115 (PATCH-style update):** ⭐ Important pattern. Khali `updateData` object banake, **sirf woh fields add karo jo request mein aaye** (`!== undefined`). Iska matlab:
  - Field bheja hi nahi → DB mein **chhua nahi** jaata (purani value safe).
  - Field empty string bheja → `|| null` se DB mein **clear** (NULL) ho jaata.
  Yeh "partial update" ko safe banata — accidentally fields wipe nahi hote.
- **Line 104-108:** Category — value ho to `connect`, khali ho to `disconnect` (relation hatao).

### DELETE — line 139 (admin only)
```ts
const session = await requirePermission('manage:blogs')     // line 144
if (session.user.role !== 'admin') {                         // line 147 — ⭐ extra admin gate
  return Response.json({ success: false, error: 'Only admins can delete' }, { status: 403 })
}
await prisma.blog.delete({ where: { id } })                  // line 151
```
- **Line 147:** `manage:blogs` to editor ke paas bhi hai, par **delete sirf admin**. Double-gate: permission + explicit role check.

---

## 5️⃣ Pattern C — Public Form Submit (`contact/route.ts`)

```ts
const contactSchema = z.object({
  name:  z.string().min(2,  'Name must be at least 2 characters'),  // line 6
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),  // line 11
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = contactSchema.safeParse(body)                 // line 17 — koi auth nahi!
  if (!parsed.success) return Response.json({...}, { status: 400 })
  const submission = await prisma.contactsubmission.create({ data: parsed.data })  // line 26
  return Response.json({ success: true, data: { id: submission.id } }, { status: 201 })  // line 30
}

export async function GET() {
  return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })  // line 41
}
```
- **No `requirePermission`:** Public endpoint — koi bhi visitor contact form bhej sakta. Sirf Zod validation security.
- **Line 26 `data: parsed.data`:** Zod ka clean output seedha Prisma ko (kyunki schema fields exactly match karte).
- **Line 30:** Sirf `id` wapas (poora record nahi — kuch leak na ho).
- **Line 41 GET → 405:** Yeh endpoint sirf POST ke liye; GET par "Method not allowed".

---

## 6️⃣ Pattern D — File Upload (`upload/route.ts` + `lib/cloudinary.ts`)

### Route — line 22
```ts
const session = await auth()                                 // line 25 — sirf login (no specific perm)
if (!session?.user) return Response.json({...}, { status: 401 })

const formData = await request.formData()                    // line 34 — JSON nahi, FormData!
const file     = formData.get('file') as File | null         // line 35
if (!file) return 400

if (!ALLOWED_MIME_TYPES.includes(file.type)) return 400      // line 45 — jpg/png/webp only
if (file.size > MAX_FILE_BYTES) return 400                   // line 53 — ≤5MB

const arrayBuffer = await file.arrayBuffer()                 // line 61 — File → bytes
const buffer      = Buffer.from(arrayBuffer)
const result = await uploadImageToCloudinary(buffer, 'atg-marketing')  // line 65
return Response.json({ success: true, url: result.url, publicId: ..., width: ..., ... })  // line 68
```
- **Line 25:** `auth()` (not `requirePermission`) — koi bhi logged-in user (author ko bhi apni cover image chahiye).
- **Line 34 `request.formData()`:** Image binary hai, JSON nahi — isliye `formData()` (not `.json()`).
- **Line 45/53:** Server-side validation — type + size. **Browser check bypass ho sakta, yeh nahi.**
- **Line 61-62:** Browser `File` → `ArrayBuffer` → Node `Buffer` (Cloudinary SDK Buffer chahta).
- **Line 68:** Cloudinary URL wapas. **Yeh URL phir blog/user API ko bheja jaata hai** jo MongoDB mein save karti. (Image Cloudinary par, sirf URL DB mein.)

### `lib/cloudinary.ts`
```ts
import 'server-only'                                          // line 17 — ⭐ build guard
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({                                           // line 22
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,                                           // line 26 — https URLs
})

export const ALLOWED_MIME_TYPES = ['image/jpeg','image/jpg','image/png','image/webp']  // line 30
export const MAX_FILE_BYTES = 5 * 1024 * 1024                 // line 32 — 5MB

export async function uploadImageToCloudinary(buffer, folder = 'atg-marketing', filename?) {  // line 53
  return new Promise((resolve, reject) => {                   // line 58 — callback → Promise
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {  // line 69
      if (error || !result) { reject(...); return }
      resolve({ url: result.secure_url, publicId: result.public_id, width, height, format, bytes })  // line 74
    })
    stream.end(buffer)                                        // line 84 — buffer ko stream mein daalo
  })
}
```
- **Line 17 `import 'server-only'`:** ⭐ Agar yeh file galti se kisi `'use client'` component mein import ho, to **build fail** ho jaayega. Cloudinary Node-only APIs (crypto/https) use karta jo browser mein nahi. Yeh galti ko jaldi pakadta. (Yeh `next.config.mjs` ke `serverExternalPackages: ['cloudinary']` se bhi judta.)
- **Line 58-84 `new Promise`:** Cloudinary ka `upload_stream` purana **callback** style use karta. Ise `Promise` mein wrap kiya taaki `await` kar sakein. Beginner ke liye: yeh "callback ko async/await mein convert karne" ka classic pattern hai.
- **Line 74 `secure_url`:** Hamesha `https://` URL.

---

## 7️⃣ Pattern E — Admin-Only + Password Hashing (`users/route.ts`)

```ts
const createUserSchema = z.object({
  name: z.string().min(1), email: z.string().email(),
  password: z.string().min(8),                                // line 10
  role: z.enum(['admin','editor','author']).default('author'),// line 11
})

export async function GET() {
  await requirePermission('manage:users')                     // line 17 — admin only
  const users = await prisma.users.findMany({
    select: {                                                 // line 20 — ⭐ password NAHI
      id: true, name: true, email: true, role: true, image: true, createdat: true,
      _count: { select: { blogs: true, usecases: true } },    // line 27 — count relations
    },
    orderBy: { createdat: 'desc' },
  })
  return Response.json({ success: true, data: users })
}

export async function POST(request) {
  await requirePermission('manage:users')                     // line 49
  const parsed = createUserSchema.safeParse(body)
  const { name, email, password, role } = parsed.data
  const existing = await prisma.users.findUnique({ where: { email } })  // line 63
  if (existing) return Response.json({...}, { status: 409 })  // line 65 — email taken
  const hashedPassword = await bcrypt.hash(password, 12)       // line 69 — ⭐ hash
  const user = await prisma.users.create({
    data: { name, email, password: hashedPassword, role },     // line 72
    select: { id: true, name: true, email: true, role: true, createdat: true },  // password wapas nahi
  })
  return Response.json({ success: true, data: user }, { status: 201 })
}
```
- **Line 20 `select` (no password):** ⭐ **Security** — `select` se sirf safe fields. Agar `select` na hota to `findMany` poora record (including hashed password) return kar deta. Hashed bhi expose karna bad practice.
- **Line 27 `_count`:** Har user ke kitne blogs/usecases — extra query bina. Dashboard mein "5 blogs" dikhane ke liye.
- **Line 63-65:** Email already exists? 409 Conflict.
- **Line 69:** Password hash (cost 12) — plain kabhi store nahi.
- **Line 72:** Admin yahan **koi bhi role** assign kar sakta (signup ke `author`-only se alag).

---

## 8️⃣ MongoDB FK Guards — Manual Checks (`users/[id]` & `categories/[id]`)

> ⚠️ MongoDB mein SQL ki FK constraints nahi. SQL khud roक deta "is user ke blogs hain, delete mat karo". Mongo nahi rokta — **code ko manually check karna padta**.

### User delete — `users/[id]/route.ts` line 93
```ts
const session = await requirePermission('manage:users')      // line 98
const { id } = await params
if (session.user.id === id) {                                 // line 102 — ⭐ self-delete roko
  return Response.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 })
}
const [blogCount, usecaseCount] = await Promise.all([         // line 107 — parallel count
  prisma.blog.count({ where: { authorid: id } }),
  prisma.usecase.count({ where: { authorid: id } }),
])
if (blogCount > 0 || usecaseCount > 0) {                      // line 111 — content hai?
  return Response.json({ success: false, error: 'Cannot delete — ... Reassign their content first.' }, { status: 409 })
}
await prisma.users.delete({ where: { id } })                  // line 121
```
- **Line 102:** Admin khud ko delete na kar de (lock-out se bachao).
- **Line 107-111:** ⭐ Manual FK guard — pehle blogs/usecases count karo (parallel `Promise.all` se fast). Content hai to 409 (warna orphan blogs reh jaate jinka author hi nahi).

### Category delete — `categories/[id]/route.ts` line 48
```ts
if (session.user.role !== 'admin') return 403                 // line 56 — admin only
const assignedCount = await prisma.blog.count({ where: { categoryid: id } })  // line 61
if (assignedCount > 0) return Response.json({ ... 'still assigned to one or more blogs.' }, { status: 409 })  // line 62
await prisma.blogcategory.delete({ where: { id } })           // line 69
```
- Same manual-FK idea. Category kisi blog par lagi hai to delete block.
- **Contrast:** Tags delete safe hain bina is check ke — kyunki `blogtagmap` par `onDelete: Cascade` hai (schema auto-cleanup karta). Category par cascade nahi, isliye manual.

### Category PUT — line 12
```ts
await requirePermission('manage:blogs')                       // line 17 — editor bhi allowed (delete admin-only)
const category = await prisma.blogcategory.update({ where: { id }, data: parsed.data })  // line 29
```

---

## 9️⃣ Pattern F — Read-Only Aggregation (`analytics/route.ts`)

```ts
await requirePermission('view:analytics')                     // line 7 — admin/editor
const [ totalblogs, totalusecases, ..., recentblogs, recentusecases ] = await Promise.all([  // line 10-21
  prisma.blog.count(),                                        // line 22
  prisma.usecase.count(),
  prisma.testimonial.count(),
  prisma.users.count({ where: { role: 'author' } }),          // line 25
  prisma.blog.count({ where: { status: 'published' } }),
  ...,
  prisma.blog.findMany({                                      // line 32 — last 6 months
    where: { createdat: { gte: new Date(Date.now() - 180*24*60*60*1000) } },  // line 35
    select: { createdat: true, status: true },
    orderBy: { createdat: 'asc' },
  }),
  prisma.usecase.findMany({ ... }),
])
const monthlyActivity = buildMonthlyData([...recentblogs, ...recentusecases])  // line 55
return Response.json({ success: true, data: { stats: {...}, charts: { publishedVsDraft, monthlyActivity } } })  // line 57
```
- **Line 10-21 `Promise.all` of 10 queries:** ⭐ **Saari queries ek saath** (parallel) — 10 sequential queries se kahin fast. Yeh performance ka key pattern.
- **Line 25:** `count` with `where` — sirf authors gino.
- **Line 35 `gte: new Date(Date.now() - 180*...)`:** Last 180 days (~6 months). `gte` = greater-than-or-equal.

### `buildMonthlyData` helper — line 86
```ts
function buildMonthlyData(items: { createdat: Date }[]) {
  const months: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {                              // line 90 — last 6 months pre-fill
    const d = new Date(); d.setMonth(d.getMonth() - i)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })  // "Jun 26"
    months[key] = 0                                           // line 94 — 0 se start
  }
  for (const item of items) {                                 // line 98 — count
    const key = new Date(item.createdat).toLocaleString('default', { month: 'short', year: '2-digit' })
    if (key in months) months[key]++                         // line 103
  }
  return Object.entries(months).map(([month, count]) => ({ month, count }))  // line 108
}
```
- **Input:** array of `{createdat}`. **Output:** `[{month:'Jan 26', count:3}, ...]`.
- **Line 90-94:** Pehle last 6 months ko **0 se pre-fill** (taaki khali month bhi chart mein dikhe, gap na ho).
- **Line 98-103:** Phir har item ko uske month bucket mein count karo.
- **Why:** Frontend bar-chart ke liye clean, gap-free monthly data.

---

## 🔟 API Quick-Reference (Sab Routes)

| Endpoint | Methods | Auth | Key DB op |
|---|---|---|---|
| `/api/blogs` | GET (public), POST | POST: `manage:blogs` | findMany / create+connect |
| `/api/blogs/[id]` | GET, PUT, DELETE | PUT: +`canEdit`; DELETE: admin | findUnique / update / delete |
| `/api/use-cases(+/[id])` | same as blogs | same | usecase.* |
| `/api/categories(+/[id])` | GET/POST, PUT/DELETE | `manage:blogs`; DELETE admin+FK | blogcategory.* |
| `/api/tags(+/[id])` | GET/POST, PUT/DELETE | `manage:blogs`; DELETE admin (cascade) | blogtag.* |
| `/api/testimonials(+/[id])` | GET (public), POST/PUT/DELETE | `manage:testimonials` | testimonial.* |
| `/api/users(+/[id])` | GET/POST, PUT/DELETE | `manage:users` (admin) | users.* + hash + FK guard |
| `/api/users/profile` | GET, PATCH | `auth()` (self) | users.update (own) |
| `/api/contact` | POST (public), GET→405 | none | contactsubmission.create |
| `/api/upload` | POST | `auth()` | Cloudinary (no DB) |
| `/api/analytics` | GET | `view:analytics` | 10× parallel count/findMany |

---

## ⚠️ This Layer's Gotchas
1. **`params` is a Promise** (Next 15) → always `await params`.
2. **MongoDB has no FK** → delete guards are manual (`count` then block). Forget one = orphaned data.
3. **Relations use `connect`/`disconnect`**, not raw `authorid =`.
4. **`select` excludes password** → never remove it from users queries.
5. **PATCH-style update** (`if (x !== undefined)`) → preserves untouched fields; changing this can wipe data.
6. **Response shape `{success, data/error}`** is the contract every client depends on.

---
*Next doc: `walkthrough-03-dashboard-cms.md` — server pages + client forms (BlogForm, UseCaseForm, inline CRUD) line-by-line.*
