/* ═══════════════════════════════════════════════════════════════
   Per-project dashboard data — each project has unique KPI,
   detail, Gantt, inspections and activity data
   ═══════════════════════════════════════════════════════════════ */

export const PROJECT_DATA = {
  /* ─── 1. Fabrication moteur HT ─── */
  1: {
    kpi: {
      progress: 42,
      actions: {
        total: 11,
        breakdown: [
          { label: "Opened", count: 0,  color: "#38a169" },
          { label: "Overdue", count: 2, color: "#CC0000" },
          { label: "Pending", count: 9, color: "#dd6b20" },
          { label: "Closed",  count: 0, color: "#718096" },
        ]
      },
      inspections: {
        total: 143,
        breakdown: [
          { label: "Opened",  count: 2,   color: "#38a169" },
          { label: "Pending", count: 38,  color: "#dd6b20" },
          { label: "Overdue", count: 141, color: "#CC0000" },
          { label: "Closed",  count: 11,  color: "#718096" },
        ]
      },
      findings: {
        total: 42,
        breakdown: [
          { label: "Opened",  count: 4,  color: "#38a169" },
          { label: "Pending", count: 34, color: "#dd6b20" },
          { label: "Overdue", count: 0,  color: "#CC0000" },
          { label: "Closed",  count: 4,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Fabrication moteur HT",
      startDate: "08-09-2024",
      endDate: "08-09-2025",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=300&fit=crop",
      currentActivity: { label: "INSPECTION-1", status: "Overdue", date: "September 8, 2024 — September 20, 2024" },
    },
    gantt: [
      { id: 1, label: "Engineering & Design",       start: 0,  duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 2, label: "Material Procurement",       start: 1,  duration: 4,  progress: 85,  color: "#38a169" },
      { id: 3, label: "Fabrication Phase 1",        start: 3,  duration: 3,  progress: 60,  color: "#dd6b20" },
      { id: 4, label: "Quality Inspections",        start: 4,  duration: 5,  progress: 30,  color: "#CC0000" },
      { id: 5, label: "Fabrication Phase 2",        start: 6,  duration: 3,  progress: 10,  color: "#805ad5" },
      { id: 6, label: "Assembly & Integration",     start: 8,  duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, label: "Final Testing & Validation", start: 9,  duration: 3,  progress: 0,   color: "#e53e3e" },
    ],
    months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  },

  /* ─── 2. Jupiter Bach ─── */
  2: {
    kpi: {
      progress: 78,
      actions: {
        total: 5,
        breakdown: [
          { label: "Opened", count: 1,  color: "#38a169" },
          { label: "Overdue", count: 0, color: "#CC0000" },
          { label: "Pending", count: 2, color: "#dd6b20" },
          { label: "Closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 64,
        breakdown: [
          { label: "Opened",  count: 5,  color: "#38a169" },
          { label: "Pending", count: 12, color: "#dd6b20" },
          { label: "Overdue", count: 8,  color: "#CC0000" },
          { label: "Closed",  count: 39, color: "#718096" },
        ]
      },
      findings: {
        total: 18,
        breakdown: [
          { label: "Opened",  count: 2,  color: "#38a169" },
          { label: "Pending", count: 5,  color: "#dd6b20" },
          { label: "Overdue", count: 1,  color: "#CC0000" },
          { label: "Closed",  count: 10, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Jupiter Bach",
      startDate: "15-01-2025",
      endDate: "15-01-2026",
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=300&fit=crop",
      currentActivity: { label: "AUDIT-FOURNISSEUR-3", status: "Pending", date: "March 1, 2025 — March 15, 2025" },
    },
    gantt: [
      { id: 1, label: "Supplier Qualification",  start: 0, duration: 2,  progress: 100, color: "#38a169" },
      { id: 2, label: "Incoming Material Audit",  start: 1, duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 3, label: "Production Monitoring",    start: 3, duration: 5,  progress: 80,  color: "#dd6b20" },
      { id: 4, label: "In-Process Inspection",    start: 4, duration: 4,  progress: 65,  color: "#CC0000" },
      { id: 5, label: "Final Product Audit",      start: 8, duration: 2,  progress: 20,  color: "#805ad5" },
      { id: 6, label: "Certification & Delivery", start: 10, duration: 2, progress: 0,   color: "#00897b" },
    ],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
  },

  /* ─── 3. Pilatus PC21 — Projet Raphy ─── */
  3: {
    kpi: {
      progress: 15,
      actions: {
        total: 23,
        breakdown: [
          { label: "Opened", count: 8,  color: "#38a169" },
          { label: "Overdue", count: 5, color: "#CC0000" },
          { label: "Pending", count: 10, color: "#dd6b20" },
          { label: "Closed",  count: 0,  color: "#718096" },
        ]
      },
      inspections: {
        total: 87,
        breakdown: [
          { label: "Opened",  count: 12, color: "#38a169" },
          { label: "Pending", count: 45, color: "#dd6b20" },
          { label: "Overdue", count: 28, color: "#CC0000" },
          { label: "Closed",  count: 2,  color: "#718096" },
        ]
      },
      findings: {
        total: 31,
        breakdown: [
          { label: "Opened",  count: 9,  color: "#38a169" },
          { label: "Pending", count: 18, color: "#dd6b20" },
          { label: "Overdue", count: 4,  color: "#CC0000" },
          { label: "Closed",  count: 0,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Pilatus PC21 \u2013 Projet Raphy",
      startDate: "01-03-2026",
      endDate: "01-03-2027",
      image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=300&fit=crop",
      currentActivity: { label: "WING-ASSEMBLY-2", status: "Overdue", date: "April 10, 2026 — May 28, 2026" },
    },
    gantt: [
      { id: 1, label: "Fuselage Structure",       start: 0, duration: 4,  progress: 30,  color: "#CC0000" },
      { id: 2, label: "Wing Assembly",             start: 2, duration: 5,  progress: 15,  color: "#2ea3f2" },
      { id: 3, label: "Avionics Integration",      start: 4, duration: 3,  progress: 0,   color: "#805ad5" },
      { id: 4, label: "Landing Gear Installation", start: 5, duration: 2,  progress: 0,   color: "#dd6b20" },
      { id: 5, label: "Engine Mount & Testing",    start: 7, duration: 3,  progress: 0,   color: "#38a169" },
      { id: 6, label: "Flight Test Preparation",   start: 9, duration: 2,  progress: 0,   color: "#e53e3e" },
      { id: 7, label: "Certification Docs",        start: 10, duration: 2, progress: 0,   color: "#00897b" },
    ],
    months: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },

  /* ─── 4. ABB France — Pièce N2 ─── */
  4: {
    kpi: {
      progress: 61,
      actions: {
        total: 8,
        breakdown: [
          { label: "Opened", count: 0,  color: "#38a169" },
          { label: "Overdue", count: 1, color: "#CC0000" },
          { label: "Pending", count: 3, color: "#dd6b20" },
          { label: "Closed",  count: 4, color: "#718096" },
        ]
      },
      inspections: {
        total: 52,
        breakdown: [
          { label: "Opened",  count: 0,  color: "#38a169" },
          { label: "Pending", count: 7,  color: "#dd6b20" },
          { label: "Overdue", count: 14, color: "#CC0000" },
          { label: "Closed",  count: 31, color: "#718096" },
        ]
      },
      findings: {
        total: 9,
        breakdown: [
          { label: "Opened",  count: 0, color: "#38a169" },
          { label: "Pending", count: 2, color: "#dd6b20" },
          { label: "Overdue", count: 1, color: "#CC0000" },
          { label: "Closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "ABB France \u2013 Pi\u00e8ce N2",
      startDate: "12-06-2024",
      endDate: "12-06-2025",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=300&fit=crop",
      currentActivity: { label: "WINDING-INSP-4", status: "Pending", date: "January 5, 2025 — February 12, 2025" },
    },
    gantt: [
      { id: 1, label: "Core Lamination",         start: 0, duration: 3,  progress: 100, color: "#805ad5" },
      { id: 2, label: "Winding Process",          start: 2, duration: 4,  progress: 90,  color: "#2ea3f2" },
      { id: 3, label: "Insulation Testing",       start: 4, duration: 2,  progress: 60,  color: "#dd6b20" },
      { id: 4, label: "Assembly of Stator",       start: 5, duration: 3,  progress: 40,  color: "#38a169" },
      { id: 5, label: "High Voltage Testing",     start: 7, duration: 2,  progress: 10,  color: "#CC0000" },
      { id: 6, label: "Painting & Finishing",     start: 9, duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, label: "Customer Acceptance Test", start: 10, duration: 2, progress: 0,   color: "#e53e3e" },
    ],
    months: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },

  /* ─── 5. Transformateur de vapeur ─── */
  5: {
    kpi: {
      progress: 16,
      actions: {
        total: 19,
        breakdown: [
          { label: "Opened", count: 6,  color: "#38a169" },
          { label: "Overdue", count: 3, color: "#CC0000" },
          { label: "Pending", count: 8, color: "#dd6b20" },
          { label: "Closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 38,
        breakdown: [
          { label: "Opened",  count: 10, color: "#38a169" },
          { label: "Pending", count: 18, color: "#dd6b20" },
          { label: "Overdue", count: 7,  color: "#CC0000" },
          { label: "Closed",  count: 3,  color: "#718096" },
        ]
      },
      findings: {
        total: 14,
        breakdown: [
          { label: "Opened",  count: 5, color: "#38a169" },
          { label: "Pending", count: 7, color: "#dd6b20" },
          { label: "Overdue", count: 2, color: "#CC0000" },
          { label: "Closed",  count: 0, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Transformateur de vapeur",
      startDate: "26-01-2026",
      endDate: "26-01-2027",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=300&fit=crop",
      currentActivity: { label: "VESSEL-WELDING-1", status: "Overdue", date: "March 15, 2026 — April 30, 2026" },
    },
    gantt: [
      { id: 1, label: "Pressure Vessel Design",     start: 0, duration: 3,  progress: 50,  color: "#dd6b20" },
      { id: 2, label: "Steel Plate Procurement",     start: 1, duration: 3,  progress: 30,  color: "#38a169" },
      { id: 3, label: "Shell & Head Forming",        start: 3, duration: 4,  progress: 10,  color: "#2ea3f2" },
      { id: 4, label: "Welding & NDE",               start: 4, duration: 5,  progress: 0,   color: "#CC0000" },
      { id: 5, label: "Heat Treatment",              start: 8, duration: 2,  progress: 0,   color: "#805ad5" },
      { id: 6, label: "Hydrostatic Testing",         start: 9, duration: 2,  progress: 0,   color: "#00897b" },
      { id: 7, label: "Insulation & Delivery",       start: 10, duration: 2, progress: 0,   color: "#e53e3e" },
    ],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
  },

  /* ─── 6. ALLIA — Maintenance EQUI ─── */
  6: {
    kpi: {
      progress: 88,
      actions: {
        total: 3,
        breakdown: [
          { label: "Opened", count: 0,  color: "#38a169" },
          { label: "Overdue", count: 0, color: "#CC0000" },
          { label: "Pending", count: 1, color: "#dd6b20" },
          { label: "Closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 156,
        breakdown: [
          { label: "Opened",  count: 0,   color: "#38a169" },
          { label: "Pending", count: 4,   color: "#dd6b20" },
          { label: "Overdue", count: 12,  color: "#CC0000" },
          { label: "Closed",  count: 140, color: "#718096" },
        ]
      },
      findings: {
        total: 7,
        breakdown: [
          { label: "Opened",  count: 0, color: "#38a169" },
          { label: "Pending", count: 1, color: "#dd6b20" },
          { label: "Overdue", count: 0, color: "#CC0000" },
          { label: "Closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "ALLIA \u2013 Maintenance EQUI",
      startDate: "03-09-2025",
      endDate: "03-03-2026",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
      currentActivity: { label: "PREVENTIVE-MAINT-12", status: "Closed", date: "February 1, 2026 — February 15, 2026" },
    },
    gantt: [
      { id: 1, label: "Equipment Inventory Audit",      start: 0, duration: 2,  progress: 100, color: "#2d3748" },
      { id: 2, label: "Preventive Maintenance Plan",    start: 1, duration: 3,  progress: 100, color: "#2ea3f2" },
      { id: 3, label: "Corrective Interventions",       start: 2, duration: 4,  progress: 95,  color: "#CC0000" },
      { id: 4, label: "Spare Parts Procurement",        start: 3, duration: 3,  progress: 90,  color: "#38a169" },
      { id: 5, label: "Workshop Safety Inspection",     start: 5, duration: 2,  progress: 80,  color: "#dd6b20" },
      { id: 6, label: "Final Report & Documentation",   start: 7, duration: 1,  progress: 50,  color: "#805ad5" },
    ],
    months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },

  /* ─── 7. BRAKE manufacturing Alstom ─── */
  7: {
    kpi: {
      progress: 33,
      actions: {
        total: 15,
        breakdown: [
          { label: "Opened", count: 4,  color: "#38a169" },
          { label: "Overdue", count: 3, color: "#CC0000" },
          { label: "Pending", count: 6, color: "#dd6b20" },
          { label: "Closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 72,
        breakdown: [
          { label: "Opened",  count: 8,  color: "#38a169" },
          { label: "Pending", count: 22, color: "#dd6b20" },
          { label: "Overdue", count: 18, color: "#CC0000" },
          { label: "Closed",  count: 24, color: "#718096" },
        ]
      },
      findings: {
        total: 28,
        breakdown: [
          { label: "Opened",  count: 6,  color: "#38a169" },
          { label: "Pending", count: 12, color: "#dd6b20" },
          { label: "Overdue", count: 3,  color: "#CC0000" },
          { label: "Closed",  count: 7,  color: "#718096" },
        ]
      },
    },
    detail: {
      name: "BRAKE manufacturing Alstom",
      startDate: "10-04-2025",
      endDate: "10-04-2026",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=300&fit=crop",
      currentActivity: { label: "CALIPER-MACHINING-3", status: "Overdue", date: "October 1, 2025 — November 20, 2025" },
    },
    gantt: [
      { id: 1, label: "Cast Iron Sourcing",          start: 0, duration: 2,  progress: 100, color: "#00897b" },
      { id: 2, label: "Caliper Machining",            start: 1, duration: 4,  progress: 70,  color: "#2ea3f2" },
      { id: 3, label: "Friction Pad Production",      start: 3, duration: 3,  progress: 40,  color: "#dd6b20" },
      { id: 4, label: "Hydraulic Unit Assembly",       start: 4, duration: 3,  progress: 20,  color: "#805ad5" },
      { id: 5, label: "Brake System Integration",      start: 6, duration: 3,  progress: 5,   color: "#CC0000" },
      { id: 6, label: "Dynamometer Testing",           start: 8, duration: 2,  progress: 0,   color: "#38a169" },
      { id: 7, label: "Homologation & Shipping",       start: 10, duration: 2, progress: 0,   color: "#e53e3e" },
    ],
    months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  },

  /* ─── 8. Audit Supplier ISO 19443 ─── */
  8: {
    kpi: {
      progress: 95,
      actions: {
        total: 2,
        breakdown: [
          { label: "Opened", count: 0,  color: "#38a169" },
          { label: "Overdue", count: 0, color: "#CC0000" },
          { label: "Pending", count: 0, color: "#dd6b20" },
          { label: "Closed",  count: 2, color: "#718096" },
        ]
      },
      inspections: {
        total: 24,
        breakdown: [
          { label: "Opened",  count: 0,  color: "#38a169" },
          { label: "Pending", count: 1,  color: "#dd6b20" },
          { label: "Overdue", count: 0,  color: "#CC0000" },
          { label: "Closed",  count: 23, color: "#718096" },
        ]
      },
      findings: {
        total: 6,
        breakdown: [
          { label: "Opened",  count: 0, color: "#38a169" },
          { label: "Pending", count: 0, color: "#dd6b20" },
          { label: "Overdue", count: 0, color: "#CC0000" },
          { label: "Closed",  count: 6, color: "#718096" },
        ]
      },
    },
    detail: {
      name: "Audit Supplier ISO 19443",
      startDate: "01-05-2025",
      endDate: "01-08-2025",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop",
      currentActivity: { label: "CLOSING-MEETING", status: "Closed", date: "July 20, 2025 — July 25, 2025" },
    },
    gantt: [
      { id: 1, label: "Document Review",              start: 0, duration: 2,  progress: 100, color: "#e53e3e" },
      { id: 2, label: "On-Site Audit Week 1",         start: 2, duration: 1,  progress: 100, color: "#2ea3f2" },
      { id: 3, label: "On-Site Audit Week 2",         start: 3, duration: 1,  progress: 100, color: "#2ea3f2" },
      { id: 4, label: "Non-Conformity Resolution",    start: 4, duration: 3,  progress: 100, color: "#CC0000" },
      { id: 5, label: "Corrective Action Follow-Up",  start: 5, duration: 2,  progress: 90,  color: "#dd6b20" },
      { id: 6, label: "Final Report & Certification",  start: 7, duration: 1,  progress: 80,  color: "#38a169" },
    ],
    months: ["May", "Jun", "Jul", "Aug"],
  },
}

/* Helper to get project data with a fallback */
export function getProjectData(projectId) {
  return PROJECT_DATA[projectId] || PROJECT_DATA[1]
}
