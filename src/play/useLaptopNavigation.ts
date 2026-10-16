import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
export function useLaptopNavigation() {
    const { t } = useI18n();
    const tools = useLaptopTools();
    const BrandIcon = tools.get('ide').Icon;
    return { t, tools, BrandIcon };
}
