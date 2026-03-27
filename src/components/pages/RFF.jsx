import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useProject } from '../../context/ProjectContext'
import gsap from 'gsap'

const IDENTIFICATION_DATA = [
  { key: 'refPiece', label: 'Référence pièce', value: 'MCH-2025-4872' },
  { key: 'designation', label: 'Désignation', value: 'Palier de guidage — Acier 316L' },
  { key: 'revision', label: 'Révision', value: 'Rev. 3' },
  { key: 'quantity', label: 'Quantité', value: '12' },
  { key: 'client', label: 'Client', value: 'Jupiter Bach A/S' },
  { key: 'supplier', label: 'Fournisseur', value: 'ABB France — Usine de Saint-Ouen' },
  { key: 'site', label: 'Site', value: 'Saint-Ouen-l\'Aumône (95)' },
]

const INSPECTIONS_DATA = [
  { id: 'INSP-2025-116', date: '12/02/2026', result: 'OK', inspector: 'S. Dupont' },
  { id: 'INSP-2025-117', date: '18/02/2026', result: 'OK', inspector: 'J. Martin' },
  { id: 'INSP-2025-118', date: '25/02/2026', result: 'NC', inspector: 'S. Dupont' },
]

const NC_DATA = [
  { ref: 'NC-2025-0042', description: 'Défaut de soudure — cordon irrégulier', criticality: 'Minor', status: 'Closed', action: 'Reprise soudure + contrôle CND' },
  { ref: 'NC-2025-0041', description: 'Épaisseur hors tolérance — paroi latérale', criticality: 'Major', status: 'Closed', action: 'Usinage correctif + re-mesure' },
]

const SIGNATURES_DATA = [
  { role: 'Responsable Qualité', name: 'S. Dupont', date: '26/03/2026' },
  { role: 'Client', name: 'J. Martin', date: '26/03/2026' },
  { role: 'Tiers', name: 'P. Lambert', date: '26/03/2026' },
]

export default function RFF() {
  const { t } = useTranslation()
  const { activeProject } = useProject()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rff-section', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out', delay: 0.15 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const projectName = activeProject?.label || 'Jupiter Bach — Batch 42'

  return (
    <div ref={containerRef}>
      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 16 }}>
        <button
          className="btn-primary"
          data-demo-target="btn-generate-pdf"
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          {t('rff.generatePdf')}
        </button>
        <button
          className="btn-outline"
          data-demo-target="btn-download-rff"
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {t('rff.download')}
        </button>
      </div>

      <div className="panel" style={{ opacity: 1, transform: 'none' }} data-demo-target="rff-panel">
        <div className="panel-body" style={{ padding: 32 }}>

          {/* ── HEADER ── */}
          <div className="rff-section" style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid var(--border-primary)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: 2, color: 'var(--blue)', marginBottom: 8 }}>INSPECTO</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 1 }}>
              {t('rff.title')}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span><strong>{t('rff.ref')} :</strong> RFF-2025-001</span>
              <span><strong>{t('rff.date')} :</strong> 26/03/2026</span>
              <span><strong>{t('rff.project')} :</strong> {projectName}</span>
            </div>
          </div>

          {/* ── SECTION 1 — Identification ── */}
          <div className="rff-section" data-demo-target="rff-identification" style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              1. {t('rff.identification')}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <tbody>
                  {IDENTIFICATION_DATA.map((row) => (
                    <tr key={row.key}>
                      <td style={{ fontWeight: 600, width: '30%', color: 'var(--text-secondary)' }}>{row.label}</td>
                      <td style={{ color: 'var(--text-primary)' }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SECTION 2 — Récapitulatif Inspections ── */}
          <div className="rff-section" data-demo-target="rff-inspections" style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              2. {t('rff.inspections')}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>N° Inspection</th>
                    <th>{t('rff.date')}</th>
                    <th>{t('common.status')}</th>
                    <th>Inspecteur</th>
                  </tr>
                </thead>
                <tbody>
                  {INSPECTIONS_DATA.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>{row.id}</td>
                      <td>{row.date}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: row.result === 'OK' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: row.result === 'OK' ? 'var(--status-success)' : 'var(--status-error)',
                          border: `1px solid ${row.result === 'OK' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                        }}>
                          {row.result}
                        </span>
                      </td>
                      <td>{row.inspector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SECTION 3 — Non-Conformités ── */}
          <div className="rff-section" data-demo-target="rff-nonconformites" style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              3. {t('rff.nonconformites')}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('rff.ref')}</th>
                    <th>{t('common.description')}</th>
                    <th>Criticité</th>
                    <th>{t('common.status')}</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {NC_DATA.map((row) => (
                    <tr key={row.ref}>
                      <td style={{ fontWeight: 600 }}>{row.ref}</td>
                      <td>{row.description}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: row.criticality === 'Major' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                          color: row.criticality === 'Major' ? 'var(--status-warning)' : 'var(--blue)',
                          border: `1px solid ${row.criticality === 'Major' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)'}`,
                        }}>
                          {row.criticality}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: 'rgba(34,197,94,0.1)',
                          color: 'var(--status-success)',
                          border: '1px solid rgba(34,197,94,0.25)',
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SECTION 4 — Conformité Finale ── */}
          <div className="rff-section" data-demo-target="rff-conformite" style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              4. {t('rff.conformite')}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16, fontStyle: 'italic' }}>
              {t('rff.conformityStatement')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked readOnly style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
                {t('rff.allNcClosed')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked readOnly style={{ width: 18, height: 18, accentColor: 'var(--blue)' }} />
                {t('rff.docsSigned')}
              </label>
            </div>
          </div>

          {/* ── SECTION 5 — Signatures ── */}
          <div className="rff-section" data-demo-target="rff-signatures" style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
              5. {t('rff.signatures')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {SIGNATURES_DATA.map((sig) => (
                <div
                  key={sig.role}
                  style={{
                    border: '2px dashed var(--border-secondary)',
                    borderRadius: 10,
                    padding: 20,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {sig.role}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sig.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{sig.date}</div>
                  <div style={{
                    marginTop: 6,
                    display: 'inline-block',
                    padding: '3px 14px',
                    borderRadius: 12,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: 'rgba(34,197,94,0.1)',
                    color: 'var(--status-success)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    alignSelf: 'center',
                  }}>
                    Signé
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .app-sidebar, .app-topbar, .btn-primary, .btn-outline, .sidebar-footer {
            display: none !important;
          }
          .panel {
            border: none !important;
            box-shadow: none !important;
          }
          .rff-section { break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}
