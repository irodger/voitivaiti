import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { professions } from './professions.mjs';

let server, browser, baseUrl;
const filter = process.env.E2E_ROLES?.split(',').filter(Boolean);
const selected = professions.filter(role => !filter || filter.includes(role.id));
assert.ok(selected.length, 'E2E_ROLES must select at least one known profession');
if (filter) assert.ok(filter.every(id => professions.some(role => role.id === id)), 'Unknown E2E_ROLES profession');

before(async () => {
  // Production bundle, random local port, no dependency on a running development server.
  server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true, open: false } });
  baseUrl = `http://127.0.0.1:${server.httpServer.address().port}/voitivaiti/`;
  browser = await puppeteer.launch({ headless: process.env.E2E_HEADFUL !== '1', executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
});

test('matrix covers every playable profession', async () => {
  const source = await readFile(new URL('../src/content/professions.ts', import.meta.url), 'utf8');
  const ids = [...source.matchAll(/^\s*\['([^']+)'/gm)].map(match => match[1]);
  assert.deepEqual(professions.map(role => role.id).sort(), ids.sort());
});

async function campaign(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('voiti-vaiti-campaign'))?.state);
}
async function waitState(page, predicate, ...args) {
  await page.waitForFunction(predicate, { timeout: 15000 }, ...args);
}
async function clickText(page, text, scope = '') {
  const selector = `${scope ? scope + ' ' : ''}button`;
  const button = await page.waitForFunction((selector, text) => [...document.querySelectorAll(selector)].find(el => !el.disabled && el.textContent.trim() === text), { timeout: 10000 }, selector, text);
  await button.asElement().click();
  await button.dispose();
}
async function firstDay(page, role) {
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await page.waitForSelector('dialog[open] button[aria-label="Close"]');
  await page.click('dialog[open] button[aria-label="Close"]');
  await clickText(page, 'ENTER');
  await page.waitForSelector(`[data-profession="${role.id}"]`);
  await page.click(`[data-profession="${role.id}"]`);
  await page.type('.creation-row input', '1427');
  await clickText(page, 'Start working');
  await page.waitForSelector('#intro-name');
  await page.type('#intro-name', `E2E ${role.id}`);
  await clickText(page, 'Introduce yourself');
  await clickText(page, 'See the project');
  await clickText(page, 'Let’s continue');
  await clickText(page, 'Next: team meeting');
  await clickText(page, 'I’d like to try a small first task.');
  await clickText(page, 'Take the first task');
  await page.waitForSelector('.laptop-shell');
  await waitState(page, () => !!JSON.parse(localStorage.getItem('voiti-vaiti-campaign'))?.state.activeTaskId);
}

async function inspectFirstAction(page) {
  // Real pointer clicks only. No store dispatch, campaign injection or engine calls.
  const selector = await page.waitForFunction(() => [
    '.technical-actions .artifact-action-option summary',
    '.technical-actions .work-artifact .artifact-records button',
    '.technical-actions .work-artifact .experiment-run',
    '.technical-actions .scene-action',
    '.mechanic .dependency-graph button',
    '.mechanic .evidence-row button',
    '.mechanic .choice',
    '.mechanic .mock-button',
    '.mechanic .primary-button',
  ].find(selector => [...document.querySelectorAll(selector)].some(el => !el.disabled && el.getClientRects().length)), { timeout: 10000 });
  let target = await selector.jsonValue();
  if (target.endsWith('summary')) {
    await page.click(target);
    target = '.technical-actions .artifact-action-option[open] .artifact-records button';
    await page.waitForSelector(target);
  }
  await page.click(target);
}

for (const role of selected) {
  test(`${role.id}: onboarding, work, device, reload`, { timeout: 60000 }, async () => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewport({ width: 1366, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => localStorage.setItem('voiti-vaiti-preferences', JSON.stringify({ state: { locale: 'en', contentMode: 'clean', colorScheme: 'violet', soundEnabled: false }, version: 0 })));
    try {
      await firstDay(page, role);
      const initial = await campaign(page);
      const hero = initial.characters.find(ch => ch.id === initial.activeCharacterId);
      assert.equal(hero.profession, role.id);
      assert.equal(hero.name, `E2E ${role.id}`);
      assert.equal(hero.firstDay.currentOnboardingStep, 'work');
      const task = initial.tasks.find(task => task.id === initial.activeTaskId);
      assert.equal(task.templateId, role.firstTask);
      assert.equal(task.status, 'active');
      assert.equal(await page.$eval('.laptop-chin', el => el.textContent.trim()), role.device);
      assert.equal(await page.$eval('.laptop-shell', el => el.dataset.device), role.device);
      assert.equal(await page.$$('.laptop-taskbar').then(nodes => nodes.length), role.device === 'PacBook' ? 0 : 1);

      // Switching apps must not spend game time or change the active task.
      const appNav = role.device === 'PacBook' ? '.laptop-launcher' : '.laptop-taskbar';
      for (const name of ['Chat', 'IDE', 'Browser', 'Console']) {
        if (role.device === 'PacBook') await clickText(page, name, appNav);
        else await page.click(`${appNav} button[aria-label="${name}"]`);
        await page.waitForFunction(app => document.querySelector('.laptop-display')?.dataset.app === app, {}, name.toLowerCase());
      }
      assert.equal((await campaign(page)).time, initial.time);
      // Back to the actual work step via the journey, irrespective of the role's application.
      await page.click('.stage-journey button:not(:disabled)');
      const before = JSON.stringify((await campaign(page)).tasks.find(item => item.id === task.id).progress);
      await inspectFirstAction(page);
      await waitState(page, (taskId, before) => JSON.stringify(JSON.parse(localStorage.getItem('voiti-vaiti-campaign')).state.tasks.find(item => item.id === taskId).progress) !== before, task.id, before);
      const acted = (await campaign(page)).tasks.find(item => item.id === task.id);
      const progress = acted.progress;
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForSelector('.world-work');
      const restored = await campaign(page);
      assert.equal(restored.activeTaskId, task.id);
      assert.equal(restored.activeCharacterId, hero.id);
      assert.equal(restored.characters.find(ch => ch.id === hero.id).profession, role.id);
      assert.equal(restored.phase, 'office');
      assert.deepEqual(restored.tasks.find(item => item.id === task.id).progress, progress);
      await clickText(page, 'Open laptop', '.world-work');
      await page.waitForSelector('.laptop-shell');
      assert.equal(await page.$eval('.laptop-chin', el => el.textContent.trim()), role.device);
      if (['frontend', 'backend', 'qa'].includes(role.id)) {
        await page.setViewport({ width: 390, height: 844 });
        await page.waitForFunction(() => {
          const box = document.querySelector('.laptop-shell')?.getBoundingClientRect();
          return box && box.width < 390 && box.height > 500;
        });
        const layout = await page.evaluate(() => {
          const chin = document.querySelector('.laptop-chin').getBoundingClientRect();
          return { width: document.documentElement.scrollWidth, chinBottom: chin.bottom, chinTop: chin.top };
        });
        assert.ok(layout.width <= 390, 'Mobile viewport has horizontal overflow');
        assert.ok(layout.chinTop >= 0 && layout.chinBottom <= 844, 'Device name is outside the mobile screen');
        if (role.device !== 'PacBook') {
          await page.click('.laptop-taskbar button[aria-label="Chat"]');
          await page.waitForSelector('.laptop-taskbar button[aria-label="Chat"][aria-pressed="true"]');
        }
      }
      assert.deepEqual(errors, [], 'Browser errors');
    } catch (error) {
      const path = `e2e-artifacts/${role.id}`;
      await mkdir(path, { recursive: true });
      await page.screenshot({ path: `${path}/failure.png`, fullPage: true }).catch(() => {});
      await writeFile(`${path}/errors.json`, JSON.stringify({ error: String(error.stack), browserErrors: errors, campaign: await campaign(page).catch(() => null) }, null, 2));
      throw error;
    } finally { await context.close(); }
  });
}
