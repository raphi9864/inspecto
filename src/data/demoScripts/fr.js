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
    text:"Bonjour et bienvenue\u00a0! Je suis votre guide INSPECTO DQI. Au cours de cette démonstration, je vais vous présenter l'ensemble des fonctionnalités de notre plateforme de gestion qualité industrielle. Je navigue, je clique, je remplis les formulaires \u2014 tout est automatisé pour vous montrer le produit en conditions réelles. Plus de 500 entreprises dans 6 pays nous font déjà confiance. C'est parti\u00a0!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Voici votre tableau de bord. Dès la connexion, vous visualisez en un coup d'œil l'état de tous vos projets qualité. Fini les fichiers Excel dispersés et les emails de suivi.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"Quatre indicateurs clés en temps réel\u00a0: 7 projets actifs, 388 inspections réalisées, 108 non-conformités détectées et 35 actions correctives en cours. Chaque chiffre est cliquable pour accéder au détail.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Vos projets en cours avec leur progression et les alertes associées. Un retard sur un livrable\u00a0? Vous le voyez immédiatement ici.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Les tâches entrantes avec leur statut et leur échéance. Chaque membre de l'équipe sait exactement ce qu'il doit faire et quand.", delayAfter:2400 },

  // ── Settings : 3 onglets ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Les paramètres se configurent en trois onglets. La plateforme s'adapte à votre organisation, pas l'inverse.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Configuration générale\u00a0: nom de l'entreprise, fuseau horaire, logo. Votre identité est partout dans les rapports générés.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formulaires\u00a0: créez vos propres templates d'inspection avec des champs personnalisés. Chaque secteur a ses exigences \u2014 nucléaire, aéronautique, défense \u2014 et INSPECTO s'y adapte.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifications\u00a0: configurez les alertes email pour chaque événement. Une NC détectée, une action en retard, une inspection planifiée \u2014 votre équipe est informée automatiquement.", highlightBefore:true, delayAfter:2400 },

  // ── Team : invite un membre ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Gestion d'équipe\u00a0: 7 membres avec des rôles différenciés \u2014 Administrateur, Inspecteur, Viewer. Chacun accède uniquement à ce qui le concerne.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Chaque membre affiche ses statistiques personnelles\u00a0: inspections réalisées et non-conformités détectées. La performance individuelle est traçable.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Ajouter un collaborateur prend quelques secondes.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Je saisis l'adresse email du nouveau membre\u2026", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invitation envoyée\u00a0! Le collaborateur reçoit un email avec un lien d'accès sécurisé.", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projets + Activités (création) + Tâches + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projets : liste + dashboard projet ──
  { id:'2-0', phase:2, phaseTitle:'Projets', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Voici la liste de vos projets industriels. Chaque projet regroupe ses activités, inspections, non-conformités et actions dans un espace dédié.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"J'ouvre un projet pour afficher son tableau de bord dédié.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"Quatre KPIs par projet\u00a0: progression globale, actions en cours, inspections planifiées et non-conformités ouvertes. Tout est visible en un instant.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Le diagramme de Gantt interactif vous donne une vue chronologique de toutes les activités avec leurs barres de progression. Vous identifiez immédiatement les retards.", delayAfter:3000 },

  // ── Activités : + NEW + typing + save ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestion des activités. Planifiez et coordonnez les tâches de plusieurs équipes et sites grâce à l'allocation intelligente des ressources. Je vais en créer une.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"Quatre activités existantes\u00a0: Design, Procurement, Production et Pré-production. Chacune avec ses dates, responsables et pourcentage d'avancement.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Je clique sur le bouton d'ajout pour créer une nouvelle activité.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Je saisis le nom\u00a0: Design review \u2014 Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Sauvegardé\u00a0! L'activité apparaît instantanément dans le tableau avec ses paramètres par défaut.", delayAfter:1600 },

  // ── Tâches & Ressources ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tâches et ressources\u00a0: chaque tâche est assignée à un collaborateur avec une priorité et un délai. Le système détecte automatiquement les conflits de planning.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Statut, priorité et barre de progression pour chaque tâche. Les items en retard sont signalés en rouge.", delayAfter:2400 },

  // ── Gantt global ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Le Gantt global affiche toutes les activités sur une timeline unifiée. Vous coordonnez des opérations qualité complexes sur plusieurs projets simultanément.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspections : compteurs, détail 3 onglets, plan, formulaire
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspections', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspections gérées sur cette instance. Je vais vous montrer la consultation, la planification et le remplissage d'un formulaire.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Les compteurs synthétisent l'état\u00a0: inspections en cours, en retard, en attente de validation et clôturées. Un coup d'œil suffit pour identifier les urgences.", delayAfter:2000 },

  // Clic row → détail avec 3 onglets
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre le détail d'une inspection.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Premier onglet \u2014 Informations\u00a0: référence, dates prévues et réelles, localisation géolocalisée, équipe assignée. Toute l'information contextuelle de l'inspection.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Deuxième onglet \u2014 Findings\u00a0: les non-conformités détectées pendant cette inspection. Chaque NC est liée à sa zone, son événement et son niveau de criticité.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Troisième onglet \u2014 Formulaire\u00a0: la checklist des points de contrôle à remplir sur le terrain, compatible mobile et tablette, même hors connexion.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Retour à la liste.", delayAfter:1000 },

  // + NEW INSPECTION → plan + typing titre
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Je planifie une nouvelle inspection.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titre\u00a0: Audit ISO 9001 \u2014 Site Paris. Le système génère automatiquement une référence unique.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Localisation géolocalisée\u00a0: le lieu de l'inspection est positionné sur la carte, ce qui facilite la coordination terrain.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Équipe assignée\u00a0: S. Dupont et J. Martin. Ils recevront une notification automatique.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Inspection planifiée\u00a0! Elle apparaît dans le calendrier de l'équipe.", delayAfter:1200 },

  // + FILL A FORM → détail auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Je remplis maintenant un formulaire d'inspection. C'est le cœur de la numérisation \u2014 fini le papier.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Les données sont pré-remplies automatiquement à partir du contexte projet. Le gain de temps est considérable.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Passons à la gestion des non-conformités.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC wizard 5 étapes + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC : wizard complet 5 étapes ──
  { id:'4-0', phase:4, phaseTitle:'Qualité', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Les non-conformités. C'est ici que la vraie valeur d'INSPECTO se révèle. Je vais parcourir le wizard complet en 5 étapes\u00a0: de la détection à la signature.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"Je crée une nouvelle NC. Le wizard guidé s'ouvre.", highlightBefore:true, delayAfter:1600 },

  // Étape 1 : Informations
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Étape 1 sur 5 \u2014 Informations\u00a0: inspection liée, référence, zone concernée, type d'événement et niveau de criticité. Chaque NC est structurée pour permettre l'analyse statistique.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Je décris le problème\u00a0: certificat de conformité non signé par le responsable qualité, document manquant dans le dossier de lot numéro 42.", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Statut en cours de traitement, criticité mineure. Les toggles permettent de marquer une Lesson Learnt ou d'antidater le rapport si nécessaire.", delayAfter:2000 },

  // Étape 2 : Photos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 2 sur 5 \u2014 Photos. Importez des photos terrain et annotez directement sur l'image\u00a0: cercles, flèches, texte. La preuve visuelle est intégrée au dossier.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Photo terrain importée. On peut encercler les défauts et ajouter des annotations. Tout est horodaté et traçable.", delayAfter:3000 },

  // Étape 3 : Cause (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 3 sur 5 \u2014 Analyse des causes. La méthode des 5 Pourquoi permet de remonter à la cause racine. Les méthodes 8D et Ishikawa sont également disponibles.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Chaque \u00ab\u00a0Pourquoi\u00a0\u00bb est documenté et peut déclencher directement une action corrective. L'analyse alimente automatiquement le retour d'expérience.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"Méthode 8D\u00a0: 8 disciplines structurées. La cause racine est identifiée en D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Diagramme Ishikawa\u00a0: 6 branches cause-effet. Matière, Méthode, Milieu, Matériel, Main d\u2019\u0153uvre, Management.", highlightBefore:true, delayAfter:2400 },

  // Étape 4 : Résolution
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 4 sur 5 \u2014 Résolution. Vérification que toutes les actions correctives liées ont été exécutées et sont efficaces.", highlightBefore:true, delayAfter:2400 },

  // Étape 5 : Signature
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Étape 5 sur 5 \u2014 Signature. Le document peut être signé électroniquement, clôturé ou sauvegardé en brouillon. La signature verrouille le dossier.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Je signe. La NC est validée et verrouillée. Plus aucune modification possible \u2014 c'est la garantie de l'intégrité documentaire.", highlightBefore:true, delayAfter:2000 },

  // ── QCP : liste + détail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Plan de Contrôle Qualité. Chaque opération de fabrication est détaillée avec ses critères d'acceptation et ses rôles.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"J'ouvre un plan de contrôle pour voir le détail.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Pour chaque opération\u00a0: type de contrôle, critères d'acceptation, références normatives, rôles Contractor, Client et Tiers, et signatures requises. Conforme aux exigences ISO 19443 et AS/EN 9100.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Retour à la liste.", delayAfter:800 },

  // ── CFSI : formulaire complet ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI \u2014 Conformité Fournisseurs et Sous-traitants Industriels. Étendez le contrôle qualité à l'ensemble de votre chaîne d'approvisionnement.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informations générales, notices pratiques, photos de contrôle, zone de signature et clôture. Tout le suivi fournisseur en un seul endroit.", delayAfter:3600 },

  // ── RFF : Rapport de Fin de Fabrication ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Rapport de Fin de Fabrication \u2014 généré automatiquement depuis les données qualité du projet.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspections, non-conformités et actions correctives consolidées dans un seul document prêt à transmettre au client.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 zones de signature\u00a0: Responsable Qualité, Client, Tiers. La validation est formelle et traçable.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"Génération PDF en un clic\u00a0! Le document est prêt à être envoyé ou archivé.", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Actions : création complète + coûts
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Actions', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Actions correctives et préventives. Chaque problème détecté se transforme en action concrète avec un responsable, un délai et un coût.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Les compteurs montrent l'état des actions\u00a0: ouvertes, en cours, en retard et clôturées. Les retards sont immédiatement visibles.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tableau complet\u00a0: assignation, deadline, priorité et NC liée. La traçabilité action-NC est automatique.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Je crée une action corrective.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Titre de l'action\u00a0: faire signer le document et recycler le personnel.", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Type corrective ou préventive, assignation à un responsable, deadline, et surtout le chiffrage\u00a0: 50 euros par heure, multiplié par 24 heures, soit 1\u00a0200 euros. Le coût de la non-qualité est tracé. Le suivi d'efficacité est intégré.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Action créée et enregistrée.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Bibliothèque + Traçabilité + Stats (2 onglets) + Conclusion
     ═══════════════════════════════════════════════════════════ */
  // ── Documentation ──
  { id:'6-0', phase:6, phaseTitle:'Bibliothèque', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"La bibliothèque documentaire centralise tous vos documents qualité.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Dossiers organisés par projet. Sélectionnez plusieurs documents pour générer un rapport de fin de fabrication en un clic. Fini l'assemblage manuel.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Je crée un nouveau dossier pour organiser les documents.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Je nomme le dossier\u2026", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Dossier créé\u00a0!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"J'ajoute un document au dossier.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Glisser-déposer ou import fichier. Formats acceptés\u00a0: PDF, Word, Excel et images.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Document ajouté à la bibliothèque avec ses métadonnées et son historique de versions.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Je sélectionne plusieurs documents pour l'export groupé\u2026", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Sélection multiple activée.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Je génère le rapport documentaire. Assemblage automatique en un clic\u00a0!", highlightBefore:true, delayAfter:3000 },

  // ── Traçabilité ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Traçabilité complète. Une timeline qui retrace chaque action\u00a0: qui a fait quoi, quand et pourquoi. C'est votre piste d'audit pour les certifications ISO.", delayAfter:3000 },

  // ── Statistiques : 2 onglets ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiques\u00a0: 1\u00a0393 inspections analysées sur 4 ans. Transformez vos données brutes en informations exploitables.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Onglet Général\u00a0: distribution temporelle, histogrammes, taux de conformité. Identifiez les tendances et anticipez les problèmes.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Onglet Findings\u00a0: répartition des non-conformités par criticité, par zone et par tendance. L'analyse prédictive vous aide à concentrer vos efforts là où ça compte.", highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 7 — Module CAE Vidéo 1 (COMMENTÉ — À ACTIVER PLUS TARD)
     Apparaît uniquement pour certains projets sélectionnés.
     Intégrera une vidéo de démonstration CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'7-0', phase:7, phaseTitle:'CAE Module 1', type:'navigate', route:'/app/cae-module-1', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-1-page"]',
  //   speak:"Module CAE — Vidéo de démonstration à venir.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 8 — Module CAE Vidéo 2 (COMMENTÉ — À ACTIVER PLUS TARD)
     Apparaît uniquement pour certains projets sélectionnés.
     Intégrera une deuxième vidéo de démonstration CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'8-0', phase:8, phaseTitle:'CAE Module 2', type:'navigate', route:'/app/cae-module-2', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-2-page"]',
  //   speak:"Module CAE — Deuxième vidéo de démonstration à venir.", delayAfter:1500 },

  // ── Conclusion ──
  { id:'6-end', phase:6, type:'speak',
    text:"La présentation est terminée\u00a0! Vous venez de découvrir l'ensemble des fonctionnalités d'INSPECTO DQI\u00a0: tableau de bord avec KPIs temps réel, paramétrage flexible, gestion d'équipe, projets avec diagramme de Gantt, activités et tâches, inspections numériques avec formulaires terrain, wizard de non-conformité complet en 5 étapes avec analyse de causes et signature électronique, plans de contrôle qualité, suivi fournisseurs CFSI, actions correctives chiffrées, bibliothèque documentaire, traçabilité complète et statistiques avancées. Plus de 500 entreprises dans 6 pays font confiance à INSPECTO DQI pour digitaliser leur gestion qualité. Explorez librement la plateforme ou demandez une démonstration personnalisée\u00a0!",
    delayAfter:6000, endDemo:true },
]
