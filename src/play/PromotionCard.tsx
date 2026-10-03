import '../content/responsibility';
import '../content/promotion';
import {useState} from 'react';
import {Check,LockKeyhole} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask,canPromote} from '../world/simulation';
import {promotionChecks} from '../world/mastery';
import '../content/mastery';
import {professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import {Button,Modal} from './shared';

export function PromotionCard({nodeId}:{nodeId:string}){
 const w=useWorld(),ch=activeCharacter(w),{t}=useI18n(),[open,setOpen]=useState(false);
 const node=professionById[ch.profession].careers.find(n=>n.id===nodeId)!;
 const active=!!activeTask(w)&&!activeTask(w)!.rewarded,ready=canPromote(ch,nodeId)&&!active;
 const checks=[...promotionChecks(ch,nodeId).map(check=>({...check,detail:check.key==='promotion.warning'?'':`${check.current} / ${check.required}`})),{key:'promotion.task',met:!active,detail:''}];
 const requirements=<ul className="requirements">{checks.map(c=><li key={c.key} className={c.met?'met':''}>{c.met?<Check size={15}/>:<LockKeyhole size={14}/>}<span>{t(c.key)}</span>{c.detail&&<b>{c.detail}</b>}</li>)}</ul>;
 const guidance=<details><summary>{t('mastery.path')}</summary>{checks.filter(c=>!c.met&&c.key.startsWith('mastery.')).map(c=><p key={c.key}>{t(c.key.replace('mastery.','mastery.hint.'))}</p>)}{checks.some(c=>c.key==='mastery.mentoringOrReview'&&!c.met)&&activeTask(w)?.rewarded&&<p>{t('mastery.opportunity')}</p>}</details>;
 return <article className="world-card"><small>{t('ui.next')}</small><h2>{t(node.titleKey)}</h2>{requirements}{guidance}<Button onClick={()=>setOpen(true)}>{t('ui.promotion')}</Button>
 {open&&<Modal title={t('ui.promotion')+' · '+t(node.titleKey)} onClose={()=>setOpen(false)}>
  <p>{t(ready?'promotion.ready':'promotion.notYet')}</p>
  {requirements}{guidance}
  {(ch.reviewStage??0)>0&&<p>{t('promotion.warningHint',{days:Math.max(0,3-(w.life?.goodDays??0))})}</p>}
  {active&&<p>{t('promotion.taskHint')}</p>}
  {ready?<Button onClick={()=>{w.dispatch({type:'promote',nodeId});setOpen(false);}}>{t('promotion.confirm')}</Button>:<Button secondary onClick={()=>setOpen(false)}>{t('promotion.close')}</Button>}
 </Modal>}
 </article>;
}
