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
    text:"Hello and welcome! I'm your INSPECTO DQI guide. During this demonstration, I'll walk you through every feature of our industrial quality management platform. I navigate, click, and fill in forms — everything is automated so you can see the product in real-world conditions. Over 500 companies across 6 countries already trust us. Let's get started!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Here's your dashboard. The moment you log in, you get a complete overview of all your quality projects at a glance. No more scattered Excel files and follow-up emails.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"Four key indicators in real time: 7 active projects, 388 inspections completed, 108 non-conformities detected, and 35 corrective actions in progress. Every number is clickable for detailed drill-down.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Your ongoing projects with their progress and associated alerts. A delay on a deliverable? You'll spot it right here.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Incoming tasks with their status and due date. Every team member knows exactly what to do and when.", delayAfter:2400 },

  // ── Settings: 3 tabs ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Settings are organized in three tabs. The platform adapts to your organization, not the other way around.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"General configuration: company name, timezone, logo. Your branding appears throughout every generated report.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Forms: create your own inspection templates with custom fields. Every industry has its requirements — nuclear, aerospace, defense — and INSPECTO adapts to each.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifications: configure email alerts for every event. An NC detected, an overdue action, a scheduled inspection — your team is notified automatically.", highlightBefore:true, delayAfter:2400 },

  // ── Team: invite a member ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Team management: 7 members with differentiated roles — Administrator, Inspector, Viewer. Each person only accesses what's relevant to them.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Each member displays their personal statistics: inspections completed and non-conformities detected. Individual performance is fully traceable.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Adding a team member takes just a few seconds.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"I enter the new member's email address…", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invitation sent! The team member receives an email with a secure access link.", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projects + Activities (creation) + Tasks + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projects: list + project dashboard ──
  { id:'2-0', phase:2, phaseTitle:'Projects', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Here's your list of industrial projects. Each project groups its activities, inspections, non-conformities, and actions in a dedicated workspace.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"I open a project to display its dedicated dashboard.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"Four KPIs per project: overall progress, actions in progress, planned inspections, and open non-conformities. Everything visible at a glance.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"The interactive Gantt chart gives you a chronological view of all activities with their progress bars. You can spot delays immediately.", delayAfter:3000 },

  // ── Activities: + NEW + typing + save ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Activity management. Plan and coordinate tasks across multiple teams and sites with intelligent resource allocation. Let me create one.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"Four existing activities: Design, Procurement, Production, and Pre-production. Each with its dates, owners, and completion percentage.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"I click the add button to create a new activity.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"I enter the name: Design review — Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Saved! The activity appears instantly in the table with its default parameters.", delayAfter:1600 },

  // ── Tasks & Resources ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tasks and resources: each task is assigned to a team member with a priority and a deadline. The system automatically detects scheduling conflicts.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Status, priority, and progress bar for each task. Overdue items are flagged in red.", delayAfter:2400 },

  // ── Global Gantt ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"The global Gantt displays all activities on a unified timeline. You can coordinate complex quality operations across multiple projects simultaneously.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspections: counters, 3-tab detail, plan, form
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspections', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspections managed on this instance. I'll show you how to browse, plan, and fill in an inspection form.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"The counters summarize the status: inspections in progress, overdue, pending validation, and closed. One glance is enough to identify urgent items.", delayAfter:2000 },

  // Click row → detail with 3 tabs
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"I open the detail view of an inspection.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"First tab — Information: reference, planned and actual dates, geolocated position, assigned team. All the contextual information for the inspection.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Second tab — Findings: non-conformities detected during this inspection. Each NC is linked to its zone, event type, and criticality level.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Third tab — Form: the control point checklist to be filled in on-site, compatible with mobile and tablet, even offline.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Back to the list.", delayAfter:1000 },

  // + NEW INSPECTION → plan + typing title
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"I'm planning a new inspection.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Title: ISO 9001 Audit — Paris Site. The system automatically generates a unique reference.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Geolocated position: the inspection site is pinned on the map, making field coordination easier.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Assigned team: S. Dupont and J. Martin. They'll receive an automatic notification.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Inspection planned! It now appears in the team's calendar.", delayAfter:1200 },

  // + FILL A FORM → auto detail
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Now I'm filling in an inspection form. This is the heart of digitization — no more paper.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Data is automatically pre-filled from the project context. The time savings are significant.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Let's move on to non-conformity management.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC wizard 5 steps + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: full 5-step wizard ──
  { id:'4-0', phase:4, phaseTitle:'Quality', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Non-conformities. This is where INSPECTO's true value shines. I'll walk through the complete 5-step wizard: from detection to signature.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"I create a new NC. The guided wizard opens.", highlightBefore:true, delayAfter:1600 },

  // Step 1: Information
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Step 1 of 5 — Information: linked inspection, reference, affected zone, event type, and criticality level. Each NC is structured for statistical analysis.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"I describe the issue: conformity certificate not signed by the quality manager, document missing from batch file number 42.", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Status set to ongoing, criticality minor. Toggles allow marking a Lesson Learnt or backdating the report if needed.", delayAfter:2000 },

  // Step 2: Photos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 2 of 5 — Photos. Import field photos and annotate directly on the image: circles, arrows, text. Visual evidence is embedded in the file.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Field photo imported. You can circle defects and add annotations. Everything is timestamped and traceable.", delayAfter:3000 },

  // Step 3: Root cause (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 3 of 5 — Root cause analysis. The 5 Whys method traces back to the root cause. 8D and Ishikawa methods are also available.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Each 'Why' is documented and can directly trigger a corrective action. The analysis automatically feeds the lessons learned database.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"8D Method: 8 structured disciplines. Root cause identified in D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Ishikawa diagram: 6 cause-effect branches. Material, Method, Environment, Equipment, Manpower, Management.", highlightBefore:true, delayAfter:2400 },

  // Step 4: Resolution
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 4 of 5 — Resolution. Verification that all linked corrective actions have been executed and are effective.", highlightBefore:true, delayAfter:2400 },

  // Step 5: Signature
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Step 5 of 5 — Signature. The document can be electronically signed, closed, or saved as draft. The signature locks the file.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"I sign. The NC is validated and locked. No further modifications possible — that's the guarantee of document integrity.", highlightBefore:true, delayAfter:2000 },

  // ── QCP: list + detail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Quality Control Plan. Each manufacturing operation is detailed with its acceptance criteria and roles.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"I open a control plan to see the details.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"For each operation: control type, acceptance criteria, regulatory references, Contractor, Client and Third-party roles, and required signatures. Compliant with ISO 19443 and AS/EN 9100 requirements.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Back to the list.", delayAfter:800 },

  // ── CFSI: full form ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI — Supplier and Subcontractor Compliance. Extend quality control across your entire supply chain.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"General information, practical notices, control photos, signature area, and closure. All supplier monitoring in one place.", delayAfter:3600 },

  // ── RFF: Manufacturing Completion Report ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Manufacturing Completion Report — automatically generated from the project's quality data.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspections, non-conformities, and corrective actions consolidated in a single document ready to deliver to the client.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 signature areas: Quality Manager, Client, Third Party. Validation is formal and traceable.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"PDF generation in one click! The document is ready to send or archive.", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Actions: full creation + costs
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Actions', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Corrective and preventive actions. Every detected problem becomes a concrete action with an owner, a deadline, and a cost.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"The counters show the status of actions: open, in progress, overdue, and closed. Delays are immediately visible.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Complete table: assignee, deadline, priority, and linked NC. Action-to-NC traceability is automatic.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"I'm creating a corrective action.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Action title: get the document signed and retrain the personnel.", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Corrective or preventive type, assigned to an owner, deadline, and most importantly the costing: 50 euros per hour, times 24 hours, totaling 1,200 euros. The cost of non-quality is tracked. Effectiveness follow-up is built in.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Action created and recorded.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Library + Traceability + Stats (2 tabs) + Conclusion
     ═══════════════════════════════════════════════════════════ */
  // ── Documentation ──
  { id:'6-0', phase:6, phaseTitle:'Library', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"The document library centralizes all your quality documents.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Folders organized by project. Select multiple documents to generate a manufacturing completion report in one click. No more manual assembly.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"I create a new folder to organize documents.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"I name the folder…", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Folder created!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"I add a document to the folder.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Drag and drop or file import. Accepted formats: PDF, Word, Excel, and images.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Document added to the library with its metadata and version history.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"I select multiple documents for batch export…", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Multiple selection enabled.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"I generate the document report. Automatic assembly in a single click!", highlightBefore:true, delayAfter:3000 },

  // ── Traceability ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Complete traceability. A timeline that traces every action: who did what, when, and why. This is your audit trail for ISO certifications.", delayAfter:3000 },

  // ── Statistics: 2 tabs ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistics: 1,393 inspections analyzed over 4 years. Turn your raw data into actionable insights.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"General tab: time distribution, histograms, compliance rate. Identify trends and anticipate problems.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Findings tab: non-conformity breakdown by criticality, zone, and trend. Predictive analysis helps you focus your efforts where they matter most.", highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 7 — Module CAE Vidéo 1 (COMMENTED — TO ACTIVATE LATER)
     Only appears for selected projects.
     Will integrate a CAE demo video.
     ═══════════════════════════════════════════════════════════ */
  // { id:'7-0', phase:7, phaseTitle:'CAE Module 1', type:'navigate', route:'/app/cae-module-1', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-1-page"]',
  //   speak:"CAE Module — Demo video coming soon.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 8 — Module CAE Vidéo 2 (COMMENTED — TO ACTIVATE LATER)
     Only appears for selected projects.
     Will integrate a second CAE demo video.
     ═══════════════════════════════════════════════════════════ */
  // { id:'8-0', phase:8, phaseTitle:'CAE Module 2', type:'navigate', route:'/app/cae-module-2', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-2-page"]',
  //   speak:"CAE Module — Second demo video coming soon.", delayAfter:1500 },

  // ── Conclusion ──
  { id:'6-end', phase:6, type:'speak',
    text:"The presentation is complete! You've just discovered the full range of INSPECTO DQI capabilities: real-time KPI dashboard, flexible configuration, team management, projects with Gantt charts, activities and tasks, digital inspections with field forms, complete 5-step non-conformity wizard with root cause analysis and electronic signature, quality control plans, CFSI supplier monitoring, costed corrective actions, document library, full traceability, and advanced statistics. Over 500 companies across 6 countries trust INSPECTO DQI to digitize their quality management. Feel free to explore the platform or request a personalized demonstration!",
    delayAfter:6000, endDemo:true },
]
