import { LockKeyhole } from 'lucide-react';
import { AppContext } from './AppContext';
import { MailInbox } from './MailInbox';
import { StepRenderer } from './Mechanic';
import { Button } from './shared';
import { TaskResult } from './TaskResult';
import { WorkDesk } from './WorkDesk';
import { useLaptopScreen } from './useLaptopScreen';
import type { LaptopWorkspace } from './useLaptopWorkspace';
export function LaptopScreen({ workspace: w }: { workspace: LaptopWorkspace }) {
  const { closeLaptop, t, tools, task, step, app, view } = useLaptopScreen({ workspace: w });

  switch (w.contentKind) {
    case 'mail':
      return <MailInbox onWork={w.openMailWork} />;
    case 'reward':
      return <TaskResult closeLabel="desk.back" onClose={w.closeReward} />;
    case 'desk':
      return (
        <WorkDesk onInbox={() => w.openApp('mail')} onOffice={closeLaptop} onResume={w.resume} />
      );
    case 'empty':
      return (
        <div className="empty-app">
          <h2>{tools.name(app)}</h2>
          <p>{tools.get(app).purpose}</p>
          <Button onClick={w.openDesk}>{t('desk.back')}</Button>
        </div>
      );
    case 'blocked':
      return (
        <div className="empty-app">
          <LockKeyhole size={40} />
          <p>{t('ui.taskBlocked')}</p>
          <Button onClick={w.openDesk}>{t('desk.back')}</Button>
        </div>
      );
    case 'history':
      return (
        <>
          <div className="laptop-history-notice">
            <p className="read-only-notice">{t('ui.readOnly')}</p>
          </div>
          <StepRenderer step={view!} readOnly viewProgress={task!.progress[view!.id]} />
        </>
      );
    case 'step':
      return <StepRenderer step={step!} />;
    case 'finished':
      return (
        <AppContext app={app as Exclude<typeof app, 'mail'>} task={task!} onContinue={w.openDesk} />
      );
    case 'reference':
      return (
        <AppContext
          app={app as Exclude<typeof app, 'mail'>}
          task={task!}
          onContinue={w.returnCurrent}
        />
      );
  }
}
