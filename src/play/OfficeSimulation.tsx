import {useMediaQuery} from '../hooks/useMediaQuery';
import {gameConfig} from '../config/game';
import '../content/officePeople';
import {professionById} from '../content/professions';
import {useEffect,useRef,useState} from 'react';
import {useReducedMotion} from 'framer-motion';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask} from '../world/simulation';
import {careerRank} from '../world/life';
import {hasNewTopic} from '../content/contextDialogue';
import {useI18n} from '../content/localization';
import {characterName} from './shared';
import {OfficeColleague} from './OfficeColleague';
import {residentActivity,type OfficeActivity} from './officeMovement';
import './officeMovement.css';

export function OfficeSimulation({onTalk,paused=false}:{onTalk:(id:string)=>void;paused?:boolean}) {
 const w=useWorld(),{t}=useI18n(),reduced=useReducedMotion(),compact=useMediaQuery(gameConfig.ui.compactQuery),[beat,setBeat]=useState(0),host=useRef<HTMLDivElement>(null),[size,setSize]=useState({width:0,height:0});
 useEffect(()=>{const node=host.current;if(!node)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(node);return()=>observer.disconnect();},[]);
 useEffect(()=>{if(reduced||paused)return;const timer=setInterval(()=>{if(!document.hidden)setBeat(b=>b+1)},18000);return()=>clearInterval(timer)},[reduced,paused]);

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
  <div className="office-world-plane" style={{width,height}}>{people.map((c,i)=><OfficeColleague key={c.id} id={c.id} avatarId={c.avatarId} name={characterName(c,t)} role={roleName(c)} index={i} activity={residentActivity(i,activity,reviewerIndex)} beat={beat} introducing={introducing} unread={hasNewTopic(w,c)} onTalk={onTalk}/>)}<OfficeColleague id={player.id} avatarId={player.avatarId} name={characterName(player,t)} role={t('officePerson.you')} index={5} activity={activity} beat={beat} introducing={true} unread={false} onTalk={onTalk}/></div>
  <div className="office-experience">{t('life.role'+(['Junior','Middle','Senior','Lead'][Math.min(3,careerRank(activeCharacter(w)))]))}</div>
 </div>;
}
