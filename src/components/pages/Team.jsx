import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

const MEMBERS = [
  { id: 1, name: 'Raphael Attal', email: 'r.attal@inspecto.com', initials: 'RA', role: 'Administrator', inspections: 42, nc: 12, color: 'var(--blue)' },
  { id: 2, name: 'Jean Martin', email: 'j.martin@inspecto.com', initials: 'JM', role: 'Inspector', inspections: 67, nc: 23, color: 'var(--status-success)' },
  { id: 3, name: 'Sophie Dupont', email: 's.dupont@inspecto.com', initials: 'SD', role: 'Inspector', inspections: 54, nc: 18, color: 'var(--status-warning)' },
  { id: 4, name: 'Antoine Leroy', email: 'a.leroy@inspecto.com', initials: 'AL', role: 'Inspector', inspections: 31, nc: 8, color: '#805ad5' },
  { id: 5, name: 'Marie Chen', email: 'm.chen@inspecto.com', initials: 'MC', role: 'Viewer', inspections: 0, nc: 0, color: 'var(--status-error)' },
  { id: 6, name: 'Thomas Bernard', email: 't.bernard@inspecto.com', initials: 'TB', role: 'Inspector', inspections: 19, nc: 5, color: '#00897b' },
  { id: 7, name: 'Laura Petit', email: 'l.petit@inspecto.com', initials: 'LP', role: 'Viewer', inspections: 0, nc: 0, color: 'var(--text-primary)' },
]

const ROLES = ['Administrator', 'Inspector', 'Viewer']

export default function Team() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Inspector')

  const roleBadge = (role) => {
    const styles = {
      Administrator: { bg: '#ebf5ff', color: 'var(--blue)' },
      Inspector: { bg: '#f0fff4', color: 'var(--status-success)' },
      Viewer: { bg: '#f7fafc', color: 'var(--text-secondary)' },
    }
    const s = styles[role] || styles.Viewer
    const roleKey = role.toLowerCase()
    return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>{t(`team.roles.${roleKey}`)}</span>
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.team-card', { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', delay: 0.2,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{t('team.title')}</h2>
        <button className="btn-primary" data-demo-target="btn-invite" onClick={() => setShowInvite(true)}>{t('team.invite')}</button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="panel" style={{ opacity: 1, transform: 'none', marginBottom: '20px', border: '2px solid var(--blue)' }}>
          <div className="panel-header">
            <div className="panel-title">{t('team.modalTitle')}</div>
            <button className="btn-icon" onClick={() => setShowInvite(false)} title={t('common.close')}>&times;</button>
          </div>
          <div className="panel-body">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('team.emailLabel')}</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder={t('team.emailPlaceholder')}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <div style={{ width: '180px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('team.roleLabel')}</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}
                >
                  {ROLES.map(r => <option key={r} value={r}>{t(`team.roles.${r.toLowerCase()}`)}</option>)}
                </select>
              </div>
              <button className="btn-primary" data-demo-target="btn-send-invite" onClick={() => { setShowInvite(false); setInviteEmail('') }}>{t('team.sendInvite')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Team grid */}
      <div className="team-grid">
        {MEMBERS.map(m => (
          <div className="team-card" key={m.id}>
            <div className="team-card-avatar" style={{ background: m.color }}>{m.initials}</div>
            <div className="team-card-name">{m.name}</div>
            <div className="team-card-email">{m.email}</div>
            <div style={{ margin: '8px 0' }}>{roleBadge(m.role)}</div>
            <div className="team-card-stats">
              <div><strong>{m.inspections}</strong> <span>{t('team.memberStats.inspections')}</span></div>
              <div><strong>{m.nc}</strong> <span>{t('team.memberStats.nc')}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
