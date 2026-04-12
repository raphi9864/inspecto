import { test, expect } from '@playwright/test';
import { goTo } from './helpers.js';

const routes = [
  '/app/dashboard',
  '/app/settings',
  '/app/team',
  '/app/projets',
  '/app/inspections',
  '/app/findings',
  '/app/actions',
  '/app/documentation',
  '/app/statistiques',
];

// Brand colors that should NOT appear as inline styles
const forbiddenColors = [
  '#002f5f', '#002F5F',
  '#d7294a', '#D7294A',
  '#2ea3f2', '#2EA3F2',
];

test.describe('Hardcoded inline color detection', () => {

  for (const route of routes) {
    test(`${route} — no brand colors in inline styles`, async ({ page }) => {
      await goTo(page, route);

      const violations = await page.evaluate((forbidden) => {
        const results = [];
        const allElements = document.querySelectorAll('*');

        for (const el of allElements) {
          const style = el.getAttribute('style');
          if (!style) continue;

          // Skip invisible elements
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) continue;

          for (const color of forbidden) {
            if (style.toLowerCase().includes(color.toLowerCase())) {
              results.push({
                tag: el.tagName,
                className: (el.className?.toString() || '').slice(0, 60),
                style: style.slice(0, 120),
                color,
              });
            }
          }
        }
        return results;
      }, forbiddenColors);

      // Log violations for debugging but don't fail on chart/canvas elements
      const realViolations = violations.filter(v =>
        !v.tag.includes('CANVAS') &&
        !v.className.includes('chart') &&
        !v.className.includes('Chart')
      );

      if (realViolations.length > 0) {
        console.log(`[${route}] Inline color violations:`, realViolations);
      }

      expect(realViolations).toEqual([]);
    });
  }
});
