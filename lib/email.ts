import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const SUPPORT_EMAIL = 'Support@askthegenie.ai'

export interface ContactPayload {
  name:     string
  email:    string
  company?: string
  role?:    string
  teamsize?: string
  message:  string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />')
}

function buildHtml(data: ContactPayload, submissionId: string, submittedAt: string): string {
  const rows: { label: string; value: string }[] = [
    { label: 'Name',      value: data.name },
    { label: 'Email',     value: data.email },
    ...(data.company  ? [{ label: 'Company',   value: data.company  }] : []),
    ...(data.role     ? [{ label: 'Role',       value: data.role     }] : []),
    ...(data.teamsize ? [{ label: 'Team Size',  value: data.teamsize }] : []),
    { label: 'Message',   value: data.message },
  ]

  const tableRows = rows.map(r => `
    <tr>
      <td style="padding:10px 16px;font-weight:600;color:#6b7280;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f3f4f6;width:120px">${r.label}</td>
      <td style="padding:10px 16px;color:#111827;border-bottom:1px solid #f3f4f6">${escapeHtml(r.value)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 32px 28px">
            <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.75)">AskTheGenie</p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3">New Contact Form Submission</h1>
          </td>
        </tr>

        <!-- Fields table -->
        <tr>
          <td style="padding:0">
            <table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 28px;background:#f9fafb;border-top:1px solid #f3f4f6">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af">Submission ID: ${submissionId}</p>
            <p style="margin:0;font-size:12px;color:#9ca3af">Received: ${submittedAt}</p>
            <p style="margin:12px 0 0;font-size:12px;color:#9ca3af">
              To reply, simply hit <strong>Reply</strong> — your email client will address it directly to <strong>${escapeHtml(data.email)}</strong>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildText(data: ContactPayload, submissionId: string, submittedAt: string): string {
  const lines = [
    'NEW CONTACT FORM SUBMISSION — AskTheGenie',
    '==========================================',
    '',
    `Name:      ${data.name}`,
    `Email:     ${data.email}`,
    ...(data.company  ? [`Company:   ${data.company}`]  : []),
    ...(data.role     ? [`Role:      ${data.role}`]     : []),
    ...(data.teamsize ? [`Team Size: ${data.teamsize}`] : []),
    '',
    'Message:',
    data.message,
    '',
    '--',
    `Submission ID : ${submissionId}`,
    `Received      : ${submittedAt}`,
    '',
    `Reply-To is set to ${data.email} — hit Reply to respond directly.`,
  ]
  return lines.join('\n')
}

export async function sendContactNotification(
  data: ContactPayload,
  submissionId: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set — skipping notification email')
    return
  }

  const submittedAt = new Date().toUTCString()

  const { error } = await resend.emails.send({
    from:    'AskTheGenie Contact <noreply@askthegenie.ai>',
    to:      [SUPPORT_EMAIL],
    replyTo: data.email,
    subject: 'New Contact Form Submission - AskTheGenie',
    html:    buildHtml(data, submissionId, submittedAt),
    text:    buildText(data, submissionId, submittedAt),
  })

  if (error) {
    // Log the full error server-side but do NOT re-throw —
    // the DB submission already succeeded and the user already got a success response.
    console.error('[email] Failed to send contact notification:', error)
  } else {
    console.log(`[email] Contact notification sent to ${SUPPORT_EMAIL} (submission ${submissionId})`)
  }
}
