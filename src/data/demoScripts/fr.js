/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: Français (FR)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Settings (3 tabs) + Team (invite)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configuration', type:'speak',
    text:"Bonjour\u00a0! Je suis votre guide INSPECTO DQI. Je vais vous montrer chaque fonctionnalité de la plateforme. Je clique, je tape, je remplis les formulaires \u2014 tout est automatisé. C'est parti\u00a0!", delayAfter:800 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Le Dashboard\u00a0: 4 KPIs en temps réel.", delayAfter:1500 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 projets, 388 inspections, 108 non-conformités, 35 actions correctives.", delayAfter:1500 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Projets en cours avec progression et alertes.", delayAfter:1200 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Tâches entrantes avec statut et échéance.", delayAfter:1200 },

  // ── Settings : 3 onglets ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Paramètres\u00a0: 3 onglets de configuration.", delayAfter:1000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Général\u00a0: nom, fuseau horaire, logo entreprise.", highlightBefore:true, delayAfter:1200 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formulaires\u00a0: templates d'inspection et types de champs personnalisés.", highlightBefore:true, delayAfter:1200 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifications\u00a0: alertes email pour chaque événement.", highlightBefore:true, delayAfter:1200 },

  // ── Team : invite un membre ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Équipes\u00a0: 7 membres avec rôles Admin, Inspecteur, Viewer.", delayAfter:1200 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Chaque membre affiche ses statistiques\u00a0: inspections réalisées et NC détectées.", delayAfter:1200 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"J'invite un nouveau membre.", highlightBefore:true, delayAfter:800 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Je tape l'email\u2026", delayAfter:600 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invitation envoyée\u00a0!", delayAfter:600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projets + Activités (création) + Tâches + Gantt
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
    speak:"Gantt interactif avec activités et barres de progression.", delayAfter:1500 },

  // ── Activités : + NEW + typing + save ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestion des activités. Je vais en créer une.", delayAfter:1000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 activités existantes\u00a0: Design, Procurement, Production, Pré-production.", delayAfter:1200 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Je clique + NEW ACTIVITY.", highlightBefore:true, delayAfter:800 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Je tape le nom\u00a0: Design review \u2014 Phase 2.", delayAfter:600 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Sauvegardé\u00a0! L'activité apparaît dans le tableau.", delayAfter:800 },

  // ── Tâches & Ressources ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tâches et Ressources\u00a0: allocation par personne avec priorité.", delayAfter:1200 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Statut, priorité, barre de progression pour chaque tâche.", delayAfter:1200 },

  // ── Gantt global ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gantt global\u00a0: toutes les activités sur une timeline.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspections : compteurs, détail 3 onglets, plan, formulaire
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspections', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspections. Je vais tout montrer.", delayAfter:1200 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Compteurs\u00a0: en cours, en retard, en attente, clôturées.", delayAfter:1000 },

  // Clic row → détail avec 3 onglets
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre une inspection.", highlightBefore:true, delayAfter:1000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Onglet Informations\u00a0: référence, dates, localisation, équipe.", highlightBefore:true, delayAfter:1500 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Onglet Findings / NC\u00a0: non-conformités détectées.", highlightBefore:true, delayAfter:1500 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Onglet Formulaire\u00a0: checklist des points de contrôle.", highlightBefore:true, delayAfter:1500 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Retour à la liste.", delayAfter:500 },

  // + NEW INSPECTION → plan + typing titre
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Je planifie une inspection.", highlightBefore:true, delayAfter:800 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titre\u00a0: Audit ISO 9001 \u2014 Site Paris.", delayAfter:600 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Localisation géolocalisée.", delayAfter:1000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Équipe\u00a0: S. Dupont et J. Martin.", delayAfter:1000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Planifiée\u00a0!", delayAfter:600 },

  // + FILL A FORM → détail auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Je remplis un formulaire d'inspection.", highlightBefore:true, delayAfter:1000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Données pré-remplies automatiquement.", delayAfter:1200 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Passons aux non-conformités.", delayAfter:400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC wizard 5 étapes + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC : wizard complet 5 étapes ──
  { id:'4-0', phase:4, phaseTitle:'Qualité', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Non-conformités. Je vais parcourir le wizard complet en 5 étapes.", delayAfter:1000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. Le wizard s'ouvre.", highlightBefore:true, delayAfter:800 },

  // Étape 1 : Informations
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Étape 1/5 \u2014 Informations\u00a0: inspection, référence, zone, événement, criticité.", delayAfter:1200 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Je tape la description du problème\u2026", delayAfter:800 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Statut Ongoing, criticité Minor. Toggles\u00a0: Lesson Learnt, Report date.", delayAfter:1000 },

  // Étape 2 : Photos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 2/5 \u2014 Photos. Import et annotation directe sur l'image.", highlightBefore:true, delayAfter:1000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Photo terrain importée. On peut encercler les défauts et annoter.", delayAfter:1500 },

  // Étape 3 : Cause (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 3/5 \u2014 Analyse des causes. 3 méthodes disponibles : 5 Pourquoi, 8D et Ishikawa.", highlightBefore:true, delayAfter:1000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Chaque \u00ab Pourquoi \u00bb est documenté et déclenche une action corrective.", delayAfter:1200 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"Méthode 8D : 8 disciplines structurées. La cause racine est identifiée en D4.", highlightBefore:true, delayAfter:1000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Diagramme Ishikawa : 6 branches cause-effet. Matière, Méthode, Milieu, Matériel, Main d\u2019\u0153uvre, Management.", highlightBefore:true, delayAfter:1200 },

  // Étape 4 : Résolution
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 4/5 \u2014 Résolution. Vérification des actions correctives liées.", highlightBefore:true, delayAfter:1200 },

  // Étape 5 : Signature
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 5/5 \u2014 Signature. Le document peut être signé, clôturé ou sauvegardé.", highlightBefore:true, delayAfter:1000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Je signe. NC validée et verrouillée\u00a0!", highlightBefore:true, delayAfter:1000 },

  // ── QCP : liste + détail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Plan de Contrôle Qualité (QCP). Chaque opération détaillée.", delayAfter:1200 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre un plan de contrôle.", highlightBefore:true, delayAfter:1200 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Opérations\u00a0: type de contrôle, critères, références, rôles Contractor/Client/Tiers, signatures.", delayAfter:1500 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Retour.", delayAfter:400 },

  // ── CFSI : formulaire complet ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI\u00a0: Conformité Fournisseurs et Sous-traitants.", delayAfter:1200 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informations générales, notices pratiques, photos de contrôle, zone de signature et clôture.", delayAfter:1800 },

  // ── RFF : Rapport de Fin de Fabrication ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Rapport de Fin de Fabrication \u2014 généré automatiquement depuis les données qualité.", delayAfter:1200 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspections, NC et actions correctives consolidées dans un seul document.", delayAfter:1500 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 zones de signature : Responsable Qualité, Client, Tiers.", delayAfter:1200 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"Génération PDF en un clic !", highlightBefore:true, delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Actions : création complète + coûts
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Actions', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Actions correctives et préventives.", delayAfter:1000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Compteurs\u00a0: ouvertes, en cours, en retard, clôturées.", delayAfter:1000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tableau des actions avec assignation, deadline, priorité et NC liée.", delayAfter:1200 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Je crée une action corrective.", highlightBefore:true, delayAfter:800 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Je tape le titre\u2026", delayAfter:600 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Type (Corrective/Préventive), assignation, deadline, coût\u00a0: 50\u00a0\u20ac \u00d7 24h = 1\u00a0200\u00a0\u20ac. Suivi d'efficacité intégré.", delayAfter:2500 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Action créée.", delayAfter:500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Bibliothèque + Traçabilité + Stats (2 onglets) + Conclusion
     ═══════════════════════════════════════════════════════════ */
  // ── Documentation ──
  { id:'6-0', phase:6, phaseTitle:'Bibliothèque', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Bibliothèque documentaire.", delayAfter:1000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Dossiers organisés par projet. Sélection multiple pour générer un rapport.", delayAfter:1500 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Je crée un nouveau dossier.", highlightBefore:true, delayAfter:800 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Je nomme le dossier\u2026", delayAfter:600 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Dossier créé\u00a0!", highlightBefore:true, delayAfter:800 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"J'ajoute un document.", highlightBefore:true, delayAfter:800 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Glisser-déposer ou import fichier. Formats\u00a0: PDF, Word, Excel.", delayAfter:1500 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Document ajouté à la bibliothèque avec métadonnées.", delayAfter:1200 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Je sélectionne plusieurs documents\u2026", delayAfter:1000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Sélection multiple activée.", delayAfter:1000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Je génère le rapport documentaire. Assemblage automatique en un clic\u00a0!", highlightBefore:true, delayAfter:1500 },

  // ── Traçabilité ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Traçabilité\u00a0: timeline complète. Qui, quoi, quand.", delayAfter:1500 },

  // ── Statistiques : 2 onglets ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiques\u00a0: 1\u00a0393 inspections analysées sur 4 ans.", delayAfter:1000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Onglet Général\u00a0: distribution temporelle, histogrammes, taux de conformité.", highlightBefore:true, delayAfter:1500 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Onglet Findings / NC\u00a0: répartition par criticité, zone et tendance.", highlightBefore:true, delayAfter:1500 },

  // ── Conclusion ──
  { id:'6-end', phase:6, type:'speak',
    text:"La présentation est terminée\u00a0! Vous venez de voir TOUTES les fonctionnalités\u00a0: dashboard avec KPIs, paramètres (3 onglets), gestion d'équipe avec invitation, projets avec Gantt, activités (création + saisie), tâches et ressources, inspections (3 onglets détail + planification + formulaire), wizard NC complet en 5 étapes avec signature, plans de contrôle qualité, CFSI, actions correctives chiffrées, bibliothèque documentaire, traçabilité et statistiques (2 onglets). Plus de 500 entreprises dans 6 pays font confiance à INSPECTO DQI. Explorez librement\u00a0!",
    delayAfter:3000, endDemo:true },
]
