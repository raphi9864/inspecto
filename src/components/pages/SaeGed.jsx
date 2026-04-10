import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../Toast'

/* ─────────────────────────────────────────────────────────────────
   SAE — GED (Gestion Électronique de Documents)
   Route: /app/ged (visible only in SAE mode). Mirrors the
   "GED - Suivi Documents" reference video: document repository,
   4-stage workflow state machine, transmittal composer.
   ───────────────────────────────────────────────────────────────── */

function WorkflowStep({ num, label, state, icon }) {
  return (
    <div className={`sae-wf-step sae-wf-step--${state}`}>
      <div className="sae-wf-step-num">{num}</div>
      <div className="sae-wf-step-icon">{icon}</div>
      <div className="sae-wf-step-label">{label}</div>
    </div>
  )
}

const STATUS_COLORS = {
  'EN RÉDACTION': '#805ad5',
  'VALIDATION': '#2ea3f2',
  'APPROBATION': '#f59e0b',
  'DIFFUSION': '#38a169',
}

function DocRow({ code, title, type, status, date, onClick }) {
  return (
    <tr onClick={onClick}>
      <td className="sae-doc-code">{code}</td>
      <td className="sae-doc-title">{title}</td>
      <td>{type}</td>
      <td>
        <span className="sae-doc-status" style={{ background: STATUS_COLORS[status] }}>
          {status}
        </span>
      </td>
      <td>{date}</td>
    </tr>
  )
}

export default function SaeGed() {
  const { t } = useTranslation()
  const [, setSelectedDoc] = useState(null)

  const handleRowClick = (code) => {
    setSelectedDoc(code)
    showToast(`${t('sae.ged.opened')} ${code}`, 'info')
  }

  const handleSend = () => {
    showToast(t('sae.ged.sentToast'), 'success')
  }

  return (
    <div className="sae-page-container" data-demo-target="sae-ged-page">
      <div className="sae-page-head">
        <div className="sae-page-label">SAE · {t('sae.ged.label')}</div>
        <h1 className="sae-page-title">{t('sae.ged.title')}</h1>
        <p className="sae-page-sub">{t('sae.ged.sub')}</p>
      </div>

      <div className="sae-ged-mock">
        {/* Dark navy header — distinct from Inspecto DQI chrome */}
        <div className="sae-ged-header">
          <div className="sae-ged-breadcrumb">
            <strong>prg001</strong> — Inspecto documents
          </div>
          <div className="sae-ged-meta">
            <span>Client: test sa</span>
            <span>Ordine: 11</span>
            <span>Sub-Project: 22</span>
          </div>
          <div className="sae-ged-actions">
            <button className="sae-ged-btn" title="Settings">⚙</button>
            <button className="sae-ged-btn" title="Folders">📁</button>
            <button className="sae-ged-btn" title="Reports">📊</button>
          </div>
        </div>

        {/* Workflow state machine */}
        <div className="sae-wf-row" data-demo-target="sae-ged-workflow">
          <div className="sae-wf-status">
            <span className="sae-wf-status-label">{t('sae.ged.currentStatus')}</span>
            <span className="sae-wf-status-badge">EN RÉDACTION</span>
          </div>
          <div className="sae-wf-steps">
            <WorkflowStep num="1" label={t('sae.ged.wf.creation')} state="done" icon="✎" />
            <WorkflowStep num="2" label={t('sae.ged.wf.validation')} state="active" icon="✓" />
            <WorkflowStep num="3" label={t('sae.ged.wf.approval')} state="pending" icon="★" />
            <WorkflowStep num="4" label={t('sae.ged.wf.diffusion')} state="pending" icon="→" />
          </div>
        </div>

        {/* Split view: doc table + transmittal composer */}
        <div className="sae-ged-split">
          <div className="sae-ged-table-wrap" data-demo-target="sae-ged-repository">
            <div className="sae-ged-table-head">
              <h4>{t('sae.ged.repository')}</h4>
              <span className="sae-ged-count">13 {t('sae.ged.elements')}</span>
            </div>
            <table className="sae-ged-table">
              <thead>
                <tr>
                  <th>{t('sae.ged.col.code')}</th>
                  <th>{t('sae.ged.col.title')}</th>
                  <th>{t('sae.ged.col.type')}</th>
                  <th>{t('sae.ged.col.status')}</th>
                  <th>{t('sae.ged.col.date')}</th>
                </tr>
              </thead>
              <tbody>
                <DocRow code="26D000067" title={t('sae.ged.doc1')} type="Plan" status="EN RÉDACTION" date="24-03-2026" onClick={() => handleRowClick('26D000067')} />
                <DocRow code="26D000060" title={t('sae.ged.doc2')} type="Procédure" status="VALIDATION" date="22-03-2026" onClick={() => handleRowClick('26D000060')} />
                <DocRow code="26D000009" title={t('sae.ged.doc3')} type="Rapport" status="APPROBATION" date="20-03-2026" onClick={() => handleRowClick('26D000009')} />
                <DocRow code="26D000004" title={t('sae.ged.doc4')} type="Plan" status="DIFFUSION" date="18-03-2026" onClick={() => handleRowClick('26D000004')} />
                <DocRow code="26D000003" title={t('sae.ged.doc5')} type="Procédure" status="EN RÉDACTION" date="18-03-2026" onClick={() => handleRowClick('26D000003')} />
                <DocRow code="26D000001" title={t('sae.ged.doc6')} type="Rapport" status="VALIDATION" date="15-03-2026" onClick={() => handleRowClick('26D000001')} />
                <DocRow code="25D000013" title={t('sae.ged.doc7')} type="Plan" status="DIFFUSION" date="12-03-2026" onClick={() => handleRowClick('25D000013')} />
                <DocRow code="25D000012" title={t('sae.ged.doc8')} type="Procédure" status="APPROBATION" date="10-03-2026" onClick={() => handleRowClick('25D000012')} />
              </tbody>
            </table>
          </div>

          <div className="sae-transmittal" data-demo-target="sae-ged-transmittal">
            <div className="sae-transmittal-head">
              <h4>{t('sae.ged.transmittalTitle')}</h4>
              <span className="sae-transmittal-to">→ 3 {t('sae.ged.recipients')}</span>
            </div>
            <div className="sae-transmittal-body">
              <div className="sae-transmittal-field">
                <label>{t('sae.ged.subject')}</label>
                <div className="sae-transmittal-input">{t('sae.ged.subjectVal')}</div>
              </div>
              <div className="sae-transmittal-field">
                <label>{t('sae.ged.message')}</label>
                <div className="sae-transmittal-msg">
                  <p>{t('sae.ged.msgP1')}</p>
                  <p>{t('sae.ged.msgP2')}</p>
                </div>
              </div>
              <div className="sae-transmittal-attachments">
                <span className="sae-att">📎 26D000067-Plan.pdf</span>
                <span className="sae-att">📎 26D000060-Proc.pdf</span>
              </div>
              <div className="sae-transmittal-footer">
                <span className="sae-transmittal-expiry">{t('sae.ged.expiry')}: 30 {t('sae.ged.days')}</span>
                <button className="sae-btn-send" onClick={handleSend} data-demo-target="sae-ged-send-btn">
                  {t('sae.ged.send')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
