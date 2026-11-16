# HubSpot Setup Guide — Screenshots

Drop the uploaded screenshots in **this folder** using the exact filenames below.
The docs page (`/docs/hubspot-setup-guide`) references these paths. Until a file
exists, its slot shows a labelled "screenshot pending" placeholder (no broken image).

| Filename | Documentation slot | Suggested source |
|---|---|---|
| `01-login.png` | Step 1 — Sign in | Clarant Login Page |
| `02-connectors.png` | Step 2 — Navigate to Connectors | Connectors Dashboard |
| `03-connector-card.png` | Step 3 — Select HubSpot | HubSpot Connector Card |
| `04-account-selection.png` | Step 4 — Choose your HubSpot account | HubSpot Account Selection |
| `05-scope-approval.png` | Step 5 — Review permissions | Scope Approval Screen |
| `06-connected.png` | Step 6 — Connection complete | Connected HubSpot Connector |
| `07-workspace-management.png` | Configure → Workspace access | Workspace Management |
| `08-workspace-config.png` | *(slot removed — only one workspace screenshot was supplied; add this file to restore a figure under "Configure data sources")* | Workspace Configuration |
| `09-ai-response.png` | Using → Example AI response | AI Query and Response |
| `10-citations.png` | Citations & Sources | Citations Screen |
| `11-disconnect.png` | Disconnecting HubSpot | Disconnect Screen |

**Recommended:** export at ~1600px wide, PNG or WebP, compressed. The page already
lazy-loads and responsively scales them. For automatic format/size optimization you
can later switch `app/docs/Figure.tsx` from `<img>` to `next/image`.
