import { test, expect } from '@playwright/test';
import { goTo, launchDemo } from './helpers.js';

test.describe('Demo Control Bar', () => {

  test.beforeEach(async ({ page }) => {
    await goTo(page, '/app/dashboard');
    await launchDemo(page, { lang: 'fr', voice: 'male' });
  });

  test('control bar is visible after demo launch', async ({ page }) => {
    const hasBar = await page.evaluate(() => {
      const bar = document.querySelector('.demo-control-bar');
      if (!bar) return false;
      const rect = bar.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    expect(hasBar).toBe(true);
  });

  test('all control buttons are present', async ({ page }) => {
    const btnInfo = await page.evaluate(() => {
      const bar = document.querySelector('.demo-control-bar');
      if (!bar) return { count: 0, hasPlay: false, hasQuit: false, hasPhase: false };
      const btns = bar.querySelectorAll('.dcb-btn');
      return {
        count: btns.length,
        hasPlay: !!bar.querySelector('.dcb-btn--play'),
        hasQuit: !!bar.querySelector('.dcb-btn--quit'),
        hasPhase: !!bar.querySelector('.dcb-phase-label'),
      };
    });
    expect(btnInfo.count).toBeGreaterThanOrEqual(7);
    expect(btnInfo.hasPlay).toBe(true);
    expect(btnInfo.hasQuit).toBe(true);
    expect(btnInfo.hasPhase).toBe(true);
  });

  test('pause and resume demo', async ({ page }) => {
    // Check play button is in active state (running = pause icon)
    let isActive = await page.evaluate(() =>
      document.querySelector('.dcb-btn--play')?.classList.contains('dcb-btn--active')
    );
    expect(isActive).toBe(true);

    // Click to pause
    await page.evaluate(() => document.querySelector('.dcb-btn--play')?.click());
    await page.waitForTimeout(500);

    isActive = await page.evaluate(() =>
      document.querySelector('.dcb-btn--play')?.classList.contains('dcb-btn--active')
    );
    expect(isActive).toBe(false);

    // Click to resume
    await page.evaluate(() => document.querySelector('.dcb-btn--play')?.click());
    await page.waitForTimeout(500);

    isActive = await page.evaluate(() =>
      document.querySelector('.dcb-btn--play')?.classList.contains('dcb-btn--active')
    );
    expect(isActive).toBe(true);
  });

  test('mute and unmute', async ({ page }) => {
    // Find mute button index (6th button, index 5)
    let isMuted = await page.evaluate(() => {
      const btns = document.querySelectorAll('.demo-control-bar .dcb-btn');
      return btns[5]?.classList.contains('dcb-btn--muted');
    });
    expect(isMuted).toBe(false);

    // Click to mute
    await page.evaluate(() => {
      document.querySelectorAll('.demo-control-bar .dcb-btn')[5]?.click();
    });
    await page.waitForTimeout(300);

    isMuted = await page.evaluate(() => {
      const btns = document.querySelectorAll('.demo-control-bar .dcb-btn');
      return btns[5]?.classList.contains('dcb-btn--muted');
    });
    expect(isMuted).toBe(true);

    // Click to unmute
    await page.evaluate(() => {
      document.querySelectorAll('.demo-control-bar .dcb-btn')[5]?.click();
    });
    await page.waitForTimeout(300);

    isMuted = await page.evaluate(() => {
      const btns = document.querySelectorAll('.demo-control-bar .dcb-btn');
      return btns[5]?.classList.contains('dcb-btn--muted');
    });
    expect(isMuted).toBe(false);
  });

  test('next chapter updates the phase label', async ({ page }) => {
    const initialPhase = await page.evaluate(() =>
      document.querySelector('.dcb-phase-number')?.textContent
    );

    // Click next chapter (5th button, index 4)
    await page.evaluate(() => {
      document.querySelectorAll('.demo-control-bar .dcb-btn')[4]?.click();
    });
    await page.waitForTimeout(3000);

    const newPhase = await page.evaluate(() =>
      document.querySelector('.dcb-phase-number')?.textContent
    );
    expect(newPhase).not.toBe(initialPhase);
  });

  test('quit shows confirmation, then exits demo', async ({ page }) => {
    // Click quit
    await page.evaluate(() => document.querySelector('.dcb-btn--quit')?.click());
    await page.waitForTimeout(500);

    // Confirmation should appear
    const hasConfirm = await page.evaluate(() =>
      !!document.querySelector('.dcb-confirm')
    );
    expect(hasConfirm).toBe(true);

    // Click "Yes" to confirm
    await page.evaluate(() => document.querySelector('.dcb-btn--yes')?.click());
    await page.waitForTimeout(2000);

    // Demo overlay should be gone
    const hasOverlay = await page.evaluate(() =>
      !!document.querySelector('.demo-overlay')
    );
    expect(hasOverlay).toBe(false);
  });

  test('quit confirmation can be cancelled', async ({ page }) => {
    // Click quit
    await page.evaluate(() => document.querySelector('.dcb-btn--quit')?.click());
    await page.waitForTimeout(500);

    const hasConfirm = await page.evaluate(() =>
      !!document.querySelector('.dcb-confirm')
    );
    expect(hasConfirm).toBe(true);

    // Click "No" button — find non--yes button in dcb-confirm
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.dcb-confirm .dcb-btn');
      for (const btn of btns) {
        if (!btn.classList.contains('dcb-btn--yes')) {
          btn.click();
          break;
        }
      }
    });
    await page.waitForTimeout(500);

    // Demo should still be running
    const hasBar = await page.evaluate(() =>
      !!document.querySelector('.demo-control-bar')
    );
    expect(hasBar).toBe(true);
  });
});
