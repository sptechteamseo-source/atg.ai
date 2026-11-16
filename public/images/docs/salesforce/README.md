# Salesforce Setup Guide — Screenshots

Drop the uploaded screenshots in **this folder** using the exact filenames below.
The docs page (`/docs/salesforce-setup-guide`) references these paths. Until a file
exists, its slot shows a labelled "screenshot pending" placeholder (no broken image).

| Filename | Documentation slot | Suggested source |
|---|---|---|
| `01-salesforce-home.png` | Step 1 — Open the Salesforce Setup page | Salesforce Setup Home |
| `02-external-client-apps.png` | Step 2 — Navigate to External Client Apps | External Client App Manager |
| `03-basic-information.png` | Step 3 — Create a new External Client App | Basic Information form |
| `04-oauth-settings.png` | Step 4 — Configure API (Enable OAuth Settings) | API / OAuth settings panel |
| `05-security-settings.png` | Step 5 — Configure Security Settings | Security section (PKCE) *(pending)* |
| `06-consumer-key.png` | Step 6 — Save the External Client App | App detail page / Consumer Key *(pending)* |
| `07-mcp-servers.png` | Activate the MCP Server — Salesforce Servers list | MCP Servers page |
| `08-mcp-server-detail.png` | Activate the MCP Server — sobject-all detail | sobject-all detail / Server URL |
| `09-oauth-openid-settings.png` | Configure OAuth & OpenID Connect | OAuth and OpenID Connect Settings |
| `10-connect-clarant.png` | Connect to Clarant | Clarant connector form *(pending)* |
| `11-verify-connection.png` | Verify the Connection | Clarant test query response *(pending)* |

**Recommended:** export at ~1600px wide, PNG or WebP, compressed. The page already
lazy-loads and responsively scales them. For automatic format/size optimization you
can later switch `app/docs/Figure.tsx` from `<img>` to `next/image`.
