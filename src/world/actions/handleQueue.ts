import { gameConfig } from '../../config/game';
import { assignResponsibility } from '../responsibility';
import { rankOf } from '../mastery';
import { autonomy, availableWork, workOwner } from '../workLoop';
import { history, makeTask } from '../simulation';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleQueue(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, task, effects, tick, emit } = ctx;
    if (action.type === 'pause-task') {
        if (!task || task.rewarded || !Object.values(task.progress).some(p => p.dependency && !p.dependency.ready))
            return { campaign: source, feedback };
        task.paused = true;
        c.activeTaskId = null;
        c.phase = 'office';
        const q = c.life!.queue.find(q => q.id === task.workKind);
        if (q) {
            q.status = 'waiting';
            q.delegatedTo = undefined;
        }
        const event = c.schedule.find(e => e.type === 'task');
        if (event)
            event.status = 'completed';
    }
    else if (action.type === 'resume-task') {
        const pending = c.tasks.find(t => t.id === action.id && t.characterId === ch.id && t.paused && !t.rewarded);
        if (!pending || c.phase !== 'office' || task && !task.rewarded)
            return { campaign: source, feedback };
        pending.paused = false;
        c.activeTaskId = pending.id;
        const q = c.life!.queue.find(q => q.id === pending.workKind);
        if (q) {
            q.status = 'selected';
            q.projectId = pending.projectId;
            q.problemId = pending.problemId;
        }
        const event = c.schedule.find(e => e.type === 'task');
        if (event)
            event.status = 'pending';
    }
    else if (action.type === 'take-task') {
        if (c.phase !== 'office' || c.life!.reviewDue || c.time >= gameConfig.clock.lastTaskStart || c.schedule.some(e => e.type === 'sync' && e.status === 'pending') || task && !task.rewarded)
            return { campaign: source, feedback };
        let selected = c.life!.queue.find(q => q.status === 'selected' && !q.delegatedTo);
        if (!selected) {
            if (autonomy(ch) > 0 && ch.firstDay?.onboardingCompleted)
                return { campaign: source, feedback };
            selected = c.life!.queue.find(q => q.status === 'waiting' && availableWork(ch).includes(q.id));
            if (!selected)
                return { campaign: source, feedback };
            selected.status = 'selected';
            selected.explained = true;
        }
        const paused = c.tasks.find(t => t.paused && !t.rewarded && t.characterId === ch.id && t.workKind === selected.id);
        if (paused) {
            paused.paused = false;
            selected.projectId = paused.projectId;
            selected.problemId = paused.problemId;
            c.activeTaskId = paused.id;
            const event = c.schedule.find(e => e.type === 'task');
            if (event)
                event.status = 'pending';
            return { campaign: c, feedback };
        }
        const next = makeTask(c);
        c.tasks.push(next);
        c.activeTaskId = next.id;
        const event = c.schedule.find(e => e.type === 'task');
        if (event)
            event.status = 'pending';
        emit('task_started', { taskId: next.id, templateId: next.templateId, professionId: ch.profession, day: c.company.currentDay });
    }
    else if (action.type === 'help-work' || action.type === 'delegate-work') {
        if (c.tasks.some(t => t.characterId === ch.id && t.paused && !t.rewarded && t.workKind === action.id))
            return { campaign: source, feedback };
        const q = c.life!.queue.find(q => q.id === action.id && q.status === 'waiting');
        if (c.phase !== 'office' || !ch.firstDay?.onboardingCompleted || !q || task && !task.rewarded || c.schedule.some(e => e.type === 'sync' && e.status === 'pending') || c.time + q.minutes > gameConfig.clock.workdayEnd)
            return { campaign: source, feedback };
        if (action.type === 'delegate-work') {
            const npc = c.characters.find(n => n.id === action.npcId && n.id !== ch.id && n.employed);
            if (rankOf(ch) < 2 || !npc || c.life!.queue.some(q => q.delegatedTo === npc.id))
                return { campaign: source, feedback };
            if (!assignResponsibility(c, q.id, npc.id))
                return { campaign: source, feedback };
            tick(20);
            effects([{ target: 'stress', value: 2 }]);
        }
        else if (ch.completedWork.length >= 2) {
            if (!availableWork(ch).includes(q.id))
                return { campaign: source, feedback };
            q.status = 'selected';
            q.explained = true;
            const next = makeTask(c);
            c.tasks.push(next);
            c.activeTaskId = next.id;
            const event = c.schedule.find(e => e.type === 'task');
            if (event)
                event.status = 'pending';
            emit('task_started', { taskId: next.id, templateId: next.templateId, professionId: ch.profession, workKind: q.id });
        }
        else {
            q.status = 'done';
            tick(q.minutes);
            effects([{ target: 'stress', value: q.urgency >= 4 ? 4 : 2 }, { target: q.id === 'debt' ? 'techDebt' : 'stability', value: q.id === 'debt' ? -4 : 2 }]);
            const r = ch.relationships.find(r => r.characterId === workOwner[q.id]);
            if (r)
                r.trust = Math.min(100, r.trust + 4);
        }
        history(c, 'work', 'life.work.' + q.id);
    }
}
