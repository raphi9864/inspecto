import fr from './fr'
import en from './en'
import it from './it'
import es from './es'
import de from './de'
import saeFr from './sae/fr'
import saeEn from './sae/en'

const inspectoScripts = { fr, en, it, es, de }
/* SAE ships FR + EN only for now; IT/ES/DE fall back to EN. */
const saeScripts = { fr: saeFr, en: saeEn, it: saeEn, es: saeEn, de: saeEn }

/**
 * Synchronous script getter — returns the pre-imported script array.
 * @param {string} lang  — i18n language code (fr/en/it/es/de)
 * @param {string} mode  — product mode ('inspecto' | 'sae')
 */
export function getScript(lang, mode = 'inspecto') {
  const bucket = mode === 'sae' ? saeScripts : inspectoScripts
  return bucket[lang] || bucket.fr
}

/**
 * Dynamic script loader — lazy-loads only the requested language + mode.
 */
const dynamicInspecto = {
  fr: () => import('./fr'),
  en: () => import('./en'),
  es: () => import('./es'),
  it: () => import('./it'),
  de: () => import('./de'),
}
const dynamicSae = {
  fr: () => import('./sae/fr'),
  en: () => import('./sae/en'),
  /* IT/ES/DE fall back to EN at load time */
  it: () => import('./sae/en'),
  es: () => import('./sae/en'),
  de: () => import('./sae/en'),
}

export async function loadScript(lang, mode = 'inspecto') {
  const bucket = mode === 'sae' ? dynamicSae : dynamicInspecto
  const loader = bucket[lang] || bucket.fr
  const mod = await loader()
  return mod.default
}
