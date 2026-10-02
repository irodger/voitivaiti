import '../content/mastery';
import {currentFocus,type FocusTarget} from './currentFocus';
import {ArrowUpRight,Activity} from 'lucide-react';
import '../content/recovery';
import '../content/corrections';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';

export function LifeStatus({onOpen}:{onOpen?:(target:FocusTarget)=>void}={}){const w=useWorld(),{t}=useI18n(),ch=activeCharacter(w),l=w.life;if(!l)return null;const event=l.worldEvents.at(-1),focus=currentFocus(w),label=t(focus.key,{task:focus.taskId?.startsWith('FE-')?focus.taskId:t('focus.task'),step:focus.stepKey?t(focus.stepKey):'',count:focus.count}),open=focus.target&&onOpen?()=>onOpen(focus.target!):undefined;const content=<><Activity size={17} aria-hidden="true"/><span className="focus-copy"><small>{t('focus.now')}</small><span className="current-status" title={label}>{label}</span></span>{open&&<ArrowUpRight size={17} aria-hidden="true"/>}</>;return <div className="life-status">{open?<button className="focus-bar" onClick={open} aria-label={t('focus.open',{context:label})}>{content}</button>:<div className="focus-bar">{content}</div>}{ch.stats.stress>=70&&<strong role="status">{t('life.warning'+(ch.stats.stress>=95?95:ch.stats.stress>=85?85:70))}</strong>}{event&&event.until>l.calendarDay&&<span title={t('life.event.'+event.id+'.body')}>{t('life.event.'+event.id)} · {t('life.event.'+event.id+'.body')}</span>}{l.salaryHeld>0&&<strong>{t('life.payHeld',{amount:l.salaryHeld})}</strong>}{l.reviewDue&&<strong>{t('life.review')}</strong>}</div>}
