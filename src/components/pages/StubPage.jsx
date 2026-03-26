import { useTranslation } from 'react-i18next'

export default function StubPage({ title }) {
  const { t } = useTranslation()
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E0" strokeWidth="1.5" style={{ marginBottom: 16 }}>
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{title}</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{t('common.underConstruction')}</p>
    </div>
  )
}
