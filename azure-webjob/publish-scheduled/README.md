# Blog Scheduler — Azure WebJob

Triggers the existing endpoint `/api/cron/publish-scheduled` once a minute so
SCHEDULED blogs auto-publish. This is the missing piece: deploying the Next.js app
does **not** start any background cron by itself, and `vercel.json` crons only run on
Vercel — they are ignored on Azure App Service.

## Deploy

1. In the Portal: **App Service → Settings → Environment variables** (application
   settings), add:
   - `SITE_URL` = `https://<your-app>.azurewebsites.net`
   - `CRON_SECRET` = same value the app uses (so the endpoint accepts the call)
   - `MONGODB_URI` = Atlas connection string (the app itself needs this; the WebJob
     does not)
2. Enable **Configuration → General settings → Always On = On** (required for
   triggered/scheduled WebJobs to fire reliably).
3. Zip this folder's **contents** (`run.ps1` + `settings.job`) and upload under
   **WebJobs → Add**: Name `publish-scheduled`, Type **Triggered**, Triggers
   **Scheduled**. (Or deploy via Kudu to
   `D:\home\site\wwwroot\App_Data\jobs\triggered\publish-scheduled\`.)

Windows App Service uses `run.ps1`. On **Linux** App Service, WebJobs are not
supported — instead point any external minute-cron (Azure Logic App *Recurrence*,
GitHub Actions, or an uptime pinger) at:
`GET https://<your-app>.azurewebsites.net/api/cron/publish-scheduled`
with header `Authorization: Bearer <CRON_SECRET>`.

## Verify

- **WebJobs → publish-scheduled → Logs** shows a run each minute with
  `[Blog Scheduler WebJob] {"success":true,"published":N}`.
- App logs (Log stream / Kudu) show the `[Blog Scheduler]` lines from the endpoint.
