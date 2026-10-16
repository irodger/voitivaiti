import { useI18n } from '../content/localization';
import { formatNumber } from '../utils/format';
import { useWorld } from '../world/store';
export function useMoneyReceipt() {
    const w = useWorld();
    const { t, locale } = useI18n();
    const receipt = w.moneyArrival;
    if (!receipt)
        return null;
    const money = (value: number) => formatNumber(value, locale) + ' ₽';
    return { w, t, receipt, money };
}
