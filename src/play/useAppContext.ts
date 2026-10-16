import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import type { AppId, Task } from '../world/types';
import { EvidenceBrowser, EvidenceChat, EvidenceConsole, EvidenceEditor } from './AppEvidencePanels';
import { useAppEvidence } from './useAppEvidence';
const panels = { ide: EvidenceEditor, console: EvidenceConsole, browser: EvidenceBrowser, chat: EvidenceChat };
export function useAppContext(props: {
    app: AppId;
    task: Task;
}) {
    const { app, task } = props;
    const { t } = useI18n();
    const tools = useLaptopTools();
    const model = useAppEvidence(task, app, tools.editorKind);
    const Panel = panels[app];
    const workApp = tools.name(model.step.app);
    const materialEditor = app === 'ide' && tools.editorKind !== 'code';
    const returnLabel = t(task.rewarded ? 'desk.back' : 'ui.goApp', { app: workApp });
    return { t, tools, model, Panel, workApp, materialEditor, returnLabel };
}
