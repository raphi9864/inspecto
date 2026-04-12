import { test, expect } from '@playwright/test';
import { goTo, launchDemo, collectConsoleErrors } from './helpers.js';

test.describe('Demo Navigation Through Phases', () => {

  test('navigates through all 6 phases without crash', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    const hasBar = await page.evaluate(() => !!document.querySelector('.demo-control-bar'));
    expect(hasBar).toBe(true);

    // Pause demo so we control the navigation
    await page.evaluate(() => document.querySelector('.dcb-btn--play')?.click());
    await page.waitForTimeout(500);

    // Navigate through phases 2 to 6 using next chapter (index 4)
    for (let phase = 2; phase <= 6; phase++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[4]?.click();
      });
      await page.waitForTimeout(2500);

      // Verify phase label updated
      const label = await page.evaluate(() =>
        document.querySelector('.dcb-phase-number')?.textContent
      );
      expect(label).toContain(`${phase}/6`);

      // Verify no blank page
      const bodyContent = await page.evaluate(() => document.body.innerText.length);
      expect(bodyContent).toBeGreaterThan(50);
    }

    // Filter out non-critical errors (audio 404s are expected)
    const criticalErrors = errors.filter(e =>
      !e.includes('404') &&
      !e.includes('audio') &&
      !e.includes('mp3') &&
      !e.includes('net::ERR') &&
      !e.includes('Failed to load resource') &&
      !e.includes('The play() request was interrupted') &&
      !e.includes('NotAllowedError') &&
      !e.includes('AbortError')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('each phase navigates to correct route area', async ({ page }) => {
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Pause
    await page.evaluate(() => document.querySelector('.dcb-btn--play')?.click());
    await page.waitForTimeout(500);

    const expectedRoutes = [
      /dashboard|settings|team/,
      /projets|activites|taches|gantt/,
      /inspections/,
      /findings|qcp|cfsi|rff/,
      /actions/,
      /documentation|traceabilite|statistiques/,
    ];

    // Phase 1 already active
    expect(page.url()).toMatch(expectedRoutes[0]);

    // Navigate through remaining phases
    for (let i = 1; i < 6; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[4]?.click();
      });
      await page.waitForTimeout(2500);
      expect(page.url()).toMatch(expectedRoutes[i]);
    }
  });

  test('demo completes at phase 6 conclusion', async ({ page }) => {
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Pause and skip to phase 6
    await page.evaluate(() => document.querySelector('.dcb-btn--play')?.click());
    await page.waitForTimeout(500);

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[4]?.click();
      });
      await page.waitForTimeout(1500);
    }

    // Click through phase 6 steps to reach conclusion
    for (let i = 0; i < 20; i++) {
      const hasBar = await page.evaluate(() => !!document.querySelector('.demo-control-bar'));
      if (!hasBar) break;

      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[3]?.click();
      }).catch(() => {});
      await page.waitForTimeout(500);
    }

    await page.waitForTimeout(2000);
    // Page should still be functional
    const bodyLength = await page.evaluate(() => document.body.innerText.length);
    expect(bodyLength).toBeGreaterThan(10);
  });
});
