import {newRunTiming} from '../runTiming';
import { personalLifeSnapshot } from '../companyRuntime';
import { startFirstDay } from '../firstDay';
import { ensureLife, initLife, archiveCareer, endCareer } from '../life';
import { canPromote, candidates, history, isLeader } from '../simulation';
import { professionById } from '../../content/professions';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleCareer(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, task, emit } = ctx;
    if (action.type === 'quit') {
        endCareer(c, 'quit');
    }
    else if (action.type === 'rename') {
        const name = action.name.trim().slice(0, 24);
        if (!name)
            return { campaign: source, feedback };
        ch.name = name;
    }
    else if (action.type === 'assign-project') {
        if (c.company.projects.some(p => p.id === action.id) && (!task || task.rewarded)) {
            ch.currentProjectIds = [action.id];
            history(c, 'assignment', 'ui.project', { projectId: action.id });
        }
    }
    else if (action.type === 'promote') {
        if (!canPromote(ch, action.nodeId) || task && !task.rewarded)
            return { campaign: source, feedback };
        ch.careerNodeId = action.nodeId;
        c.life!.roleStartedDay = c.life!.calendarDay;
        ch.milestones = ch.milestones.filter(m => m !== 'performance');
        c.life!.performanceMilestones = 0;
        const e = history(c, 'promotion', professionById[ch.profession].careers.find(n => n.id === action.nodeId)!.titleKey);
        ch.careerHistory.push(e);
        emit('promotion', { characterId: ch.id, careerNodeId: action.nodeId, professionId: ch.profession });
    }
    else if (action.type === 'hire') {
        if (!isLeader(ch) || !['office', 'home'].includes(c.phase) || c.schedule.some(e => e.status === 'pending'))
            return { campaign: source, feedback };
        const candidate = candidates(c).find(p => p.id === action.id);
        if (!candidate)
            return { campaign: source, feedback };
        archiveCareer(c, 'hired_successor');
        ch.playable = false;
        candidate.playable = true;
        candidate.runTiming=newRunTiming();
        candidate.relationships.push({ characterId: ch.id, trust: 15 });
        ch.relationships.push({ characterId: candidate.id, trust: 15 });
        c.characters.push(candidate);
        c.company.employeeIds.push(candidate.id);
        const oldId = ch.id;
        c.activeCharacterId = candidate.id;
        const previousLife = c.life!, calendar = previousLife.calendarDay;
        ch.personalLife = personalLifeSnapshot(c);
        c.life = initLife(c);
        ensureLife(c);
        c.life.daysAtCompany = 1;
        c.life.characterStartedDay = calendar;
        c.life.roleStartedDay = calendar;
        c.activeTaskId = null;
        c.candidateRound++;
        c.phase = 'home';
        candidate.firstDay = startFirstDay(c);
        history(c, 'hired', 'ui.newEmployee');
        emit('character_hired', { characterId: candidate.id, professionId: candidate.profession });
        emit('active_character_changed', { characterId: candidate.id, oldCharacterId: oldId });
    }
}
