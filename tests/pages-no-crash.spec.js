import { test, expect } from '@playwright/test';
import { goTo, collectConsoleErrors } from './helpers.js';

const routes = [
  '/app/dashboard',
  '/app/settings',
  '/app/team',
  '/app/projets',
  '/app/activites',
  '/app/taches',
  '/app/gantt',
  '/app/inspections',
  '/app/findings',
  '/app/qcp',
  '/app/cfsi',
  '/app/actions',
  '/app/documentation',
  '/app/traceabilite',
  '/app/statistiques',
  '/app/rff',
];

test.describe('All pages load without crash', () => {

  for (const route of routes) {
    test(`${route} loads without errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page);

      await goTo(page, route);

      // Page should not be blank
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      expect(bodyText.length).toBeGreaterThan(10);

      // Page should contain some app structure
      const hasContent = await page.evaluate(() => {
        return !!(
          document.querySelector('.panel') ||
          document.querySelector('[data-demo-target]') ||
          document.querySelector('.sidebar') ||
          document.querySelector('.topbar') ||
          document.querySelector('.app-shell')
        );
      });
      expect(hasContent).toBe(true);

      // No critical console errors (ignore resource loading warnings)
      const criticalErrors = errors.filter(e =>
        (e.includes('Uncaught') ||
         e.includes('Cannot read properties') ||
         e.includes('is not a function') ||
         e.includes('is not defined')) &&
        !e.includes('audio') &&
        !e.includes('mp3')
      );
      expect(criticalErrors).toEqual([]);
    });
  }
});
