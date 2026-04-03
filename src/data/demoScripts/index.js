import fr from './fr'
import en from './en'
import it from './it'
import es from './es'
import de from './de'

const scripts = { fr, en, it, es, de }

/**
 * Synchronous script getter (pre-loaded static imports).
 * Used by DemoContext useMemo for immediate access.
 */
export function getScript(lang) {
  return scripts[lang] || scripts.fr
}

/**
 * Dynamic script loader — lazy-loads only the requested language.
 * Returns a Promise that resolves to the script array.
 */
const dynamicScripts = {
  fr: () => import('./fr'),
  en: () => import('./en'),
  es: () => import('./es'),
  it: () => import('./it'),
  de: () => import('./de'),
}

export async function loadScript(lang) {
  const loader = dynamicScripts[lang] || dynamicScripts.fr
  const mod = await loader()
  return mod.default
}
