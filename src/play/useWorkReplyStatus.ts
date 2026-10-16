import { CheckCircle2, Clock3 } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { Step, StepProgress } from '../world/types';
export function useWorkReplyStatus(props: {
    step: Step;
    progress: StepProgress;
}) {
    const { step, progress } = props;
    const { t, locale } = useI18n();
    const characters = useWorld(s => s.characters);
    const dependency = progress.dependency;
    const inspected = progress.actionHistory?.some(id => step.actionFlow?.actions.some(a => a.id === id && a.requiresReply));
    if (!dependency || progress.status === 'completed' || inspected)
        return null;
    const npc = characters.find(c => c.id === dependency.npcId);
    const Icon = dependency.ready ? CheckCircle2 : Clock3;
    return { t, locale, dependency, npc, Icon };
}
