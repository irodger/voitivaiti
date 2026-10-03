import '../content/officePeople';
import {professionById} from '../content/professions';
import {useEffect,useMemo,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask} from '../world/simulation';
import {careerRank} from '../world/life';
import {hasNewTopic} from '../content/contextDialogue';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {OfficePerson} from './OfficePerson';
import {officeDestination,officeRoute,residentActivity,type OfficeActivity,type OfficePoint} from './officeMovement';
import './officeMovement.css';

function Colleague({id,avatarId,name,role,index,activity,beat,introducing,unread,onTalk}:{id:string;avatarId:string;name:string;role:string;index:number;activity:OfficeActivity;beat:number;introducing:boolean;unread:boolean;onTalk:(id:string)=>void}) {
 const reduced=useReducedMotion(),destination=officeDestination(index,activity,beat);
 const previous=useRef<OfficePoint>(destination),[walking,setWalking]=useState(false);
 const route=useMemo(()=>officeRoute(previous.current,destination),[destination[0],destination[1]]),moving=route.length>1;
 useEffect(()=>{previous.current=destination;},[destination[0],destination[1]]);
 const {t}=useI18n(),Tag=introducing?'span':'button';
 const atDesk=activity==='work'&&!(beat%4===1&&index===Math.floor(beat/4)%5);
 return <motion.div className={'office-resident'+(walking&&!reduced?' is-walking':'')} initial={false}
  animate={{left:route.map(p=>p[0]+'%'),top:route.map(p=>p[1]+'%')}}
  transition={{duration:reduced?0:moving?Math.min(12,Math.max(4,route.length*1.3)):0,ease:'linear',delay:moving&&!reduced?index*.35:0}}
  onAnimationStart={()=>setWalking(moving)} onAnimationComplete={()=>setWalking(false)}
  style={{zIndex:Math.round(destination[1]),'--person-scale':.85+destination[1]/350} as React.CSSProperties}>
  <Tag className={'resident-target'+(introducing?' office-agent-label':'')} onClick={introducing?undefined:()=>onTalk(id)} aria-label={introducing?undefined:t('ui.talkWith',{name})} title={introducing?undefined:t('ui.talkWith',{name})}>
   <OfficePerson avatarId={avatarId} walking={walking} seated={!walking&&atDesk}/><span className="resident-name">{name}{unread&&!introducing&&<i className="resident-unread"/>}</span><span className="resident-detail"><b>{name}</b><small>{role}</small><small>{t('officePerson.'+(walking?'walking':activity))}</small>{!introducing&&<strong>{t(unread?'officePerson.new':'officePerson.talk')}</strong>}</span>
  </Tag>
 </motion.div>;
}
export function OfficeSimulation({onTalk,paused=false}:{onTalk:(id:string)=>void;paused?:boolean}) {
 const w=useWorld(),{t}=useI18n(),reduced=useReducedMotion(),[compact,setCompact]=useState(()=>window.matchMedia('(max-width:1023px)').matches),[beat,setBeat]=useState(0),host=useRef<HTMLDivElement>(null),[size,setSize]=useState({width:0,height:0});
 useEffect(()=>{const node=host.current;if(!node)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(node);return()=>observer.disconnect();},[]);
 useEffect(()=>{if(reduced||paused)return;const timer=setInterval(()=>{if(!document.hidden)setBeat(b=>b+1)},18000);return()=>clearInterval(timer)},[reduced,paused]);
 useEffect(()=>{const query=window.matchMedia('(max-width:1023px)'),update=()=>setCompact(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 const first=activeCharacter(w).firstDay,introducing=!!first&&!['work','farewell','done'].includes(first.currentOnboardingStep);
 const task=activeTask(w),incident=w.schedule.some(e=>e.type==='incident'&&e.status==='pending'),review=task?.status==='review',qa=task?.status==='qa',dispute=!introducing&&!incident&&!review&&beat%6===3;
 useEffect(()=>{if(dispute&&w.phase==='office'&&w.life?.officeEncounterDay!==w.company?.currentDay)w.dispatch({type:'office-encounter'});},[dispute,w.phase,w.life?.officeEncounterDay,w.company?.currentDay]);
 const activity:OfficeActivity=incident?'incident':review||qa?'review':first?.currentOnboardingStep==='meeting'||w.schedule.some(e=>e.type==='sync'&&e.status==='pending')||dispute?'meeting':w.time>=1080?'evening':w.time>=780&&w.time<=840?'lunch':'work';
 const status=incident?'officeIncident':review?'officeReview':qa?'officeQa':activity==='meeting'?(dispute?'officeDispute':'officeMeeting'):activity==='evening'?'officeEvening':activity==='lunch'?'officeLunch':'officeWork';
 const people=w.characters.filter(c=>c.employed&&c.id!==w.activeCharacterId).slice(0,5);
 // Keep the actor plane aligned with the background, including mobile letterboxing.
 const width=(compact?Math.min:Math.max)(size.width,size.height*4/3),height=width*3/4;
 const player=activeCharacter(w);
 const reviewerIndex=Math.max(0,people.findIndex(c=>qa?professionById[c.profession].family==='qa':c.profession===player.profession));
 const roleName=(c:typeof player)=>t(professionById[c.profession].careers.find(n=>n.id===c.careerNodeId)?.titleKey??professionById[c.profession].titleKey);
 return <div ref={host} className="office-simulation living-office">
  <div className="office-activity" role="status">{t('life.'+status)}</div>
  <div className="office-world-plane" style={{width,height}}>{people.map((c,i)=><Colleague key={c.id} id={c.id} avatarId={c.avatarId} name={characterName(c,t)} role={roleName(c)} index={i} activity={residentActivity(i,activity,reviewerIndex)} beat={beat} introducing={introducing} unread={hasNewTopic(w,c)} onTalk={onTalk}/>)}<Colleague id={player.id} avatarId={player.avatarId} name={characterName(player,t)} role={t('officePerson.you')} index={5} activity={activity} beat={beat} introducing={true} unread={false} onTalk={onTalk}/></div>
  <div className="office-experience">{t('life.role'+(['Junior','Middle','Senior','Lead'][Math.min(3,careerRank(activeCharacter(w)))]))}</div>
 </div>;
}
