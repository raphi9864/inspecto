/**
 * Demo Action Utilities
 * Low-level functions to interact with the DOM during the automated demo.
 * Works with React controlled inputs via native property descriptors.
 */
import gsap from 'gsap'

/* ─── DOM helpers ─── */

export function findTarget(selector, matchText, matchIndex = 0) {
  let elements = [...document.querySelectorAll(selector)]
  if (matchText) {
    elements = elements.filter(el => el.textContent.trim().includes(matchText))
  }
  return elements[matchIndex] || null
}

export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector)
    if (el) return resolve(el)

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector)
      if (found) { observer.disconnect(); resolve(found) }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Timeout waiting for ${selector}`))
    }, timeout)
  })
}

export function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/* ─── React-compatible input setter ─── */

function nativeSet(element, value) {
  const proto =
    element.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : element.tagName === 'SELECT'
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  if (setter) {
    setter.call(element, value)
    const eventType = element.tagName === 'SELECT' ? 'change' : 'input'
    element.dispatchEvent(new Event(eventType, { bubbles: true }))
  }
}

/* ─── Action executors ─── */

export async function executeClick(step, signal) {
  const el = await resolveTarget(step, signal)
  if (!el || signal?.aborted) return
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  await sleep(300)
  el.click()
}

export async function executeType(step, signal) {
  const el = await resolveTarget(step, signal)
  if (!el || signal?.aborted) return
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  el.focus()
  await sleep(200)

  if (step.clearFirst) {
    nativeSet(el, '')
    await sleep(100)
  }

  const text = step.value || ''
  for (let i = 0; i < text.length; i++) {
    if (signal?.aborted) return
    nativeSet(el, text.slice(0, i + 1))
    await sleep(30 + Math.random() * 40)
  }
}

export async function executeSelect(step, signal) {
  const el = await resolveTarget(step, signal)
  if (!el || signal?.aborted) return
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  await sleep(200)
  nativeSet(el, step.value)
}

export async function executeHighlight(step, signal) {
  const el = await resolveTarget(step, signal)
  if (!el || signal?.aborted) return
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  // Highlighting is handled by the Spotlight component via callback
}

export async function executeDrawSignature(step, signal) {
  const canvas = await resolveTarget(step, signal)
  if (!canvas || signal?.aborted) return
  canvas.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  await sleep(400)

  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const style = getComputedStyle(document.documentElement)
  ctx.strokeStyle = style.getPropertyValue('--text-primary')?.trim() || '#f0f4f8'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Generate a natural-looking signature path
  const points = generateSignaturePoints(W, H)
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    if (signal?.aborted) return
    ctx.lineTo(points[i].x, points[i].y)
    ctx.stroke()
    await new Promise(r => requestAnimationFrame(r))
  }

  // Trigger a React-compatible event on the canvas
  canvas.dispatchEvent(new Event('mouseup', { bubbles: true }))
}

function generateSignaturePoints(W, H) {
  const points = []
  const startX = W * 0.15
  const startY = H * 0.55
  const length = W * 0.7
  const steps = 80

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = startX + t * length
    const y = startY +
      Math.sin(t * Math.PI * 3) * (H * 0.12) +
      Math.sin(t * Math.PI * 7) * (H * 0.04) +
      (Math.random() - 0.5) * 3
    points.push({ x, y })
  }
  return points
}

/* ─── Navigate with Prezi-style transition ─── */

export async function executeNavigate(step, navigateFn, signal) {
  if (signal?.aborted) return

  const content = document.querySelector('.app-content') || document.querySelector('#avatar-wrapper')

  if (step.transition === 'prezi' && content) {
    await gsap.to(content, { scale: 0.92, opacity: 0, duration: 0.4, ease: 'power2.in' })
  }

  navigateFn(step.route)

  // Wait for new page to mount
  if (step.waitForSelector) {
    try {
      await waitForElement(step.waitForSelector, 5000)
    } catch { /* timeout — continue anyway */ }
  }
  await sleep(400)

  const newContent = document.querySelector('.app-content') || document.querySelector('#avatar-wrapper')
  if (step.transition === 'prezi' && newContent) {
    gsap.fromTo(newContent,
      { scale: 1.08, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
    )
  }
}

/* ─── Resolve a step's target element ─── */

async function resolveTarget(step, signal) {
  const selector = step.selector
  if (!selector) return null

  try {
    const el = await waitForElement(selector, 4000)
    if (signal?.aborted) return null
    return el
  } catch {
    console.warn(`[DemoEngine] Target not found: ${selector}`)
    return null
  }
}
