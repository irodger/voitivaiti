import { hasNewTopic } from '../content/contextDialogue';
import { professionById } from '../content/professions';
import { characterName } from '../utils/characterName';
import { careerRank } from '../world/life';
import { activeCharacter, activeTask } from '../world/selectors';
import type { Campaign } from '../world/types';
import { residentActivity, type OfficeActivity } from './officeMovement';
/** Match the background's 4:3 crop/letterboxing without reading the DOM. */
export function officeViewport(size: { width: number; height: number }, compact: boolean) {
  // Keep the actor plane aligned with the background, including mobile letterboxing.
  const width = (compact ? Math.min : Math.max)(size.width, (size.height * 4) / 3);
  // Keep the actor plane aligned with the background, including mobile letterboxing.
  const height = (width * 3) / 4;

  return { width, height };
}
/** Pure scene projection; timers, observers and encounter dispatch stay in the controller. */
export function officeSceneModel(
  w: Campaign,
  beat: number,
  t: (key: string) => string,
  onTalk: (id: string) => void,
) {
  const first = activeCharacter(w).firstDay;
  const introducing =
    !!first && !['work', 'farewell', 'done'].includes(first.currentOnboardingStep);
  const task = activeTask(w);
  const incident = w.schedule.some((e) => e.type === 'incident' && e.status === 'pending');
  const review = task?.status === 'review';
  const qa = task?.status === 'qa';
  const dispute = !introducing && !incident && !review && beat % 6 === 3;
  const activity: OfficeActivity = incident
    ? 'incident'
    : review || qa
      ? 'review'
      : first?.currentOnboardingStep === 'meeting' ||
          w.schedule.some((e) => e.type === 'sync' && e.status === 'pending') ||
          dispute
        ? 'meeting'
        : w.time >= 1080
          ? 'evening'
          : w.time >= 780 && w.time <= 840
            ? 'lunch'
            : 'work';
  const status = incident
    ? 'officeIncident'
    : review
      ? 'officeReview'
      : qa
        ? 'officeQa'
        : activity === 'meeting'
          ? dispute
            ? 'officeDispute'
            : 'officeMeeting'
          : activity === 'evening'
            ? 'officeEvening'
            : activity === 'lunch'
              ? 'officeLunch'
              : 'officeWork';
  const people = w.characters.filter((c) => c.employed && c.id !== w.activeCharacterId).slice(0, 5);
  const player = activeCharacter(w);
  const reviewerIndex = Math.max(
    0,
    people.findIndex((c) =>
      qa ? professionById[c.profession].family === 'qa' : c.profession === player.profession,
    ),
  );
  const roleName = (c: typeof player) =>
    t(
      professionById[c.profession].careers.find((n) => n.id === c.careerNodeId)?.titleKey ??
        professionById[c.profession].titleKey,
    );
  const residents = people.map((c, i) => ({
    id: c.id,
    avatarId: c.avatarId,
    name: characterName(c, t),
    role: roleName(c),
    index: i,
    activity: residentActivity(i, activity, reviewerIndex),
    beat,
    introducing,
    unread: hasNewTopic(w, c),
    onTalk,
  }));
  const playerProps = {
    id: player.id,
    avatarId: player.avatarId,
    name: characterName(player, t),
    role: t('officePerson.you'),
    index: 5,
    activity,
    beat,
    introducing: true,
    unread: false,
    onTalk,
  };
  const experience = t(
    'life.role' +
      ['Junior', 'Middle', 'Senior', 'Lead'][Math.min(3, careerRank(activeCharacter(w)))],
  );

  return { dispute, status, residents, playerProps, experience };
}
