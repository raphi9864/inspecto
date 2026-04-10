import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/* ─────────────────────────────────────────────────────────────────
   SAE — Internal Audit Workflow
   Route: /app/audit-workflow (only exposed in the sidebar when
   ProductMode === 'sae'). Mirrors the "Use case - Internal Audit"
   reference video: 5-tab config, Gantt programme, traceability.
   ───────────────────────────────────────────────────────────────── */

function GanttRow({ name, start, end, color, label, percent }) {
  return (
    <div className="sae-gantt-row">
      <div className="sae-gantt-name">{name}</div>
      <div className="sae-gantt-dates">{start} — {end}</div>
      <div className="sae-gantt-track">
        <div className="sae-gantt-bar" style={{ width: `${percent}%`, background: color }}>
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}

function TraceEvent({ kind, title, user, ts, status }) {
  const kindColors = {
    PASS: '#38a169',
    INSPECTION: '#2ea3f2',
    ACTIONS: '#d7294a',
    FINDING: '#f59e0b',
  }
  return (
    <div className="sae-trace-row">
      <div className="sae-trace-badge" style={{ background: kindColors[kind] }}>{kind}</div>
      <div className="sae-trace-main">
        <div className="sae-trace-title">{title}</div>
        <div className="sae-trace-meta">{user} · {ts}</div>
      </div>
      <div className={`sae-trace-status sae-trace-status--${status.toLowerCase()}`}>{status}</div>
    </div>
  )
}

const TAB_KEYS = ['settings', 'step', 'config', 'info', 'synthesis']
const GANTT_VIEWS = ['day', 'week', 'month', 'year']

export default function SaeAuditWorkflow() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('settings')
  const [ganttView, setGanttView] = useState('month')

  return (
    <div className="sae-page-container" data-demo-target="sae-audit-page">
      <div className="sae-page-head">
        <div className="sae-page-label">SAE · {t('sae.audit.label')}</div>
        <h1 className="sae-page-title">{t('sae.audit.title')}</h1>
        <p className="sae-page-sub">{t('sae.audit.sub')}</p>
      </div>

      {/* Project header with ISO reference */}
      <div className="sae-project-card" data-demo-target="sae-audit-project">
        <div className="sae-project-main">
          <div className="sae-project-name">INTERNAL AUDIT</div>
          <div className="sae-project-dates">
            <span><strong>{t('sae.audit.startDate')}:</strong> 02-01-2026</span>
            <span><strong>{t('sae.audit.endDate')}:</strong> 31-12-2026</span>
          </div>
          <div className="sae-project-desc">{t('sae.audit.projectDesc')}</div>
        </div>
        <div className="sae-project-iso">
          <div className="sae-iso-logo">
            <div className="sae-iso-mark">ISO</div>
            <div className="sae-iso-text">
              <div>International</div>
              <div>Organization for</div>
              <div>Standardization</div>
            </div>
          </div>
          <div className="sae-iso-refs">
            <span className="sae-iso-ref">ISO 9001</span>
            <span className="sae-iso-ref">ISO 19443</span>
            <span className="sae-iso-ref">AS/EN 9100</span>
          </div>
        </div>
      </div>

      {/* 5-tab configuration */}
      <div className="sae-tab-card" data-demo-target="sae-audit-tabs">
        <div className="sae-tabs" role="tablist">
          {TAB_KEYS.map(k => (
            <button
              key={k}
              role="tab"
              aria-selected={activeTab === k}
              className={`sae-tab${activeTab === k ? ' sae-tab--active' : ''}`}
              onClick={() => setActiveTab(k)}
              data-demo-target={`sae-audit-tab-${k}`}
            >
              {t(`sae.audit.tabs.${k}`)}
            </button>
          ))}
        </div>
        <div className="sae-tab-body">
          {activeTab === 'settings' && (
            <div className="sae-form-grid">
              <div className="sae-form-field">
                <label>{t('sae.audit.form.start')}</label>
                <input type="text" defaultValue="01-06-2026 09:00" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.form.end')}</label>
                <input type="text" defaultValue="14-06-2026 17:00" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.form.progress')}</label>
                <div className="sae-form-progress">
                  <div className="sae-form-progress-bar" style={{ width: '65%' }} />
                  <span>65%</span>
                </div>
              </div>
              <div className="sae-form-field sae-form-field--wide">
                <label>{t('sae.audit.form.scope')}</label>
                <textarea readOnly defaultValue={t('sae.audit.form.scopeVal')} />
              </div>
            </div>
          )}
          {activeTab === 'step' && (
            <div className="sae-form-grid">
              <div className="sae-form-field">
                <label>{t('sae.audit.step.current')}</label>
                <input type="text" defaultValue="Phase 2 — Field inspection" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.step.next')}</label>
                <input type="text" defaultValue="Phase 3 — Corrective actions" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.step.deadline')}</label>
                <input type="text" defaultValue="22-06-2026" readOnly />
              </div>
            </div>
          )}
          {activeTab === 'config' && (
            <div className="sae-form-grid">
              <div className="sae-form-field">
                <label>{t('sae.audit.config.auditor')}</label>
                <input type="text" defaultValue="Christophe RENAUD" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.config.inspector')}</label>
                <input type="text" defaultValue="Daniele Brunetti" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.config.template')}</label>
                <input type="text" defaultValue="ISO 19443 · HR & Cybersecurity" readOnly />
              </div>
            </div>
          )}
          {activeTab === 'info' && (
            <div className="sae-form-grid">
              <div className="sae-form-field sae-form-field--wide">
                <label>{t('sae.audit.info.reference')}</label>
                <input type="text" defaultValue="INT-AUDIT-2026-001" readOnly />
              </div>
              <div className="sae-form-field sae-form-field--wide">
                <label>{t('sae.audit.info.notes')}</label>
                <textarea readOnly defaultValue={t('sae.audit.info.notesVal')} />
              </div>
            </div>
          )}
          {activeTab === 'synthesis' && (
            <div className="sae-form-grid">
              <div className="sae-form-field sae-form-field--wide">
                <label>{t('sae.audit.synthesis.conclusion')}</label>
                <textarea readOnly defaultValue={t('sae.audit.synthesis.conclusionVal')} />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.synthesis.passed')}</label>
                <input type="text" defaultValue="24 / 28" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.synthesis.findings')}</label>
                <input type="text" defaultValue="2 ongoing · 2 closed" readOnly />
              </div>
              <div className="sae-form-field">
                <label>{t('sae.audit.synthesis.actions')}</label>
                <input type="text" defaultValue="4 open" readOnly />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit 2026 Programme — Gantt */}
      <div className="sae-gantt-card" data-demo-target="sae-audit-gantt">
        <div className="sae-gantt-head">
          <h3>{t('sae.audit.programme')}</h3>
          <div className="sae-gantt-tabs">
            {GANTT_VIEWS.map(v => (
              <button
                key={v}
                onClick={() => setGanttView(v)}
                className={ganttView === v ? 'active' : ''}
              >
                {t(`sae.audit.${v}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="sae-gantt-grid">
          <div className="sae-gantt-months">
            <span />
            <span>May 2026</span>
            <span>Jun 2026</span>
            <span>Jul 2026</span>
          </div>
          <GanttRow name="Christophe RENAUD" start="2026-06-01" end="2026-07-15" color="#0d2341" label="HR · Cybersecurity" percent={72} />
          <GanttRow name="HR process + Cybersecurity" start="2026-06-01" end="2026-06-28" color="#2ea3f2" label={t('sae.audit.inProgress')} percent={58} />
          <GanttRow name="Daniele Brunetti" start="2026-06-14" end="2026-07-05" color="#38a169" label="Inspection · Audit 2026" percent={40} />
          <GanttRow name="Inspection - Audit HR" start="2026-06-14" end="2026-06-22" color="#f59e0b" label={t('sae.audit.scheduled')} percent={25} />
        </div>
      </div>

      {/* Traceability timeline */}
      <div className="sae-trace-card" data-demo-target="sae-audit-trace">
        <div className="sae-trace-head">
          <h3>{t('sae.audit.traceability')}</h3>
          <span className="sae-trace-count">7 {t('sae.audit.events')}</span>
        </div>
        <TraceEvent kind="PASS" title={t('sae.trace.e1')} user="Daniele B." ts="14-06-2026 10:23:14" status="Done" />
        <TraceEvent kind="INSPECTION" title={t('sae.trace.e2')} user="Christophe R." ts="14-06-2026 14:05:41" status="Done" />
        <TraceEvent kind="ACTIONS" title={t('sae.trace.e3')} user="Christophe R." ts="15-06-2026 09:12:08" status="Open" />
        <TraceEvent kind="INSPECTION" title={t('sae.trace.e4')} user="Daniele B." ts="16-06-2026 11:48:37" status="Done" />
        <TraceEvent kind="FINDING" title={t('sae.trace.e5')} user="Daniele B." ts="16-06-2026 15:22:19" status="Open" />
        <TraceEvent kind="ACTIONS" title={t('sae.trace.e6')} user="Christophe R." ts="17-06-2026 08:45:02" status="Ongoing" />
        <TraceEvent kind="PASS" title={t('sae.trace.e7')} user="Daniele B." ts="18-06-2026 16:30:55" status="Done" />
      </div>
    </div>
  )
}
