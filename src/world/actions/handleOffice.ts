import { checkResponsibility } from '../responsibility';
import { startPerspective, perspectiveAction } from '../perspective';
import { communicateExpectation } from '../expectations';
import { takeVacation } from '../life';
import { selectPriority, reviewResponse, decision, montage } from '../life';
import { availableTopics } from '../../content/contextDialogue';
import { history } from '../simulation';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleOffice(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, task, effects, tick, discover, emit } = ctx;
    if (action.type === 'perspective-start') {
        startPerspective(c);
    }
    else if (action.type === 'perspective-action') {
        perspectiveAction(c, action.id);
    }
    else if (action.type === 'office-encounter') {
        if (c.phase === 'office' && !c.schedule.some(e => e.type === 'incident' && e.status === 'pending'))
            c.life!.officeEncounterDay = c.company.currentDay;
    }
    else if (action.type === 'work-expectation') {
        communicateExpectation(c, action.id, action.choice);
    }
    else if (action.type === 'priority') {
        selectPriority(c, action.id, action.explained);
    }
    else if (action.type === 'performance') {
        reviewResponse(c, action.accept);
    }
    else if (action.type === 'delegation-result') {
        checkResponsibility(c, action.id, action.response);
    }
    else if (action.type === 'vacation') {
        takeVacation(c, action.days ?? 7, action.arrangements);
    }
    else if (action.type === 'montage') {
        montage(c);
    }
    else if (action.type === 'event') {
        const event = c.schedule.find(e => e.id === action.id && e.status === 'pending');
        if (!event || event.type === 'task')
            return { campaign: source, feedback };
        const valid: Record<string, string[]> = { sync: ['plan', 'clarify', 'help'], incident: ['rollback', 'workaround'], company: ['quality', 'rush'], career: ['reflect'], survey: ['yes', 'maybe', 'no', 'skip'] };
        if (event.type === 'survey' && c.schedule.some(e => e.type === 'task' && e.status === 'pending'))
            return { campaign: source, feedback };
        if (!valid[event.type]?.includes(action.choiceId))
            return { campaign: source, feedback };
        event.choiceId = action.choiceId;
        event.status = 'completed';
        emit('event_choice', { eventId: event.id, choiceId: action.choiceId, day: c.company.currentDay });
        if (event.type === 'sync') {
            effects([{ target: 'communication', value: 1 }, { target: 'reputation', value: 1 }]);
            tick(15);
            if (action.choiceId !== 'plan') {
                effects([{ target: 'communication', value: 1 }]);
                history(c, 'sync', 'loop.sync.' + action.choiceId);
            }
            discover(['daily']);
        }
        else if (event.type === 'career') {
            effects([{ target: 'communication', value: 1 }, { target: 'reputation', value: 2 }]);
            tick(20);
        }
        else if (event.type === 'survey') {
            c.survey = action.choiceId === 'skip' ? 'skipped' : 'answered';
            c.surveyAnswer = action.choiceId;
            emit(action.choiceId === 'skip' ? 'survey_skipped' : 'survey_answered', { answerId: action.choiceId });
        }
        else {
            const shortcut = ['rush', 'workaround'].includes(action.choiceId);
            effects(shortcut ? [{ target: 'techDebt', value: 12 }, { target: 'stability', value: -5 }, { target: 'reputation', value: 1 }] : [{ target: 'techDebt', value: -6 }, { target: 'stability', value: 10 }, { target: 'processMaturity', value: 4 }]);
            tick(shortcut ? 15 : 40);
            discover(['debt', ...(event.type === 'incident' ? ['rollback'] : [])]);
            const project = c.company.projects.find(p => p.id === task?.projectId) ?? c.company.projects[0];
            if (shortcut) {
                decision(c, 'riskyDeploys');
                const problem = project.problems.find(p => p.status !== 'resolved') ?? project.problems[0];
                problem.workaround = true;
                problem.causedBy = ch.id;
                problem.status = 'planned';
                const h = history(c, 'workaround', 'ui.temporary', { projectId: project.id, problemId: problem.id });
                problem.history.push(h);
                project.history.push(h);
            }
            if (event.type === 'incident') {
                effects([{ target: 'stress', value: 14 }]);
                c.company.incidents.push({ id: event.id, day: c.company.currentDay, resolved: true, projectId: project.id });
                if (task?.status === 'blocked')
                    task.status = 'active';
            }
        }
        history(c, event.type, event.key);
    }
    else if (action.type === 'conversation') {
        const npc = c.characters.find(x => x.id === action.npcId && x.id !== ch.id && x.employed), topic = npc && availableTopics(c, npc).find(x => x.id === action.topicId), choice = topic?.choices.find(x => x.id === action.choiceId);
        const key = action.npcId + ':' + action.topicId;
        if (!npc || !topic || !choice || ch.conversations?.[key])
            return { campaign: source, feedback };
        ch.conversations = { ...ch.conversations, [key]: choice.id };
        ch.dialogueHistory = { ...ch.dialogueHistory, [key]: { topic, choiceId: choice.id, day: c.life!.calendarDay } };
        if (topic.id === 'context-review') {
            const q = c.life!.queue.find(q => q.id === 'review' && q.status !== 'done');
            if (q)
                q.promisedDay = c.life!.calendarDay + 1;
        }
        if (ch.conversationRewardDay !== c.company.currentDay) {
            ch.conversationRewardDay = c.company.currentDay;
            const r = ch.relationships.find(x => x.characterId === npc.id);
            if (r)
                r.trust = Math.min(100, r.trust + 5);
            else
                ch.relationships.push({ characterId: npc.id, trust: 25 });
            effects([{ target: 'communication', value: 1 }]);
        }
        emit('conversation_choice', { characterId: npc.id, topicId: topic.id, choiceId: choice.id });
    }
    else if (action.type === 'survey-open') {
        if (c.survey === 'unseen' && c.schedule.some(e => e.type === 'survey')) {
            c.survey = 'pending';
            emit('survey_shown');
        }
    }
    else if (action.type === 'talk') {
        const npc = c.characters.find(x => x.id === action.id && x.id !== ch.id);
        if (npc && !ch.relationships.some(r => r.characterId === npc.id && r.trust >= 10)) {
            const relation = ch.relationships.find(r => r.characterId === npc.id);
            if (relation)
                relation.trust += 5;
            else
                ch.relationships.push({ characterId: npc.id, trust: 5 });
            effects([{ target: 'communication', value: 1 }]);
            tick(5);
        }
    }
}
