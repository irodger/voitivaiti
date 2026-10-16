import '../content/waitingWork';
import { unreadCompanyMail } from '../world/companyMail';
import { DeskNextStep } from './DeskNextStep';
import { DeskPulse } from './DeskPulse';
import { WorkdayJourney } from './StageJourney';
import { useWorkDesk } from './useWorkDesk';

import { ArrowRight, BriefcaseBusiness, CalendarDays, Clock3, Mail } from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { professionById } from '../content/professions';
import { resolveTaskTemplate } from '../content/scenarios';
import { RemainderQueue } from './RemainderQueue';
import { Button, formatTime } from './shared';
import { TaskStartButton } from './TaskStartButton';
import { WaitingWork } from './WaitingWork';
import './workDesk.css';
import { WorkExpectations } from './WorkExpectations';
import { WorkQueue } from './WorkQueue';

export function WorkDesk({
  onResume,
  onOffice,
  onInbox,
}: {
  onResume: () => void;
  onOffice?: () => void;
  onInbox?: () => void;
}) {
  const { w, task, ch, t, deskRef, scrollTo, stats, availability, current, sync } = useWorkDesk();

  return (
    <section ref={deskRef} className="work-desk">
      <div className="desk-columns">
        <div className="desk-main">
          <header className="desk-day">
            <div>
              <CalendarDays size={24} />
              <div>
                <small>{t('ui.day', { day: w.company!.currentDay })}</small>
                <h2>{t('desk.day')}</h2>
              </div>
              <b>
                <Clock3 size={16} />
                {formatTime(w.time)}
              </b>
            </div>
            <WorkdayJourney events={w.schedule} onOffice={onOffice} />
          </header>
          <DeskPulse
            onResume={onResume}
            onOffice={onOffice}
            onWaiting={() => scrollTo('.desk-waiting')}
            onQueue={() => scrollTo('.desk-tasks')}
          />
          {onInbox && unreadCompanyMail(w) > 0 && (
            <button className="desk-mail" onClick={onInbox}>
              <Mail size={20} />
              <span>
                <b>{t('mail.title')}</b>
                <small>
                  {t('mail.unread')}: {unreadCompanyMail(w)}
                </small>
              </span>
              <ArrowRight size={18} />
            </button>
          )}
          {availability.waiting.length > 0 && (
            <section className="desk-card desk-waiting">
              <h3>{t('waitingWork.saved')}</h3>
              <WaitingWork />
            </section>
          )}
          <section className="desk-card desk-tasks">
            <header className="desk-card-heading">
              <BriefcaseBusiness size={20} />
              <h2>{t('desk.tasks')}</h2>
              <span>{availability.eligible.length}</span>
            </header>
            <p>{t('desk.intro')}</p>
            {sync ? (
              <article className="desk-sync">
                <CalendarDays size={24} />
                <div>
                  <h3>{t('loop.dailyTitle')}</h3>
                  <p>{t('desk.syncHint')}</p>
                </div>
                {onOffice && <Button onClick={onOffice}>{t('desk.joinSync')}</Button>}
              </article>
            ) : task && !task.rewarded ? (
              <article className="desk-current">
                <small>{t('workspace.currentStep')}</small>
                <h3>{t(resolveTaskTemplate(task!).titleKey)}</h3>
                <Button onClick={onResume}>{t('desk.resume')}</Button>
              </article>
            ) : (
              <>
                {w.schedule.some((e) => e.type === 'task' && e.status === 'pending') ? (
                  <WorkQueue compact />
                ) : (
                  w.life && <RemainderQueue />
                )}
                {availability.reason !== 'empty' && <TaskStartButton />}
              </>
            )}
            <DeskNextStep onOffice={onOffice} />
          </section>
          <section className="desk-card desk-colleagues">
            <h3>{t('desk.colleagues')}</h3>
            <WorkExpectations compact />
          </section>
        </div>
        <aside className="desk-profile">
          <div className="desk-person">
            <img
              className="desk-portrait-scene"
              src={`${import.meta.env.BASE_URL}art/laptop-workspace.webp`}
              alt=""
            />
            <div className="desk-person-caption">
              <CharacterAvatar id={ch.avatarId} size={86} />
              <h3>{ch.name}</h3>
              <p>
                {t(
                  professionById[ch.profession].careers.find((n) => n.id === ch.careerNodeId)!
                    .titleKey,
                )}
              </p>
            </div>
          </div>
          <div className="desk-stats">
            {stats.map(({ id, Icon }) => (
              <div key={id} data-stat={id}>
                <Icon size={17} />
                <span>{t('ui.' + id)}</span>
                <meter
                  min={0}
                  max={100}
                  value={Math.max(0, Math.min(100, ch.stats[id]))}
                  aria-label={t('ui.' + id)}
                />
                <b>{ch.stats[id]}</b>
              </div>
            ))}
          </div>
          <div className="desk-now">
            <small>{t('focus.now')}</small>
            <h3>{current ? t(resolveTaskTemplate(task!).titleKey) : t('desk.tasks')}</h3>
            {current && (
              <button onClick={onResume}>
                {t('desk.resume')}
                <ArrowRight size={15} />
              </button>
            )}
          </div>
          <div className="desk-next">
            <h3>{t('desk.pending')}</h3>
            {w.schedule
              .filter((e) => e.status === 'pending')
              .map((e) => (
                <p key={e.id}>
                  <span className="desk-event-dot" />
                  {t(e.key)}
                </p>
              ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
