import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { showToast } from '../Toast'
import formatDate from '../../utils/formatDate'
import ImageEditor from '../ImageEditor/ImageEditor'
import { exportCSV } from '../../utils/exportUtils'
import FilterPanel from '../shared/FilterPanel'

const INITIAL = [
  { id: 'NC-2026-0043', date: '18-03-2026', area: 'Welding - Station S3', status: 'OPEN', criticality: 'Major', desc: 'Porosity defect on TIG weld - motor flange lot 42' },
  { id: 'NC-2026-0042', date: '15-03-2026', area: 'Assembly - Line L2', status: 'PENDING', criticality: 'Minor', desc: 'Torque not within spec on bolt set B-14' },
  { id: 'NC-2026-0041', date: '12-03-2026', area: 'Machining - CNC Bay 7', status: 'OVERDUE', criticality: 'Critical', desc: 'Dimensional deviation on turbine shaft (+0.15mm)' },
  { id: 'NC-2026-0040', date: '10-03-2026', area: 'Incoming Inspection', status: 'CLOSED', criticality: 'Minor', desc: 'Certificate of conformity missing for steel plate batch' },
  { id: 'NC-2026-0039', date: '08-03-2026', area: 'Painting - Booth 2', status: 'PENDING', criticality: 'Minor', desc: 'Coating thickness below minimum on side panel' },
  { id: 'NC-2026-0038', date: '05-03-2026', area: 'Electrical - Panel 4', status: 'PENDING', criticality: 'Major', desc: 'Insulation resistance test failed at 500V' },
  { id: 'NC-2026-0037', date: '02-03-2026', area: 'Assembly - Line L1', status: 'CLOSED', criticality: 'Minor', desc: 'Wrong gasket type installed (replaced on site)' },
  { id: 'NC-2025-0156', date: '28-02-2026', area: 'Welding - Station S1', status: 'CLOSED', criticality: 'Major', desc: 'Incomplete weld penetration on pressure vessel nozzle' },
]

const INSPECTIONS = ['Fabrication moteur HT - 10', 'Fabrication moteur HT - 9', 'Jupiter Bach - 3', 'ABB France - 5']
const AREAS = ['Welding - Station S1', 'Welding - Station S3', 'Assembly - Line L1', 'Assembly - Line L2', 'Machining - CNC Bay 7', 'Incoming Inspection', 'Painting - Booth 2', 'Electrical - Panel 4']
const EVENTS = ['Fabrication', 'Assembly', 'Testing', 'Audit', 'Maintenance']
const CRITS = ['Minor', 'Major', 'Critical']
const STATUSES_NC = ['Ongoing', 'Closed', 'Pending']

const statusBadge = (s, t) => {
  const map = { OPEN: { bg: 'rgba(26,111,196,0.1)', color: 'var(--blue)' }, PENDING: { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)' }, OVERDUE: { bg: 'rgba(239,68,68,0.1)', color: 'var(--status-overdue)' }, CLOSED: { bg: 'rgba(34,197,94,0.1)', color: 'var(--status-success)' } }
  const labels = t ? { OPEN: t('findings.status.open'), PENDING: t('findings.status.pending'), OVERDUE: t('findings.status.overdue'), CLOSED: t('findings.status.closed') } : {}
  const st = map[s] || map.OPEN
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{labels[s] || s}</span>
}
const critBadge = (c, t) => {
  const map = { Critical: { bg: 'rgba(239,68,68,0.1)', color: 'var(--status-overdue)' }, Major: { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)' }, Minor: { bg: 'var(--bg-hover)', color: 'var(--text-tertiary)' } }
  const labels = t ? { Critical: t('findings.criticality.critical'), Major: t('findings.criticality.major'), Minor: t('findings.criticality.minor') } : {}
  const st = map[c] || map.Minor
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{labels[c] || c}</span>
}

const PlayIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="8 5 19 12 8 19"/></svg>
const WarningIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

export default function FindingsNC() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const [findings, setFindings] = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detailItem, setDetailItem] = useState(null)

  // Wizard state
  const [wizardView, setWizardView] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [whys, setWhys] = useState([{ text: '' }])
  const [use5W, setUse5W] = useState(true)
  const [showAdditional, setShowAdditional] = useState(false)
  const [photos, setPhotos] = useState([])
  const [editingImage, setEditingImage] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [analysisMethod, setAnalysisMethod] = useState('5why')
  const [form, setForm] = useState({
    inspection: INSPECTIONS[0], refNo: '', desc: '', area: AREAS[0],
    event: EVENTS[0], other: '', lessonLearnt: false, showReportDate: false,
    status: 'Ongoing', criticality: 'Minor',
  })

  const counters = {
    opened: findings.filter(f => f.status === 'OPEN').length,
    overdue: findings.filter(f => f.status === 'OVERDUE').length,
    pending: findings.filter(f => f.status === 'PENDING').length,
    closed: findings.filter(f => f.status === 'CLOSED').length,
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.counter-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.4 })
    }, containerRef)
    return () => ctx.revert()
  }, [findings.length])

  const openNew = () => {
    const autoRef = `NC/MAINTENANCE/FABRICATION_MOTEUR_HT/${findings.length + 44}`
    setForm({ inspection: INSPECTIONS[0], refNo: autoRef, desc: '', area: AREAS[0], event: EVENTS[0], other: '', lessonLearnt: false, showReportDate: false, status: 'Ongoing', criticality: 'Minor' })
    setWhys([{ text: '' }])
    setUse5W(true)
    setPhotos([])
    setWizardStep(0)
    setWizardView(true)
  }

  const openEdit = (f) => { setEditing(f); setForm({ ...form, area: f.area, criticality: f.criticality, desc: f.desc }); setShowModal(true) }

  const handleSave = () => {
    if (!form.desc) return
    if (editing) {
      setFindings(prev => prev.map(f => f.id === editing.id ? { ...f, area: form.area, criticality: form.criticality, desc: form.desc } : f))
      showToast('Finding updated')
    }
    setShowModal(false)
  }

  const submitWizard = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
    const newId = `NC-${new Date().getFullYear()}-${String(findings.length + 44).padStart(4, '0')}`
    setFindings(prev => [{ id: newId, date: today, status: 'OPEN', area: form.area, criticality: form.criticality, desc: form.desc || 'New finding' }, ...prev])
    showToast(t('findings.ncCreated'))
    setWizardView(false)
  }

  const STEPS = [t('findings.wizardSteps.0'), t('findings.wizardSteps.1'), t('findings.wizardSteps.2'), t('findings.wizardSteps.3'), t('findings.wizardSteps.4')]

  /* ===============================================================
     WIZARD VIEW — 5 step NC creation (exact match to screenshots)
     =============================================================== */
  if (wizardView) {
    return (
      <div ref={containerRef}>
        {/* Stepper bar */}
        <div className="wizard-stepper" style={{ marginBottom: '24px' }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className="wizard-step-connector"></div>}
              <div className={`wizard-step${i < wizardStep ? ' done' : i === wizardStep ? ' active' : ''}`}>
                <div className="wizard-step-num">{i < wizardStep ? '\u2713' : i + 1}</div>
                <div className="wizard-step-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* -- Step 1: Informations -- */}
        {wizardStep === 0 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="modal-field"><label>{t('findings.inspection')}</label><select className="wizard-input" value={form.inspection} onChange={e => setForm({ ...form, inspection: e.target.value })}>{INSPECTIONS.map(i => <option key={i}>{i}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.formLabels.referenceNo')}</label><input className="wizard-input" value={form.refNo} onChange={e => setForm({ ...form, refNo: e.target.value })} /></div>
            <div className="modal-field">
              <label>{t('findings.formLabels.description')}</label>
              <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ padding: '6px 10px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: 8, fontSize: '0.88rem' }}>
                  <button style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                  <button style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>&#x1F517;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21A9;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21AA;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>&#x2630;</button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>&#x2631;</button>
                </div>
                <textarea style={{ width: '100%', border: 'none', padding: '12px', minHeight: 100, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                  value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder={t('findings.formLabels.description')} />
              </div>
            </div>
            <div className="modal-field"><label>{t('findings.area')}</label><select className="wizard-input" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>{AREAS.map(a => <option key={a}>{a}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.event')}</label><select className="wizard-input" value={form.event} onChange={e => setForm({ ...form, event: e.target.value })}>{EVENTS.map(e => <option key={e}>{e}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.other')}</label><select className="wizard-input"><option>-</option><option>Rework</option><option>Scrap</option><option>Concession</option></select></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <div onClick={() => setForm({ ...form, lessonLearnt: !form.lessonLearnt })} style={{ width: 36, height: 20, borderRadius: 10, background: form.lessonLearnt ? 'var(--blue)' : 'var(--toggle-off)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: form.lessonLearnt ? 18 : 2, transition: 'left 0.2s' }}></div>
                </div>
                {t('findings.lessonLearnt')}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <div onClick={() => setForm({ ...form, showReportDate: !form.showReportDate })} style={{ width: 36, height: 20, borderRadius: 10, background: form.showReportDate ? 'var(--blue)' : 'var(--toggle-off)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: form.showReportDate ? 18 : 2, transition: 'left 0.2s' }}></div>
                </div>
                {t('findings.formLabels.reportDate')}
              </label>
            </div>
            <div className="modal-field"><label>{t('findings.formLabels.status')}</label><select className="wizard-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES_NC.map(s => <option key={s}>{s}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.criticalityLabel')}</label><select className="wizard-input" value={form.criticality} onChange={e => setForm({ ...form, criticality: e.target.value })}>{CRITS.map(c => <option key={c}>{c}</option>)}</select></div>
            <button className="btn-outline" style={{ marginTop: 8 }} onClick={() => showToast('Attachment manager opened', 'info')}>{t('actionsPage.attachments').toUpperCase()}</button>
            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><input type="checkbox" /> {t('findings.sendNotification')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><input type="checkbox" /> {t('findings.sendNotification')}</label>
            </div>
          </div>
        )}

        {/* -- Step 2: Pictures -- */}
        {wizardStep === 1 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              <button onClick={() => showToast('Picture picker opened', 'info')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--bg-tertiary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {t('findings.pickPicture')}
              </button>
              <button onClick={() => showToast(t('toasts.upload'), 'info')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--bg-tertiary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                {t('findings.uploadPicture')}
              </button>
            </div>
            {/* Photo cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {photos.length === 0 && (
                <div style={{ width: 280, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=180&fit=crop" alt="Inspection" style={{ width: '100%', height: 160, objectFit: 'cover' }} crossOrigin="anonymous" />
                  <div style={{ padding: '8px 12px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>{t('common.name')}</div>
                    <input type="text" defaultValue="QS" style={{ border: 'none', borderBottom: '1px solid var(--border-primary)', width: '100%', fontSize: '0.85rem', padding: '4px 0', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border-primary)' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }} title={t('common.edit')} onClick={() => setEditingImage('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=640&h=480&fit=crop')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }} title="Apply a grid" onClick={() => showToast('Grid applied', 'info')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4 }} title={t('common.delete')} onClick={() => showToast('Photo deleted')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {editingImage && <ImageEditor imageSrc={editingImage} onSave={() => { setEditingImage(null); showToast('Image annotated') }} onCancel={() => setEditingImage(null)} />}
          </div>
        )}

        {/* -- Step 3: Cause / Analysis -- */}
        {wizardStep === 2 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Analysis method pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {[
                { key: '5why', label: t('findings.analysis5Why'), target: 'analysis-5why' },
                { key: '8d', label: t('findings.analysis8D'), target: 'analysis-8d' },
                { key: 'ishikawa', label: t('findings.analysisIshikawa'), target: 'analysis-ishikawa' },
              ].map(pill => (
                <button
                  key={pill.key}
                  data-demo-target={pill.target}
                  onClick={() => setAnalysisMethod(pill.key)}
                  style={{
                    height: 32,
                    padding: '0 16px',
                    borderRadius: 20,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: analysisMethod === pill.key ? 'none' : '1px solid var(--border-primary)',
                    background: analysisMethod === pill.key ? 'var(--red)' : 'var(--bg-secondary)',
                    color: analysisMethod === pill.key ? '#fff' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* 5 Pourquoi panel */}
            {analysisMethod === '5why' && (
              <>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24, cursor: 'pointer' }}>
                  <div onClick={() => setUse5W(!use5W)} style={{ width: 36, height: 20, borderRadius: 10, background: use5W ? 'var(--blue)' : 'var(--toggle-off)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: use5W ? 18 : 2, transition: 'left 0.2s' }}></div>
                  </div>
                  {t('findings.whyAnalysis')}
                </label>

                {use5W && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {whys.map((w, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="btn-icon" onClick={() => setWhys(prev => prev.filter((_, ii) => ii !== i))} style={{ color: 'var(--status-error)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', minWidth: 70 }}>{t('findings.whyLabel')} - {i + 1} :</span>
                        <div style={{ flex: 1 }}>
                          <input type="text" value={w.text} onChange={e => setWhys(prev => prev.map((ww, ii) => ii === i ? { text: e.target.value } : ww))}
                            placeholder={t('findings.formLabels.description')} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', outline: 'none' }} />
                        </div>
                        <button className="btn-outline" onClick={() => { const a = prompt('Describe corrective action for this Why:'); if(a) showToast('Action added: ' + a.substring(0, 30) + '...', 'success') }}>{t('findings.action')}</button>
                      </div>
                    ))}
                    {whys.length < 5 && (
                      <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <button className="btn-primary" onClick={() => setWhys(prev => [...prev, { text: '' }])}>{t('findings.addWhy').toUpperCase()}</button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 8D panel */}
            {analysisMethod === '8d' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {[
                  { id: 'd1', num: 'D1', label: t('findings.8d.d1'), data: 'S. Dupont (QC Lead), J. Martin (Inspector), A. Bernard (Process Eng.)' },
                  { id: 'd2', num: 'D2', label: t('findings.8d.d2'), data: 'Certificat de conformité non signé. Impact: retard livraison lot n°42.' },
                  { id: 'd3', num: 'D3', label: t('findings.8d.d3'), data: 'Quarantaine lot n°42. Notification client sous 24h.' },
                  { id: 'd4', num: 'D4', label: t('findings.8d.d4'), data: 'Processus de signature non intégré au workflow digital. Formation insuffisante.' },
                  { id: 'd5', num: 'D5', label: t('findings.8d.d5'), data: 'Intégrer signature électronique obligatoire dans le workflow qualité.' },
                  { id: 'd6', num: 'D6', label: t('findings.8d.d6'), data: 'Audit interne prévu J+30. Vérification 100% lots en cours.' },
                  { id: 'd7', num: 'D7', label: t('findings.8d.d7'), data: 'Checklist pré-livraison mise à jour. Formation trimestrielle ajoutée.' },
                  { id: 'd8', num: 'D8', label: t('findings.8d.d8'), data: 'Équipe félicitée. Temps de résolution: 5 jours (objectif: 7).' },
                ].map(d => (
                  <div key={d.id} data-demo-target={`8d-${d.id}`} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 8 }}>{d.num} — {d.label}</div>
                    <textarea
                      defaultValue={d.data}
                      style={{ width: '100%', minHeight: 60, padding: '8px 10px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.82rem', outline: 'none', resize: 'vertical', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Ishikawa panel */}
            {analysisMethod === 'ishikawa' && (
              <div data-demo-target="ishikawa-diagram" style={{ width: '100%', overflowX: 'auto' }}>
                <svg viewBox="0 0 800 400" style={{ width: '100%', maxWidth: 800, display: 'block', margin: '0 auto' }}>
                  {/* Central horizontal line */}
                  <line x1="60" y1="200" x2="740" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  {/* Effect label */}
                  <rect x="700" y="180" width="90" height="40" rx="6" fill="var(--bg-secondary)" stroke="var(--border-primary)" strokeWidth="1" />
                  <text x="745" y="205" fill="var(--text-primary)" fontSize="14" fontWeight="bold" textAnchor="middle">{t('findings.ishikawa.effect')}</text>

                  {/* Top branches */}
                  {/* Matiere - top left */}
                  <line x1="180" y1="60" x2="250" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="150" y="50" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-matiere">{t('findings.ishikawa.matiere')}</text>
                  <line x1="110" y1="95" x2="200" y2="155" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="70" y="90" fill="var(--text-primary)" fontSize="12">Certificat manquant</text>
                  <line x1="130" y1="120" x2="215" y2="170" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="60" y="118" fill="var(--text-primary)" fontSize="12">Document non à jour</text>

                  {/* Methode - top center */}
                  <line x1="390" y1="60" x2="430" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="370" y="50" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-methode">{t('findings.ishikawa.methode')}</text>
                  <line x1="320" y1="90" x2="400" y2="150" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="240" y="86" fill="var(--text-primary)" fontSize="12">Workflow sans validation</text>
                  <line x1="340" y1="115" x2="410" y2="165" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="260" y="113" fill="var(--text-primary)" fontSize="12">Checklist incomplète</text>

                  {/* Milieu - top right */}
                  <line x1="580" y1="60" x2="600" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="560" y="50" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-milieu">{t('findings.ishikawa.milieu')}</text>
                  <line x1="510" y1="90" x2="585" y2="150" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="410" y="86" fill="var(--text-primary)" fontSize="12">Poste de travail non équipé</text>
                  <line x1="525" y1="118" x2="590" y2="168" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="445" y="116" fill="var(--text-primary)" fontSize="12">Éclairage insuffisant</text>

                  {/* Bottom branches */}
                  {/* Materiel - bottom left */}
                  <line x1="180" y1="340" x2="250" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="150" y="360" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-materiel">{t('findings.ishikawa.materiel')}</text>
                  <line x1="110" y1="305" x2="200" y2="245" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="80" y="310" fill="var(--text-primary)" fontSize="12">Scanner HS</text>
                  <line x1="130" y1="280" x2="215" y2="230" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="60" y="285" fill="var(--text-primary)" fontSize="12">Logiciel obsolète</text>

                  {/* Main d'oeuvre - bottom center */}
                  <line x1="390" y1="340" x2="430" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="340" y="360" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-maindoeuvre">{t('findings.ishikawa.maindoeuvre')}</text>
                  <line x1="320" y1="308" x2="400" y2="250" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="235" y="314" fill="var(--text-primary)" fontSize="12">Formation insuffisante</text>
                  <line x1="340" y1="283" x2="410" y2="235" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="280" y="288" fill="var(--text-primary)" fontSize="12">Turnover élevé</text>

                  {/* Management - bottom right */}
                  <line x1="580" y1="340" x2="600" y2="200" stroke="var(--border-primary)" strokeWidth="2" />
                  <text x="545" y="360" fill="var(--text-primary)" fontSize="14" fontWeight="bold" data-demo-target="ishikawa-management">{t('findings.ishikawa.management')}</text>
                  <line x1="510" y1="308" x2="585" y2="250" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="415" y="314" fill="var(--text-primary)" fontSize="12">Supervision insuffisante</text>
                  <line x1="525" y1="280" x2="590" y2="232" stroke="var(--border-primary)" strokeWidth="1.5" />
                  <text x="455" y="285" fill="var(--text-primary)" fontSize="12">Objectifs flous</text>
                </svg>
              </div>
            )}

            {/* Additional information toggle (shared across methods) */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 24, cursor: 'pointer' }}>
              <div onClick={() => setShowAdditional(!showAdditional)} style={{ width: 36, height: 20, borderRadius: 10, background: showAdditional ? 'var(--blue)' : 'var(--toggle-off)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: showAdditional ? 18 : 2, transition: 'left 0.2s' }}></div>
              </div>
              {t('findings.additionalInfo')}
            </label>
            {showAdditional && (
              <textarea placeholder={t('findings.additionalNotes')} style={{ width: '100%', marginTop: 12, padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', minHeight: 60, outline: 'none' }} />
            )}
          </div>
        )}

        {/* -- Step 4: Resolution -- */}
        {wizardStep === 3 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="modal-field">
              <label>{t('findings.resolution')}</label>
              <textarea
                placeholder={t('findings.resolution')}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', minHeight: 100, outline: 'none', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="modal-field">
                <label>{t('common.responsible') || 'Responsible'}</label>
                <select className="wizard-input" defaultValue="S. Dupont">
                  <option>S. Dupont</option>
                  <option>J. Martin</option>
                  <option>A. Bernard</option>
                </select>
              </div>
              <div className="modal-field">
                <label>{t('common.deadline') || 'Deadline'}</label>
                <input type="date" className="wizard-input" defaultValue="2026-04-15" />
              </div>
            </div>
            <div className="modal-field" style={{ marginTop: 8 }}>
              <label>{t('actionsPage.cost') || 'Estimated cost'}</label>
              <input type="text" className="wizard-input" placeholder="0.00 EUR" />
            </div>
          </div>
        )}

        {/* -- Step 5: Signature -- */}
        {wizardStep === 4 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ background: 'rgba(26,111,196,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              {t('findings.signatureNote')}
            </div>

            {/* 3 Signature zones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { key: 'quality', label: 'Responsable Qualité', name: 'S. Dupont' },
                { key: 'client', label: 'Client', name: 'J. Martin' },
                { key: 'third', label: 'Tiers', name: 'A. Bernard' },
              ].map(zone => (
                <div key={zone.key} data-demo-target={`nc-sig-${zone.key}`} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>{zone.label}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>{zone.name}</div>
                  <div style={{ width: '100%', height: 80, border: '1px dashed var(--border-primary)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, background: 'var(--bg-primary)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Signature zone</span>
                  </div>
                  <button
                    className="btn-primary"
                    data-demo-target={`nc-sign-${zone.key}`}
                    onClick={(e) => {
                      const box = e.currentTarget.parentElement.querySelector('div[style*="dashed"]')
                      if (box) {
                        box.innerHTML = ''
                        box.style.border = '1px solid var(--status-success)'
                        box.style.background = 'rgba(34,197,94,0.06)'
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                        svg.setAttribute('width', '24')
                        svg.setAttribute('height', '24')
                        svg.setAttribute('viewBox', '0 0 24 24')
                        svg.setAttribute('fill', 'none')
                        svg.setAttribute('stroke', 'var(--status-success)')
                        svg.setAttribute('stroke-width', '2.5')
                        svg.innerHTML = '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'
                        box.appendChild(svg)
                        const txt = document.createElement('span')
                        txt.style.cssText = 'font-size:0.78rem;color:var(--status-success);font-weight:600;margin-left:6px'
                        txt.textContent = zone.name
                        box.appendChild(txt)
                      }
                      showToast(`${zone.label} signed`, 'success')
                    }}
                    style={{ fontSize: '0.82rem', padding: '6px 16px' }}
                  >
                    Signer
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button data-demo-target="nc-sign" onClick={() => { showToast(t('qcp.documentSigned'), 'success'); submitWizard() }} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 6, background: 'var(--status-success)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('findings.signAndClose').toUpperCase()}</button>
              <button data-demo-target="nc-close" onClick={submitWizard} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 6, background: 'var(--bg-tertiary)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('findings.closed_toast').toUpperCase()}</button>
              <button onClick={() => { showToast(t('findings.saveDraft')); setWizardView(false) }} style={{ flex: 1, padding: '14px', border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>{t('common.save').toUpperCase()}</button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32, paddingTop: 16 }}>
          <button className="btn-outline" disabled={wizardStep === 0} onClick={() => setWizardStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            {t('findings.previous').toUpperCase()}
          </button>
          <button className="btn-primary" data-demo-target="nc-wizard-next" onClick={() => { if (wizardStep >= 4) submitWizard(); else setWizardStep(s => s + 1) }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {wizardStep === 2 ? t('findings.saveAndNext').toUpperCase() : wizardStep >= 4 ? t('findings.finish').toUpperCase() : t('findings.next').toUpperCase()}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    )
  }

  /* ===============================================================
     DETAIL VIEW
     =============================================================== */
  if (detailItem) {
    return (
      <div ref={containerRef}>
        <button className="btn-outline" onClick={() => setDetailItem(null)} style={{ marginBottom: 16 }}>&larr; {t('inspections.backToList')}</button>
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">{detailItem.id}</div>{statusBadge(detailItem.status, t)}</div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.formLabels.reportDate')}</label><div style={{ fontSize: '0.9rem', marginTop: 4 }}>{formatDate(detailItem.date)}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.area')}</label><div style={{ fontSize: '0.9rem', marginTop: 4 }}>{detailItem.area}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.criticalityLabel')}</label><div style={{ marginTop: 4 }}>{critBadge(detailItem.criticality, t)}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.formLabels.status')}</label><div style={{ marginTop: 4 }}>{statusBadge(detailItem.status, t)}</div></div>
            </div>
            <div style={{ marginTop: 16 }}><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.formLabels.description')}</label><p style={{ fontSize: '0.9rem', marginTop: 4, lineHeight: 1.5 }}>{detailItem.desc}</p></div>
          </div>
        </div>
      </div>
    )
  }

  /* ===============================================================
     LIST VIEW
     =============================================================== */
  return (
    <div ref={containerRef} data-demo-target="findings-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="status-counters">
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('findings.status.open')}</div><div className="counter-card-count" style={{ color: 'var(--blue)' }}>{counters.opened}</div></div><div className="counter-card-circle" style={{ background: 'var(--blue)' }}><PlayIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('findings.status.overdue')}</div><div className="counter-card-count" style={{ color: 'var(--status-error)' }}>{counters.overdue}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-error)' }}><WarningIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('findings.status.pending')}</div><div className="counter-card-count" style={{ color: 'var(--status-warning)' }}>{counters.pending}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-warning)' }}><ClockIcon /></div></div>
        <div className="counter-card"><div className="counter-card-info"><div className="counter-card-label">{t('findings.status.closed')}</div><div className="counter-card-count" style={{ color: 'var(--status-success)' }}>{counters.closed}</div></div><div className="counter-card-circle" style={{ background: 'var(--status-success)' }}><CheckIcon /></div></div>
      </div>

      <div className="table-toolbar">
        <button className="btn-outline" onClick={() => setIsFilterOpen(true)}>{t('common.filters')}</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button className="btn-outline" onClick={() => { exportCSV(findings, `inspecto-findings-${new Date().toISOString().slice(0, 10)}.csv`); showToast(t('toasts.csvExported'), 'success') }}>{t('common.export')}</button>
          <button className="btn-primary" data-demo-target="btn-new-nc" onClick={openNew}>{t('findings.newNC')}</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>{t('findings.formLabels.referenceNo')}</th><th>{t('findings.formLabels.reportDate')}</th><th>{t('findings.area')}</th><th>{t('findings.formLabels.status')}</th><th>{t('findings.criticalityLabel')}</th><th>{t('common.actions')}</th></tr></thead>
          <tbody>
            {findings.map(f => (
              <tr key={f.id} onClick={() => setDetailItem(f)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}>{f.id}</td>
                <td>{formatDate(f.date)}</td>
                <td>{f.area}</td>
                <td>{statusBadge(f.status, t)}</td>
                <td>{critBadge(f.criticality, t)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); setDetailItem(f) }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                    <button className="btn-icon" title={t('common.edit')} onClick={e => { e.stopPropagation(); openEdit(f) }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{t('common.edit')}</h3>
            <div className="modal-field"><label>{t('findings.area')} *</label><select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>{AREAS.map(a => <option key={a}>{a}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.criticalityLabel')} *</label><select value={form.criticality} onChange={e => setForm({ ...form, criticality: e.target.value })}>{CRITS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="modal-field"><label>{t('findings.formLabels.description')} *</label><textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} /></div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
              <button className="btn-primary" onClick={handleSave}>{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => { setIsFilterOpen(false); showToast(t('toasts.filtersApplied'), 'info') }}
        onReset={() => { setIsFilterOpen(false); showToast(t('toasts.filtersReset'), 'info') }}
        filterConfig={[
          { type: 'select', label: 'Criticité', key: 'criticality', options: [
            { value: '', label: 'Toutes' },
            { value: 'critical', label: 'Critique' },
            { value: 'major', label: 'Majeur' },
            { value: 'minor', label: 'Mineur' },
          ]},
          { type: 'select', label: 'Statut', key: 'status', options: [
            { value: '', label: 'Tous' },
            { value: 'open', label: 'Ouvert' },
            { value: 'pending', label: 'En attente' },
            { value: 'closed', label: 'Clôturé' },
          ]},
        ]}
      />
    </div>
  )
}
