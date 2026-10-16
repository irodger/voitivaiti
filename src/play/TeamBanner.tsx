import { Users, MessagesSquare, HeartHandshake } from 'lucide-react';
import type { TeamDirectory } from './teamDirectory';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { useI18n } from '../content/localization';
import '../content/teamView';
export function TeamBanner({ directory }: { directory: TeamDirectory }) {
  const { t } = useI18n(),
    { people, topics, companyNameKey } = directory;
  return (
    <header className="team-banner">
      <div className="team-banner-copy">
        <p className="eyebrow">{t(companyNameKey)}</p>
        <h1>{t('ui.team')}</h1>
        <h2>{t('teamChat.intro')}</h2>
        <p>{t('teamView.help')}</p>
        <div className="team-banner-stats">
          <span>
            <Users size={17} />
            <b>{people.length}</b> {t('teamView.people')}
          </span>
          <span>
            <MessagesSquare size={17} />
            <b>{topics}</b> {t('teamView.topics')}
          </span>
        </div>
      </div>
      <div className="team-banner-people" aria-hidden="true">
        {people.slice(0, 5).map((c) => (
          <CharacterAvatar key={c.id} id={c.avatarId} size={72} />
        ))}
        <HeartHandshake className="team-banner-symbol" size={96} />
      </div>
    </header>
  );
}
