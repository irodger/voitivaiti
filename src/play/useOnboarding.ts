import { useState } from 'react';
import { useI18n } from '../content/localization';
import { professions, professionById } from '../content/professions';
import { lastPlayerName } from '../world/playerName';
import { useWorld } from '../world/store';
export function useOnboarding() {
  const w = useWorld();
  const { t } = useI18n();
  const [avatar, setAvatar] = useState('0');
  const [role, setRole] = useState('frontend');
  const [search, setSearch] = useState('');
  const [seed, setSeed] = useState('');
  const [name, setName] = useState(lastPlayerName);
  const [confirming, setConfirming] = useState(false);
  const characterName = name.trim().slice(0, 24);
  const profession = professionById[role];
  const replacesCampaign = !!w.company;
  const visibleProfessions = professions.filter((p) =>
    `${t(p.titleKey)} ${t(p.descriptionKey)}`.toLowerCase().includes(search.toLowerCase()),
  );
  const startWork = () => {
    if (!confirming || !characterName) return;
    w.dispatch({
      type: 'new',
      name: characterName,
      avatarId: avatar,
      professionId: role,
      seed: seed ? Number(seed) : crypto.getRandomValues(new Uint32Array(1))[0],
    });
    setConfirming(false);
  };
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
    name,
    setName,
    characterName,
    profession,
    replacesCampaign,
    confirming,
    reviewCharacter: () => {
      if (characterName) setConfirming(true);
    },
    closeConfirmation: () => setConfirming(false),
  };
}
