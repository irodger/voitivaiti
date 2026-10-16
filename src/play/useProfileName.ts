import { useState } from 'react';
import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useProfileName() {
    const w = useWorld();
    const ch = activeCharacter(w);
    const { t } = useI18n();
    const [name, setName] = useState(ch.name);
    const saveName = () => w.dispatch({ type: 'rename', name });
    return { saveName, w, ch, t, name, setName };
}
