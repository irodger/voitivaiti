import { expect, it, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { professionalDecisions } from '../content/professionalDecisions';
import { templateById } from '../content/scenarios';
import { transition } from './engine';
import { emptyCampaign, makeTask, activeCharacter, activeTask } from './simulation';
import { migrateLegacy } from './store';

// Start at a decision boundary; the earlier evidence mechanics are covered separately.
function atDecision(templateId: string) {
  const c = transition(emptyCampaign(), {
    type: 'new',
    name: 'Test',
    avatarId: '1',
    professionId: 'backend',
    seed: 1427,
  }).campaign;
  activeCharacter(c).firstDay!.onboardingCompleted = true;
  activeCharacter(c).firstDay!.currentOnboardingStep = 'done';
  const task = makeTask(c);
  delete task.scene;
  task.templateId = templateId;
  task.currentStepId = 'resolve';
  task.completedStepIds = ['investigate'];
  task.progress = Object.fromEntries(
    templateById[templateId].steps.map((step) => [
      step.id,
      {
        status:
          step.id === 'investigate' ? 'completed' : step.id === 'resolve' ? 'active' : 'locked',
        draft: [],
        allocation: {},
        clicks: 0,
        run: 'idle',
        charged: step.id === 'investigate',
      },
    ]),
  );
  c.tasks = [task];
  c.activeTaskId = task.id;
  c.phase = 'office';
  return c;
}

it.each(Object.keys(professionalDecisions))(
  '%s has two completable choices with persistent, distinct costs and no repeat charging',
  (id) => {
    const step = templateById[id].steps.find((s) => s.id === 'resolve')!;
    expect(step.options!.map((o) => o.id)).toEqual(['durable', 'bad']);
    const outcomes = step.options!.map((option) => {
      const initial = atDecision(id);
      let c = transition(initial, { type: 'choose', id: option.id }).campaign;
      expect(activeTask(c)!.progress.resolve.status).toBe('completed');
      expect(activeTask(c)!.progress.resolve.responseKey).toBe(option.responseKey);
      expect(c.time - initial.time).toBe(step.minutes + option.minutes!);
      const decision = c.life!.professionalDecisions!.find((d) =>
        d.decisionId.endsWith(':resolve'),
      )!;
      expect(decision.tags).toContain(
        option.decisionStyle === 'quality' ? 'qualityFirstDecisions' : 'productFirstDecisions',
      );
      expect(decision.immediateEffects).toEqual([...step.effects, ...option.effects!]);
      c = migrateLegacy(JSON.parse(JSON.stringify(c)));
      const restored = structuredClone(c);
      c = transition(c, { type: 'choose', id: option.id }).campaign;
      expect(c).toEqual(restored);
      c = transition(c, { type: 'advance' }).campaign;
      const task = activeTask(c)!;
      c = transition(c, { type: 'run' }).campaign;
      c = transition(c, { type: 'finish-run', taskId: task.id, stepId: 'review' }).campaign;
      c = transition(c, { type: 'advance' }).campaign;
      expect(c.phase).toBe('reward');
      expect(activeTask(c)!.rewarded).toBe(true);
      return { minutes: restored.time - initial.time, effects: decision.immediateEffects };
    });
    expect(outcomes[0].minutes - outcomes[1].minutes).toBe(20);
    expect(outcomes[0].effects).not.toEqual(outcomes[1].effects);
  },
);
