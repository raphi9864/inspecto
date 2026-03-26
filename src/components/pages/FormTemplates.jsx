import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const TEMPLATES = [
  { company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement', type: 'Inspection', created: '25-06-2025 13:57:24', status: 'REVOKED' },
  { company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2', type: 'Inspection', created: '08-09-2024 19:04:13', status: 'REVOKED' },
  { company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2024-09-11T145907', type: 'Inspection', created: '11-09-2024 14:59:08', status: 'REVOKED' },
  { company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2025-02-24T131139', type: 'Inspection', created: '24-02-2025 13:11:39', status: 'EDITABLE' },
  { company: 'INSPECTO', name: 'ABB-Constitution_finale_de_lequipement_2-2025-03-24T151416', type: 'Inspection', created: '24-03-2025 15:14:16', status: 'EDITABLE' },
  { company: 'INSPECTO', name: 'ABB-Formation-Formulaire-Controle-Final', type: 'Inspection', created: '26-03-2025 13:09:15', status: 'EDITABLE' },
  { company: 'INSPECTO', name: 'ALLIA_ATTESTATION-FORMATION', type: 'Inspection', created: '29-08-2025 22:32:14', status: 'REVOKED' },
  { company: 'INSPECTO', name: 'ALLIA_AUDIT_at_supplier_location', type: 'Inspection', created: '21-08-2025 17:22:43', status: 'REVOKED' },
  { company: 'INSPECTO', name: 'ALLIA_AUDIT_SECURITE', type: 'Inspection', created: '22-08-2025 15:31:46', status: 'REVOKED' },
]

export default function FormTemplates() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [tab, setTab] = useState('templates')
  const [showTips, setShowTips] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.2,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="templates-page">
      {/* Side navigation */}
      <div className="templates-sidenav">
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0 12px' }}>{t('common.navigation')}</div>
        <div
          className={`templates-nav-item${tab === 'templates' ? ' active' : ''}`}
          onClick={() => setTab('templates')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          {t('common.customizeTemplates')}
        </div>
        <div
          className={`templates-nav-item${tab === 'fieldtypes' ? ' active' : ''}`}
          onClick={() => setTab('fieldtypes')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
          {t('common.customizeFieldtypes')}
        </div>
      </div>

      {/* Main content */}
      <div className="templates-main">
        {/* Search + New */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div className="templates-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder={t('common.search')} />
          </div>
          <button className="btn-primary">{t('common.newTemplate')}</button>
        </div>

        {/* Tips */}
        {showTips && <div className="templates-tips">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <div>
            <strong>{t('common.tips')}</strong><br />
            {t('fieldtypes.doubleClickTip')}.<br />
            {t('fieldtypes.cannotModify')}.
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: '18px' }} onClick={() => setShowTips(false)}>&times;</button>
        </div>}

        {/* Table */}
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.company')}</th>
                  <th>{t('common.name')}</th>
                  <th>{t('common.type')}</th>
                  <th>{t('common.createdAt')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {TEMPLATES.map((tpl, i) => (
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td>{tpl.company}</td>
                    <td>{tpl.name}</td>
                    <td>{tpl.type}</td>
                    <td>{tpl.created}</td>
                    <td>
                      <span className={`template-status ${tpl.status.toLowerCase()}`}>{tpl.status === 'EDITABLE' ? t('templates.editable') : t('templates.revoked')}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-icon" title="Copy" onClick={() => showToast(t('templates.templateCopied'), 'success')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                        <button className="btn-icon" title={t('common.edit')} onClick={() => showToast(t('templates.editorOpened'), 'info')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="btn-icon" title={t('common.delete')} onClick={() => { if(confirm(t('templates.deleteConfirm'))) showToast(t('templates.templateDeleted')) }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        <button className="btn-icon" title={t('common.preview')} onClick={() => showToast(t('templates.previewOpened'), 'info')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
