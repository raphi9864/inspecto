/* ═══════════════════════════════════════════════════════════════
   Fake inspections data — factory function with i18n.
   Pass the i18next t function for translated status / names.
   ═══════════════════════════════════════════════════════════════ */

export function getInspections(t) {
  return [
    { id: "INS-2026-001", name: "Fabrication moteur HT \u2013 1", startDate: "18-03-2026 16:50", endDate: "18-03-2026 17:50", status: t('data.status.overdue').toUpperCase(), responses: 0 },
    { id: "INS-2026-002", name: "ABB France \u2013 D\u00e9mo 3", startDate: "13-01-2026 16:38", endDate: "13-01-2026 17:38", status: t('data.status.overdue').toUpperCase(), responses: 0 },
    { id: "INS-2026-003", name: t('data.inspectionNames.bearingVerification'), startDate: "13-01-2026 16:34", endDate: "14-01-2026 00:00", status: t('data.status.overdue').toUpperCase(), responses: 2 },
    { id: "INS-2026-004", name: "ABB France \u2013 D\u00e9mo 2", startDate: "13-01-2026 16:32", endDate: "13-01-2026 17:32", status: t('data.status.closed').toUpperCase(), responses: 1 },
    { id: "INS-2026-005", name: t('data.inspectionNames.managementAudit'), startDate: "12-01-2026 14:00", endDate: "12-01-2026 16:00", status: t('data.status.overdue').toUpperCase(), responses: 0 },
    { id: "INS-2025-001", name: "ABB France \u2013 D\u00e9mo 1", startDate: "15-09-2025 14:26", endDate: "15-09-2025 15:26", status: t('data.status.overdue').toUpperCase(), responses: 0 },
  ]
}

export const FAKE_INSPECTION_COUNTERS = {
  ongoing: 0,
  overdue: 141,
  pending: 0,
  closed: 2,
}
