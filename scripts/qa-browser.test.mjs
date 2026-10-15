import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createBrowserTools, allowedURL, BASE_URL, schemas } from '../.opencode/plugins/qa-browser/browser.mjs';

const evidence = 'e2e-artifacts/qa-browser-validation';
await mkdir(evidence, { recursive: true });
const context = sessionID => ({ sessionID, agent: 'qa', signal: new AbortController().signal });

test('API is bounded: seven operations, fixed origin/path, no code/URL/path input', async () => {
  assert.deepEqual(Object.keys(schemas), ['open', 'state', 'click', 'type', 'screenshot', 'errors', 'close']);
  assert.ok(allowedURL(BASE_URL));
  for (const url of ['https://example.com/', 'http://localhost:4173/voitivaiti/', 'http://127.0.0.1:4174/voitivaiti/', 'http://127.0.0.1:4173/api/info', 'http://127.0.0.1:4173/voitivaiti/../secret', 'file:///C:/Windows/win.ini', 'javascript:alert(1)', 'http://user@127.0.0.1:4173/voitivaiti/']) assert.equal(allowedURL(url), false, url);
  const tools = createBrowserTools(process.cwd());
  try {
    await assert.rejects(tools.call('open', {}, { ...context('reject'), agent: 'build' }), /restricted to agent qa/);
    for (const input of [{ url: 'https://example.com/' }, { code: 'process.exit()' }, { path: '../src/App.tsx' }]) await assert.rejects(tools.call('open', input, context('reject')), /Unsupported input/);
    await assert.rejects(tools.call('evaluate', {}, context('reject')), /Unknown browser tool/);
  } finally { await tools.dispose(); }
});

test('real game: open, state, click, type, screenshots, errors, isolated IDs and cleanup', async () => {
  const tools = createBrowserTools(process.cwd());
  const ctx = context('deterministic-ui');
  try {
    const before = await tools.call('open', {}, ctx);
    assert.equal(before.url, BASE_URL);
    const enter = before.elements.find(el => /^(ENTER|ВОЙТИ)$/i.test(el.text.trim()));
    assert.ok(enter, `Entry control missing: ${JSON.stringify(before.elements)}`);
    const beforeShot = await tools.call('screenshot', {}, ctx);
    const after = await tools.call('click', { element: enter.id }, ctx);
    assert.ok(after.elements.some(el => el.tag === 'input'), 'Entry opens character creation inputs');
    await assert.rejects(tools.call('click', { element: enter.id }, ctx), /stale element/);
    await assert.rejects(tools.call('state', {}, context('different-session')), /open first/);
    const input = after.elements.find(el => el.tag === 'input' && ['text', 'number'].includes(el.type ?? 'text'));
    assert.ok(input, 'World code/name input available');
    const typed = await tools.call('type', { element: input.id, text: '1427' }, ctx);
    assert.ok(typed.elements.some(el => el.tag === 'input' && el.value === '1427'));
    const state = await tools.call('state', {}, ctx);
    const shot = await tools.call('screenshot', {}, ctx);
    assert.ok(shot.path.startsWith(resolve('e2e-artifacts/qa-browser') + '\\') || shot.path.startsWith(resolve('e2e-artifacts/qa-browser') + '/'));
    assert.ok((await stat(shot.path)).size > 1000);
    const png = await readFile(shot.path);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    const errors = await tools.call('errors', {}, ctx);
    assert.deepEqual(errors.errors.filter(e => e.type === 'page'), []);
    const closed = await tools.call('close', {}, ctx);
    assert.equal(closed.closed, true);
    const records = (await readFile(resolve(closed.artifacts, 'actions.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
    assert.ok(records.some(row => row.action === 'click'));
    assert.equal(records.at(-1).reason, 'explicit');
    await assert.rejects(tools.call('state', {}, ctx), /open first/);
    assert.equal((await tools.call('close', {}, ctx)).alreadyClosed, true);
    await writeFile(`${evidence}/deterministic-results.json`, JSON.stringify({ before, after, typed, state, beforeShot, shot, errors, closed }, null, 2));
  } finally { await tools.dispose(); }
});

test('idle timeout and plugin disposal close resources', async () => {
  const tools = createBrowserTools(process.cwd(), { idleMs: 200 });
  const ctx = context('idle-cleanup');
  try {
    await tools.call('open', {}, ctx);
    // Wait for the bounded cleanup timer, without causing application errors.
    await new Promise(resolve => setTimeout(resolve, 800));
    await assert.rejects(tools.call('state', {}, ctx), /open first/);
    await tools.call('open', {}, ctx);
    await tools.dispose();
    await assert.rejects(tools.call('state', {}, ctx), /disposed/);
  } finally { await tools.dispose(); }
});

test('cancellation before opening does not create a browser', async () => {
  const tools = createBrowserTools(process.cwd());
  const controller = new AbortController(); controller.abort();
  try { await assert.rejects(tools.call('open', {}, { ...context('abort'), signal: controller.signal }), /abort/i); }
  finally { await tools.dispose(); }
});

test('cancellation of an existing session closes its browser', async () => {
  const tools = createBrowserTools(process.cwd());
  const ctx = context('abort-existing');
  try {
    await tools.call('open', {}, ctx);
    const controller = new AbortController(); controller.abort();
    await assert.rejects(tools.call('state', {}, { ...ctx, signal: controller.signal }), /abort/i);
    await assert.rejects(tools.call('state', {}, ctx), /open first/);
  } finally { await tools.dispose(); }
});

test('provider failure cleanup closes only the owning session', async () => {
  const tools = createBrowserTools(process.cwd());
  const ctx = context('provider-cleanup');
  const other = context('provider-other-session');
  try {
    await tools.call('open', {}, ctx);
    await tools.call('open', {}, other);
    const result = await tools.cancel(ctx.sessionID, 'provider 429');
    assert.equal(result.reason, 'provider 429');
    await assert.rejects(tools.call('state', {}, ctx), /open first/);
    const log = await readFile(resolve(result.artifacts, 'actions.jsonl'), 'utf8');
    assert.match(log, /provider 429/);
    assert.equal((await tools.call('state', {}, other)).url, BASE_URL);
    await tools.call('close', {}, other);
  } finally { await tools.dispose(); }
});
