/**
 * SAE Demo Script — Audit interne & GED
 * Language: Français (FR)
 * Used when ProductMode === 'sae'. Walks through the two new
 * SAE modules: /app/audit-workflow and /app/ged.
 */
export default [
  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — Bienvenue SAE + Dashboard
     ═══════════════════════════════════════════════════════════ */
  { id:'s1-0', phase:1, phaseTitle:'Bienvenue SAE', type:'speak',
    text:"Bonjour ! Bienvenue dans la démonstration Inspecto SAE. Je vais vous présenter les deux modules clés dédiés aux industries réglementées : l'audit interne ISO et la gestion électronique de documents. Plus de 500 comptes actifs nous font déjà confiance pour leurs audits de conformité. C'est parti !",
    delayAfter:1800 },

  { id:'s1-1', phase:1, type:'navigate', route:'/app/dashboard', transition:'prezi',
    waitForSelector:'[data-demo-target="home-page"]',
    speak:"Voici votre tableau de bord SAE. Contrairement au mode Inspecto classique, le contexte ici est celui d'un projet d'audit interne ISO 9001 · 19443 · AS/EN 9100. Toute l'interface s'adapte.",
    delayAfter:2600 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — Audit Workflow (5 tabs + Gantt + Traceability)
     ═══════════════════════════════════════════════════════════ */
  { id:'s2-0', phase:2, phaseTitle:"Audit Workflow", type:'navigate',
    route:'/app/audit-workflow', transition:'prezi',
    waitForSelector:'[data-demo-target="sae-audit-page"]',
    speak:"Voici le module Audit Workflow. Pensé pour les audits internes récurrents, il vous permet de configurer, planifier, exécuter et tracer l'intégralité d'un audit ISO de bout en bout.",
    delayAfter:2800 },

  { id:'s2-1', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-project"]',
    speak:"Chaque audit est rattaché à un projet — ici, INTERNAL AUDIT 2026, conforme ISO 9001, ISO 19443 et AS/EN 9100. Les référentiels sont affichés clairement pour les auditeurs terrain.",
    delayAfter:2800 },

  { id:'s2-2', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-tabs"]',
    speak:"La configuration de l'audit s'articule autour de cinq onglets : Paramétrage, Étape, Configuration, Informations et Synthèse. Je vais vous les montrer un par un.",
    delayAfter:2400 },

  { id:'s2-3', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-step"]',
    speak:"L'onglet Étape affiche la phase en cours, la phase suivante et l'échéance. Ici, nous sommes en Phase 2 — inspection terrain, avec un passage à la Phase 3 — actions correctives le 22 juin.",
    highlightBefore:true, delayAfter:2800 },

  { id:'s2-4', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-config"]',
    speak:"L'onglet Configuration précise qui pilote l'audit. Christophe Renaud est l'auditeur principal, Daniele Brunetti l'inspecteur terrain, et le template utilisé est ISO 19443 — HR & Cybersecurity.",
    highlightBefore:true, delayAfter:2800 },

  { id:'s2-5', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-synthesis"]',
    speak:"L'onglet Synthèse est la vitrine de l'audit : conformité globale à 85%, 24 contrôles validés sur 28, deux non-conformités mineures ouvertes. Ce résumé est exportable d'un clic en PDF.",
    highlightBefore:true, delayAfter:3000 },

  { id:'s2-6', phase:2, type:'click', selector:'[data-demo-target="sae-audit-tab-settings"]',
    speak:"Retour au paramétrage de base — dates, progression et périmètre de l'audit. 65% déjà accomplis, fin prévue le 14 juin.",
    highlightBefore:true, delayAfter:2400 },

  { id:'s2-7', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-gantt"]',
    speak:"Le programme d'audit 2026 est visualisé sous forme de Gantt. Chaque auditeur a ses propres lignes — Christophe sur HR & Cybersecurity, Daniele sur l'inspection terrain. Vous pouvez basculer entre vues jour, semaine, mois ou année.",
    delayAfter:3000 },

  { id:'s2-8', phase:2, type:'highlight', selector:'[data-demo-target="sae-audit-trace"]',
    speak:"Et voici la traçabilité : chaque événement de l'audit est historisé. Les badges verts PASS, bleus INSPECTION, rouges ACTIONS et orange FINDING permettent de comprendre en un coup d'œil ce qui s'est passé, quand et par qui. C'est votre preuve de conformité pour les certificateurs.",
    delayAfter:3400 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 3 — GED (Document Management)
     ═══════════════════════════════════════════════════════════ */
  { id:'s3-0', phase:3, phaseTitle:"Gestion Documentaire", type:'navigate',
    route:'/app/ged', transition:'prezi',
    waitForSelector:'[data-demo-target="sae-ged-page"]',
    speak:"Passons maintenant au deuxième pilier SAE : la gestion électronique de documents. C'est un référentiel structuré avec workflow de validation et transmittal officiel.",
    delayAfter:2600 },

  { id:'s3-1', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-workflow"]',
    speak:"Chaque document suit un cycle de vie en quatre étapes : Création, Validation, Approbation, Diffusion. Ici, le document actif est en phase de Validation — vous voyez le badge En Rédaction et l'étape 2 surlignée en rouge.",
    delayAfter:3200 },

  { id:'s3-2', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-repository"]',
    speak:"Le référentiel contient tous vos documents d'audit avec leur codification normalisée — ici, préfixe 26D pour l'année 2026. Chaque ligne porte son statut coloré. Je vais en ouvrir un.",
    delayAfter:2800 },

  { id:'s3-3', phase:3, type:'click', selector:'.sae-ged-table tbody tr:first-child',
    speak:"Document 26D000067 — le plan de surveillance du processus RH. Il est encore en rédaction. Dans la vraie application, cliquer ouvre le détail avec sept onglets : Document, Fichiers, Liste de Distribution, Envois, Journaux, Flux, Révisions.",
    delayAfter:3200 },

  { id:'s3-4', phase:3, type:'highlight', selector:'[data-demo-target="sae-ged-transmittal"]',
    speak:"Le transmittal est le mécanisme d'envoi officiel. Un email formel avec objet, message, pièces jointes, expiration du lien sécurisé et accusé de réception. C'est ce qui permet de tracer réglementairement qui a reçu quoi et quand.",
    delayAfter:3400 },

  { id:'s3-5', phase:3, type:'click', selector:'[data-demo-target="sae-ged-send-btn"]',
    speak:"J'envoie le transmittal aux trois destinataires. Le lien de téléchargement sécurisé expire dans 30 jours, et chaque destinataire doit accuser réception sous 5 jours ouvrés. Toute l'activité est horodatée dans la traçabilité.",
    highlightBefore:true, delayAfter:3000 },

  /* ═══════════════════════════════════════════════════════════
     PHASE 4 — Conclusion
     ═══════════════════════════════════════════════════════════ */
  { id:'s4-0', phase:4, phaseTitle:"Conclusion", type:'speak',
    text:"Voilà pour cette démonstration SAE. Vous avez vu comment piloter un audit interne ISO de A à Z — configuration, planification, traçabilité — et comment gérer le cycle de vie documentaire avec workflow et transmittal officiel. Pour essayer sur vos propres projets, planifiez une démo sur inspectogroup.com. Merci de votre attention !",
    delayAfter:2000 },
]
