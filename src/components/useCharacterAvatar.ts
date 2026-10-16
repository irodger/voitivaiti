import { useId } from 'react';
import { useI18n } from '../content/localization';
export function useCharacterAvatar(props: {
    id?: string;
}) {
    const { id = '0' } = props;
    const { t } = useI18n();
    const variant = Math.floor(Number(id) / 6) % 4;
    const i = Number(id) % 6;
    const uid = useId().replaceAll(':', '');
    const colors = ['#d2e4bf', '#ebc9b4', '#d3d5ed', '#e5d69c', '#bcd9da', '#efc5ce'];
    const shirt = ['#506e5c', '#c16f54', '#7c80a7', '#b99a50', '#537b91', '#a06380'][i];
    const skin = ['#edb98f', '#f2c3a6', '#b87c5b', '#e6ab80', '#d29b73', '#efba98'][i];
    return { t, variant, i, uid, colors, shirt, skin };
}
