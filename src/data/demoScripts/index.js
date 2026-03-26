import fr from './fr'
import en from './en'
import it from './it'
import es from './es'
import de from './de'

const scripts = { fr, en, it, es, de }

export function getScript(lang) {
  return scripts[lang] || scripts.fr
}
