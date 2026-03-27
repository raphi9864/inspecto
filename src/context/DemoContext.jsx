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

  /* Demo-specific language (does NOT affect the UI / i18n) */
  const [demoLang, setDemoLang] = useState(() => localStorage.getItem('inspecto_demo_lang') || i18n.language || 'fr')
  const demoLangRef = useRef(demoLang)

  const script = useMemo(() => getScript(demoLang), [demoLang])
  const phases = useMemo(() => {
    const seen = new Set()
    return script.reduce((acc, step, idx) => {
      if (step.phaseTitle && !seen.has(step.phase)) {
        seen.add(step.phase)
        acc.push({ phase: step.phase, phaseTitle: step.phaseTitle, firstStepIndex: idx })
      }
      return acc
    }, [])
  }, [script])

  /* State */
  const [status, setStatus] = useState('idle') // idle | running | paused | complete
  const [currentStep, setCurrentStep] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseTitle, setPhaseTitle] = useState('')
  const [speechText, setSpeechText] = useState('')
  const [spotlightTarget, setSpotlightTarget] = useState(null) // DOMRect | null
  const [totalPhases] = useState(6)
  const [muteVoice, setMuteVoice] = useState(false)

  /* Refs for cleanup */
  const abortRef = useRef(null)        // main demo abort
  const stepAbortRef = useRef(null)    // per-step abort (for "Next")
  const typedRef = useRef(null)
  const typedResolveRef = useRef(null) // resolve fn for typing promise
  const timeoutsRef = useRef(new Set())
  const runningRef = useRef(false)
  const pausedRef = useRef(false)
  const skippingRef = useRef(false)
  const stepIndexRef = useRef(0)
  const jumpingRef = useRef(false)
  const muteVoiceRef = useRef(false)
  const chapterAudioRef = useRef(null)
  const pauseResolveRef = useRef(null)

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

    // TTS audio — use demo-specific language (not the UI language)
    const lang = demoLangRef.current || 'fr'
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

      // Voice on phase titles: try static audio, fallback to Web Speech API
      if (step.phaseTitle && !muteVoiceRef.current) {
        if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
        window.speechSynthesis.cancel()
        const lang = demoLangRef.current || 'fr'
        const audio = new Audio(`/audio/chapter-${lang}-${step.phase}.mp3`)
        chapterAudioRef.current = audio
        audio.play().then(() => {
          audio.onended = () => { chapterAudioRef.current = null }
        }).catch(() => {
          // Fallback: Web Speech API
          chapterAudioRef.current = null
          const langMap = { fr: 'fr-FR', en: 'en-GB', it: 'it-IT', es: 'es-ES', de: 'de-DE' }
          const utterance = new SpeechSynthesisUtterance(step.speak || step.text || step.phaseTitle)
          utterance.lang = langMap[lang] || 'fr-FR'
          utterance.rate = 0.95
          utterance.pitch = 1.0
          utterance.volume = 1.0
          window.speechSynthesis.speak(utterance)
        })
        audio.onerror = () => { chapterAudioRef.current = null }
      }

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
  const startDemo = useCallback((lang) => {
    if (runningRef.current) return
    if (lang) {
      setDemoLang(lang)
      demoLangRef.current = lang
      localStorage.setItem('inspecto_demo_lang', lang)
    }
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

    stepIndexRef.current = 0
    while (stepIndexRef.current < script.length) {
      if (signal.aborted) break
      const step = script[stepIndexRef.current]
      try {
        await executeStep(step, signal, textElRef?.current)
      } catch (err) {
        console.warn('[DemoEngine] Step error:', step.id, err)
      }
      if (step.endDemo) break

      // Wait if paused (step completed due to pause aborting it)
      if (pausedRef.current && !signal.aborted) {
        await new Promise(resolve => { pauseResolveRef.current = resolve })
        pauseResolveRef.current = null
        if (signal.aborted) break
      }

      if (!jumpingRef.current) {
        stepIndexRef.current++
      }
      jumpingRef.current = false
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
    window.speechSynthesis.cancel()
    stopCurrentAudio()
    if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
    if (typedRef.current) typedRef.current.stop()
    // Abort current step so it resolves immediately (engine will wait at pause check)
    if (stepAbortRef.current) stepAbortRef.current.abort()
  }, [status])

  /* ─── Resume the demo ─── */
  const resumeDemo = useCallback(() => {
    if (status !== 'paused') return
    pausedRef.current = false
    setStatus('running')
    if (pauseResolveRef.current) { pauseResolveRef.current(); pauseResolveRef.current = null }
  }, [status])

  /* ─── Skip current step, advance to next ─── */
  const nextStep = useCallback(() => {
    // If paused, just resume+advance (don't abort, step already aborted)
    if (pausedRef.current) {
      pausedRef.current = false
      setStatus('running')
      if (pauseResolveRef.current) { pauseResolveRef.current(); pauseResolveRef.current = null }
      return
    }

    if (skippingRef.current) return
    skippingRef.current = true

    // Stop chapter audio + speech + TTS audio + typed
    window.speechSynthesis.cancel()
    if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
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

  /* ─── Jump to a specific module/phase ─── */
  const jumpToModule = useCallback((phaseNumber) => {
    const targetIndex = script.findIndex(s => s.phase === phaseNumber && s.phaseTitle)
    if (targetIndex === -1) return

    window.speechSynthesis.cancel()
    if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
    stopCurrentAudio()
    if (typedRef.current) {
      typedRef.current.destroy()
      typedRef.current = null
    }
    if (typedResolveRef.current) {
      typedResolveRef.current()
      typedResolveRef.current = null
    }

    jumpingRef.current = true
    stepIndexRef.current = targetIndex
    setSpotlightTarget(null)

    if (stepAbortRef.current) {
      stepAbortRef.current.abort()
    }

    if (pausedRef.current) {
      pausedRef.current = false
      setStatus('running')
    }
    if (pauseResolveRef.current) { pauseResolveRef.current(); pauseResolveRef.current = null }
  }, [script])

  /* ─── Toggle voice mute ─── */
  const toggleMuteVoice = useCallback(() => {
    setMuteVoice(prev => {
      const next = !prev
      muteVoiceRef.current = next
      if (next) {
        window.speechSynthesis.cancel()
        if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
      }
      return next
    })
  }, [])

  /* ─── Skip / abort the demo ─── */
  const skipDemo = useCallback(() => {
    if (stepAbortRef.current) stepAbortRef.current.abort()
    if (abortRef.current) abortRef.current.abort()
    window.speechSynthesis.cancel()
    if (chapterAudioRef.current) { try { chapterAudioRef.current.pause() } catch {} chapterAudioRef.current = null }
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
    if (pauseResolveRef.current) { pauseResolveRef.current(); pauseResolveRef.current = null }
    sessionStorage.setItem('demo-seen', '1')
    navigate('/app')
  }, [navigate])

  const value = {
    status,
    currentStep,
    currentPhase,
    phaseTitle,
    totalPhases,
    phases,
    speechText,
    spotlightTarget,
    muteVoice,
    startDemo,
    runEngine,
    skipDemo,
    pauseDemo,
    resumeDemo,
    nextStep,
    jumpToModule,
    toggleMuteVoice,
    dismissDemo: useCallback(() => setStatus('idle'), []),
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}
