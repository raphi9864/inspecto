/* ═══════════════════════════════════════════════════════════════
   Per-project dashboard data — each project has unique KPI,
   detail, Gantt, inspections and activity data.
   i18n: call getProjectData(projectId, t) with the i18next t function.
   ═══════════════════════════════════════════════════════════════ */

const PROJECT_DATA = {
  /* ─── 1. Fabrication moteur HT ─── */
  1: {
    kpi: {
      progress: 42,
      actions: {
        total: 11,
        breakdown: [
          { statusKey: "opened",  count: 0,  color: "#38a169" },
          { statusKey: "overdue", count: 2,  color: "#CC0000" },
          { statusKey: "pending", count: 9,  color: "#dd6b20" },
          { statusKey: "closed",  count: 0,  color: "#718096" },
        ]
      },
      inspections: {
        total: 143,
        breakdown: [
          { statusKey: "opened",  count: 2,   color: "#38a169" },
          { statusKey: "pending", count: 38,  color: "#dd6b20" },
          { statusKey: "overdue", count: 141, color: "#CC0000" },
          { statusKey: "closed",  count: 11,  color: "#718096" },
        ]
      },
      findings: {
        total: 42,
        breakdown: [
          { statusKey: "opened",  count: 4,  color: "#38a169" },
          { statusKey: "pending", count: 34, color: "#dd6b20" },
          { statusKey: "overdue", count: 0,  color: "#CC0000" },
          { statusKey: "closed",  count: 4,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Fabrication moteur HT",
      startDate: "08-09-2024",
      endDate: "08-09-2025",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=300&fit=crop",
      currentActivity: { label: "INSPECTION-1", statusKey: "overdue", date: "September 8, 2024 — September 20, 2024" },
    },
    gantt: [
      { id: 1, labelKey: "engineeringDesign",       start: 0,  duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 2, labelKey: "materialProcurement",      start: 1,  duration: 4,  progress: 85,  color: "#38a169" },
      { id: 3, labelKey: "fabricationPhase1",         start: 3,  duration: 3,  progress: 60,  color: "#dd6b20" },
      { id: 4, labelKey: "qualityInspections",        start: 4,  duration: 5,  progress: 30,  color: "#CC0000" },
      { id: 5, labelKey: "fabricationPhase2",         start: 6,  duration: 3,  progress: 10,  color: "#805ad5" },
      { id: 6, labelKey: "assemblyIntegration",       start: 8,  duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, labelKey: "finalTestingValidation",    start: 9,  duration: 3,  progress: 0,   color: "#e53e3e" },
    ],
    months: ["sep", "oct", "nov", "dec", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep"],
  },

  /* ─── 2. Jupiter Bach ─── */
  2: {
    kpi: {
      progress: 78,
      actions: {
        total: 5,
        breakdown: [
          { statusKey: "opened",  count: 1, color: "#38a169" },
          { statusKey: "overdue", count: 0, color: "#CC0000" },
          { statusKey: "pending", count: 2, color: "#dd6b20" },
          { statusKey: "closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 64,
        breakdown: [
          { statusKey: "opened",  count: 5,  color: "#38a169" },
          { statusKey: "pending", count: 12, color: "#dd6b20" },
          { statusKey: "overdue", count: 8,  color: "#CC0000" },
          { statusKey: "closed",  count: 39, color: "#718096" },
        ]
      },
      findings: {
        total: 18,
        breakdown: [
          { statusKey: "opened",  count: 2,  color: "#38a169" },
          { statusKey: "pending", count: 5,  color: "#dd6b20" },
          { statusKey: "overdue", count: 1,  color: "#CC0000" },
          { statusKey: "closed",  count: 10, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Jupiter Bach",
      startDate: "15-01-2025",
      endDate: "15-01-2026",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=300&fit=crop",
      currentActivity: { label: "AUDIT-FOURNISSEUR-3", statusKey: "pending", date: "March 1, 2025 — March 15, 2025" },
    },
    gantt: [
      { id: 1, labelKey: "supplierQualification",   start: 0,  duration: 2,  progress: 100, color: "#38a169" },
      { id: 2, labelKey: "incomingMaterialAudit",    start: 1,  duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 3, labelKey: "productionMonitoring",     start: 3,  duration: 5,  progress: 80,  color: "#dd6b20" },
      { id: 4, labelKey: "inProcessInspection",      start: 4,  duration: 4,  progress: 65,  color: "#CC0000" },
      { id: 5, labelKey: "finalProductAudit",        start: 8,  duration: 2,  progress: 20,  color: "#805ad5" },
      { id: 6, labelKey: "certificationDelivery",    start: 10, duration: 2,  progress: 0,   color: "#00897b" },
    ],
    months: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan"],
  },

  /* ─── 3. Pilatus PC21 — Projet Raphy ─── */
  3: {
    kpi: {
      progress: 15,
      actions: {
        total: 23,
        breakdown: [
          { statusKey: "opened",  count: 8,  color: "#38a169" },
          { statusKey: "overdue", count: 5,  color: "#CC0000" },
          { statusKey: "pending", count: 10, color: "#dd6b20" },
          { statusKey: "closed",  count: 0,  color: "#718096" },
        ]
      },
      inspections: {
        total: 87,
        breakdown: [
          { statusKey: "opened",  count: 12, color: "#38a169" },
          { statusKey: "pending", count: 45, color: "#dd6b20" },
          { statusKey: "overdue", count: 28, color: "#CC0000" },
          { statusKey: "closed",  count: 2,  color: "#718096" },
        ]
      },
      findings: {
        total: 31,
        breakdown: [
          { statusKey: "opened",  count: 9,  color: "#38a169" },
          { statusKey: "pending", count: 18, color: "#dd6b20" },
          { statusKey: "overdue", count: 4,  color: "#CC0000" },
          { statusKey: "closed",  count: 0,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Pilatus PC21 \u2013 Projet Raphy",
      startDate: "01-03-2026",
      endDate: "01-03-2027",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=300&fit=crop",
      currentActivity: { label: "WING-ASSEMBLY-2", statusKey: "overdue", date: "April 10, 2026 — May 28, 2026" },
    },
    gantt: [
      { id: 1, labelKey: "fuselageStructure",        start: 0,  duration: 4,  progress: 30,  color: "#CC0000" },
      { id: 2, labelKey: "wingAssembly",              start: 2,  duration: 5,  progress: 15,  color: "#2ea3f2" },
      { id: 3, labelKey: "avionicsIntegration",       start: 4,  duration: 3,  progress: 0,   color: "#805ad5" },
      { id: 4, labelKey: "landingGearInstallation",   start: 5,  duration: 2,  progress: 0,   color: "#dd6b20" },
      { id: 5, labelKey: "engineMountTesting",        start: 7,  duration: 3,  progress: 0,   color: "#38a169" },
      { id: 6, labelKey: "flightTestPreparation",     start: 9,  duration: 2,  progress: 0,   color: "#e53e3e" },
      { id: 7, labelKey: "certificationDocs",         start: 10, duration: 2,  progress: 0,   color: "#00897b" },
    ],
    months: ["mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"],
  },

  /* ─── 4. ABB France — Pièce N2 ─── */
  4: {
    kpi: {
      progress: 61,
      actions: {
        total: 8,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "overdue", count: 1, color: "#CC0000" },
          { statusKey: "pending", count: 3, color: "#dd6b20" },
          { statusKey: "closed",  count: 4, color: "#718096" },
        ]
      },
      inspections: {
        total: 52,
        breakdown: [
          { statusKey: "opened",  count: 0,  color: "#38a169" },
          { statusKey: "pending", count: 7,  color: "#dd6b20" },
          { statusKey: "overdue", count: 14, color: "#CC0000" },
          { statusKey: "closed",  count: 31, color: "#718096" },
        ]
      },
      findings: {
        total: 9,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "pending", count: 2, color: "#dd6b20" },
          { statusKey: "overdue", count: 1, color: "#CC0000" },
          { statusKey: "closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "ABB France \u2013 Pi\u00e8ce N2",
      startDate: "12-06-2024",
      endDate: "12-06-2025",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=300&fit=crop",
      currentActivity: { label: "WINDING-INSP-4", statusKey: "pending", date: "January 5, 2025 — February 12, 2025" },
    },
    gantt: [
      { id: 1, labelKey: "coreLamination",           start: 0,  duration: 3,  progress: 100, color: "#805ad5" },
      { id: 2, labelKey: "windingProcess",            start: 2,  duration: 4,  progress: 90,  color: "#2ea3f2" },
      { id: 3, labelKey: "insulationTesting",         start: 4,  duration: 2,  progress: 60,  color: "#dd6b20" },
      { id: 4, labelKey: "assemblyOfStator",          start: 5,  duration: 3,  progress: 40,  color: "#38a169" },
      { id: 5, labelKey: "highVoltageTesting",        start: 7,  duration: 2,  progress: 10,  color: "#CC0000" },
      { id: 6, labelKey: "paintingFinishing",         start: 9,  duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, labelKey: "customerAcceptanceTest",    start: 10, duration: 2,  progress: 0,   color: "#e53e3e" },
    ],
    months: ["jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar", "apr", "may", "jun"],
  },

  /* ─── 5. Transformateur de vapeur ─── */
  5: {
    kpi: {
      progress: 16,
      actions: {
        total: 19,
        breakdown: [
          { statusKey: "opened",  count: 6, color: "#38a169" },
          { statusKey: "overdue", count: 3, color: "#CC0000" },
          { statusKey: "pending", count: 8, color: "#dd6b20" },
          { statusKey: "closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 38,
        breakdown: [
          { statusKey: "opened",  count: 10, color: "#38a169" },
          { statusKey: "pending", count: 18, color: "#dd6b20" },
          { statusKey: "overdue", count: 7,  color: "#CC0000" },
          { statusKey: "closed",  count: 3,  color: "#718096" },
        ]
      },
      findings: {
        total: 14,
        breakdown: [
          { statusKey: "opened",  count: 5, color: "#38a169" },
          { statusKey: "pending", count: 7, color: "#dd6b20" },
          { statusKey: "overdue", count: 2, color: "#CC0000" },
          { statusKey: "closed",  count: 0, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Transformateur de vapeur",
      startDate: "26-01-2026",
      endDate: "26-01-2027",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=300&fit=crop",
      currentActivity: { label: "VESSEL-WELDING-1", statusKey: "overdue", date: "March 15, 2026 — April 30, 2026" },
    },
    gantt: [
      { id: 1, labelKey: "pressureVesselDesign",     start: 0,  duration: 3,  progress: 50,  color: "#dd6b20" },
      { id: 2, labelKey: "steelPlateProcurement",     start: 1,  duration: 3,  progress: 30,  color: "#38a169" },
      { id: 3, labelKey: "shellHeadForming",           start: 3,  duration: 4,  progress: 10,  color: "#2ea3f2" },
      { id: 4, labelKey: "weldingNDE",                 start: 4,  duration: 5,  progress: 0,   color: "#CC0000" },
      { id: 5, labelKey: "heatTreatment",              start: 8,  duration: 2,  progress: 0,   color: "#805ad5" },
      { id: 6, labelKey: "hydrostaticTesting",         start: 9,  duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, labelKey: "insulationDelivery",         start: 10, duration: 2,  progress: 0,   color: "#e53e3e" },
    ],
    months: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan"],
  },

  /* ─── 6. ALLIA — Maintenance EQUI ─── */
  6: {
    kpi: {
      progress: 88,
      actions: {
        total: 3,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "overdue", count: 0, color: "#CC0000" },
          { statusKey: "pending", count: 1, color: "#dd6b20" },
          { statusKey: "closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 156,
        breakdown: [
          { statusKey: "opened",  count: 0,   color: "#38a169" },
          { statusKey: "pending", count: 4,   color: "#dd6b20" },
          { statusKey: "overdue", count: 12,  color: "#CC0000" },
          { statusKey: "closed",  count: 140, color: "#718096" },
        ]
      },
      findings: {
        total: 7,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "pending", count: 1, color: "#dd6b20" },
          { statusKey: "overdue", count: 0, color: "#CC0000" },
          { statusKey: "closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "ALLIA \u2013 Maintenance EQUI",
      startDate: "03-09-2025",
      endDate: "03-03-2026",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      currentActivity: { label: "PREVENTIVE-MAINT-12", statusKey: "closed", date: "February 1, 2026 — February 15, 2026" },
    },
    gantt: [
      { id: 1, labelKey: "equipmentInventoryAudit",     start: 0, duration: 2,  progress: 100, color: "#2d3748" },
      { id: 2, labelKey: "preventiveMaintenancePlan",    start: 1, duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 3, labelKey: "correctiveInterventions",      start: 2, duration: 4,  progress: 95,  color: "#CC0000" },
      { id: 4, labelKey: "sparePartsProcurement",        start: 3, duration: 3,  progress: 90,  color: "#38a169" },
      { id: 5, labelKey: "workshopSafetyInspection",     start: 5, duration: 2,  progress: 80,  color: "#dd6b20" },
      { id: 6, labelKey: "finalReportDocumentation",     start: 7, duration: 1,  progress: 50,  color: "#805ad5" },
    ],
    months: ["sep", "oct", "nov", "dec", "jan", "feb", "mar"],
  },

  /* ─── 7. BRAKE manufacturing Alstom ─── */
  7: {
    kpi: {
      progress: 33,
      actions: {
        total: 15,
        breakdown: [
          { statusKey: "opened",  count: 4, color: "#38a169" },
          { statusKey: "overdue", count: 3, color: "#CC0000" },
          { statusKey: "pending", count: 6, color: "#dd6b20" },
          { statusKey: "closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 72,
        breakdown: [
          { statusKey: "opened",  count: 8,  color: "#38a169" },
          { statusKey: "pending", count: 22, color: "#dd6b20" },
          { statusKey: "overdue", count: 18, color: "#CC0000" },
          { statusKey: "closed",  count: 24, color: "#718096" },
        ]
      },
      findings: {
        total: 28,
        breakdown: [
          { statusKey: "opened",  count: 6,  color: "#38a169" },
          { statusKey: "pending", count: 12, color: "#dd6b20" },
          { statusKey: "overdue", count: 3,  color: "#CC0000" },
          { statusKey: "closed",  count: 7,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "BRAKE manufacturing Alstom",
      startDate: "10-04-2025",
      endDate: "10-04-2026",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=300&fit=crop",
      currentActivity: { label: "CALIPER-MACHINING-3", statusKey: "overdue", date: "October 1, 2025 — November 20, 2025" },
    },
    gantt: [
      { id: 1, labelKey: "castIronSourcing",           start: 0,  duration: 2,  progress: 100, color: "#00897b" },
      { id: 2, labelKey: "caliperMachining",            start: 1,  duration: 4,  progress: 70,  color: "#2ea3f2" },
      { id: 3, labelKey: "frictionPadProduction",       start: 3,  duration: 3,  progress: 40,  color: "#dd6b20" },
      { id: 4, labelKey: "hydraulicUnitAssembly",       start: 4,  duration: 3,  progress: 20,  color: "#805ad5" },
      { id: 5, labelKey: "brakeSystemIntegration",      start: 6,  duration: 3,  progress: 5,   color: "#CC0000" },
      { id: 6, labelKey: "dynamometerTesting",          start: 8,  duration: 2,  progress: 0,   color: "#38a169" },
      { id: 7, labelKey: "homologationShipping",        start: 10, duration: 2,  progress: 0,   color: "#e53e3e" },
    ],
    months: ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar", "apr"],
  },

  /* ─── 8. Audit Supplier ISO 19443 ─── */
  8: {
    kpi: {
      progress: 95,
      actions: {
        total: 2,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "overdue", count: 0, color: "#CC0000" },
          { statusKey: "pending", count: 0, color: "#dd6b20" },
          { statusKey: "closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 24,
        breakdown: [
          { statusKey: "opened",  count: 0,  color: "#38a169" },
          { statusKey: "pending", count: 1,  color: "#dd6b20" },
          { statusKey: "overdue", count: 0,  color: "#CC0000" },
          { statusKey: "closed",  count: 23, color: "#718096" },
        ]
      },
      findings: {
        total: 6,
        breakdown: [
          { statusKey: "opened",  count: 0, color: "#38a169" },
          { statusKey: "pending", count: 0, color: "#dd6b20" },
          { statusKey: "overdue", count: 0, color: "#CC0000" },
          { statusKey: "closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Audit Supplier ISO 19443",
      startDate: "01-05-2025",
      endDate: "01-08-2025",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop",
      currentActivity: { label: "CLOSING-MEETING", statusKey: "closed", date: "July 20, 2025 — July 25, 2025" },
    },
    gantt: [
      { id: 1, labelKey: "documentReview",                start: 0, duration: 2, progress: 100, color: "#e53e3e" },
      { id: 2, labelKey: "onSiteAuditWeek1",              start: 2, duration: 1, progress: 100, color: "#2ea3f2" },
      { id: 3, labelKey: "onSiteAuditWeek2",              start: 3, duration: 1, progress: 100, color: "#2ea3f2" },
      { id: 4, labelKey: "nonConformityResolution",        start: 4, duration: 3, progress: 100, color: "#CC0000" },
      { id: 5, labelKey: "correctiveActionFollowUp",       start: 5, duration: 2, progress: 90,  color: "#dd6b20" },
      { id: 6, labelKey: "finalReportCertification",       start: 7, duration: 1, progress: 80,  color: "#38a169" },
    ],
    months: ["may", "jun", "jul", "aug"],
  },
}

/* ─── Helpers ─── */

function translateBreakdown(bd, t) {
  return {
    ...bd,
    breakdown: bd.breakdown.map(b => ({
      ...b,
      label: t(`data.status.${b.statusKey}`),
    })),
  }
}

export function getProjectData(projectId, t) {
  const raw = PROJECT_DATA[projectId] || PROJECT_DATA[1]
  return {
    kpi: {
      progress: raw.kpi.progress,
      actions: translateBreakdown(raw.kpi.actions, t),
      inspections: translateBreakdown(raw.kpi.inspections, t),
      findings: translateBreakdown(raw.kpi.findings, t),
    },
    detail: {
      ...raw.detail,
      currentActivity: {
        ...raw.detail.currentActivity,
        status: t(`data.status.${raw.detail.currentActivity.statusKey}`),
      },
    },
    gantt: raw.gantt.map(g => ({ ...g, label: t(`data.gantt.${g.labelKey}`) })),
    months: raw.months.map(m => t(`data.months.${m}`)),
  }
}
