/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: Espa\u00f1ol (ES)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Configuraci\u00f3n (3 pesta\u00f1as) + Equipo (invitaci\u00f3n)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configuraci\u00f3n', type:'speak',
    text:"\u00a1Hola! Soy su gu\u00eda INSPECTO DQI. Les mostrar\u00e9 cada funcionalidad de la plataforma. Hago clic, escribo, completo los formularios \u2014 todo est\u00e1 automatizado. \u00a1Empecemos!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"El Dashboard: 4 KPIs en tiempo real.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"7 proyectos, 388 inspecciones, 108 no conformidades, 35 acciones correctivas.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Proyectos en curso con progreso y alertas.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Tareas entrantes con estado y fecha l\u00edmite.", delayAfter:2400 },

  // ── Configuraci\u00f3n: 3 pesta\u00f1as ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"Configuraci\u00f3n: 3 pesta\u00f1as de ajustes.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"General: nombre, zona horaria, logo de la empresa.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formularios: plantillas de inspecci\u00f3n y tipos de campo personalizados.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notificaciones: alertas por email para cada evento.", highlightBefore:true, delayAfter:2400 },

  // ── Equipo: invitar un miembro ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Equipos: 7 miembros con roles Admin, Inspector, Viewer.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Cada miembro muestra sus estad\u00edsticas: inspecciones realizadas y NC detectadas.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Invito a un nuevo miembro.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Escribo el email\u2026", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"\u00a1Invitaci\u00f3n enviada!", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Proyectos + Actividades (creaci\u00f3n) + Tareas + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Proyectos: lista + dashboard de proyecto ──
  { id:'2-0', phase:2, phaseTitle:'Proyectos', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Lista de proyectos industriales.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Abro el proyecto para ver su dashboard.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"4 KPIs del proyecto: progreso, acciones, inspecciones, NC.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"Diagrama de Gantt interactivo con actividades y barras de progreso.", delayAfter:3000 },

  // ── Actividades: + NEW + escritura + guardar ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gesti\u00f3n de actividades. Voy a crear una.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"4 actividades existentes: Design, Procurement, Production, Pre-production.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Hago clic en + NEW ACTIVITY.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Escribo el nombre: Design review \u2014 Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"\u00a1Guardado! La actividad aparece en la tabla.", delayAfter:1600 },

  // ── Tareas y Recursos ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tareas y Recursos: asignaci\u00f3n por persona con prioridad.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Estado, prioridad, barra de progreso para cada tarea.", delayAfter:2400 },

  // ── Gantt global ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gantt global: todas las actividades en una l\u00ednea de tiempo.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspecciones: contadores, detalle 3 pesta\u00f1as, plan, formulario
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspecciones', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspecciones. Les mostrar\u00e9 todo.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Contadores: en curso, atrasadas, pendientes, cerradas.", delayAfter:2000 },

  // Clic fila \u2192 detalle con 3 pesta\u00f1as
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Abro una inspecci\u00f3n.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Pesta\u00f1a Informaci\u00f3n: referencia, fechas, ubicaci\u00f3n, equipo.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Pesta\u00f1a Findings / NC: no conformidades detectadas.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Pesta\u00f1a Formulario: checklist de los puntos de control.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Vuelvo a la lista.", delayAfter:1000 },

  // + NUEVA INSPECCI\u00d3N \u2192 plan + escritura del t\u00edtulo
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Planifico una inspecci\u00f3n.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"T\u00edtulo: Auditor\u00eda ISO 9001 \u2014 Sede Par\u00eds.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Posici\u00f3n geolocalizada.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Equipo: S. Dupont y J. Martin.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"\u00a1Planificada!", delayAfter:1200 },

  // + RELLENAR UN FORMULARIO \u2192 detalle auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Relleno un formulario de inspecci\u00f3n.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Datos pre-rellenados autom\u00e1ticamente.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Pasemos a las no conformidades.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Wizard NC 5 pasos + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: wizard completo 5 pasos ──
  { id:'4-0', phase:4, phaseTitle:'Calidad', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"No conformidades. Recorrer\u00e9 el wizard completo en 5 pasos.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"+ NEW NC. El wizard se abre.", highlightBefore:true, delayAfter:1600 },

  // Paso 1: Informaci\u00f3n
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Paso 1/5 \u2014 Informaci\u00f3n: inspecci\u00f3n, referencia, zona, evento, criticidad.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Escribo la descripci\u00f3n del problema\u2026", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Estado Ongoing, criticidad Minor. Toggles: Lesson Learnt, Report date.", delayAfter:2000 },

  // Paso 2: Fotos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 2/5 \u2014 Fotos. Importaci\u00f3n y anotaci\u00f3n directa sobre la imagen.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Foto de campo importada. Se pueden encerrar los defectos y anotar.", delayAfter:3000 },

  // Paso 3: Causa (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 3/5 \u2014 An\u00e1lisis de causas. 3 m\u00e9todos disponibles: 5 Por qu\u00e9, 8D e Ishikawa.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Cada \u00abPor qu\u00e9\u00bb queda documentado y dispara una acci\u00f3n correctiva.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"M\u00e9todo 8D: 8 disciplinas estructuradas. Causa ra\u00edz identificada en D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Diagrama Ishikawa: 6 ramas causa-efecto. Material, M\u00e9todo, Medio ambiente, Maquinaria, Mano de obra, Management.", highlightBefore:true, delayAfter:2400 },

  // Paso 4: Resoluci\u00f3n
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 4/5 \u2014 Resoluci\u00f3n. Verificaci\u00f3n de las acciones correctivas vinculadas.", highlightBefore:true, delayAfter:2400 },

  // Paso 5: Firma
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 5/5 \u2014 Firma. El documento puede ser firmado, cerrado o guardado.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Firmo. \u00a1NC validada y bloqueada!", highlightBefore:true, delayAfter:2000 },

  // ── QCP: lista + detalle ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Plan de Control de Calidad (QCP). Cada operaci\u00f3n detallada.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Abro un plan de control.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Operaciones: tipo de control, criterios, referencias, roles Contractor/Client/Terceros, firmas.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Volver.", delayAfter:800 },

  // ── CFSI: formulario completo ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI: Conformidad de Proveedores y Subcontratistas.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Informaci\u00f3n general, avisos pr\u00e1cticos, fotos de control, zona de firma y cierre.", delayAfter:3600 },

  // ── RFF: Informe de Fin de Fabricaci\u00f3n ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Informe de Fin de Fabricaci\u00f3n \u2014 generado autom\u00e1ticamente desde los datos de calidad.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspecciones, NC y acciones correctivas consolidadas en un solo documento.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 zonas de firma: Responsable de Calidad, Cliente, Terceros.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"\u00a1Generaci\u00f3n PDF con un clic!", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Acciones: creaci\u00f3n completa + costes
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Acciones', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Acciones correctivas y preventivas.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Contadores: abiertas, en curso, atrasadas, cerradas.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tabla de acciones con asignaci\u00f3n, fecha l\u00edmite, prioridad y NC vinculada.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Creo una acci\u00f3n correctiva.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Escribo el t\u00edtulo\u2026", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Tipo (Correctiva/Preventiva), asignaci\u00f3n, fecha l\u00edmite, coste: 50\u00a0\u20ac \u00d7 24h = 1.200\u00a0\u20ac. Seguimiento de eficacia integrado.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Acci\u00f3n creada.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Biblioteca + Trazabilidad + Estad\u00edsticas (2 pesta\u00f1as) + Conclusi\u00f3n
     ═══════════════════════════════════════════════════════════ */
  // ── Documentaci\u00f3n ──
  { id:'6-0', phase:6, phaseTitle:'Biblioteca', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Biblioteca documental.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Carpetas organizadas por proyecto. Selecci\u00f3n m\u00faltiple para generar un informe.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Creo una nueva carpeta.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Nombro la carpeta\u2026", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"\u00a1Carpeta creada!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"A\u00f1ado un documento.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Arrastrar y soltar o importar archivo. Formatos: PDF, Word, Excel.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Documento a\u00f1adido a la biblioteca con metadatos.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Selecciono varios documentos\u2026", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Selecci\u00f3n m\u00faltiple activada.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Genero el informe documental. \u00a1Ensamblaje autom\u00e1tico con un solo clic!", highlightBefore:true, delayAfter:3000 },

  // ── Trazabilidad ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Trazabilidad: l\u00ednea de tiempo completa. Qui\u00e9n, qu\u00e9, cu\u00e1ndo.", delayAfter:3000 },

  // ── Estad\u00edsticas: 2 pesta\u00f1as ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Estad\u00edsticas: 1.393 inspecciones analizadas en 4 a\u00f1os.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Pesta\u00f1a General: distribuci\u00f3n temporal, histogramas, tasa de conformidad.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Pesta\u00f1a Findings / NC: distribuci\u00f3n por criticidad, zona y tendencia.", highlightBefore:true, delayAfter:3000 },

  // ── Conclusi\u00f3n ──
  { id:'6-end', phase:6, type:'speak',
    text:"\u00a1La presentaci\u00f3n ha terminado! Acaban de ver TODAS las funcionalidades: dashboard con KPIs, configuraci\u00f3n (3 pesta\u00f1as), gesti\u00f3n de equipos con invitaciones, proyectos con Gantt, actividades (creaci\u00f3n + entrada), tareas y recursos, inspecciones (detalle 3 pesta\u00f1as + planificaci\u00f3n + formulario), wizard NC completo en 5 pasos con firma, planes de control de calidad, CFSI, acciones correctivas con costes, biblioteca documental, trazabilidad y estad\u00edsticas (2 pesta\u00f1as). M\u00e1s de 500 empresas en 6 pa\u00edses conf\u00edan en INSPECTO DQI. \u00a1Exploren libremente!",
    delayAfter:6000, endDemo:true },
]
