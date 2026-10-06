import {Check,LockKeyhole,ShieldAlert,ArrowRight} from 'lucide-react';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask} from '../world/simulation';
import {promotionChecks} from '../world/mastery';
import {warningReviewDetails} from '../world/warningReview';
import {formatCalendarDate} from '../utils/format';
import {recentIssues} from '../world/life';
import {useI18n} from '../content/localization';
import '../content/promotionClarity';
import '../content/promotion';
import '../content/mastery';
import './promotionClarity.css';
export function PromotionRequirements({nodeId,onWork}:{nodeId:string;onWork?:()=>void}){
 const w=useWorld(),ch=activeCharacter(w),{t,locale}=useI18n(),active=!!activeTask(w)&&!activeTask(w)!.rewarded;
 const checks=promotionChecks(ch,nodeId),experience=checks.filter(c=>c.key!=='promotion.warning'),missing=experience.filter(c=>!c.met),done=experience.filter(c=>c.met);
 const warning=warningReviewDetails(w);
 const level=ch.reviewStage??0,goodDays=Math.max(0,Math.min(2,w.life?.goodDays??0)),issues=w.life?Object.entries(recentIssues(w)).filter(([,count])=>count>0):[];
 return <div className="promotion-clarity">{level>0&&<section className="promotion-warning"><header><ShieldAlert size={24}/><div><h3>{t('promotionClarity.blocked')}</h3><span>{t('promotionClarity.level',{level})}</span></div></header><p className="promotion-recovery-goal">{t('promotionClarity.recovery',{days:3-goodDays})}</p><progress max={3} value={goodDays} aria-label={t('promotionClarity.progress',{done:goodDays})}/><small>{t('promotionClarity.progress',{done:goodDays})}</small><p>{t('promotionClarity.rule')}</p>{level>1&&<p>{t('promotionClarity.levels')}</p>}{warning?<details open><summary>{t('promotionClarity.reviewDate',{date:formatCalendarDate(warning.day,locale)})}</summary><p>{t('promotionClarity.reviewIssues')}</p>{warning.issues.length?<ul>{warning.issues.map(issue=><li key={issue.key}>{t('life.'+issue.key)}<b>{issue.count}</b></li>)}</ul>:<p>{t('promotionClarity.noRecordedIssues')}</p>}</details>:<p>{t('promotionClarity.unknown')}</p>}{issues.length?<details><summary>{t('promotionClarity.issues')}</summary><ul>{issues.map(([key,count])=><li key={key}>{t('life.'+key)}<b>{count}</b></li>)}</ul></details>:null}{w.life?.reviewDue&&<p>{t('promotionClarity.pending')}</p>}</section>}{(missing.length>0||active)&&<section><h3>{t('promotionClarity.remaining')}</h3><ul className="requirements">{missing.map(c=><li key={c.key}><LockKeyhole size={14}/><span>{t(c.key)}</span><b>{c.current} / {c.required}</b></li>)}{active&&<li><LockKeyhole size={14}/><span>{t('promotion.taskHint')}</span></li>}</ul>{missing.length>0&&<details><summary>{t('mastery.path')}</summary>{missing.filter(c=>c.key.startsWith('mastery.')).map(c=><p key={c.key}>{t(c.key.replace('mastery.','mastery.hint.'))}</p>)}</details>}</section>}{!level&&!missing.length&&!active&&<p className="promotion-all-ready"><Check size={17}/>{t('promotionClarity.ready')}</p>}{done.length>0&&<details className="promotion-done"><summary>{t('promotionClarity.confirmed',{count:done.length})}</summary><ul className="requirements">{done.map(c=><li className="met" key={c.key}><Check size={14}/><span>{t(c.key)}</span><b>{t('promotionClarity.done')}</b></li>)}</ul></details>}{onWork&&(level>0||active||missing.length>0)&&<button className="primary-button" onClick={onWork}>{t('promotionClarity.work')}<ArrowRight size={18}/></button>}</div>;
}
