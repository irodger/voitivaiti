import puppeteer from 'puppeteer';
import { mkdir, realpath, lstat, appendFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export const BASE_URL = 'http://127.0.0.1:4173/voitivaiti/';
const empty = { type: 'object', properties: {}, additionalProperties: false };
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const str = { type: 'string', minLength: 1, maxLength: 512 };
export const schemas = {
  open: { description: 'Open the local game in an isolated browser. No URL argument. Returns DOM state and element IDs.', input: empty },
  state: { description: 'Read visible DOM text and interactive element IDs. IDs expire after the next state/action.', input: empty },
  click: { description: 'Click one visible element ID returned by the latest state; returns updated DOM state.', input: object({ element: str }) },
  type: { description: 'Replace a text input value using an element ID; returns updated DOM state. No file uploads.', input: object({ element: str, text: { type: 'string', maxLength: 512 } }) },
  screenshot: { description: 'Capture the current page to an automatically named file inside diagnostic artifacts.', input: empty },
  errors: { description: 'Read collected console/page/network errors and blocked requests.', input: empty },
  close: { description: 'Close this QA session browser and clear all element handles. Idempotent.', input: empty },
};

export function allowedURL(value) {
  try {
    const url = new URL(value);
    return url.origin === new URL(BASE_URL).origin && !url.username && !url.password && url.pathname.startsWith('/voitivaiti/');
  } catch { return false; }
}

export function createBrowserTools(projectRoot, { idleMs = 120000 } = {}) {
  const sessions = new Map();
  let queue = Promise.resolve(), disposed = false;
  const enqueue = fn => { const task = queue.then(fn); queue = task.catch(() => {}); return task; };

  async function close(id, reason) {
    const session = sessions.get(id);
    if (!session) return { closed: true, reason, alreadyClosed: true };
    sessions.delete(id);
    clearTimeout(session.timer);
    try { await session.browser.close(); }
    finally {
      await appendFile(session.log, JSON.stringify({ at: new Date().toISOString(), action: 'close', reason }) + '\n');
    }
    return { closed: true, reason, artifacts: session.directory };
  }

  function touch(session, id) {
    clearTimeout(session.timer);
    session.timer = setTimeout(() => void enqueue(() => close(id, 'idle timeout')).catch(console.error), idleMs);
    session.timer.unref();
  }

  async function artifactDirectory(id) {
    const root = await realpath(projectRoot);
    let parent = root;
    for (const part of ['e2e-artifacts', 'qa-browser']) {
      parent = resolve(parent, part);
      await mkdir(parent, { recursive: true });
      if ((await lstat(parent)).isSymbolicLink()) throw new Error('Artifact directories cannot be symlinks/junctions');
      const rel = relative(root, await realpath(parent));
      if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Artifact path escapes project');
    }
    const key = createHash('sha256').update(id).digest('hex').slice(0, 16);
    const directory = resolve(parent, `${key}-${randomUUID()}`);
    await mkdir(directory);
    return directory;
  }

  async function snapshot(session) {
    for (const handle of session.handles.values()) await handle.dispose().catch(() => {});
    session.handles.clear();
    const handles = await session.page.$$('button,input,textarea,select,a,summary,[role="button"],[role="switch"]');
    const elements = [];
    const generation = ++session.generation;
    for (const [i, handle] of handles.entries()) {
      const data = await handle.evaluate(el => {
        const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
        if (!rect.width || !rect.height || style.visibility === 'hidden' || style.display === 'none') return null;
        return { tag: el.tagName.toLowerCase(), type: el.getAttribute('type'), text: (el.innerText || '').slice(0, 200), label: el.getAttribute('aria-label') || el.getAttribute('placeholder') || '', disabled: !!el.disabled, value: el.type === 'password' ? '[redacted]' : String(el.value ?? '').slice(0, 200) };
      });
      if (data && elements.length < 100) {
        const id = `e${generation}-${i}`;
        session.handles.set(id, handle);
        elements.push({ id, ...data });
      } else await handle.dispose();
    }
    return { url: session.page.url(), text: await session.page.evaluate(() => document.body.innerText.slice(0, 14000)), elements };
  }

  async function open(id) {
    if (sessions.has(id)) return snapshot(sessions.get(id));
    if (sessions.size >= 2) throw new Error('At most two QA browser sessions may be open');
    const directory = await artifactDirectory(id);
    const browser = await puppeteer.launch({ headless: true });
    const session = { browser, directory, log: resolve(directory, 'actions.jsonl'), errors: [], handles: new Map(), generation: 0, shots: 0, born: Date.now() };
    sessions.set(id, session);
    try {
      const pages = await browser.pages();
      session.page = pages[0] ?? await browser.newPage();
      const page = session.page;
      page.setDefaultTimeout(7000);
      page.setDefaultNavigationTimeout(15000);
      await page.setViewport({ width: 1280, height: 900 });
      await page.setBypassServiceWorker(true);
      await (await page.createCDPSession()).send('Page.setDownloadBehavior', { behavior: 'deny' });
      browser.on('targetcreated', target => { if (target.type() === 'page') void target.page().then(p => p?.close()).catch(() => {}); });
      const addError = error => { if (session.errors.length < 100) session.errors.push(error); };
      page.on('console', message => { if (message.type() === 'error') addError({ type: 'console', message: message.text().slice(0, 2000) }); });
      page.on('pageerror', error => addError({ type: 'page', message: String(error).slice(0, 2000) }));
      page.on('requestfailed', request => addError({ type: 'network', url: request.url().slice(0, 500), error: request.failure()?.errorText }));
      await page.setRequestInterception(true);
      page.on('request', request => {
        const allowed = allowedURL(request.url()) || (!request.isNavigationRequest() && request.url().startsWith('data:') && request.resourceType() === 'image');
        if (!allowed) addError({ type: 'blocked', url: request.url().slice(0, 500) });
        void (allowed ? request.continue() : request.abort('blockedbyclient')).catch(() => {});
      });
      const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      if (response?.status() !== 200) throw new Error(`Preview HTTP ${response?.status()}`);
      await page.waitForSelector('.world-onboarding, .world-work');
      return await snapshot(session);
    } catch (error) { await close(id, 'open failed'); throw error; }
  }

  async function perform(name, input, context) {
    if (disposed) throw new Error('QA browser plugin disposed');
    if (context.agent !== 'qa') throw new Error('Browser tools are restricted to agent qa');
    if (!schemas[name]) throw new Error('Unknown browser tool');
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Input must be an object');
    const fields = Object.keys(schemas[name].input.properties);
    if (Object.keys(input).some(key => !fields.includes(key))) throw new Error('Unsupported input field');
    for (const field of fields) if (typeof input[field] !== 'string' || input[field].length > 512 || (field !== 'text' && !input[field])) throw new Error(`Invalid ${field}`);
    const id = String(context.sessionID);
    if (context.signal?.aborted) {
      await close(id, 'tool cancelled');
      context.signal.throwIfAborted();
    }
    const abort = () => { void close(id, 'tool cancelled').catch(console.error); };
    context.signal?.addEventListener('abort', abort, { once: true });
    try {
      let result;
      if (name === 'open') result = await open(id);
      else if (name === 'close') result = await close(id, 'explicit');
      else {
        const session = sessions.get(id);
        if (!session) throw new Error('Call qa_browser_open first');
        if (Date.now() - session.born > 600000) { await close(id, 'maximum lifetime'); throw new Error('Browser lifetime exceeded'); }
        if (!allowedURL(session.page.url())) { await close(id, 'navigation boundary'); throw new Error('Page left the permitted application'); }
        if (name === 'state') result = await snapshot(session);
        if (name === 'errors') result = { errors: [...session.errors] };
        if (name === 'screenshot') {
          const path = resolve(session.directory, `shot-${++session.shots}.png`);
          await session.page.screenshot({ path });
          result = { path, url: session.page.url() };
        }
        if (name === 'click' || name === 'type') {
          const handle = session.handles.get(input.element);
          if (!handle) throw new Error('Unknown/stale element ID; call state and use a returned ID');
          if (name === 'click') await handle.asLocator().click();
          else {
            const editable = await handle.evaluate(el => el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && ['text', 'search', 'email', 'url', 'tel', 'password', 'number'].includes(el.type)));
            if (!editable) throw new Error('Element is not a supported text input');
            await handle.click({ clickCount: 3 });
            await handle.press('Backspace');
            await handle.type(input.text);
          }
          result = await snapshot(session);
        }
      }
      context.signal?.throwIfAborted();
      const session = sessions.get(id);
      if (session) {
        touch(session, id);
        await appendFile(session.log, JSON.stringify({ at: new Date().toISOString(), action: name, element: input.element, textLength: input.text?.length, result }) + '\n');
      }
      return result;
    } catch (error) {
      if (context.signal?.aborted) await close(id, 'tool cancelled');
      throw error;
    } finally { context.signal?.removeEventListener('abort', abort); }
  }
  return {
    call: (name, input, context) => enqueue(() => perform(name, input, context)),
    cancel: (sessionID, reason) => enqueue(() => close(String(sessionID), reason)),
    dispose: () => enqueue(async () => { disposed = true; await Promise.all([...sessions.keys()].map(id => close(id, 'plugin unload'))); }),
  };
}
