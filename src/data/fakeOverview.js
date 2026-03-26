export const FAKE_OVERVIEW_KPI = [
  {
    key: 'projects',
    title: 'Projects',
    sub: 'Ongoing / Archived',
    total: 7,
    gradient: 'hkpi-blue',
    donut: {
      labels: ['Ongoing', 'Archived'],
      data: [4, 3],
      colors: ['#2196f3', '#CBD5E0'],
    },
    legend: [
      { dot: '#2196f3', label: 'Ongoing', val: '4', pct: '57%' },
      { dot: '#CBD5E0', label: 'Archived', val: '3', pct: '43%' },
    ],
  },
  {
    key: 'inspections',
    title: 'Inspections / Audits',
    sub: 'Opened / Pending / Overdue / Close',
    total: 388,
    gradient: 'hkpi-green',
    donut: {
      labels: ['Opened', 'Pending', 'Overdue', 'Close'],
      data: [2, 29, 350, 9],
      colors: ['#43a047', '#fb8c00', '#e53e3e', '#CBD5E0'],
    },
    legend: [
      { dot: '#43a047', label: 'Opened', val: '0', pct: '0%' },
      { dot: '#fb8c00', label: 'Pending', val: '29', pct: '7%' },
      { dot: '#e53e3e', label: 'Overdue', val: '350', pct: '90%' },
      { dot: '#CBD5E0', label: 'Close', val: '9', pct: '2%' },
    ],
  },
  {
    key: 'nc',
    title: 'Non-conformities / Findings',
    sub: 'Opened / Pending / Overdue / Close',
    total: 108,
    gradient: 'hkpi-orange',
    donut: {
      labels: ['Opened', 'Pending', 'Overdue', 'Close'],
      data: [23, 81, 0, 4],
      colors: ['#e53e3e', '#fb8c00', '#2d3748', '#CBD5E0'],
    },
    legend: [
      { dot: '#e53e3e', label: 'Opened', val: '23', pct: '21%' },
      { dot: '#fb8c00', label: 'Pending', val: '81', pct: '75%' },
      { dot: '#2d3748', label: 'Overdue', val: '0', pct: '0%' },
      { dot: '#CBD5E0', label: 'Close', val: '4', pct: '4%' },
    ],
  },
  {
    key: 'actions',
    title: 'Actions',
    sub: 'Opened / Pending / Overdue / Close',
    total: 35,
    gradient: 'hkpi-purple',
    donut: {
      labels: ['Opened', 'Pending', 'Overdue', 'Close'],
      data: [0, 19, 15, 1],
      colors: ['#43a047', '#fb8c00', '#e53e3e', '#CBD5E0'],
    },
    legend: [
      { dot: '#43a047', label: 'Opened', val: '0', pct: '0%' },
      { dot: '#fb8c00', label: 'Pending', val: '19', pct: '54%' },
      { dot: '#e53e3e', label: 'Overdue', val: '15', pct: '43%' },
      { dot: '#CBD5E0', label: 'Close', val: '1', pct: '3%' },
    ],
  },
]

export const FAKE_OVERVIEW_PROJECTS = [
  { id: 1, name: 'ALLIA - MAINTENANCE DES EQUIPEMENTS ATELIERS - 2025-09-03', company: 'INSPECTO', progress: 0, remainingTasks: 4, findings: 1 },
  { id: 2, name: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO', progress: 16, remainingTasks: 15, findings: 0 },
  { id: 3, name: 'Jupiter Bach', company: 'INSPECTO', progress: 0, remainingTasks: 5, findings: 3 },
  { id: 4, name: 'BRAKE manufacturing Alstom', company: 'INSPECTO', progress: 0, remainingTasks: 0, findings: 0 },
]

export const FAKE_INCOMING_TASKS = [
  { id: 1, title: 'Toles', dates: 'From 05-09-2026 to 02-10-2026', activity: 'ACHAT', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { id: 2, title: 'Cahier de soudage', dates: 'From 06-09-2026 to 30-10-2026', activity: 'INGENIERIE', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { id: 3, title: 'Fonds bomb\u00e9s', dates: 'From 19-09-2026 to 07-11-2026', activity: 'ACHAT', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
  { id: 4, title: "Plan d'inspection et de contr\u00f4le", dates: 'From 02-10-2026 to 17-11-2026', activity: 'INGENIERIE', project: 'Transformateur de vapeur - 2026-01-26 13:50:57', company: 'INSPECTO' },
]
