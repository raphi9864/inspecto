import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { FAKE_INSPECTIONS, FAKE_INSPECTION_COUNTERS } from '../../data/fakeInspections'
import ImageEditor from '../ImageEditor/ImageEditor'
import { showToast } from '../Toast'

// Legacy inspection data for detail view compatibility
const legacyInspections = [
  { id: 'INS-2026-001', title: 'Fabrication moteur HT – 1', project: 'Fabrication moteur HT', status: 'alert', statusText: 'En retard', date: '18 mars 2026', resp: 'S. Dupont', norm: 'ISO 19443' },
  { id: 'INS-2026-002', title: 'ABB France – Démo 3', project: 'ABB France', status: 'alert', statusText: 'En retard', date: '13 jan 2026', resp: 'J. Martin', norm: 'AS/EN 9100' },
  { id: 'INS-2026-003', title: 'Vérification palier', project: 'Fabrication moteur HT', status: 'alert', statusText: 'En retard', date: '13 jan 2026', resp: 'A. Leroy', norm: 'ISO 19443' },
  { id: 'INS-2026-004', title: 'ABB France – Démo 2', project: 'ABB France', status: 'ok', statusText: 'Clôturée', date: '13 jan 2026', resp: 'L. Bernard', norm: 'AS/EN 9100' },
  { id: 'INS-2026-005', title: 'Audit direction', project: 'Fabrication moteur HT', status: 'alert', statusText: 'En retard', date: '12 jan 2026', resp: 'S. Dupont', norm: 'ISO 9001' },
  { id: 'INS-2025-001', title: 'ABB France – Démo 1', project: 'ABB France', status: 'alert', statusText: 'En retard', date: '15 sep 2025', resp: 'R. Attal', norm: 'AS/EN 9100' },
]

export default function Inspections() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const [view, setView] = useState('list')
  const [wizardStep, setWizardStep] = useState(0)
  const [detailInsp, setDetailInsp] = useState(null)
  const [detailTab, setDetailTab] = useState('info')
  const [editingImage, setEditingImage] = useState(null)
  const [whys, setWhys] = useState([{ text: 'Porosit\u00e9s sur soudure TIG.' }])
  const [capaActions, setCapaActions] = useState([
    { num: 1, title: 'Isoler les 3 pi\u00e8ces non-conformes du lot 42', assignee: 'S. Dupont', deadline: '18 mars 2026', priority: 'alert', priorityText: 'Critique' },
    { num: 2, title: 'Recalibrer le poste de soudage S3 \u2014 v\u00e9rifier d\u00e9bit gaz', assignee: 'A. Leroy', deadline: '19 mars 2026', priority: 'pending', priorityText: 'Majeur' },
    { num: 3, title: 'Mettre \u00e0 jour la check-list pr\u00e9-d\u00e9marrage \u2014 afficher sur tous les postes', assignee: 'J. Martin', deadline: '25 mars 2026', priority: 'progress', priorityText: 'Normal' },
  ])
  const sigCanvasRef = useRef(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.counter-card', { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2,
      })
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.4,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [view])

  // Signature canvas
  useEffect(() => {
    if (view !== 'wizard' || wizardStep !== 4) return
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#f0f4f8'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    const onDown = (e) => { drawingRef.current = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY) }
    const onMove = (e) => { if (!drawingRef.current) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke() }
    const onUp = () => { drawingRef.current = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
    }
  }, [view, wizardStep])

  function showWizardStep(idx) {
    setWizardStep(idx)
    setTimeout(() => {
      const panel = document.getElementById(`wizard-step-${idx}`)
      if (panel) gsap.from(panel, { opacity: 0, x: 20, duration: 0.3, ease: 'power2.out' })
    }, 0)
  }

  const openWizard = useCallback(() => {
    setView('wizard')
    setWizardStep(0)
  }, [])

  const openDetail = useCallback((ins) => {
    const legacy = legacyInspections.find(l => l.id === ins.id) || {
      id: ins.id, title: ins.name, project: 'N/A', status: ins.status === 'CLOSED' ? 'ok' : 'alert',
      statusText: ins.status === 'CLOSED' ? 'Clôturée' : 'En retard', date: ins.startDate, resp: 'N/A', norm: 'N/A'
    }
    setDetailInsp(legacy)
    setDetailTab('info')
    setView('detail')
  }, [])

  /* --- DETAIL VIEW --- */
  if (view === 'detail') {
    const insp = detailInsp
    const refNo = insp.refNo || `INSP/MAINTENANCE/FABRICATION_MOTEUR_HT/${Math.floor(Math.random() * 20) + 1}`
    const startDt = insp.startDate || insp.date
    const endDt = insp.endDate || '—'
    return (
      <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 900, width: '100%' }}>
          {/* BACK button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button data-demo-target="insp-back" onClick={() => setView('list')} style={{ padding: '8px 20px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              &larr; {t('inspections.backToList').toUpperCase()}
            </button>
          </div>

          {/* Main card */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '20px 0 0', borderBottom: '1px solid var(--border-primary)' }}>
              <button data-demo-target="insp-tab-info" onClick={() => setDetailTab('info')} style={{ padding: '10px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: detailTab === 'info' ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: detailTab === 'info' ? '2px solid var(--blue)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {t('inspections.tabs.info').toUpperCase()}
              </button>
              <button data-demo-target="insp-tab-findings" onClick={() => setDetailTab('findings')} style={{ padding: '10px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: detailTab === 'findings' ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: detailTab === 'findings' ? '2px solid var(--blue)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {t('inspections.tabs.findings').toUpperCase()}
              </button>
              <button data-demo-target="insp-tab-form" onClick={() => setDetailTab('form')} style={{ padding: '10px 4px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: detailTab === 'form' ? 'var(--blue)' : 'var(--text-secondary)', borderBottom: detailTab === 'form' ? '2px solid var(--blue)' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {t('inspections.tabs.form').toUpperCase()}
              </button>
            </div>

            {/* INFORMATIONS */}
            {detailTab === 'info' && (
              <div style={{ padding: '0 32px 32px' }}>
                <div style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)', borderRadius: 6, padding: '10px', textAlign: 'center', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {t('common.edit').toUpperCase()} {t('inspections.tabs.info').toUpperCase()}
                </div>

                {/* General Information */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', margin: '24px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  {t('actionsPage.generalInfo')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px', paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
                  <div><div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>{t('common.name')}</div><div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>{insp.title}</div></div>
                  <div><div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>{t('inspections.reference')}</div><div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>{refNo}</div></div>
                </div>

                {/* Dates and Status */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {t('actionsPage.datesStatus')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 32px', paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
                  <div><div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>{t('home.startDate')}</div><div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>{startDt}</div></div>
                  <div><div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>{t('home.endDate')}</div><div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>{endDt}</div></div>
                  <div><div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>{t('common.status')}</div><div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>{t('inspections.counters.ongoing')}</div></div>
                </div>

                {/* Details and Resources */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Details and Resources
                </h4>
                <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 20, borderRadius: 10, background: 'var(--toggle-off)', position: 'relative' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: 2 }}></div>
                    </div>
                    Enter resources
                  </label>
                </div>

                {/* Location */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {t('inspections.location')}
                </h4>
                <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 600 }}>Address</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>-</div>
                </div>

                {/* Attachments */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--blue)', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  {t('actionsPage.attachments')}
                </h4>
                <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--status-warning)', fontSize: '0.9rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    No attachments
                  </div>
                </div>

                {/* Notification */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: '20px 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {t('common.notifications')}
                </h4>
                <div style={{ display: 'flex', gap: 32 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}><input type="checkbox" /> {t('findings.sendNotification')}</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                    <input type="checkbox" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {t('findings.sendNotification')}
                  </label>
                </div>
              </div>
            )}

        {detailTab === 'findings' && (
          <div className="detail-section">
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
              <input className="wizard-input" type="text" placeholder={t('common.search')} style={{ flex: 1, margin: 0 }} />
              <button className="panel-btn primary" onClick={() => navigate('/app/findings')}>{t('findings.newNC')}</button>
            </div>
            <div className="panel" style={{ opacity: 1, transform: 'none' }}>
              <div className="panel-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr><th>{t('findings.formLabels.referenceNo')}</th><th>{t('findings.formLabels.reportDate')}</th><th>{t('findings.area')}</th><th>{t('findings.event')}</th><th>{t('findings.other')}</th><th>Pictures</th><th>{t('findings.formLabels.status')}</th><th>Criticality</th><th>{t('findings.lessonLearnt')}</th><th>NC due to</th><th>Nb actions</th><th>Created by</th><th>{t('common.actions')}</th></tr>
                  </thead>
                  <tbody>
                    <tr style={{ cursor: 'pointer' }} onClick={() => navigate('/app/findings')}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>NC-2026-0043</td>
                      <td>18-03-2026</td>
                      <td>Welding - S3</td>
                      <td>Porosity</td>
                      <td>-</td>
                      <td>2</td>
                      <td><span style={{ background: 'rgba(46,163,242,0.15)', color: 'var(--blue)', padding: '2px 8px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600 }}>{t('findings.status.open')}</span></td>
                      <td><span style={{ color: 'var(--status-warning)', fontWeight: 600, fontSize: '0.85rem' }}>{t('findings.criticality.major')}</span></td>
                      <td>No</td>
                      <td>Process</td>
                      <td>3</td>
                      <td>R. Attal</td>
                      <td><button className="btn-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <FormTab insp={insp} detailTab={detailTab} />
          </div>
        </div>
      </div>
    )
  }

  /* --- WIZARD VIEW --- */
  if (view === 'wizard') {
    return (
      <div ref={containerRef}>
        <div className="wizard-header" data-demo-target="insp-wizard">
          <button className="ctx-back-btn" onClick={() => setView('list')} style={{ marginBottom: 0 }}>{t('common.back')} Inspections</button>
          <div className="wizard-title">Nouvelle Non-Conformité</div>
        </div>
        <div className="wizard-stepper" id="wizard-stepper">
          {['Informations', 'Photos', 'Cause', 'Résolution', 'Signature'].map((label, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className="wizard-step-connector"></div>}
              <div className={`wizard-step${i < wizardStep ? ' done' : i === wizardStep ? ' active' : ''}`}>
                <div className="wizard-step-num">{i < wizardStep ? '✓' : i + 1}</div>
                <div className="wizard-step-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step 0: Info */}
        <div className="wizard-panel" id="wizard-step-0" style={{ display: wizardStep === 0 ? 'block' : 'none' }}>
          <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 720, margin: '0 auto' }}>
            <div className="panel-header"><div className="panel-title">Informations générales</div></div>
            <div className="panel-body">
              <div className="wizard-form-grid">
                <div className="wizard-field"><label className="wizard-label">Titre de la NC *</label><input className="wizard-input" type="text" defaultValue="Défaut soudure bride moteur — Lot 42" /></div>
                <div className="wizard-field"><label className="wizard-label">Projet *</label><select className="wizard-input"><option>Fabrication moteur HT</option><option>Jupiter Bach</option><option>Pilatus PC21</option></select></div>
                <div className="wizard-field"><label className="wizard-label">{t('inspections.location')}</label><input className="wizard-input" type="text" defaultValue="Usine Nord — Poste S3, Zone assemblage" /></div>
                <div className="wizard-field"><label className="wizard-label">{t('inspections.reference')}</label><input className="wizard-input" type="text" defaultValue="COMP-2026-0042-B" /></div>
                <div className="wizard-field wizard-field-full">
                  <label className="wizard-label">Gravité *</label>
                  <div className="wizard-radio-group">
                    <label className="wizard-radio"><input type="radio" name="severity" defaultValue="minor" /><span className="wizard-radio-btn minor">{t('findings.criticality.minor')}</span></label>
                    <label className="wizard-radio"><input type="radio" name="severity" defaultValue="major" defaultChecked /><span className="wizard-radio-btn major">{t('findings.criticality.major')}</span></label>
                    <label className="wizard-radio"><input type="radio" name="severity" defaultValue="critical" /><span className="wizard-radio-btn critical">{t('findings.criticality.critical')}</span></label>
                  </div>
                </div>
                <div className="wizard-field wizard-field-full">
                  <label className="wizard-label">{t('findings.formLabels.description')} *</label>
                  <textarea className="wizard-input wizard-textarea" defaultValue="Défaut de soudure détecté sur la bride de fixation du moteur — lot 42. Porosités visibles sur la soudure TIG, non-conformes aux exigences ISO 19443 §8.5.1. Nombre de pièces affectées : 3." />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Photos */}
        <div className="wizard-panel" id="wizard-step-1" style={{ display: wizardStep === 1 ? 'block' : 'none' }}>
          <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 720, margin: '0 auto' }}>
            <div className="panel-header"><div className="panel-title">Photos &amp; pièces jointes</div></div>
            <div className="panel-body">
              <div className="wizard-upload-zone">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>Glissez vos photos ici ou <strong>cliquez pour importer</strong></p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>JPG, PNG, PDF — max 10 Mo par fichier</p>
              </div>
              <div className="wizard-photo-grid">
                {[
                  { name: 'photo_defaut_1.jpg', src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop' },
                  { name: 'vue_macro_soudure.jpg', src: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=200&fit=crop' },
                ].map((photo) => (
                  <div className="wizard-photo-thumb" key={photo.name} onClick={() => setEditingImage(photo.src)} style={{ cursor: 'pointer' }}>
                    <div className="wizard-photo-img" style={{ overflow: 'hidden' }}>
                      <img src={photo.src} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                    </div>
                    <div className="wizard-photo-name">
                      {photo.name}
                      <span style={{ fontSize: '0.85rem', color: 'var(--blue)', marginLeft: '4px' }}>Click to annotate</span>
                    </div>
                  </div>
                ))}
              </div>
              {editingImage && (
                <ImageEditor
                  imageSrc={editingImage}
                  onSave={() => setEditingImage(null)}
                  onCancel={() => setEditingImage(null)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Cause */}
        <div className="wizard-panel" id="wizard-step-2" style={{ display: wizardStep === 2 ? 'block' : 'none' }}>
          <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 720, margin: '0 auto' }}>
            <div className="panel-header"><div className="panel-title">Analyse des causes</div></div>
            <div className="panel-body">
              <div className="wizard-form-grid">
                <div className="wizard-field"><label className="wizard-label">Cat&eacute;gorie de cause</label><select className="wizard-input"><option>Proc&eacute;d&eacute; / Process</option><option>Mat&eacute;riau</option><option>Humain / Comp&eacute;tences</option><option>&Eacute;quipement</option><option>Environnement</option></select></div>
                <div className="wizard-field"><label className="wizard-label">M&eacute;thode d'analyse</label><select className="wizard-input"><option>5 Pourquoi (5-Why)</option><option>Ishikawa</option><option>8D</option><option>AMDEC</option></select></div>
                <div className="wizard-field wizard-field-full">
                  <label className="wizard-label">Cause racine identifi&eacute;e</label>
                  {whys.map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-tertiary)', minWidth: 24 }}>{i + 1}.</span>
                      <input
                        className="wizard-input"
                        type="text"
                        placeholder={`Pourquoi ? \u2014 ...`}
                        value={w.text}
                        onChange={e => setWhys(prev => prev.map((ww, ii) => ii === i ? { text: e.target.value } : ww))}
                        style={{ margin: 0 }}
                      />
                    </div>
                  ))}
                  {whys.length < 5 && (
                    <button
                      className="btn-outline"
                      style={{ fontSize: '0.85rem', marginTop: '4px' }}
                      onClick={() => setWhys(prev => [...prev, { text: '' }])}
                    >
                      + {t('findings.addWhy')}
                    </button>
                  )}
                </div>
                <div className="wizard-field wizard-field-full">
                  <label className="wizard-label">&Eacute;tendue potentielle</label>
                  <div className="wizard-toggle-row">
                    <label className="wizard-toggle"><input type="checkbox" defaultChecked /><span className="wizard-toggle-track"></span><span>Autres pi&egrave;ces du lot potentiellement affect&eacute;es</span></label>
                    <label className="wizard-toggle"><input type="checkbox" /><span className="wizard-toggle-track"></span><span>{t('findings.lessonLearnt')} \u2014 partager avec tous les sites</span></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Resolution */}
        <div className="wizard-panel" id="wizard-step-3" style={{ display: wizardStep === 3 ? 'block' : 'none' }}>
          <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 720, margin: '0 auto' }}>
            <div className="panel-header"><div className="panel-title">Actions correctives (CAPA)</div></div>
            <div className="panel-body">
              <div className="wizard-capa-list">
                {capaActions.map((c, i) => (
                  <div className="wizard-capa-item" key={i}>
                    <div className="wizard-capa-num">{i + 1}</div>
                    <div className="wizard-capa-content">
                      <div className="wizard-capa-title">{c.title}</div>
                      <div className="wizard-capa-meta">Assign&eacute; &agrave; <strong>{c.assignee}</strong> &middot; D&eacute;lai : <strong>{c.deadline}</strong> &middot; Priorit&eacute; : <span className={`status ${c.priority}`} style={{ fontSize: '0.85rem' }}>{c.priorityText}</span></div>
                    </div>
                  </div>
                ))}
                <div className="wizard-capa-item wizard-capa-add" onClick={() => {
                  const title = prompt('Titre de l\'action corrective :')
                  if (title) {
                    setCapaActions(prev => [...prev, {
                      num: prev.length + 1,
                      title,
                      assignee: 'R. Attal',
                      deadline: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                      priority: 'progress',
                      priorityText: 'Normal',
                    }])
                    showToast('Action corrective ajout\u00e9e')
                  }
                }} style={{ cursor: 'pointer' }}>
                  <div className="wizard-capa-num">+</div>
                  <div className="wizard-capa-content" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Ajouter une action corrective&hellip;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Signature */}
        <div className="wizard-panel" id="wizard-step-4" style={{ display: wizardStep === 4 ? 'block' : 'none' }}>
          <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 720, margin: '0 auto' }}>
            <div className="panel-header"><div className="panel-title">Validation &amp; Signature</div></div>
            <div className="panel-body">
              <div className="wizard-sig-row">
                <div className="wizard-sig-info">
                  <div className="wizard-sig-field"><span>Inspecteur</span><strong>R. Attal</strong></div>
                  <div className="wizard-sig-field"><span>{t('common.date')}</span><strong>18 mars 2026 — 14:32</strong></div>
                  <div className="wizard-sig-field"><span>Projet</span><strong>Fabrication moteur HT</strong></div>
                  <div className="wizard-sig-field"><span>{t('inspections.reference')} NC</span><strong>NC-2026-0043</strong></div>
                </div>
                <div className="wizard-sig-canvas-wrap">
                  <div className="wizard-sig-label">Signature électronique</div>
                  <canvas ref={sigCanvasRef} width="340" height="120"></canvas>
                  <button className="panel-btn ghost wizard-sig-clear" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}
                    onClick={() => { const c = sigCanvasRef.current; if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height) }}>
                    Effacer
                  </button>
                </div>
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-primary)' }}>
                <button className="panel-btn primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
                  onClick={() => setView('list')}>
                  Valider &amp; Soumettre la Non-Conformité ✓
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="wizard-nav">
          <button className="panel-btn ghost" disabled={wizardStep === 0} onClick={() => showWizardStep(wizardStep - 1)}>← Précédent</button>
          <span className="wizard-step-indicator">Étape {wizardStep + 1} / 5</span>
          <button className="panel-btn primary" data-demo-target="wizard-next" onClick={() => {
            if (wizardStep >= 4) setView('list')
            else showWizardStep(wizardStep + 1)
          }}>{wizardStep >= 4 ? t('common.close') : 'Suivant →'}</button>
        </div>
      </div>
    )
  }

  /* --- PLAN VIEW --- */
  if (view === 'plan') {
    return (
      <div ref={containerRef}>
        <div className="wizard-header">
          <button className="ctx-back-btn" onClick={() => setView('list')} style={{ marginBottom: 0 }}>{t('common.back')} Inspections</button>
          <div className="wizard-title">{t('inspections.planInspection')}</div>
        </div>
        <div className="panel" style={{ opacity: 1, transform: 'none', maxWidth: 680, margin: '0 auto' }}>
          <div className="panel-header"><div className="panel-title">{t('inspections.newInspection')}</div></div>
          <div className="panel-body">
            <div className="wizard-form-grid">
              <div className="wizard-field"><label className="wizard-label">Titre *</label><input className="wizard-input" type="text" defaultValue="Inspection réacteur R-05 — Site B" /></div>
              <div className="wizard-field"><label className="wizard-label">Projet *</label><select className="wizard-input"><option>Fabrication moteur HT</option><option>Jupiter Bach</option></select></div>
              <div className="wizard-field"><label className="wizard-label">{t('common.date')} *</label><input className="wizard-input" type="date" defaultValue="2026-03-25" /></div>
              <div className="wizard-field"><label className="wizard-label">Template</label><select className="wizard-input"><option>Inspection qualité ISO 19443</option><option>Audit AS/EN 9100</option><option>Contrôle sécurité</option></select></div>
              <div className="wizard-field wizard-field-full">
                <label className="wizard-label">{t('inspections.location')} (carte)</label>
                <div className="insp-map-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#90a0b7" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Site B — Centrale Est, Zone réacteur</span>
                </div>
              </div>
              <div className="wizard-field wizard-field-full">
                <label className="wizard-label">Ressources</label>
                <div className="insp-resources-row">
                  <div className="insp-resource-chip"><div className="sidebar-user-avatar" style={{ width: 24, height: 24, fontSize: '0.85rem' }}>SD</div>S. Dupont</div>
                  <div className="insp-resource-chip"><div className="sidebar-user-avatar" style={{ width: 24, height: 24, fontSize: '0.85rem' }}>JM</div>J. Martin</div>
                  <button className="panel-btn ghost" style={{ fontSize: '0.9rem' }}>+ Enter resources</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="panel-btn ghost" onClick={() => setView('list')}>{t('common.cancel')}</button>
              <button className="panel-btn primary" onClick={() => setView('list')}>{t('inspections.planInspection')} →</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* --- LIST VIEW (new structure) --- */
  return (
    <div className="inspections-page" ref={containerRef} data-demo-target="inspections-page">

      {/* Status counters */}
      <div className="status-counters">
        <CounterCard label={t('inspections.counters.ongoing')} count={FAKE_INSPECTION_COUNTERS.ongoing} color="var(--blue)" IconSvg={PlayIcon} />
        <CounterCard label={t('inspections.counters.overdue')} count={FAKE_INSPECTION_COUNTERS.overdue} color="var(--status-error)" IconSvg={WarningIcon} />
        <CounterCard label={t('inspections.counters.pending')} count={FAKE_INSPECTION_COUNTERS.pending} color="var(--status-warning)" IconSvg={ClockIcon} />
        <CounterCard label={t('inspections.counters.closed')}  count={FAKE_INSPECTION_COUNTERS.closed}  color="var(--status-success)" IconSvg={CheckIcon} />
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <button className="btn-outline" onClick={() => showToast('Filters opened', 'info')}>{t('common.filters')}</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button className="btn-outline">{t('common.export')}</button>
          <button className="btn-primary" data-demo-target="btn-new-inspection" onClick={() => setView('plan')}>{t('inspections.newInspection')}</button>
          <button className="btn-primary" data-demo-target="btn-fill-form" onClick={() => {
            const num = FAKE_INSPECTIONS.length + Math.floor(Math.random() * 10) + 1
            const now = new Date()
            const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
            const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            const newInsp = {
              id: `INS-2026-${String(num).padStart(3, '0')}`,
              title: `Fabrication moteur HT - ${num}`,
              project: 'Fabrication moteur HT',
              status: 'pending',
              statusText: 'Ongoing',
              date: `${dateStr} ${timeStr}`,
              resp: 'R. Attal',
              norm: 'ISO 19443',
              refNo: `INSP/MAINTENANCE/FABRICATION_MOTEUR_HT/${num + 1}`,
              startDate: `${dateStr} ${timeStr}`,
              endDate: `${dateStr} ${new Date(now.getTime() + 3600000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
            }
            setDetailInsp(newInsp)
            setDetailTab('info')
            setView('detail')
            showToast('New inspection form created')
          }}>+ {t('inspections.fillForm')}</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name')}</th>
              <th>{t('home.startDate')} ↓</th>
              <th>{t('home.endDate')}</th>
              <th>{t('common.status')}</th>
              <th>Invitation Responses</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {FAKE_INSPECTIONS.map(ins => (
              <tr key={ins.id} onClick={() => openDetail(ins)} style={{ cursor: 'pointer' }}>
                <td><strong>{ins.name}</strong></td>
                <td>{ins.startDate}</td>
                <td>{ins.endDate}</td>
                <td><StatusBadge status={ins.status} /></td>
                <td>{ins.responses}</td>
                <td><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

/* --- Sub-components --- */

/* Counter card icons */
const PlayIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="8 5 19 12 8 19"/></svg>
const WarningIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

function CounterCard({ label, count, color, IconSvg }) {
  return (
    <div className="counter-card">
      <div className="counter-card-info">
        <div className="counter-card-label">{label}</div>
        <div className="counter-card-count" style={{ color }}>{count}</div>
      </div>
      <div className="counter-card-circle" style={{ background: color }}>
        <IconSvg />
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const { t } = useTranslation()
  const styles = {
    OVERDUE: { bg: 'rgba(239,68,68,0.15)', color: 'var(--status-overdue)', label: t('inspections.counters.overdue') },
    CLOSED: { bg: 'rgba(34,197,94,0.15)', color: 'var(--status-success)', label: t('inspections.counters.closed') },
    PENDING: { bg: 'rgba(245,158,11,0.15)', color: 'var(--status-warning)', label: t('inspections.counters.pending') },
    ONGOING: { bg: 'rgba(46,163,242,0.15)', color: 'var(--blue)', label: t('inspections.counters.ongoing') },
  }
  const s = styles[status] || styles.OVERDUE
  return (
    <span style={{
      background: s.bg, color: s.color, padding: '3px 10px',
      borderRadius: '12px', fontSize: '13px', fontWeight: 600,
    }}>
      {s.label}
    </span>
  )
}

function FormTab({ insp, detailTab }) {
  const { t } = useTranslation()
  const [subTab, setSubTab] = useState('info')
  const [signatures, setSignatures] = useState([
    { id: 1, name: 'R. Attal', role: 'Inspector', status: 'Signed', date: '18-03-2026 14:32' },
    { id: 2, name: 'S. Dupont', role: 'Supervisor', status: 'Pending', date: null },
    { id: 3, name: 'Client Representative', role: 'Client', status: 'Pending', date: null },
  ])

  const handleSign = (id) => {
    setSignatures(prev => prev.map(s => s.id === id ? { ...s, status: 'Signed', date: new Date().toLocaleString('en-GB') } : s))
    const sig = signatures.find(s => s.id === id)
    showToast(`${t('qcp.documentSigned')} by ${sig?.role || 'user'}`)
  }

  if (detailTab !== 'form') return null

  return (
    <div className="detail-section">
      <div className="detail-sub-tabs">
        <button className={`detail-sub-tab${subTab === 'info' ? ' active' : ''}`} onClick={() => setSubTab('info')}>MODULE INFO</button>
        <button className={`detail-sub-tab${subTab === 'data' ? ' active' : ''}`} onClick={() => setSubTab('data')}>FORM DATA</button>
        <button className={`detail-sub-tab${subTab === 'signatures' ? ' active' : ''}`} onClick={() => setSubTab('signatures')}>SIGNATURES</button>
      </div>

      {subTab === 'info' && (
        <>
          <div className="detail-banner">{t('common.edit').toUpperCase()} {t('inspections.tabs.info').toUpperCase()}</div>
          <div className="panel" style={{ opacity: 1, transform: 'none' }}>
            <div className="panel-body">
              <div className="detail-grid">
                <div className="detail-field"><label>Title of Minutes</label><div className="detail-value">{insp.title}</div></div>
                <div className="detail-field"><label>Project</label><div className="detail-value">{insp.project}</div></div>
                <div className="detail-field"><label>Template</label><div className="detail-value">{insp.norm}</div></div>
              </div>
            </div>
          </div>
        </>
      )}

      {subTab === 'data' && (
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">Inspection Form Data</div></div>
          <div className="panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>Visual inspection of welds</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-success)' }}><input type="radio" name="q1" defaultChecked /> OK</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-overdue)' }}><input type="radio" name="q1" /> KO</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>Dimensional tolerances within spec</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-success)' }}><input type="radio" name="q2" defaultChecked /> OK</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-overdue)' }}><input type="radio" name="q2" /> KO</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>Surface finish quality</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-success)' }}><input type="radio" name="q3" /> OK</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.88rem', color: 'var(--status-overdue)' }}><input type="radio" name="q3" defaultChecked /> KO</label>
              </div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Material traceability number</label>
                <input type="text" defaultValue="LOT-2026-042-B" style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', width: '300px' }} />
              </div>
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-primary)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Inspector comments</label>
                <textarea defaultValue="Weld porosity detected on flange. Requires re-inspection after rework." style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', width: '100%', minHeight: 60 }} />
              </div>
              <div style={{ padding: '8px 0' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>{t('inspections.norm')}</label>
                <select defaultValue="ISO 19443" style={{ padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem' }}>
                  <option>ISO 19443</option><option>AS/EN 9100</option><option>ISO 9001</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
              <button className="btn-outline">Reset</button>
              <button className="btn-primary" onClick={() => showToast('Form data saved')}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'signatures' && (
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">Required Signatures</div></div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead><tr><th>{t('common.name')}</th><th>Role</th><th>{t('common.status')}</th><th>{t('common.date')}</th><th>{t('common.actions')}</th></tr></thead>
              <tbody>
                {signatures.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.role}</td>
                    <td>
                      <span style={{
                        background: s.status === 'Signed' ? '#f0fff4' : '#fffaf0',
                        color: s.status === 'Signed' ? 'var(--status-success)' : 'var(--status-warning)',
                        padding: '3px 10px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600,
                      }}>{s.status}</span>
                    </td>
                    <td style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>{s.date || '—'}</td>
                    <td>
                      {s.status === 'Pending' ? (
                        <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '4px 12px' }} onClick={() => handleSign(s.id)}>{t('common.signed')}</button>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--status-success)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function RowActions() {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      <button className="btn-icon" title="View" onClick={e => e.stopPropagation()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
      <button className="btn-icon" title="Edit" onClick={e => e.stopPropagation()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
      <button className="btn-icon" title="More" onClick={e => e.stopPropagation()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>
    </div>
  )
}
