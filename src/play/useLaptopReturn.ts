import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
export function useLaptopReturn() {
    const { t } = useI18n();
    const tools = useLaptopTools();
    return { t, tools };
}
