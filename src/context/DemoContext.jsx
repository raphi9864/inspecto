import { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Typed from 'typed.js'
import gsap from 'gsap'
import { getScript } from '../data/demoScripts'
import {
  executeClick, executeType, executeSelect,
  executeHighlight, executeDrawSignature,
  executeNavigate, sleep, findTarget,
} from '../lib/demo-actions'
import { speakStep, stopCurrentAudio } from '../lib/audioUtils'

const DemoContext = createContext(null)

export function useDemoContext() {
  return useContext(DemoContext)
}

/**
 * DemoProvider — state machine + engine for the automated demo.
 * States: idle → running → complete
 */
export function DemoProvider({ children }) {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const script = useMemo(() => getScript(i18n.language), [i18n.language])

  /* State */
  const [status, setStatus] = useState('idle') // idle | running | paused | complete
  const [currentStep, setCurrentStep] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseTitle, setPhaseTitle] = useState('')
  const [speechText, setSpeechText] = useState('')
  const [spotlightTarget, setSpotlightTarget] = useState(null) // DOMRect | null
  const [totalPhases] = useState(6)

  /* Refs for cleanup */
  const abortRef = useRef(null)        // main demo abort
  const stepAbortRef = useRef(null)    // per-step abort (for "Next")
  const typedRef = useRef(null)
  const typedResolveRef = useRef(null) // resolve fn for typing promise
  const timeoutsRef = useRef(new Set())
  const runningRef = useRef(false)
  const pausedRef = useRef(false)
  const skippingRef = useRef(false)

  /* ─── Speech (Typed.js + ElevenLabs TTS in parallel) ─── */
  const speakTo = useCallback((textEl, text, speed = 20, stepId = null) => {
    // Typed.js visual typing
    const typingPromise = new Promise((resolve) => {
      if (typedRef.current) {
        typedRef.current.destroy()
        typedRef.current = null
      }
      typedResolveRef.current = resolve
      if (!textEl) { resolve(); return }
      textEl.innerHTML = ''
      typedRef.current = new Typed(textEl, {
        strings: [text],
        typeSpeed: speed,
        showCursor: false,
        onComplete: () => { typedResolveRef.current = null; resolve() },
      })
    })

    // TTS audio (reads voice settings from localStorage)
    const lang = localStorage.getItem('inspecto_lang') || 'fr'
    const gender = localStorage.getItem('inspecto_voice_gender') || 'male'
    const audioPromise = speakStep(stepId, text, lang, gender)

    // Wait for both to complete
    return Promise.all([typingPromise, audioPromise])
  }, [])

  /* ─── Spotlight an element ─── */
  const spotlight = useCallback((selector) => {
    if (!selector) { setSpotlightTarget(null); return }
    const el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector
    if (el) {
      const rect = el.getBoundingClientRect()
      setSpotlightTarget({ x: rect.x, y: rect.y, w: rect.width, h: rect.height })
    } else {
      setSpotlightTarget(null)
    }
  }, [])

  /* ─── Execute a single step ─── */
  const executeStep = useCallback(async (step, signal, textEl) => {
    if (signal.aborted) return

    // Create per-step abort controller (for "Next" button)
    const stepController = new AbortController()
    stepAbortRef.current = stepController
    const ss = stepController.signal // step signal

    // Combine: abort step if main demo is aborted
    const onMainAbort = () => stepController.abort()
    signal.addEventListener('abort', onMainAbort, { once: true })

    try {
      // Update phase info
      if (step.phaseTitle) {
        setCurrentPhase(step.phase)
        setPhaseTitle(step.phaseTitle)
      }
      setCurrentStep(step)

      // Pre-delay
      if (step.delay) await sleep(step.delay, ss)
      if (ss.aborted) return

      // Highlight before action
      if (step.highlightBefore && step.selector) {
        spotlight(step.selector)
        await sleep(800, ss)
        if (ss.aborted) return
      }

      // Speak (non-blocking for most steps, blocking for 'speak' type)
      const speechPromise = (step.speak || step.text)
        ? speakTo(textEl, step.speak || step.text, step.typeSpeed || 20, step.id)
        : Promise.resolve()

      if (step.type === 'speak') {
        await Promise.race([speechPromise, new Promise(r => ss.addEventListener('abort', r, { once: true }))])
        if (ss.aborted) return
        await sleep(step.delayAfter ?? 600, ss)
        return
      }

      // Execute primary action
      switch (step.type) {
        case 'navigate':
          await executeNavigate(step, navigate, ss)
          break
        case 'click':
          if (step.selector) spotlight(step.selector)
          await sleep(400, ss)
          if (!ss.aborted) await executeClick(step, ss)
          break
        case 'type':
          if (step.selector) spotlight(step.selector)
          await sleep(300, ss)
          if (!ss.aborted) await executeType(step, ss)
          break
        case 'select':
          if (step.selector) spotlight(step.selector)
          await sleep(300, ss)
          if (!ss.aborted) await executeSelect(step, ss)
          break
        case 'highlight':
          if (step.selector) spotlight(step.selector)
          await Promise.race([speechPromise, new Promise(r => ss.addEventListener('abort', r, { once: true }))])
          break
        case 'draw-signature':
          if (step.selector || step.canvasSelector) {
            spotlight(step.selector || step.canvasSelector)
          }
          await sleep(400, ss)
          if (!ss.aborted) await executeDrawSignature(
            { ...step, selector: step.canvasSelector || step.selector },
            ss
          )
          break
        case 'wait':
          await sleep(step.duration || 1000, ss)
          break
        case 'call':
          if (step.fn && !ss.aborted) await step.fn(ss)
          break
        default:
          break
      }

      if (ss.aborted) return

      // Clear spotlight
      spotlight(null)

      // Post-delay
      await sleep(step.delayAfter ?? 600, ss)
    } finally {
      signal.removeEventListener('abort', onMainAbort)
      stepAbortRef.current = null
    }
  }, [navigate, speakTo, spotlight])

  /* ─── Request demo start (mounts avatar, then avatar calls runEngine) ─── */
  const startDemo = useCallback(() => {
    if (runningRef.current) return
    setStatus('running')
    setCurrentPhase(1)
  }, [])

  /* ─── Run the engine (called by DemoAvatar once textRef is ready) ─── */
  const runEngine = useCallback(async (textElRef) => {
    if (runningRef.current) return
    runningRef.current = true

    const controller = new AbortController()
    abortRef.current = controller
    const signal = controller.signal

    for (const step of script) {
      if (signal.aborted) break
      try {
        await executeStep(step, signal, textElRef?.current)
      } catch (err) {
        console.warn('[DemoEngine] Step error:', step.id, err)
      }
      if (step.endDemo) break
    }

    if (!signal.aborted) {
      setStatus('complete')
      sessionStorage.setItem('demo-seen', '1')
    }

    spotlight(null)
    runningRef.current = false
  }, [executeStep, spotlight, script])

  /* ─── Pause the demo ─── */
  const pauseDemo = useCallback(() => {
    if (status !== 'running') return
    pausedRef.current = true
    setStatus('paused')
    stopCurrentAudio()
    if (typedRef.current) {
      typedRef.current.stop()
    }
  }, [status])

  /* ─── Resume the demo ─── */
  const resumeDemo = useCallback(() => {
    if (status !== 'paused') return
    pausedRef.current = false
    setStatus('running')
  }, [status])

  /* ─── Skip current step, advance to next ─── */
  const nextStep = useCallback(() => {
    if (skippingRef.current) return
    skippingRef.current = true

    // Stop audio + typed
    stopCurrentAudio()
    if (typedRef.current) {
      typedRef.current.destroy()
      typedRef.current = null
    }
    // Resolve any pending typing promise
    if (typedResolveRef.current) {
      typedResolveRef.current()
      typedResolveRef.current = null
    }

    // Abort only the current step (not the whole demo)
    if (stepAbortRef.current) {
      stepAbortRef.current.abort()
    }

    // Resume if paused
    if (pausedRef.current) {
      pausedRef.current = false
      setStatus('running')
    }

    // Reset guard after a tick
    setTimeout(() => { skippingRef.current = false }, 50)
  }, [])

  /* ─── Skip / abort the demo ─── */
  const skipDemo = useCallback(() => {
    if (stepAbortRef.current) stepAbortRef.current.abort()
    if (abortRef.current) abortRef.current.abort()
    stopCurrentAudio()
    if (typedRef.current) {
      typedRef.current.destroy()
      typedRef.current = null
    }
    if (typedResolveRef.current) {
      typedResolveRef.current()
      typedResolveRef.current = null
    }
    gsap.killTweensOf('*')
    timeoutsRef.current.forEach(id => clearTimeout(id))
    timeoutsRef.current.clear()

    setSpotlightTarget(null)
    setStatus('complete')
    pausedRef.current = false
    skippingRef.current = false
    runningRef.current = false
    sessionStorage.setItem('demo-seen', '1')
    navigate('/app')
  }, [navigate])

  const value = {
    status,
    currentStep,
    currentPhase,
    phaseTitle,
    totalPhases,
    speechText,
    spotlightTarget,
    startDemo,
    runEngine,
    skipDemo,
    pauseDemo,
    resumeDemo,
    nextStep,
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}
