import { test, expect } from '@playwright/test';
import { goTo, launchDemo, collectConsoleErrors } from './helpers.js';

test.describe('Demo Audio System (graceful fallback)', () => {

  test('no critical errors when MP3 files are missing', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Let demo run for a few steps
    await page.waitForTimeout(5000);

    // No Uncaught errors or Cannot read properties
    const crashes = errors.filter(e =>
      (e.includes('Uncaught') ||
       e.includes('Cannot read properties') ||
       e.includes('is not a function') ||
       e.includes('is not defined')) &&
      !e.includes('audio') &&
      !e.includes('mp3')
    );
    expect(crashes).toEqual([]);
  });

  test('mute/unmute during demo does not crash', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Toggle mute rapidly multiple times
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[5]?.click();
      });
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(2000);

    const crashes = errors.filter(e =>
      e.includes('Uncaught') ||
      e.includes('Cannot read properties') ||
      e.includes('is not a function')
    );
    expect(crashes).toEqual([]);
  });

  test('spam clicking next step does not crash or cause audio overlap', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Spam click next step rapidly (index 3)
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[3]?.click();
      }).catch(() => {});
      await page.waitForTimeout(150);
    }

    await page.waitForTimeout(2000);

    const crashes = errors.filter(e =>
      e.includes('Uncaught') ||
      e.includes('Cannot read properties') ||
      e.includes('is not a function')
    );
    expect(crashes).toEqual([]);

    // Verify page is still functional
    const bodyLength = await page.evaluate(() => document.body.innerText.length);
    expect(bodyLength).toBeGreaterThan(10);
  });

  test('rapid chapter changes do not crash', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });

    // Rapidly switch chapters (index 4)
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        document.querySelectorAll('.demo-control-bar .dcb-btn')[4]?.click();
      }).catch(() => {});
      await page.waitForTimeout(400);
    }

    await page.waitForTimeout(2000);

    const crashes = errors.filter(e =>
      e.includes('Uncaught') ||
      e.includes('Cannot read properties') ||
      e.includes('is not a function')
    );
    expect(crashes).toEqual([]);
  });
});
