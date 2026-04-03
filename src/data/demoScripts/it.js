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
    text:"Buongiorno e benvenuti! Sono la vostra guida INSPECTO DQI. Nel corso di questa dimostrazione, vi presenterò tutte le funzionalità della nostra piattaforma di gestione qualità industriale. Navigo, clicco, compilo i moduli — tutto è automatizzato per mostrarvi il prodotto in condizioni reali. Oltre 500 aziende in 6 paesi si affidano già a noi. Iniziamo!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Ecco la vostra dashboard. Dal momento dell'accesso, visualizzate in un colpo d'occhio lo stato di tutti i vostri progetti qualità. Basta con i file Excel sparsi e le email di follow-up.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"Quattro indicatori chiave in tempo reale: 7 progetti attivi, 388 ispezioni effettuate, 108 non conformità rilevate e 35 azioni correttive in corso. Ogni cifra è cliccabile per accedere al dettaglio.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"I vostri progetti in corso con il loro avanzamento e le segnalazioni associate. Un ritardo su un deliverable? Lo vedete immediatamente qui.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Le attività in arrivo con il loro stato e la scadenza. Ogni membro del team sa esattamente cosa fare e quando.", delayAfter:2400 },

  // ── Impostazioni: 3 schede ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Le impostazioni si organizzano in tre schede. La piattaforma si adatta alla vostra organizzazione, non il contrario.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Configurazione generale: nome dell'azienda, fuso orario, logo. La vostra identità è presente in tutti i report generati.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Moduli: create i vostri template di ispezione con campi personalizzati. Ogni settore ha le sue esigenze — nucleare, aeronautica, difesa — e INSPECTO si adatta a ciascuno.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notifiche: configurate gli avvisi email per ogni evento. Una NC rilevata, un'azione in ritardo, un'ispezione programmata — il vostro team viene informato automaticamente.", highlightBefore:true, delayAfter:2400 },

  // ── Team: invito di un membro ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Gestione del team: 7 membri con ruoli differenziati — Amministratore, Ispettore, Viewer. Ciascuno accede solo a ciò che lo riguarda.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Ogni membro mostra le proprie statistiche personali: ispezioni effettuate e non conformità rilevate. Le performance individuali sono completamente tracciabili.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Aggiungere un collaboratore richiede pochi secondi.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Inserisco l'indirizzo email del nuovo membro…", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Invito inviato! Il collaboratore riceve un'email con un link di accesso sicuro.", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Progetti + Attività (creazione) + Compiti + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Progetti: lista + dashboard progetto ──
  { id:'2-0', phase:2, phaseTitle:'Progetti', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Ecco l'elenco dei vostri progetti industriali. Ogni progetto raggruppa le sue attività, ispezioni, non conformità e azioni in uno spazio dedicato.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Apro un progetto per visualizzare la sua dashboard dedicata.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"Quattro KPI per progetto: avanzamento globale, azioni in corso, ispezioni programmate e non conformità aperte. Tutto visibile in un istante.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Il diagramma di Gantt interattivo offre una vista cronologica di tutte le attività con le barre di avanzamento. I ritardi si individuano immediatamente.", delayAfter:3000 },

  // ── Attività: + NEW + digitazione + salvataggio ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestione delle attività. Pianificate e coordinate i compiti di più team e siti grazie all'allocazione intelligente delle risorse. Ne creo una.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"Quattro attività esistenti: Design, Procurement, Production e Pre-production. Ciascuna con le sue date, responsabili e percentuale di avanzamento.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Clicco sul pulsante di aggiunta per creare una nuova attività.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Inserisco il nome: Design review — Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Salvato! L'attività compare istantaneamente nella tabella con i parametri predefiniti.", delayAfter:1600 },

  // ── Compiti e Risorse ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Compiti e risorse: ogni compito è assegnato a un collaboratore con una priorità e una scadenza. Il sistema rileva automaticamente i conflitti di pianificazione.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Stato, priorità e barra di avanzamento per ogni compito. Gli elementi in ritardo sono evidenziati in rosso.", delayAfter:2400 },

  // ── Gantt globale ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Il Gantt globale visualizza tutte le attività su una timeline unificata. Coordinate operazioni qualità complesse su più progetti contemporaneamente.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Ispezioni: contatori, dettaglio 3 schede, piano, modulo
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Ispezioni', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 ispezioni gestite su questa istanza. Vi mostrerò la consultazione, la pianificazione e la compilazione di un modulo.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"I contatori sintetizzano lo stato: ispezioni in corso, in ritardo, in attesa di validazione e chiuse. Un colpo d'occhio basta per identificare le urgenze.", delayAfter:2000 },

  // Clic riga → dettaglio con 3 schede
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Apro il dettaglio di un'ispezione.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Prima scheda — Informazioni: riferimento, date previste e reali, localizzazione geolocalizzata, team assegnato. Tutte le informazioni contestuali dell'ispezione.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Seconda scheda — Findings: le non conformità rilevate durante questa ispezione. Ogni NC è collegata alla sua zona, evento e livello di criticità.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Terza scheda — Modulo: la checklist dei punti di controllo da compilare sul campo, compatibile con mobile e tablet, anche offline.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Torno alla lista.", delayAfter:1000 },

  // + NUOVA ISPEZIONE → piano + digitazione titolo
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Pianifico una nuova ispezione.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titolo: Audit ISO 9001 — Sito di Parigi. Il sistema genera automaticamente un riferimento univoco.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Localizzazione geolocalizzata: il luogo dell'ispezione è posizionato sulla mappa, facilitando il coordinamento sul campo.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Team assegnato: S. Dupont e J. Martin. Riceveranno una notifica automatica.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Ispezione pianificata! Compare nel calendario del team.", delayAfter:1200 },

  // + COMPILA UN MODULO → dettaglio auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Ora compilo un modulo di ispezione. È il cuore della digitalizzazione — basta con la carta.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"I dati vengono precompilati automaticamente dal contesto del progetto. Il risparmio di tempo è notevole.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Passiamo alla gestione delle non conformità.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Wizard NC 5 fasi + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: wizard completo 5 fasi ──
  { id:'4-0', phase:4, phaseTitle:'Qualità', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Le non conformità. È qui che si rivela il vero valore di INSPECTO. Percorrerò il wizard completo in 5 fasi: dal rilevamento alla firma.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"Creo una nuova NC. Il wizard guidato si apre.", highlightBefore:true, delayAfter:1600 },

  // Fase 1: Informazioni
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Fase 1 di 5 — Informazioni: ispezione collegata, riferimento, zona interessata, tipo di evento e livello di criticità. Ogni NC è strutturata per consentire l'analisi statistica.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Descrivo il problema: certificato di conformità non firmato dal responsabile qualità, documento mancante nel fascicolo del lotto numero 42.", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Stato in corso, criticità minore. I toggle permettono di contrassegnare una Lesson Learnt o di retrodatare il rapporto se necessario.", delayAfter:2000 },

  // Fase 2: Foto
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 2 di 5 — Foto. Importate foto dal campo e annotate direttamente sull'immagine: cerchi, frecce, testo. La prova visiva è integrata nel fascicolo.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Foto dal campo importata. Si possono cerchiare i difetti e aggiungere annotazioni. Tutto è registrato con data e ora ed è tracciabile.", delayAfter:3000 },

  // Fase 3: Causa (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 3 di 5 — Analisi delle cause. Il metodo dei 5 Perché risale alla causa radice. I metodi 8D e Ishikawa sono anch'essi disponibili.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Ogni «Perché» è documentato e può attivare direttamente un'azione correttiva. L'analisi alimenta automaticamente il database delle lezioni apprese.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"Metodo 8D: 8 discipline strutturate. La causa radice viene identificata in D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Diagramma Ishikawa: 6 rami causa-effetto. Materiale, Metodo, Ambiente, Attrezzatura, Manodopera, Management.", highlightBefore:true, delayAfter:2400 },

  // Fase 4: Risoluzione
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 4 di 5 — Risoluzione. Verifica che tutte le azioni correttive collegate siano state eseguite e risultino efficaci.", highlightBefore:true, delayAfter:2400 },

  // Fase 5: Firma
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Fase 5 di 5 — Firma. Il documento può essere firmato elettronicamente, chiuso o salvato come bozza. La firma blocca il fascicolo.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Firmo. La NC è validata e bloccata. Nessuna modifica successiva è possibile — è la garanzia dell'integrità documentale.", highlightBefore:true, delayAfter:2000 },

  // ── QCP: lista + dettaglio ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Piano di Controllo Qualità. Ogni operazione di fabbricazione è dettagliata con i criteri di accettazione e i ruoli.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Apro un piano di controllo per vederne il dettaglio.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Per ogni operazione: tipo di controllo, criteri di accettazione, riferimenti normativi, ruoli Contractor, Client e Terzi, e firme richieste. Conforme ai requisiti ISO 19443 e AS/EN 9100.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Torno alla lista.", delayAfter:800 },

  // ── CFSI: modulo completo ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI — Conformità Fornitori e Subappaltatori Industriali. Estendete il controllo qualità a tutta la vostra catena di fornitura.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informazioni generali, avvisi pratici, foto di controllo, area firma e chiusura. Tutto il monitoraggio fornitori in un unico posto.", delayAfter:3600 },

  // ── RFF: Rapporto di Fine Fabbricazione ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Rapporto di Fine Fabbricazione — generato automaticamente dai dati qualità del progetto.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Ispezioni, non conformità e azioni correttive consolidate in un unico documento pronto per la consegna al cliente.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 aree firma: Responsabile Qualità, Cliente, Terzi. La validazione è formale e tracciabile.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"Generazione PDF con un clic! Il documento è pronto per l'invio o l'archiviazione.", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Azioni: creazione completa + costi
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Azioni', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Azioni correttive e preventive. Ogni problema rilevato si trasforma in un'azione concreta con un responsabile, una scadenza e un costo.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"I contatori mostrano lo stato delle azioni: aperte, in corso, in ritardo e chiuse. I ritardi sono immediatamente visibili.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tabella completa: assegnazione, scadenza, priorità e NC collegata. La tracciabilità azione-NC è automatica.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Creo un'azione correttiva.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Titolo dell'azione: far firmare il documento e riqualificare il personale.", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Tipo correttiva o preventiva, assegnazione a un responsabile, scadenza, e soprattutto il costo: 50 euro l'ora, per 24 ore, totale 1.200 euro. Il costo della non qualità è tracciato. Il monitoraggio dell'efficacia è integrato.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Azione creata e registrata.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Libreria + Tracciabilità + Statistiche (2 schede) + Conclusione
     ═══════════════════════════════════════════════════════════ */
  // ── Documentazione ──
  { id:'6-0', phase:6, phaseTitle:'Libreria', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"La libreria documentale centralizza tutti i vostri documenti qualità.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Cartelle organizzate per progetto. Selezionate più documenti per generare un rapporto di fine fabbricazione con un clic. Basta con l'assemblaggio manuale.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Creo una nuova cartella per organizzare i documenti.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Nomino la cartella…", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Cartella creata!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"Aggiungo un documento alla cartella.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Trascinamento o importazione file. Formati accettati: PDF, Word, Excel e immagini.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Documento aggiunto alla libreria con i metadati e lo storico delle versioni.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Seleziono più documenti per l'esportazione in blocco…", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Selezione multipla attivata.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Genero il report documentale. Assemblaggio automatico con un clic!", highlightBefore:true, delayAfter:3000 },

  // ── Tracciabilità ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Tracciabilità completa. Una timeline che registra ogni azione: chi ha fatto cosa, quando e perché. È la vostra pista di audit per le certificazioni ISO.", delayAfter:3000 },

  // ── Statistiche: 2 schede ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiche: 1.393 ispezioni analizzate in 4 anni. Trasformate i vostri dati grezzi in informazioni utilizzabili.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Scheda Generale: distribuzione temporale, istogrammi, tasso di conformità. Identificate le tendenze e anticipate i problemi.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Scheda Findings: distribuzione delle non conformità per criticità, zona e tendenza. L'analisi predittiva vi aiuta a concentrare gli sforzi dove conta di più.", highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 7 — Module CAE Vidéo 1 (COMMENTATO — DA ATTIVARE IN SEGUITO)
     Appare solo per progetti selezionati.
     Integrerà un video dimostrativo CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'7-0', phase:7, phaseTitle:'CAE Module 1', type:'navigate', route:'/app/cae-module-1', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-1-page"]',
  //   speak:"Modulo CAE — Video dimostrativo in arrivo.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 8 — Module CAE Vidéo 2 (COMMENTATO — DA ATTIVARE IN SEGUITO)
     Appare solo per progetti selezionati.
     Integrerà un secondo video dimostrativo CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'8-0', phase:8, phaseTitle:'CAE Module 2', type:'navigate', route:'/app/cae-module-2', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-2-page"]',
  //   speak:"Modulo CAE — Secondo video dimostrativo in arrivo.", delayAfter:1500 },

  // ── Conclusione ──
  { id:'6-end', phase:6, type:'speak',
    text:"La presentazione è terminata! Avete appena scoperto tutte le funzionalità di INSPECTO DQI: dashboard con KPI in tempo reale, configurazione flessibile, gestione del team, progetti con diagramma di Gantt, attività e compiti, ispezioni digitali con moduli sul campo, wizard di non conformità completo in 5 fasi con analisi delle cause e firma elettronica, piani di controllo qualità, monitoraggio fornitori CFSI, azioni correttive con costi, libreria documentale, tracciabilità completa e statistiche avanzate. Oltre 500 aziende in 6 paesi si affidano a INSPECTO DQI per digitalizzare la gestione qualità. Esplorate liberamente la piattaforma o richiedete una dimostrazione personalizzata!",
    delayAfter:6000, endDemo:true },
]
