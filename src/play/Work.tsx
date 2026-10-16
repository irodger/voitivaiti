import '../content/timeClarity';
import { ActionDock, ActionPanel } from './ActionDock';
import { OfficeBrief } from './OfficeBrief';
import { useWork } from './useWork';

import { OfficeWorkspace } from './OfficeWorkspace';

import { EndWorkButton, MorningSync } from './WorkLoop';

import { Check } from 'lucide-react';
import { isLeader } from '../world/simulation';
import { PerformancePanel } from './PerformancePanel';

import { EveningScene, PanelFooter, SceneMark } from './SceneDetails';
import { Button, Speech } from './shared';

const eventContent: Record<string, { body: string; choices: [string, string][] }> = {
  sync: { body: 'syncCopy', choices: [['plan', 'syncAnswer']] },
  incident: {
    body: 'incidentCopy',
    choices: [
      ['rollback', 'rollback'],
      ['workaround', 'workaround'],
    ],
  },
  company: {
    body: 'companyCopy',
    choices: [
      ['quality', 'invest'],
      ['rush', 'rush'],
    ],
  },
  career: { body: 'careerCopy', choices: [['reflect', 'reflect']] },
  survey: {
    body: 'surveyCopy',
    choices: [
      ['yes', 'surveyYes'],
      ['maybe', 'surveyMaybe'],
      ['no', 'surveyNo'],
      ['skip', 'skip'],
    ],
  },
};

export function Work({
  openLaptop,
  openCompany,
  laptopOpen,
  openTeam,
}: {
  openLaptop: () => void;
  openCompany: () => void;
  laptopOpen: boolean;
  openTeam?: () => void;
}) {
  const { chooseOption, w, ch, template, t, contentRef, pending, event, project, chooseEvent } =
    useWork();
  return (
    <div className="world-work work-screen">
      <OfficeWorkspace
        project={project}
        laptopOpen={laptopOpen}
        openLaptop={openLaptop}
        openCompany={openCompany}
      />
      <ActionPanel
        desktopOnly
        className={`world-task-panel panel-${w.phase === 'reward' ? 'reward' : (event?.type ?? 'day-end')}`}
      >
        <div className="panel-topline">
          <span>{t(ch.firstDay?.onboardingCompleted ? 'loop.queue' : 'ui.todayProgress')}</span>
          <b>
            {t('ui.eventsDone', {
              done: w.schedule.length - pending.length,
              total: w.schedule.length,
            })}
          </b>
        </div>
        <div className="schedule-strip" aria-label={t('ui.schedule')}>
          {w.schedule.map((e) => (
            <button
              key={e.id}
              disabled={
                e.status === 'completed' ||
                (e.type === 'survey' && pending.some((p) => p.type === 'task'))
              }
              onClick={() => chooseEvent(e)}
              className={event?.id === e.id ? 'active' : ''}
            >
              {e.status === 'completed' ? <Check size={13} /> : <span className="event-dot" />}
              {t(e.key)}
            </button>
          ))}
        </div>
        <div className="office-content" ref={contentRef}>
          {w.life?.weekendSkip && (
            <p className="weekend-time-note">{t('time.weekend', w.life.weekendSkip)}</p>
          )}
          {event?.type !== 'sync' && (
            <>
              <PerformancePanel />
            </>
          )}
          {w.phase === 'reward' ? (
            <div className="reward-scene">
              <h1>{t('ui.taskDone')}</h1>
              <p>{t(template!.titleKey)}</p>
              <Button onClick={openLaptop}>{t('result.open')}</Button>
            </div>
          ) : event?.type === 'task' ? (
            <OfficeBrief openLaptop={openLaptop} openTeam={openTeam} />
          ) : event?.type === 'sync' && ch.firstDay?.onboardingCompleted ? (
            <>
              <h1>{t('loop.dailyTitle')}</h1>
              <p>{t('loop.dailyIntro')}</p>
              <MorningSync eventId={event.id} />
            </>
          ) : event ? (
            <>
              <SceneMark kind={event.type} />
              <p className="eyebrow">{t('ui.day', { day: w.company!.currentDay })}</p>
              <h1>{t(event.key)}</h1>
              <Speech speaker={event.type === 'survey' ? 'oleg' : 'sergey'}>
                {t(`ui.${eventContent[event.type].body}`, { name: ch.name })}
              </Speech>
              <ActionDock>
                <div className="event-choices">
                  {eventContent[event.type].choices.map(([id, key]) => (
                    <Button
                      key={id}
                      secondary={id === 'skip' || id === 'workaround' || id === 'rush'}
                      onClick={() => chooseOption(id)}
                    >
                      {t(`ui.${key === 'syncAnswer' && isLeader(ch) ? 'syncSenior' : key}`)}
                    </Button>
                  ))}
                </div>
              </ActionDock>
              {event.type === 'survey' && <small>{t('ui.surveyLocal')}</small>}
            </>
          ) : ch.firstDay?.onboardingCompleted ? (
            <OfficeBrief openLaptop={openLaptop} openTeam={openTeam} />
          ) : (
            <>
              <EveningScene />
              <p className="eyebrow">{t('ui.dayWrapNote')}</p>
              <h1>{t('ui.dayWrapTitle')}</h1>
              <Speech>{t('ui.sleepCopy')}</Speech>
              <Button onClick={() => w.dispatch({ type: 'end-day' })}>{t('ui.endDay')}</Button>
              <PanelFooter />
            </>
          )}
          <EndWorkButton />
        </div>
      </ActionPanel>
    </div>
  );
}
