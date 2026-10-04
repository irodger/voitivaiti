import {ActionPanel,ActionDock} from './ActionDock';

import {resolveTaskTemplate} from '../content/scenarios';
import {OfficeWorkspace} from './OfficeWorkspace';



import {MorningSync,EndWorkButton} from './WorkLoop';



import {PerformancePanel} from './PerformancePanel';
import {useState,useEffect,useRef} from 'react';
import {Check} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask,isLeader} from '../world/simulation';

import {useI18n} from '../content/localization';
import {EveningScene,SceneMark,PanelFooter} from './SceneDetails';
import {Button,Speech} from './shared';
import type {DayEvent} from '../world/types';

const eventContent:Record<string,{body:string;choices:[string,string][]}>={sync:{body:'syncCopy',choices:[['plan','syncAnswer']]},incident:{body:'incidentCopy',choices:[['rollback','rollback'],['workaround','workaround']]},company:{body:'companyCopy',choices:[['quality','invest'],['rush','rush']]},career:{body:'careerCopy',choices:[['reflect','reflect']]},survey:{body:'surveyCopy',choices:[['yes','surveyYes'],['maybe','surveyMaybe'],['no','surveyNo'],['skip','skip']]}};

export function Work({openLaptop,openCompany,laptopOpen}:{openLaptop:()=>void;openCompany:()=>void;laptopOpen:boolean}){const w=useWorld(),ch=activeCharacter(w),task=activeTask(w),template=task?resolveTaskTemplate(task):undefined,{t}=useI18n(),[eventId,setEventId]=useState<string|null>(null);const contentRef=useRef<HTMLDivElement>(null);const pending=w.schedule.filter(e=>e.status==='pending');const event=pending.find(e=>e.type==='sync')??w.schedule.find(e=>e.id===eventId&&e.status==='pending')??pending[0];useEffect(()=>{contentRef.current?.scrollTo({top:0});},[w.company?.currentDay,event?.id,w.phase]);const project=w.company!.projects.find(p=>p.id===task?.projectId)??w.company!.projects[0];const chooseEvent=(e:DayEvent)=>{setEventId(e.id);if(e.type==='survey')w.dispatch({type:'survey-open'});};return <div className="world-work work-screen"><OfficeWorkspace project={project} laptopOpen={laptopOpen} openLaptop={openLaptop} openCompany={openCompany}/><ActionPanel desktopOnly className={`world-task-panel panel-${w.phase==='reward'?'reward':event?.type??'day-end'}`}><div className="panel-topline"><span>{t(ch.firstDay?.onboardingCompleted?'loop.queue':'ui.todayProgress')}</span><b>{t('ui.eventsDone',{done:w.schedule.length-pending.length,total:w.schedule.length})}</b></div><div className="schedule-strip" aria-label={t('ui.schedule')}>{w.schedule.map(e=><button key={e.id} disabled={e.status==='completed'||e.type==='survey'&&pending.some(p=>p.type==='task')} onClick={()=>chooseEvent(e)} className={event?.id===e.id?'active':''}>{e.status==='completed'?<Check size={13}/>:<span className="event-dot"/>}{t(e.key)}</button>)}</div><div className="office-content" ref={contentRef}>{event?.type!=='sync'&&<><PerformancePanel/></>}{w.phase==='reward'?<div className="reward-scene"><h1>{t('ui.taskDone')}</h1><p>{t(template!.titleKey)}</p><Button onClick={openLaptop}>{t('result.open')}</Button></div>:event?.type==='task'?<><p className="eyebrow">{t('desk.digital')}</p><h1>{t('desk.officeTitle')}</h1><p>{t('desk.officeBody')}</p><ActionDock><Button onClick={openLaptop}>{t(task&&!task.rewarded?'desk.resume':'desk.open')}</Button></ActionDock></>:event?.type==='sync'&&ch.firstDay?.onboardingCompleted?<><h1>{t('loop.dailyTitle')}</h1><p>{t('loop.dailyIntro')}</p><MorningSync eventId={event.id}/></>:event?<><SceneMark kind={event.type}/><p className="eyebrow">{t('ui.day',{day:w.company!.currentDay})}</p><h1>{t(event.key)}</h1><Speech speaker={event.type==='survey'?'oleg':'sergey'}>{t(`ui.${eventContent[event.type].body}`,{name:ch.name})}</Speech><ActionDock><div className="event-choices">{eventContent[event.type].choices.map(([id,key])=><Button key={id} secondary={id==='skip'||id==='workaround'||id==='rush'} onClick={()=>{if(event.type==='survey')w.dispatch({type:'survey-open'});w.dispatch({type:'event',id:event.id,choiceId:id});setEventId(null);}}>{t(`ui.${key==='syncAnswer'&&isLeader(ch)?'syncSenior':key}`)}</Button>)}</div></ActionDock>{event.type==='survey'&&<small>{t('ui.surveyLocal')}</small>}</>:ch.firstDay?.onboardingCompleted?<><h1>{t('desk.officeTitle')}</h1><p>{t('desk.officeBody')}</p><ActionDock><Button onClick={openLaptop}>{t('desk.open')}</Button></ActionDock></>:<><EveningScene/><p className="eyebrow">{t('ui.dayWrapNote')}</p><h1>{t('ui.dayWrapTitle')}</h1><Speech>{t('ui.sleepCopy')}</Speech><Button onClick={()=>w.dispatch({type:'end-day'})}>{t('ui.endDay')}</Button><PanelFooter/></>}<EndWorkButton/></div></ActionPanel></div>}
