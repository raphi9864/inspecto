# Inspecto — Codebase Audit Report

**Date:** 2026-03-26
**Scope:** `inspecto-site/` — Vite 5 + React 18 + GSAP showcase site
**Commit:** `b9890ce` (initial commit)

---

## Checklist

| # | Item | Status | Details |
|---|------|--------|---------|
| 1 | Three.js fully removed | ✅ Done | Zero imports/references in any JS/JSX file. Only match is `.dashboard-layout.three` CSS class (grid layout, unrelated). |
| 2 | i18n system with 5 languages (FR/EN/IT/ES/DE) | ✅ Done | `i18next` + `react-i18next` configured in `src/i18n/index.js`. All 5 locale files present under `src/i18n/locales/`. Fallback: FR. Persisted via `localStorage('inspecto_lang')`. |
| 3 | All pages covered by i18n | ✅ Done | All sampled page components (Home, Inspections, Projects, Statistics, etc.) use `useTranslation()`. 23 lazy-loaded pages all import the hook. |
| 4 | Demo data localized via `useLocalizedData()` | ❌ Missing | `useLocalizedData()` hook exists in `src/hooks/` but is **never called**. All 4 data files (`fakeDashboard.js`, `fakeInspections.js`, `fakeOverview.js`, `fakeProjects.js`) contain hardcoded French/English strings. |
| 5 | ~150 translation keys present | ✅ Done | **487 keys** per language (all 5 files identical count). 20+ namespaces covering all pages. Well exceeds the 150-key target. |
| 6 | CLAUDE.md up to date | ⚠️ Partial | Stack and architecture sections are accurate. Missing: `react-chartjs-2` dependency, `i18next`/`react-i18next` in stack table, `StandaloneShell`/`TemplateShell` layouts, several new routes (`/home`, `/templates`, `/statistics`, `/advanced-stats`, `/global-gantt`). |
| 7 | README.md exists at repo root | ❌ Missing | No `README.md` in `inspecto-site/`. |
| 8 | 4 demo pages (avancement, rapports, equipements, excel) | ⚠️ Partial | Old HTML pages are replaced by React equivalents: Activities, Statistics, Inspections, GanttPage. No direct "excel" export page exists — Gantt and charts cover similar ground. The old `pages/*.html` files are excluded from git (legacy). |
| 9 | Demo AI assistant (Typed.js) | ✅ Done | Typed.js used in 3 components: `Presenter.jsx` (avatar speech), `TourGuide.jsx` (guided tour), `DemoContext.jsx` (automated demo). Proper `destroy()` cleanup on all instances. |
| 10 | Voice capability (Web Speech / ElevenLabs) | ❌ Missing | No `speechSynthesis`, ElevenLabs, or any audio/TTS implementation found. Avatar has visual sound-wave animation only. |
| 11 | Point Rouge sub-product | ❌ Missing | Zero references to "Point Rouge" in any source file. No dedicated page or component. |
| 12 | Vercel deployment config | ⚠️ Partial | No `vercel.json` present. Vercel CLI is a devDependency in `package.json`. Deploys work via Vite auto-detection, but SPA client-side routing will 404 on refresh without a rewrite rule. |
| 13 | .gitignore covers node_modules, dist, .env | ✅ Done | `.gitignore` covers `node_modules/`, `dist/`, `.env`, `.vercel/`, legacy dirs (`/css/`, `/js/`, `/pages/`), and temp files (`AGENT_*.md`, etc.). |
| 14 | Bundle lazy loading (code splitting) | ✅ Done | 23 page components use `React.lazy()` with `<Suspense fallback={<PageLoader/>}>`. Vite handles chunk splitting automatically. Layouts are eagerly loaded. |
| 15 | Chart.js memory leak fixes | ✅ Done | Direct Chart.js instances (`Home.jsx`, `Statistics.jsx`) call `chart.destroy()` in `useEffect` cleanup. Other pages (`GlobalStatistics`, `AdvancedStatistics`, `HomeGlobal`) use `react-chartjs-2` wrapper components which handle cleanup internally. |

---

## Score Summary

| Status | Count |
|--------|-------|
| ✅ Done | 9 / 15 |
| ⚠️ Partial | 3 / 15 |
| ❌ Missing | 3 / 15 |

---

## Next Priorities

### 1. Demo data localization (item #4)
Wire up `useLocalizedData()` in page components, or refactor `src/data/fake*.js` to use i18n translation keys instead of hardcoded strings. This is the biggest gap — the UI is fully translated but demo data stays in French/English regardless of language selection.

### 2. Add `vercel.json` with SPA rewrite (item #12)
Create a `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` to prevent 404 errors on client-side route refreshes in production.

### 3. Add README.md (item #7)
A public GitHub repo needs a README with: project description, screenshot, stack, local setup instructions (`npm install && npm run dev`), and deployment info.

---

## Overall Assessment

The codebase is in solid shape for a showcase site. The React SPA architecture is well-structured with proper route-based code splitting, a comprehensive i18n system (487 keys across 5 languages), and careful memory management on both Chart.js and Typed.js instances. The main gap is **demo data localization** — the UI chrome translates but project names, statuses, and inspection descriptions remain hardcoded, which undermines the i18n effort when switching languages. Voice capability and Point Rouge are features that were considered but never started. Adding a `vercel.json` rewrite rule is a quick win to prevent production routing issues.
