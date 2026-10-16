import type { Campaign } from './types';

type CharacterSelection = Pick<Campaign, 'characters' | 'activeCharacterId'>;
type TaskSelection = Pick<Campaign, 'tasks' | 'activeTaskId'>;

/** Optional lookup for startup, restored saves and other guarded callers. */
export const findActiveCharacter = (campaign: CharacterSelection) =>
  campaign.characters.find(character => character.id === campaign.activeCharacterId);

/** Callers must already have an active character, as in the simulation API. */
export const activeCharacter = (campaign: CharacterSelection) => findActiveCharacter(campaign)!;

export const activeTask = (campaign: TaskSelection) =>
  campaign.tasks.find(task => task.id === campaign.activeTaskId);
