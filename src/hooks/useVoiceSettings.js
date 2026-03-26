import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'inspecto_voice_gender'

export default function useVoiceSettings() {
  const { i18n } = useTranslation()
  const [voiceGender, setGender] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'male'
  )

  const setVoiceGender = (gender) => {
    setGender(gender)
    localStorage.setItem(STORAGE_KEY, gender)
  }

  return {
    voiceGender,
    setVoiceGender,
    currentLang: i18n.language || 'fr',
  }
}
