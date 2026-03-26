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
  const [status, setStatus] = useState('idle') // idle | running | complete
  const [currentStep, setCurrentStep] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseTitle, setPhaseTitle] = useState('')
  const [speechText, setSpeechText] = useState('')
  const [spotlightTarget, setSpotlightTarget] = useState(null) // DOMRect | null
  const [totalPhases] = useState(6)

  /* Refs for cleanup */
  const abortRef = useRef(null)
  const typedRef = useRef(null)
  const timeoutsRef = useRef(new Set())
  const runningRef = useRef(false)

  /* ─── Speech (Typed.js + ElevenLabs TTS in parallel) ─── */
  const speakTo = useCallback((textEl, text, speed = 20, stepId = null) => {
    // Typed.js visual typing
    const typingPromise = new Promise((resolve) => {
      if (typedRef.current) {
        typedRef.current.destroy()
        typedRef.current = null
      }
      if (!textEl) { resolve(); return }
      textEl.innerHTML = ''
      typedRef.current = new Typed(textEl, {
        strings: [text],
        typeSpeed: speed,
        showCursor: false,
        onComplete: () => resolve(),
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

    // Update phase info
    if (step.phaseTitle) {
      setCurrentPhase(step.phase)
      setPhaseTitle(step.phaseTitle)
    }
    setCurrentStep(step)

    // Pre-delay
    if (step.delay) await sleep(step.delay)
    if (signal.aborted) return

    // Highlight before action
    if (step.highlightBefore && step.selector) {
      spotlight(step.selector)
      await sleep(800)
      if (signal.aborted) return
    }

    // Speak (non-blocking for most steps, blocking for 'speak' type)
    const speechPromise = (step.speak || step.text)
      ? speakTo(textEl, step.speak || step.text, step.typeSpeed || 20, step.id)
      : Promise.resolve()

    if (step.type === 'speak') {
      await speechPromise
      if (signal.aborted) return
      await sleep(step.delayAfter ?? 600)
      return
    }

    // Execute primary action
    switch (step.type) {
      case 'navigate':
        await executeNavigate(step, navigate, signal)
        break
      case 'click':
        if (step.selector) spotlight(step.selector)
        await sleep(400)
        await executeClick(step, signal)
        break
      case 'type':
        if (step.selector) spotlight(step.selector)
        await sleep(300)
        await executeType(step, signal)
        break
      case 'select':
        if (step.selector) spotlight(step.selector)
        await sleep(300)
        await executeSelect(step, signal)
        break
      case 'highlight':
        if (step.selector) spotlight(step.selector)
        await speechPromise
        break
      case 'draw-signature':
        if (step.selector || step.canvasSelector) {
          spotlight(step.selector || step.canvasSelector)
        }
        await sleep(400)
        await executeDrawSignature(
          { ...step, selector: step.canvasSelector || step.selector },
          signal
        )
        break
      case 'wait':
        await sleep(step.duration || 1000)
        break
      case 'call':
        if (step.fn) await step.fn(signal)
        break
      default:
        break
    }

    if (signal.aborted) return

    // Clear spotlight
    spotlight(null)

    // Post-delay
    await sleep(step.delayAfter ?? 600)
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

  /* ─── Skip / abort the demo ─── */
  const skipDemo = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    stopCurrentAudio()
    if (typedRef.current) {
      typedRef.current.destroy()
      typedRef.current = null
    }
    gsap.killTweensOf('*')
    timeoutsRef.current.forEach(id => clearTimeout(id))
    timeoutsRef.current.clear()

    setSpotlightTarget(null)
    setStatus('complete')
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
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}
