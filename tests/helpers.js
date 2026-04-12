/**
 * E2E test helpers for Inspecto demo tests.
 * Provides utilities to bypass the intro cinematic and launch the demo.
 */

/**
 * Set sessionStorage so the intro cinematic is skipped on page load.
 * Must be called BEFORE page.goto().
 */
export async function skipIntro(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('intro-seen', '1');
  });
}

/**
 * Clear demo-related localStorage to ensure clean state for tests.
 * Must be called BEFORE page.goto().
 */
export async function clearDemoState(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('intro-seen', '1');
    localStorage.removeItem('inspecto_voice_gender');
    localStorage.removeItem('inspecto_demo_lang');
    localStorage.removeItem('inspecto_welcome_done');
  });
}

/**
 * Wait for the app shell to be ready (React hydrated, DOM populated).
 */
export async function waitForApp(page) {
  await page.waitForSelector('.sidebar, .topbar, [data-demo-target]', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

/**
 * Navigate to a route with intro skipped and wait for app readiness.
 */
export async function goTo(page, route) {
  await skipIntro(page);
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await waitForApp(page);
}

/**
 * Launch the demo by clicking the topbar button, selecting FR/Male, and starting.
 * Assumes the page is already on an /app/* route with the topbar visible.
 */
export async function launchDemo(page, { lang = 'fr', voice = 'male' } = {}) {
  // Click demo button in topbar
  await page.click('[data-demo-target="topbar-demo-btn"]');
  await page.waitForSelector('.welcome-overlay', { timeout: 5000 });

  // Select language card
  const langNames = { fr: 'Français', en: 'English', es: 'Español', it: 'Italiano', de: 'Deutsch' };
  const langName = langNames[lang];
  const langCards = page.locator('.welcome-lang-card');
  const count = await langCards.count();
  for (let i = 0; i < count; i++) {
    const text = await langCards.nth(i).locator('.welcome-lang-name').textContent();
    if (text?.trim() === langName) {
      await langCards.nth(i).click();
      break;
    }
  }

  // Select voice
  const voiceText = voice === 'male' ? 'Male' : 'Female';
  const activeCard = page.locator('.welcome-lang-card--active');
  const voiceLabels = activeCard.locator('.welcome-voice-label');
  const vCount = await voiceLabels.count();
  for (let i = 0; i < vCount; i++) {
    const t = await voiceLabels.nth(i).textContent();
    if (t && t.toLowerCase().includes(voiceText.toLowerCase())) {
      await voiceLabels.nth(i).click();
      break;
    }
  }

  // Click start
  await page.click('.welcome-start-btn');
  await page.waitForTimeout(2000);

  // Wait for demo to be running (elements may be outside aria tree)
  await page.waitForFunction(() =>
    !!document.querySelector('.demo-overlay') ||
    !!document.querySelector('.demo-control-bar') ||
    !!document.querySelector('.demo-avatar-float'),
    { timeout: 5000 }
  ).catch(() => {});
}

/**
 * Collect console errors during test execution.
 */
export function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  return errors;
}
