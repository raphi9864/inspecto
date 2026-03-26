import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Resolves translatable fields in data arrays.
 *
 * Translatable fields are objects with language keys: { fr: "...", en: "...", ... }
 * Non-translatable fields (strings, numbers, dates) are passed through as-is.
 *
 * @param {Array} data - Array of objects with mixed flat and translatable fields
 * @returns {Array} - Same array with translatable fields resolved to current language
 */
export default function useLocalizedData(data) {
  const { i18n } = useTranslation()
  const lang = i18n.language || 'fr'

  return useMemo(() => {
    if (!data) return []
    return data.map(item => {
      const resolved = {}
      for (const [key, value] of Object.entries(item)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && value.fr !== undefined) {
          // Translatable field — resolve to current lang with FR fallback
          resolved[key] = value[lang] || value.fr
        } else {
          resolved[key] = value
        }
      }
      return resolved
    })
  }, [data, lang])
}
