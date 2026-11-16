# 🖥️ Walkthrough 3 — Dashboard / CMS (Real Line-by-Line)

> Files covered: `app/dashboard/blogs/page.tsx` (server list), `new/page.tsx`, `[id]/edit/page.tsx`,
> `app/dashboard/blogs/BlogForm.tsx` (big client form), `app/dashboard/categories/page.tsx` (guard) +
> `CategoriesClient.tsx` (inline CRUD), `components/dashboard/Sidebar.tsx`, `DeleteButton.tsx`.

---

## 🗺️ The Core Pattern (yeh ek baar samjho, sab dashboard pages same)

```
[Server Component page.tsx]                    [Client Component]
   auth() / role guard                            'use client'
   prisma.X.findMany()        ──props──►          useState/useRef
   render <SomeClient data /> ◄────────           fetch('/api/...')
                                                   router.refresh()
```

3 tarah ke files har resource mein:
1. **`page.tsx` (list)** — Server. DB se data, table render.
2. **`new/page.tsx` + `[id]/edit/page.tsx`** — Server wrappers. Form ko initial data dete hain.
3. **`*Form.tsx` / `*Client.tsx`** — Client. Interactivity + API calls.

---

## 1️⃣ `app/dashboard/blogs/page.tsx` — Server List (Role-Aware)

```tsx
import { prisma } from '@/lib/prisma'                    // line 1 — DB direct (Server Component!)
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/Header'
import DeleteButton from '@/components/dashboard/DeleteButton'

export default async function BlogsPage() {              // line 7 — async Server Component
  const session = await auth()                           // line 8

  const blogs = await prisma.blog.findMany({             // line 10 — ⭐ direct DB, no fetch
    where: session?.user?.role === 'author'              // line 11 — ⭐ role-based filter
      ? { authorid: session.user.id }                    //   author → sirf apne blogs
      : {},                                              //   admin/editor → sab
    include: {
      author:   { select: { id: true, name: true } },
      category: { select: { name: true } },
    },
    orderBy: { updatedat: 'desc' },                      // line 18
  })

  const isAdmin = session?.user?.role === 'admin'        // line 21
```
- **Line 7 `async function`:** Server Component **async** ho sakta — directly `await` kar sakte. (Client Component async nahi ho sakta.)
- **Line 10:** ⭐ **Koi `fetch('/api/blogs')` nahi!** Server Component seedha Prisma call karta. API tabhi chahiye jab **client** (browser) ko data chahiye. Yahan sab server par hai = fast (ek hi server trip).
- **Line 11-13:** ⭐ **Row-level security in the query.** Author hai to `where: { authorid: session.user.id }` (sirf apne). Admin/editor `{}` (sab). Yeh `lib/rbac.ts` ke `canEdit` ka list-version.
- **Line 21 `isAdmin`:** Aage delete button conditionally dikhane ke liye.

### Render — table + mobile cards + conditional delete
```tsx
<DashboardHeader title="Blogs" description={`${blogs.length} post${blogs.length !== 1 ? 's' : ''} total`} />  // line 25

{blogs.length === 0 ? (<div className="empty-box">No blogs yet...</div>) : (  // line 39 — empty state
  <>
    <div className="data-table-wrap table-desktop"><table>             // line 49 — desktop table
      {blogs.map((blog) => (
        <tr key={blog.id}>
          <td>{blog.title} /{blog.slug}</td>
          <td>{blog.author.name}</td>
          <td>{blog.category?.name ?? '—'}</td>                          // line 69 — optional chaining
          <td><span className={`status-badge status-${blog.status.toLowerCase()}`}>{blog.status}</span></td>  // line 71
          <td>{new Date(blog.updatedat).toLocaleDateString()}</td>
          <td>
            <Link href={`/dashboard/blogs/${blog.id}/edit`}>Edit</Link>  // line 78
            <Link href={`/blog/${blog.slug}`} target="_blank">View</Link>// line 81 — public page
            {isAdmin && <DeleteButton id={blog.id} apiPath="blogs" />}   // line 84 — ⭐ admin only
          </td>
        </tr>
      ))}
    </table></div>
    <div className="card-list table-mobile">...</div>                    // line 96 — mobile (CSS toggles)
  </>
)}
```
- **Line 25:** `post` vs `posts` — chhota pluralization detail.
- **Line 39:** Empty state — agar koi blog nahi.
- **Line 69 `blog.category?.name ?? '—'`:** Category optional — `?.` (na ho to undefined) + `?? '—'` (dash dikhao).
- **Line 71:** Status ka CSS class dynamic — `status-published`/`status-draft` (color badge).
- **Line 78 vs 81:** Edit → CMS edit page; View → **public** blog page (`/blog/slug`, naye tab mein).
- **Line 84:** ⭐ DeleteButton **sirf admin ko**. (API bhi check karti — yeh sirf UI hide; asli enforcement server par.)
- **Line 49 vs 96:** Same data, do layout — desktop `<table>`, mobile cards. CSS `@media (max-width:768px)` ek ko hide karta. **Responsive without JS.**

---

## 2️⃣ Server Wrappers — `new` & `edit` pages

### `new/page.tsx` — line 5
```tsx
export default async function NewBlogPage() {
  const categories = await prisma.blogcategory.findMany({ orderBy: { name: 'asc' } })  // line 7
  return (<><DashboardHeader title="New Blog" .../>
    <BlogForm categories={categories} /></>)             // line 15 — NO initialData → "create" mode
}
```
- **Line 7:** Sirf categories laao (dropdown ke liye). Form khaali.
- **Line 15:** `BlogForm` ko `initialData` **nahi** diya → form "create" mode mein.

### `[id]/edit/page.tsx` — line 6
```tsx
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {  // line 6
  const { id } = await params                            // line 11 — await (Next 15)
  const [blog, categories] = await Promise.all([         // line 13 — ⭐ parallel
    prisma.blog.findUnique({ where: { id } }),
    prisma.blogcategory.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!blog) notFound()                                  // line 18 — 404 page

  const faq = Array.isArray(blog.faq)                    // line 21 — Json → typed array
    ? (blog.faq as Array<{ q: string; a: string }>) : null

  return (<><DashboardHeader title="Edit Blog" description={blog.title} />
    <BlogForm initialData={{ id: blog.id, title: blog.title, ... faq, ... }} categories={categories} />  // line 29
  </>)
}
```
- **Line 13 `Promise.all`:** Blog + categories ek saath fetch (parallel = fast).
- **Line 18 `notFound()`:** Blog na mile to Next.js ka 404 page. (Throw karta — aage code nahi chalता.)
- **Line 21:** `faq` Prisma mein `Json?` type hai (kuch bhi ho sakta). Array hai to cast karo, warna `null`. TypeScript ko exact shape batane ke liye.
- **Line 29:** Ab `initialData` **diya** → form "edit" mode. Same `BlogForm`, dono kaam karta.

---

## 3️⃣ `BlogForm.tsx` — The Big Client Form (⭐ Sabse Important)

### Setup — line 37
```tsx
'use client'                                             // line 1 — interactivity chahiye
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogForm({ initialData, categories }: BlogFormProps) {  // line 37
  const router = useRouter()                             // line 38 — navigation
  const isEditing = !!initialData                        // line 39 — ⭐ create vs edit flag

  const [loading, setLoading] = useState(false)          // line 41
  const [error, setError] = useState('')

  // Cover image — 4 state + 1 ref
  const [coverImage, setCoverImage] = useState(initialData?.coverimage || '')    // line 45 — saved URL
  const [coverPreview, setCoverPreview] = useState(initialData?.coverimage || '')// line 46 — dikhne wala
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)        // line 49 — hidden file input

  // OG image — same 5 cheezein (line 52-56)
  const [faqItems, setFaqItems] = useState<FaqItem[]>(initialData?.faq || [])    // line 59
```
- **Line 39 `isEditing = !!initialData`:** ⭐ Ek hi form do kaam karta. `initialData` hai = edit; nahi = create. `!!` value ko boolean banata.
- **Line 45-46:** Do alag state — `coverImage` (asli saved URL jo API ko jaayega) vs `coverPreview` (jo screen par dikhता — temporary blob ya saved URL). Separation important hai (next section).
- **Line 49 `coverRef`:** Hidden `<input type="file">` ka reference. Custom dropzone click karne par programmatically file picker kholte (`coverRef.current.click()`).
- **Line 59 `faqItems`:** FAQ ek **array state** — dynamic add/remove.

### Slug auto-generate — line 62
```tsx
function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')  // line 63
}
```
- **Input:** "RAG isn't Dead!" → **Output:** "rag-isn-t-dead".
- `.toLowerCase()` → lowercase. `.replace(/[^a-z0-9]+/g, '-')` → non-letters/numbers ko `-`. `.replace(/^-|-$/g, '')` → start/end ke `-` hatao.
- **Use (line 179):** Title type karte waqt (sirf create mode mein) slug auto-fill.

### Image upload — line 69 (⭐ blob preview pattern)
```tsx
async function uploadImage(file, setPreview, setSaved, setUploading, setErr, current) {
  const tempUrl = URL.createObjectURL(file)              // line 77 — ⭐ instant local preview
  setPreview(tempUrl)                                    // line 78 — turant dikhao (bina wait)
  setUploading(true)
  try {
    const fd = new FormData(); fd.append('file', file)   // line 82-83
    const res = await fetch('/api/upload', { method: 'POST', body: fd })  // line 84 — ⭐ no Content-Type!
    if (!res.ok && res.status >= 500) { setErr('...'); setPreview(current); return }  // line 85
    const data = await res.json()
    if (!data.success) { setErr(data.error); setPreview(current); return }  // line 91 — fail → revert
    setSaved(data.url)                                   // line 96 — Cloudinary URL save
    setPreview(data.url)                                 // line 97 — preview ko real URL se replace
  } catch { setErr('...'); setPreview(current) }          // line 98 — network fail → revert
  finally {
    setUploading(false)
    URL.revokeObjectURL(tempUrl)                         // line 104 — ⭐ memory leak roko
  }
}
```
- **Line 77-78:** ⭐ **Optimistic preview.** `URL.createObjectURL(file)` browser mein ek temporary local URL banata — image **turant** dikhती hai bina server wait kiye. Achhi UX.
- **Line 84:** ⚠️ **`Content-Type` header NAHI set kiya.** FormData ke saath browser khud `multipart/form-data` boundary set karta. Agar manually `application/json` set karo to upload tootega. (JSON wale fetches mein header set karte — yahan nahi.)
- **Line 85/91/98:** Teen failure paths — server error, API error, network error. Sab mein `setPreview(current)` se **purani image wapas** (revert).
- **Line 96-97:** Success — Cloudinary URL ko `coverImage` (save) aur `coverPreview` (display) dono mein daal do. Ab blob ki zaroorat nahi.
- **Line 104 `URL.revokeObjectURL`:** ⭐ Blob URL browser memory leta. `finally` mein revoke karo (chahe success ho ya fail) — memory leak prevention. Beginner aksar bhool jaate.

### FAQ array helpers — line 109
```tsx
function addFaq() { setFaqItems([...faqItems, { q: '', a: '' }]) }              // line 109 — naya item
function removeFaq(i) { setFaqItems(faqItems.filter((_, idx) => idx !== i)) }   // line 110 — index hatao
function updateFaq(i, field, value) {                                          // line 111
  const copy = [...faqItems]                             // line 112 — ⭐ copy (immutable)
  copy[i] = { ...copy[i], [field]: value }               // line 113 — ek field update
  setFaqItems(copy)
}
```
- ⭐ **React immutability rule:** State ko directly mutate nahi karte (`faqItems[i].q = x` ❌). Pehle copy (`[...faqItems]`), copy badlo, phir `setFaqItems`. Warna React re-render nahi karta.
- **Line 113 `[field]: value`:** Computed property — `field` `'q'` ya `'a'` ho sakta, dynamic key update.

### Submit — line 117 (⭐ create/edit unified)
```tsx
async function handleSubmit(e) {
  e.preventDefault()                                     // line 118
  setError(''); setLoading(true)
  const fd = new FormData(e.currentTarget)               // line 122

  const text = (name) => (fd.get(name) as string | null) || undefined  // line 125 — "" → undefined

  const body = {
    title: text('title')!,                               // line 128 — ! = "definitely not null"
    slug: text('slug')!,
    excerpt: text('excerpt'),
    content: text('content')!,
    coverimage: coverImage || null,                      // line 132 — state se (form se nahi)
    ogimage: ogImage || null,
    faq: faqItems.filter(f => f.q.trim().length > 0),     // line 137 — khali FAQ skip
    tag: text('tag'),
    status: text('status')!,
    readmin: Number(fd.get('readmin')) || 5,             // line 140 — string → number
    categoryid: text('categoryid'),
  }

  const url    = isEditing ? `/api/blogs/${initialData.id}` : '/api/blogs'  // line 144 — ⭐
  const method = isEditing ? 'PUT' : 'POST'              // line 145 — ⭐

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },   // line 148 — JSON → header chahiye
      body: JSON.stringify(body),
    })
    if (!res.ok && res.status >= 500) { setError('Server error...'); setLoading(false); return }  // line 150
    const data = await res.json()
    if (!data.success) { setError(data.error); setLoading(false); return }  // line 158
    router.push('/dashboard/blogs')                      // line 159 — list par wapas
    router.refresh()                                     // line 160 — ⭐ server data re-fetch
  } catch { setError('Network error...'); setLoading(false) }  // line 161
}
```
- **Line 122 `FormData(e.currentTarget)`:** Form ke saare `name="..."` inputs auto-collect.
- **Line 125 `text` helper:** Empty string ko `undefined`. (Image/FAQ state-driven hain, form se nahi — kyunki woh complex UI hain.)
- **Line 128 `!` (non-null assertion):** TypeScript ko bata rahe "yeh definitely hai" (kyunki `required` input). Runtime check nahi, sirf type-level.
- **Line 132:** ⭐ Images **state se** aate (`coverImage`), form fields se nahi. Kyunki upload alag flow hai.
- **Line 137:** Sirf woh FAQ jinka question bhara hai (khali rows skip).
- **Line 144-145:** ⭐ **Yahi hai create/edit ka jaadu.** `isEditing` → `PUT /api/blogs/[id]`; warna `POST /api/blogs`. Ek hi function dono.
- **Line 148:** JSON body ke liye `Content-Type: application/json` **chahiye** (upload ke ulta).
- **Line 150 vs 158:** Server crash (5xx) → generic message; API logical fail (`!success`) → `data.error` (Zod/permission message).
- **Line 159-160:** ⭐ **`push` + `refresh` combo.** `push` list par le jaata, `refresh` **Server Component ko dobara chalata** taaki naya blog list mein dikhe (warna stale cached list dikhती). Yeh App Router mein bahut important pattern.

### JSX highlights
```tsx
<input id="title" name="title" defaultValue={initialData?.title}      // line 177 — uncontrolled
  onChange={e => { if (!isEditing) { ... s.value = generateSlug(e.target.value) } }} />  // line 179
...
<button type="submit" disabled={loading || coverUploading || ogUploading}>  // line 217 — ⭐ multi-guard
  {loading ? 'Saving…' : isEditing ? 'Update' : 'Publish'}            // line 218
</button>
...
{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}  // line 286
```
- **Line 177 `defaultValue` (not `value`):** ⭐ **Uncontrolled input** — React initial value set karta phir browser sambhalता. `FormData` se padhते hain. (`value` + `onChange` = "controlled" — yahan zaroori nahi, isliye simpler `defaultValue`.)
- **Line 179:** Sirf **create mode** mein title→slug auto. Edit mode mein slug chhedte nahi (URL stable rahe).
- **Line 217:** Button disabled jab **koi bhi** kaam chal raha (save ya image upload). Half-uploaded image ke saath save na ho.
- **Line 218:** Button text 3 states: "Saving…" / "Update" / "Publish".

### `ImageUploadCard` sub-component — line 337
```tsx
function ImageUploadCard({ title, hint, preview, uploading, fileRef, onSelect, onRemove }) {
  return (<div className="form-card">
    {preview ? (<div className="image-preview-wrap"><img src={preview} />{uploading && <badge>Uploading…</badge>}<button onClick={onRemove}>✕ Remove</button></div>)  // line 354
      : (<div className="image-dropzone" onClick={() => fileRef.current?.click()}>Click to upload</div>)}  // line 361 — hidden input trigger
    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}     // line 370 — hidden!
      onChange={e => { const f = e.target.files?.[0]; if (f) onSelect(f) }} />        // line 371
  </div>)
}
```
- **Line 361 + 370:** ⭐ **Custom file upload UI** — asli `<input type="file">` `display:none` hai (ugly default button hide). Pretty dropzone click → `fileRef.current.click()` → hidden input khulta. Common React pattern.
- **Line 354:** Preview hai to image + remove; nahi to dropzone. Cover aur OG dono yeh reuse karte (DRY).

---

## 4️⃣ `categories/page.tsx` + `CategoriesClient.tsx` — Inline CRUD

### Guard (server) — line 8
```tsx
export default async function CategoriesPage() {
  const session = await auth()
  const role = session?.user?.role as UserRole | undefined
  if (role !== 'admin' && role !== 'editor') redirect('/dashboard')  // line 12 — ⭐ author kicked
  return (<><PageHeader .../>
    <CategoriesClient canDelete={role === 'admin'} /></>)            // line 19 — ⭐ delete prop
}
```
- **Line 12:** Author categories nahi dekh sakta → `/dashboard` redirect. (Sidebar bhi nahi dikhata, par yeh server-side enforcement.)
- **Line 19 `canDelete={role === 'admin'}`:** Editor categories edit kar sakta par **delete nahi** (admin only). Yeh boolean client ko prop.

### Client CRUD — `CategoriesClient.tsx`
```tsx
'use client'
export default function CategoriesClient({ canDelete }) {
  const [categories, setCategories] = useState<Category[]>([])     // line 13 — list
  const [name, setName] = useState(''); const [slug, setSlug] = useState('')  // line 14-15
  const slugTouched = useRef(false)                                // line 18 — ⭐ flag (no re-render)
  const [editingId, setEditingId] = useState<string | null>(null) // line 21 — kaunsa row edit mein

  useEffect(() => {                                                // line 26 — ⭐ mount par load
    fetch('/api/categories').then(r => r.json())
      .then(d => d.success && setCategories(d.data))
      .catch(() => setError('Failed to load categories'))
  }, [])                                                           // [] = sirf ek baar
```
- **Line 13:** Yeh **Client Component** hai — isliye DB direct nahi kar sakta, `fetch` se API call karta (server pages ke ulta).
- **Line 18 `slugTouched = useRef(false)`:** ⭐ **`useRef` for a flag.** User ne slug manually chheda? Track karne ke liye. `useRef` use kiya `useState` nahi — kyunki ye flag UI re-render trigger nahi karna chahiye (sirf yaad rakhna hai).
- **Line 26-31 `useEffect` with `[]`:** Mount par ek baar `/api/categories` GET. `[]` (empty deps) = sirf pehli render. Yeh **client-side data fetching** ka classic pattern (server page se alag).

### Slug touch logic — line 37
```tsx
function handleNameChange(value) {
  setName(value)
  if (!slugTouched.current) setSlug(generateSlug(value))  // line 39 — auto, jab tak user na chhede
}
function handleSlugChange(value) {
  slugTouched.current = true                              // line 43 — ⭐ ab manual mode
  setSlug(value)
}
```
- **Line 39:** Naam type karo → slug auto. Par...
- **Line 43:** ...slug ko manually chhua, to `slugTouched=true`, aur ab naam badalne par slug auto-update **band** (user ki manual value respect).

### Create — line 47 (⭐ optimistic local update)
```tsx
async function handleCreate(e) {
  e.preventDefault(); setError(''); setLoading(true)
  try {
    const res = await fetch('/api/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),               // line 55
    })
    if (!res.ok && res.status >= 500) { setError('Server error'); return }
    const data = await res.json()
    if (!data.success) { setError(data.error); return }
    setCategories(prev => [...prev, data.data])           // line 66 — ⭐ list mein add (no re-fetch)
    setName(''); setSlug(''); slugTouched.current = false // line 67-69 — form reset
  } catch { setError('Network error') }
  finally { setLoading(false) }
}
```
- **Line 66:** ⭐ Server `router.refresh()` ke bajaye, **API se aaya naya category seedha local state mein add.** Faster — poori list dobara nahi mangwani padti. (Yeh "client-managed list" pattern, server pages ke `router.refresh` se alag.)
- **Line 67-69:** Form clear + `slugTouched` reset (agle category ke liye fresh).

### Inline edit — line 89 & 102
```tsx
async function saveEdit(id) {
  const res = await fetch(`/api/categories/${id}`, { method: 'PUT', ..., body: JSON.stringify({ name: editName, slug: editSlug }) })  // line 92
  const data = await res.json()
  if (!data.success) { alert(data.error); return }
  setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data.data } : c))  // line 102 — ⭐ ek row update
  cancelEdit()
}
async function handleDelete(id, catName) {
  if (!confirm(`Delete "${catName}"?...`)) return         // line 112 — browser confirm
  const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!data.success) { alert(data.error); return }        // line 116 — FK guard error yahan dikhता
  setCategories(prev => prev.filter(c => c.id !== id))     // line 120 — list se hatao
}
```
- **Line 102 `.map(... ? {...c, ...data.data} : c)`:** Sirf matching row ko naye data se replace, baaki same. Immutable update.
- **Line 112 `confirm()`:** Simple browser confirm. (DeleteButton component zyada polished 2-step UI use karta — niche.)
- **Line 116:** Agar category kisi blog par lagi hai, API 409 + error bhejti — `alert` mein dikhता ("still assigned to one or more blogs"). MongoDB FK guard ka user-facing result.
- **Line 120:** Success → list se filter out.

### Render — inline edit toggle — line 176
```tsx
{editingId === cat.id ? (                                // line 176 — edit mode row
  <><td><input value={editName} onChange={...} /></td>...<button onClick={() => saveEdit(cat.id)}>Save</button></>
) : (                                                     // line 197 — normal row
  <><td>{cat.name}</td>...<button onClick={() => startEdit(cat)}>Edit</button>
    {canDelete && <button onClick={() => handleDelete(cat.id, cat.name)}>Delete</button>}</>  // line 204
)}
```
- **Line 176:** Same row, do roop — `editingId` match kare to inputs (edit), warna text (view). Click "Edit" → `setEditingId(cat.id)` → row inputs ban jaata. **Inline editing** pattern.
- **Line 204:** Delete button **sirf `canDelete`** (admin) — server se aaya prop.

---

## 5️⃣ `DeleteButton.tsx` — 2-Step Confirm

```tsx
'use client'
export default function DeleteButton({ id, apiPath }) {  // line 11 — apiPath: 'blogs'|'use-cases'|...
  const [confirming, setConfirming] = useState(false)    // line 12
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const res = await fetch(`/api/${apiPath}/${id}`, { method: 'DELETE' })  // line 19 — ⭐ generic
    const json = await res.json()
    if (json.success) { router.refresh() }               // line 22 — server list re-fetch
    else { alert(json.error || 'Delete failed'); setConfirming(false) }
  }

  if (confirming) return (<><button onClick={handleDelete}>{loading ? '…' : 'Confirm'}</button>  // line 35
    <button onClick={() => setConfirming(false)}>Cancel</button></>)
  return <button onClick={() => setConfirming(true)}>Delete</button>  // line 84
}
```
- **Line 11 `apiPath` prop:** ⭐ **Reusable** — `<DeleteButton id apiPath="blogs" />` ya `"use-cases"` ya `"testimonials"`. Ek component sab resources delete karta.
- **Line 19:** Dynamic URL `/api/${apiPath}/${id}`.
- **Line 22 `router.refresh()`:** Yeh server-rendered list ke saath use hota (CategoriesClient ke `setCategories` filter se alag). DeleteButton server `page.tsx` (blogs/use-cases) mein use hota jahan list server se aati — isliye `refresh` se server data dobara aata.
- **Line 35 vs 84:** ⭐ **2-step confirm without a modal.** Pehli click → "Confirm/Cancel" dikhao (`confirming=true`). Confirm click → actual delete. Accidental delete se bachao, bina popup library.

---

## 6️⃣ `Sidebar.tsx` — Role-Filtered Nav (⭐ useMemo + useEffect ×3)

```tsx
'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { logout } from '@/app/actions/auth'

const navItems: NavItem[] = [                            // line 21 — config array
  { href: '/dashboard', exact: true, label: 'Overview', icon: <svg.../> },
  { href: '/dashboard/blogs', label: 'Blogs', icon: ... },
  { href: '/dashboard/testimonials', label: 'Testimonials', roles: ['admin','editor'], icon: ... },  // line 60
  { href: '/dashboard/users', label: 'Users', roles: ['admin'], icon: ... },  // line 92
  ...
]

export default function Sidebar({ role }) {              // line 142 — role prop (layout se)
  const pathname = usePathname()                         // line 143 — current URL
  const [isOpen, setIsOpen] = useState(false)            // line 144 — mobile drawer

  const visibleItems = useMemo(() => {                   // line 147 — ⭐ role filter
    return navItems.filter(item => {
      if (!item.roles) return true                       // line 149 — sab ke liye
      if (!role) return false
      return item.roles.includes(role)                   // line 151 — role match?
    })
  }, [role])                                             // line 153 — role badle tabhi recompute
```
- **Line 21 `navItems`:** Config-driven nav. Har item mein optional `roles` array.
- **Line 60/92:** "Testimonials" sirf admin/editor; "Users" sirf admin. Author ko yeh links dikhte hi nahi.
- **Line 147-153 `useMemo`:** ⭐ Role ke hisaab se nav filter. `useMemo` taaki har render par filter na ho — sirf `role` badle to. (Perf optimization; yahan list chhoti hai par achhi habit.)
- **Line 149-151:** No `roles` = sabko dikhao; warna user ka role list mein hai to dikhao.

### Three `useEffect`s — line 156, 161, 168
```tsx
useEffect(() => { setIsOpen(false) }, [pathname])        // line 156 — ⭐ route change → drawer band
useEffect(() => {                                        // line 161 — ⭐ hamburger event sun
  const toggle = () => setIsOpen(prev => !prev)
  window.addEventListener('sidebar-toggle', toggle)
  return () => window.removeEventListener('sidebar-toggle', toggle)  // cleanup
}, [])
useEffect(() => {                                        // line 168 — ⭐ body scroll lock
  document.body.style.overflow = isOpen ? 'hidden' : ''
  return () => { document.body.style.overflow = '' }
}, [isOpen])
```
- **Line 156:** Page change hua → mobile drawer auto-close. Deps `[pathname]` — URL badalne par chale.
- **Line 161:** `MobileMenuButton` (header) `window.dispatchEvent('sidebar-toggle')` karta; Sidebar yahan **sunता** hai. ⭐ **Cross-component communication via custom events** (props/context ke bina). Cleanup function (`removeEventListener`) zaroori — leak roko.
- **Line 168:** Drawer khula to background scroll lock (`overflow:hidden`). Mobile UX. Deps `[isOpen]`.

### Logout — line 224
```tsx
<form action={logout}>                                   // line 224 — ⭐ server action as form action
  <button type="submit" className="sidebar-logout">Log out</button>
</form>
```
- **Line 224:** ⭐ Form ka `action={logout}` directly **server action**. Click → `logout()` server par → `signOut` → `/login`. Koi `onClick`/`fetch` nahi — Next.js form+action ka native flow.

### Active link — line 173
```tsx
function isActive(href, exact) {
  if (exact) return pathname === href                    // /dashboard exact match
  return pathname.startsWith(href)                       // /dashboard/blogs/* sab active
}
```
- **`exact`:** "Overview" (`/dashboard`) exact match (warna har page par active dikhता). Baaki `startsWith` (e.g. `/dashboard/blogs/new` par bhi "Blogs" active).

---

## 🔄 Complete Blog-Create Flow (Sab Jodke)

```
User → /dashboard/blogs (server list, role-filtered)
   │ "+ New Blog" → /dashboard/blogs/new
   ▼
new/page.tsx (Server): prisma.blogcategory.findMany() → <BlogForm categories />
   │ BlogForm (Client): isEditing=false
   │   ├─ title type → generateSlug() auto-fills slug
   │   ├─ cover image → URL.createObjectURL (instant) → fetch POST /api/upload → Cloudinary URL
   │   ├─ FAQ add/remove (array state, immutable)
   │   └─ submit → fetch POST /api/blogs (JSON, Content-Type set)
   ▼
api/blogs POST: requirePermission → zod → prisma.blog.create(author: connect session.user.id) → MongoDB
   ▼
BlogForm: data.success → router.push('/dashboard/blogs') + router.refresh()
   ▼
Server list re-runs → naya blog table mein
```

---

## ⚠️ Dashboard Layer — Key Lessons
| Concept | Kahan | Kyun |
|---|---|---|
| Server fetches, Client mutates | har resource | Server page = DB direct; Client form = fetch API |
| `isEditing` flag | BlogForm | Ek form, create+edit dono |
| `router.push + refresh` | forms | Server list ko fresh data dilao |
| `setCategories(prev => ...)` | CategoriesClient | Client-managed list (no server round-trip) |
| `URL.createObjectURL` + revoke | image upload | Instant preview + no memory leak |
| No `Content-Type` for FormData | upload | Browser sets multipart boundary |
| `useRef` for flags | slugTouched | UI re-render trigger na ho |
| `useMemo` role filter | Sidebar | Permission-based nav |
| Custom window events | Sidebar ↔ Header | Props/context ke bina toggle |
| 2-step confirm | DeleteButton | Accidental delete roko |

---
*Next doc: `walkthrough-04-public-site-ui.md` — homepage, blog public pages, sections, hooks, animations.*
