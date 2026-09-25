import '../content/promotion';
import {useState} from 'react';
import {Check,LockKeyhole} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask,canPromote} from '../world/simulation';
import {tenureRequired} from '../world/life';
import {professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';

export function PromotionCard({nodeId}:{nodeId:string}){
 const w=useWorld(),ch=activeCharacter(w),{t}=useI18n(),[open,setOpen]=useState(false);
 const node=professionById[ch.profession].careers.find(n=>n.id===nodeId)!,r=node.requirements;
 const active=!!activeTask(w)&&!activeTask(w)!.rewarded,ready=canPromote(ch,nodeId)&&!active;
 const numeric:[string,number,number][]=[['ui.tasksDone',ch.completedWork.length,Math.max(4,r.work)],['ui.craft',ch.skills.craft,r.craft],['ui.reputation',ch.stats.reputation,r.reputation],['ui.communication',ch.skills.communication,r.communication],['ui.leadership',ch.skills.leadership,r.leadership],['promotion.tenure',ch.roleTenure??0,tenureRequired(Number(nodeId.split('-')[1]))]];
 const checks=[...numeric.filter(([, ,need])=>need>0).map(([key,value,need])=>({key,met:value>=need,detail:value+' / '+need})),
 ...(r.milestone?[{key:'ui.milestone',met:ch.milestones.includes(r.milestone),detail:''}]:[]),
 {key:'promotion.review',met:(ch.performanceMilestones??0)>0,detail:''},
 {key:'promotion.warning',met:(ch.reviewStage??0)===0,detail:''},
 {key:'promotion.task',met:!active,detail:''}];
 const requirements=<ul className="requirements">{checks.map(c=><li key={c.key} className={c.met?'met':''}>{c.met?<Check size={15}/>:<LockKeyhole size={14}/>}<span>{t(c.key)}</span>{c.detail&&<b>{c.detail}</b>}</li>)}</ul>;
 return <article className="world-card"><small>{t('ui.next')}</small><h2>{t(node.titleKey)}</h2>{requirements}<Button onClick={()=>setOpen(true)}>{t('ui.promotion')}</Button>
 {open&&<Modal title={t('ui.promotion')+' · '+t(node.titleKey)} onClose={()=>setOpen(false)}>
  <p>{t(ready?'promotion.ready':'promotion.notYet')}</p>
  {requirements}
  {(ch.roleTenure??0)<tenureRequired(Number(nodeId.split('-')[1]))&&<p>{t('promotion.tenureHint')}</p>}
  {(ch.reviewStage??0)>0&&<p>{t('promotion.warningHint',{days:Math.max(0,3-(w.life?.goodDays??0))})}</p>}
  {(ch.performanceMilestones??0)===0&&<p>{t('promotion.reviewHint')}</p>}
  {active&&<p>{t('promotion.taskHint')}</p>}
  {ready?<Button onClick={()=>{w.dispatch({type:'promote',nodeId});setOpen(false);}}>{t('promotion.confirm')}</Button>:<Button secondary onClick={()=>setOpen(false)}>{t('promotion.close')}</Button>}
 </Modal>}
 </article>;
}
