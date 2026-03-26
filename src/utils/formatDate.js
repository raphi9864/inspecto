/**
 * Format a date string for display in tables.
 * Handles DD-MM-YYYY, DD-MM-YYYY HH:MM:SS, ISO, and Date objects.
 * Output: "08 Sep 2024" — no time portion unless explicitly needed.
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - Locale code (e.g. 'en', 'fr')
 * @returns {string} Formatted date
 */
export default function formatDate(dateString, locale = 'en') {
  if (!dateString) return ''
  if (dateString instanceof Date) {
    return fmt(dateString, locale)
  }

  const s = String(dateString).trim()

  // DD-MM-YYYY or DD-MM-YYYY HH:MM(:SS)
  const ddMmMatch = s.match(/^(\d{2})-(\d{2})-(\d{4})/)
  if (ddMmMatch) {
    const [, dd, mm, yyyy] = ddMmMatch
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    if (!isNaN(d.getTime())) return fmt(d, locale)
  }

  // Try native parsing (ISO, YYYY-MM-DD, etc.)
  const d = new Date(s)
  if (!isNaN(d.getTime())) return fmt(d, locale)

  // Fallback: return original string without 00:00:00 suffix
  return s.replace(/\s+0{1,2}:0{1,2}(:0{1,2})?$/, '')
}

function fmt(date, locale) {
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
