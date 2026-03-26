/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 */
export const DEMO_SCRIPT = [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Settings (3 tabs) + Team (invite)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configuration', type:'speak',
    text:"Bonjour\u00a0! Je suis votre guide INSPECTO DQI. Je vais vous montrer chaque fonctionnalit\u00e9 de la plateforme. Je clique, je tape, je remplis les formulaires \u2014 tout est automatis\u00e9. C'est parti\u00a0!", delayAfter:800 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Le Dashboard\u00a0: 4 KPIs en temps r\u00e9el.", delayAfter:1500 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 projets, 388 inspections, 108 non-conformit\u00e9s, 35 actions correctives.", delayAfter:1500 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Projets en cours avec progression et alertes.", delayAfter:1200 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"T\u00e2ches entrantes avec statut et \u00e9ch\u00e9ance.", delayAfter:1200 },

  // ── Settings : 3 onglets ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Param\u00e8tres\u00a0: 3 onglets de configuration.", delayAfter:1000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"G\u00e9n\u00e9ral\u00a0: nom, fuseau horaire, logo entreprise.", highlightBefore:true, delayAfter:1200 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formulaires\u00a0: templates d'inspection et types de champs personnalis\u00e9s.", highlightBefore:true, delayAfter:1200 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifications\u00a0: alertes email pour chaque \u00e9v\u00e9nement.", highlightBefore:true, delayAfter:1200 },

  // ── Team : invite un membre ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"\u00c9quipes\u00a0: 7 membres avec r\u00f4les Admin, Inspecteur, Viewer.", delayAfter:1200 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Chaque membre affiche ses statistiques\u00a0: inspections r\u00e9alis\u00e9es et NC d\u00e9tect\u00e9es.", delayAfter:1200 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"J'invite un nouveau membre.", highlightBefore:true, delayAfter:800 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Je tape l'email\u2026", delayAfter:600 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invitation envoy\u00e9e\u00a0!", delayAfter:600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projets + Activit\u00e9s (cr\u00e9ation) + T\u00e2ches + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projets : liste + dashboard projet ──
  { id:'2-0', phase:2, phaseTitle:'Projets', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Liste des projets industriels.", delayAfter:1200 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"J'ouvre le projet pour voir son dashboard.", highlightBefore:true, delayAfter:1200 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"4 KPIs projet\u00a0: progression, actions, inspections, NC.", delayAfter:1200 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Gantt interactif avec activit\u00e9s et barres de progression.", delayAfter:1500 },

  // ── Activit\u00e9s : + NEW + typing + save ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestion des activit\u00e9s. Je vais en cr\u00e9er une.", delayAfter:1000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 activit\u00e9s existantes\u00a0: Design, Procurement, Production, Pr\u00e9-production.", delayAfter:1200 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Je clique + NEW ACTIVITY.", highlightBefore:true, delayAfter:800 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Je tape le nom\u00a0: Design review \u2014 Phase 2.", delayAfter:600 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Sauvegard\u00e9\u00a0! L'activit\u00e9 appara\u00eet dans le tableau.", delayAfter:800 },

  // ── T\u00e2ches & Ressources ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"T\u00e2ches et Ressources\u00a0: allocation par personne avec priorit\u00e9.", delayAfter:1200 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Statut, priorit\u00e9, barre de progression pour chaque t\u00e2che.", delayAfter:1200 },

  // ── Gantt global ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gantt global\u00a0: toutes les activit\u00e9s sur une timeline.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspections : compteurs, d\u00e9tail 3 onglets, plan, formulaire
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspections', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspections. Je vais tout montrer.", delayAfter:1200 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Compteurs\u00a0: en cours, en retard, en attente, cl\u00f4tur\u00e9es.", delayAfter:1000 },

  // Clic row → d\u00e9tail avec 3 onglets
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre une inspection.", highlightBefore:true, delayAfter:1000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Onglet Informations\u00a0: r\u00e9f\u00e9rence, dates, localisation, \u00e9quipe.", highlightBefore:true, delayAfter:1500 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Onglet Findings / NC\u00a0: non-conformit\u00e9s d\u00e9tect\u00e9es.", highlightBefore:true, delayAfter:1500 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Onglet Formulaire\u00a0: checklist des points de contr\u00f4le.", highlightBefore:true, delayAfter:1500 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Retour \u00e0 la liste.", delayAfter:500 },

  // + NEW INSPECTION → plan + typing titre
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Je planifie une inspection.", highlightBefore:true, delayAfter:800 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titre\u00a0: Audit ISO 9001 \u2014 Site Paris.", delayAfter:600 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Localisation g\u00e9olocalis\u00e9e.", delayAfter:1000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"\u00c9quipe\u00a0: S. Dupont et J. Martin.", delayAfter:1000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Planifi\u00e9e\u00a0!", delayAfter:600 },

  // + FILL A FORM → d\u00e9tail auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Je remplis un formulaire d'inspection.", highlightBefore:true, delayAfter:1000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Donn\u00e9es pr\u00e9-remplies automatiquement.", delayAfter:1200 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Passons aux non-conformit\u00e9s.", delayAfter:400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC wizard 5 \u00e9tapes + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC : wizard complet 5 \u00e9tapes ──
  { id:'4-0', phase:4, phaseTitle:'Qualit\u00e9', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Non-conformit\u00e9s. Je vais parcourir le wizard complet en 5 \u00e9tapes.", delayAfter:1000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. Le wizard s'ouvre.", highlightBefore:true, delayAfter:800 },

  // \u00c9tape 1 : Informations
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"\u00c9tape 1/5 \u2014 Informations\u00a0: inspection, r\u00e9f\u00e9rence, zone, \u00e9v\u00e9nement, criticit\u00e9.", delayAfter:1200 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformit\u00e9 non sign\u00e9 par le responsable qualit\u00e9. Document manquant dans le dossier de lot n\u00b042.",
    clearFirst:true, speak:"Je tape la description du probl\u00e8me\u2026", delayAfter:800 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Statut Ongoing, criticit\u00e9 Minor. Toggles\u00a0: Lesson Learnt, Report date.", delayAfter:1000 },

  // \u00c9tape 2 : Photos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"\u00c9tape 2/5 \u2014 Photos. Import et annotation directe sur l'image.", highlightBefore:true, delayAfter:1000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Photo terrain import\u00e9e. On peut encercler les d\u00e9fauts et annoter.", delayAfter:1500 },

  // \u00c9tape 3 : Cause (5-Why)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"\u00c9tape 3/5 \u2014 Analyse des causes. M\u00e9thode 5 Pourquoi.", highlightBefore:true, delayAfter:1000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Chaque \u00ab Pourquoi \u00bb est document\u00e9 et d\u00e9clenche une action corrective.", delayAfter:1200 },

  // \u00c9tape 4 : R\u00e9solution
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"\u00c9tape 4/5 \u2014 R\u00e9solution. V\u00e9rification des actions correctives li\u00e9es.", highlightBefore:true, delayAfter:1200 },

  // \u00c9tape 5 : Signature
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"\u00c9tape 5/5 \u2014 Signature. Le document peut \u00eatre sign\u00e9, cl\u00f4tur\u00e9 ou sauvegard\u00e9.", highlightBefore:true, delayAfter:1000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Je signe. NC valid\u00e9e et verrouill\u00e9e\u00a0!", highlightBefore:true, delayAfter:1000 },

  // ── QCP : liste + d\u00e9tail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Plan de Contr\u00f4le Qualit\u00e9 (QCP). Chaque op\u00e9ration d\u00e9taill\u00e9e.", delayAfter:1200 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre un plan de contr\u00f4le.", highlightBefore:true, delayAfter:1200 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Op\u00e9rations\u00a0: type de contr\u00f4le, crit\u00e8res, r\u00e9f\u00e9rences, r\u00f4les Contractor/Client/Tiers, signatures.", delayAfter:1500 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Retour.", delayAfter:400 },

  // ── CFSI : formulaire complet ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI\u00a0: Conformit\u00e9 Fournisseurs et Sous-traitants.", delayAfter:1200 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informations g\u00e9n\u00e9rales, notices pratiques, photos de contr\u00f4le, zone de signature et cl\u00f4ture.", delayAfter:1800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Actions : cr\u00e9ation compl\u00e8te + co\u00fbts
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Actions', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Actions correctives et pr\u00e9ventives.", delayAfter:1000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Compteurs\u00a0: ouvertes, en cours, en retard, cl\u00f4tur\u00e9es.", delayAfter:1000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tableau des actions avec assignation, deadline, priorit\u00e9 et NC li\u00e9e.", delayAfter:1200 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Je cr\u00e9e une action corrective.", highlightBefore:true, delayAfter:800 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Je tape le titre\u2026", delayAfter:600 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Type (Corrective/Pr\u00e9ventive), assignation, deadline, co\u00fbt\u00a0: 50\u00a0\u20ac \u00d7 24h = 1\u00a0200\u00a0\u20ac. Suivi d'efficacit\u00e9 int\u00e9gr\u00e9.", delayAfter:2500 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Action cr\u00e9\u00e9e.", delayAfter:500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Biblioth\u00e8que + Tra\u00e7abilit\u00e9 + Stats (2 onglets) + Conclusion
     ═══════════════════════════════════════════════════════════ */
  // ── Documentation ──
  { id:'6-0', phase:6, phaseTitle:'Biblioth\u00e8que', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Biblioth\u00e8que documentaire.", delayAfter:1000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Dossiers organis\u00e9s par projet. S\u00e9lection multiple pour g\u00e9n\u00e9rer un rapport.", delayAfter:1500 },

  // ── Tra\u00e7abilit\u00e9 ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Tra\u00e7abilit\u00e9\u00a0: timeline compl\u00e8te. Qui, quoi, quand.", delayAfter:1500 },

  // ── Statistiques : 2 onglets ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiques\u00a0: 1\u00a0393 inspections analys\u00e9es sur 4 ans.", delayAfter:1000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Onglet G\u00e9n\u00e9ral\u00a0: distribution temporelle, histogrammes, taux de conformit\u00e9.", highlightBefore:true, delayAfter:1500 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Onglet Findings / NC\u00a0: r\u00e9partition par criticit\u00e9, zone et tendance.", highlightBefore:true, delayAfter:1500 },

  // ── Conclusion ──
  { id:'6-end', phase:6, type:'speak',
    text:"La pr\u00e9sentation est termin\u00e9e\u00a0! Vous venez de voir TOUTES les fonctionnalit\u00e9s\u00a0: dashboard avec KPIs, param\u00e8tres (3 onglets), gestion d'\u00e9quipe avec invitation, projets avec Gantt, activit\u00e9s (cr\u00e9ation + saisie), t\u00e2ches et ressources, inspections (3 onglets d\u00e9tail + planification + formulaire), wizard NC complet en 5 \u00e9tapes avec signature, plans de contr\u00f4le qualit\u00e9, CFSI, actions correctives chiffr\u00e9es, biblioth\u00e8que documentaire, tra\u00e7abilit\u00e9 et statistiques (2 onglets). Plus de 500 entreprises dans 6 pays font confiance \u00e0 INSPECTO DQI. Explorez librement\u00a0!",
    delayAfter:3000, endDemo:true },
]
