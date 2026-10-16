import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
export function useEvidenceEditor() {
    const { t } = useI18n();
    const tools = useLaptopTools();
    const tool = tools.get('ide');
    const Icon = tool.Icon;
    const code = tools.editorKind === 'code';
    return { t, tool, Icon, code };
}
