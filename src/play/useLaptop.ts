import { useIsPresent } from 'framer-motion';
import { useRef } from 'react';
import { useI18n } from '../content/localization';
import { useLaptopTools } from '../hooks/useLaptopTools';
import { useModalInteraction } from '../hooks/useModalInteraction';
import { laptopFamily } from './laptopDevices';
import { useLaptopWorkspace } from './useLaptopWorkspace';
export function useLaptop(onClose: () => void) {
    const present = useIsPresent();
    const w = useLaptopWorkspace();
    const tools = useLaptopTools();
    const { t } = useI18n();
    const ref = useRef<HTMLDivElement>(null);
    const device = laptopFamily(w.world.characters.find(ch => ch.id === w.world.activeCharacterId)?.profession ?? '');
    useModalInteraction(ref, onClose);
    return { present, w, tools, t, ref, device };
}
