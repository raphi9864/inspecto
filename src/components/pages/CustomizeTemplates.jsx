import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const TEMPLATES = [
  { id: 1, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement', type: 'Inspection', created: '25-06-2025 13:57:24', status: 'REVOKED' },
  { id: 2, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2', type: 'Inspection', created: '08-09-2024 19:04:13', status: 'REVOKED' },
  { id: 3, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2024-09-11T145907', type: 'Inspection', created: '11-09-2024 14:59:08', status: 'REVOKED' },
  { id: 4, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2025-02-24T131139', type: 'Inspection', created: '24-02-2025 13:11:39', status: 'EDITABLE' },
  { id: 5, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2025-03-24T151416', type: 'Inspection', created: '24-03-2025 15:14:16', status: 'EDITABLE' },
  { id: 6, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2025-07-22T133746', type: 'Inspection', created: '22-07-2025 13:37:46', status: 'EDITABLE' },
  { id: 7, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2024-09-08', type: 'Inspection', created: '08-09-2024 21:54:44', status: 'REVOKED' },
  { id: 8, company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement-2025-07-22T142544', type: 'Inspection', created: '22-07-2025 14:25:44', status: 'EDITABLE' },
  { id: 9, company: 'INSPECTO', name: 'ABB-Formation-Formulaire-Controle-Final', type: 'Inspection', created: '26-03-2025 13:09:15', status: 'EDITABLE' },
  { id: 10, company: 'INSPECTO', name: 'ABB-Formation-Formulaire-Controle-Final', type: 'Inspection', created: '26-03-2025 13:52:19', status: 'REVOKED' },
  { id: 11, company: 'INSPECTO', name: 'ALLIA_ATTESTATION-FORMATION', type: 'Inspection', created: '29-08-2025 22:32:14', status: 'REVOKED' },
  { id: 12, company: 'INSPECTO', name: 'ALLIA_AUDIT_at_supplier_location', type: 'Inspection', created: '21-08-2025 17:22:43', status: 'REVOKED' },
  { id: 13, company: 'INSPECTO', name: 'ALLIA_AUDIT_SECURITE', type: 'Inspection', created: '22-08-2025 15:31:46', status: 'REVOKED' },
  { id: 14, company: 'INSPECTO', name: 'ALLIA_AUDIT_SUPPLIER_WS', type: 'Inspection', created: '22-08-2025 09:58:53', status: 'REVOKED' },
]

const SECTIONS = [
  { title: 'General Information', desc: '' },
  { title: '1. Conformite des informations de la plaque / a la commande', desc: '1. Conformite des informations de la plaque / a la commande 1. Conformity of the rating plate data / to the order' },
  { title: '2. Conformite visuelle du moteur / a la comm...', desc: '2. Conformite visuelle du moteur / a la commande 2. Conformity of the motor / to the order' },
  { title: '3. Conclusion (Signature)', desc: '' },
  { title: '4.', desc: '' },
]

const PREVIEW_FIELDS = [
  'N° DE COMMANDE _LIGNE / N° OF ORDER_POSITION',
  'N° ITEM OU D\'ARTICLE EDF / N° ITEM (ARTICLE)',
  'N° SERIE DU MOTEUR / SERIAL NUMBER',
  'LIEU D\'INSPECTION / INSPECTION LOCATION',
  'INSPECTEUR / INSPECTOR',
  'TYPE / TYPE',
  'PUISSANC / POWER',
  'VITESSE / SPEED',
  'TENSION / VOLTAGE',
  'FORME DE MONTAGE / MOUNTING',
  'INDICE DE PROTECTION / INDEX OF PROTECTION',
  'ROULEMENT COTE COMMANDE / DRIVE-END BEARING',
  'ROULEMENT COTE OPPOSE CDE / NONE DRIVE-END BEARING',
  'QUALIFICATION / QUALIFICATION',
  'N° ARTICLE EDF / N° ITEM',
  'CODE PRODUIT / PRODUCT CODE',
]

export default function CustomizeTemplates() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState(TEMPLATES)
  const [detail, setDetail] = useState(null)
  const [detailTab, setDetailTab] = useState('info')
  const [showTips, setShowTips] = useState(true)
  const [editForm, setEditForm] = useState({ company: 'INSPECTO', name: '', title: '', desc: '', formType: 'INSPECTION', signatures: 2 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.02, delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [templates.length, detail])

  const filtered = templates.filter(tpl => tpl.name.toLowerCase().includes(search.toLowerCase()))

  const openDetail = (tpl) => {
    setDetail(tpl)
    setDetailTab('info')
    setEditForm({ company: tpl.company, name: tpl.name, title: 'Test training IA', desc: '', formType: 'INSPECTION', signatures: 2 })
  }

  /* -- DETAIL VIEW -- */
  if (detail) {
    return (
      <div ref={ref}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-primary" style={{ background: 'var(--bg-tertiary)' }} onClick={() => setDetail(null)}>{t('common.back')}</button>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '16px 0', borderBottom: '1px solid var(--border-primary)' }}>
            {[
              { key: 'info', label: t('templates.tabs.info'), icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
              { key: 'edition', label: t('templates.tabs.edition'), icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
              { key: 'preview', label: t('templates.tabs.preview'), icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
            ].map(tab => (
              <button key={tab.key} onClick={() => setDetailTab(tab.key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.9rem', fontWeight: 600, color: detailTab === tab.key ? 'var(--blue)' : 'var(--text-secondary)',
                  borderBottom: detailTab === tab.key ? '2px solid #2563eb' : '2px solid transparent', paddingBottom: 8 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {/* INFORMATIONS */}
            {detailTab === 'info' && (
              <>
                <div style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)', borderRadius: 6, padding: '10px 16px', textAlign: 'center', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {t('templates.tabs.info')}
                </div>
                <div className="modal-field"><label>{t('common.company')}</label><select className="wizard-input" value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}><option>INSPECTO</option></select></div>
                <div className="modal-field"><label>{t('common.name')}</label><input className="wizard-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                <div className="modal-field">
                  <label>Title</label>
                  <div style={{ position: 'relative' }}>
                    <input className="wizard-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value.slice(0, 64)})} maxLength={64} />
                    <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{editForm.title.length} / 64</span>
                  </div>
                </div>
                <div className="modal-field">
                  <label>{t('common.description')}</label>
                  <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ padding: '6px 10px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: 8, fontSize: '0.88rem' }}>
                      <button style={{ border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}>B</button>
                      <button style={{ border: 'none', background: 'none', fontStyle: 'italic', cursor: 'pointer' }}>I</button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x1F517;</button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21A9;</button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x21AA;</button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x2630;</button>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&#x2631;</button>
                    </div>
                    <textarea style={{ width: '100%', border: 'none', padding: 12, minHeight: 100, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                      value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} />
                  </div>
                </div>
                <div className="modal-field"><label>{t('common.type')}</label><select className="wizard-input" value={editForm.formType} onChange={e => setEditForm({...editForm, formType: e.target.value})}><option>INSPECTION</option><option>AUDIT</option><option>CONTROL</option></select></div>
                <div className="modal-field">
                  <label>Number of signatures</label>
                  <input type="number" className="wizard-input" value={editForm.signatures} onChange={e => setEditForm({...editForm, signatures: Number(e.target.value)})} />
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)', marginTop: 2 }}>Number of signatures required (at least one signature required to allow document validation)</div>
                </div>
              </>
            )}

            {/* EDITION */}
            {detailTab === 'edition' && (
              <div>
                {SECTIONS.map((s, i) => (
                  <div key={i} style={{ padding: '14px 16px', border: '1px solid var(--border-primary)', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: i === 0 ? 'var(--bg-hover)' : 'var(--bg-secondary)' }}>
                    <div>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>SECTION : {s.title}</span>
                      {s.desc && <span style={{ marginLeft: 12, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{s.desc}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title="Copy" onClick={() => showToast(t('common.copied'), 'success')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                      <button className="btn-icon" title={t('common.delete')} onClick={() => showToast(t('templates.templateDeleted'))}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      <button className="btn-icon" title="Expand"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PREVIEW */}
            {detailTab === 'preview' && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Constitution finale de l'equipement / Final checking of the Motor</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>This document shall be used for supplier's audit and qualification</p>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{t('templates.sections.generalInfo')}</h4>
                {PREVIEW_FIELDS.map((f, i) => (
                  <div key={i} className="modal-field">
                    <input className="wizard-input" placeholder={f} readOnly style={{ background: 'var(--bg-hover)', fontSize: '0.88rem' }} />
                    <span style={{ position: 'absolute', right: 8, top: 8, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>0 / 128</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* -- LIST VIEW -- */
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: 'none', borderBottom: '1px solid var(--border-primary)', fontSize: '0.85rem', outline: 'none', background: 'transparent' }} />
        </div>
        <button className="btn-primary" onClick={() => showToast('New template wizard', 'info')}>{t('common.newTemplate')}</button>
      </div>

      {showTips && (
        <div style={{ background: 'rgba(26,111,196,0.1)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, padding: '14px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <strong style={{ fontSize: '0.9rem' }}>{t('common.tips')}</strong>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--blue)' }}>{t('fieldtypes.doubleClickTip')}.</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--blue)' }}>{t('fieldtypes.cannotModify')}.</div>
          </div>
          <button onClick={() => setShowTips(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>&times;</button>
        </div>
      )}

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr><th>{t('common.company')}</th><th>{t('common.name')}</th><th>{t('common.type')}</th><th>{t('common.createdAt')}</th><th>{t('common.status')}</th><th>{t('common.actions')}</th></tr>
          </thead>
          <tbody>
            {filtered.map(tpl => (
              <tr key={tpl.id} onDoubleClick={() => openDetail(tpl)} style={{ cursor: 'pointer' }}>
                <td>{tpl.company}</td>
                <td><strong>{tpl.name}</strong></td>
                <td>{tpl.type}</td>
                <td style={{ fontSize: '0.88rem' }}>{tpl.created}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700,
                    background: tpl.status === 'EDITABLE' ? 'rgba(26,111,196,0.1)' : 'var(--bg-hover)',
                    color: tpl.status === 'EDITABLE' ? 'var(--blue)' : 'var(--text-tertiary)',
                    border: `1px solid ${tpl.status === 'EDITABLE' ? 'rgba(37,99,235,0.3)' : 'var(--border-primary)'}`
                  }}>{tpl.status === 'EDITABLE' ? t('templates.editable') : t('templates.revoked')}</span>
                </td>
                <td>
                  <button className="btn-icon" title="Copy" onClick={e => { e.stopPropagation(); showToast(t('templates.templateCopied'), 'success') }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
