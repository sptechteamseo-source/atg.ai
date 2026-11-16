# Microsoft Entra ID (Azure AD) SSO — Setup & Testing

Single-tenant Microsoft 365 sign-in added alongside the existing email/password +
2FA login. Auth.js / NextAuth v5, JWT sessions, Prisma/MongoDB. **Invite-only
(policy A):** a Microsoft account can sign in only if an admin has already created
a matching **active** user (by email) in the dashboard; first Microsoft login links
the stable `oid`. No auto-provisioning.

Callback path (NextAuth v5 + this provider):
```
/api/auth/callback/microsoft-entra-id
```

---

## 1. Azure — App Registration

1. Open the **Microsoft Entra Admin Center** → https://entra.microsoft.com
2. **Identity → Applications → App registrations → New registration**.
3. Name it (e.g. *ATG Marketing Dashboard*).
4. **Supported account types:** select **Accounts in this organizational directory
   only (Single tenant)**.
5. **Redirect URI:** platform **Web**, value:
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id`  (local dev)
   - Add the production one later (section 5).
6. **Register.**

### Get the IDs
- **Overview** page → copy **Application (client) ID** → `AUTH_MICROSOFT_ENTRA_ID_ID`.
- **Overview** page → copy **Directory (tenant) ID** → `MICROSOFT_TENANT_ID` and into the issuer URL.

### Create a client secret
7. **Certificates & secrets → Client secrets → New client secret** → set an expiry → **Add**.
8. Copy the secret **Value** (the long opaque string, **not** the Secret ID) →
   `AUTH_MICROSOFT_ENTRA_ID_SECRET`. ⚠️ It's shown only once.

### API permissions
9. Default **Microsoft Graph → User.Read** (delegated) is enough. We request only
   `openid profile email`. Admin consent is generally **not** required for these.

---

## 2. Restrict to authorized employees (Enterprise Application)

This is the primary access gate on the Azure side (on top of the app's tenant +
invite-only checks).

1. Entra Admin Center → **Enterprise applications** → open the app (same name).
2. **Properties** → set **Assignment required?** = **Yes** → Save.
3. **Users and groups → Add user/group** → assign only the employees (or a group)
   who may sign in.

With this on, Azure blocks anyone not assigned *before* they ever reach the app.

---

## 3. Environment variables

Already set in `.env.local` for local dev. For other environments use the same
names (see `.env.example`):

```env
AUTH_MICROSOFT_ENTRA_ID_ID="<Application (client) ID>"
AUTH_MICROSOFT_ENTRA_ID_SECRET="<Client secret VALUE>"
AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/<tenant-id>/v2.0"
MICROSOFT_TENANT_ID="<Directory (tenant) ID>"
```

The issuer **must** be the tenant-specific `/v2.0` endpoint (not `/common`) — that's
what restricts login to your organization.

---

## 4. Database change (run yourself — not run for you)

Three **additive, non-destructive** fields were added to the `users` model
(`microsoftId`, `tenantId`, and `password` made optional). Push the schema to Atlas:

```bash
npm run db:push
```

Prisma MongoDB `db push` does not alter or delete existing documents — existing
users keep their data; the new fields are simply absent (read as null) until a user
first signs in with Microsoft. Stop `next dev` first (Windows file lock on the
Prisma client).

---

## 5. Production redirect URI

In the App Registration → **Authentication → Add a platform / Web → Redirect URIs**,
add your production callback:
```
https://<your-prod-domain>/api/auth/callback/microsoft-entra-id
```
Confirm the exact production domain (middleware currently enforces `clarant.ai`,
so likely `https://clarant.ai/api/auth/callback/microsoft-entra-id`). HTTPS is
required by Microsoft for non-localhost redirect URIs.

Set the four env vars + `AUTH_SECRET` + `MONGODB_URI` in the production host
(Vercel / Azure App Service). NextAuth auto-detects the deployment URL
(`VERCEL_URL`); on Azure App Service set `AUTH_URL="https://<prod-domain>"`.

---

## 6. Testing checklist

Run locally (where Atlas is reachable — see the known-issue note below):

| Scenario | Expected |
|---|---|
| Assigned employee, already an active DB user | ✅ signs in → `/dashboard` |
| Assigned employee, **no** DB user | ❌ denied → `/login?error=AccessDenied` (invite-only) |
| Personal Outlook/Hotmail account | ❌ denied (tenant mismatch) — also blocked by Azure assignment |
| Account from another tenant | ❌ denied (tenant mismatch) |
| Guest user in our tenant | ❌ denied (`acct === 1`) |
| Repeated Microsoft login | ✅ same user, no duplicate (keyed on `oid`) |
| Existing user with `status != active` | ❌ denied |
| User disabled after login | ❌ signed out on next request (jwt re-validation) |
| Logout | ✅ → `/login` |
| Protected API without session | ❌ 401/redirect (unchanged) |
| Existing email/password + 2FA login | ✅ still works |

Automated checks that pass now:
```bash
npx tsc --noEmit                      # clean
npx tsx scripts/entra-selfcheck.ts    # Entra gate rules
```

### Known local-environment limitation
MongoDB Atlas is **not reachable from this machine** (TLS `UnknownIssuer`), so the
full OAuth round-trip + DB provisioning **cannot be exercised locally here** and has
**not** been tested end-to-end. `tsc` is clean and `next build` compiles
successfully; the build's only failures are the pre-existing Atlas-unreachable
prerender timeouts, unrelated to this change. Run the table above on an environment
where Atlas is reachable (deployed) with a real test account.

---

## 7. Remaining manual actions

- [ ] **`.env.local` `AUTH_SECRET`** is still the placeholder
      `your-secret-key-change-this-in-production` — left untouched per the
      "don't overwrite existing values" rule. Replace it with the provided secret
      (`openssl rand -base64 32` value) or sessions won't be secure.
- [ ] Verify `AUTH_MICROSOFT_ENTRA_ID_SECRET` is the secret **Value**, not the
      Secret **ID**. The value supplied looks GUID-shaped (typical of a Secret ID);
      if sign-in fails with `invalid_client`, regenerate and use the Value.
- [ ] `npm run db:push` to apply the schema fields to Atlas.
- [ ] Register the production redirect URI and set prod env vars.
- [ ] Turn on Enterprise Application **Assignment required** and assign employees.
- [ ] Ensure the employees who should use SSO exist as **active** users in the
      dashboard (invite-only — they're denied otherwise).
