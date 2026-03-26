import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { showToast } from '../Toast'
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

const statusBadge = (s) => {
  const map = { OPEN: { bg: 'rgba(26,111,196,0.1)', color: 'var(--blue)' }, PENDING: { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)' }, OVERDUE: { bg: 'rgba(239,68,68,0.1)', color: 'var(--status-overdue)' }, CLOSED: { bg: 'rgba(34,197,94,0.1)', color: 'var(--status-success)' } }
  const st = map[s] || map.OPEN
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{s}</span>
}
const critBadge = (c) => {
  const map = { Critical: { bg: 'rgba(239,68,68,0.1)', color: 'var(--status-overdue)' }, Major: { bg: 'rgba(245,158,11,0.1)', color: 'var(--status-warning)' }, Minor: { bg: 'var(--bg-hover)', color: 'var(--text-tertiary)' } }
  const st = map[c] || map.Minor
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{c}</span>
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

  const STEPS = [t('findings.wizardSteps.0'), t('findings.wizardSteps.1'), t('findings.wizardSteps.2'), t('findings.wizardSteps.3')]

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
            <div className="modal-field"><label>{t('findings.criticality.critical').replace('Critical', 'Criticality')}</label><select className="wizard-input" value={form.criticality} onChange={e => setForm({ ...form, criticality: e.target.value })}>{CRITS.map(c => <option key={c}>{c}</option>)}</select></div>
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
                PICK PICTURE
              </button>
              <button onClick={() => showToast(t('toasts.upload'), 'info')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--bg-tertiary)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                UPLOAD PICTURE
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

        {/* -- Step 3: Cause (5W) -- */}
        {wizardStep === 2 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
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
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', minWidth: 70 }}>WHY - {i + 1} :</span>
                    <div style={{ flex: 1 }}>
                      <input type="text" value={w.text} onChange={e => setWhys(prev => prev.map((ww, ii) => ii === i ? { text: e.target.value } : ww))}
                        placeholder={t('findings.formLabels.description')} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', outline: 'none' }} />
                    </div>
                    <button className="btn-outline" onClick={() => { const a = prompt('Describe corrective action for this Why:'); if(a) showToast('Action added: ' + a.substring(0, 30) + '...', 'success') }}>ACTION</button>
                  </div>
                ))}
                {whys.length < 5 && (
                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <button className="btn-primary" onClick={() => setWhys(prev => [...prev, { text: '' }])}>{t('findings.addWhy').toUpperCase()}</button>
                  </div>
                )}
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 24, cursor: 'pointer' }}>
              <div onClick={() => setShowAdditional(!showAdditional)} style={{ width: 36, height: 20, borderRadius: 10, background: showAdditional ? 'var(--blue)' : 'var(--toggle-off)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-secondary)', position: 'absolute', top: 2, left: showAdditional ? 18 : 2, transition: 'left 0.2s' }}></div>
              </div>
              Additional information
            </label>
            {showAdditional && (
              <textarea placeholder="Additional notes..." style={{ width: '100%', marginTop: 12, padding: '10px 14px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem', minHeight: 60, outline: 'none' }} />
            )}
          </div>
        )}

        {/* -- Step 4: Resolution -- */}
        {wizardStep === 3 && (
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* -- Step 5: Signature -- */}
        {wizardStep === 4 && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ background: 'rgba(26,111,196,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Note: If you sign or close the non-conformity, you will no longer be able to modify it.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button data-demo-target="nc-sign" onClick={() => showToast(t('qcp.documentSigned'), 'success')} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 6, background: 'var(--status-success)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('findings.signAndClose').toUpperCase()}</button>
              <button data-demo-target="nc-close" onClick={submitWizard} style={{ flex: 1, padding: '14px', border: 'none', borderRadius: 6, background: 'var(--bg-tertiary)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('findings.closed_toast').toUpperCase()}</button>
              <button onClick={() => { showToast(t('findings.saveDraft')); setWizardView(false) }} style={{ flex: 1, padding: '14px', border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>{t('common.save').toUpperCase()}</button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32, paddingTop: 16 }}>
          <button className="btn-outline" disabled={wizardStep === 0} onClick={() => setWizardStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            PREVIOUS
          </button>
          <button className="btn-primary" data-demo-target="nc-wizard-next" onClick={() => { if (wizardStep >= 4) submitWizard(); else setWizardStep(s => s + 1) }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {wizardStep === 2 ? t('common.save').toUpperCase() + ' AND NEXT' : wizardStep >= 4 ? 'FINISH' : 'NEXT'}
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
          <div className="panel-header"><div className="panel-title">{detailItem.id}</div>{statusBadge(detailItem.status)}</div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.formLabels.reportDate')}</label><div style={{ fontSize: '0.9rem', marginTop: 4 }}>{detailItem.date}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.area')}</label><div style={{ fontSize: '0.9rem', marginTop: 4 }}>{detailItem.area}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Criticality</label><div style={{ marginTop: 4 }}>{critBadge(detailItem.criticality)}</div></div>
              <div><label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{t('findings.formLabels.status')}</label><div style={{ marginTop: 4 }}>{statusBadge(detailItem.status)}</div></div>
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
          <thead><tr><th>{t('findings.formLabels.referenceNo')}</th><th>{t('findings.formLabels.reportDate')}</th><th>{t('findings.area')}</th><th>{t('findings.formLabels.status')}</th><th>Criticality</th><th>{t('common.actions')}</th></tr></thead>
          <tbody>
            {findings.map(f => (
              <tr key={f.id} onClick={() => setDetailItem(f)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}>{f.id}</td>
                <td>{f.date}</td>
                <td>{f.area}</td>
                <td>{statusBadge(f.status)}</td>
                <td>{critBadge(f.criticality)}</td>
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
            <div className="modal-field"><label>Criticality *</label><select value={form.criticality} onChange={e => setForm({ ...form, criticality: e.target.value })}>{CRITS.map(c => <option key={c}>{c}</option>)}</select></div>
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
