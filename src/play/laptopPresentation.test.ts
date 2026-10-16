import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('./appEvidence', () => ({ appHasEvidence: vi.fn(() => false) }));
import { appHasEvidence } from './appEvidence';
import { laptopPresentation } from './laptopPresentation';
import { templates } from '../content/scenarios';
import type { Task } from '../world/types';
const template = templates[0],
  step = { ...template.steps[0], app: 'ide' as const };
const task = {
  templateId: template.id,
  currentStepId: step.id,
  progress: {},
  scene: template,
} as Task;
const input = () => ({
  board: false,
  app: 'ide' as const,
  task,
  template,
  view: null,
  step,
  world: { phase: 'office' as const },
});
beforeEach(() => vi.mocked(appHasEvidence).mockReset().mockReturnValue(false));
it('hides journey/header on desk, mail, reward and absent tasks without collecting reference evidence', () => {
  for (const change of [
    { board: true },
    { app: 'mail' as const },
    { world: { phase: 'reward' as const } },
    { task: undefined },
    { template: undefined },
  ]) {
    expect(laptopPresentation({ ...input(), ...change }, 'code')).toEqual({
      context: null,
      emptyReference: false,
    });
  }
  expect(appHasEvidence).not.toHaveBeenCalled();
});
it('preserves task/template references and does not label the current app as an empty reference', () => {
  const result = laptopPresentation(input(), 'code');
  expect(result.context).toEqual({ task, template, app: 'ide' });
  expect(result.context?.task).toBe(task);
  expect(result.emptyReference).toBe(false);
  expect(appHasEvidence).not.toHaveBeenCalled();
});
it('uses the professional editor profile when deciding whether a reference is empty', () => {
  const model = { ...input(), app: 'browser' as const };
  expect(laptopPresentation(model, 'design').emptyReference).toBe(true);
  expect(appHasEvidence).toHaveBeenCalledWith(task, 'browser', 'design');
  vi.mocked(appHasEvidence).mockReturnValue(true);
  expect(laptopPresentation(model, 'design').emptyReference).toBe(false);
});
it('keeps history separate from empty-reference return controls', () => {
  const state = { ...input(), app: 'browser' as const, view: step };
  expect(laptopPresentation(state, 'code').emptyReference).toBe(false);
  expect(appHasEvidence).not.toHaveBeenCalled();
});
