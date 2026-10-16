import { Check } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { OfficeScene } from '../components/OfficeScene';
import { ProfessionIcon } from '../components/ProfessionIcon';
import { ProfessionPreview } from './ProfessionPreview';
import { Button, Speech } from './shared';
import { useOnboarding } from './useOnboarding';
import { useStartLanguage } from './useStartLanguage';

export function Onboarding() {
  const {
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
  } = useOnboarding();
  return (
    <main className={`world-onboarding ${w.phase === 'create' ? 'creating' : ''}`}>
      <section>
        <p className="eyebrow">
          <i className="live-dot" />
          {t('ui.gameLabel')}
        </p>
        <StartLanguage />
        {w.phase === 'start' ? (
          <>
            <h1 className="world-title">
              {t('ui.brand')
                .split(' ')
                .map((x, i) => (
                  <span key={i}>{x}</span>
                ))}
            </h1>
            <h2>{t('ui.tagline')}</h2>
            <p className="start-copy">{t('ui.startCopy')}</p>
            <Button onClick={w.begin}>{t('ui.enter')}</Button>
            <p className="fine-print">{t('ui.introNote')}</p>
          </>
        ) : (
          <>
            <h1>{t('ui.create')}</h1>
            <div className="creation-row">
              <label>
                {t('ui.seed')}
                <input
                  type="number"
                  value={seed}
                  placeholder="1427"
                  onChange={(e) => setSeed(e.target.value)}
                />
              </label>
            </div>
            <div className="world-avatars" aria-label={t('ui.avatar')}>
              {Array.from({ length: 24 }, (_, i) => (
                <button
                  key={i}
                  aria-pressed={avatar === String(i)}
                  onClick={() => setAvatar(String(i))}
                >
                  <CharacterAvatar id={String(i)} size={43} />
                </button>
              ))}
            </div>
            <h2>{t('ui.profession')}</h2>
            <input
              className="role-search"
              aria-label={t('ui.searchRoles')}
              placeholder={t('ui.searchRoles')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="world-role-grid">
              {visibleProfessions.map((p) => (
                <button
                  key={p.id}
                  data-profession={p.id}
                  aria-pressed={role === p.id}
                  className={role === p.id ? 'selected' : ''}
                  onClick={() => setRole(p.id)}
                >
                  <ProfessionIcon profession={p.id} />
                  <b>{t(p.titleKey)}</b>
                  <small>{t(p.descriptionKey)}</small>
                  {role === p.id && <Check size={16} />}
                </button>
              ))}
            </div>
            <ProfessionPreview role={role} />
            <Button onClick={startWork}>{t('ui.workStart')}</Button>
          </>
        )}
      </section>
      <aside>
        <OfficeScene hero />
        <div className="onboarding-sticky">
          <Speech>{t('npc.sergey.line')}</Speech>
        </div>
        <p className="fine-print">{t('ui.introNote')}</p>
      </aside>
    </main>
  );
}

function StartLanguage() {
  const { locale, setLocale } = useStartLanguage();
  return (
    <nav className="start-language" aria-label="Language / Язык">
      <button lang="ru" aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>
        Русский
      </button>
      <button lang="en" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
        English
      </button>
    </nav>
  );
}
