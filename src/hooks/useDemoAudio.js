import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * useDemoAudio — single-Audio-instance hook for demo step playback.
 *
 * Audio files are expected at: /audio/{lang}/{voice}/{stepId}.mp3
 * If a file doesn't exist the promise resolves immediately (graceful fallback).
 */
export default function useDemoAudio() {
  const audioRef = useRef(new Audio())
  const mutedRef = useRef(false)
  const [isMuted, setIsMutedState] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const stopCurrent = useCallback(() => {
    const audio = audioRef.current
    audio.pause()
    audio.currentTime = 0
    audio.onended = null
    audio.onerror = null
    setIsPlaying(false)
  }, [])

  const setMuted = useCallback((val) => {
    mutedRef.current = val
    audioRef.current.muted = val
    setIsMutedState(val)
  }, [])

  const playStep = useCallback((stepId, lang, voice) => {
    // Always stop previous audio first
    stopCurrent()

    const path = `/audio/${lang}/${voice}/${stepId}.mp3`

    return new Promise((resolve) => {
      const audio = audioRef.current
      audio.src = path
      audio.muted = mutedRef.current
      setIsPlaying(true)

      audio.onended = () => {
        setIsPlaying(false)
        resolve()
      }
      audio.onerror = () => {
        // Resolve even on error (file missing) so demo continues
        setIsPlaying(false)
        resolve()
      }
      audio.play().catch(() => {
        // Resolve if autoplay blocked or any other issue
        setIsPlaying(false)
        resolve()
      })
    })
  }, [stopCurrent])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCurrent()
  }, [stopCurrent])

  return { playStep, stopCurrent, isPlaying, setMuted, isMuted }
}
