import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../content/localization';
import { buildCareerReport } from '../world/careerReport';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useCareerVictory() {
    const w = useWorld();
    const { t } = useI18n();
    const ch = activeCharacter(w);
    const [summary] = useState(() => { const timing = useWorld.getState().characters.find(n => n.id === ch.id)?.runTiming; return { completed: w.tasks.filter(task => task.characterId === ch.id && task.rewarded).length, report: buildCareerReport(w, 'hired_successor'), timing, now: Date.now(), terms: ch.discoveredTerms.length, promotions: ch.careerHistory.filter(e => e.kind === 'promotion').length }; });
    const stats = summary.report.stats;
    const values = [['tasks', summary.completed, CheckCircle2], ['days', stats.calendarDays, CalendarDays], ['played', stats.playedDays, CalendarDays], ['active', summary.timing ? Math.round(summary.timing.activeMs / 60000) : null, Clock3], ['real', summary.timing?.startedAt !== undefined ? Math.floor((summary.now - summary.timing.startedAt) / 86400000) : null, Clock3]] as const;
    const achievements = [['fixes', stats.properFixes], ['reviewed', stats.reviews], ['delegated', stats.delegationsChecked], ['terms', summary.terms], ['promotions', summary.promotions]] as const;
    return { t, ch, summary, values, achievements };
}
