/* ═══════════════════════════════════════════════════════════════
   Audio utilities — ElevenLabs TTS + pre-generated audio
   ═══════════════════════════════════════════════════════════════ */

const VOICE_IDS = {
  male: 'JBFqnCBsd6RMkjVDRZzb',   // George
  female: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
}

const LANGS = ['fr', 'en', 'it', 'es', 'de']
const GENDERS = ['male', 'female']

function buildLangGenderMap(prefix) {
  const map = {}
  LANGS.forEach(lang => {
    map[lang] = {}
    GENDERS.forEach(g => { map[lang][g] = `/audio/${prefix}-${lang}-${g}.mp3` })
  })
  return map
}

const PRE_GENERATED = {
  '1-0':  buildLangGenderMap('intro'),
  '6-end': buildLangGenderMap('conclusion'),
}

/* Currently playing audio ref */
let currentAudio = null

/**
 * Play a pre-generated MP3 file.
 * Resolves when playback ends or on error (never blocks).
 */
export function playPreGenerated(stepId, lang, gender) {
  return new Promise((resolve) => {
    try {
      const entry = PRE_GENERATED[stepId]
      if (!entry) { console.log('[TTS] No pre-generated entry for step:', stepId); resolve(); return }
      const langEntry = entry[lang] || entry.fr
      const url = langEntry[gender] || langEntry.male
      if (!url) { resolve(); return }

      console.log('[TTS] Playing pre-generated:', url)
      stopCurrentAudio()
      const audio = new Audio(url)
      currentAudio = audio
      audio.onended = () => { currentAudio = null; resolve() }
      audio.onerror = (e) => { console.warn('[TTS] Pre-generated audio error:', e); currentAudio = null; resolve() }
      audio.play().catch((e) => { console.warn('[TTS] Pre-generated play failed:', e.message); currentAudio = null; resolve() })
    } catch (e) { console.error('[TTS] Pre-generated exception:', e); resolve() }
  })
}

/**
 * Generate TTS via ElevenLabs API and play it.
 * Resolves when playback ends or on error (never blocks).
 */
export function generateAndPlayTTS(text, lang, gender) {
  return new Promise(async (resolve) => {
    let objectUrl = null
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
      if (!apiKey) { console.warn('[TTS] No API key — set VITE_ELEVENLABS_API_KEY in .env'); resolve(); return }
      if (!text) { resolve(); return }

      const voiceId = VOICE_IDS[gender] || VOICE_IDS.male
      console.log('[TTS] Calling ElevenLabs API', { voiceId, lang, gender, text: text.slice(0, 50) + '...' })

      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      })

      console.log('[TTS] API response:', res.status, res.statusText)
      if (!res.ok) { console.warn('[TTS] API error:', res.status, await res.text().catch(() => '')); resolve(); return }

      const blob = await res.blob()
      objectUrl = URL.createObjectURL(blob)

      stopCurrentAudio()
      const audio = new Audio(objectUrl)
      currentAudio = audio
      audio.onended = () => { currentAudio = null; URL.revokeObjectURL(objectUrl); resolve() }
      audio.onerror = (e) => { console.warn('[TTS] Audio playback error:', e); currentAudio = null; URL.revokeObjectURL(objectUrl); resolve() }
      audio.play().catch((e) => { console.warn('[TTS] Play failed:', e.message); currentAudio = null; if (objectUrl) URL.revokeObjectURL(objectUrl); resolve() })
    } catch (e) {
      console.error('[TTS] Exception:', e)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      resolve()
    }
  })
}

/**
 * Smart speaker: uses pre-generated audio if available, otherwise TTS.
 */
export function speakStep(stepId, text, lang, gender) {
  console.log('[TTS] speakStep', { stepId, lang, gender, preGenerated: !!PRE_GENERATED[stepId], text: text?.slice(0, 50) })
  if (PRE_GENERATED[stepId]) {
    return playPreGenerated(stepId, lang, gender)
  }
  return generateAndPlayTTS(text, lang, gender)
}

/**
 * Stop any currently playing audio immediately.
 */
export function stopCurrentAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio.onended = null
      currentAudio.onerror = null
    } catch { /* ignore */ }
    currentAudio = null
  }
}
