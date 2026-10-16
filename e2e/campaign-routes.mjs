import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer, preview } from 'vite';
import puppeteer from 'puppeteer';

// Only the starting world is prepared outside the browser. Work uses visible controls.
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const dev = await createServer({ server: { middlewareMode: true } });
let server, browser;
const results = [];
try {
  const { transition } = await dev.ssrLoadModule('/src/world/engine.ts');
  const { emptyCampaign, activeCharacter, activeTask, makeSchedule } = await dev.ssrLoadModule(
    '/src/world/simulation.ts',
  );
  const { advanceCalendar } = await dev.ssrLoadModule('/src/world/life.ts');
  const { resolveTaskTemplate } = await dev.ssrLoadModule('/src/content/scenarios.ts');
  const { availableTechnicalActions } = await dev.ssrLoadModule('/src/world/technicalActions.ts');
  await dev.ssrLoadModule('/src/content/waitingWork.ts');
  const { translate } = await dev.ssrLoadModule('/src/content/localization.ts');
  const t = (key, values = {}) => translate(key, values, 'en', 'clean');
  let fixture = transition(emptyCampaign(), {
    type: 'new',
    name: 'Campaign test',
    avatarId: '1',
    professionId: 'frontend',
    seed: 1427,
  }).campaign;
  delete activeCharacter(fixture).firstDay;
  activeCharacter(fixture).completedWork = ['one', 'two'];
  while (fixture.life.calendarDay < fixture.company.structure.campaign.plannedDay)
    advanceCalendar(fixture);
  fixture.phase = 'office';
  fixture.time = 540;
  fixture.schedule = makeSchedule(fixture);
  fixture.schedule[0].status = 'completed';
  const q = fixture.life.queue.find((q) => q.id === 'bug');
  q.status = 'selected';
  q.explained = true;
  fixture = transition(fixture, { type: 'take-task' }).campaign;
  await mkdir('e2e-artifacts/campaign-routes', { recursive: true });
  server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true } });
  browser = await puppeteer.launch({ headless: true });
  for (const [viewport, width, height] of process.env.NOVICE
    ? [['mobile', 390, 844]]
    : [
        ['desktop', 1280, 720],
        ['mobile', 390, 844],
      ])
    for (const route of process.env.NOVICE ? ['limited'] : ['limited', 'shared']) {
      const context = await browser.createBrowserContext(),
        page = await context.newPage(),
        errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.setViewport({ width, height });
      await page.evaluateOnNewDocument((fixture) => {
        if (!localStorage.getItem('route-fixture')) {
          localStorage.setItem(
            'voiti-vaiti-campaign',
            JSON.stringify({ state: fixture, version: 3 }),
          );
          localStorage.setItem(
            'voiti-vaiti-preferences',
            JSON.stringify({
              state: { locale: 'en', colorScheme: 'violet', soundEnabled: false },
              version: 0,
            }),
          );
          localStorage.setItem('route-fixture', '1');
        }
      }, fixture);
      const read = () =>
        page.evaluate(() => JSON.parse(localStorage.getItem('voiti-vaiti-campaign')).state);
      const click = async (label, selector = '.laptop-shell button') => {
        console.log('click', viewport, route, label, selector);
        await page.waitForFunction(
          (label, selector) =>
            [...document.querySelectorAll(selector)].some(
              (e) =>
                e.textContent.trim().startsWith(label) &&
                !e.disabled &&
                e.checkVisibility() &&
                !e.closest('details:not([open])'),
            ),
          {},
          label,
          selector,
        );
        await page.evaluate(
          (label, selector) => {
            document.querySelector('[data-route-click]')?.removeAttribute('data-route-click');
            const el = [...document.querySelectorAll(selector)].find(
              (e) =>
                e.textContent.trim().startsWith(label) &&
                !e.disabled &&
                e.checkVisibility() &&
                !e.closest('details:not([open])'),
            );
            el.setAttribute('data-route-click', '1');
          },
          label,
          selector,
        );
        try {
          await page.locator('[data-route-click="1"]').click();
        } catch (error) {
          await page.screenshot({ path: 'e2e-artifacts/campaign-routes/failure.png' });
          await writeFile('e2e-artifacts/campaign-routes/failure.html', await page.content());
          throw error;
        }
      };
      const open = async () => {
        await page.evaluate(() =>
          document.querySelector('dialog[open] button[aria-label="Close"]')?.click(),
        );
        await click('Open laptop', 'button');
        await page.waitForSelector('.laptop-shell');
      };
      const act = async (id) => {
        const c = await read(),
          task = activeTask(c),
          step = resolveTaskTemplate(task).steps.find((s) => s.id === task.currentStepId);
        const action = availableTechnicalActions(step, task.progress[step.id]).find(
          (a) => a.id === id,
        );
        assert.ok(action, id);
        if (action.artifact) {
          if (availableTechnicalActions(step, task.progress[step.id]).length > 1)
            await page
              .locator(
                `.artifact-action-option:has(.work-artifact[aria-label=${JSON.stringify(t(action.artifact.titleKey))}])>summary`,
              )
              .click();
          for (const row of action.artifact.rows.filter((r) => !r.optional))
            await click(
              t(row.labelKey),
              `.work-artifact[aria-label=${JSON.stringify(t(action.artifact.titleKey))}] .artifact-records button`,
            );
          await click(t('artifact.continue'), '.artifact-compare');
        } else await click(t(action.labelKey), '.scene-action');
        await page.waitForFunction(
          (id) => {
            const c = JSON.parse(localStorage.getItem('voiti-vaiti-campaign')).state,
              task = c.tasks.find((t) => t.id === c.activeTaskId);
            return task?.progress[task.currentStepId]?.actionHistory?.includes(id);
          },
          {},
          id,
        );
      };
      await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/voitivaiti/`, {
        waitUntil: 'networkidle0',
      });
      await open();
      if (process.env.NOVICE) {
        await click('Console', '.laptop-launcher button');
        await page.screenshot({ path: 'e2e-artifacts/campaign-routes/novice-console.png' });
        await click('Browser', '.laptop-launcher button');
      }
      await act('inspect');
      await act('trace');
      const requested = await read(),
        taskId = requested.activeTaskId,
        stepId = activeTask(requested).currentStepId;
      assert.equal(activeTask(requested).progress[stepId].dependency.ready, false);
      await click(t('story.pause'));
      await page.screenshot({
        path: `e2e-artifacts/campaign-routes/${viewport}-${route}-waiting.png`,
      });
      await page.reload({ waitUntil: 'networkidle0' });
      await open();
      for (let i = 0; i < 5; i++) {
        const c = await read(),
          dep = c.tasks.find((t) => t.id === taskId).progress[stepId].dependency;
        if (dep.ready) break;
        await click(t('waitingWork.wait', { minutes: Math.min(30, dep.dueMinute - c.time) }));
      }
      await click(t('story.resume'));
      await page.screenshot({ path: 'e2e-artifacts/campaign-routes/resumed.png' });
      await act('campaign-reply');
      const reply = await read(),
        org = reply.company.structure;
      const owner = org.teams.find((t) => t.id === org.campaign.targetTeamId);
      assert.equal(
        reply.company.mail.messages.find((m) => m.subjectKey === 'mail.result').senderCharacterId,
        owner.contactId,
      );
      await page.screenshot({
        path: `e2e-artifacts/campaign-routes/${viewport}-${route}-reply.png`,
      });
      for (let guard = 0; guard < 20; guard++) {
        const c = await read(),
          task = activeTask(c);
        if (task.rewarded) break;
        const step = resolveTaskTemplate(task).steps.find((s) => s.id === task.currentStepId),
          progress = task.progress[step.id];
        if (process.env.NOVICE && guard === 1) {
          await page.waitForSelector(`[data-step-id=${JSON.stringify(step.id)}]`);
          await page.waitForFunction(
            (id) => {
              const e = document.querySelector(`[data-step-id="${id}"]`);
              return e && Number(getComputedStyle(e.parentElement).opacity) > 0.99;
            },
            {},
            step.id,
          );
          await page.screenshot({ path: 'e2e-artifacts/campaign-routes/novice-scope.png' });
          const term = await page.$('.mechanic .inline-term button');
          if (term) {
            await term.click();
            await page.waitForSelector('.term-overlay');
            const rect = await page.$eval('.term-overlay', (e) => {
              const r = e.getBoundingClientRect();
              return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
            });
            assert.ok(rect.x >= 0 && rect.y >= 0 && rect.right <= width && rect.bottom <= height);
            await page.keyboard.press('Escape');
            assert.ok(await page.$('.laptop-shell'));
          }
          await writeFile(
            'e2e-artifacts/campaign-routes/novice-scope.txt',
            await page.$eval('.laptop-shell', (e) => e.innerText),
          );
        }
        if (progress.status === 'completed') {
          await click(
            t(
              resolveTaskTemplate(task).steps.at(-1).id === step.id
                ? 'ui.closeTask'
                : 'ui.continue',
            ),
          );
          await page.waitForFunction(
            (old) => {
              const c = JSON.parse(localStorage.getItem('voiti-vaiti-campaign')).state,
                t = c.tasks.find((t) => t.id === c.activeTaskId);
              return t.rewarded || t.currentStepId !== old;
            },
            {},
            step.id,
          );
        } else {
          const actions = availableTechnicalActions(step, progress),
            action = actions.find((a) => a.id === route) ?? actions[0];
          assert.ok(action);
          await act(action.id);
        }
      }
      const done = await read();
      assert.equal(activeTask(done).rewarded, true);
      assert.equal(
        done.company.structure.campaign.result.coverageMultiplier,
        route === 'limited' ? 2 : 3,
      );
      await page.screenshot({
        path: `e2e-artifacts/campaign-routes/${viewport}-${route}-result.png`,
      });
      await page.reload({ waitUntil: 'networkidle0' });
      const restored = await read();
      assert.deepEqual(
        restored.company.structure.campaign.result,
        done.company.structure.campaign.result,
      );
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false);
      assert.deepEqual(errors, []);
      results.push({
        viewport,
        route,
        owner: owner.id,
        reloadDuringWait: true,
        coverage: org.campaign.capacityCheck.testedMultiplier,
        result: done.company.structure.campaign.result.kind,
        errors,
        overflow,
      });
      await context.close();
    }
  await writeFile(
    'e2e-artifacts/campaign-routes/' +
      (process.env.NOVICE ? 'novice-results.json' : 'results.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser?.close();
  await dev.close();
  if (server) await new Promise((r) => server.httpServer.close(r));
}
