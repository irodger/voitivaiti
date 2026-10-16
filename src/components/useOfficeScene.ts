import { useId, useState } from 'react';
import { useI18n } from '../content/localization';
import { useWorld } from '../world/store';
export function useOfficeScene() {
    const [selected, setSelected] = useState<string | null>(null);
    const id = useId().replaceAll(':', '');
    const world = useWorld();
    const { t } = useI18n();
    const npc = world.characters.find(n => n.id === selected);
    return { selected, setSelected, id, world, t, npc };
}
