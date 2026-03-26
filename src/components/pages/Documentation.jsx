import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const FOLDERS = [
  { name: 'Manufacturing Record Book (MRB)', icon: 'folder' },
  { name: 'Findings / NC', icon: 'folder' },
  { name: 'Photos / Videos', icon: 'folder' },
  { name: 'Inspections', icon: 'folder' },
  { name: 'CFSI', icon: 'folder' },
  { name: 'QCP', icon: 'folder' },
  { name: '0- Page de garde', date: '17-04-2025 10:35:21' },
  { name: '1- Certificat de conformité', date: '17-04-2025 10:35:21' },
  { name: '2- Dossier de suivi', date: '17-04-2025 10:35:23' },
  { name: '3- Data électrique', date: '17-04-2025 10:35:24' },
  { name: '4- Procès verbaux de contrôles en usines (test)', date: '17-04-2025 10:35:24' },
  { name: '5- Plan d\'ensemble', date: '17-04-2025 10:35:24' },
  { name: '6- Plaque signalétique', date: '17-04-2025 10:35:24' },
  { name: '7- Photos soudures', date: '17-04-2025 10:35:25' },
  { name: '8- Commande client', date: '17-04-2025 10:35:26' },
]

export default function Documentation() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [checkedItems, setCheckedItems] = useState(new Set())

  const toggleCheck = (i) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.doc-folder-item', { opacity: 0, x: -10 }, {
        opacity: 1, x: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out', delay: 0.2,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="doc-page">
      {/* Left panel: Folders */}
      <div className="doc-folders-panel">
        <div className="doc-folders-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{t('documentation.folders')}</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-icon" title={t('documentation.upload')} onClick={() => showToast(t('common.uploadOpened'), 'info')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg></button>
            <button className="btn-icon" title={t('documentation.paste')} onClick={() => showToast(t('common.pasteClipboard'), 'info')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
            <button className="btn-icon" title={t('documentation.newFolder')} onClick={() => { const n = prompt('Folder name:'); if(n) showToast(`Folder "${n}" created`, 'success') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('common.dossierCreation')}</span>
            <div className="topbar-toggle-switch" style={{ width: 28, height: 16, background: 'var(--toggle-off)' }}>
              <div className="topbar-toggle-knob" style={{ width: 12, height: 12 }}></div>
            </div>
          </div>
        </div>
        {checkedItems.size > 0 && (
          <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--border-primary)' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => { showToast(t('common.reportGenerated')); setCheckedItems(new Set()) }}>
              {t('common.createReport')} ({checkedItems.size} {t('common.selected')})
            </button>
          </div>
        )}
        <div className="doc-folder-list">
          {FOLDERS.map((f, i) => (
            <div
              key={i}
              className={`doc-folder-item${selectedFolder === i ? ' active' : ''}`}
              onClick={() => setSelectedFolder(i)}
            >
              <input type="checkbox" checked={checkedItems.has(i)} onChange={() => toggleCheck(i)} onClick={e => e.stopPropagation()}
                style={{ accentColor: 'var(--blue)', cursor: 'pointer' }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.icon === 'folder' ? 'var(--text-secondary)' : '#a0aec0'} strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{f.name}</div>
                {f.date && <div style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>{f.date}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Files */}
      <div className="doc-files-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.files')}</th>
              <th>{t('common.tags')}</th>
              <th>{t('common.date')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
        </table>
        {selectedFolder === null ? (
          <div className="doc-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <p>{t('common.selectFolder')}</p>
          </div>
        ) : (
          <div className="doc-placeholder">
            <p style={{ color: 'var(--text-tertiary)' }}>{t('common.noFiles')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
