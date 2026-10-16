import '../content/corrections';
import '../content/mastery';
import '../content/recovery';
import { recentIssues } from '../world/life';
import { Button } from './shared';
import { usePerformancePanel } from './usePerformancePanel';

export function PerformancePanel(){
const model=usePerformancePanel();if(!model)return null;const {life,w,t}=model;
return <div className="performance-panel"><h2>{t('life.review')}</h2><b>{t('life.stage'+Math.min(3,life.reviewStage))}</b><p>{t('life.reviewCopy')}</p><ul>{Object.entries(recentIssues(w)).filter(([,n])=>n>0).map(([key,n])=><li key={key}>{t('life.'+key)}: {n}</li>)}</ul><p>{t('life.reviewRecovery')}</p><Button onClick={()=>w.dispatch({type:'performance',accept:true})}>{t('life.mentor')}</Button><Button secondary onClick={()=>w.dispatch({type:'performance',accept:false})}>{t('life.reject')}</Button></div>}
