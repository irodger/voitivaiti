import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import { randomUUID } from 'node:crypto';

const mode = process.env.E2E_TRACE ?? 'failure';
if (!['failure', 'all', 'off'].includes(mode)) throw new Error('E2E_TRACE must be failure, all, or off');

// Capture the original execution, not a retry after failure. Keep full categories
// and screenshots; retention and lossless compression reduce disk usage.
export async function startTrace(page, directory) {
  if (mode === 'off') return async () => {};
  await mkdir(directory, { recursive: true });
  const pending = `${directory}/trace-${randomUUID()}.pending.json`;
  await page.tracing.start({ path: pending, screenshots: true });
  return async failed => {
    try {
      await page.tracing.stop();
      if (failed || mode === 'all') {
        await pipeline(createReadStream(pending), createGzip(), createWriteStream(`${directory}/trace.json.gz`));
      }
      await unlink(pending);
    } catch (error) {
      // Leave any raw trace in place if compression fails. Never mask the test
      // assertion with a diagnostic failure or silently claim a trace was saved.
      console.warn(`[e2e trace] ${directory}: ${error.stack}; raw trace may remain at ${pending}`);
    }
  };
}
