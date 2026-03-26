import { useState, useEffect } from 'react'

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    transition: 'opacity 0.3s',
  },
  panel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 320,
    background: 'var(--bg-secondary, #0f1923)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-primary, #1e2a36)',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-primary, #f0f4f8)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary, #8899a6)',
    fontSize: '1.4rem',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: 1,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary, #8899a6)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '0.88rem',
    border: '1px solid var(--border-primary, #1e2a36)',
    borderRadius: 6,
    background: 'var(--bg-tertiary, #0a1117)',
    color: 'var(--text-primary, #f0f4f8)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderTop: '1px solid var(--border-primary, #1e2a36)',
  },
  applyBtn: {
    padding: '8px 20px',
    background: '#d7294a',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontWeight: 600,
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  resetBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary, #8899a6)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 0',
  },
}

function buildInitialValues(filterConfig) {
  const vals = {}
  filterConfig.forEach((f) => {
    if (f.type === 'dateRange') {
      vals[f.fromKey] = ''
      vals[f.toKey] = ''
    } else {
      vals[f.key] = ''
    }
  })
  return vals
}

export default function FilterPanel({ isOpen, onClose, onApply, onReset, filterConfig = [] }) {
  const [values, setValues] = useState(() => buildInitialValues(filterConfig))

  // Reset internal values when filterConfig changes
  useEffect(() => {
    setValues(buildInitialValues(filterConfig))
  }, [filterConfig])

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const handleApply = () => {
    onApply(values)
  }

  const handleReset = () => {
    setValues(buildInitialValues(filterConfig))
    if (onReset) onReset()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ ...styles.backdrop, opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          ...styles.panel,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerTitle}>Filtres</span>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {filterConfig.map((cfg, idx) => {
            if (cfg.type === 'select') {
              return (
                <div key={cfg.key || idx}>
                  <label style={styles.fieldLabel}>{cfg.label}</label>
                  <select
                    style={styles.input}
                    value={values[cfg.key] || ''}
                    onChange={(e) => handleChange(cfg.key, e.target.value)}
                  >
                    {cfg.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )
            }

            if (cfg.type === 'dateRange') {
              return (
                <div key={cfg.fromKey || idx}>
                  <label style={styles.fieldLabel}>{cfg.label}</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="date"
                      style={{ ...styles.input, flex: 1 }}
                      value={values[cfg.fromKey] || ''}
                      onChange={(e) => handleChange(cfg.fromKey, e.target.value)}
                    />
                    <span style={{ color: 'var(--text-tertiary, #5c6e7e)', fontSize: '0.85rem' }}>–</span>
                    <input
                      type="date"
                      style={{ ...styles.input, flex: 1 }}
                      value={values[cfg.toKey] || ''}
                      onChange={(e) => handleChange(cfg.toKey, e.target.value)}
                    />
                  </div>
                </div>
              )
            }

            if (cfg.type === 'text') {
              return (
                <div key={cfg.key || idx}>
                  <label style={styles.fieldLabel}>{cfg.label}</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder={cfg.placeholder || ''}
                    value={values[cfg.key] || ''}
                    onChange={(e) => handleChange(cfg.key, e.target.value)}
                  />
                </div>
              )
            }

            return null
          })}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.resetBtn} onClick={handleReset}>Réinitialiser</button>
          <button style={styles.applyBtn} onClick={handleApply}>Appliquer</button>
        </div>
      </div>
    </>
  )
}
