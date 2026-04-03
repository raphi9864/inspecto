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
    text:"Guten Tag und herzlich willkommen! Ich bin Ihr INSPECTO DQI-Guide. Im Laufe dieser Demonstration stelle ich Ihnen sämtliche Funktionen unserer industriellen Qualitätsmanagement-Plattform vor. Ich navigiere, klicke, fülle Formulare aus — alles ist automatisiert, damit Sie das Produkt unter realen Bedingungen erleben. Über 500 Unternehmen in 6 Ländern vertrauen uns bereits. Los geht's!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Hier ist Ihr Dashboard. Direkt nach der Anmeldung sehen Sie auf einen Blick den Status aller Ihrer Qualitätsprojekte. Schluss mit verstreuten Excel-Dateien und Follow-up-E-Mails.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"Vier Schlüsselkennzahlen in Echtzeit: 7 aktive Projekte, 388 durchgeführte Inspektionen, 108 erkannte Nichtkonformitäten und 35 laufende Korrekturmaßnahmen. Jede Zahl ist anklickbar für den Detailzugriff.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Ihre laufenden Projekte mit Fortschritt und zugehörigen Warnungen. Verzögerung bei einem Deliverable? Sie sehen es hier sofort.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Eingehende Aufgaben mit Status und Fälligkeitsdatum. Jedes Teammitglied weiß genau, was zu tun ist und wann.", delayAfter:2400 },

  // ── Einstellungen: 3 Tabs ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Die Einstellungen sind in drei Tabs organisiert. Die Plattform passt sich Ihrer Organisation an, nicht umgekehrt.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Allgemeine Konfiguration: Firmenname, Zeitzone, Logo. Ihre Identität erscheint in allen generierten Berichten.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formulare: Erstellen Sie eigene Inspektionsvorlagen mit benutzerdefinierten Feldern. Jede Branche hat ihre Anforderungen — Nuklear, Luft- und Raumfahrt, Verteidigung — und INSPECTO passt sich an.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Benachrichtigungen: Konfigurieren Sie E-Mail-Alarme für jedes Ereignis. Eine erkannte NK, eine überfällige Maßnahme, eine geplante Inspektion — Ihr Team wird automatisch informiert.", highlightBefore:true, delayAfter:2400 },

  // ── Team: Mitglied einladen ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Teamverwaltung: 7 Mitglieder mit differenzierten Rollen — Administrator, Inspektor, Viewer. Jeder greift nur auf das zu, was ihn betrifft.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Jedes Mitglied zeigt seine persönlichen Statistiken: durchgeführte Inspektionen und erkannte Nichtkonformitäten. Die individuelle Leistung ist vollständig nachverfolgbar.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Einen Mitarbeiter hinzuzufügen dauert nur wenige Sekunden.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Ich gebe die E-Mail-Adresse des neuen Mitglieds ein…", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"Einladung gesendet! Der Mitarbeiter erhält eine E-Mail mit einem sicheren Zugangslink.", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Projekte + Aktivitäten (Erstellung) + Aufgaben + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Projekte: Liste + Projekt-Dashboard ──
  { id:'2-0', phase:2, phaseTitle:'Projekte', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Hier ist Ihre Liste der Industrieprojekte. Jedes Projekt bündelt seine Aktivitäten, Inspektionen, Nichtkonformitäten und Maßnahmen in einem eigenen Bereich.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Ich öffne ein Projekt, um sein dediziertes Dashboard anzuzeigen.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"Vier KPIs pro Projekt: Gesamtfortschritt, laufende Maßnahmen, geplante Inspektionen und offene Nichtkonformitäten. Alles auf einen Blick sichtbar.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Das interaktive Gantt-Diagramm bietet eine chronologische Ansicht aller Aktivitäten mit ihren Fortschrittsbalken. Verzögerungen erkennen Sie sofort.", delayAfter:3000 },

  // ── Aktivitäten: + NEW + Eingabe + Speichern ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Aktivitätenverwaltung. Planen und koordinieren Sie Aufgaben mehrerer Teams und Standorte mit intelligenter Ressourcenzuordnung. Ich erstelle eine.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"Vier bestehende Aktivitäten: Design, Procurement, Production und Pre-production. Jede mit Terminen, Verantwortlichen und Fertigstellungsgrad.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Ich klicke auf die Schaltfläche zum Hinzufügen, um eine neue Aktivität zu erstellen.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Ich gebe den Namen ein: Design review — Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"Gespeichert! Die Aktivität erscheint sofort in der Tabelle mit ihren Standardparametern.", delayAfter:1600 },

  // ── Aufgaben & Ressourcen ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Aufgaben und Ressourcen: Jede Aufgabe wird einem Mitarbeiter mit Priorität und Frist zugewiesen. Das System erkennt automatisch Planungskonflikte.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Status, Priorität und Fortschrittsbalken für jede Aufgabe. Überfällige Elemente werden rot markiert.", delayAfter:2400 },

  // ── Globales Gantt ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Das globale Gantt zeigt alle Aktivitäten auf einer einheitlichen Zeitleiste. Sie koordinieren komplexe Qualitätsoperationen über mehrere Projekte gleichzeitig.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspektionen: Zähler, 3-Tab-Detail, Plan, Formular
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspektionen', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 Inspektionen auf dieser Instanz verwaltet. Ich zeige Ihnen die Einsicht, die Planung und das Ausfüllen eines Formulars.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Die Zähler fassen den Status zusammen: Inspektionen laufend, überfällig, ausstehend und geschlossen. Ein Blick genügt, um die dringendsten Fälle zu erkennen.", delayAfter:2000 },

  // Klick Zeile → Detail mit 3 Tabs
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Ich öffne die Detailansicht einer Inspektion.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Erster Tab — Informationen: Referenz, Soll- und Ist-Termine, geolokalisierter Standort, zugewiesenes Team. Alle Kontextinformationen der Inspektion.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Zweiter Tab — Findings: die während dieser Inspektion erkannten Nichtkonformitäten. Jede NK ist mit ihrer Zone, ihrem Ereignis und ihrem Kritikalitätsniveau verknüpft.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Dritter Tab — Formular: die Checkliste der Kontrollpunkte zum Ausfüllen vor Ort, kompatibel mit Smartphone und Tablet, auch offline.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Zurück zur Liste.", delayAfter:1000 },

  // + NEUE INSPEKTION → Plan + Titel eingeben
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Ich plane eine neue Inspektion.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Titel: ISO 9001 Audit — Standort Paris. Das System generiert automatisch eine eindeutige Referenz.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Geolokalisierte Position: Der Inspektionsort wird auf der Karte dargestellt, was die Feldkoordination erleichtert.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Zugewiesenes Team: S. Dupont und J. Martin. Sie erhalten eine automatische Benachrichtigung.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"Inspektion geplant! Sie erscheint im Kalender des Teams.", delayAfter:1200 },

  // + FORMULAR AUSFÜLLEN → Auto-Detail
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Jetzt fülle ich ein Inspektionsformular aus. Das ist das Herzstück der Digitalisierung — Schluss mit Papier.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Die Daten werden automatisch aus dem Projektkontext vorausgefüllt. Die Zeitersparnis ist erheblich.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Weiter zum Nichtkonformitäts-Management.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — NC-Wizard 5 Schritte + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: vollständiger 5-Schritte-Wizard ──
  { id:'4-0', phase:4, phaseTitle:'Qualität', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Die Nichtkonformitäten. Hier zeigt sich der wahre Wert von INSPECTO. Ich durchlaufe den kompletten Wizard in 5 Schritten: von der Erkennung bis zur Unterschrift.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"Ich erstelle eine neue NK. Der geführte Wizard öffnet sich.", highlightBefore:true, delayAfter:1600 },

  // Schritt 1: Informationen
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Schritt 1 von 5 — Informationen: verknüpfte Inspektion, Referenz, betroffene Zone, Ereignistyp und Kritikalitätsstufe. Jede NK ist für die statistische Analyse strukturiert.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Ich beschreibe das Problem: Konformitätszertifikat nicht vom Qualitätsverantwortlichen unterschrieben, Dokument fehlt in der Chargenakte Nummer 42.", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Status laufend, Kritikalität gering. Die Toggles ermöglichen die Markierung als Lesson Learnt oder das Rückdatieren des Berichts bei Bedarf.", delayAfter:2000 },

  // Schritt 2: Fotos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 2 von 5 — Fotos. Importieren Sie Feldfotos und kommentieren Sie direkt auf dem Bild: Kreise, Pfeile, Text. Der visuelle Nachweis ist in die Akte integriert.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Feldfoto importiert. Man kann Mängel einkreisen und Anmerkungen hinzufügen. Alles ist mit Zeitstempel versehen und nachverfolgbar.", delayAfter:3000 },

  // Schritt 3: Ursache (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 3 von 5 — Ursachenanalyse. Die 5-Warum-Methode führt zur Grundursache zurück. Die 8D- und Ishikawa-Methoden sind ebenfalls verfügbar.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Jedes \u201eWarum\u201c wird dokumentiert und kann direkt eine Korrekturmaßnahme auslösen. Die Analyse fließt automatisch in die Wissensdatenbank ein.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"8D-Methode: 8 strukturierte Disziplinen. Die Grundursache wird in D4 identifiziert.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Ishikawa-Diagramm: 6 Ursache-Wirkungs-Zweige. Material, Methode, Umwelt, Maschine, Mensch, Management.", highlightBefore:true, delayAfter:2400 },

  // Schritt 4: Lösung
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 4 von 5 — Lösung. Überprüfung, dass alle verknüpften Korrekturmaßnahmen ausgeführt wurden und wirksam sind.", highlightBefore:true, delayAfter:2400 },

  // Schritt 5: Unterschrift
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Schritt 5 von 5 — Unterschrift. Das Dokument kann elektronisch unterschrieben, geschlossen oder als Entwurf gespeichert werden. Die Unterschrift sperrt die Akte.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Ich unterschreibe. Die NK ist validiert und gesperrt. Keine weitere Änderung möglich — das ist die Garantie für die Dokumentenintegrität.", highlightBefore:true, delayAfter:2000 },

  // ── QCP: Liste + Detail ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Qualitätskontrollplan. Jede Fertigungsoperation ist mit ihren Abnahmekriterien und Rollen detailliert beschrieben.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Ich öffne einen Kontrollplan, um die Details zu sehen.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Für jede Operation: Kontrolltyp, Abnahmekriterien, normative Referenzen, Rollen Contractor, Client und Dritte sowie erforderliche Unterschriften. Konform mit ISO 19443 und AS/EN 9100.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Zurück zur Liste.", delayAfter:800 },

  // ── CFSI: vollständiges Formular ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI — Lieferanten- und Subunternehmer-Konformität. Erweitern Sie die Qualitätskontrolle auf Ihre gesamte Lieferkette.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Allgemeine Informationen, praktische Hinweise, Kontrollfotos, Unterschriftenbereich und Abschluss. Das gesamte Lieferanten-Monitoring an einem Ort.", delayAfter:3600 },

  // ── RFF: Fertigungsabschlussbericht ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Fertigungsabschlussbericht — automatisch aus den Qualitätsdaten des Projekts generiert.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspektionen, Nichtkonformitäten und Korrekturmaßnahmen in einem einzigen Dokument zusammengefasst, bereit zur Übergabe an den Kunden.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 Unterschriftsbereiche: Qualitätsverantwortlicher, Kunde, Dritte. Die Validierung ist formal und nachverfolgbar.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"PDF-Erstellung mit einem Klick! Das Dokument ist versandbereit oder archivierbar.", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Maßnahmen: vollständige Erstellung + Kosten
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Maßnahmen', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Korrektur- und Vorbeugemaßnahmen. Jedes erkannte Problem wird zu einer konkreten Maßnahme mit einem Verantwortlichen, einer Frist und Kosten.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Die Zähler zeigen den Status der Maßnahmen: offen, laufend, überfällig und geschlossen. Verzögerungen sind sofort sichtbar.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Vollständige Tabelle: Zuweisung, Frist, Priorität und verknüpfte NK. Die Rückverfolgbarkeit Maßnahme-NK erfolgt automatisch.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Ich erstelle eine Korrekturmaßnahme.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Titel der Maßnahme: Dokument unterschreiben lassen und Personal nachschulen.", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Typ Korrektur oder Vorbeugend, Zuweisung an einen Verantwortlichen, Frist, und vor allem die Kostenberechnung: 50 Euro pro Stunde, mal 24 Stunden, ergibt 1.200 Euro. Die Kosten der Nichtqualität werden erfasst. Die Wirksamkeitskontrolle ist integriert.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Maßnahme erstellt und gespeichert.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Bibliothek + Rückverfolgbarkeit + Statistiken (2 Tabs) + Fazit
     ═══════════════════════════════════════════════════════════ */
  // ── Dokumentation ──
  { id:'6-0', phase:6, phaseTitle:'Bibliothek', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Die Dokumentenbibliothek zentralisiert alle Ihre Qualitätsdokumente.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Ordner nach Projekt organisiert. Wählen Sie mehrere Dokumente aus, um einen Fertigungsabschlussbericht mit einem Klick zu erstellen. Schluss mit manuellem Zusammenstellen.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Ich erstelle einen neuen Ordner zur Dokumentenorganisation.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Ich benenne den Ordner…", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"Ordner erstellt!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"Ich füge dem Ordner ein Dokument hinzu.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Drag-and-Drop oder Datei-Import. Akzeptierte Formate: PDF, Word, Excel und Bilder.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Dokument mit Metadaten und Versionshistorie zur Bibliothek hinzugefügt.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Ich wähle mehrere Dokumente für den Stapelexport aus…", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Mehrfachauswahl aktiviert.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Ich generiere den Dokumentenbericht. Automatische Zusammenstellung mit einem Klick!", highlightBefore:true, delayAfter:3000 },

  // ── Rückverfolgbarkeit ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Vollständige Rückverfolgbarkeit. Eine Zeitleiste, die jede Aktion nachzeichnet: Wer hat was getan, wann und warum. Das ist Ihr Audit-Trail für ISO-Zertifizierungen.", delayAfter:3000 },

  // ── Statistiken: 2 Tabs ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Statistiken: 1.393 Inspektionen über 4 Jahre analysiert. Verwandeln Sie Ihre Rohdaten in verwertbare Erkenntnisse.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Tab Allgemein: zeitliche Verteilung, Histogramme, Konformitätsrate. Erkennen Sie Trends und antizipieren Sie Probleme.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Tab Findings: Aufschlüsselung der Nichtkonformitäten nach Kritikalität, Zone und Trend. Die prädiktive Analyse hilft Ihnen, Ihre Anstrengungen dort zu konzentrieren, wo es am meisten zählt.", highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 7 — Module CAE Vidéo 1 (AUSKOMMENTIERT — SPÄTER AKTIVIEREN)
     Erscheint nur für ausgewählte Projekte.
     Wird ein CAE-Demovideo integrieren.
     ═══════════════════════════════════════════════════════════ */
  // { id:'7-0', phase:7, phaseTitle:'CAE Module 1', type:'navigate', route:'/app/cae-module-1', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-1-page"]',
  //   speak:"CAE-Modul — Demovideo folgt in Kürze.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 8 — Module CAE Vidéo 2 (AUSKOMMENTIERT — SPÄTER AKTIVIEREN)
     Erscheint nur für ausgewählte Projekte.
     Wird ein zweites CAE-Demovideo integrieren.
     ═══════════════════════════════════════════════════════════ */
  // { id:'8-0', phase:8, phaseTitle:'CAE Module 2', type:'navigate', route:'/app/cae-module-2', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-2-page"]',
  //   speak:"CAE-Modul — Zweites Demovideo folgt in Kürze.", delayAfter:1500 },

  // ── Fazit ──
  { id:'6-end', phase:6, type:'speak',
    text:"Die Präsentation ist abgeschlossen! Sie haben gerade das gesamte Funktionsspektrum von INSPECTO DQI kennengelernt: Dashboard mit Echtzeit-KPIs, flexible Konfiguration, Teamverwaltung, Projekte mit Gantt-Diagramm, Aktivitäten und Aufgaben, digitale Inspektionen mit Feldformularen, vollständiger 5-Schritte-NK-Wizard mit Ursachenanalyse und elektronischer Unterschrift, Qualitätskontrollpläne, Lieferanten-Monitoring CFSI, Korrekturmaßnahmen mit Kostenerfassung, Dokumentenbibliothek, vollständige Rückverfolgbarkeit und erweiterte Statistiken. Über 500 Unternehmen in 6 Ländern vertrauen auf INSPECTO DQI für die Digitalisierung ihres Qualitätsmanagements. Erkunden Sie die Plattform frei oder fordern Sie eine personalisierte Demonstration an!",
    delayAfter:6000, endDemo:true },
]
