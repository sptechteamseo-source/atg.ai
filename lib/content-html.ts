import 'server-only'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Normalise editor HTML for storage so that raw HTML written in NORMAL content
 * renders as HTML, while code blocks keep showing their source.
 *
 * The WYSIWYG editor escapes typed text, so `<h2>x</h2>` typed into a paragraph
 * is stored as `&lt;h2&gt;x&lt;/h2&gt;` (renders as literal text). This decodes
 * those entities OUTSIDE code so the tags render, but leaves <pre>/<code>
 * untouched so a code block still shows the source. The result is sanitized —
 * scripts, inline event handlers and javascript: URLs are stripped — so raw
 * authored HTML can never inject executable code.
 *
 * Runs at save time only (blog API), so existing posts are never reprocessed and
 * no sanitizer ships to the browser.
 */

// NUL delimiter — cannot occur in real HTML, so the placeholder never collides.
const NUL = String.fromCharCode(0)

export function toRenderableHtml(input: string): string {
  if (!input) return input

  // 1. Stash code blocks & inline code so their escaped source is never decoded.
  const stash: string[] = []
  const stashed = input.replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>/gi, (m) => {
    stash.push(m)
    return `${NUL}${stash.length - 1}${NUL}`
  })

  // 2. Decode entities in normal content so typed/pasted tags become real HTML.
  //    &amp; is decoded last so "&amp;lt;" doesn't turn into a "<".
  const decoded = stashed
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')

  // 3. Restore the stashed code untouched.
  const restored = decoded.replace(new RegExp(`${NUL}(\\d+)${NUL}`, 'g'), (_, i) => stash[Number(i)])

  // 4. Sanitize. DOMPurify strips <script>, on* handlers and javascript: URLs
  //    (XSS) but keeps valid HTML: standard formatting, tables (incl. border),
  //    divs, buttons, images, blockquotes, lists, inline styles (image
  //    alignment) and data-* attributes are allowed by default. iframes are
  //    opt-in (embeds) with their standard attributes; their src is still
  //    protocol-checked, so javascript: iframes are rejected.
  return DOMPurify.sanitize(restored, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: [
      'target', 'allow', 'allowfullscreen', 'frameborder',
      'scrolling', 'referrerpolicy', 'loading', 'sandbox',
    ],
  })
}
