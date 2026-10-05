import { gameConfig } from '../../config/game';
import { currentWalk } from '../walk';
import { carryQueue, finishOfficeHours } from '../workLoop';
import { closeWorkDay, advanceToNextWorkday, settleCalendarDay } from '../life';
import { homeState, recovery } from '../economy';
import { clamp, history, makeSchedule } from '../simulation';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleDay(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, task, effects, emit } = ctx;
    if (action.type === 'montage-close') {
        if (c.phase !== 'home' || !c.life!.montage)
            return { campaign: source, feedback };
        const stop = c.life!.montage.stop;
        c.life!.montage = null;
        advanceToNextWorkday(c);
        c.company.currentDay++;
        c.life!.playedDay++;
        carryQueue(c);
        c.phase = 'office';
        if (!task || task.rewarded)
            c.activeTaskId = null;
        c.time = gameConfig.clock.workdayStart;
        c.dayStart = { ...ch.stats };
        c.dayWorkStart = ch.completedWork.length;
        c.schedule = makeSchedule(c);
        if (stop === 'life.officeIncident' && !c.schedule.some(e => e.type === 'incident'))
            c.schedule.push({ id: 'day-' + c.company.currentDay + '-incident', type: 'incident', status: 'pending', key: 'ui.incident' });
    }
    else if (action.type === 'end-day') {
        c.perspective = undefined;
        if (c.phase !== 'office' || (ch.firstDay && !ch.firstDay.onboardingCompleted ? c.schedule.some(e => e.status === 'pending') : c.schedule.some(e => e.type === 'sync' && e.status === 'pending')))
            return { campaign: source, feedback };
        finishOfficeHours(c);
        if (ch.firstDay?.currentOnboardingStep === 'farewell') {
            ch.firstDay.onboardingCompleted = true;
            ch.firstDay.currentOnboardingStep = 'done';
        }
        c.phase = 'home';
        const settled = settleCalendarDay(c,true), home = homeState(ch);
        if (home.paidDay !== c.company.currentDay) {
            const pay = settled.salary;
            ch.home = { ...home, paidDay: c.company.currentDay, lastPay: pay };
            history(c, 'salary', 'home.pay', { values: { amount: pay } });
            emit('salary_paid', { amount: pay, characterId: ch.id, day: c.company.currentDay });
        }
        closeWorkDay(c);
        history(c, 'day', 'ui.rest');
        emit('day_completed', { day: c.company.currentDay });
    }
    else if (action.type === 'sleep') {
        if (c.phase !== 'home' || currentWalk(ch, c.company.currentDay) || ch.home?.deliveryItemId)
            return { campaign: source, feedback };
        const rest = recovery(ch);
        effects([{ target: 'energy', value: rest.energy }, { target: 'stress', value: -rest.stress }]);
        advanceToNextWorkday(c);
        c.life!.playedDay++;
        c.company.currentDay++;
        carryQueue(c);
        c.phase = 'office';
        if (!task || task.rewarded)
            c.activeTaskId = null;
        c.time = gameConfig.clock.workdayStart;
        c.dayStart = { ...ch.stats };
        c.dayWorkStart = ch.completedWork.length;
        c.schedule = makeSchedule(c);
        const drift = c.company.culture === 'fast' ? 2 : 1;
        c.company.techDebt = clamp(c.company.techDebt + drift);
        c.company.projects.forEach(p => { p.techDebt = clamp(p.techDebt + drift); if (p.techDebt > 65)
            p.stability = clamp(p.stability - 2); });
        emit('day_started', { day: c.company.currentDay });
    }
    else if (action.type === 'reward-close') {
        c.perspective = undefined;
        if (c.phase === 'reward') {
            c.phase = 'office';
            if (ch.firstDay?.currentOnboardingStep === 'work')
                ch.firstDay.currentOnboardingStep = 'farewell';
        }
    }
}
