import '../content/responsibility';
import '../content/promotion';
import {useState} from 'react';
import {Check,LockKeyhole} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask,canPromote} from '../world/simulation';
import {promotionChecks} from '../world/mastery';
import '../content/mastery';
import {professionById} from '../content/professions';
import {text,useI18n} from '../content/localization';
import {Button,Modal} from './shared';

text('careerUx.progress','Подтверждено {done} из {total} условий','{done} of {total} requirements confirmed');
text('careerUx.remaining','Что осталось для повышения','What remains before promotion');
text('careerUx.confirmed','Уже подтверждено · {count}','Already confirmed · {count}');
export function PromotionCard({nodeId}:{nodeId:string}){
 const w=useWorld(),ch=activeCharacter(w),{t}=useI18n(),[open,setOpen]=useState(false);
 const node=professionById[ch.profession].careers.find(n=>n.id===nodeId)!;
 const active=!!activeTask(w)&&!activeTask(w)!.rewarded,ready=canPromote(ch,nodeId)&&!active;
 const checks=[...promotionChecks(ch,nodeId).map(check=>({...check,detail:check.key==='promotion.warning'?'':`${check.current} / ${check.required}`})),{key:'promotion.task',met:!active,detail:''}];
 const requirements=<ul className="requirements">{checks.map(c=><li key={c.key} className={c.met?'met':''}>{c.met?<Check size={15}/>:<LockKeyhole size={14}/>}<span>{t(c.key)}</span>{c.detail&&<b>{c.detail}</b>}</li>)}</ul>;
 const guidance=checks.some(c=>!c.met&&c.key.startsWith('mastery.'))?<details><summary>{t('mastery.path')}</summary>{checks.filter(c=>!c.met&&c.key.startsWith('mastery.')).map(c=><p key={c.key}>{t(c.key.replace('mastery.','mastery.hint.'))}</p>)}{checks.some(c=>c.key==='mastery.mentoringOrReview'&&!c.met)&&activeTask(w)?.rewarded&&<p>{t('mastery.opportunity')}</p>}</details>:null;
 return <article className="world-card promotion-card"><small>{t('ui.next')}</small><h2>{t(node.titleKey)}</h2><p className="promotion-progress" role="status">{t(ready?'promotion.ready':'careerUx.progress',{done:checks.filter(c=>c.met).length,total:checks.length})}</p><Button onClick={()=>setOpen(true)}>{t('ui.promotion')}</Button>{checks.some(c=>!c.met)&&<div className="promotion-remaining"><h3>{t('careerUx.remaining')}</h3><ul className="requirements">{checks.filter(c=>!c.met).map(c=><li key={c.key}><LockKeyhole size={14}/><span>{t(c.key)}</span>{c.detail&&<b>{c.detail}</b>}</li>)}</ul>{guidance}</div>}{checks.some(c=>c.met)&&<details className="promotion-confirmed"><summary>{t('careerUx.confirmed',{count:checks.filter(c=>c.met).length})}</summary><ul className="requirements">{checks.filter(c=>c.met).map(c=><li className="met" key={c.key}><Check size={15}/><span>{t(c.key)}</span>{c.detail&&<b>{c.detail}</b>}</li>)}</ul></details>}
 {open&&<Modal title={t('ui.promotion')+' · '+t(node.titleKey)} onClose={()=>setOpen(false)}>
  <p>{t(ready?'promotion.ready':'promotion.notYet')}</p>
  {requirements}{guidance}
  {(ch.reviewStage??0)>0&&<p>{t('promotion.warningHint',{days:Math.max(0,3-(w.life?.goodDays??0))})}</p>}
  {active&&<p>{t('promotion.taskHint')}</p>}
  {ready?<Button onClick={()=>{w.dispatch({type:'promote',nodeId});setOpen(false);}}>{t('promotion.confirm')}</Button>:<Button secondary onClick={()=>setOpen(false)}>{t('promotion.close')}</Button>}
 </Modal>}
 </article>;
}
