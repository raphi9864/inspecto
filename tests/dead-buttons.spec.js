import { test, expect } from '@playwright/test';
import { goTo, collectConsoleErrors } from './helpers.js';

const routes = [
  '/app/dashboard',
  '/app/settings',
  '/app/team',
  '/app/projets',
  '/app/activites',
  '/app/taches',
  '/app/inspections',
  '/app/findings',
  '/app/actions',
  '/app/documentation',
  '/app/qcp',
  '/app/cfsi',
  '/app/statistiques',
  '/app/rff',
];

// Increase timeout for button-heavy pages
test.describe('Dead button detection', () => {
  test.setTimeout(120000);

  for (const route of routes) {
    test(`${route} — no buttons cause console errors on click`, async ({ page }) => {
      await goTo(page, route);
      const errors = collectConsoleErrors(page);

      // Find all visible clickable buttons and href="#" links (limit to 30 per page)
      const clickableCount = await page.evaluate(() => {
        const els = [
          ...document.querySelectorAll('button'),
          ...document.querySelectorAll('a[href="#"]'),
        ];
        return els.filter(el => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return rect.width > 0 && rect.height > 0 &&
                 style.display !== 'none' &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0';
        }).length;
      });

      const maxButtons = Math.min(clickableCount, 30);
      const crashingButtons = [];

      for (let i = 0; i < maxButtons; i++) {
        const btnErrors = [];
        const errorHandler = msg => {
          if (msg.type() === 'error') btnErrors.push(msg.text());
        };
        const pageErrorHandler = err => btnErrors.push(err.message);
        page.on('console', errorHandler);
        page.on('pageerror', pageErrorHandler);

        try {
          // Click button by index via evaluate (fast, avoids Playwright actionability checks)
          const clicked = await page.evaluate((idx) => {
            const els = [
              ...document.querySelectorAll('button'),
              ...document.querySelectorAll('a[href="#"]'),
            ].filter(el => {
              const rect = el.getBoundingClientRect();
              const style = getComputedStyle(el);
              return rect.width > 0 && rect.height > 0 &&
                     style.display !== 'none' &&
                     style.visibility !== 'hidden' &&
                     style.opacity !== '0';
            });
            if (idx < els.length) {
              els[idx].click();
              return { tag: els[idx].tagName, text: els[idx].textContent?.trim().slice(0, 40) };
            }
            return null;
          }, i);

          await page.waitForTimeout(200);

          if (clicked) {
            const crashes = btnErrors.filter(e =>
              e.includes('Uncaught') ||
              e.includes('Cannot read properties') ||
              e.includes('is not a function')
            );
            if (crashes.length > 0) {
              crashingButtons.push({ button: `${clicked.tag} "${clicked.text}"`, errors: crashes });
            }
          }
        } catch {
          // Skip
        }

        page.off('console', errorHandler);
        page.off('pageerror', pageErrorHandler);
      }

      expect(crashingButtons).toEqual([]);
    });
  }
});
