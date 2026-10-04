import { handleTask } from './handleTask';
import type { Action } from './types';
import type { ActionHandler } from './context';
import { handleHome } from './handleHome';
import { handleDay } from './handleDay';
import { handleCareer } from './handleCareer';
import { handleOffice } from './handleOffice';
import { handleQueue } from './handleQueue';
export const actionHandlers: Partial<Record<Action['type'], ActionHandler>> = {
    'order': handleHome,
    'inspect-delivery': handleHome,
    'close-delivery': handleHome,
    'unpack': handleHome,
    'buy-home': handleHome,
    'start-walk': handleHome,
    'walk-route': handleHome,
    'end-walk': handleHome,
    'evening': handleHome,
    'montage-close': handleDay,
    'end-day': handleDay,
    'sleep': handleDay,
    'reward-close': handleDay,
    'rename': handleCareer,
    'quit': handleCareer,
    'promote': handleCareer,
    'hire': handleCareer,
    'assign-project': handleCareer,
    'perspective-start': handleOffice,
    'perspective-action': handleOffice,
    'office-encounter': handleOffice,
    'work-expectation': handleOffice,
    'priority': handleOffice,
    'performance': handleOffice,
    'delegation-result': handleOffice,
    'vacation': handleOffice,
    'montage': handleOffice,
    'event': handleOffice,
    'conversation': handleOffice,
    'survey-open': handleOffice,
    'talk': handleOffice,
    'pause-task': handleQueue,
    'resume-task': handleQueue,
    'take-task': handleQueue,
    'help-work': handleQueue,
    'delegate-work': handleQueue,
    'artifact-condition': handleTask,
    'artifact-compare': handleTask,
    'artifact-inspect': handleTask,
    'technical-action': handleTask,
    'choose': handleTask,
    'draft': handleTask,
    'allocate': handleTask,
    'submit': handleTask,
    'run': handleTask,
    'finish-run': handleTask,
    'click': handleTask,
    'advance': handleTask
} satisfies Record<Exclude<Action['type'], 'new' | 'onboarding' | 'discover-term' | 'next-career' | 'conference'>, ActionHandler>;
