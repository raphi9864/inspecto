/* ═══════════════════════════════════════════════════════════════
   Overview / Home-global data — factory functions with i18n.
   Pass the i18next t function where translations are needed.
   ═══════════════════════════════════════════════════════════════ */

export function getOverviewKPI(t) {
  return [
    {
      key: 'projects',
      title: t('data.overview.projects'),
      sub: t('data.overview.ongoingArchived'),
      total: 7,
      gradient: 'hkpi-blue',
      donut: {
        labels: [t('data.status.ongoing'), t('data.status.archived')],
        data: [4, 3],
        colors: ['#2196f3', '#CBD5E0'],
      },
      legend: [
        { dot: '#2196f3', label: t('data.status.ongoing'), val: '4', pct: '57%' },
        { dot: '#CBD5E0', label: t('data.status.archived'), val: '3', pct: '43%' },
      ],
    },
    {
      key: 'inspections',
      title: t('data.overview.inspectionsAudits'),
      sub: t('data.overview.openedPendingOverdueClosed'),
      total: 388,
      gradient: 'hkpi-green',
      donut: {
        labels: [t('data.status.opened'), t('data.status.pending'), t('data.status.overdue'), t('data.status.closed')],
        data: [2, 29, 350, 9],
        colors: ['#43a047', '#fb8c00', '#e53e3e', '#CBD5E0'],
      },
      legend: [
        { dot: '#43a047', label: t('data.status.opened'), val: '0', pct: '0%' },
        { dot: '#fb8c00', label: t('data.status.pending'), val: '29', pct: '7%' },
        { dot: '#e53e3e', label: t('data.status.overdue'), val: '350', pct: '90%' },
        { dot: '#CBD5E0', label: t('data.status.closed'), val: '9', pct: '2%' },
      ],
    },
    {
      key: 'nc',
      title: t('data.overview.ncFindings'),
      sub: t('data.overview.openedPendingOverdueClosed'),
      total: 108,
      gradient: 'hkpi-orange',
      donut: {
        labels: [t('data.status.opened'), t('data.status.pending'), t('data.status.overdue'), t('data.status.closed')],
        data: [23, 81, 0, 4],
        colors: ['#e53e3e', '#fb8c00', '#2d3748', '#CBD5E0'],
      },
      legend: [
        { dot: '#e53e3e', label: t('data.status.opened'), val: '23', pct: '21%' },
        { dot: '#fb8c00', label: t('data.status.pending'), val: '81', pct: '75%' },
        { dot: '#2d3748', label: t('data.status.overdue'), val: '0', pct: '0%' },
        { dot: '#CBD5E0', label: t('data.status.closed'), val: '4', pct: '4%' },
      ],
    },
    {
      key: 'actions',
      title: t('data.overview.actions'),
      sub: t('data.overview.openedPendingOverdueClosed'),
      total: 35,
      gradient: 'hkpi-purple',
      donut: {
        labels: [t('data.status.opened'), t('data.status.pending'), t('data.status.overdue'), t('data.status.closed')],
        data: [0, 19, 15, 1],
        colors: ['#43a047', '#fb8c00', '#e53e3e', '#CBD5E0'],
      },
      legend: [
        { dot: '#43a047', label: t('data.status.opened'), val: '0', pct: '0%' },
        { dot: '#fb8c00', label: t('data.status.pending'), val: '19', pct: '54%' },
        { dot: '#e53e3e', label: t('data.status.overdue'), val: '15', pct: '43%' },
        { dot: '#CBD5E0', label: t('data.status.closed'), val: '1', pct: '3%' },
      ],
    },
  ]
}

export function getOverviewProjects() {
  return [
    { id: 1, name: 'ALLIA — Maintenance des \u00e9quipements ateliers', company: 'INSPECTO', progress: 0, remainingTasks: 4, findings: 1 },
    { id: 2, name: 'Transformateur de vapeur — Site Lyon', company: 'INSPECTO', progress: 16, remainingTasks: 15, findings: 0 },
    { id: 3, name: 'Jupiter Bach', company: 'INSPECTO', progress: 0, remainingTasks: 5, findings: 3 },
    { id: 4, name: 'BRAKE manufacturing Alstom', company: 'INSPECTO', progress: 0, remainingTasks: 0, findings: 0 },
  ]
}

export function getIncomingTasks(t) {
  return [
    { id: 1, title: t('data.taskTitles.steelPlates'), dates: 'From 05-09-2026 to 02-10-2026', activity: t('data.activityNames.procurement'), project: 'Transformateur de vapeur — Site Lyon', company: 'INSPECTO' },
    { id: 2, title: t('data.taskTitles.weldingSpecification'), dates: 'From 06-09-2026 to 30-10-2026', activity: t('data.activityNames.engineering'), project: 'Transformateur de vapeur — Site Lyon', company: 'INSPECTO' },
    { id: 3, title: t('data.taskTitles.dishedHeads'), dates: 'From 19-09-2026 to 07-11-2026', activity: t('data.activityNames.procurement'), project: 'Transformateur de vapeur — Site Lyon', company: 'INSPECTO' },
    { id: 4, title: t('data.taskTitles.inspectionControlPlan'), dates: 'From 02-10-2026 to 17-11-2026', activity: t('data.activityNames.engineering'), project: 'Transformateur de vapeur — Site Lyon', company: 'INSPECTO' },
  ]
}
