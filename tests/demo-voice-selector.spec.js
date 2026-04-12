import { test, expect } from '@playwright/test';
import { goTo } from './helpers.js';

test.describe('Demo Voice Selector', () => {

  test.beforeEach(async ({ page }) => {
    await goTo(page, '/app/dashboard');
  });

  test('shows the welcome modal when clicking the demo button', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await expect(page.locator('.welcome-overlay')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.welcome-card')).toBeVisible();
  });

  test('displays all 5 languages', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await page.waitForSelector('.welcome-card', { timeout: 5000 });
    await page.waitForTimeout(500);

    const langCards = page.locator('.welcome-lang-card');
    await expect(langCards).toHaveCount(5);

    const expectedLangs = ['Français', 'English', 'Español', 'Italiano', 'Deutsch'];
    for (const lang of expectedLangs) {
      await expect(page.locator('.welcome-lang-name', { hasText: lang })).toBeVisible();
    }
  });

  test('each language card has male and female voice options', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await page.waitForSelector('.welcome-card', { timeout: 5000 });
    await page.waitForTimeout(500);

    const activeCard = page.locator('.welcome-lang-card--active');
    await expect(activeCard).toBeVisible();

    const voiceRows = activeCard.locator('.welcome-voice-row');
    await expect(voiceRows).toHaveCount(2);
  });

  test('start button becomes enabled when language and voice are selected', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await page.waitForSelector('.welcome-card', { timeout: 5000 });
    await page.waitForTimeout(500);

    const startBtn = page.locator('.welcome-start-btn');
    await expect(startBtn).toBeEnabled();

    // Click a different language — should still be enabled
    const enCard = page.locator('.welcome-lang-card', {
      has: page.locator('.welcome-lang-name', { hasText: 'English' })
    });
    await enCard.click();
    await page.waitForTimeout(200);

    await expect(startBtn).toBeEnabled();
    await expect(enCard).toHaveClass(/welcome-lang-card--active/);
  });

  test('selecting FR + Male and clicking start launches the demo', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await page.waitForSelector('.welcome-card', { timeout: 5000 });
    await page.waitForTimeout(500);

    // FR + male already selected by default, click start
    const startBtn = page.locator('.welcome-start-btn');
    await expect(startBtn).toBeEnabled();
    await startBtn.click();
    await page.waitForTimeout(2000);

    // Modal should disappear
    await expect(page.locator('.welcome-card')).toBeHidden({ timeout: 5000 });

    // Demo should be running — check via DOM query (elements may be outside aria tree)
    const demoRunning = await page.evaluate(() => {
      return !!(
        document.querySelector('.demo-overlay') ||
        document.querySelector('.demo-control-bar') ||
        document.querySelector('.demo-avatar-float')
      );
    });
    expect(demoRunning).toBe(true);
  });

  test('close button dismisses the modal without starting demo', async ({ page }) => {
    await page.click('[data-demo-target="topbar-demo-btn"]');
    await page.waitForSelector('.welcome-card', { timeout: 5000 });
    await page.waitForTimeout(800);

    // Use aria-label or evaluate to click the close button directly
    await page.evaluate(() => {
      const btn = document.querySelector('.welcome-close-btn');
      if (btn) btn.click();
    });
    await page.waitForTimeout(500);

    await expect(page.locator('.welcome-card')).toBeHidden({ timeout: 3000 });
    await expect(page.locator('.demo-overlay')).toBeHidden();
  });
});
