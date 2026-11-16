/* Homepage motion. A port of the reference page's inline script, scoped to the homepage root so it
   never touches the rest of the site. It covers the mobile menu, the section marker in the header,
   the integrations flow loop, the hero story and the meeting brief. Everything it starts is stopped
   again by the function it returns, so React strict mode and route changes are safe. */

const nop = () => {}

export function initHomeMotion(root: HTMLElement): () => void {
  const timers = new Set<number>()
  const cleanups: Array<() => void> = []

  // timers tracked so they can all be cleared on cleanup
  const tm = (fn: () => void, ms: number): number => {
    const id = window.setTimeout(() => { timers.delete(id); fn() }, ms)
    timers.add(id)
    return id
  }
  const untm = (id: number | null) => {
    if (id == null) return
    window.clearTimeout(id)
    timers.delete(id)
  }
  const listen = (el: EventTarget, type: string, fn: (e: Event) => void) => {
    el.addEventListener(type, fn)
    cleanups.push(() => el.removeEventListener(type, fn))
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hasIO = 'IntersectionObserver' in window
  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel)
  const $$ = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel))

  /* ---------- mobile menu ---------- */
  const btn = $<HTMLButtonElement>('.menu-btn')
  const panel = $<HTMLElement>('#mnav')
  if (btn && panel) {
    const set = (open: boolean) => {
      btn.setAttribute('aria-expanded', String(open))
      panel.hidden = !open
    }
    listen(btn, 'click', () => set(btn.getAttribute('aria-expanded') !== 'true'))
    listen(panel, 'click', (e) => { if ((e.target as HTMLElement).tagName === 'A') set(false) })
    listen(document, 'keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Escape' && !panel.hidden) { set(false); btn.focus() }
    })
    listen(document, 'click', (e) => {
      if (!panel.hidden && !(e.target as HTMLElement).closest('.nav')) set(false)
    })
  }

  /* ---------- header: mark the section in view ---------- */
  const links = $$<HTMLAnchorElement>('.nav-links a')
  if (hasIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        links.forEach((a) => {
          if (en.target.id && a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true')
          else a.removeAttribute('aria-current')
        })
      })
    }, { rootMargin: '-45% 0px -50% 0px' })
    $$('main section').forEach((s) => io.observe(s))
    cleanups.push(() => io.disconnect())
  }

  /* ---------- integrations: new data arrives, travels into Clarant, comes out prepared ---------- */
  const flowEl = $<HTMLElement>('#flow')
  if (flowEl && !reduce) {
    const flow: HTMLElement = flowEl
    const EV = [
      { tool: 'slack', name: 'Slack', msg: 'Dana: “Need your OK on Northwind pricing before 3:00.”', link: 'Linked to Dana, Northwind and your 3:00 call', out: 0 },
      { tool: 'outlook', name: 'Outlook', msg: 'Northwind renewal call starts in 46 minutes.', link: 'Pulled the last call notes and the unsent SSO quote', out: 1 },
      { tool: 'asana', name: 'Asana', msg: 'Vendor redlines: due yesterday, still open.', link: 'Matched to the handoff you gave Sam', out: 2 },
      { tool: 'clickup', name: 'ClickUp', msg: 'Website launch: copy deadline missed.', link: 'Third slip on this project since Oct 27', out: 3 },
      { tool: 'fathom', name: 'Fathom', msg: 'On the Acme call you promised a support contact.', link: 'Promise logged against the Acme renewal', out: 4 },
    ]
    const feed = flow.querySelector<HTMLElement>('.feed')!
    const fImg = feed.querySelector<HTMLImageElement>('img')!
    const fB = feed.querySelector<HTMLElement>('b')!
    const fS = feed.querySelector<HTMLElement>('span')!
    const wires = flow.querySelectorAll<HTMLElement>('.wire')
    const core = flow.querySelector<HTMLElement>('.core')!
    const cap = flow.querySelector<HTMLElement>('.core-cap')!
    const outs = flow.querySelectorAll<HTMLElement>('.outs li')
    const ctl = flow.querySelector<HTMLButtonElement>('.flow-ctl')
    let n = 0, seen = false, paused = false, busy = false, started = false

    const fire = (w: HTMLElement) => { w.classList.remove('go'); void w.offsetWidth; w.classList.add('go') }

    // one event, start to finish; a cycle always runs to its end so the picture never rests half-told
    function step() {
      busy = true
      n = (n + 1) % EV.length
      const e = EV[n]
      const tile = flow.querySelector<HTMLElement>(`[data-tool="${e.tool}"]`)!
      flow.querySelectorAll('.tiles .hit').forEach((t) => t.classList.remove('hit'))
      outs.forEach((o) => o.classList.remove('on'))
      feed.classList.add('swap')
      cap.classList.add('swap')
      tm(() => {
        tile.classList.add('hit')
        fImg.src = tile.querySelector<HTMLImageElement>('img')!.src
        fB.textContent = 'New in ' + e.name
        fS.textContent = e.msg
        feed.classList.remove('swap')
      }, 280)
      tm(() => fire(wires[0]), 1100)
      tm(() => {
        core.classList.remove('busy'); void core.offsetWidth; core.classList.add('busy')
        cap.textContent = e.link
        cap.classList.remove('swap')
      }, 1750)
      tm(() => fire(wires[1]), 2700)
      tm(() => { outs[e.out].classList.add('on'); core.classList.remove('busy') }, 3350)
      tm(() => { busy = false; next() }, 6200)
    }
    // the loop advances only while the diagram is on screen, the tab is visible and the visitor has not paused it
    function next() { if (!busy && seen && !paused && !document.hidden) step() }

    if (ctl) {
      ctl.hidden = false
      listen(ctl, 'click', () => {
        paused = !paused
        if (paused) ctl.setAttribute('data-paused', ''); else ctl.removeAttribute('data-paused')
        ctl.setAttribute('aria-label', paused ? 'Play the example' : 'Pause the example')
        next()
      })
    }
    listen(document, 'visibilitychange', next)
    if (hasIO) {
      const io = new IntersectionObserver((en) => {
        seen = en[0].isIntersecting
        if (seen && !started) { started = true; busy = true; tm(() => { busy = false; next() }, 2000) }
        else next()
      }, { threshold: 0.25 })
      io.observe(flow)
      cleanups.push(() => io.disconnect())
    } else {
      seen = true
      tm(next, 2600)
    }
  }

  /* ---------- hero story: four parts on one timer ---------- */
  const hs = $<HTMLElement>('#hs')
  if (hs) {
    const still = reduce
    const hq = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(hs.querySelectorAll<T>(s))
    const hSteps = hq<HTMLButtonElement>('.hs-step')
    const hBars = hq<HTMLElement>('.hs-bar b')
    const hCap = hs.querySelector<HTMLElement>('.hs-cap')!
    const hApps = hq<HTMLElement>('.hs-apps li')
    const hNotes = hq<HTMLElement>('.hs-notes li')
    const hCore = hs.querySelector<HTMLElement>('.core')!
    const hCoreCap = hs.querySelector<HTMLElement>('.hs-core p')!
    const hChecks = hq<HTMLElement>('.hs-checks li')
    const hWin = hs.querySelector<HTMLElement>('.hs-win')!
    const hTitle = hs.querySelector<HTMLElement>('.hs-t')!
    const hRows = hq<HTMLElement>('.hs-pri > li')
    const hCur = hs.querySelector<HTMLElement>('.hs-cur')!
    const hCtl = $<HTMLButtonElement>('#hs-ctl')!
    const BADGE = [17, 14, 4, 4, 5, 3]
    const CAP = [
      '<b>0</b> updates across six tools since 8:00 AM.',
      'Clarant reads every one, so you don’t have to.',
      'Three need you. The other 44 can wait.',
      'The next step is already drafted. Nothing goes out until you approve.',
    ]
    let ci = 0, si = -1, hTimer: number | null = null
    let auto = !still, frozen = false, dirty = false, hSeen = true, hOver = false

    const on = (c: string) => hs.classList.add(c)
    const off = (...cs: string[]) => cs.forEach((c) => hs.classList.remove(c))
    const pulse = () => { hCore.classList.remove('busy'); void hCore.offsetWidth; hCore.classList.add('busy') }
    // the bar over a part's name: p is how full it is (0 to 1), ms how long it takes to get there
    const fill = (k: number, p: number, ms?: number) => {
      const b = hBars[k]
      if (ms) void b.offsetWidth
      b.style.transitionDuration = (ms || 0) + 'ms'
      b.style.transform = 'scaleX(' + p + ')'
    }
    const rail = (c: number) => {
      hSteps.forEach((b, k) => {
        if (k === c) b.setAttribute('aria-current', 'step')
        else { b.removeAttribute('aria-current'); fill(k, k < c ? 1 : 0) }
      })
      if (hCap.getAttribute('data-c') !== String(c)) {
        hCap.setAttribute('data-c', String(c))
        hCap.innerHTML = CAP[c]
        hCap.style.animation = 'none'
        void hCap.offsetWidth
        hCap.style.animation = ''
      }
    }
    const badge = (k: number, v: number) => {
      if (v) hApps[k].querySelector('b')!.textContent = String(v)
      hApps[k].classList.toggle('has', v > 0)
    }
    const arrive = (k: number) => {
      let sum = 0
      const t = hCap.querySelector('b')
      for (let j = 0; j <= k; j++) sum += BADGE[j]
      hNotes[k].classList.add('in')
      badge(k, BADGE[k])
      hApps.forEach((li, j) => li.classList.toggle('hit', j === k))
      if (t) t.textContent = String(sum)
    }
    const left = () => {
      const count = hRows.filter((r) => !r.classList.contains('sent')).length
      hTitle.textContent = count > 1 ? count + ' things need you' : count ? '1 thing needs you' : 'Nothing else needs you'
    }
    const openRow = (k: number) => {
      hRows.forEach((r, j) => {
        r.classList.toggle('open', j === k)
        r.querySelector('.hs-row')!.setAttribute('aria-expanded', String(j === k))
      })
    }
    const send = (k: number) => { hRows[k].classList.add('sent'); left() }
    const cursorIn = () => {
      if (still) return
      const r = hs.getBoundingClientRect()
      hCur.style.transitionDuration = '0s'
      hCur.style.transform = `translate(${Math.round(r.width * 0.8)}px,${Math.round(r.height * 0.78)}px)`
      void hCur.offsetWidth
      hCur.style.transitionDuration = ''
      on('cur')
    }
    const cursorTo = (el: HTMLElement, fx: number, fy: number) => {
      if (still) return
      const r = hs.getBoundingClientRect(), b = el.getBoundingClientRect()
      hCur.style.transform = `translate(${Math.round(b.left - r.left + b.width * fx - 5)}px,${Math.round(b.top - r.top + b.height * fy - 3)}px)`
    }
    // the picture at the start of part c, set in one go
    const base = (c: number) => {
      off('gather', 'core-on', 'cur', 'press')
      hs.classList.toggle('apps', c < 2)
      hs.classList.toggle('win', c > 1)
      hs.classList.toggle('rows', c > 2)
      hNotes.forEach((x) => x.classList.toggle('in', c === 1))
      hApps.forEach((li, k) => { li.classList.remove('hit'); badge(k, c === 1 ? BADGE[k] : 0) })
      hChecks.forEach((x) => x.classList.remove('on'))
      hCore.classList.remove('busy')
      hCoreCap.textContent = 'Reading 47 updates'
      hRows.forEach((r) => r.classList.remove('sent'))
      openRow(c === 3 ? 0 : -1)
      left()
      rail(c)
      fill(c, 0)
      if (c === 1) { const t = hCap.querySelector('b'); if (t) t.textContent = '47' }
    }

    type Beat = [number, () => void]
    const CH: Beat[][] = [[], [], [], []]
    hNotes.forEach((_, k) => CH[0].push([k ? 420 : 500, () => arrive(k)]))
    CH[0].push([700, () => hApps.forEach((li) => li.classList.remove('hit'))], [1000, nop])
    CH[1].push(
      [300, () => { on('gather'); hApps.forEach((_, k) => badge(k, 0)) }],
      [380, () => { on('core-on'); pulse() }],
      [800, () => { hChecks[0].classList.add('on'); pulse() }],
      [750, () => { hChecks[1].classList.add('on'); pulse() }],
      [750, () => { hChecks[2].classList.add('on'); hCoreCap.textContent = '47 read. 3 need you.' }],
      [1500, nop],
    )
    CH[2].push([400, () => on('rows')], [1300, () => openRow(0)], [2000, nop])
    CH[3].push(
      [500, cursorIn],
      [150, () => cursorTo(hRows[0].querySelector<HTMLElement>('.go')!, 0.62, 0.5)],
      [1150, () => on('press')],
      [220, () => { off('press'); send(0) }],
      [1400, () => cursorTo(hRows[1].querySelector<HTMLElement>('.hs-row')!, 0.55, 0.62)],
      [1100, () => on('press')],
      [200, () => { off('press'); openRow(1) }],
      [700, () => off('cur')],
      [4200, nop],
    )
    // how far through its part each beat ends, in milliseconds; the last entry is the length of the part
    const SUM = CH.map((S) => { let t = 0; return S.map((s) => (t += s[0])) })

    const hHold = () => {
      if (hTimer == null) return
      untm(hTimer)
      hTimer = null
      // stop the bar where it has got to
      const m = /\(([^,]+)/.exec(getComputedStyle(hBars[ci]).transform)
      if (m) fill(ci, parseFloat(m[1]))
    }
    const hRun = (): void => {
      if (hTimer != null || frozen || !hSeen || document.hidden) return
      const S = CH[ci]
      const d = si < 0 ? (ci < 2 ? 450 : 0) : si < S.length ? S[si][0] : -1
      // a part always plays to its end; the loop then waits while the visitor's pointer or focus is on the window
      if (d < 0) {
        if (auto && !(hOver && ci > 1)) hGo((ci + 1) % CH.length)
        return
      }
      if (si >= 0) fill(ci, SUM[ci][si] / SUM[ci][S.length - 1], d)
      hTimer = tm(() => {
        hTimer = null
        if (si < 0) base(ci); else S[si][1]()
        si++
        hRun()
      }, d)
    }
    const hGo = (c: number) => {
      hHold()
      ci = c
      si = -1
      if (still) {
        base(c)
        CH[c].forEach((s) => s[1]())
        si = CH[c].length
        fill(c, 1)
        return
      }
      if (c < 2) off('win', 'cur', 'press')
      hRun()
    }
    const ctlState = () => {
      const playing = auto && !frozen
      if (playing) hCtl.removeAttribute('data-paused'); else hCtl.setAttribute('data-paused', '')
      hCtl.setAttribute('aria-label', playing ? 'Pause the example' : 'Play the example')
    }
    // the visitor has touched the window: stop the loop and leave the picture in their hands
    const take = (c: number) => {
      auto = false; frozen = true; dirty = true
      hHold()
      off('cur', 'press')
      on('win'); on('rows')
      rail(c); fill(c, 1); ctlState()
    }

    hs.querySelector<HTMLElement>('.hs-rail')!.hidden = false
    hSteps.forEach((b, k) => listen(b, 'click', () => {
      auto = false; frozen = false; dirty = false
      ctlState(); hGo(k); rail(k); fill(k, 0)
    }))
    hRows.forEach((r, k) => {
      const row = r.querySelector<HTMLElement>('.hs-row')!
      listen(row, 'click', () => {
        const was = r.classList.contains('open')
        take(2)
        openRow(was ? -1 : k)
      })
      listen(r.querySelector<HTMLElement>('.go')!, 'click', () => { take(3); send(k); row.focus() })
    })
    listen(hWin, 'pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') hOver = true })
    listen(hWin, 'pointerleave', () => { hOver = false; hRun() })
    listen(hWin, 'focusin', () => { hOver = true })
    listen(hWin, 'focusout', () => { hOver = false; hRun() })
    if (!still) {
      hCtl.hidden = false
      listen(hCtl, 'click', () => {
        if (auto && !frozen) { frozen = true; hHold() }
        else {
          auto = true; frozen = false
          if (dirty) { dirty = false; hGo(0) } else hRun()
        }
        ctlState()
      })
      listen(document, 'visibilitychange', () => { if (document.hidden) hHold(); else hRun() })
      if (hasIO) {
        const io = new IntersectionObserver((en) => {
          hSeen = en[0].isIntersecting
          if (hSeen) hRun(); else hHold()
        }, { threshold: 0.2 })
        io.observe(hs)
        cleanups.push(() => io.disconnect())
      }
    }
    rail(still ? 2 : 0)
    hGo(still ? 2 : 0)
  }

  /* ---------- meeting brief: assembles once, source by source, when it scrolls into view ---------- */
  const prep = $<HTMLElement>('#prep')
  if (prep) {
    prep.classList.add('wait')
    const rows = Array.from(prep.querySelectorAll<HTMLElement>('.bw-row,.bw-f'))
    const stat = $<HTMLElement>('#prep-status')!
    const stTxt = stat.querySelector<HTMLElement>('.st')!
    const done = () => {
      rows.forEach((r) => r.classList.add('in'))
      stat.classList.add('done')
      stTxt.textContent = 'Ready at 2:50 PM'
    }
    if (reduce || !hasIO) {
      prep.classList.remove('wait')
      done()
    } else {
      stTxt.textContent = 'Preparing brief'
      // watch the brief itself and start as soon as its top clears the lower edge of the screen
      const io2 = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return
        io2.disconnect()
        rows.forEach((r, k) => tm(() => r.classList.add('in'), 300 + k * 260))
        tm(done, 300 + rows.length * 260)
      }, { threshold: 0, rootMargin: '0px 0px -15% 0px' })
      io2.observe(prep.querySelector('.brief-win')!)
      cleanups.push(() => io2.disconnect())
    }
  }

  return () => {
    timers.forEach((id) => window.clearTimeout(id))
    timers.clear()
    cleanups.forEach((f) => f())
    cleanups.length = 0
  }
}
