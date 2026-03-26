import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { showToast } from '../Toast'

const timelineData = [
  { dateSep: "Aujourd'hui — 18 mars 2026" },
  { type: 'inspections', dot: 'blue', action: <>L'inspection <strong>INS-2026-006 — Audit fournisseur aéro</strong> a été planifiée</>, user: 'RA', userName: 'R. Attal', time: '14:32', tag: 'Inspection', tagColor: 'blue' },
  { type: 'non-conformités', dot: 'red', action: <>NC <strong>#NC-2026-0043</strong> créée — Défaut soudure bride moteur Lot 42</>, user: 'RA', userName: 'R. Attal', time: '11:17', tag: 'NC · Major', tagColor: 'red' },
  { type: 'documents', dot: 'green', action: <>Fichier <strong>Plan_qualite_v3.pdf</strong> ajouté à la bibliothèque documentaire</>, user: 'JM', userName: 'J. Martin', time: '09:45', tag: 'Document', tagColor: 'green' },
  { dateSep: 'Hier — 17 mars 2026' },
  { type: 'inspections', dot: 'green', action: <>L'inspection <strong>INS-2026-004 — Sécurité hangar MRO</strong> a été clôturée</>, user: 'LB', userName: 'L. Bernard', time: '16:58', tag: 'Inspection', tagColor: 'blue' },
  { type: 'non-conformités', dot: 'green', action: <>NC <strong>#NC-2026-0041</strong> marquée comme résolue — Action corrective validée</>, user: 'SD', userName: 'S. Dupont', time: '14:20', tag: 'NC clôturée', tagColor: 'red' },
  { type: 'projets', dot: 'purple', action: <>Projet <strong>Transformateur de vapeur</strong> — Statut passé à <span className="status progress" style={{ fontSize: '0.85rem' }}>En cours</span></>, user: 'JM', userName: 'J. Martin', time: '09:12', tag: 'Projet', tagColor: 'purple' },
  { dateSep: '16 mars 2026' },
  { type: 'documents', dot: 'green', action: <>Fichier <strong>Rapport_audit_ISO19443_S3.pdf</strong> téléchargé par l'équipe</>, user: 'AL', userName: 'A. Leroy', time: '15:33', tag: 'Document', tagColor: 'green' },
  { type: 'équipe', dot: 'orange', action: <>Utilisateur <strong>M. Chen</strong> ajouté au projet Pilatus PC21 avec le rôle <strong>Observer</strong></>, user: 'RA', userName: 'R. Attal', time: '10:04', tag: 'Équipe', tagColor: 'orange' },
  { type: 'inspections', dot: 'blue', action: <>Formulaire <strong>QCP-Moteur-HT-v2</strong> assigné à l'inspection INS-2026-007</>, user: 'SD', userName: 'S. Dupont', time: '08:22', tag: 'Inspection', tagColor: 'blue' },
  { dateSep: '15 mars 2026' },
  { type: 'non-conformités', dot: 'red', action: <>CAPA automatique créée pour NC <strong>#NC-2026-0040</strong> — assignée à A. Leroy</>, user: 'AI', userName: 'Système IA', time: '23:58', tag: 'CAPA auto', tagColor: 'red', avatarBg: '#9b59b6' },
  { type: 'documents', dot: 'green', action: <>Fichier <strong>Procédure_soudage_TIG_v5.docx</strong> mis à jour — révision obligatoire requise</>, user: 'JM', userName: 'J. Martin', time: '16:44', tag: 'Document', tagColor: 'green' },
]

const libraryDocs = [
  { name: 'Plan_qualite_v3.pdf', type: 'PDF', typeTag: 'red', project: 'Fabrication moteur HT', addedBy: 'J. Martin', date: '18 mars 2026', size: '2,4 Mo', iconClass: 'lib-pdf' },
  { name: 'Rapport_audit_ISO19443_S3.pdf', type: 'PDF', typeTag: 'red', project: 'Fabrication moteur HT', addedBy: 'A. Leroy', date: '16 mars 2026', size: '4,1 Mo', iconClass: 'lib-pdf' },
  { name: 'Procédure_soudage_TIG_v5.docx', type: 'Word', typeTag: 'blue', project: 'Fabrication moteur HT', addedBy: 'J. Martin', date: '15 mars 2026', size: '0,8 Mo', iconClass: 'lib-word' },
  { name: 'QCP_JupiterBach_2026.xlsx', type: 'Excel', typeTag: 'green', project: 'Jupiter Bach', addedBy: 'R. Attal', date: '10 mars 2026', size: '1,2 Mo', iconClass: 'lib-excel' },
  { name: 'Certificat_ISO19443_Inspecto_2025.pdf', type: 'PDF', typeTag: 'red', project: 'Tous projets', addedBy: 'J. Martin', date: '02 jan. 2025', size: '0,3 Mo', iconClass: 'lib-pdf' },
]

const teamMembers = [
  { initials: 'RA', name: 'Raphaël Attal', email: 'raphaelattal98@gmail.com', role: 'Administrateur', roleClass: 'team-role-admin', inspections: 12, nc: 3 },
  { initials: 'JM', name: 'Jean Martin', email: 'j.martin@inspecto.com', role: 'Inspecteur principal', roleClass: 'team-role-inspector', inspections: 48, nc: 7, bg: 'var(--status-success)' },
  { initials: 'SD', name: 'Sophie Dupont', email: 's.dupont@inspecto.com', role: 'Inspecteur', roleClass: 'team-role-inspector', inspections: 31, nc: 5, bg: 'var(--status-warning)' },
  { initials: 'AL', name: 'Antoine Leroy', email: 'a.leroy@inspecto.com', role: 'Inspecteur', roleClass: 'team-role-inspector', inspections: 22, nc: 2, bg: 'var(--bg-tertiary)' },
  { initials: 'MC', name: 'M. Chen', email: 'm.chen@partner.com', role: 'Observer', roleClass: 'team-role-observer', inspections: 0, nc: 0, bg: '#9b59b6' },
]

export default function Traceability() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('timeline')
  const [typeFilter, setTypeFilter] = useState('toutes')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.panel', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  function switchTab(tab) {
    setActiveTab(tab)
    setTimeout(() => {
      const target = document.getElementById(`tab-${tab}`)
      if (target) gsap.from(target, { opacity: 0, y: 8, duration: 0.3, ease: 'power2.out' })
    }, 0)
  }

  return (
    <div ref={containerRef} data-demo-target="traceability-page">
      <div className="stats-tabs" id="trace-tabs">
        <button className={`stats-tab${activeTab === 'timeline' ? ' active' : ''}`} onClick={() => switchTab('timeline')}>{t('traceability.tabs.timeline')}</button>
        <button className={`stats-tab${activeTab === 'library' ? ' active' : ''}`} onClick={() => switchTab('library')}>{t('traceability.tabs.library')}</button>
        <button className={`stats-tab${activeTab === 'team' ? ' active' : ''}`} onClick={() => switchTab('team')}>{t('traceability.tabs.team')}</button>
      </div>

      {/* TIMELINE */}
      <div id="tab-timeline" style={{ display: activeTab === 'timeline' ? 'block' : 'none' }}>
        <div className="stats-filter-row">
          <div className="proj-filter-select"><label>{t('traceability.filters.period')}</label><select><option>{t('common.last7days')}</option><option>{t('common.last30days')}</option><option>{t('common.last3months')}</option><option>{t('common.allTime')}</option></select></div>
          <div className="proj-filter-select"><label>{t('traceability.filters.actionType')}</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value.toLowerCase())}>
              <option>{t('common.all')}</option><option>{t('sidebar.inspections')}</option><option>{t('common.nonConformities')}</option><option>{t('common.documents')}</option><option>{t('common.projects')}</option><option>{t('common.teamLabel')}</option>
            </select>
          </div>
          <div className="proj-filter-select"><label>{t('traceability.filters.user')}</label><select><option>{t('common.all')}</option><option>R. Attal</option><option>J. Martin</option><option>S. Dupont</option><option>A. Leroy</option></select></div>
        </div>

        <div className="panel" style={{ opacity: 1, transform: 'none' }} id="panel-timeline">
          <div className="panel-header">
            <div className="panel-title">Journal d'activité</div>
            <div className="panel-actions">
              <span style={{ fontSize: '0.88rem', color: 'var(--text-tertiary)' }}>247 événements</span>
              <button className="panel-btn ghost" style={{ fontSize: '0.9rem' }} onClick={() => showToast('Timeline exported', 'info')}>{t('common.export')}</button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="trace-timeline">
              {timelineData.map((item, i) => {
                if (item.dateSep) return <div className="trace-date-sep" key={i}>{item.dateSep}</div>
                const visible = typeFilter === 'toutes' || item.type === typeFilter
                if (!visible) return null
                return (
                  <div className="trace-item" data-type={item.type} key={i}>
                    <div className={`trace-dot trace-dot-${item.dot}`}></div>
                    <div className="trace-content">
                      <div className="trace-action">{item.action}</div>
                      <div className="trace-meta">
                        <span className="trace-user">
                          <div className="sidebar-user-avatar" style={{ width: 18, height: 18, fontSize: '0.85rem', ...(item.avatarBg ? { background: item.avatarBg } : {}) }}>{item.user}</div>
                          {item.userName}
                        </span>
                        <span className="trace-time">{item.time}</span>
                        <span className={`trace-tag trace-tag-${item.tagColor}`}>{item.tag}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="insp-table-footer">
              <span>247 événements — affichage des 11 derniers</span>
              <button className="panel-btn ghost" style={{ fontSize: '0.9rem' }} onClick={() => showToast('Loading more events...', 'info')}>{t('common.loadMore')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* LIBRARY */}
      <div id="tab-library" style={{ display: activeTab === 'library' ? 'block' : 'none' }}>
        <div className="stats-filter-row">
          <div className="proj-filter-select"><label>{t('common.projects')}</label><select><option>{t('common.all')}</option><option>Fabrication moteur HT</option><option>Jupiter Bach</option></select></div>
          <div className="proj-filter-select"><label>{t('common.type')}</label><select><option>{t('common.all')}</option><option>PDF</option><option>Word</option><option>Excel</option></select></div>
          <button className="panel-btn primary" style={{ marginLeft: 'auto' }} onClick={() => showToast('Document upload opened', 'info')}>{t('common.addDocument')}</button>
        </div>
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header">
            <div className="panel-title">{t('sidebar.documentation')}</div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>23 {t('common.documents').toLowerCase()}</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead><tr><th>{t('common.name')}</th><th>{t('common.type')}</th><th>{t('common.projects')}</th><th>Ajouté par</th><th>{t('common.date')}</th><th>Taille</th><th></th></tr></thead>
              <tbody>
                {libraryDocs.map((doc) => (
                  <tr key={doc.name}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div className={`lib-file-icon ${doc.iconClass}`}>{doc.type === 'Word' ? 'DOC' : doc.type === 'Excel' ? 'XLS' : 'PDF'}</div>{doc.name}</div></td>
                    <td><span className={`trace-tag trace-tag-${doc.typeTag}`} style={{ fontSize: '0.85rem' }}>{doc.type}</span></td>
                    <td>{doc.project}</td>
                    <td>{doc.addedBy}</td>
                    <td>{doc.date}</td>
                    <td>{doc.size}</td>
                    <td><button className="proj-icon-btn" title={t('common.download')} onClick={() => showToast('File downloaded', 'info')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div id="tab-team" style={{ display: activeTab === 'team' ? 'block' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.875rem' }}>
          <button className="panel-btn primary">{t('common.inviteMember')}</button>
        </div>
        <div className="team-grid">
          {teamMembers.map((m) => (
            <div className="team-card" key={m.initials}>
              <div className="team-card-avatar" style={m.bg ? { background: m.bg } : {}}>{m.initials}</div>
              <div className="team-card-info">
                <div className="team-card-name">{m.name}</div>
                <div className="team-card-email">{m.email}</div>
                <span className={`team-card-role ${m.roleClass}`}>{m.role}</span>
              </div>
              <div className="team-card-stats">
                <div className="team-stat"><strong>{m.inspections}</strong><span>{t('team.memberStats.inspections')}</span></div>
                <div className="team-stat"><strong>{m.nc}</strong><span>{t('team.memberStats.nc')}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
