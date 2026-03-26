import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
import { exportCSV } from '../../utils/exportUtils'

const FILES = [
  { document: 'Certificat ISO 19443', date: '15/04/2026', resp: 'R. Attal', status: 'URGENT' },
  { document: 'Habilitation R. Attal', date: '02/05/2026', resp: 'S. Dupont', status: 'BIENTÔT' },
  { document: 'Agrément AS9100 Hangar 4', date: '30/06/2026', resp: 'A. Leroy', status: 'OK' },
  { document: 'Certification soudeur S. Dupont', date: '10/04/2026', resp: 'S. Dupont', status: 'URGENT' },
  { document: 'Plan qualité ABB France', date: '20/07/2026', resp: 'J. Martin', status: 'OK' },
  { document: 'Contrôle réacteur R-04', date: '28/03/2026', resp: 'R. Attal', status: 'EXPIRÉ' },
]

const STATUS_STYLES = {
  'EXPIRÉ':  { background: 'rgba(107,114,128,0.15)', color: '#6b7280' },
  'URGENT':  { background: 'rgba(215,41,74,0.15)',   color: '#d7294a' },
  'BIENTÔT': { background: 'rgba(246,166,35,0.15)',  color: '#f6a623' },
  'OK':      { background: 'rgba(0,255,136,0.15)',    color: '#00ff88' },
}

const FILTER_OPTIONS = ['Tous', 'EXPIRÉ', 'URGENT', 'BIENTÔT', 'OK']

/** Parse dd/mm/yyyy to Date for sorting */
function parseDate(str) {
  const [d, m, y] = str.split('/')
  return new Date(`${y}-${m}-${d}`)
}

export default function ExpiringFiles() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [filter, setFilter] = useState('Tous')

  const filtered = FILES
    .filter(f => filter === 'Tous' || f.status === filter)
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.counter-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.4 })
    }, containerRef)
    return () => ctx.revert()
  }, [filter])

  const handleExport = () => {
    exportCSV(filtered, `inspecto-expiring-files-${new Date().toISOString().slice(0, 10)}.csv`)
    showToast('CSV exported', 'success')
  }

  const statusBadge = (s) => {
    const st = STATUS_STYLES[s] || STATUS_STYLES.OK
    return (
      <span style={{ background: st.background, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
        {s}
      </span>
    )
  }

  const counters = {
    expired: FILES.filter(f => f.status === 'EXPIRÉ').length,
    urgent: FILES.filter(f => f.status === 'URGENT').length,
    soon: FILES.filter(f => f.status === 'BIENTÔT').length,
    ok: FILES.filter(f => f.status === 'OK').length,
  }

  return (
    <div ref={containerRef} data-demo-target="expiring-files-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Status counters */}
      <div className="status-counters">
        <div className="counter-card">
          <div className="counter-card-info">
            <div className="counter-card-label">Expiré</div>
            <div className="counter-card-count" style={{ color: '#6b7280' }}>{counters.expired}</div>
          </div>
          <div className="counter-card-circle" style={{ background: '#6b7280' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
        </div>
        <div className="counter-card">
          <div className="counter-card-info">
            <div className="counter-card-label">Urgent</div>
            <div className="counter-card-count" style={{ color: '#d7294a' }}>{counters.urgent}</div>
          </div>
          <div className="counter-card-circle" style={{ background: '#d7294a' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
        </div>
        <div className="counter-card">
          <div className="counter-card-info">
            <div className="counter-card-label">Bientôt</div>
            <div className="counter-card-count" style={{ color: '#f6a623' }}>{counters.soon}</div>
          </div>
          <div className="counter-card-circle" style={{ background: '#f6a623' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div className="counter-card">
          <div className="counter-card-info">
            <div className="counter-card-label">OK</div>
            <div className="counter-card-count" style={{ color: '#00ff88' }}>{counters.ok}</div>
          </div>
          <div className="counter-card-circle" style={{ background: '#00ff88' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {FILTER_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={handleExport}>{t('common.export')} CSV</button>
        </div>
      </div>

      {/* Panel + Table */}
      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Fichiers expirants
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--blue)', background: 'rgba(26,111,196,0.08)', border: '1px solid rgba(26,111,196,0.2)', borderRadius: '12px', padding: '2px 10px', fontWeight: 600 }}>
            {filtered.length}
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Échéance</th>
                <th>Responsable</th>
                <th>{t('common.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={i}>
                  <td><strong>{f.document}</strong></td>
                  <td>{f.date}</td>
                  <td>{f.resp}</td>
                  <td>{statusBadge(f.status)}</td>
                  <td>
                    <button
                      className="btn-outline"
                      style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                      onClick={() => showToast(`Ouverture de "${f.document}"`, 'info')}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '24px' }}>
                    Aucun fichier pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
