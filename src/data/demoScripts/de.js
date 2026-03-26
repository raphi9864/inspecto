/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: Deutsch (DE)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Einstellungen (3 Tabs) + Team (Einladung)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Konfiguration', type:'speak',
    text:"Hallo! Ich bin Ihr INSPECTO DQI-Guide. Ich zeige Ihnen jede Funktion der Plattform. Ich klicke, tippe, f\u00fclle Formulare aus \u2014 alles ist automatisiert. Los geht\u2019s!", delayAfter:800 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Das Dashboard: 4 KPIs in Echtzeit.", delayAfter:1500 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 Projekte, 388 Inspektionen, 108 Nichtkonformit\u00e4ten, 35 Korrekturma\u00dfnahmen.", delayAfter:1500 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Laufende Projekte mit Fortschritt und Warnungen.", delayAfter:1200 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Eingehende Aufgaben mit Status und F\u00e4lligkeit.", delayAfter:1200 },

  // ── Einstellungen: 3 Tabs ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Einstellungen: 3 Konfigurations-Tabs.", delayAfter:1000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Allgemein: Name, Zeitzone, Firmenlogo.", highlightBefore:true, delayAfter:1200 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formulare: Inspektionsvorlagen und benutzerdefinierte Feldtypen.", highlightBefore:true, delayAfter:1200 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Benachrichtigungen: E-Mail-Alarme f\u00fcr jedes Ereignis.", highlightBefore:true, delayAfter:1200 },

  // ── Team: Mitglied einladen ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Teams: 7 Mitglieder mit den Rollen Admin, Inspektor, Viewer.", delayAfter:1200 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Jedes Mitglied zeigt seine Statistiken: durchgef\u00fchrte Inspektionen und erkannte NC.", delayAfter:1200 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Ich lade ein neues Mitglied ein.", highlightBefore:true, delayAfter:800 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Ich tippe die E-Mail\u2026", delayAfter:600 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Einladung gesendet!", delayAfter:600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projekte + Aktivit\u00e4ten (Erstellung) + Aufgaben + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projekte: Liste + Projekt-Dashboard ──
  { id:'2-0', phase:2, phaseTitle:'Projekte', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Liste der Industrieprojekte.", delayAfter:1200 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Ich \u00f6ffne das Projekt, um sein Dashboard zu sehen.", highlightBefore:true, delayAfter:1200 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"4 Projekt-KPIs: Fortschritt, Ma\u00dfnahmen, Inspektionen, NC.", delayAfter:1200 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Interaktives Gantt-Diagramm mit Aktivit\u00e4ten und Fortschrittsbalken.", delayAfter:1500 },

  // ── Aktivit\u00e4ten: + NEW + Eingabe + Speichern ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Aktivit\u00e4tenverwaltung. Ich erstelle eine.", delayAfter:1000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 bestehende Aktivit\u00e4ten: Design, Procurement, Production, Pre-production.", delayAfter:1200 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Ich klicke + NEW ACTIVITY.", highlightBefore:true, delayAfter:800 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Ich tippe den Namen: Design review \u2014 Phase 2.", delayAfter:600 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Gespeichert! Die Aktivit\u00e4t erscheint in der Tabelle.", delayAfter:800 },

  // ── Aufgaben & Ressourcen ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Aufgaben und Ressourcen: Zuweisung pro Person mit Priorit\u00e4t.", delayAfter:1200 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Status, Priorit\u00e4t, Fortschrittsbalken f\u00fcr jede Aufgabe.", delayAfter:1200 },

  // ── Globales Gantt ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Globales Gantt: alle Aktivit\u00e4ten auf einer Zeitleiste.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspektionen: Z\u00e4hler, 3-Tab-Detail, Plan, Formular
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspektionen', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 Inspektionen. Ich zeige Ihnen alles.", delayAfter:1200 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Z\u00e4hler: laufend, \u00fcberf\u00e4llig, ausstehend, geschlossen.", delayAfter:1000 },

  // Klick Zeile \u2192 Detail mit 3 Tabs
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Ich \u00f6ffne eine Inspektion.", highlightBefore:true, delayAfter:1000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Tab Informationen: Referenz, Daten, Standort, Team.", highlightBefore:true, delayAfter:1500 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Tab Findings / NC: erkannte Nichtkonformit\u00e4ten.", highlightBefore:true, delayAfter:1500 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Tab Formular: Checkliste der Kontrollpunkte.", highlightBefore:true, delayAfter:1500 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Zur\u00fcck zur Liste.", delayAfter:500 },

  // + NEUE INSPEKTION \u2192 Plan + Titel eingeben
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Ich plane eine Inspektion.", highlightBefore:true, delayAfter:800 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titel: ISO 9001 Audit \u2014 Standort Paris.", delayAfter:600 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Geolokalisierte Position.", delayAfter:1000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Team: S. Dupont und J. Martin.", delayAfter:1000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Geplant!", delayAfter:600 },

  // + FORMULAR AUSF\u00dcLLEN \u2192 Auto-Detail
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Ich f\u00fclle ein Inspektionsformular aus.", highlightBefore:true, delayAfter:1000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Automatisch vorausgef\u00fcllte Daten.", delayAfter:1200 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Weiter zu den Nichtkonformit\u00e4ten.", delayAfter:400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC-Wizard 5 Schritte + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: vollst\u00e4ndiger 5-Schritte-Wizard ──
  { id:'4-0', phase:4, phaseTitle:'Qualit\u00e4t', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Nichtkonformit\u00e4ten. Ich durchlaufe den vollst\u00e4ndigen 5-Schritte-Wizard.", delayAfter:1000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. Der Wizard \u00f6ffnet sich.", highlightBefore:true, delayAfter:800 },

  // Schritt 1: Informationen
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Schritt 1/5 \u2014 Informationen: Inspektion, Referenz, Zone, Ereignis, Kritikalit\u00e4t.", delayAfter:1200 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Ich tippe die Problembeschreibung\u2026", delayAfter:800 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Status Ongoing, Kritikalit\u00e4t Minor. Toggles: Lesson Learnt, Report date.", delayAfter:1000 },

  // Schritt 2: Fotos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 2/5 \u2014 Fotos. Import und direkte Annotation auf dem Bild.", highlightBefore:true, delayAfter:1000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Feldfoto importiert. Man kann M\u00e4ngel einkreisen und annotieren.", delayAfter:1500 },

  // Schritt 3: Ursache (5-Why)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 3/5 \u2014 Ursachenanalyse. 5-Warum-Methode.", highlightBefore:true, delayAfter:1000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Jedes \u201eWarum\u201c wird dokumentiert und l\u00f6st eine Korrekturma\u00dfnahme aus.", delayAfter:1200 },

  // Schritt 4: L\u00f6sung
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 4/5 \u2014 L\u00f6sung. \u00dcberpr\u00fcfung der verkn\u00fcpften Korrekturma\u00dfnahmen.", highlightBefore:true, delayAfter:1200 },

  // Schritt 5: Unterschrift
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 5/5 \u2014 Unterschrift. Das Dokument kann unterschrieben, geschlossen oder gespeichert werden.", highlightBefore:true, delayAfter:1000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Ich unterschreibe. NC validiert und gesperrt!", highlightBefore:true, delayAfter:1000 },

  // ── QCP: Liste + Detail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Qualit\u00e4tskontrollplan (QCP). Jede Operation im Detail.", delayAfter:1200 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Ich \u00f6ffne einen Kontrollplan.", highlightBefore:true, delayAfter:1200 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Operationen: Kontrolltyp, Kriterien, Referenzen, Rollen Contractor/Client/Dritte, Unterschriften.", delayAfter:1500 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Zur\u00fcck.", delayAfter:400 },

  // ── CFSI: vollst\u00e4ndiges Formular ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI: Lieferanten- und Subunternehmer-Konformit\u00e4t.", delayAfter:1200 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Allgemeine Informationen, praktische Hinweise, Kontrollfotos, Unterschriftenbereich und Abschluss.", delayAfter:1800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Ma\u00dfnahmen: vollst\u00e4ndige Erstellung + Kosten
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Ma\u00dfnahmen', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Korrektur- und Vorbeugema\u00dfnahmen.", delayAfter:1000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Z\u00e4hler: offen, laufend, \u00fcberf\u00e4llig, geschlossen.", delayAfter:1000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Ma\u00dfnahmentabelle mit Zuweisung, Frist, Priorit\u00e4t und verkn\u00fcpfter NC.", delayAfter:1200 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Ich erstelle eine Korrekturma\u00dfnahme.", highlightBefore:true, delayAfter:800 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Ich tippe den Titel\u2026", delayAfter:600 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Typ (Korrektur/Vorbeugend), Zuweisung, Frist, Kosten: 50\u00a0\u20ac \u00d7 24h = 1.200\u00a0\u20ac. Integrierte Wirksamkeitskontrolle.", delayAfter:2500 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Ma\u00dfnahme erstellt.", delayAfter:500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Bibliothek + R\u00fcckverfolgbarkeit + Statistiken (2 Tabs) + Fazit
     ═══════════════════════════════════════════════════════════ */
  // ── Dokumentation ──
  { id:'6-0', phase:6, phaseTitle:'Bibliothek', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Dokumentenbibliothek.", delayAfter:1000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Ordner nach Projekt organisiert. Mehrfachauswahl, um einen Bericht zu erstellen.", delayAfter:1500 },

  // ── R\u00fcckverfolgbarkeit ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"R\u00fcckverfolgbarkeit: vollst\u00e4ndige Zeitleiste. Wer, was, wann.", delayAfter:1500 },

  // ── Statistiken: 2 Tabs ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiken: 1.393 Inspektionen \u00fcber 4 Jahre analysiert.", delayAfter:1000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Tab Allgemein: zeitliche Verteilung, Histogramme, Konformit\u00e4tsrate.", highlightBefore:true, delayAfter:1500 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Tab Findings / NC: Aufschl\u00fcsselung nach Kritikalit\u00e4t, Zone und Trend.", highlightBefore:true, delayAfter:1500 },

  // ── Fazit ──
  { id:'6-end', phase:6, type:'speak',
    text:"Die Pr\u00e4sentation ist beendet! Sie haben gerade ALLE Funktionen gesehen: Dashboard mit KPIs, Einstellungen (3 Tabs), Teamverwaltung mit Einladungen, Projekte mit Gantt, Aktivit\u00e4ten (Erstellung + Eingabe), Aufgaben und Ressourcen, Inspektionen (3-Tab-Detail + Planung + Formular), vollst\u00e4ndiger 5-Schritte-NC-Wizard mit Unterschrift, Qualit\u00e4tskontrollpl\u00e4ne, CFSI, Korrekturma\u00dfnahmen mit Kosten, Dokumentenbibliothek, R\u00fcckverfolgbarkeit und Statistiken (2 Tabs). \u00dcber 500 Unternehmen in 6 L\u00e4ndern vertrauen auf INSPECTO DQI. Erkunden Sie frei!",
    delayAfter:3000, endDemo:true },
]
