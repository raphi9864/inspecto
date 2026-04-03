import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
import formatDate from '../../utils/formatDate'

/* ─── Icons (inline SVG helpers) ─── */
const I = { size: 14, sw: 2 }
const IconFolder = (p) => <svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth={I.sw}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const IconLock = (p) => <svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'var(--text-tertiary)'} strokeWidth={I.sw}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
const IconUpload = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={I.sw}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
const IconTrash = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={I.sw}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
const IconFolderPlus = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={I.sw}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
const IconSearch = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth={I.sw}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconGrip = () => <svg width="10" height="14" viewBox="0 0 10 14" fill="var(--text-tertiary)"><circle cx="3" cy="2" r="1.2"/><circle cx="7" cy="2" r="1.2"/><circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="3" cy="12" r="1.2"/><circle cx="7" cy="12" r="1.2"/></svg>
const IconPen = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const IconCal = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconEye = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconAI = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><path d="M12 2L9.5 8.5 2 12l7.5 3.5L12 22l2.5-6.5L22 12l-7.5-3.5z"/></svg>
const IconDownload = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IconArrow = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={I.sw}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={I.sw}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconXCircle = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth={I.sw}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
const IconPrint = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={I.sw}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
const IconClip = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={I.sw}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
const IconCheck = () => <svg width={I.size} height={I.size} viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth={I.sw}><polyline points="20 6 9 17 4 12"/></svg>

const PdfIcon = () => <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(215,41,74,0.12)', color: 'var(--color-pdf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>PDF</div>
const XlsIcon = () => <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(0,255,136,0.1)', color: 'var(--color-xls)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>XLS</div>
const DocIcon = () => <div style={{ width: 28, height: 28, borderRadius: 4, background: 'rgba(46,163,242,0.12)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>DOC</div>
function FileIcon({ type }) { return type === 'xlsx' ? <XlsIcon /> : type === 'docx' ? <DocIcon /> : <PdfIcon /> }

/* ─── Data ─── */
const SYSTEM_FOLDERS = [
  { id: 'mrb', name: 'Manufacturing Record Book (MRB)' },
  { id: 'findings', name: 'Findings / NC' },
  { id: 'photos', name: 'Photos / Videos' },
  { id: 'inspections', name: 'Inspections' },
  { id: 'cfsi', name: 'CFSI' },
  { id: 'qcp', name: 'QCP' },
]
const INITIAL_USER_FOLDERS = [
  { id: 'f0', name: '0- Page de garde', date: '17-04-2025 10:35:21' },
  { id: 'f1', name: '1- Certificat de conformité', date: '17-04-2025 10:35:21' },
  { id: 'f2', name: '2- Dossier de suivi', date: '17-04-2025 10:35:23' },
  { id: 'f3', name: '3- Data électrique', date: '17-04-2025 10:35:24' },
  { id: 'f4', name: '4- Procès verbaux de contrôles en usines', date: '17-04-2025 10:35:25' },
  { id: 'f5', name: "5- Plan d'ensemble", date: '17-04-2025 10:35:26' },
  { id: 'f6', name: '6- Plaque signalétique', date: '17-04-2025 10:35:27' },
  { id: 'f7', name: '7- Photos soudures', date: '17-04-2025 10:35:28' },
  { id: 'f8', name: '8- Commande client', date: '17-04-2025 10:35:29' },
]
const INITIAL_FILES = {
  f0: [
    { id: 'ff1', name: 'Trame RFF P1.pdf', type: 'pdf', date: '12-05-2025\n11:16:21' },
    { id: 'ff2', name: 'Page de garde.pdf', type: 'pdf', date: '17-04-2025\n10:35:21' },
  ],
  f1: [
    { id: 'ff3', name: 'Certificat ISO 19443.pdf', type: 'pdf', date: '15-04-2025\n09:00:00' },
    { id: 'ff4', name: 'Hamza PDF 2 modifié.pdf', type: 'pdf', date: '17-04-2025\n10:35:23' },
    { id: 'ff5', name: 'Hamza PDF 1 Modifié.pdf', type: 'pdf', date: '17-04-2025\n10:35:22' },
    { id: 'ff6', name: 'Hamza PDF 1.pdf', type: 'pdf', date: '17-04-2025\n10:35:21' },
  ],
  mrb: [
    { id: 'mrb1', name: 'MRB-2026-001.pdf', type: 'pdf', date: '12-01-2026\n10:00:00' },
    { id: 'mrb2', name: 'MRB-2026-002.pdf', type: 'pdf', date: '03-02-2026\n14:00:00' },
    { id: 'mrb3', name: 'Index MRB.xlsx', type: 'xlsx', date: '15-01-2026\n09:00:00' },
  ],
}

/* ─── Toggle switch ─── */
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 32, height: 18, borderRadius: 9, background: value ? 'var(--blue)' : 'var(--border-secondary)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: value ? 16 : 2, transition: 'left 0.2s' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Documentation() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const [userFolders, setUserFolders] = useState(INITIAL_USER_FOLDERS)
  const [files, setFiles] = useState(INITIAL_FILES)
  const [search, setSearch] = useState('')
  const [dossierCreation, setDossierCreation] = useState(false)
  const [reportFiles, setReportFiles] = useState([])
  const [rb, setRb] = useState({ title: '', subtitle: '', isCorrection: false, signatureLoop: false, displayTitles: false })
  const [renameModal, setRenameModal] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [expirationModal, setExpirationModal] = useState(null)
  const [expirationValue, setExpirationValue] = useState('')
  const [moveModal, setMoveModal] = useState(null)
  const [moveDest, setMoveDest] = useState(null)
  const [viewerFile, setViewerFile] = useState(null)
  const [downloadDrop, setDownloadDrop] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [newFolderMode, setNewFolderMode] = useState(false)
  const [newFolderValue, setNewFolderValue] = useState('')

  const allFolders = [...SYSTEM_FOLDERS.map(f => ({ ...f, system: true })), ...userFolders.map(f => ({ ...f, system: false }))]
  const currentFiles = selectedId ? (files[selectedId] || []) : []
  const filteredFiles = search ? currentFiles.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : currentFiles

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.doc-folder-row', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.02, ease: 'power2.out', delay: 0.15 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Close download dropdown on outside click
  useEffect(() => {
    if (!downloadDrop) return
    const close = () => setDownloadDrop(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [downloadDrop])

  const addFolder = () => {
    if (!newFolderValue.trim()) return
    const id = 'f' + Date.now()
    setUserFolders(prev => [...prev, { id, name: newFolderValue.trim(), date: formatDate(new Date()) }])
    setSelectedId(id)
    setNewFolderMode(false)
    setNewFolderValue('')
    showToast(t('documentation.newFolder'), 'success')
  }

  const doRename = () => {
    if (!renameModal || !renameValue.trim()) return
    setFiles(prev => {
      const copy = { ...prev }
      Object.keys(copy).forEach(k => { copy[k] = copy[k].map(f => f.id === renameModal ? { ...f, name: renameValue.trim() } : f) })
      return copy
    })
    setRenameModal(null)
    showToast(t('documentation.actions.save'), 'success')
  }

  const doMove = () => {
    if (!moveModal || !moveDest) return
    let movedFile = null
    setFiles(prev => {
      const copy = {}
      Object.keys(prev).forEach(k => { copy[k] = prev[k].filter(f => { if (f.id === moveModal) { movedFile = f; return false } return true }) })
      if (movedFile) { copy[moveDest] = [...(copy[moveDest] || []), movedFile] }
      return copy
    })
    setMoveModal(null)
    setMoveDest(null)
    showToast(t('documentation.actions.move'), 'success')
  }

  const doDelete = useCallback((fid) => {
    setFiles(prev => {
      const copy = {}
      Object.keys(prev).forEach(k => { copy[k] = prev[k].filter(f => f.id !== fid) })
      return copy
    })
    setReportFiles(prev => prev.filter(id => id !== fid))
    setDeleteId(null)
    showToast(t('documentation.actions.delete'), 'info')
  }, [t])

  const toggleReportFile = (fid) => {
    setReportFiles(prev => prev.includes(fid) ? prev.filter(id => id !== fid) : [...prev, fid])
  }

  const selFolder = allFolders.find(f => f.id === selectedId)

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100%', minHeight: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-primary)' }}>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div style={{ width: 280, minWidth: 280, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconHome />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t('documentation.title')}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            <button className="btn-icon" data-demo-target="btn-upload-doc" style={{ color: selectedId ? 'var(--text-primary)' : 'var(--text-tertiary)' }} onClick={() => selectedId && showToast('Upload', 'info')}><IconUpload /></button>
            <button className="btn-icon" style={{ color: selectedId ? '#d7294a' : 'var(--text-tertiary)' }} onClick={() => selectedId && showToast(t('documentation.actions.delete'), 'info')}><IconTrash /></button>
            <button className="btn-icon" data-demo-target="btn-new-folder" style={{ color: 'var(--text-primary)' }} onClick={() => { setNewFolderMode(true); setNewFolderValue('') }}><IconFolderPlus /></button>
          </div>
        </div>
        {/* Dossier Creation toggle */}
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle value={dossierCreation} onChange={setDossierCreation} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t('documentation.dossierCreation')}</span>
        </div>
        {/* Folder list */}
        <div className="doc-folder-list" style={{ flex: 1, overflowY: 'auto' }}>
          {/* System folders */}
          {SYSTEM_FOLDERS.map(f => (
            <div key={f.id} className="doc-folder-row" onClick={() => setSelectedId(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', borderLeft: selectedId === f.id ? '3px solid var(--blue)' : '3px solid transparent', background: selectedId === f.id ? 'rgba(46,163,242,0.06)' : 'transparent' }}>
              <IconLock />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: selectedId === f.id ? 600 : 400 }}>{f.name}</span>
            </div>
          ))}
          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-primary)', margin: '4px 16px' }} />
          {/* User folders */}
          {userFolders.map(f => (
            <div key={f.id} className="doc-folder-row" onClick={() => setSelectedId(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', borderLeft: selectedId === f.id ? '3px solid var(--blue)' : '3px solid transparent', background: selectedId === f.id ? 'rgba(46,163,242,0.06)' : 'transparent' }}>
              <IconFolder c="var(--text-secondary)" s={16} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: selectedId === f.id ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{formatDate(f.date)}</div>
              </div>
            </div>
          ))}
          {/* New folder input */}
          {newFolderMode && (
            <div style={{ padding: '8px 16px', display: 'flex', gap: 6 }}>
              <input autoFocus data-demo-target="folder-name" value={newFolderValue} onChange={e => setNewFolderValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addFolder(); if (e.key === 'Escape') setNewFolderMode(false) }} placeholder={t('documentation.newFolder')} style={{ flex: 1, fontSize: '0.82rem' }} />
              <button className="btn-icon" data-demo-target="btn-save-folder" onClick={addFolder} style={{ color: 'var(--blue)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', minWidth: 0 }}>
        {!selectedId ? (
          /* No folder selected */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <IconFolder c="var(--text-tertiary)" s={48} />
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>{t('documentation.selectFolder')}</p>
          </div>
        ) : (
          /* Folder selected */
          <div data-demo-target="doc-upload-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconSearch />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('documentation.search')} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.88rem' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* File table */}
              <div style={{ flex: dossierCreation ? '0 0 60%' : 1, overflowY: 'auto' }}>
                <table className="data-table" data-demo-target="doc-list" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      {dossierCreation && <th style={{ width: 32 }}><input type="checkbox" checked={filteredFiles.length > 0 && filteredFiles.every(f => reportFiles.includes(f.id))} onChange={() => { const all = filteredFiles.map(f => f.id); const allChecked = all.every(id => reportFiles.includes(id)); setReportFiles(allChecked ? reportFiles.filter(id => !all.includes(id)) : [...new Set([...reportFiles, ...all])]) }} /></th>}
                      <th>{t('documentation.columns.files')}</th>
                      <th>{t('documentation.columns.tags')}</th>
                      <th>{t('documentation.columns.date')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map(file => (
                      <tr key={file.id}>
                        {dossierCreation && <td><input type="checkbox" data-demo-target="doc-checkbox" checked={reportFiles.includes(file.id)} onChange={() => toggleReportFile(file.id)} /></td>}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ cursor: 'grab', opacity: 0.4 }}><IconGrip /></span>
                            <FileIcon type={file.type} />
                            <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{file.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-tertiary)' }}>—</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{formatDate(file.date)}</td>
                        <td>
                          {deleteId === file.id ? (
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.82rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{t('documentation.delete.confirm')}</span>
                              <button className="btn-primary" style={{ padding: '2px 10px', fontSize: '0.78rem', background: '#d7294a' }} onClick={() => doDelete(file.id)}>{t('documentation.delete.yes')}</button>
                              <button className="btn-outline" style={{ padding: '2px 10px', fontSize: '0.78rem' }} onClick={() => setDeleteId(null)}>{t('documentation.delete.no')}</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 4, position: 'relative' }}>
                              <button className="btn-icon" title={t('documentation.actions.rename')} onClick={() => { setRenameModal(file.id); setRenameValue(file.name) }}><IconPen /></button>
                              <button className="btn-icon" title={t('documentation.actions.expiration')} onClick={() => { setExpirationModal(file.id); setExpirationValue('2026-04-26T00:00') }}><IconCal /></button>
                              <button className="btn-icon" title={t('documentation.actions.detail')} onClick={() => showToast(t('documentation.actions.detail'), 'info')}><IconSearch /></button>
                              <button className="btn-icon" title={t('documentation.actions.view')} onClick={() => setViewerFile(file)}><IconEye /></button>
                              <button className="btn-icon" title={t('documentation.actions.ai')} onClick={() => showToast(t('documentation.actions.ai'), 'info')}><IconAI /></button>
                              <button className="btn-icon" title={t('documentation.actions.download')} onClick={(e) => { e.stopPropagation(); setDownloadDrop(downloadDrop === file.id ? null : file.id) }}><IconDownload /></button>
                              {downloadDrop === file.id && (
                                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 40, background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)', borderRadius: 6, padding: 4, zIndex: 50, width: 120 }}>
                                  <div style={{ padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', borderRadius: 4, color: 'var(--text-primary)' }} onClick={() => { setDownloadDrop(null); showToast(t('documentation.download.pdf'), 'info') }}>{t('documentation.download.pdf')}</div>
                                  <div style={{ padding: '6px 10px', fontSize: '0.82rem', cursor: 'pointer', borderRadius: 4, color: 'var(--text-primary)' }} onClick={() => { setDownloadDrop(null); showToast(t('documentation.download.word'), 'info') }}>{t('documentation.download.word')}</div>
                                </div>
                              )}
                              <button className="btn-icon" title={t('documentation.actions.move')} onClick={() => { setMoveModal(file.id); setMoveDest(null) }}><IconArrow /></button>
                              <button className="btn-icon" title={t('documentation.actions.delete')} onClick={() => setDeleteId(file.id)} style={{ color: '#d7294a' }}><IconTrash /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ textAlign: 'center', padding: 16, fontSize: '0.88rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <IconCheck /> {t('documentation.endOfList')}
                </div>
              </div>

              {/* Report Builder panel */}
              {dossierCreation && (
                <div style={{ flex: '0 0 40%', borderLeft: '1px solid var(--border-primary)', padding: 20, overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{t('documentation.reportBuilder.title')}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>{t('documentation.reportBuilder.subtitle')}</p>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('documentation.reportBuilder.titleField')}</label>
                    <input value={rb.title} onChange={e => setRb({ ...rb, title: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>{t('documentation.reportBuilder.subtitleField')}</label>
                    <input value={rb.subtitle} onChange={e => setRb({ ...rb, subtitle: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: 16, border: '1px dashed var(--border-secondary)', borderRadius: 6, padding: 12, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.82rem', cursor: 'pointer' }} onClick={() => showToast(t('documentation.reportBuilder.image'), 'info')}>
                    <IconClip /> {t('documentation.reportBuilder.image')}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Toggle value={rb.isCorrection} onChange={v => setRb({ ...rb, isCorrection: v })} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('documentation.reportBuilder.isCorrection')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Toggle value={rb.signatureLoop} onChange={v => setRb({ ...rb, signatureLoop: v })} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('documentation.reportBuilder.signatureLoop')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Toggle value={rb.displayTitles} onChange={v => setRb({ ...rb, displayTitles: v })} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('documentation.reportBuilder.displayTitles')}</span>
                    </div>
                  </div>

                  <button className="btn-outline" data-demo-target="btn-generate-report" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={reportFiles.length === 0 || !rb.title} onClick={() => showToast(t('documentation.reportBuilder.createReport'), 'success')}>
                    <IconPrint /> {t('documentation.reportBuilder.createReport')}
                  </button>

                  {reportFiles.length > 0 && (
                    <div style={{ marginTop: 16, borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                      {reportFiles.map(fid => {
                        const file = currentFiles.find(f => f.id === fid)
                        if (!file) return null
                        return (
                          <div key={fid} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            <IconGrip />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                            <button className="btn-icon" onClick={() => toggleReportFile(fid)}><IconXCircle /></button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Rename */}
      {renameModal && (
        <div className="modal-overlay" onClick={() => setRenameModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconPen /> {t('documentation.rename.title')}</h3>
            <div className="modal-field">
              <label>{t('documentation.rename.label')}</label>
              <div style={{ position: 'relative' }}>
                <input maxLength={64} value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus />
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{renameValue.length}/64</span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setRenameModal(null)}>{t('documentation.actions.cancel')}</button>
              <button className="btn-primary" onClick={doRename}>{t('documentation.actions.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Expiration */}
      {expirationModal && (
        <div className="modal-overlay" onClick={() => setExpirationModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconCal /> {t('documentation.expiration.title')}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 16 }}>{t('documentation.expiration.subtitle')}</p>
            <div className="modal-field">
              <label>{t('documentation.expiration.label')}</label>
              <input type="datetime-local" value={expirationValue} onChange={e => setExpirationValue(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setExpirationModal(null)}>{t('documentation.actions.cancel')}</button>
              <button className="btn-primary" onClick={() => { setExpirationModal(null); showToast(t('documentation.actions.save'), 'success') }}>{t('documentation.actions.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Move */}
      {moveModal && (
        <div className="modal-overlay" onClick={() => setMoveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><IconArrow /> {t('documentation.move.title')}</h3>
            <div style={{ maxHeight: 300, overflowY: 'auto', margin: '12px 0' }}>
              {allFolders.map(f => (
                <div key={f.id} onClick={() => setMoveDest(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer', borderRadius: 6, background: moveDest === f.id ? 'rgba(46,163,242,0.1)' : 'transparent', border: moveDest === f.id ? '1px solid var(--blue)' : '1px solid transparent' }}>
                  {f.system ? <IconLock /> : <IconFolder c="var(--text-secondary)" s={16} />}
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{f.name}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setMoveModal(null)}>{t('documentation.actions.cancel')}</button>
              <button className="btn-primary" disabled={!moveDest} onClick={doMove}>{t('documentation.actions.move_confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF viewer */}
      {viewerFile && (
        <div className="modal-overlay" onClick={() => setViewerFile(null)} style={{ zIndex: 2000 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '90vw', maxWidth: 1000, height: '90vh', background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{viewerFile.name}</span>
              <button className="btn-icon" onClick={() => setViewerFile(null)}><IconX /></button>
            </div>
            <iframe src="/demo/certificat-iso-19443.html" style={{ flex: 1, border: 'none', background: '#fff' }} title={viewerFile.name} />
          </div>
        </div>
      )}
    </div>
  )
}
