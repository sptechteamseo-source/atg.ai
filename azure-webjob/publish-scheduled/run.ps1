# Azure App Service triggered WebJob — fires every minute (see settings.job).
# Calls the existing scheduler endpoint, so ALL publish + cache-revalidation logic
# is reused and no Prisma/DB credentials are needed inside the job.
#
# Required App Service application settings:
#   SITE_URL    e.g. https://<your-app>.azurewebsites.net   (no trailing slash)
#   CRON_SECRET the same value the Next app reads (Authorization: Bearer <secret>)
$ErrorActionPreference = "Stop"
$headers = @{ Authorization = "Bearer $($env:CRON_SECRET)" }
$resp = Invoke-RestMethod -Uri "$($env:SITE_URL)/api/cron/publish-scheduled" -Headers $headers -Method Get
Write-Output "[Blog Scheduler WebJob] $($resp | ConvertTo-Json -Compress)"
