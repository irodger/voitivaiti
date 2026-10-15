import {useLaptopTools} from '../hooks/useLaptopTools';
import {AnimatePresence,motion} from 'framer-motion';
import {LockKeyhole} from 'lucide-react';
import type {LaptopWorkspace} from '../hooks/useLaptopWorkspace';
import {useI18n} from '../content/localization';
import {appHasEvidence} from './appEvidence';
import {MailInbox} from './MailInbox';
import {WorkClock} from './WorkClock';
import {FirstRunGuide} from './FirstRunGuide';
import {TaskJourney} from './StageJourney';
import {LaptopAppHeader} from './LaptopAppHeader';
import {WorkDesk} from './WorkDesk';
import {TaskResult} from './TaskResult';
import {AppContext} from './AppContext';
import {StepRenderer} from './Mechanic';
import {Button} from './shared';

function LaptopScreen({workspace:w,onClose}:{workspace:LaptopWorkspace;onClose:()=>void}){
 const {t}=useI18n(),tools=useLaptopTools(),{task,step,app,view}=w;
 switch(w.contentKind){
  case 'mail':return <MailInbox onWork={w.openMailWork}/>;
  case 'reward':return <TaskResult closeLabel="desk.back" onClose={w.closeReward}/>;
  case 'desk':return <WorkDesk onInbox={()=>w.openApp('mail')} onOffice={onClose} onResume={w.resume}/>;
  case 'empty':return <div className="empty-app"><h2>{tools.name(app)}</h2><p>{tools.get(app).purpose}</p><Button onClick={w.openDesk}>{t('desk.back')}</Button></div>;
  case 'blocked':return <div className="empty-app"><LockKeyhole size={40}/><p>{t('ui.taskBlocked')}</p><Button onClick={w.openDesk}>{t('desk.back')}</Button></div>;
  case 'history':return <><div className="laptop-history-notice"><p className="read-only-notice">{t('ui.readOnly')}</p></div><StepRenderer step={view!} readOnly viewProgress={task!.progress[view!.id]}/></>;
  case 'step':return <StepRenderer step={step!}/>;
  case 'finished':return <AppContext app={app as Exclude<typeof app,'mail'>} task={task!} onContinue={w.openDesk}/>;
  case 'reference':return <AppContext app={app as Exclude<typeof app,'mail'>} task={task!} onContinue={w.returnCurrent}/>;
 }
}
export function LaptopContent({workspace:w,onClose}:{workspace:LaptopWorkspace;onClose:()=>void}){
 const tools=useLaptopTools();
 const context=!w.board&&w.app!=='mail'&&w.task&&w.template&&w.world.phase!=='reward'
  ?{task:w.task,template:w.template,app:w.app}:null;
 return <>
  <WorkClock onFinish={onClose}/><FirstRunGuide compact/>
  {context&&<TaskJourney compact task={context.task} steps={context.template.steps} selectedId={w.view?.id??w.step?.id??''} onSelect={w.selectStep}/>}
  {context&&<LaptopAppHeader emptyReference={!w.view&&context.app!==w.step?.app&&!appHasEvidence(context.task,context.app,tools.editorKind)} onCurrent={w.returnCurrent} app={w.view?.app??context.app} task={context.task} steps={context.template.steps} view={w.view} onDesk={w.openDesk}/>}
  <AnimatePresence mode="wait"><motion.div key={w.animationKey} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.15}}><LaptopScreen workspace={w} onClose={onClose}/></motion.div></AnimatePresence>
 </>;
}
