import { expect, it } from 'vitest';
import { taskContext, taskStepSummary } from './taskContext';
import { templates } from '../content/scenarios';
import type { Task } from '../world/types';
it('has no current step or progress before a task exists', () => {
  expect(taskContext(undefined)).toEqual({ template: undefined, step: undefined, done: 0 });
});
it('prefers the saved task scene and counts only its completed steps without mutation', () => {
  const scene = { ...templates[0], steps: templates[0].steps.slice(0, 2) };
  const task = {
    templateId: templates[1].id,
    scene,
    currentStepId: scene.steps[1].id,
    progress: { [scene.steps[0].id]: { status: 'completed' }, stale: { status: 'completed' } },
    rewarded: true,
  } as unknown as Task;
  const before = JSON.stringify(task);
  const context = taskContext(task);
  expect(context.template).toBe(scene);
  expect(context.step).toBe(scene.steps[1]);
  expect(context.done).toBe(1);
  expect(JSON.stringify(task)).toBe(before);
});
it('uses template fallback and keeps missing current steps distinct from progress', () => {
  const task = { templateId: templates[0].id, currentStepId: 'missing', progress: {} } as Task;
  expect(taskContext(task).template).toBe(templates[0]);
  expect(taskContext(task).step).toBeUndefined();
  expect(taskStepSummary(task, [])).toEqual({ current: undefined, done: 0 });
});
