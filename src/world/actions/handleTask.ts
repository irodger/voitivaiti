import {applyPaymentAction} from '../paymentCausal';
import { recordEncounter } from '../problemStories';
import { handoffCandidate } from '../responsibility';
import { assignResponsibility, checkResponsibility } from '../responsibility';
import { recordWorkExperience } from '../mastery';
import { commitSceneOutcome } from '../sceneConsequences';
import { isOrderedPlan, planOrder } from '../planOrder';
import { availableTechnicalActions } from '../technicalActions';
import { isConsequential, recordDecision } from '../decisions';
import { decision } from '../life';
import type { Effect } from '../types';
import { clamp, history } from '../simulation';
import type { Action, TransitionResult } from './types';
import type { ActionContext } from './context';
export function handleTask(ctx: ActionContext, action: Action): TransitionResult | undefined {
    const { c, source, feedback, ch, task, template, step, progress, effects, tick, completeStep, discover, emit, dispatch } = ctx;
    if (!task || !step || !progress || !template || c.phase !== 'office' || task.status === 'completed' || task.status === 'blocked')
        return;
    const finished = progress.status === 'completed';
    if (action.type === 'advance') {
        if (!finished)
            return { campaign: source, feedback };
        const next = template!.steps[template!.steps.indexOf(step) + 1];
        if (next) {
            task.currentStepId = next.id;
            task.progress[next.id].status = 'active';
            task.status = next.type === 'review' ? 'review' : next.type === 'visual-compare' && task.templateId === 'FE-1427' ? 'qa' : 'active';
            discover(next.terms ?? []);
        }
        else if (!task.rewarded && template!.steps.every(s => task.completedStepIds.includes(s.id))) {
            effects(template!.rewards);
            task.rewarded = true;
            task.status = 'completed';
            const selected = c.life!.queue.find(q => q.id === (task.workKind ?? c.life!.queue.find(q => q.status === 'selected' && !q.delegatedTo)?.id));
            if (selected)
                selected.status = 'done';
            ch.completedWork.push(task.id);
            recordWorkExperience(c, task);
            ch.scenarioCounts[task.templateId] = (ch.scenarioCounts[task.templateId] ?? 0) + 1;
            if (!ch.milestones.includes('independent'))
                ch.milestones.push('independent');
            const project = c.company.projects.find(p => p.id === task.projectId)!, problem = project.problems.find(p => p.id === task.problemId)!;
            if (!problem.contributions.includes(template!.contribution))
                problem.contributions.push(template!.contribution);
            problem.status = problem.contributions.includes('repair') && problem.contributions.includes('validation') ? 'resolved' : 'planned';
            effects(template!.completionEffects ?? []);
            c.company.reputation = clamp(c.company.reputation + 1);
            const h = history(c, 'task', template!.titleKey, { projectId: project.id, problemId: problem.id });
            problem.history.push(h);
            project.history.push(h);
            if (problem.workaround && problem.status === 'resolved')
                problem.workaround = false;
            commitSceneOutcome(c, task);
            recordEncounter(c, task, problem);
            if (selected?.expectation)
                selected.expectation.state = 'resolved';
            c.schedule.find(e => e.type === 'task')!.status = 'completed';
            c.phase = 'reward';
            emit('task_completed', { taskId: task.id, templateId: task.templateId, minutes: task.taskElapsedMinutes, projectId: project.id, problemId: problem.id });
        }
    }
    else if (finished)
        return { campaign: source, feedback };
    else if (action.type === 'artifact-compare') {
        const candidate = availableTechnicalActions(step, progress).find(a => a.id === action.id);
        if (!candidate?.artifact || !candidate.artifact.rows.filter(row => !row.optional).every(row => progress.artifactReadings?.[candidate.id]?.includes(row.id)))
            return { campaign: source, feedback };
        return dispatch(c, { type: 'technical-action', id: candidate.id });
    }
    else if (action.type === 'artifact-condition') {
        const candidate = availableTechnicalActions(step, progress).find(a => a.id === action.actionId);
        if (!candidate?.artifact?.experiment || !candidate.artifact.rows.some(row => row.id === action.rowId && !row.optional))
            return { campaign: source, feedback };
        progress.artifactConditions = { ...progress.artifactConditions, [candidate.id]: action.rowId };
    }
    else if (action.type === 'artifact-inspect') {
        const candidate = availableTechnicalActions(step, progress).find(a => a.id === action.actionId);
        if (!candidate?.artifact?.rows.some(row => row.id === action.rowId))
            return { campaign: source, feedback };
        const seen = progress.artifactReadings?.[candidate.id] ?? [];
        if (seen.includes(action.rowId))
            return { campaign: source, feedback };
        progress.artifactReadings = { ...progress.artifactReadings, [candidate.id]: [...seen, action.rowId] };
        emit('artifact_inspected', { taskId: task.id, stepId: step.id, actionId: candidate.id, rowId: action.rowId });
    }
    else if (action.type === 'technical-action') {
        const next = availableTechnicalActions(step, progress).find(a => a.id === action.id);
        if (!next)
            return { campaign: source, feedback };
        if (next.requiresEvidence && next.artifact && !next.artifact.rows.filter(r => !r.optional).every(r => progress.artifactReadings?.[next.id]?.includes(r.id)))
            return { campaign: source, feedback };
        progress.observations = { ...progress.observations, [next.id]: (task.outcome && next.observationByOutcome?.[task.outcome.kind]) ?? next.observationKey };
        effects(next.effects ?? []);
        if (next.worldContribution) {
            const problem = c.company.projects.find(p => p.id === task.projectId)!.problems.find(p => p.id === task.problemId)!;
            if (!problem.contributions.includes(next.worldContribution))
                problem.contributions.push(next.worldContribution);
        }
        if (next.outcome)
            task.outcome = structuredClone(next.outcome);
        progress.actionHistory = [...(progress.actionHistory ?? []), next.id];
        progress.choiceId = next.id;
        progress.responseKey = undefined;
        tick(next.minutes, task);
        if (next.dependency) {
            const q = c.life!.queue.find(q => q.id === task.workKind), npc = next.dependencyRole?c.characters.find(n=>n.id!==ch.id&&n.employed&&n.profession===next.dependencyRole):q && handoffCandidate(c, q);
            if (npc) {
                progress.dependency = { npcId: npc.id, dueDay: c.life!.calendarDay, dueMinute: c.time + 30, ready: false, responseKey:next.dependencyResponseKey };
                if (next.delegates && q && assignResponsibility(c, q.id, npc.id)) {
                    const job = c.company.delegations!.at(-1)!;
                    job.dueDay = c.life!.calendarDay;
                    job.dueMinute = c.time + 30;
                    progress.dependency.delegationId = job.id;
                }
            }
            else
                progress.dependency = { npcId: template!.author, dueDay: c.life!.calendarDay, dueMinute: c.time + 30, ready: false, responseKey:next.dependencyResponseKey };
        }
        if(next.id==='causal-delegate'&&!progress.dependency?.delegationId)progress.observations![next.id]='payment.causal.delegateBusy';
        applyPaymentAction(c,task,next);
        if (next.completes && progress.dependency?.delegationId)
            checkResponsibility(c, progress.dependency.delegationId, next.id === 'bounded-result' ? 'clarify' : 'accept');
        task.attemptsByStep[step.id] = (task.attemptsByStep[step.id] ?? 0) + 1;
        emit('task_action', { taskId: task.id, stepId: step.id, actionId: next.id, observationKey: next.observationKey });
        if (next.completes) {
            if (!progress.charged) {
                effects(step.effects);
                progress.charged = true;
            }
            completeStep(task, step);
        }
    }
    else if (action.type === 'draft') {
        if (!step.items?.some(i => i.id === action.id) || step.type === 'resource-allocation')
            return { campaign: source, feedback };
        progress.draft = isOrderedPlan(step) ? [action.id, ...planOrder(step, progress.draft).filter(id => id !== action.id)] : progress.draft.includes(action.id) ? progress.draft.filter(id => id !== action.id) : [...progress.draft, action.id];
    }
    else if (action.type === 'allocate') {
        if (step.type !== 'resource-allocation' || !step.items?.some(i => i.id === action.id) || !Number.isInteger(action.value))
            return { campaign: source, feedback };
        progress.allocation[action.id] = Math.max(0, Math.min(step.budget ?? 10, action.value));
    }
    else if (action.type === 'choose' || action.type === 'submit') {
        if (step.type === 'review' && progress.run !== 'done')
            return { campaign: source, feedback };
        let correct = false;
        let extra: Effect[] = [];
        let minutes = 0;
        if (action.type === 'choose') {
            const option = step.options?.find(o => o.id === action.id);
            if (!option)
                return { campaign: source, feedback };
            correct = isConsequential(step) || option.correct !== false;
            progress.choiceId = option.id;
            progress.responseKey = option.responseKey;
            extra = option.effects ?? [];
            minutes = option.minutes ?? 0;
            emit('task_choice', { taskId: task.id, templateId: task.templateId, stepId: step.id, choiceId: option.id, ...(!isConsequential(step) ? { correct } : {}) });
        }
        else {
            if (isOrderedPlan(step))
                progress.draft = planOrder(step, progress.draft);
            if (!step.solution)
                return { campaign: source, feedback };
            const ordered = ['planning', 'incident-response'].includes(step.type);
            if (Array.isArray(step.solution)) {
                correct = ordered ? JSON.stringify(progress.draft) === JSON.stringify(step.solution) : [...progress.draft].sort().join('|') === [...step.solution].sort().join('|');
            }
            else
                correct = Object.entries(step.solution).every(([id, value]) => (progress.allocation[id] ?? 0) === value);
            if (isConsequential(step)) {
                const total = Object.values(progress.allocation).reduce((a, b) => a + b, 0);
                if (step.type === 'resource-allocation' ? (total <= 0 || total > (step.budget ?? Infinity)) : progress.draft.length === 0)
                    return { campaign: source, feedback };
                correct = true;
                progress.choiceId = JSON.stringify(step.type === 'resource-allocation' ? progress.allocation : progress.draft);
            }
            progress.responseKey = isConsequential(step) ? 'decision.committed' : correct ? 'ui.correctPlan' : (step.failureKey ?? 'ui.wrongPlan');
            emit('task_choice', { taskId: task.id, stepId: step.id, choiceId: step.type + '-submit', ...(!isConsequential(step) ? { correct } : {}) });
        }
        task.attemptsByStep[step.id] = (task.attemptsByStep[step.id] ?? 0) + 1;
        if (correct) {
            if (isConsequential(step))
                recordDecision(c, task, step, [...step.effects, ...extra]);
            completeStep(task, step, extra, minutes);
        }
        else {
            decision(c, 'technicalMistakes');
            if (task.attemptsByStep[step.id] > 1)
                decision(c, 'repeatedMistakes');
            effects(step.wrongEffects);
            tick(step.wrongMinutes, task);
        }
    }
    else if (action.type === 'run') {
        if (step.actionFlow)
            return { campaign: source, feedback };
        if (!['terminal', 'review', 'console'].includes(step.type) || progress.run !== 'idle')
            return { campaign: source, feedback };
        if (!progress.charged) {
            effects(step.effects);
            tick(step.minutes, task);
            progress.charged = true;
        }
        if (step.type === 'console') {
            progress.run = 'done';
            completeStep(task, step);
        }
        else
            progress.run = 'running';
    }
    else if (action.type === 'finish-run') {
        if (action.taskId !== task.id || action.stepId !== step.id || progress.run !== 'running')
            return { campaign: source, feedback };
        progress.run = 'done';
        if (!step.options)
            completeStep(task, step);
    }
    else if (action.type === 'click') {
        if (step.type !== 'bug-reproduction' || progress.clicks >= 2)
            return { campaign: source, feedback };
        progress.clicks++;
        tick(progress.clicks === 1 ? Math.floor(step.minutes / 2) : Math.ceil(step.minutes / 2), task);
        if (progress.clicks === 2) {
            effects(step.effects);
            progress.charged = true;
            completeStep(task, step);
        }
    }
}
