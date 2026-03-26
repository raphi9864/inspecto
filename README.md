# Inspecto — Industrial Quality Platform Showcase

Premium showcase site for [Inspecto](https://inspectogroup.com), an industrial digitalization platform for quality management, inspections, and compliance tracking.

**Live demo:** [inspecto-site.vercel.app](https://inspecto-site.vercel.app)

## Stack

| Package | Role |
|---------|------|
| React 18 | Component framework |
| Vite 5 | Dev server + bundler |
| React Router 6 | Client-side routing (SPA) |
| GSAP 3.12 | Animations (intro, transitions, charts) |
| Chart.js 4 | Donut / line / bar charts on dashboards |
| i18next + react-i18next | Internationalization (5 languages) |
| Typed.js | AI avatar typewriter effect |
| Splitting.js | Char/word splitting for intro animations |
| Lenis 1.1 | Smooth scroll |

## Local setup

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build and deploy

```bash
npm run build     # production build -> dist/
npm run preview   # preview locally
npx vercel --prod --yes  # deploy to Vercel
```

SPA routing is handled by `vercel.json` (all routes rewrite to `index.html`).

## Internationalization

5 languages supported: **French** (default), English, Italian, Spanish, German.

- Translation files: `src/i18n/locales/{fr,en,it,es,de}.json`
- UI strings and demo data are fully localized (~550 keys per language)
- Language persisted in `localStorage('inspecto_lang')`
- Switcher accessible in the top bar

## Voice ElevenLabs (optional)

The demo avatar can speak with ElevenLabs TTS. Pre-generated MP3s play for intro/conclusion, live API for other steps.

```bash
cp .env.example .env
# Edit .env and add your ElevenLabs API key:
# VITE_ELEVENLABS_API_KEY=sk_...
npm run dev
```

Without the key, the demo works normally (text-only, no voice).

## Features

- Cinematic GSAP intro (~32s) with Europe map, dashboard reveal
- AI avatar presenter with Typed.js speech + ElevenLabs TTS voice
- 4 module categories: Project Management, Quality, Library, Dashboard & Analytics
- Full demo mode (automated walkthrough of all pages)
- 25+ demo pages covering inspections, Gantt, NC wizard, statistics, traceability
- Dark/light theme with CSS custom properties
- Route-based code splitting (React.lazy + Suspense)

## Brand

| Token | Value |
|-------|-------|
| Primary Blue | `#002F5F` (Pantone 295C) |
| Secondary Red | `#d7294a` (Pantone 1935C) |
| Accent Blue | `#2ea3f2` |
| Font (brand) | Gotham / Montserrat |
| Font (UI) | Inter |
