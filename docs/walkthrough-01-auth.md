# 🔐 Walkthrough 1 — Auth & Security (Real Line-by-Line)

> Yeh doc auth ke **asli code** ko line-by-line samjhaata hai. Files covered:
> `proxy.ts`, `lib/auth.config.ts`, `lib/auth.ts`, `lib/rbac.ts`, `app/actions/auth.ts`,
> `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `app/dashboard/layout.tsx`, `types/index.ts`.

---

## 🗺️ Bird's-eye View — Auth ke 5 Tukde

```
1. types/index.ts        → NextAuth ko batao "user ke paas role+id bhi hai"
2. lib/auth.config.ts    → Halka config (no DB) — edge/proxy ke liye
3. lib/auth.ts           → Full config — login verify (Prisma + bcrypt)
4. proxy.ts              → Gate: /dashboard protect karo (edge)
5. lib/rbac.ts           → Role-permission check (API level)

UI: app/(auth)/login + signup  →  app/actions/auth.ts (server actions)
Gate #2: app/dashboard/layout.tsx → await auth() recheck
```

---

## 1️⃣ `types/index.ts` — TypeScript Ko Auth Sikhao

NextAuth default mein `session.user` ke paas sirf `name/email/image` hota hai. Hamein `id` aur `role` bhi chahiye. Yeh file TypeScript ko batati hai ki yeh fields exist karte hain (warna `session.user.role` par red squiggly error aata).

```ts
export type UserRole = 'admin' | 'editor' | 'author'        // line 3
export type ContentStatus = 'draft' | 'published' | 'archived'  // line 4
```
- **Line 3:** `UserRole` ek **union type** — sirf yeh 3 strings allowed. Agar tum `'superadmin'` likhoge to TypeScript error dega. Pure project mein roles ka single source of truth.

```ts
declare module 'next-auth' {        // line 7 — module augmentation
  interface Session {
    user: { id: string; name: string; email: string; role: UserRole; image?: string | null }
  }
  interface User { role: UserRole }
  interface JWT { id: string; role: UserRole }
}
```
- **Line 7 `declare module`:** Yeh **"module augmentation"** hai — kisi external library (`next-auth`) ke types ko extend karna. Hum library ki `Session`, `User`, `JWT` interfaces mein apne fields add kar rahe hain.
- **Why:** Iske bina `session.user.id` aur `session.user.role` TypeScript mein exist hi nahi karte. Isiliye `lib/auth.ts` mein `(session.user as any).id` jaise casts dikhte hain — woh runtime par kaam karte the, yeh file unhe type-safe banati hai.

```ts
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }
```
- **Discriminated union** — har API isi shape mein jawab deti hai. `success: true` ho to `data` milega, `false` ho to `error`. Saare client `fetch` isi par depend karte hain. **Yeh contract todna = saare forms todna.**

---

## 2️⃣ `lib/auth.config.ts` — Halka (Edge-Safe) Config

```ts
import type { NextAuthConfig } from 'next-auth'   // line 1

export const authConfig: NextAuthConfig = {        // line 5
  providers: [],                                   // line 6 — KHALI!
  session: { strategy: 'jwt' },                    // line 7
  pages: { signIn: '/login', error: '/login' },    // line 8-11
```
- **Line 6 `providers: []`:** Jaan-bujh kar khali. Ismein **Credentials provider nahi** kyunki woh Prisma import karta hai, aur Prisma **edge runtime** (jahan `proxy.ts` chalti hai) mein nahi chal sakta. Yeh config sirf JWT padhne/verify karne ke liye hai.
- **Line 7 `strategy: 'jwt'`:** Session ek signed cookie hai, DB table nahi.

```ts
callbacks: {
  authorized({ auth, request: { nextUrl } }) {      // line 13
    const isLoggedIn = !!auth?.user
    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
    if (isOnDashboard) return isLoggedIn            // line 16
    return true
  },
```
- **`authorized` callback:** NextAuth ka built-in route-guard. `/dashboard` par hai to `isLoggedIn` lautata hai (false = block). Baaki sab `true` (allow). *(Note: is project ki asli guarding `proxy.ts` mein hai — yeh callback backup/standard pattern hai.)*

```ts
  async jwt({ token, user }) {                       // line 19
    if (user) {
      token.id = user.id as string
      token.role = String((user as any).role || '').toLowerCase()
    }
    return token
  },
  async session({ session, token }) {                // line 26
    if (token) {
      ;(session.user as any).id = token.id
      ;(session.user as any).role = String(token.role || '').toLowerCase()
    }
    return session
  },
```
- Yeh do callbacks `lib/auth.ts` wale ka **chhota version** hain (bina DB re-check). Dono files ko **sync** rakhna zaroori — ek mein logic badla doosre mein nahi, to edge vs node behavior alag ho jaayega.

> **🧠 Concept — Do config kyun?** Edge runtime fast hai par Node APIs (Prisma, crypto) nahi chala sakta. Toh: `auth.config.ts` = edge (sirf token), `auth.ts` = node (DB + bcrypt). Yeh NextAuth v5 ka recommended "split config" pattern hai.

---

## 3️⃣ `lib/auth.ts` — Asli Login Engine

```ts
import NextAuth from 'next-auth'                          // line 1
import Credentials from 'next-auth/providers/credentials' // line 2
import { prisma } from '@/lib/prisma'                      // line 3
import bcrypt from 'bcryptjs'                              // line 4
import { z } from 'zod'                                    // line 5

const loginSchema = z.object({                             // line 8
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
```
- **Line 8 Zod schema:** Login inputs ka shape. `.email()` format check, `.min(6)` length check. Yeh **server-side** validation hai (browser ke `required` se alag — browser bypass ho sakta hai, server nahi).

```ts
export const { handlers, auth, signIn, signOut } = NextAuth({   // line 13
```
- **Line 13:** NextAuth() 4 cheezein return karta hai:
  - `handlers` → `app/api/auth/[...nextauth]/route.ts` use karta hai (GET/POST).
  - `auth()` → server par session padhne ke liye (`dashboard/layout.tsx`, `rbac.ts`).
  - `signIn` / `signOut` → server actions (`app/actions/auth.ts`) use karte hain.

```ts
  providers: [
    Credentials({                                  // line 15
      name: 'credentials',
      credentials: {                               // line 17 — UI hint (yahan use nahi)
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {               // line 22 — ⭐ DIL
        const parsed = loginSchema.safeParse(credentials)  // line 24
        if (!parsed.success) return null           // line 25

        const { email, password } = parsed.data

        const user = await prisma.users.findUnique({ where: { email } })  // line 30
        if (!user) return null                     // line 31

        const passwordMatch = await bcrypt.compare(password, user.password) // line 34
        if (!passwordMatch) return null            // line 35

        return {                                   // line 37
          id: user.id, name: user.name, email: user.email,
          role: user.role, image: user.image,
        }
      },
    }),
  ],
```
- **Line 22 `authorize`:** Yeh function NextAuth tab call karta hai jab koi `signIn('credentials', ...)` karta hai.
  - **Line 24-25:** Zod se validate. `safeParse` throw nahi karta, `{success, data}` lautata hai. Fail = `return null` (NextAuth isko "login fail" maanta hai).
  - **Line 30:** DB se user dhoondo email se. `findUnique` kyunki email `@unique` hai schema mein.
  - **Line 31:** User nahi mila? `null` (fail). *(Note: "user not found" aur "wrong password" dono `null` — jaan-bujh kar, taaki attacker ko pata na chale email exist karta hai ya nahi.)*
  - **Line 34 `bcrypt.compare`:** Plain password ko DB ke **hashed** password se compare. bcrypt internally hash karke match karta hai (hum kabhi plain password store nahi karte).
  - **Line 37:** Sab sahi → user object return. Yeh object `jwt` callback ke `user` param mein jaata hai.

```ts
  session: { strategy: 'jwt' },                    // line 49
```

```ts
  callbacks: {
    async jwt({ token, user }) {                   // line 53 — ⭐ self-healing token
      if (user) {                                  // line 55 — pehli baar login
        token.id = user.id as string
        token.role = String((user as any).role || '').toLowerCase()
        return token
      }

      if (token.id) {                              // line 64 — baad ke requests
        try {
          const dbUser = await prisma.users.findUnique({
            where: { id: token.id as string },
            select: { id: true, role: true },
          })
          if (!dbUser) return {}                   // line 72 — user delete? token kill
          token.role = String(dbUser.role || '').toLowerCase()  // line 75 — role refresh
        } catch {
          // DB down — purana token rakho, logout mat karo  (line 76-78)
        }
      }
      return token
    },
```
- **Line 53 `jwt` callback:** Har request par chalता hai jahan token padha jaata hai.
  - **Line 55 (first login):** `user` tabhi exist karta hai jab abhi-abhi `authorize` se aaya. Tab `id` aur `role` (lowercase) token mein daal do. `return token` — aage DB check skip.
  - **Line 64 (subsequent):** `user` nahi hai (already logged in). Token mein `id` hai to DB se dobara check karo.
  - **Line 72:** Agar user DB se delete ho gaya → `return {}` (khali token = effectively logged out). **Self-healing security** — deleted user automatically kicked out.
  - **Line 75:** Role ko DB se refresh — agar admin ne role badal diya to next request par effect.
  - **Line 76-78 `catch {}`:** DB down ho to **kuch mat karo, purana token rakho.** Warna ek DB hiccup pe saare users logout ho jaate. Smart resilience.

```ts
    async session({ session, token }) {            // line 85
      if (token && token.id) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = String(token.role || '').toLowerCase()
      }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },    // line 94
})
```
- **Line 85 `session` callback:** Token (server-side) → session (client-readable) mein `id`/`role` copy. Iske baad `useSession()` ya `auth()` se client/server `session.user.role` padh sakte hain.
- **Line 94 `pages`:** Login custom page `/login` (NextAuth ke default page ki jagah).

---

## 4️⃣ `proxy.ts` — The Gate (⭐ Renamed Middleware)

> **Yaad rakho:** Next.js 15.5 mein `middleware.ts` → `proxy.ts`. Yeh root mein hai, auto-load hoti hai.

```ts
import NextAuth from 'next-auth'                       // line 1
import { authConfig } from '@/lib/auth.config'         // line 2 — HALKA config (no DB!)
import { NextResponse } from 'next/server'             // line 3
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)                  // line 7 — edge-safe auth
```
- **Line 2:** `auth.config` import (Prisma wala `auth.ts` nahi) — kyunki edge mein Prisma crash karega.
- **Line 7:** Sirf `auth` nikaalा — yeh request ko wrap karke `req.auth` (session) deta hai.

```ts
const protectedPaths = ['/dashboard']                  // line 10 — login chahiye
const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password']  // line 13
```

```ts
export const proxy = auth((req) => {                   // line 15 — ⭐ export naam "proxy"
  const { pathname } = req.nextUrl
  const session = req.auth                             // line 17 — JWT se session

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))  // line 19
  const isAuthPage  = authPaths.some((p) => pathname.startsWith(p))       // line 20

  if (isProtected && !session) {                       // line 23 — not logged in → login
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname) // line 25 — kahan jaa rahe the yaad rakho
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && session) {                         // line 30 — logged-in user /login khol raha?
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()                           // line 34 — sab theek, aage badho
})

export const config = {                                // line 37
  matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password', '/reset-password'],
}
```
- **Line 15:** `export const proxy` — naam **must** `proxy` ho (Next 15.5 convention). `auth(...)` wrapper request par `req.auth` attach karta hai.
- **Line 23-26:** `/dashboard/*` par bina login → `/login?callbackUrl=/dashboard/blogs`. `callbackUrl` isiliye login ke baad wapis usi page par bhej sakein.
- **Line 30-31:** Pehle se logged-in ho aur `/login` kholo → seedha `/dashboard` (dobara login form mat dikhao).
- **Line 37 `matcher`:** Proxy **sirf** in routes par chalti hai (performance — har image/CSS request par nahi). **Galat matcher = ya sab khula ya sab blocked.** High-risk line.

---

## 5️⃣ `lib/rbac.ts` — Permission Layer (API Level)

```ts
const permissions = {                                  // line 5
  admin:  ['manage:users','manage:roles','manage:blogs','manage:use-cases',
           'manage:testimonials','publish:content','view:analytics','manage:settings'],
  editor: ['manage:blogs','manage:use-cases','manage:testimonials',
           'publish:content','view:analytics'],
  author: ['create:blogs','edit:own-blogs','create:use-cases','edit:own-use-cases'],
} satisfies Record<UserRole, string[]>                 // line 29
```
- **Line 5:** Har role ka permission list. **admin** = sab, **editor** = content (users nahi), **author** = sirf apna content banao/edit (publish nahi, delete nahi).
- **Line 29 `satisfies`:** TypeScript ko check karwa rahe hain ki object ki keys exactly `UserRole` (admin/editor/author) hain — naya role add karo to yahan add karna padega (compile error warna).

```ts
export function hasPermission(role: UserRole, permission: string): boolean {  // line 32
  return permissions[role]?.includes(permission) ?? false
}
```
- **Input:** role + permission string. **Output:** true/false. `?.` + `?? false` se agar role unknown ho to safely `false`.

```ts
export async function requirePermission(permission: string) {  // line 37 — ⭐ API guard
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')           // line 40 — not logged in
  const role = session.user.role as UserRole
  if (!hasPermission(role, permission)) throw new Error('FORBIDDEN')  // line 45
  return session
}
```
- **Line 37:** Yeh har sensitive API ke top par chalता hai. `auth()` se session lo.
- **Line 40:** Login hi nahi? `throw 'UNAUTHORIZED'` → API ka catch block 401 return karta hai.
- **Line 45:** Login to hai par permission nahi? `throw 'FORBIDDEN'` → 403. **Note:** yeh throw karta hai (return nahi), isliye API code mein `try/catch` zaroori.

```ts
export function canEdit(userRole, userId, resourceAuthorId): boolean {  // line 53
  if (userRole === 'admin' || userRole === 'editor') return true
  return userId === resourceAuthorId                 // author sirf apna
}
```
- **Use:** Blog/use-case PUT mein. Admin/editor kisi ka bhi edit kar sakte; author **sirf apna** (`userId === resourceAuthorId`).

---

## 6️⃣ `app/actions/auth.ts` — Server Actions (UI ↔ Auth Bridge)

> **'use server'** (line 1) = yeh functions **server par** chalte hain par client se directly call ho sakte hain (forms se). Yeh Next.js App Router ka "Server Actions" feature hai — alag API endpoint banane ki zaroorat nahi.

### `login(formData)` — line 12
```ts
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'  // line 15
  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl })   // line 18
  } catch (error: any) {
    if (error?.type === 'CredentialsSignin') return { error: 'Invalid email or password' }  // line 21
    throw error                                       // line 25
  }
}
```
- **Line 18:** `signIn` → `lib/auth.ts` ka `authorize` trigger. Success par yeh **redirect throw karta hai** (NextAuth ka design).
- **Line 21:** Galat creds → `CredentialsSignin` error → friendly message return.
- **Line 25 `throw error`:** ⚠️ Important — success ka redirect bhi ek "error" jaisा throw hota hai. Isko **re-throw** karna padta hai taaki Next.js redirect handle kare. Agar yahan swallow kar lo to login ke baad redirect hi nahi hoga.

### `signup(formData)` — line 37
```ts
const signupSchema = z.object({                       // line 31
  name: z.string().min(2, ...), email: z.string().email(...), password: z.string().min(8, ...),
})

const parsed = signupSchema.safeParse(raw)            // line 44
if (!parsed.success) return { error: parsed.error.issues[0].message }  // line 46

const existing = await prisma.users.findUnique({ where: { email } })   // line 52
if (existing) return { error: 'An account with this email already exists' }  // line 53

const hashedPassword = await bcrypt.hash(password, 12)// line 58 — cost 12
await prisma.users.create({ data: { name, email, password: hashedPassword, role: 'author' } }) // line 60
await signIn('credentials', { email, password, redirectTo: '/dashboard' })  // line 66 — auto login
```
- **Line 46:** Zod fail → pehla error message bhej do.
- **Line 52-53:** Email already exists? Block.
- **Line 58 `bcrypt.hash(password, 12)`:** "12" = cost factor (2^12 rounds). Zyada = slower = safer against brute-force. Hum **kabhi plain password store nahi karte.**
- **Line 60:** Naya user — **role hamesha `'author'`** (sabse kam permission). Admin/editor sirf existing admin bana sakta hai dashboard se.
- **Line 66:** Signup ke baad auto sign-in → seedha dashboard.

### `logout()` — line 72
```ts
export async function logout() { await signOut({ redirectTo: '/login' }) }
```

### `forgotPassword(formData)` — line 78
```ts
const user = await prisma.users.findUnique({ where: { email } })
if (!user) return { success: true }                   // line 86-87 — JHOOTH (security)
const token = crypto.randomBytes(32).toString('hex')  // line 91 — 64-char random token
const expiry = new Date(Date.now() + 60*60*1000)      // line 92 — 1 ghanta
await prisma.users.update({ where: { email }, data: { resettoken: token, resettokenexpiry: expiry } })  // line 94
console.log(`Reset link: /reset-password?token=${token}`)  // line 101 — DEV; prod = email
return { success: true }
```
- **Line 86-87:** User na mile tab bhi `success: true`. Yeh **email enumeration** rokta hai — attacker "yeh email exist karta hai?" pata nahi laga sakta.
- **Line 91-92:** Random secure token + 1hr expiry DB mein store.
- **Line 101:** ⚠️ Abhi token **console mein** print hota hai. **Production mein yahan email-sending lagana padega** (yeh TODO hai).

### `resetPassword(formData)` — line 108
```ts
const user = await prisma.users.findFirst({           // line 121
  where: { resettoken: token, resettokenexpiry: { gt: new Date() } },  // token + not-expired
})
if (!user) return { error: 'Invalid or expired reset link' }  // line 128
const hashedPassword = await bcrypt.hash(password, 12)
await prisma.users.update({
  where: { id: user.id },
  data: { password: hashedPassword, resettoken: null, resettokenexpiry: null },  // line 136 — token clear
})
redirect('/login?message=password-reset')             // line 143
```
- **Line 121:** Token match **AND** `resettokenexpiry > now` (`gt` = greater than). Expired token reject.
- **Line 136:** Naya password set + token **null** kar do (ek baar use, dobara nahi).
- **Line 143:** `/login?message=password-reset` → login page green success banner dikhata hai.

---

## 7️⃣ UI Pages — Login & Signup (Client Components)

### `app/(auth)/login/page.tsx`
```tsx
'use client'                                           // line 1
export default function LoginPage() {
  return (<Suspense><LoginForm /></Suspense>)          // line 11 — ⭐ Suspense kyun?
}
```
- **Line 11 `Suspense`:** `LoginForm` `useSearchParams()` use karta hai. Next.js build time par warning/error deta hai agar `useSearchParams` Suspense ke bina ho ("CSR bailout"). Isliye wrap kiya.

```tsx
function LoginForm() {
  const searchParams = useSearchParams()               // line 18
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'  // line 19
  const message = searchParams.get('message')          // line 20
  const [error, setError] = useState('')               // line 22
  const [loading, setLoading] = useState(false)        // line 23

  async function handleSubmit(e) {                      // line 25
    e.preventDefault()                                  // line 26 — page reload roko
    setError(''); setLoading(true)
    const formData = new FormData(e.currentTarget)      // line 30 — form se data
    formData.set('callbackUrl', callbackUrl)            // line 31 — callbackUrl add
    const result = await login(formData)                // line 33 — ⭐ server action call
    if (result?.error) { setError(result.error); setLoading(false) }  // line 34
  }
```
- **Line 18-20:** URL se `callbackUrl` (login ke baad kahan jaana) aur `message` (password-reset success?) padho.
- **Line 22-23:** Do state — `error` (dikhane ke liye), `loading` (button disable karne ke liye).
- **Line 26:** `preventDefault` — default form submit (page reload) roko, hum JS se handle karenge.
- **Line 30-31:** `FormData` form se inputs nikaalta hai (`name="email"`, `name="password"`). Phir `callbackUrl` manually add.
- **Line 33:** **Server action ko seedha call** — koi `fetch('/api/...')` nahi! Yeh Server Actions ka jaadu. Success par `login` khud redirect karta hai; sirf error wapas aata hai.
- **Line 34:** Error aaya to dikhao + loading band. (Success par yahan tak code pohoncha hi nahi — redirect ho gaya.)

```tsx
{message === 'password-reset' && (<div className="auth-alert--success">Password updated!...</div>)}  // line 45
{error && (<div className="auth-alert--error">{error}</div>)}                                          // line 51
<button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>                              // line 85-87
```
- **Line 45/51:** Conditional render — message/error ho tabhi banner.
- **Line 85-87:** `loading` true to button disabled + text "Signing in…" (double-submit roko).

### `app/(auth)/signup/page.tsx`
Bilkul same pattern (line 11-23):
```tsx
const formData = new FormData(e.currentTarget)         // line 16
const result = await signup(formData)                  // line 17 — signup action
if (result?.error) { setError(result.error); setLoading(false) }  // line 19
...
<input name="password" minLength={8} ... />            // line 59-67 — browser-side min 8
```
- Note: `minLength={8}` browser check hai; asli safety `signupSchema.min(8)` (server) deti hai.

---

## 8️⃣ `app/dashboard/layout.tsx` — Gate #2 (Server-Side Recheck)

```tsx
export default async function DashboardLayout({ children }) {  // line 8 — async Server Component
  const session = await auth()                          // line 9 — server par session
  if (!session?.user) redirect('/login')                // line 11-13 — no session → kick
  const role = session.user.role as UserRole | undefined // line 15
  return (
    <div className="dash-layout">
      <Sidebar role={role} />                            // line 19 — role-based nav
      <main className="dash-main">{children}</main>
    </div>
  )
}
```
- **Line 8:** `async` Server Component — server par render hota hai, isliye `await auth()` directly chal sakta hai.
- **Line 9-13:** `proxy.ts` ke alawa **dusra check** (defense in depth). Agar kisi tarah proxy bypass ho jaye to bhi yeh redirect karega.
- **Line 19:** `role` Sidebar ko pass — Sidebar role ke hisaab se nav items filter karta hai (admin ko "Users", author ko nahi).

---

## 🔄 Complete Login Flow (Sab Jodke)

```
User /login (Client) bharta hai email+password
   │ handleSubmit → login(formData)  [server action]
   ▼
app/actions/auth.ts → login()
   │ signIn('credentials', { email, password, redirectTo })
   ▼
lib/auth.ts → authorize()
   │ 1. loginSchema.safeParse        (Zod validate)
   │ 2. prisma.users.findUnique      (MongoDB se user)
   │ 3. bcrypt.compare               (password match)
   │ 4. return user  OR  null
   ▼
jwt callback → token.id + token.role set
session callback → session.user.id + role
   │ signed JWT cookie browser mein
   ▼ (redirect throw → Next.js handle)
/dashboard
   │ proxy.ts: JWT valid? haan → allow
   │ dashboard/layout.tsx: await auth() → session? haan → render
   ▼
Dashboard dikhta hai (Sidebar role ke hisaab se)
```

### Har API call par security (3 layers)
```
proxy.ts (edge)         → /dashboard logged-in hai?
dashboard/layout.tsx    → await auth() recheck
API route handler       → requirePermission('manage:blogs') + canEdit()
```

---

## ⚠️ Is Layer Ki High-Risk Lines (Mat Chhedo Bina Samjhe)
| File:Line | Kyun risky |
|---|---|
| `proxy.ts:38` (matcher) | Galat = sab khula / sab block |
| `lib/auth.ts:72` (`return {}`) | Yeh deleted-user logout karta hai; hataya to ghost sessions |
| `lib/auth.ts` vs `auth.config.ts` callbacks | Dono sync rakho warna edge≠node |
| `actions/auth.ts:25` (`throw error`) | Hataya to login redirect tootega |
| `actions/auth.ts:86` (silent success) | Hataya to email enumeration vulnerability |
| `rbac.ts:5` (permissions) | Permission rename = API strings bhi badlo |

---
*Next doc: `walkthrough-02-database-and-apis.md` — schema + saari API routes line-by-line.*
