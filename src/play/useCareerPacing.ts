import { useState } from 'react';
import { useI18n } from '../content/localization';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useCareerPacing() {
  const w = useWorld();
  const ch = activeCharacter(w);
  const l = w.life!;
  const { t } = useI18n();
  const [map, setMap] = useState(false);
  const [ending, setEnding] = useState(false);
  const endCareer = () => {
    w.dispatch({ type: 'quit' });
    setEnding(false);
  };
  return { endCareer, w, ch, l, t, map, setMap, ending, setEnding };
}
