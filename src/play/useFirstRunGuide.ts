import { ClipboardList, House, Laptop, MessagesSquare, UserRound, UsersRound } from 'lucide-react';
import { useI18n } from '../content/localization';
import { activeCharacter, activeTask } from '../world/simulation';
import { useWorld } from '../world/store';
export function useFirstRunGuide() {
    const w = useWorld();
    const { t } = useI18n();
    const first = activeCharacter(w).firstDay;
    if (!first || first.onboardingCompleted)
        return null;
    const stage = w.phase === 'reward' ? 'result' : first.currentOnboardingStep;
    if (stage === 'work' && !activeTask(w))
        return null;
    const current = ['arrival', 'order', 'project', 'team'].includes(stage) ? (stage === 'arrival' ? 0 : 1) : stage === 'meeting' ? 2 : stage === 'brief' ? 3 : stage === 'work' || stage === 'result' ? 4 : 5;
    const nodes = [{ label: 'introLabel', Icon: UserRound }, { label: 'contextLabel', Icon: UsersRound }, { label: 'meetingLabel', Icon: MessagesSquare }, { label: 'briefLabel', Icon: ClipboardList }, { label: 'workLabel', Icon: Laptop }, { label: 'homeLabel', Icon: House }];
    return { t, stage, current, nodes };
}
