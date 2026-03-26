/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: Italiano (IT)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Impostazioni (3 schede) + Team (invito)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configurazione', type:'speak',
    text:"Buongiorno! Sono la vostra guida INSPECTO DQI. Vi mostrer\u00f2 ogni funzionalit\u00e0 della piattaforma. Clicco, digito, compilo i moduli \u2014 tutto \u00e8 automatizzato. Iniziamo!", delayAfter:800 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"La Dashboard: 4 KPI in tempo reale.", delayAfter:1500 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 progetti, 388 ispezioni, 108 non conformit\u00e0, 35 azioni correttive.", delayAfter:1500 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Progetti in corso con avanzamento e avvisi.", delayAfter:1200 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Attivit\u00e0 in arrivo con stato e scadenza.", delayAfter:1200 },

  // ── Impostazioni: 3 schede ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Impostazioni: 3 schede di configurazione.", delayAfter:1000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Generale: nome, fuso orario, logo aziendale.", highlightBefore:true, delayAfter:1200 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Moduli: template di ispezione e tipi di campo personalizzati.", highlightBefore:true, delayAfter:1200 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifiche: avvisi email per ogni evento.", highlightBefore:true, delayAfter:1200 },

  // ── Team: invito di un membro ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Team: 7 membri con ruoli Admin, Ispettore, Viewer.", delayAfter:1200 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Ogni membro mostra le proprie statistiche: ispezioni effettuate e NC rilevate.", delayAfter:1200 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Invito un nuovo membro.", highlightBefore:true, delayAfter:800 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Digito l'email\u2026", delayAfter:600 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invito inviato!", delayAfter:600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Progetti + Attivit\u00e0 (creazione) + Compiti + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Progetti: lista + dashboard progetto ──
  { id:'2-0', phase:2, phaseTitle:'Progetti', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Lista dei progetti industriali.", delayAfter:1200 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Apro il progetto per vederne la dashboard.", highlightBefore:true, delayAfter:1200 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"4 KPI di progetto: avanzamento, azioni, ispezioni, NC.", delayAfter:1200 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Diagramma di Gantt interattivo con attivit\u00e0 e barre di avanzamento.", delayAfter:1500 },

  // ── Attivit\u00e0: + NEW + digitazione + salvataggio ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestione delle attivit\u00e0. Ne creer\u00f2 una.", delayAfter:1000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 attivit\u00e0 esistenti: Design, Procurement, Production, Pre-production.", delayAfter:1200 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Clicco + NEW ACTIVITY.", highlightBefore:true, delayAfter:800 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Digito il nome: Design review \u2014 Phase 2.", delayAfter:600 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Salvato! L'attivit\u00e0 appare nella tabella.", delayAfter:800 },

  // ── Compiti e Risorse ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Compiti e Risorse: assegnazione per persona con priorit\u00e0.", delayAfter:1200 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Stato, priorit\u00e0, barra di avanzamento per ogni compito.", delayAfter:1200 },

  // ── Gantt globale ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gantt globale: tutte le attivit\u00e0 su una timeline.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Ispezioni: contatori, dettaglio 3 schede, piano, modulo
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Ispezioni', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 ispezioni. Vi mostrer\u00f2 tutto.", delayAfter:1200 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Contatori: in corso, in ritardo, in attesa, chiuse.", delayAfter:1000 },

  // Clic riga \u2192 dettaglio con 3 schede
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Apro un'ispezione.", highlightBefore:true, delayAfter:1000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Scheda Informazioni: riferimento, date, localizzazione, team.", highlightBefore:true, delayAfter:1500 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Scheda Findings / NC: non conformit\u00e0 rilevate.", highlightBefore:true, delayAfter:1500 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Scheda Modulo: checklist dei punti di controllo.", highlightBefore:true, delayAfter:1500 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Torno alla lista.", delayAfter:500 },

  // + NUOVA ISPEZIONE \u2192 piano + digitazione titolo
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Pianifico un'ispezione.", highlightBefore:true, delayAfter:800 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titolo: Audit ISO 9001 \u2014 Sito di Parigi.", delayAfter:600 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Posizione geolocalizzata.", delayAfter:1000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Team: S. Dupont e J. Martin.", delayAfter:1000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Pianificata!", delayAfter:600 },

  // + COMPILA UN MODULO \u2192 dettaglio auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Compilo un modulo di ispezione.", highlightBefore:true, delayAfter:1000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Dati pre-compilati automaticamente.", delayAfter:1200 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Passiamo alle non conformit\u00e0.", delayAfter:400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Wizard NC 5 fasi + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: wizard completo 5 fasi ──
  { id:'4-0', phase:4, phaseTitle:'Qualit\u00e0', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Non conformit\u00e0. Percorrer\u00f2 il wizard completo in 5 fasi.", delayAfter:1000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. Il wizard si apre.", highlightBefore:true, delayAfter:800 },

  // Fase 1: Informazioni
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Fase 1/5 \u2014 Informazioni: ispezione, riferimento, zona, evento, criticit\u00e0.", delayAfter:1200 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Digito la descrizione del problema\u2026", delayAfter:800 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Stato Ongoing, criticit\u00e0 Minor. Toggle: Lesson Learnt, Report date.", delayAfter:1000 },

  // Fase 2: Foto
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 2/5 \u2014 Foto. Importazione e annotazione diretta sull'immagine.", highlightBefore:true, delayAfter:1000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Foto dal campo importata. Si possono cerchiare i difetti e annotare.", delayAfter:1500 },

  // Fase 3: Causa (5-Why)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 3/5 \u2014 Analisi delle cause. Metodo 5 Perch\u00e9.", highlightBefore:true, delayAfter:1000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Ogni \u00abPerch\u00e9\u00bb \u00e8 documentato e innesca un'azione correttiva.", delayAfter:1200 },

  // Fase 4: Risoluzione
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 4/5 \u2014 Risoluzione. Verifica delle azioni correttive collegate.", highlightBefore:true, delayAfter:1200 },

  // Fase 5: Firma
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 5/5 \u2014 Firma. Il documento pu\u00f2 essere firmato, chiuso o salvato.", highlightBefore:true, delayAfter:1000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Firmo. NC validata e bloccata!", highlightBefore:true, delayAfter:1000 },

  // ── QCP: lista + dettaglio ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Piano di Controllo Qualit\u00e0 (QCP). Ogni operazione dettagliata.", delayAfter:1200 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Apro un piano di controllo.", highlightBefore:true, delayAfter:1200 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Operazioni: tipo di controllo, criteri, riferimenti, ruoli Contractor/Client/Terzi, firme.", delayAfter:1500 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Indietro.", delayAfter:400 },

  // ── CFSI: modulo completo ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI: Conformit\u00e0 Fornitori e Subappaltatori.", delayAfter:1200 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informazioni generali, avvisi pratici, foto di controllo, area firma e chiusura.", delayAfter:1800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Azioni: creazione completa + costi
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Azioni', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Azioni correttive e preventive.", delayAfter:1000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Contatori: aperte, in corso, in ritardo, chiuse.", delayAfter:1000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tabella delle azioni con assegnatario, scadenza, priorit\u00e0 e NC collegata.", delayAfter:1200 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Creo un'azione correttiva.", highlightBefore:true, delayAfter:800 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Digito il titolo\u2026", delayAfter:600 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Tipo (Correttiva/Preventiva), assegnatario, scadenza, costo: 50\u00a0\u20ac \u00d7 24h = 1.200\u00a0\u20ac. Monitoraggio dell'efficacia integrato.", delayAfter:2500 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Azione creata.", delayAfter:500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Libreria + Tracciabilit\u00e0 + Statistiche (2 schede) + Conclusione
     ═══════════════════════════════════════════════════════════ */
  // ── Documentazione ──
  { id:'6-0', phase:6, phaseTitle:'Libreria', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Libreria documentale.", delayAfter:1000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Cartelle organizzate per progetto. Selezione multipla per generare un report.", delayAfter:1500 },

  // ── Tracciabilit\u00e0 ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Tracciabilit\u00e0: timeline completa. Chi, cosa, quando.", delayAfter:1500 },

  // ── Statistiche: 2 schede ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiche: 1.393 ispezioni analizzate in 4 anni.", delayAfter:1000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Scheda Generale: distribuzione temporale, istogrammi, tasso di conformit\u00e0.", highlightBefore:true, delayAfter:1500 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Scheda Findings / NC: ripartizione per criticit\u00e0, zona e tendenza.", highlightBefore:true, delayAfter:1500 },

  // ── Conclusione ──
  { id:'6-end', phase:6, type:'speak',
    text:"La presentazione \u00e8 terminata! Avete appena visto TUTTE le funzionalit\u00e0: dashboard con KPI, impostazioni (3 schede), gestione del team con inviti, progetti con Gantt, attivit\u00e0 (creazione + inserimento), compiti e risorse, ispezioni (dettaglio 3 schede + pianificazione + modulo), wizard NC completo in 5 fasi con firma, piani di controllo qualit\u00e0, CFSI, azioni correttive con costi, libreria documentale, tracciabilit\u00e0 e statistiche (2 schede). Oltre 500 aziende in 6 paesi si affidano a INSPECTO DQI. Esplorate liberamente!",
    delayAfter:3000, endDemo:true },
]
