/**
 * SAE Demo Script — Internal Audit & GED
 * Language: English (EN) — also used as fallback for IT/ES/DE
 * until those get their own native scripts.
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Welcome SAE + Dashboard
     ═══════════════════════════════════════════════════════════ */
  { id:'s1-0', phase:1, phaseTitle:'Welcome SAE', type:'speak',
    text:"Hello and welcome to the Inspecto SAE demo. I'll walk you through the two flagship modules built for regulated industries: internal ISO audit and electronic document management. Over 500 active accounts already trust us for compliance audits. Let's get started!",
    delayAfter:1800 },

  { id:'s1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"This is your SAE dashboard. Unlike the Inspecto mode, the context here is an internal audit project aligned with ISO 9001, 19443 and AS/EN 9100. The whole UI adapts around that.",
    delayAfter:2600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Audit Workflow
     ═══════════════════════════════════════════════════════════ */
  { id:'s2-0', phase:2, phaseTitle:"Audit Workflow", type:'navigate',
    route:'/app/audit-workflow', transition:'prezi',
    waitForSelector:'[data-demo-target="sae-audit-page"]',
    speak:"This is the Audit Workflow module. Built for recurring internal audits, it lets you configure, plan, run and trace an ISO audit end to end.",
    delayAfter:2800 },

  { id:'s2-1', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-project"]',
    speak:"Every audit is tied to a project — here, INTERNAL AUDIT 2026, compliant with ISO 9001, ISO 19443 and AS/EN 9100. The references are surfaced clearly for field auditors.",
    delayAfter:2800 },

  { id:'s2-2', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-tabs"]',
    speak:"Audit configuration is organized around five tabs: Settings, Step, Configuration, Information and Synthesis. Let me show them one by one.",
    delayAfter:2400 },

  { id:'s2-3', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-step"]',
    speak:"The Step tab shows the current phase, next phase and deadline. We're in Phase 2 — field inspection — with Phase 3 (corrective actions) due on June 22nd.",
    highlightBefore:true, delayAfter:2800 },

  { id:'s2-4', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-config"]',
    speak:"The Configuration tab tells you who runs the audit. Christophe Renaud is the lead auditor, Daniele Brunetti is the field inspector, and the template used is ISO 19443 — HR & Cybersecurity.",
    highlightBefore:true, delayAfter:2800 },

  { id:'s2-5', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-synthesis"]',
    speak:"The Synthesis tab is the audit's showcase: 85% overall compliance, 24 out of 28 controls passed, two minor non-conformities open. The whole summary exports to PDF in one click.",
    highlightBefore:true, delayAfter:3000 },

  { id:'s2-6', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-settings"]',
    speak:"Back to the base settings — dates, progress and audit scope. 65% already complete, end date June 14th.",
    highlightBefore:true, delayAfter:2400 },

  { id:'s2-7', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-gantt"]',
    speak:"The 2026 audit programme is visualized as a Gantt chart. Each auditor has their own rows — Christophe on HR & Cybersecurity, Daniele on field inspection. You can switch between day, week, month and year views.",
    delayAfter:3000 },

  { id:'s2-8', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-trace"]',
    speak:"And here's the traceability: every audit event is logged. Green PASS, blue INSPECTION, red ACTIONS and orange FINDING badges let you understand at a glance what happened, when, and by whom. This is your compliance proof for the certifiers.",
    delayAfter:3400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — GED (Document Management)
     ═══════════════════════════════════════════════════════════ */
  { id:'s3-0', phase:3, phaseTitle:"Document Management", type:'navigate',
    route:'/app/ged', transition:'prezi',
    waitForSelector:'[data-demo-target="sae-ged-page"]',
    speak:"Now let's move to the second pillar of SAE: electronic document management. It's a structured repository with a validation workflow and formal transmittal.",
    delayAfter:2600 },

  { id:'s3-1', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-workflow"]',
    speak:"Every document follows a four-stage lifecycle: Creation, Validation, Approval, Diffusion. The active document here is in Validation — you can see the EN RÉDACTION badge and step 2 highlighted in red.",
    delayAfter:3200 },

  { id:'s3-2', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-repository"]',
    speak:"The repository holds all your audit documents with their standardized codification — here, prefix 26D for year 2026. Each row carries its colored status. Let me open one.",
    delayAfter:2800 },

  { id:'s3-3', phase:3, type:'click', selector:'.sae-ged-table tbody tr:first-child',
    speak:"Document 26D000067 — the HR process monitoring plan. Still in drafting. In the real app, clicking opens the detail view with seven tabs: Document, Files, Distribution List, Dispatches, Journals, Flow, Revisions.",
    delayAfter:3200 },

  { id:'s3-4', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-transmittal"]',
    speak:"The transmittal is the formal dispatch mechanism. A formal email with subject, message, attachments, secure link expiration and read receipt. That's what provides the regulatory proof of who received what and when.",
    delayAfter:3400 },

  { id:'s3-5', phase:3, type:'click', selector:'[data-demo-target="sae-ged-send-btn"]',
    speak:"I'm sending the transmittal to the three recipients. The secure download link expires in 30 days, and each recipient must acknowledge receipt within 5 business days. All activity is timestamped in the traceability log.",
    highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Conclusion
     ═══════════════════════════════════════════════════════════ */
  { id:'s4-0', phase:4, phaseTitle:"Conclusion", type:'speak',
    text:"That's a wrap on the SAE demo. You've seen how to run an ISO internal audit end to end — configuration, planning, traceability — and how to manage the document lifecycle with workflow and formal transmittal. To try this on your own projects, book a demo on inspectogroup.com. Thanks for watching!",
    delayAfter:2000 },
]
