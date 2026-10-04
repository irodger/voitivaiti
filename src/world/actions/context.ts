import type { Campaign, Character, Effect, Feedback, Step, StepProgress, Task, TaskTemplate } from '../types';
import type { Action, TransitionResult } from './types';
import type { trackGameEvent } from '../analytics';
/** Shared transition services. Handlers never clone, finalize, or persist campaigns. */
export type ActionContext = {
    c: Campaign & {
        company: NonNullable<Campaign['company']>;
        life: NonNullable<Campaign['life']>;
    };
    source: Campaign;
    feedback: Feedback[];
    ch: Character;
    task?: Task;
    template?: TaskTemplate;
    step?: Step;
    progress?: StepProgress;
    effects: (list: Effect[]) => void;
    tick: (minutes: number, task?: Task) => void;
    completeStep: (task: Task, step: Step, extra?: Effect[], minutes?: number) => void;
    discover: (ids: string[]) => void;
    emit: typeof trackGameEvent;
    dispatch: (campaign: Campaign, action: Action) => TransitionResult;
};
/** undefined proceeds to common finalization; a result exits exactly as the old branch did. */
export type ActionHandler = (context: ActionContext, action: Action) => TransitionResult | undefined;
