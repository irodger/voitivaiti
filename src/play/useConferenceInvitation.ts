import { useState } from 'react';
import { useI18n } from '../content/localization';
import { conferenceOffer } from '../world/conferences';
import { activeCharacter } from '../world/simulation';
import { useWorld } from '../world/store';
export function useConferenceInvitation() {
  const w = useWorld();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<'evidence' | 'handoff'>('evidence');
  const offer = conferenceOffer(w);
  const last = activeCharacter(w).conferences?.at(-1);
  if (!offer && (!last || last.mode === 'skip')) return null;
  const skipConference = () => {
    w.dispatch({ type: 'conference', mode: 'skip', topic });
    setOpen(false);
  };
  return { skipConference, w, t, open, setOpen, topic, setTopic, offer, last };
}
