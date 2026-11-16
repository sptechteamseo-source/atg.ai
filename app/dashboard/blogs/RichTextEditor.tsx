'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import { DOMParser as PMDOMParser } from '@tiptap/pm/model'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'

// CodeMirror-based HTML source editor, loaded only when source mode is opened.
const HtmlSourceEditor = dynamic(() => import('./HtmlSourceEditor'), {
  ssr: false,
  loading: () => <div className="rte-source-loading">Loading HTML editor…</div>,
})

/**
 * Rich WYSIWYG editor for blog content.
 *
 * Output is clean semantic HTML (<p> <h1-3> <ul> <ol> <a> <img> …) stored in the
 * same `content` field the public site renders via dangerouslySetInnerHTML.
 * Image alignment is written as inline styles so no CSS is needed on the public
 * side — the stored markup renders identically wherever it lands.
 *
 * Paste from ChatGPT / Google Docs / Word / Notion is handled by ProseMirror:
 * incoming HTML is mapped to the schema below and everything unknown is dropped.
 */

// ── Image alignment → inline style (also makes images responsive) ──
function alignStyle(align: string): string {
  const base = 'max-width:100%;height:auto;'
  if (align === 'left')  return base + 'float:left;margin:0 1rem 1rem 0;'
  if (align === 'right') return base + 'float:right;margin:0 0 1rem 1rem;'
  return base + 'display:block;margin-left:auto;margin-right:auto;' // center (default)
}

// Extend the base Image node with an `align` attribute rendered as inline style.
const ResponsiveImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-align') || 'center',
        renderHTML: () => ({}), // emitted via renderHTML below, not as a bare attr
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const align = (node.attrs.align as string) || 'center'
    const { style, ...rest } = HTMLAttributes as Record<string, string>
    return ['img', mergeAttributes(this.options.HTMLAttributes, rest, {
      'data-align': align,
      style: alignStyle(align),
    })]
  },
})

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [mode, setMode] = useState<'visual' | 'source'>('visual')
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false, // required under Next.js SSR
    shouldRerenderOnTransaction: true, // v3: keep toolbar active/disabled states in sync
    editorProps: {
      // HTML parse-on-paste: rich HTML (text/html) is parsed by TipTap already.
      // But raw HTML pasted as PLAIN TEXT (e.g. from a .html file or code view)
      // would otherwise show literal tags — parse it into real blocks so
      // non-technical writers never see raw markup.
      handlePaste(view, event) {
        const dt = event.clipboardData
        if (!dt || dt.types.includes('text/html')) return false // let TipTap format rich HTML
        const text = dt.getData('text/plain')
        // Only intercept when the text actually looks like HTML markup.
        if (!text || !/<\/?(h[1-6]|p|ul|ol|li|strong|em|b|i|a|img|table|thead|tbody|tr|td|th|blockquote|br|div|span)\b/i.test(text)) {
          return false
        }
        const dom = new window.DOMParser().parseFromString(text, 'text/html')
        const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(dom.body, { preserveWhitespace: false })
        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView())
        return true
      },
    },
    extensions: [
      StarterKit.configure({
        // Parse all heading levels; toolbar still only offers H1–H3.
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        // Non-technical editor — no code blocks (removed from toolbar too).
        codeBlock: false,
        link: {
          openOnClick: false,
          HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer nofollow' },
        },
      }),
      ResponsiveImage,
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  // ── Link: prompt for URL on current selection (opens in new tab by default) ──
  function setLink() {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return              // cancelled
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  // ── Image: upload local file → Cloudinary → insert ──
  async function uploadAndInsert(file: File) {
    if (!editor) return
    setUploadError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.success) { setUploadError(data.error || 'Upload failed'); return }
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
    } catch {
      setUploadError('Upload failed — please try again')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // Visual ↔ HTML source toggle. `value` (the stored HTML) is the single source
  // of truth: onUpdate keeps it current from visual edits, and the source
  // textarea writes to it directly. Toggling never mutates `value` — only real
  // edits do — so switching modes can't lose content. Going back to Visual just
  // reloads `value` into the editor for display (emitUpdate:false so it doesn't
  // clobber the raw HTML the user may have hand-written in source mode).
  function toggleMode() {
    if (!editor) return
    if (mode === 'source') {
      editor.commands.setContent(value, { emitUpdate: false })
      setMode('visual')
    } else {
      setMode('source')
    }
  }

  const imgActive = editor.isActive('image')
  const tableActive = editor.isActive('table')

  return (
    <div className="rte">
      <div className="rte-toolbar">
        {mode === 'visual' && <>
        {/* Block type */}
        <Btn on={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()} label="P" title="Paragraph" />
        <Btn on={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="H1" title="Heading 1" />
        <Btn on={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" title="Heading 2" />
        <Btn on={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" title="Heading 3" />

        <Sep />

        {/* Inline marks */}
        <Btn on={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label={<b>B</b>} title="Bold" />
        <Btn on={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label={<i>I</i>} title="Italic" />
        <Btn on={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label={<u>U</u>} title="Underline" />
        <Btn on={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} label={<s>S</s>} title="Strikethrough" />

        <Sep />

        {/* Lists / blocks */}
        <Btn on={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label={<Icon d="bullet" />} title="Bullet List" />
        <Btn on={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label={<Icon d="ordered" />} title="Numbered List" />
        <Btn on={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label={<Icon d="quote" />} title="Quote" />
        <Btn on={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} label={<Icon d="hr" />} title="Horizontal Divider" />

        <Sep />

        {/* Link & Image */}
        <Btn on={editor.isActive('link')} onClick={setLink} label={<Icon d="link" />} title="Insert Link" />
        <Btn on={false} onClick={() => fileRef.current?.click()} label={<Icon d="image" />} title="Insert Image" />

        <Sep />

        {/* Table — insert always; row/col controls appear when inside a table */}
        <Btn on={tableActive} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} label={<Icon d="table" />} title="Insert Table" />
        {tableActive && <>
          <Btn on={false} onClick={() => editor.chain().focus().addRowAfter().run()} label="+Row" title="Add row below" />
          <Btn on={false} onClick={() => editor.chain().focus().addColumnAfter().run()} label="+Col" title="Add column after" />
          <Btn on={false} onClick={() => editor.chain().focus().deleteRow().run()} label="−Row" title="Delete row" />
          <Btn on={false} onClick={() => editor.chain().focus().deleteColumn().run()} label="−Col" title="Delete column" />
          <Btn on={false} onClick={() => editor.chain().focus().deleteTable().run()} label={<Icon d="trash" />} title="Delete table" />
        </>}

        <Sep />

        {/* Image alignment — only meaningful when an image is selected */}
        <Btn on={imgActive && editor.isActive('image', { align: 'left' })} disabled={!imgActive} onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()} label={<Icon d="alignLeft" />} title="Align image left" />
        <Btn on={imgActive && editor.isActive('image', { align: 'center' })} disabled={!imgActive} onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()} label={<Icon d="alignCenter" />} title="Align image center" />
        <Btn on={imgActive && editor.isActive('image', { align: 'right' })} disabled={!imgActive} onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()} label={<Icon d="alignRight" />} title="Align image right" />

        <Sep />

        {/* History */}
        <Btn on={false} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} label={<Icon d="undo" />} title="Undo" />
        <Btn on={false} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} label={<Icon d="redo" />} title="Redo" />
        </>}

        {/* Visual ↔ HTML source toggle — right-aligned, shown in both modes */}
        <button type="button" onClick={toggleMode} title="Toggle HTML source view"
          className={`rte-btn rte-mode-toggle${mode === 'source' ? ' is-active' : ''}`}>
          {mode === 'source' ? 'Visual' : '</> HTML'}
        </button>
      </div>

      {uploading && <div className="rte-status">Uploading image…</div>}
      {uploadError && <div className="rte-status rte-status-err">{uploadError}</div>}

      {mode === 'visual'
        ? <EditorContent editor={editor} className="rte-content" />
        : <div className="rte-source"><HtmlSourceEditor value={value} onChange={onChange} /></div>
      }

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) uploadAndInsert(f) }} />

      <RteStyles />
    </div>
  )
}

function Btn({
  on, disabled, onClick, label, title,
}: {
  on: boolean
  disabled?: boolean
  onClick: () => void
  label: React.ReactNode
  title: string
}) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} disabled={disabled}
      className={`rte-btn${on ? ' is-active' : ''}`}>
      {label}
    </button>
  )
}

function Sep() { return <span className="rte-sep" /> }

// Minimal 16×16 stroke icons.
function Icon({ d }: { d: string }) {
  const paths: Record<string, React.ReactNode> = {
    bullet: <><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><path d="M8 6h9M8 12h9" /></>,
    ordered: <><path d="M8 6h9M8 12h9" /><path d="M3 5h1v3M3 8h2" /><path d="M3 11h2l-2 2h2" /></>,
    quote: <path d="M7 7c-2 0-3 1.5-3 3s1 2.5 2.5 2.5S9 14 8 16M17 7c-2 0-3 1.5-3 3s1 2.5 2.5 2.5S19 14 18 16" />,
    hr: <path d="M4 12h16" />,
    link: <path d="M9 13a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1M13 9a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1" />,
    image: <><rect x="3" y="4" width="16" height="14" rx="2" /><circle cx="8" cy="9" r="1.5" /><path d="m19 15-4-4L5 18" /></>,
    alignLeft: <path d="M4 6h16M4 10h9M4 14h16M4 18h9" />,
    alignCenter: <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />,
    alignRight: <path d="M4 6h16M11 10h9M4 14h16M11 18h9" />,
    undo: <path d="M9 7 4 12l5 5M4 12h11a4 4 0 0 1 0 8h-1" />,
    redo: <path d="m15 7 5 5-5 5M20 12H9a4 4 0 0 0 0 8h1" />,
    table: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 10h18M3 15h18M9 4v16M15 4v16" /></>,
    trash: <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />,
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[d]}
    </svg>
  )
}

function RteStyles() {
  return (
    <style>{`
      /* No overflow:hidden here — it would trap the sticky toolbar inside a
         non-scrolling container and cancel the sticky behaviour. */
      .rte { border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); }
      .rte-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; padding: 6px; background: var(--bg-elevated); border-bottom: 1px solid var(--border); border-radius: var(--radius-sm) var(--radius-sm) 0 0; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 0 var(--border); }
      .rte-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 30px; height: 30px; padding: 0 7px; border: 1px solid transparent; border-radius: var(--radius-sm); background: transparent; color: var(--fg-muted); font-size: 0.85rem; font-family: inherit; cursor: pointer; transition: background var(--transition-fast), color var(--transition-fast); }
      .rte-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--fg); }
      .rte-btn.is-active { background: var(--accent); color: #fff; }
      .rte-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .rte-btn b, .rte-btn i, .rte-btn u, .rte-btn s { font-size: 0.9rem; line-height: 1; }
      .rte-sep { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
      .rte-status { padding: 6px 12px; font-size: 0.8rem; color: var(--fg-muted); background: var(--bg-elevated); border-bottom: 1px solid var(--border); }
      .rte-status-err { color: #dc2626; }
      /* Visual/HTML toggle — pushed to the right, always visible */
      .rte-mode-toggle { margin-left: auto; padding: 0 12px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.02em; border-color: var(--border); font-family: var(--font-mono); }
      .rte-mode-toggle:not(.is-active) { color: var(--fg); }
      /* HTML source editor (CodeMirror) */
      .rte-source .cm-editor { border-radius: 0 0 var(--radius-sm) var(--radius-sm); font-size: 0.82rem; max-width: 100%; }
      .rte-source .cm-editor.cm-focused { outline: none; }
      .rte-source .cm-scroller { font-family: var(--font-mono); }
      /* Soft-wrap: break even long unbroken tokens (URLs) so nothing overflows. */
      .rte-source .cm-line { overflow-wrap: anywhere; word-break: break-word; }
      .rte-source-loading { padding: 16px 18px; color: var(--fg-muted); font-size: 0.85rem; }

      .rte-content .ProseMirror { min-height: 380px; padding: 16px 18px; outline: none; color: var(--fg); font-size: 0.95rem; line-height: 1.7; overflow-wrap: anywhere; }
      .rte-content .ProseMirror::after { content: ""; display: block; clear: both; }
      .rte-content .ProseMirror > * + * { margin-top: 0.75em; }
      .rte-content .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; line-height: 1.25; }
      .rte-content .ProseMirror h2 { font-size: 1.4rem; font-weight: 700; line-height: 1.3; }
      .rte-content .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; line-height: 1.35; }
      .rte-content .ProseMirror p { margin: 0; }
      .rte-content .ProseMirror ul, .rte-content .ProseMirror ol { padding-left: 1.5rem; }
      .rte-content .ProseMirror ul { list-style: disc; }
      .rte-content .ProseMirror ol { list-style: decimal; }
      .rte-content .ProseMirror li { margin: 0.15em 0; }
      .rte-content .ProseMirror blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--fg-muted); font-style: italic; }
      .rte-content .ProseMirror pre { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; white-space: pre; }
      .rte-content .ProseMirror pre code { background: none; border: 0; padding: 0; font-size: inherit; color: inherit; }
      .rte-content .ProseMirror code { font-family: var(--font-mono); font-size: 0.85em; background: var(--bg-sunken); border: 1px solid var(--border); border-radius: 4px; padding: 1px 5px; }
      /* Tables inside the editor */
      .rte-content .ProseMirror table { border-collapse: collapse; width: 100%; margin: 0.5em 0; overflow: hidden; }
      .rte-content .ProseMirror th, .rte-content .ProseMirror td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; vertical-align: top; min-width: 3em; }
      .rte-content .ProseMirror th { background: var(--bg-elevated); font-weight: 600; }
      .rte-content .ProseMirror .selectedCell { background: color-mix(in srgb, var(--accent) 15%, transparent); }
      .rte-content .ProseMirror .column-resize-handle { background: var(--accent); width: 3px; position: absolute; right: -1px; top: 0; bottom: 0; pointer-events: none; }
      .rte-content .ProseMirror hr { border: none; border-top: 1px solid var(--border); margin: 1.2em 0; }
      .rte-content .ProseMirror a { color: var(--accent); text-decoration: underline; }
      .rte-content .ProseMirror img { border-radius: var(--radius-sm); }
      .rte-content .ProseMirror img.ProseMirror-selectednode { outline: 2px solid var(--accent); outline-offset: 2px; }
      .rte-content .ProseMirror p.is-editor-empty:first-child::before { content: "Write your blog post… Paste from Docs, Word or Notion and formatting is kept."; color: var(--fg-subtle); float: left; height: 0; pointer-events: none; }

      /* ── Responsive: tighten the toolbar so all buttons stay reachable on
            small screens (they wrap instead of overflowing). ── */
      @media (max-width: 640px) {
        .rte-toolbar { gap: 1px; padding: 5px 6px; }
        .rte-btn { min-width: 30px; height: 30px; padding: 0 6px; }
        .rte-sep { margin: 0 2px; }
        /* Toggle flows inline with the last row instead of forcing a gap */
        .rte-mode-toggle { margin-left: 0; }
      }
      @media (max-width: 400px) {
        .rte-sep { display: none; }
        .rte-content .ProseMirror, .rte-source-loading { padding: 12px 14px; }
      }
    `}</style>
  )
}
