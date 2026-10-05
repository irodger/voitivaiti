import {newRunTiming} from './runTiming';
import { createActionServices } from './actions/services';
import { attendConference } from './conferences';
import { resolveTaskTemplate } from '../content/scenarios';
import '../content/walk';
import { startFirstDay, advanceFirstDay } from './firstDay';
import { glossary } from '../content/world';
import { ensureLife, initLife, finishLife } from './life';
import type { Campaign, Feedback } from './types';
import { activeCharacter, activeTask, emptyCampaign, generateWorld, history, makeCharacter, makeSchedule } from './simulation';
import { professionById } from '../content/professions';

export type { Action } from './actions/types';
import type { Action } from './actions/types';
import type { ActionContext } from './actions/context';
import { actionHandlers } from './actions/registry';
import { handleTask } from './actions/handleTask';
export function transition(source: Campaign, action: Action): {
    campaign: Campaign;
    feedback: Feedback[];
} {
    const c = ensureLife(structuredClone(source)), feedback: Feedback[] = [];
    const services = createActionServices(c, source, action, feedback);
    const { emit } = services;
    if (action.type === 'new') {
        if (!professionById[action.professionId] || !['start', 'create'].includes(c.phase))
            return { campaign: source, feedback };
        const fresh = emptyCampaign(), world = generateWorld(action.seed >>> 0), ch = makeCharacter(crypto.randomUUID(), action.name.trim().slice(0, 24) || 'Саша', action.avatarId, action.professionId);
        ch.runTiming=newRunTiming();
        ch.currentProjectIds = [world.company.projects[0].id];
        const meta = c.meta;
        Object.assign(c, fresh, world, { activeCharacterId: ch.id, characters: [...world.characters, ch], phase: 'office' });
        c.meta = meta;
        c.life = initLife(c);
        c.company!.employeeIds.push(ch.id);
        c.schedule = makeSchedule(c);
        ch.firstDay = startFirstDay(c);
        history(c, 'created', 'ui.newCompany');
        emit('game_started');
        emit('character_created', { characterId: ch.id });
        emit('profession_selected', { professionId: ch.profession });
        emit('day_started', { day: 1 });
        finishLife(c);
        return { campaign: c, feedback };
    }
    if (!c.company || !c.characters.some(ch => ch.id === c.activeCharacterId))
        return { campaign: source, feedback };
    const ch = activeCharacter(c), task = activeTask(c), template = task ? resolveTaskTemplate(task) : undefined, step = template?.steps.find(s => s.id === task?.currentStepId), progress = step && task?.progress[step.id];
    if (action.type === 'discover-term') {
        const term = glossary.find(g => g.id === action.id);
        if (term && !ch.discoveredTerms.includes(term.id)) {
            ch.discoveredTerms.push(term.id);
            ch.termMemories ??= {};
            ch.termMemories[term.id] = { firstSeenContext: action.context.slice(0, 500), discoveredAt: c.life!.calendarDay, profession: ch.profession, scenario: task?.templateId ?? ('first-day:' + ch.firstDay?.currentOnboardingStep) };
            emit('term_discovered', { termId: term.id, characterId: ch.id });
        }
        return { campaign: c, feedback };
    }
    if (action.type === 'onboarding') {
        advanceFirstDay(c, action);
        return { campaign: c, feedback };
    }
    if (ch.firstDay && !ch.firstDay.onboardingCompleted && !['work', 'farewell'].includes(ch.firstDay.currentOnboardingStep) && !['rename', 'conversation', ...(c.phase === 'home' ? ['sleep'] : [])].includes(action.type))
        return { campaign: source, feedback };
    if (ch.firstDay?.currentOnboardingStep === 'farewell' && action.type !== 'end-day' && !['rename', 'conversation'].includes(action.type))
        return { campaign: source, feedback };
    if (c.life!.montage && !['montage-close', 'rename', 'quit', 'next-career'].includes(action.type))
        return { campaign: source, feedback };
    if (c.phase === 'ended' && action.type !== 'next-career' && !['rename', 'conversation'].includes(action.type))
        return { campaign: source, feedback };
    if (action.type === 'next-career') {
        if (c.phase !== 'ended')
            return { campaign: source, feedback };
        const fresh = emptyCampaign();
        return { campaign: { ...fresh, meta: c.meta, phase: 'create' }, feedback };
    }
    const ctx: ActionContext = { c: c as ActionContext['c'], source, feedback, ch, task, template, step, progress, ...services, dispatch: transition };
    const handler = actionHandlers[action.type];
    const result = handler ? handler(ctx, action) : handleTask(ctx, action);
    if (result)
        return result;
    if (action.type === 'conference' && attendConference(c, action.mode, action.topic))
        emit('conference_choice', { mode: action.mode, topic: action.topic });
    finishLife(c);
    return { campaign: c, feedback };
}
