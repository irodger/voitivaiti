import { clamp } from '../utils/numbers';
import { stressAfter } from './stress';
import type { Campaign, Effect, Feedback } from './types';
/** Actual clamped feedback and task world-effect attribution live in one place. */
export function applyEffects(c: Campaign, list: Effect[], feedback: Feedback[], actionType: string, sourceTaskRewarded: boolean | undefined) { const ch = c.characters.find(ch => ch.id === c.activeCharacterId)!; for (const e of list) {
    let previous: number, next: number;
    if (e.target in ch.stats) {
        const key = e.target as keyof typeof ch.stats;
        previous = ch.stats[key];
        next = key === 'stress' ? stressAfter(previous, e.value) : key === 'energy' ? clamp(previous + e.value) : key === 'reputation' ? previous + e.value : Math.max(0, previous + e.value);
        ch.stats[key] = next;
    }
    else if (e.target in ch.skills) {
        const key = e.target as keyof typeof ch.skills;
        previous = ch.skills[key];
        next = Math.max(0, previous + e.value);
        ch.skills[key] = next;
    }
    else {
        const project = c.company!.projects.find(p => p.id === c.tasks.find(task => task.id === c.activeTaskId)?.projectId) ?? c.company!.projects[0];
        if (e.target === 'processMaturity') {
            previous = c.company!.processMaturity;
            next = clamp(previous + e.value);
            c.company!.processMaturity = next;
        }
        else {
            previous = project[e.target as 'techDebt' | 'stability' | 'securityLevel'];
            next = clamp(previous + e.value);
            project[e.target as 'techDebt' | 'stability' | 'securityLevel'] = next;
            if (e.target === 'techDebt' || e.target === 'stability')
                c.company![e.target] = clamp(c.company![e.target] + e.value);
        }
        const attributed = c.tasks.find(task => task.id === c.activeTaskId);
        if (attributed && !sourceTaskRewarded && ['technical-action', 'choose', 'submit', 'run', 'finish-run', 'click', 'advance'].includes(actionType)) {
            attributed.appliedWorldEffects ??= [];
            attributed.appliedWorldEffects.push({ target: e.target, value: next - previous });
        }
    }
    if (next !== previous)
        feedback.push({ id: Date.now() + feedback.length, key: `ui.${e.target}`, value: next - previous, good: ['stress', 'techDebt'].includes(e.target) ? next < previous : next > previous });
} }
