'use client'

import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { html_beautify } from 'js-beautify'

/**
 * HTML source editor for the blog editor's "HTML" mode — a real code editor
 * (CodeMirror) with syntax highlighting, line numbers, code folding and
 * auto-indent. The incoming HTML (often a single long line) is pretty-printed
 * once on open so nested tags are indented and readable. Code inside <pre> /
 * <textarea> is left untouched so code-block source is never reflowed.
 *
 * Lazy-loaded (ssr:false) by RichTextEditor so CodeMirror only ships when the
 * writer actually opens source mode.
 */
function format(v: string): string {
  try {
    return html_beautify(v || '', {
      indent_size: 2,
      wrap_line_length: 0,      // never hard-wrap long attribute lines
      preserve_newlines: false, // re-derive line breaks from structure
      end_with_newline: false,
      content_unformatted: ['pre', 'textarea'], // keep code-block source verbatim
    })
  } catch {
    return v // malformed HTML → show as-is rather than lose the user's work
  }
}

export default function HtmlSourceEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  // Format once on mount; thereafter the editor owns its document.
  const [doc, setDoc] = useState(() => format(value))

  return (
    <CodeMirror
      value={doc}
      theme={oneDark}
      minHeight="300px"
      maxHeight="75vh"
      width="100%"
      // lineWrapping = soft-wrap long lines to the editor width (no horizontal
      // scroll); height auto-grows with content between min/max.
      extensions={[html(), EditorView.lineWrapping]}
      onChange={(v) => { setDoc(v); onChange(v) }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        autocompletion: false,
        tabSize: 2,
      }}
    />
  )
}
