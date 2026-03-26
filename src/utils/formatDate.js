/**
 * Format a date string for display in tables.
 * Removes time portions, outputs readable international format.
 * @param {string|Date} dateString - Date to format
 * @param {string} locale - Locale code (e.g. 'en', 'fr')
 * @returns {string} Formatted date like "08 Sep 2024"
 */
export default function formatDate(dateString, locale = 'en') {
  if (!dateString) return ''
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  if (isNaN(date.getTime())) return String(dateString)

  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
