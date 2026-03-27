/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: English (EN)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Settings (3 tabs) + Team (invite)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configuration', type:'speak',
    text:"Hello! I'm your INSPECTO DQI guide. I'll show you every feature of the platform. I click, I type, I fill in forms — everything is automated. Let's go!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"The Dashboard: 4 real-time KPIs.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 projects, 388 inspections, 108 non-conformities, 35 corrective actions.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Ongoing projects with progress and alerts.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Incoming tasks with status and deadline.", delayAfter:2400 },

  // ── Settings: 3 tabs ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Settings: 3 configuration tabs.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"General: name, timezone, company logo.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Forms: inspection templates and custom field types.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifications: email alerts for every event.", highlightBefore:true, delayAfter:2400 },

  // ── Team: invite a member ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Teams: 7 members with Admin, Inspector, Viewer roles.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Each member shows their stats: inspections performed and NC detected.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"I'm inviting a new member.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"I type the email…", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invitation sent!", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projects + Activities (creation) + Tasks + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projects: list + project dashboard ──
  { id:'2-0', phase:2, phaseTitle:'Projects', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"List of industrial projects.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"I open the project to see its dashboard.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"4 project KPIs: progress, actions, inspections, NC.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Interactive Gantt chart with activities and progress bars.", delayAfter:3000 },

  // ── Activities: + NEW + typing + save ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Activity management. I'll create one.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 existing activities: Design, Procurement, Production, Pre-production.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"I click + NEW ACTIVITY.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"I type the name: Design review \u2014 Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Saved! The activity appears in the table.", delayAfter:1600 },

  // ── Tasks & Resources ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tasks and Resources: allocation by person with priority.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Status, priority, progress bar for each task.", delayAfter:2400 },

  // ── Global Gantt ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Global Gantt: all activities on a timeline.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspections: counters, 3-tab detail, plan, form
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspections', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspections. I'll show you everything.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Counters: ongoing, overdue, pending, closed.", delayAfter:2000 },

  // Click row → detail with 3 tabs
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"I open an inspection.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Information tab: reference, dates, location, team.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Findings / NC tab: detected non-conformities.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Form tab: control point checklist.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Back to the list.", delayAfter:1000 },

  // + NEW INSPECTION → plan + typing title
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"I'm planning an inspection.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Title: ISO 9001 Audit \u2014 Paris Site.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Geolocated position.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Team: S. Dupont and J. Martin.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Planned!", delayAfter:1200 },

  // + FILL A FORM → auto detail
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"I'm filling in an inspection form.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Data automatically pre-filled.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Let's move to non-conformities.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC wizard 5 steps + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: full 5-step wizard ──
  { id:'4-0', phase:4, phaseTitle:'Quality', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Non-conformities. I'll walk through the full 5-step wizard.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. The wizard opens.", highlightBefore:true, delayAfter:1600 },

  // Step 1: Information
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Step 1/5 \u2014 Information: inspection, reference, area, event, criticality.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"I type the problem description…", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Status Ongoing, criticality Minor. Toggles: Lesson Learnt, Report date.", delayAfter:2000 },

  // Step 2: Photos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 2/5 \u2014 Photos. Import and annotate directly on the image.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Field photo imported. You can circle defects and annotate.", delayAfter:3000 },

  // Step 3: Root cause (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 3/5 \u2014 Root cause analysis. 3 methods available: 5 Whys, 8D and Ishikawa.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Each 'Why' is documented and triggers a corrective action.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"8D Method: 8 structured disciplines. Root cause identified in D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Ishikawa diagram: 6 cause-effect branches. Material, Method, Environment, Equipment, Manpower, Management.", highlightBefore:true, delayAfter:2400 },

  // Step 4: Resolution
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 4/5 \u2014 Resolution. Verification of linked corrective actions.", highlightBefore:true, delayAfter:2400 },

  // Step 5: Signature
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 5/5 \u2014 Signature. The document can be signed, closed or saved.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"I sign. NC validated and locked!", highlightBefore:true, delayAfter:2000 },

  // ── QCP: list + detail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Quality Control Plan (QCP). Each operation detailed.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"I open a control plan.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Operations: control type, criteria, references, Contractor/Client/Third-party roles, signatures.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Back.", delayAfter:800 },

  // ── CFSI: full form ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI: Supplier and Subcontractor Compliance.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"General information, practical notices, control photos, signature area and closure.", delayAfter:3600 },

  // ── RFF: Manufacturing Completion Report ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Manufacturing Completion Report \u2014 automatically generated from quality data.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspections, NCs and corrective actions consolidated in a single document.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 signature areas: Quality Manager, Client, Third Party.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"PDF generation in one click!", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Actions: full creation + costs
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Actions', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Corrective and preventive actions.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Counters: open, ongoing, overdue, closed.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Actions table with assignee, deadline, priority and linked NC.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"I'm creating a corrective action.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"I type the title…", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Type (Corrective/Preventive), assignee, deadline, cost: \u20ac50 \u00d7 24h = \u20ac1,200. Integrated effectiveness tracking.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Action created.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Library + Traceability + Stats (2 tabs) + Conclusion
     ═══════════════════════════════════════════════════════════ */
  // ── Documentation ──
  { id:'6-0', phase:6, phaseTitle:'Library', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Document library.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Folders organized by project. Multiple selection to generate a report.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"I am creating a new folder.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"I am naming the folder\u2026", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Folder created!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"I am adding a document.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Drag and drop or file import. Formats: PDF, Word, Excel.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Document added to the library with metadata.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"I am selecting multiple documents\u2026", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Multiple selection enabled.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"I am generating the document report. Automatic assembly in a single click!", highlightBefore:true, delayAfter:3000 },

  // ── Traceability ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Traceability: complete timeline. Who, what, when.", delayAfter:3000 },

  // ── Statistics: 2 tabs ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistics: 1,393 inspections analyzed over 4 years.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"General tab: time distribution, histograms, compliance rate.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Findings / NC tab: breakdown by criticality, area and trend.", highlightBefore:true, delayAfter:3000 },

  // ── Conclusion ──
  { id:'6-end', phase:6, type:'speak',
    text:"The presentation is over! You've just seen ALL the features: dashboard with KPIs, settings (3 tabs), team management with invitations, projects with Gantt, activities (creation + input), tasks and resources, inspections (3-tab detail + planning + form), complete 5-step NC wizard with signature, quality control plans, CFSI, costed corrective actions, document library, traceability and statistics (2 tabs). Over 500 companies in 6 countries trust INSPECTO DQI. Explore freely!",
    delayAfter:6000, endDemo:true },
]
