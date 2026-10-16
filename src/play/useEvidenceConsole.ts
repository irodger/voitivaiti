import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
export function useEvidenceConsole() {
    const { t } = useI18n();
    const tools = useLaptopTools();
    const tool = tools.get('console');
    const Icon = tool.Icon;
    const code = tools.editorKind === 'code';
    return { t, tools, tool, Icon, code };
}
