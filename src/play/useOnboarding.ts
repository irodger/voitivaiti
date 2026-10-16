import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professions } from '../content/professions';
import { useWorld } from '../world/store';
export function useOnboarding() {
  const w = useWorld();
  const { t } = useI18n();
  const [avatar, setAvatar] = useState('0');
  const [role, setRole] = useState('frontend');
  const [search, setSearch] = useState('');
  const [seed, setSeed] = useState('');
  const visibleProfessions = professions.filter((p) =>
    `${t(p.titleKey)} ${t(p.descriptionKey)}`.toLowerCase().includes(search.toLowerCase()),
  );
  const startWork = () =>
    w.dispatch({
      type: 'new',
      name: t('first.provisional'),
      avatarId: avatar,
      professionId: role,
      seed: seed ? Number(seed) : crypto.getRandomValues(new Uint32Array(1))[0],
    });
  return {
    visibleProfessions,
    startWork,
    w,
    t,
    avatar,
    setAvatar,
    role,
    setRole,
    search,
    setSearch,
    seed,
    setSeed,
  };
}
