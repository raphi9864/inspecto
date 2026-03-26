import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../Toast'
import ImageEditor from '../ImageEditor/ImageEditor'

const FINDINGS = ['Finding / NC', 'NC-2026-0043', 'NC-2026-0042', 'NC-2026-0041']

export default function CFSIPage() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [wizardStep, setWizardStep] = useState(0)
  const [editingImage, setEditingImage] = useState(null)
  const [form, setForm] = useState({
    finding: FINDINGS[0], refNo: '', desc: '', reportDate: new Date().toLocaleString('en-GB').replace(',', ''),
    status: 'Ongoing',
  })

  const STEPS = [t('findings.wizardSteps.0'), t('findings.wizardSteps.1'), t('findings.wizardSteps.2'), t('findings.wizardSteps.3')]

  const submitCFSI = () => {
    showToast(t('cfsi.closedSuccess'), 'success')
    setWizardStep(0)
    setForm({ finding: FINDINGS[0], refNo: '', desc: '', reportDate: new Date().toLocaleString('en-GB').replace(',', ''), status: 'Ongoing' })
  }

  return (
    <div ref={containerRef}>
      {/* Stepper */}
      <div className="wizard-stepper" style={{ marginBottom: 24 }}>
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

      {/* Step 1: Informations */}
      {wizardStep === 0 && (
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--bg-secondary)', borderRadius: 12, padding: 32, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
          <div className="modal-field"><label>{t('findings.formLabels.findingNC')}</label><select className="wizard-input" value={form.finding} onChange={e => setForm({ ...form, finding: e.target.value })}>{FINDINGS.map(f => <option key={f}>{f}</option>)}</select></div>
          <div className="modal-field"><label>{t('findings.formLabels.referenceNo')}</label><input className="wizard-input" value={form.refNo} onChange={e => setForm({ ...form, refNo: e.target.value })} placeholder={t('findings.formLabels.referenceNo')} /></div>
          <div className="modal-field">
            <label>{t('findings.formLabels.description')}</label>
            <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ padding: '6px 10px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: 8, fontSize: '0.88rem' }}>
                <button style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                <button style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => showToast('Link added', 'info')}>&#x1F517;</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21A9;</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21AA;</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x2630;</button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x2631;</button>
              </div>
              <textarea style={{ width: '100%', border: 'none', padding: 12, minHeight: 100, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder={t('findings.formLabels.description')} />
            </div>
          </div>
          <div className="modal-field"><label>{t('findings.formLabels.reportDate')}</label><input className="wizard-input" value={form.reportDate} readOnly style={{ background: 'var(--bg-tertiary)' }} /></div>
          <div className="modal-field"><label>{t('findings.formLabels.status')}</label><select className="wizard-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Ongoing</option><option>Closed</option><option>Pending</option></select></div>
          <div style={{ display: 'flex', gap: 24, margin: '16px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><input type="checkbox" /> {t('findings.sendNotification')}</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><input type="checkbox" /> {t('findings.sendNotification')}</label>
          </div>
          <div className="modal-field"><label>External Emails</label><select className="wizard-input"><option>External Emails</option></select></div>

          {/* Practical notices */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Practical notices</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a href="#" onClick={e => { e.preventDefault(); showToast('PDF downloaded', 'info') }} style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Practical Guide to ensure the quality of materials intended for nuclear installations
              </a>
              <a href="#" onClick={e => { e.preventDefault(); showToast('PDF downloaded', 'info') }} style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Guide to design and manufacturing requirements intended for equipment suppliers and their subcontractors
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Pictures */}
      {wizardStep === 1 && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <button onClick={() => showToast('Upload zone opened', 'info')} style={{ padding: '10px 20px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
              UPLOAD PICTURE
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ width: 280, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=180&fit=crop" alt="CFSI" style={{ width: '100%', height: 160, objectFit: 'cover' }} crossOrigin="anonymous" />
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t('common.name')}</div>
                <input type="text" placeholder={t('common.name')} style={{ border: 'none', borderBottom: '1px solid var(--border-primary)', width: '100%', fontSize: '0.85rem', padding: '4px 0', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderTop: '1px solid var(--border-secondary)' }}>
                <button style={{ background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '50%' }} title={t('common.edit')} onClick={() => setEditingImage('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=640&h=480&fit=crop')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Apply a grid" onClick={() => showToast('Grid applied', 'info')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title={t('common.delete')} onClick={() => showToast('Photo deleted')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
          {editingImage && <ImageEditor imageSrc={editingImage} onSave={() => { setEditingImage(null); showToast('Image annotated') }} onCancel={() => setEditingImage(null)} />}
        </div>
      )}

      {/* Step 3: Resolution */}
      {wizardStep === 2 && (
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--blue)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Step 4: Signature */}
      {wizardStep === 3 && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-accent)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Note: If you sign or close the CFSI, you will no longer be able to modify it
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={() => showToast('CFSI signed', 'success')} style={{ flex: 1, padding: 14, border: 'none', borderRadius: 6, background: 'var(--status-success)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('findings.signAndClose').toUpperCase()}</button>
            <button onClick={submitCFSI} style={{ flex: 1, padding: 14, border: 'none', borderRadius: 6, background: 'var(--blue)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{t('common.close').toUpperCase()}</button>
            <button onClick={() => { showToast(t('findings.saveDraft')); setWizardStep(0) }} style={{ flex: 1, padding: 14, border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>{t('common.save').toUpperCase()}</button>
          </div>

          {/* Declare CFSI */}
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Declare a CFSI to the authorities</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a href="#" onClick={e => { e.preventDefault(); showToast('ASNR form opened', 'info') }} style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                ASNR reporting form
              </a>
              <a href="#" onClick={e => { e.preventDefault(); showToast('EDF form opened', 'info') }} style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                EDF group whistleblowing system
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 32 }}>
        <button className="btn-outline" disabled={wizardStep === 0} onClick={() => setWizardStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          PREVIOUS
        </button>
        <button className="btn-primary" onClick={() => { if (wizardStep >= 3) submitCFSI(); else setWizardStep(s => s + 1) }} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {wizardStep === 1 ? t('common.save').toUpperCase() + ' AND NEXT' : wizardStep >= 3 ? 'FINISH' : 'NEXT'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  )
}
