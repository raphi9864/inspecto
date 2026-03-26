import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { showToast } from '../Toast'

export default function Settings() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('general')

  const TAB_KEYS = ['general', 'forms', 'notifications']

  return (
    <div data-demo-target="settings-page">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0' }}>
        {TAB_KEYS.map(key => (
          <button
            key={key}
            data-demo-target={`settings-tab-${key}`}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: tab === key ? 600 : 400,
              color: tab === key ? 'var(--blue)' : 'var(--text-secondary)',
              borderBottom: tab === key ? '2px solid var(--blue)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {t(`settings.tabs.${key}`)}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">{t('settings.companyInfo')}</div></div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('settings.companyName')}</label>
                <input type="text" defaultValue="INSPECTO GROUP" style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('settings.timezone')}</label>
                <select style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '0.85rem', background: 'var(--bg-secondary)' }}>
                  <option>Europe/Paris (UTC+1)</option>
                  <option>Europe/London (UTC+0)</option>
                  <option>America/New_York (UTC-5)</option>
                  <option>Asia/Tokyo (UTC+9)</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('settings.companyLogo')}</label>
                <div style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5" style={{ display: 'block', margin: '0 auto 8px' }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  {t('common.dropLogo')} <strong>{t('common.clickUpload')}</strong>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => showToast(t('common.settingsSaved'), 'success')}>{t('common.saveChanges')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {tab === 'forms' && (
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">{t('settings.formConfig')}</div></div>
          <div className="panel-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {t('settings.manageTemplates')}
            </p>
            <Link to="/app/templates" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              {t('settings.goToTemplates')}
            </Link>
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div className="panel" style={{ opacity: 1, transform: 'none' }}>
          <div className="panel-header"><div className="panel-title">{t('settings.emailNotifications')}</div></div>
          <div className="panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { labelKey: 'ncCreated', descKey: 'ncCreatedDesc', checked: true },
                { labelKey: 'inspOverdue', descKey: 'inspOverdueDesc', checked: true },
                { labelKey: 'actionAssigned', descKey: 'actionAssignedDesc', checked: true },
                { labelKey: 'signatureReq', descKey: 'signatureReqDesc', checked: true },
                { labelKey: 'weeklyReport', descKey: 'weeklyReportDesc', checked: false },
                { labelKey: 'memberJoined', descKey: 'memberJoinedDesc', checked: false },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t(`settings.notifItems.${n.labelKey}`)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{t(`settings.notifItems.${n.descKey}`)}</div>
                  </div>
                  <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={n.checked} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, background: n.checked ? 'var(--blue)' : 'var(--toggle-off)', borderRadius: 11, transition: 'background 0.2s' }}></span>
                    <span style={{ position: 'absolute', top: 2, left: n.checked ? 20 : 2, width: 18, height: 18, background: 'var(--bg-secondary)', borderRadius: '50%', transition: 'left 0.2s' }}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
