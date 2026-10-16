import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '../content/localization';
import { OfficePerson } from './OfficePerson';
import { officeDestination, officeRoute, officeSeatFacing, officeMotionFacing, officeMotionRear, type OfficeActivity, type OfficePoint } from './officeMovement';

export function OfficeColleague({id,avatarId,name,role,index,activity,beat,introducing,unread,onTalk}:{id:string;avatarId:string;name:string;role:string;index:number;activity:OfficeActivity;beat:number;introducing:boolean;unread:boolean;onTalk:(id:string)=>void}) {
 const reduced=useReducedMotion(),destination=officeDestination(index,activity,beat);
 const previous=useRef<OfficePoint>(destination),position=useRef<OfficePoint>(destination),direction=useRef<'left'|'right'>('right'),[facing,setFacing]=useState<'left'|'right'>('right'),[walking,setWalking]=useState(false),rearDirection=useRef(false),[rear,setRear]=useState(false);
 const route=useMemo(()=>officeRoute(previous.current,destination),[destination[0],destination[1]]),moving=route.length>1;
 useEffect(()=>{previous.current=destination;},[destination[0],destination[1]]);
 const {t}=useI18n(),Tag=introducing?'span':'button';
 const atDesk=activity==='work'&&!(beat%4===1&&index===Math.floor(beat/4)%5);
 return <motion.div className={'office-resident'+(walking&&!reduced?' is-walking':'')} initial={false}
  animate={{left:route.map(p=>p[0]+'%'),top:route.map(p=>p[1]+'%')}}
  transition={{duration:reduced?0:moving?Math.min(12,Math.max(4,route.length*1.3)):0,ease:'linear',delay:moving&&!reduced?index*.35:0}}
  onUpdate={latest=>{const point:OfficePoint=[parseFloat(String(latest.left)),parseFloat(String(latest.top))];if(!Number.isFinite(point[0])||!Number.isFinite(point[1]))return;const next=officeMotionFacing(position.current,point,direction.current);const nextRear=officeMotionRear(position.current,point,rearDirection.current);position.current=point;if(nextRear!==rearDirection.current){rearDirection.current=nextRear;setRear(nextRear);}if(next!==direction.current){direction.current=next;setFacing(next);}}}
  onAnimationStart={()=>setWalking(moving&&!reduced)} onAnimationComplete={()=>setWalking(false)}
  style={{zIndex:Math.round(destination[1]),'--person-scale':.85+destination[1]/350} as React.CSSProperties}>
  <Tag className={'resident-target'+(introducing?' office-agent-label':'')} onClick={introducing?undefined:()=>onTalk(id)} aria-label={introducing?undefined:t('ui.talkWith',{name})} title={introducing?undefined:t('ui.talkWith',{name})}>
   <OfficePerson avatarId={avatarId} walking={walking} rear={rear} seated={!walking&&atDesk} facing={walking?facing:officeSeatFacing(index)}/><span className="resident-name">{name}{unread&&!introducing&&<i className="resident-unread"/>}</span><span className="resident-detail"><b>{name}</b><small>{role}</small><small>{t('officePerson.'+(walking?'walking':activity))}</small>{!introducing&&<strong>{t(unread?'officePerson.new':'officePerson.talk')}</strong>}</span>
  </Tag>
 </motion.div>;
}
