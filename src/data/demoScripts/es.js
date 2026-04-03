/**
 * Demo Script — EXHAUSTIVE: every page, every tab, every form, every button.
 * Avatar clicks, types, navigates — full A-to-Z walkthrough.
 * Language: Español (ES)
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Dashboard + Configuración (3 pestañas) + Equipo (invitación)
     ═══════════════════════════════════════════════════════════ */
  { id:'1-0', phase:1, phaseTitle:'Configuración', type:'speak',
    text:"¡Hola y bienvenidos! Soy su guía INSPECTO DQI. Durante esta demostración, les presentaré todas las funcionalidades de nuestra plataforma de gestión de calidad industrial. Navego, hago clic, completo formularios — todo está automatizado para mostrarles el producto en condiciones reales. Más de 500 empresas en 6 países ya confían en nosotros. ¡Empecemos!", delayAfter:1600 },

  // ── Dashboard ──
  { id:'1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Aquí tienen su panel de control. Desde el momento en que inician sesión, visualizan de un vistazo el estado de todos sus proyectos de calidad. Se acabaron las hojas Excel dispersas y los correos de seguimiento.", delayAfter:3000 },
  { id:'1-2', phase:1, type:'highlight', selector:'.home-kpi-row',
    speak:"Cuatro indicadores clave en tiempo real: 7 proyectos activos, 388 inspecciones realizadas, 108 no conformidades detectadas y 35 acciones correctivas en curso. Cada cifra es clicable para acceder al detalle.", delayAfter:3000 },
  { id:'1-3', phase:1, type:'highlight', selector:'#panel-projects',
    speak:"Sus proyectos en curso con su avance y las alertas asociadas. ¿Un retraso en un entregable? Lo ven inmediatamente aquí.", delayAfter:2400 },
  { id:'1-4', phase:1, type:'highlight', selector:'#panel-tasks',
    speak:"Las tareas entrantes con su estado y fecha límite. Cada miembro del equipo sabe exactamente qué hacer y cuándo.", delayAfter:2400 },

  // ── Configuración: 3 pestañas ──
  { id:'1-5', phase:1, type:'navigate', route:'/app/settings', transition:'prezi',
    waitForSelector:'[data-demo-target="settings-page"]',
    speak:"La configuración se organiza en tres pestañas. La plataforma se adapta a su organización, no al revés.", delayAfter:2000 },
  { id:'1-6', phase:1, type:'click', selector:'[data-demo-target="settings-tab-general"]',
    speak:"Configuración general: nombre de la empresa, zona horaria, logo. Su identidad aparece en todos los informes generados.", highlightBefore:true, delayAfter:2400 },
  { id:'1-7', phase:1, type:'click', selector:'[data-demo-target="settings-tab-forms"]',
    speak:"Formularios: creen sus propias plantillas de inspección con campos personalizados. Cada sector tiene sus exigencias — nuclear, aeronáutica, defensa — e INSPECTO se adapta a cada uno.", highlightBefore:true, delayAfter:2400 },
  { id:'1-8', phase:1, type:'click', selector:'[data-demo-target="settings-tab-notifications"]',
    speak:"Notificaciones: configuren las alertas por email para cada evento. Una NC detectada, una acción con retraso, una inspección programada — su equipo se entera automáticamente.", highlightBefore:true, delayAfter:2400 },

  // ── Equipo: invitar un miembro ──
  { id:'1-9', phase:1, type:'navigate', route:'/app/team', transition:'prezi',
    waitForSelector:'.team-grid',
    speak:"Gestión de equipo: 7 miembros con roles diferenciados — Administrador, Inspector, Viewer. Cada persona accede únicamente a lo que le concierne.", delayAfter:2400 },
  { id:'1-10', phase:1, type:'highlight', selector:'.team-grid',
    speak:"Cada miembro muestra sus estadísticas personales: inspecciones realizadas y no conformidades detectadas. El rendimiento individual es completamente trazable.", delayAfter:2400 },
  { id:'1-11', phase:1, type:'click', selector:'[data-demo-target="btn-invite"]',
    speak:"Añadir un colaborador toma solo unos segundos.", highlightBefore:true, delayAfter:1600 },
  { id:'1-12', phase:1, type:'type', selector:'input[type="email"]',
    value:'jean.martin@inspecto.com', clearFirst:true,
    speak:"Introduzco la dirección email del nuevo miembro…", delayAfter:1200 },
  { id:'1-13', phase:1, type:'click', selector:'[data-demo-target="btn-send-invite"]',
    speak:"¡Invitación enviada! El colaborador recibe un email con un enlace de acceso seguro.", delayAfter:1200 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Proyectos + Actividades (creación) + Tareas + Gantt
     ═══════════════════════════════════════════════════════════ */
  // ── Proyectos: lista + dashboard de proyecto ──
  { id:'2-0', phase:2, phaseTitle:'Proyectos', type:'navigate', route:'/app/projets', transition:'prezi',
    waitForSelector:'[data-demo-target="projects-page"]',
    speak:"Aquí tienen la lista de sus proyectos industriales. Cada proyecto agrupa sus actividades, inspecciones, no conformidades y acciones en un espacio dedicado.", delayAfter:2400 },
  { id:'2-1', phase:2, type:'click', selector:'.proj-card',
    speak:"Abro un proyecto para mostrar su panel de control dedicado.", highlightBefore:true, delayAfter:2400 },
  { id:'2-2', phase:2, type:'highlight', selector:'.kpi-row',
    speak:"Cuatro KPIs por proyecto: avance global, acciones en curso, inspecciones planificadas y no conformidades abiertas. Todo visible de un vistazo.", delayAfter:2400 },
  { id:'2-3', phase:2, type:'highlight', selector:'.gantt-section',
    speak:"El diagrama de Gantt interactivo ofrece una vista cronológica de todas las actividades con sus barras de progreso. Identifican los retrasos de inmediato.", delayAfter:3000 },

  // ── Actividades: + NEW + escritura + guardar ──
  { id:'2-4', phase:2, type:'navigate', route:'/app/activites', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Gestión de actividades. Planifiquen y coordinen las tareas de múltiples equipos y sedes con la asignación inteligente de recursos. Voy a crear una.", delayAfter:2000 },
  { id:'2-5', phase:2, type:'highlight', selector:'.data-table',
    speak:"Cuatro actividades existentes: Design, Procurement, Production y Pre-production. Cada una con sus fechas, responsables y porcentaje de avance.", delayAfter:2400 },
  { id:'2-6', phase:2, type:'click', selector:'[data-demo-target="btn-new-activity"]',
    speak:"Hago clic en el botón de añadir para crear una nueva actividad.", highlightBefore:true, delayAfter:1600 },
  { id:'2-7', phase:2, type:'type', selector:'[data-demo-target="activity-name"]',
    value:'Design review \u2014 Phase 2', clearFirst:true,
    speak:"Introduzco el nombre: Design review — Phase 2.", delayAfter:1200 },
  { id:'2-8', phase:2, type:'click', selector:'[data-demo-target="activity-save"]',
    speak:"¡Guardado! La actividad aparece instantáneamente en la tabla con sus parámetros por defecto.", delayAfter:1600 },

  // ── Tareas y Recursos ──
  { id:'2-9', phase:2, type:'navigate', route:'/app/taches', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Tareas y recursos: cada tarea se asigna a un colaborador con una prioridad y un plazo. El sistema detecta automáticamente los conflictos de planificación.", delayAfter:2400 },
  { id:'2-10', phase:2, type:'highlight', selector:'.data-table',
    speak:"Estado, prioridad y barra de progreso para cada tarea. Los elementos con retraso se señalan en rojo.", delayAfter:2400 },

  // ── Gantt global ──
  { id:'2-11', phase:2, type:'navigate', route:'/app/gantt', transition:'prezi',
    waitForSelector:'.panel',
    speak:"El Gantt global muestra todas las actividades en una línea de tiempo unificada. Coordinan operaciones de calidad complejas en varios proyectos simultáneamente.", delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — Inspecciones: contadores, detalle 3 pestañas, plan, formulario
     ═══════════════════════════════════════════════════════════ */
  { id:'3-0', phase:3, phaseTitle:'Inspecciones', type:'navigate', route:'/app/inspections', transition:'prezi',
    waitForSelector:'[data-demo-target="inspections-page"]',
    speak:"388 inspecciones gestionadas en esta instancia. Les mostraré la consulta, la planificación y el llenado de un formulario.", delayAfter:2400 },
  { id:'3-1', phase:3, type:'highlight', selector:'.status-counters',
    speak:"Los contadores resumen el estado: inspecciones en curso, atrasadas, pendientes de validación y cerradas. Un vistazo basta para identificar las urgencias.", delayAfter:2000 },

  // Clic fila → detalle con 3 pestañas
  { id:'3-2', phase:3, type:'click', selector:'.data-table tbody tr',
    speak:"Abro el detalle de una inspección.", highlightBefore:true, delayAfter:2000 },
  { id:'3-3', phase:3, type:'click', selector:'[data-demo-target="insp-tab-info"]',
    speak:"Primera pestaña — Información: referencia, fechas previstas y reales, localización georreferenciada, equipo asignado. Toda la información contextual de la inspección.", highlightBefore:true, delayAfter:3000 },
  { id:'3-4', phase:3, type:'click', selector:'[data-demo-target="insp-tab-findings"]',
    speak:"Segunda pestaña — Findings: las no conformidades detectadas durante esta inspección. Cada NC está vinculada a su zona, evento y nivel de criticidad.", highlightBefore:true, delayAfter:3000 },
  { id:'3-5', phase:3, type:'click', selector:'[data-demo-target="insp-tab-form"]',
    speak:"Tercera pestaña — Formulario: la checklist de puntos de control para rellenar en campo, compatible con móvil y tableta, incluso sin conexión.", highlightBefore:true, delayAfter:3000 },
  { id:'3-6', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Vuelvo a la lista.", delayAfter:1000 },

  // + NUEVA INSPECCIÓN → plan + escritura del título
  { id:'3-7', phase:3, type:'click', selector:'[data-demo-target="btn-new-inspection"]',
    speak:"Planifico una nueva inspección.", highlightBefore:true, delayAfter:1600 },
  { id:'3-8', phase:3, type:'type', selector:'.wizard-input[type="text"]',
    value:'Audit ISO 9001 \u2014 Site Paris', clearFirst:true,
    speak:"Título: Auditoría ISO 9001 — Sede París. El sistema genera automáticamente una referencia única.", delayAfter:1200 },
  { id:'3-9', phase:3, type:'highlight', selector:'.insp-map-placeholder',
    speak:"Localización georreferenciada: el lugar de la inspección se posiciona en el mapa, facilitando la coordinación en campo.", delayAfter:2000 },
  { id:'3-10', phase:3, type:'highlight', selector:'.insp-resources-row',
    speak:"Equipo asignado: S. Dupont y J. Martin. Recibirán una notificación automática.", delayAfter:2000 },
  { id:'3-11', phase:3, type:'click', selector:'.panel-btn.primary', matchText:'Planifier',
    speak:"¡Inspección planificada! Aparece en el calendario del equipo.", delayAfter:1200 },

  // + RELLENAR UN FORMULARIO → detalle auto
  { id:'3-12', phase:3, type:'click', selector:'[data-demo-target="btn-fill-form"]',
    speak:"Ahora relleno un formulario de inspección. Es el corazón de la digitalización — se acabó el papel.", highlightBefore:true, delayAfter:2000 },
  { id:'3-13', phase:3, type:'highlight', selector:'.panel',
    speak:"Los datos se pre-rellenan automáticamente a partir del contexto del proyecto. El ahorro de tiempo es considerable.", delayAfter:2400 },
  { id:'3-14', phase:3, type:'click', selector:'[data-demo-target="insp-back"]',
    speak:"Pasemos a la gestión de no conformidades.", delayAfter:800 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Wizard NC 5 pasos + QCP + CFSI
     ═══════════════════════════════════════════════════════════ */
  // ── NC: wizard completo 5 pasos ──
  { id:'4-0', phase:4, phaseTitle:'Calidad', type:'navigate', route:'/app/findings', transition:'prezi',
    waitForSelector:'[data-demo-target="findings-page"]',
    speak:"Las no conformidades. Aquí es donde se revela el verdadero valor de INSPECTO. Recorreré el wizard completo en 5 pasos: de la detección a la firma.", delayAfter:2000 },
  { id:'4-1', phase:4, type:'click', selector:'[data-demo-target="btn-new-nc"]',
    speak:"Creo una nueva NC. El wizard guiado se abre.", highlightBefore:true, delayAfter:1600 },

  // Paso 1: Información
  { id:'4-2', phase:4, type:'highlight', selector:'.wizard-stepper',
    speak:"Paso 1 de 5 — Información: inspección vinculada, referencia, zona afectada, tipo de evento y nivel de criticidad. Cada NC se estructura para permitir el análisis estadístico.", delayAfter:2400 },
  { id:'4-3', phase:4, type:'type', selector:'textarea',
    value:"Certificat de conformité non signé par le responsable qualité. Document manquant dans le dossier de lot n°42.",
    clearFirst:true, speak:"Describo el problema: certificado de conformidad no firmado por el responsable de calidad, documento faltante en el expediente del lote número 42.", delayAfter:1600 },
  { id:'4-4', phase:4, type:'highlight', selector:'.wizard-input[value="Ongoing"]',
    speak:"Estado en curso, criticidad menor. Los toggles permiten marcar una Lesson Learnt o antedatar el informe si es necesario.", delayAfter:2000 },

  // Paso 2: Fotos
  { id:'4-5', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 2 de 5 — Fotos. Importen fotos de campo y anoten directamente sobre la imagen: círculos, flechas, texto. La evidencia visual se integra al expediente.", highlightBefore:true, delayAfter:2000 },
  { id:'4-6', phase:4, type:'highlight', selector:'img[alt="Inspection"]',
    speak:"Foto de campo importada. Se pueden encerrar los defectos y añadir anotaciones. Todo queda fechado y es trazable.", delayAfter:3000 },

  // Paso 3: Causa (5-Why + 8D + Ishikawa)
  { id:'4-7', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 3 de 5 — Análisis de causas. El método de los 5 Por qué permite llegar a la causa raíz. Los métodos 8D e Ishikawa también están disponibles.", highlightBefore:true, delayAfter:2000 },
  { id:'4-8', phase:4, type:'highlight', selector:'.btn-primary', matchText:'ADD',
    speak:"Cada «Por qué» queda documentado y puede desencadenar directamente una acción correctiva. El análisis alimenta automáticamente las lecciones aprendidas.", delayAfter:2400 },
  { id:'4-7b', phase:4, type:'click', selector:'[data-demo-target="analysis-8d"]',
    speak:"Método 8D: 8 disciplinas estructuradas. La causa raíz se identifica en D4.", highlightBefore:true, delayAfter:2000 },
  { id:'4-7c', phase:4, type:'click', selector:'[data-demo-target="analysis-ishikawa"]',
    speak:"Diagrama Ishikawa: 6 ramas causa-efecto. Material, Método, Medio ambiente, Maquinaria, Mano de obra, Management.", highlightBefore:true, delayAfter:2400 },

  // Paso 4: Resolución
  { id:'4-9', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 4 de 5 — Resolución. Verificación de que todas las acciones correctivas vinculadas han sido ejecutadas y son eficaces.", highlightBefore:true, delayAfter:2400 },

  // Paso 5: Firma
  { id:'4-10', phase:4, type:'click', selector:'[data-demo-target="nc-wizard-next"]',
    speak:"Paso 5 de 5 — Firma. El documento puede firmarse electrónicamente, cerrarse o guardarse como borrador. La firma bloquea el expediente.", highlightBefore:true, delayAfter:2000 },
  { id:'4-11', phase:4, type:'click', selector:'[data-demo-target="nc-sign"]',
    speak:"Firmo. La NC queda validada y bloqueada. Ninguna modificación posterior es posible — es la garantía de la integridad documental.", highlightBefore:true, delayAfter:2000 },

  // ── QCP: lista + detalle ──
  { id:'4-12', phase:4, type:'navigate', route:'/app/qcp', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Plan de Control de Calidad. Cada operación de fabricación se detalla con sus criterios de aceptación y sus roles.", delayAfter:2400 },
  { id:'4-13', phase:4, type:'click', selector:'.data-table tbody tr',
    speak:"Abro un plan de control para ver el detalle.", highlightBefore:true, delayAfter:2400 },
  { id:'4-14', phase:4, type:'highlight', selector:'.panel-body',
    speak:"Para cada operación: tipo de control, criterios de aceptación, referencias normativas, roles Contractor, Client y Terceros, y firmas requeridas. Conforme a las exigencias ISO 19443 y AS/EN 9100.", delayAfter:3000 },
  { id:'4-15', phase:4, type:'click', selector:'.btn-outline', matchText:'Back',
    speak:"Vuelvo a la lista.", delayAfter:800 },

  // ── CFSI: formulario completo ──
  { id:'4-16', phase:4, type:'navigate', route:'/app/cfsi', transition:'prezi',
    waitForSelector:'.panel',
    speak:"CFSI — Conformidad de Proveedores y Subcontratistas Industriales. Extiendan el control de calidad a toda su cadena de suministro.", delayAfter:2400 },
  { id:'4-17', phase:4, type:'highlight', selector:'.panel',
    speak:"Información general, avisos prácticos, fotos de control, zona de firma y cierre. Todo el seguimiento de proveedores en un solo lugar.", delayAfter:3600 },

  // ── RFF: Informe de Fin de Fabricación ──
  { id:'4-18', phase:4, type:'navigate', route:'/app/rff', transition:'prezi',
    waitForSelector:'.panel',
    speak:"Informe de Fin de Fabricación — generado automáticamente desde los datos de calidad del proyecto.", delayAfter:2400 },
  { id:'4-19', phase:4, type:'highlight', selector:'[data-demo-target="rff-inspections"]',
    speak:"Inspecciones, no conformidades y acciones correctivas consolidadas en un solo documento listo para entregar al cliente.", delayAfter:3000 },
  { id:'4-20', phase:4, type:'highlight', selector:'[data-demo-target="rff-signatures"]',
    speak:"3 zonas de firma: Responsable de Calidad, Cliente, Terceros. La validación es formal y trazable.", delayAfter:2400 },
  { id:'4-21', phase:4, type:'click', selector:'[data-demo-target="btn-generate-pdf"]',
    speak:"¡Generación PDF con un solo clic! El documento está listo para enviar o archivar.", highlightBefore:true, delayAfter:2000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 5 — Acciones: creación completa + costes
     ═══════════════════════════════════════════════════════════ */
  { id:'5-0', phase:5, phaseTitle:'Acciones', type:'navigate', route:'/app/actions', transition:'prezi',
    waitForSelector:'[data-demo-target="actions-page"]',
    speak:"Acciones correctivas y preventivas. Cada problema detectado se transforma en una acción concreta con un responsable, un plazo y un coste.", delayAfter:2000 },
  { id:'5-1', phase:5, type:'highlight', selector:'.status-counters',
    speak:"Los contadores muestran el estado de las acciones: abiertas, en curso, atrasadas y cerradas. Los retrasos son inmediatamente visibles.", delayAfter:2000 },
  { id:'5-2', phase:5, type:'highlight', selector:'.data-table',
    speak:"Tabla completa: asignación, fecha límite, prioridad y NC vinculada. La trazabilidad acción-NC es automática.", delayAfter:2400 },
  { id:'5-3', phase:5, type:'click', selector:'[data-demo-target="btn-new-action"]',
    speak:"Creo una acción correctiva.", highlightBefore:true, delayAfter:1600 },
  { id:'5-4', phase:5, type:'type', selector:'[data-demo-target="action-title"]',
    value:'Faire signer le document et recycler le personnel', clearFirst:true,
    speak:"Título de la acción: hacer firmar el documento y reciclar al personal.", delayAfter:1200 },
  { id:'5-5', phase:5, type:'highlight', selector:'.panel-body',
    speak:"Tipo correctiva o preventiva, asignación a un responsable, fecha límite, y sobre todo el coste: 50 euros por hora, multiplicado por 24 horas, total 1.200 euros. El coste de la no calidad queda registrado. El seguimiento de eficacia está integrado.", delayAfter:5000 },
  { id:'5-6', phase:5, type:'click', selector:'.ctx-back-btn',
    speak:"Acción creada y registrada.", delayAfter:1000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 6 — Biblioteca + Trazabilidad + Estadísticas (2 pestañas) + Conclusión
     ═══════════════════════════════════════════════════════════ */
  // ── Documentación ──
  { id:'6-0', phase:6, phaseTitle:'Biblioteca', type:'navigate', route:'/app/documentation', transition:'prezi',
    waitForSelector:'.panel',
    speak:"La biblioteca documental centraliza todos sus documentos de calidad.", delayAfter:2000 },
  { id:'6-1', phase:6, type:'highlight', selector:'.doc-folder-list',
    speak:"Carpetas organizadas por proyecto. Seleccionen varios documentos para generar un informe de fin de fabricación con un solo clic. Se acabó el ensamblaje manual.", delayAfter:3000 },
  { id:'6-1b', phase:6, type:'click', selector:'[data-demo-target="btn-new-folder"]',
    speak:"Creo una nueva carpeta para organizar los documentos.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1c', phase:6, type:'type', selector:'[data-demo-target="folder-name"]',
    value:'Dossier Audit ISO 2025', clearFirst:true,
    speak:"Nombro la carpeta…", delayAfter:1200 },
  { id:'6-1d', phase:6, type:'click', selector:'[data-demo-target="btn-save-folder"]',
    speak:"¡Carpeta creada!", highlightBefore:true, delayAfter:1600 },
  { id:'6-1e', phase:6, type:'click', selector:'[data-demo-target="btn-upload-doc"]',
    speak:"Añado un documento a la carpeta.", highlightBefore:true, delayAfter:1600 },
  { id:'6-1f', phase:6, type:'highlight', selector:'[data-demo-target="doc-upload-area"]',
    speak:"Arrastrar y soltar o importación de archivo. Formatos aceptados: PDF, Word, Excel e imágenes.", delayAfter:3000 },
  { id:'6-1g', phase:6, type:'highlight', selector:'[data-demo-target="doc-list"]',
    speak:"Documento añadido a la biblioteca con sus metadatos y su historial de versiones.", delayAfter:2400 },
  { id:'6-1h', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Selecciono varios documentos para la exportación en lote…", delayAfter:2000 },
  { id:'6-1i', phase:6, type:'highlight', selector:'[data-demo-target="doc-checkbox"]',
    speak:"Selección múltiple activada.", delayAfter:2000 },
  { id:'6-1j', phase:6, type:'click', selector:'[data-demo-target="btn-generate-report"]',
    speak:"Genero el informe documental. ¡Ensamblaje automático con un solo clic!", highlightBefore:true, delayAfter:3000 },

  // ── Trazabilidad ──
  { id:'6-2', phase:6, type:'navigate', route:'/app/traceabilite', transition:'prezi',
    waitForSelector:'[data-demo-target="traceability-page"]',
    speak:"Trazabilidad completa. Una línea de tiempo que registra cada acción: quién hizo qué, cuándo y por qué. Es su pista de auditoría para las certificaciones ISO.", delayAfter:3000 },

  // ── Estadísticas: 2 pestañas ──
  { id:'6-3', phase:6, type:'navigate', route:'/app/statistiques', transition:'prezi',
    waitForSelector:'.stats-tabs',
    speak:"Estadísticas: 1.393 inspecciones analizadas en 4 años. Transformen sus datos brutos en información explotable.", delayAfter:2000 },
  { id:'6-4', phase:6, type:'click', selector:'.stats-tab', matchText:'GENERAL',
    speak:"Pestaña General: distribución temporal, histogramas, tasa de conformidad. Identifiquen tendencias y anticipen problemas.", highlightBefore:true, delayAfter:3000 },
  { id:'6-5', phase:6, type:'click', selector:'.stats-tab', matchText:'FINDINGS',
    speak:"Pestaña Findings: distribución de no conformidades por criticidad, zona y tendencia. El análisis predictivo les ayuda a concentrar sus esfuerzos donde más importa.", highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 7 — Module CAE Vidéo 1 (COMENTADO — ACTIVAR MÁS TARDE)
     Aparece solo para proyectos seleccionados.
     Integrará un vídeo de demostración CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'7-0', phase:7, phaseTitle:'CAE Module 1', type:'navigate', route:'/app/cae-module-1', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-1-page"]',
  //   speak:"Módulo CAE — Vídeo de demostración próximamente.", delayAfter:1500 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 8 — Module CAE Vidéo 2 (COMENTADO — ACTIVAR MÁS TARDE)
     Aparece solo para proyectos seleccionados.
     Integrará un segundo vídeo de demostración CAE.
     ═══════════════════════════════════════════════════════════ */
  // { id:'8-0', phase:8, phaseTitle:'CAE Module 2', type:'navigate', route:'/app/cae-module-2', transition:'prezi',
  //   waitForSelector:'[data-demo-target="cae-module-2-page"]',
  //   speak:"Módulo CAE — Segundo vídeo de demostración próximamente.", delayAfter:1500 },

  // ── Conclusión ──
  { id:'6-end', phase:6, type:'speak',
    text:"¡La presentación ha terminado! Acaban de descubrir todas las funcionalidades de INSPECTO DQI: panel de control con KPIs en tiempo real, configuración flexible, gestión de equipos, proyectos con diagrama de Gantt, actividades y tareas, inspecciones digitales con formularios de campo, wizard de no conformidad completo en 5 pasos con análisis de causas y firma electrónica, planes de control de calidad, seguimiento de proveedores CFSI, acciones correctivas con costes, biblioteca documental, trazabilidad completa y estadísticas avanzadas. Más de 500 empresas en 6 países confían en INSPECTO DQI para digitalizar su gestión de calidad. ¡Exploren la plataforma libremente o soliciten una demostración personalizada!",
    delayAfter:6000, endDemo:true },
]
