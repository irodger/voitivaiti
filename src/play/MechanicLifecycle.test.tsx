import { it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
vi.mock('../world/store', async (original) => {
  const actual = await original<typeof import('../world/store')>();
  return { ...actual, useWorld: Object.assign(() => actual.useWorld.getState(), actual.useWorld) };
});
import { useWorld } from '../world/store';
import { beginPlaytest } from '../world/playtestHelpers';
import { makeTask } from '../world/simulation';
import { resolveTaskTemplate } from '../content/scenarios';
import { StepRenderer } from './Mechanic';
it('an outgoing step is safe when pausing removes the active task', () => {
  const c = beginPlaytest('frontend'),
    task = makeTask(c),
    step = resolveTaskTemplate(task).steps[0];
  c.activeTaskId = null;
  useWorld.setState(c);
  expect(renderToStaticMarkup(<StepRenderer step={step} />)).toBe('');
});
