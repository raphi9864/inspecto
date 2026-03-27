/**
 * Export array of objects as CSV and trigger download
 */
export function exportCSV(data, filename) {
  if (!data || !data.length) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = String(row[h] ?? '')
        // Escape quotes and wrap in quotes if contains comma/quote/newline
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val
      }).join(',')
    )
  ]
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `inspecto-export-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export array of objects as XLSX (requires xlsx package)
 */
export async function exportXLSX(data, filename) {
  if (!data || !data.length) return
  const XLSX = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Export')
  XLSX.writeFile(wb, filename || `inspecto-export-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

/**
 * Export DOM element as PNG (requires html2canvas)
 */
export async function exportPNG(elementRef, filename) {
  try {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(elementRef.current, { backgroundColor: '#0a1628', logging: false })
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `inspecto-export-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch {
    window.print()
  }
}
