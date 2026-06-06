// Web3Forms — https://web3forms.com
// No SDK needed; it's a plain HTTPS POST to their API endpoint.
// The access key is intentionally public (Web3Forms design — same as using it in raw HTML forms).

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY =
  process.env.WEB3FORMS_ACCESS_KEY ?? 'f569a71c-1303-4423-b424-fcd29998de99'

export interface ContactPayload {
  name:      string
  email:     string
  company?:  string
  role?:     string
  teamsize?: string
  message:   string
}

export async function sendContactNotification(
  data: ContactPayload,
  submissionId: string
): Promise<void> {

  // Build the payload Web3Forms expects.
  // Every key/value pair beyond the reserved ones appears as a labelled
  // row inside the email that Web3Forms sends.
  const body = {
    // ── Web3Forms reserved fields ────────────────────────────────────────────
    access_key: ACCESS_KEY,
    subject:    'New Contact Form Submission - AskTheGenie',
    from_name:  'AskTheGenie Contact Form',
    replyto:    data.email,   // hitting Reply in any email client goes to the user

    // ── Form fields (all shown in the received email) ─────────────────────────
    Name:          data.name,
    Email:         data.email,
    ...(data.company  && { Company:   data.company  }),
    ...(data.role     && { Role:       data.role     }),
    ...(data.teamsize && { 'Team Size': data.teamsize }),
    Message:       data.message,

    // ── Meta ──────────────────────────────────────────────────────────────────
    'Submission ID': submissionId,
  }

  let res: Response
  try {
    res = await fetch(WEB3FORMS_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(body),
    })
  } catch (networkError) {
    // Network-level failure (DNS, timeout, etc.)
    console.error('[web3forms] Network error sending contact notification:', networkError)
    return
  }

  let json: { success: boolean; message?: string }
  try {
    json = await res.json()
  } catch {
    console.error('[web3forms] Could not parse response (status %d)', res.status)
    return
  }

  if (!res.ok || !json.success) {
    console.error(
      '[web3forms] Submission failed (HTTP %d): %s',
      res.status,
      json.message ?? '(no message)'
    )
  } else {
    console.log(
      '[web3forms] Contact notification delivered (submission %s): %s',
      submissionId,
      json.message ?? 'ok'
    )
  }
}
