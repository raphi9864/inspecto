import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'
import { exportCSV } from '../../utils/exportUtils'
import FilterPanel from '../shared/FilterPanel'

const INITIAL_PLANS = [
  { id: 1, revision: 3, name: 'ABB France \u2014 Plan Qualit\u00e9 Ligne A', desc: 'Plan de contr\u00f4le qualit\u00e9 pour la ligne de production A', created: '13-01-2026 16:12' },
  { id: 2, revision: 2, name: 'Jupiter Bach \u2014 Contr\u00f4le Assemblage Batch 42', desc: 'QCP assemblage m\u00e9canique pour le lot 42', created: '26-08-2025 16:33' },
  { id: 3, revision: 1, name: 'Pilatus PC21 \u2014 QCP Fuselage Section 3', desc: 'Plan de contr\u00f4le fuselage section 3 \u2014 norme AS/EN 9100', created: '12-05-2025 13:06' },
  { id: 4, revision: 0, name: 'ALLIA \u2014 Plan Qualit\u00e9 Sanitaire', desc: 'QCP conformit\u00e9 sanitaire et tra\u00e7abilit\u00e9 mat\u00e9riaux', created: '17-04-2025 10:35' },
]

const DETAIL_TASKS = [
  { rev: 0, step: 1, task: 'Verification palier', itns: 'YES', docInfo: '1256 TGE', docRev: 1, operator: '/', qc: '/', tc: '/', notif1: '', client: '', notif2: '', partyB: '', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: '', recNum: '', ncr: 'Verification palier' },
  { rev: 0, step: 1, task: 'Check signature horaire', itns: 'NO', docInfo: 'dz', docRev: '', operator: 'SIGNED', qc: '/', tc: '/', notif1: 'H', client: '/', notif2: 'W', partyB: '/', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: 1, task: 'Check Signature', itns: 'NO', docInfo: 'dd', docRev: 1, operator: 'SIGNED', qc: 'SIGNED', tc: '/', notif1: 'H', client: '/', notif2: 'W', partyB: '/', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: 'YES', recNum: '', ncr: 'RAS' },
  { rev: 0, step: 1, task: 'Check signature Horaire', itns: 'NO', docInfo: 'zzz', docRev: 1, operator: 'SIGNED', qc: 'SIGNED', tc: '/', notif1: 'H', client: '/', notif2: 'W', partyB: '/', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: 'NO', recNum: '', ncr: '' },
  { rev: 0, step: 2, task: 'Validation des dessins techniques', itns: 'YES', docInfo: '', docRev: '', operator: '', qc: '/', tc: '', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: 12, task: 'Soudage plaque arriere', itns: '', docInfo: '', docRev: 2, operator: 'SIGNED', qc: '/', tc: '', notif1: 'H', client: 'SIGNED', notif2: 'W', partyB: '/', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: 12, task: 'peinture', itns: 'NO', docInfo: 'std peinture', docRev: 1, operator: '/', qc: 'SIGN HERE', tc: '', notif1: 'H', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: 12, task: 'TEST', itns: 'YES', docInfo: 'ISO 19443', docRev: 1, operator: '/', qc: '/', tc: '', notif1: 'C', client: 'SIGNED', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: 'YES', recNum: 'AZ', ncr: 'NA' },
  { rev: 0, step: 13, task: 'Delta Fluid', itns: 'YES', docInfo: 'ISO 19443', docRev: '', operator: 'SIGN HERE', qc: '/', tc: '', notif1: 'W', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Constitution finale de l\'equipement:', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '/', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Revetement peinture', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '/', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '/', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Emballage du moteur pour transport', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Calcul des essais sismiques', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Validation du Programme de Qualification', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
  { rev: 0, step: '', task: 'Reunion de lancement en Commande', itns: '', docInfo: '', docRev: '', operator: '', qc: '/', tc: '', notif1: '', client: '/', notif2: '', partyB: '', notif3: '', partyC: '', notif4: '', partyD: '', recReq: '', recNum: '', ncr: '' },
]

const SignBadge = ({ val }) => {
  const { t } = useTranslation()
  if (val === 'SIGNED') return <span style={{ background: 'var(--status-success)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: '0.88rem', fontWeight: 700 }}>{t('common.signed')}</span>
  if (val === 'SIGN HERE') return <span style={{ background: 'var(--toggle-off)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 4, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => showToast(t('qcp.documentSigned'), 'success')}>{t('common.sign_here')}</span>
  return <span style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>{val || '/'}</span>
}

export default function QualityControlPlan() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [plans, setPlans] = useState(INITIAL_PLANS)
  const [showCreate, setShowCreate] = useState(false)
  const [detailPlan, setDetailPlan] = useState(null)
  const [createForm, setCreateForm] = useState({ name: '', revision: 0, desc: '' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.data-table tbody tr', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0.2 })
    }, containerRef)
    return () => ctx.revert()
  }, [plans.length, detailPlan])

  const handleCreate = () => {
    if (!createForm.name) return
    const now = new Date()
    setPlans(prev => [{ id: Date.now(), revision: createForm.revision, name: createForm.name, desc: createForm.desc || 'Auto-generated PcqLiner', created: now.toLocaleString('en-GB').replace(',', '') }, ...prev])
    showToast(t('actionsPage.toastCreated'), 'success')
    setShowCreate(false)
    setCreateForm({ name: '', revision: 0, desc: '' })
  }

  /* ── DETAIL VIEW ── */
  if (detailPlan) {
    return (
      <div ref={containerRef}>
        <button className="btn-outline" onClick={() => setDetailPlan(null)} style={{ marginBottom: 16 }}>&larr; {t('inspections.backToList')}</button>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input type="text" placeholder={t('common.search')} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 6, fontSize: '0.85rem' }} />
          </div>
          <button className="btn-outline" onClick={() => { exportCSV(DETAIL_TASKS, `inspecto-qcp-${new Date().toISOString().slice(0, 10)}.csv`); showToast(t('toasts.csvExported'), 'success') }}>{t('common.export').toUpperCase()}</button>
          <button className="btn-primary" onClick={() => showToast(t('toasts.planValidated'), 'success')}>VALIDATE</button>
        </div>
        <div style={{ overflowX: 'auto', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <table className="data-table" style={{ minWidth: 1800, fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th colSpan="6" style={{ background: 'var(--bg-secondary)' }}></th>
                <th colSpan="4" style={{ background: 'var(--bg-accent)', textAlign: 'center', borderLeft: '2px solid var(--border-primary)' }}>{t('qcp.contractor')}</th>
                <th colSpan="7" style={{ background: 'var(--bg-tertiary)', textAlign: 'center', borderLeft: '2px solid var(--border-primary)' }}>{t('qcp.clientThirdParties')}</th>
                <th colSpan="3" style={{ background: 'var(--bg-accent)', textAlign: 'center', borderLeft: '2px solid var(--border-primary)' }}>{t('qcp.record')}</th>
                <th></th>
              </tr>
              <tr>
                <th>{t('qcp.revision')}</th><th>{t('qcp.step')}</th><th>{t('qcp.task')}</th><th>{t('qcp.itns')}</th><th>{t('qcp.docInfo')}</th><th>{t('qcp.docRev')}</th>
                <th style={{ borderLeft: '2px solid var(--border-primary)' }}>{t('qcp.operator')}</th><th>{t('qcp.qc')}</th><th>{t('qcp.tc')}</th><th>{t('qcp.notif')}</th>
                <th style={{ borderLeft: '2px solid var(--border-primary)' }}>Client</th><th>{t('qcp.notif')}</th><th>Party B</th><th>{t('qcp.notif')}</th><th>Party C</th><th>{t('qcp.notif')}</th><th>Party D</th>
                <th style={{ borderLeft: '2px solid var(--border-primary)' }}>{t('qcp.recReq')}</th><th>{t('qcp.recNum')}</th><th>{t('qcp.ncr')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {DETAIL_TASKS.map((row, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td>{row.rev}</td>
                  <td>{row.step}</td>
                  <td><strong>{row.task}</strong></td>
                  <td style={{ color: row.itns === 'YES' ? 'var(--blue)' : 'var(--text-secondary)', fontWeight: 600 }}>{row.itns}</td>
                  <td>{row.docInfo}</td>
                  <td>{row.docRev}</td>
                  <td style={{ borderLeft: '2px solid var(--border-primary)' }}><SignBadge val={row.operator} /></td>
                  <td><SignBadge val={row.qc} /></td>
                  <td><SignBadge val={row.tc} /></td>
                  <td>{row.notif1}</td>
                  <td style={{ borderLeft: '2px solid var(--border-primary)' }}><SignBadge val={row.client} /></td>
                  <td>{row.notif2}</td>
                  <td>{row.partyB}</td>
                  <td>{row.notif3}</td>
                  <td>{row.partyC}</td>
                  <td>{row.notif4}</td>
                  <td>{row.partyD}</td>
                  <td style={{ borderLeft: '2px solid var(--border-primary)' }}>{row.recReq}</td>
                  <td>{row.recNum}</td>
                  <td>{row.ncr}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn-icon" title="View" onClick={() => showToast(t('toasts.taskDetail'), 'info')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      <button className="btn-icon" title="Copy" onClick={() => showToast(t('toasts.taskCopied'), 'success')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                      <button className="btn-icon" title={t('common.edit')} onClick={() => showToast(t('toasts.editMode'), 'info')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button className="btn-icon" title={t('common.delete')} onClick={() => showToast(t('common.delete'))}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  /* ── LIST VIEW ── */
  return (
    <div ref={containerRef}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="btn-outline" onClick={() => setIsFilterOpen(true)}>{t('common.filters')}</button>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>{t('qcp.newPlan')}</button>
      </div>

      <div className="panel" style={{ opacity: 1, transform: 'none' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {t('qcp.planName')}
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--status-success)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>{plans.length} / {plans.length} result(s)</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead><tr><th>{t('qcp.revision')}</th><th>{t('common.name')}</th><th>{t('common.description')}</th><th>{t('common.createdAt')}</th><th>{t('common.actions')}</th></tr></thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} onClick={() => setDetailPlan(p)} style={{ cursor: 'pointer' }}>
                  <td>{p.revision}</td>
                  <td><strong>{p.name}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.desc}</td>
                  <td>{p.created}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" title={t('common.edit')} onClick={e => { e.stopPropagation(); showToast(t('toasts.editMode'), 'info') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); setDetailPlan(p) }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                      <button className="btn-icon" title="Copy" onClick={e => { e.stopPropagation(); showToast(t('toasts.taskCopied'), 'success') }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                      <button className="btn-icon" title={t('common.delete')} onClick={e => { e.stopPropagation(); if(confirm(t('common.deleteConfirm'))) { setPlans(prev => prev.filter(x => x.id !== p.id)); showToast(t('common.delete')) } }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', padding: 16, fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>{t('common.endOfList')}</div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div style={{ background: 'var(--blue)', color: '#fff', padding: '14px 20px', margin: '-24px -24px 20px', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>+ {t('qcp.createPlan')}</span>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 12 }}>{t('actionsPage.generalInfo')}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="modal-field">
                <label>{t('common.name')} *</label>
                <input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} maxLength={64} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>{createForm.name.length} / 64</div>
              </div>
              <div className="modal-field">
                <label>{t('qcp.revision')}</label>
                <input type="number" value={createForm.revision} onChange={e => setCreateForm({ ...createForm, revision: Number(e.target.value) })} />
              </div>
            </div>
            <div className="modal-field"><label>{t('common.description')} *</label><textarea value={createForm.desc} onChange={e => setCreateForm({ ...createForm, desc: e.target.value })} rows={4} /></div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: '8px 20px', background: 'var(--status-error)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>{t('common.cancel').toUpperCase()}</button>
              <button onClick={handleCreate} style={{ padding: '8px 20px', background: 'var(--blue)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>{t('common.save').toUpperCase()}</button>
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
          { type: 'select', label: 'Statut', key: 'status', options: [
            { value: '', label: 'Tous' },
            { value: 'active', label: 'Actif' },
            { value: 'draft', label: 'Brouillon' },
          ]},
        ]}
      />
    </div>
  )
}
