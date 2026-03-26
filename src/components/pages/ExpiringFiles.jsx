import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
import { exportCSV } from '../../utils/exportUtils'

const DEMO_FILES = [
  { id: 1, name: 'Certificat ISO 19443 — ABB France', folder: '1 - Certificat de conformité', expirationDate: '15-04-2026 15:00:00', daysLeft: 20, createdAt: '15-04-2025 10:35:23', sentBy: 'crenaud@inspectogroup.com', pdfUrl: '/demo/certificat-iso-19443.html', status: 'urgent' },
  { id: 2, name: 'Habilitation R. Attal — Zone Nucléaire', folder: '2 - Habilitations personnel', expirationDate: '10-04-2026 16:00:00', daysLeft: 15, createdAt: '10-04-2025 10:35:22', sentBy: 'crenaud@inspectogroup.com', pdfUrl: '/demo/habilitation-rattal.html', status: 'urgent' },
  { id: 3, name: 'Agrément AS9100 Hangar 4', folder: '3 - Certifications site', expirationDate: '30-06-2026 09:00:00', daysLeft: 96, createdAt: '30-06-2025 14:20:00', sentBy: 'r.attal@inspectogroup.com', pdfUrl: '/demo/agrement-as9100.html', status: 'ok' },
  { id: 4, name: 'Hamza PDF 2 modifié.pdf', folder: '1 - Certificat de conformité', expirationDate: '14-02-2026 15:00:00', daysLeft: -40, createdAt: '17-04-2025 10:35:23', sentBy: 'crenaud@inspectogroup.com', pdfUrl: '/demo/certificat-iso-19443.html', status: 'expired' },
  { id: 5, name: 'Hamza PDF 1 Modifié.pdf', folder: '1 - Certificat de conformité', expirationDate: '19-02-2026 16:00:00', daysLeft: -35, createdAt: '17-04-2025 10:35:22', sentBy: 'crenaud@inspectogroup.com', pdfUrl: '/demo/certificat-iso-19443.html', status: 'expired' },
]

function DaysLeftBadge({ days, t }) {
  let bg, color
  if (days < 0) { bg = 'rgba(215,41,74,0.15)'; color = '#d7294a' }
  else if (days <= 7) { bg = 'rgba(246,166,35,0.15)'; color = '#f6a623' }
  else { bg = 'rgba(0,255,136,0.1)'; color = '#00ff88' }
  const label = days < 0 ? `${days}${t('expiringFiles.daysLeft')}` : `${days}${t('expiringFiles.daysLeft')}`
  return <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700, background: bg, color }}>{label}</span>
}

/* ─── Mini calendar ─── */
function MiniCalendar({ selected, onChange }) {
  const [viewDate, setViewDate] = useState(() => selected ? new Date(selected) : new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const startOffset = (firstDay + 6) % 7
  const days = []
  for (let i = startOffset - 1; i >= 0; i--) days.push({ d: daysInPrev - i, cur: false })
  for (let i = 1; i <= daysInMonth; i++) days.push({ d: i, cur: true })
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) days.push({ d: i, cur: false })

  const isSelected = (d) => selected && d.cur && d.d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear()
  const isToday = (d) => { const n = new Date(); return d.cur && d.d === n.getDate() && month === n.getMonth() && year === n.getFullYear() }
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button className="btn-icon" onClick={() => setViewDate(new Date(year, month - 1, 1))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{monthNames[month]} {year}</span>
        <button className="btn-icon" onClick={() => setViewDate(new Date(year, month + 1, 1))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {['L','M','M','J','V','S','D'].map((d, i) => <div key={i} style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', padding: '4px 0', fontWeight: 600 }}>{d}</div>)}
        {days.map((d, i) => (
          <div
            key={i}
            onClick={() => { if (d.cur) onChange(new Date(year, month, d.d)) }}
            style={{
              padding: '6px 0', fontSize: '0.82rem', borderRadius: '6px', cursor: d.cur ? 'pointer' : 'default',
              color: !d.cur ? 'var(--text-tertiary)' : isSelected(d) ? '#fff' : 'var(--text-primary)',
              background: isSelected(d) ? '#d7294a' : 'transparent',
              border: isToday(d) ? '1px solid var(--blue)' : '1px solid transparent',
              opacity: d.cur ? 1 : 0.3,
              fontWeight: isSelected(d) || isToday(d) ? 700 : 400,
            }}
          >{d.d}</div>
        ))}
      </div>
    </div>
  )
}

export default function ExpiringFiles() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [files, setFiles] = useState(DEMO_FILES)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [quickFilter, setQuickFilter] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewFile, setViewFile] = useState(null)
  const [calendarFile, setCalendarFile] = useState(null)
  const [calendarDate, setCalendarDate] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    return files.filter(f => {
      if (search) {
        const q = search.toLowerCase()
        if (!f.name.toLowerCase().includes(q) && !f.folder.toLowerCase().includes(q)) return false
      }
      if (quickFilter === '7') { if (f.daysLeft < 0 || f.daysLeft > 7) return false }
      if (quickFilter === 'expired') { if (f.daysLeft >= 0) return false }
      if (dateFrom) {
        const [d, mo, y] = f.expirationDate.split(' ')[0].split('-')
        if (new Date(`${y}-${mo}-${d}`) < new Date(dateFrom)) return false
      }
      if (dateTo) {
        const [d, mo, y] = f.expirationDate.split(' ')[0].split('-')
        if (new Date(`${y}-${mo}-${d}`) > new Date(dateTo)) return false
      }
      return true
    })
  }, [files, search, quickFilter, dateFrom, dateTo])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.3,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [filtered.length])

  const resetFilters = () => { setSearch(''); setDateFrom(''); setDateTo(''); setQuickFilter('all') }
  const confirmDelete = (id) => { setFiles(prev => prev.filter(f => f.id !== id)); setDeleteId(null); showToast(t('common.delete'), 'info') }
  const openCalendar = (f) => {
    const [d, mo, y] = f.expirationDate.split(' ')[0].split('-')
    setCalendarDate(new Date(+y, +mo - 1, +d))
    setCalendarFile(f)
  }
  const confirmCalendar = () => {
    if (!calendarFile || !calendarDate) return
    const newDateStr = `${String(calendarDate.getDate()).padStart(2, '0')}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${calendarDate.getFullYear()} 00:00:00`
    const now = new Date()
    const diff = Math.ceil((calendarDate - now) / (1000 * 60 * 60 * 24))
    setFiles(prev => prev.map(f => f.id === calendarFile.id ? { ...f, expirationDate: newDateStr, daysLeft: diff, status: diff < 0 ? 'expired' : diff <= 7 ? 'urgent' : 'ok' } : f))
    setCalendarFile(null)
    showToast(t('expiringFiles.modal.confirm'), 'success')
  }

  const pills = [
    { key: 'all', label: t('expiringFiles.filterAll') },
    { key: '7', label: t('expiringFiles.filter7') },
    { key: 'expired', label: t('expiringFiles.filterExpired') },
  ]

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
            {t('expiringFiles.filters')}
          </button>
          <button className="btn-outline" onClick={() => { exportCSV(filtered, `inspecto-expirations-${new Date().toISOString().slice(0, 10)}.csv`); showToast('CSV exported', 'success') }}>{t('common.export')} CSV</button>
        </div>
        {/* Quick filter pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {pills.map(p => (
            <button key={p.key} className={quickFilter === p.key ? 'btn-primary' : 'btn-outline'} style={{ fontSize: '0.78rem', padding: '4px 12px' }} onClick={() => setQuickFilter(p.key)}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      {isFilterOpen && (
        <div className="panel" style={{ marginBottom: '16px', opacity: 1, transform: 'none' }}>
          <div className="panel-body" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap', padding: '12px 16px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('expiringFiles.search')}</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('expiringFiles.search')} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: '0 1 160px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('expiringFiles.dateFrom')}</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div style={{ flex: '0 1 160px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('expiringFiles.dateTo')}</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            <button className="btn-outline" onClick={resetFilters}>{t('expiringFiles.resetFilters')}</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {t('expiringFiles.title')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--status-success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>
            {filtered.length} / {files.length} {t('expiringFiles.results')}
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('expiringFiles.columns.name')}</th>
                <th>{t('expiringFiles.columns.folder')}</th>
                <th>{t('expiringFiles.columns.expirationDate')}</th>
                <th>{t('expiringFiles.columns.daysLeft')}</th>
                <th>{t('expiringFiles.columns.createdAt')}</th>
                <th>{t('expiringFiles.columns.sentBy')}</th>
                <th>{t('expiringFiles.columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.folder}</td>
                  <td style={{ color: f.daysLeft <= 30 ? '#d7294a' : 'var(--text-primary)', fontWeight: f.daysLeft <= 30 ? 600 : 400, whiteSpace: 'nowrap' }}>{f.expirationDate}</td>
                  <td><DaysLeftBadge days={f.daysLeft} t={t} /></td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.createdAt}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.sentBy}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-icon" title={t('expiringFiles.modal.viewTitle')} onClick={() => setViewFile(f)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </button>
                      <button className="btn-icon" title={t('expiringFiles.modal.expirationTitle')} onClick={() => openCalendar(f)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </button>
                      <button className="btn-icon" title={t('common.delete')} onClick={() => setDeleteId(f.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', padding: '16px', fontSize: '0.88rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {t('expiringFiles.endOfList')}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 className="modal-title">{t('expiringFiles.delete.confirm')}</h3>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setDeleteId(null)}>{t('expiringFiles.delete.no')}</button>
              <button className="btn-primary" style={{ background: 'var(--status-error)' }} onClick={() => confirmDelete(deleteId)}>{t('expiringFiles.delete.yes')}</button>
            </div>
          </div>
        </div>
      )}

      {/* View document modal */}
      {viewFile && (
        <div className="modal-overlay" onClick={() => setViewFile(null)} style={{ zIndex: 2000 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: '1000px', height: '90vh', background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{viewFile.name}</span>
              <button className="btn-icon" onClick={() => setViewFile(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <iframe src={viewFile.pdfUrl} style={{ flex: 1, border: 'none', background: '#fff' }} title={viewFile.name} />
          </div>
        </div>
      )}

      {/* Calendar modal */}
      {calendarFile && (
        <div className="modal-overlay" onClick={() => setCalendarFile(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {t('expiringFiles.modal.expirationTitle')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>{t('expiringFiles.modal.expirationSubtitle')}</p>
            {calendarDate && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{calendarDate.getFullYear()}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {calendarDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
              </div>
            )}
            <MiniCalendar selected={calendarDate} onChange={setCalendarDate} />
            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn-outline" onClick={() => setCalendarFile(null)}>{t('expiringFiles.modal.cancel')}</button>
              <button className="btn-primary" onClick={confirmCalendar}>{t('expiringFiles.modal.confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
