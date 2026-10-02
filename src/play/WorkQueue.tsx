import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {availableWork,autonomy} from '../world/workLoop';
import {useState} from 'react';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {roleSides} from '../content/life';
import {useI18n} from '../content/localization';
import {Button} from './shared';
import type {WorkKind} from '../world/lifeTypes';

export function WorkQueue({compact=false}:{compact?:boolean}){const w=useWorld(),{t}=useI18n(),ch=activeCharacter(w),[chosen,setChosen]=useState<WorkKind|null>(null),l=w.life;if(!l)return null;if(l.reviewDue||w.time>=1020||w.schedule.some(e=>e.type==='sync'&&e.status==='pending'))return null;const selected=l.queue.find(q=>q.status==='selected'&&!q.delegatedTo);return <div className="priority-queue">{!compact&&<><p className="eyebrow">{t('life.side.'+(roleSides[ch.profession]??'development'))}</p><p>{t('life.side.'+(roleSides[ch.profession]??'development')+'.body')}</p></>}{selected?<div className="selected-priority"><b>{t('life.selected')}: {t('life.work.'+selected.id)}</b><p>{t('life.work.'+selected.id+'.body')}</p></div>:<>{!compact&&<><h2>{t('life.queue')}</h2><p>{t('loop.autonomy'+autonomy(ch))}</p></>}<p className="queue-pick-hint">{t(chosen?'queue.confirmHint':'queue.pickHint')}</p><div className="queue-items">{l.queue.filter(q=>q.status==='waiting'&&availableWork(ch).includes(q.id)).map(q=><button key={q.id} aria-pressed={chosen===q.id} onClick={()=>setChosen(q.id)}><b>{t('life.work.'+q.id)}</b><span className="queue-pick-action">{t(chosen===q.id?'queue.chosen':'queue.choose')}</span><small>{t('life.urgency',{value:q.urgency,minutes:q.minutes})} · {t('loop.age',{days:q.age??0})}</small></button>)}</div>{chosen&&<><p>{t('life.work.'+chosen+'.body')}</p><Button disabled={l.reviewDue} onClick={()=>w.dispatch({type:'priority',id:chosen,explained:true})}>{t('life.explain')}</Button><Button secondary disabled={l.reviewDue} onClick={()=>w.dispatch({type:'priority',id:chosen,explained:false})}>{t('life.dismiss')}</Button></>}</>}</div>}
