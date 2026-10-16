import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import type { LaptopWorkspace } from './useLaptopWorkspace';
export function useLaptopScreen(props: {
    workspace: LaptopWorkspace;
}) {
    const { workspace: w } = props;
    const { t } = useI18n();
    const tools = useLaptopTools();
    const { task, step, app, view } = w;
    return { t, tools, task, step, app, view };
}
