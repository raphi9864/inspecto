import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const FIELDTYPES = [
  { id: 1, name: '1', type: 'Selector', created: '03-07-2024 11:37:48', status: 'COMMONS.PUBLISHED' },
  { id: 2, name: '1_Documentation_review_and_Process_Control', type: 'Table', created: '04-02-2026 05:34:52', status: 'EDITABLE' },
  { id: 3, name: '1_Documentation_review_and_Process_Control_2', type: 'Table', created: '04-02-2026 05:38:03', status: 'COMMONS.PUBLISHED' },
  { id: 4, name: '1-2025-03-24T151350', type: 'Selector', created: '24-03-2025 15:13:50', status: 'EDITABLE' },
  { id: 5, name: '2_Workshop', type: 'Table', created: '04-02-2026 05:50:42', status: 'COMMONS.PUBLISHED' },
  { id: 6, name: '3_Other_specific_topics', type: 'Table', created: '04-02-2026 05:53:10', status: 'COMMONS.PUBLISHED' },
  { id: 7, name: 'A', type: 'Selector', created: '22-07-2025 15:08:57', status: 'COMMONS.PUBLISHED' },
  { id: 8, name: 'Audit_Checklist_Items', type: 'Table', created: '15-01-2026 09:22:15', status: 'EDITABLE' },
  { id: 9, name: 'Welding_Parameters', type: 'Table', created: '10-11-2025 14:05:33', status: 'COMMONS.PUBLISHED' },
  { id: 10, name: 'Dimensional_Control', type: 'Selector', created: '18-06-2025 10:44:21', status: 'EDITABLE' },
]

export default function CustomizeFieldtypes() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const [search, setSearch] = useState('')
  const [fieldtypes, setFieldtypes] = useState(FIELDTYPES)
  const [showTips, setShowTips] = useState(true)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({ company: 'INSPECTO', type: '', desc: '', columns: [], lines: [] })
  const [newCol, setNewCol] = useState('')
  const [newLine, setNewLine] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.02, delay: 0.1 })
    }, ref)
    return () => ctx.revert()
  }, [fieldtypes.length])

  const filtered = fieldtypes.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  const openEdit = (f) => {
    setEditModal(f)
    setEditForm({
      company: 'INSPECTO',
      type: f.name,
      desc: '',
      columns: f.type === 'Table' ? ['COMMENTS', 'FINDINGS'] : [],
      lines: f.type === 'Table' ? ['1-1_Supplier_Quality_Management_System', '1-2_PO_Requirements_documents_transmittal', '1-3_Quality_Plan', '1-4_Control_Plan'] : [],
    })
  }

  const addCol = () => { if (newCol.trim()) { setEditForm(f => ({...f, columns: [...f.columns, newCol.trim()]})); setNewCol('') } }
  const addLine = () => { if (newLine.trim()) { setEditForm(f => ({...f, lines: [...f.lines, newLine.trim()]})); setNewLine('') } }
  const removeCol = (i) => setEditForm(f => ({...f, columns: f.columns.filter((_, j) => j !== i)}))
  const removeLine = (i) => setEditForm(f => ({...f, lines: f.lines.filter((_, j) => j !== i)}))

  const handleSave = () => {
    setFieldtypes(prev => prev.map(f => f.id === editModal.id ? { ...f, name: editForm.type } : f))
    showToast('Field type saved', 'success')
    setEditModal(null)
  }

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: 'none', borderBottom: '1px solid var(--border-primary)', fontSize: '0.85rem', outline: 'none', background: 'transparent' }} />
        </div>
        <button className="btn-primary" onClick={() => showToast('New field type', 'info')}>{t('fieldtypes.newFieldType')}</button>
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
          <thead><tr><th>{t('common.name')}</th><th>{t('common.type')}</th><th>{t('common.createdAt')}</th><th>{t('common.status')}</th><th>{t('common.actions')}</th></tr></thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} style={{ cursor: 'pointer' }} onDoubleClick={() => f.status === 'EDITABLE' && openEdit(f)}>
                <td><strong>{f.name}</strong></td>
                <td>{f.type}</td>
                <td style={{ fontSize: '0.88rem' }}>{f.created}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700,
                    background: f.status === 'EDITABLE' ? 'rgba(26,111,196,0.1)' : 'rgba(34,197,94,0.1)',
                    color: f.status === 'EDITABLE' ? 'var(--blue)' : '#22c55e',
                    border: `1px solid ${f.status === 'EDITABLE' ? 'rgba(37,99,235,0.3)' : 'rgba(34,197,94,0.2)'}`
                  }}>{f.status === 'EDITABLE' ? t('templates.editable') : t('fieldtypes.published')}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {f.status === 'EDITABLE' ? (
                      <>
                        <button className="btn-icon" title={t('common.edit')} onClick={e => { e.stopPropagation(); openEdit(f) }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button className="btn-icon" title="Copy" onClick={e => { e.stopPropagation(); showToast(t('common.copied'), 'success') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                        <button className="btn-icon" title={t('common.delete')} onClick={e => { e.stopPropagation(); if(confirm(t('common.deleteConfirm'))) { setFieldtypes(prev => prev.filter(x => x.id !== f.id)); showToast(t('common.delete')) } }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      </>
                    ) : (
                      <>
                        <button className="btn-icon" title={t('common.preview')} onClick={e => { e.stopPropagation(); showToast(t('fieldtypes.cannotModify'), 'info') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                        <button className="btn-icon" title="Copy" onClick={e => { e.stopPropagation(); showToast(t('common.copied'), 'success') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                        <button className="btn-icon" title="Info" onClick={e => { e.stopPropagation(); showToast(t('fieldtypes.published'), 'info') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>{t('fieldtypes.editTable')}</h3>
            <div className="modal-field"><label>{t('common.company')}</label><select className="wizard-input" value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})}><option>INSPECTO</option></select></div>
            <div className="modal-field">
              <label>{t('common.type')}</label>
              <div style={{ position: 'relative' }}>
                <input className="wizard-input" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value.slice(0, 64)})} maxLength={64} />
                <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{editForm.type.length} / 64</span>
              </div>
            </div>
            <div className="modal-field"><label>{t('common.description')}</label><textarea className="wizard-input" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} rows={3} style={{ resize: 'vertical' }} /></div>

            {/* Columns */}
            <div className="modal-field">
              <label>{t('fieldtypes.columns')}</label>
              <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, padding: 8, display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 40 }}>
                {editForm.columns.map((c, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-hover)', padding: '3px 8px', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}>
                    {c}
                    <button onClick={() => removeCol(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-tertiary)', padding: 0 }}>&times;</button>
                  </span>
                ))}
                <input value={newCol} onChange={e => setNewCol(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCol()}
                  placeholder={t('fieldtypes.addColumn')} style={{ border: 'none', outline: 'none', flex: 1, minWidth: 120, fontSize: '0.88rem' }} />
              </div>
            </div>

            {/* Lines */}
            <div className="modal-field">
              <label>{t('fieldtypes.lines')}</label>
              <div style={{ border: '1px solid var(--border-primary)', borderRadius: 6, padding: 8, display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 40 }}>
                {editForm.lines.map((l, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-hover)', padding: '3px 8px', borderRadius: 4, fontSize: '0.85rem', fontWeight: 600 }}>
                    {l}
                    <button onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-tertiary)', padding: 0 }}>&times;</button>
                  </span>
                ))}
                <input value={newLine} onChange={e => setNewLine(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLine()}
                  placeholder={t('fieldtypes.addLine')} style={{ border: 'none', outline: 'none', flex: 1, minWidth: 120, fontSize: '0.88rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={handleSave} style={{ padding: '8px 20px', background: 'var(--status-success)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>{t('common.save')}</button>
              <button onClick={() => setEditModal(null)} style={{ padding: '8px 20px', background: 'var(--status-error)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
