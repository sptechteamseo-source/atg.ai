# robots.txt deployment

## Production marketing site — `clarant.ai`

Served dynamically by this Next.js app. No manual file needed.

- `app/robots.ts` — host-aware. Returns the crawlable ruleset **only** for
  `clarant.ai` / `www.clarant.ai`. Every other host (QA, UAT, preview
  URLs, localhost) automatically returns `Disallow: /`.
- `app/sitemap.ts` — backs the `Sitemap: https://clarant.ai/sitemap.xml`
  reference.

Production output:

```
User-agent: *
Allow: /
Disallow: /app/
Disallow: /api/
Disallow: /admin/
Disallow: /login/
Disallow: /signup/
Disallow: /dashboard/
Disallow: /private/
Disallow: /tmp/
Disallow: /cgi-bin/

Sitemap: https://clarant.ai/sitemap.xml
```

## Web-app environments (QA / UAT) — same Next.js codebase

If the QA/UAT web apps below are deployed from this repo, they need **no**
extra work — `app/robots.ts` already returns `Disallow: /` for any non-prod
host:

- `uat-sptteamrocks2030.clarant.ai` (UAT Web App)
- `qa-k22slmarg.clarant.ai` (QA Web App)

## API environments — separate backend services

These are **not** served by this Next.js app, so copy
[`block-all.robots.txt`](./block-all.robots.txt) to the web root of each so it
is reachable at `/robots.txt`:

- `api.clarant.ai` (Prod API)
- `uatapi-sptteamrocks2030.clarant.ai` (UAT API)
- `qaapi-k22slmarg.clarant.ai` (QA API)

Content (block everything):

```
User-agent: *
Disallow: /
```

Drop it wherever that service serves static files from its root, e.g.:

- **Express/Node:** `app.get('/robots.txt', (_req, res) => res.type('text/plain').send('User-agent: *\nDisallow: /\n'))`
  or `express.static` pointed at a `public/` dir containing the file.
- **nginx:** `location = /robots.txt { add_header Content-Type text/plain; return 200 "User-agent: *\nDisallow: /\n"; }`
- **Static host / CDN:** upload `block-all.robots.txt` as `robots.txt` at the bucket root.

## Verify after deployment

`/robots.txt` must resolve (HTTP 200, `content-type: text/plain`) on every host:

```bash
# Production — expect Allow: / + disallow list + Sitemap line
curl -s https://clarant.ai/robots.txt
curl -s https://clarant.ai/sitemap.xml | head

# Web apps + APIs — expect exactly: User-agent: * / Disallow: /
curl -s https://uat-sptteamrocks2030.clarant.ai/robots.txt
curl -s https://qa-k22slmarg.clarant.ai/robots.txt
curl -s https://api.clarant.ai/robots.txt
curl -s https://uatapi-sptteamrocks2030.clarant.ai/robots.txt
curl -s https://qaapi-k22slmarg.clarant.ai/robots.txt
```
