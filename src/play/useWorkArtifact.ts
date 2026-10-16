import { ArrowLeftRight, ChartNoAxesCombined, ClipboardList, FileCode2, FileText, Layers, Monitor, Palette } from 'lucide-react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
import type { StepProgress, TechnicalAction } from '../world/types';
export function useWorkArtifact(props: {
    action: TechnicalAction;
    progress: StepProgress;
}) {
    const { action, progress } = props;
    const { t } = useI18n();
    const dispatch = useWorld(s => s.dispatch);
    const artifact = action.artifact!;
    const seen = progress.artifactReadings?.[action.id] ?? [];
    const ArtifactIcon = ({ code: FileCode2, network: ArrowLeftRight, metrics: ChartNoAxesCombined, task: ClipboardList, design: Palette, environment: Monitor, component: Layers } as Record<string, typeof FileText>)[artifact.kind] ?? FileText;
    const required = artifact.rows.filter(row => !row.optional);
    const inspected = required.filter(row => seen.includes(row.id)).length;
    const complete = inspected === required.length;
    const conditions = artifact.rows.filter(row => !row.optional);
    const selected = progress.artifactConditions?.[action.id] ?? conditions[0]?.id;
    const current = conditions.find(row => row.id === selected) ?? conditions[0];
    return { t, dispatch, artifact, seen, ArtifactIcon, required, inspected, complete, conditions, current };
}
