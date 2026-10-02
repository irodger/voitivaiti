import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {useWorld} from '../world/store';
import {recentIssues} from '../world/life';
import {useI18n} from '../content/localization';
import {Button} from './shared';

export function PerformancePanel(){const w=useWorld(),{t}=useI18n();if(!w.life?.reviewDue)return null;return <div className="performance-panel"><h2>{t('life.review')}</h2><b>{t('life.stage'+Math.min(3,w.life.reviewStage))}</b><p>{t('life.reviewCopy')}</p><ul>{Object.entries(recentIssues(w)).filter(([,n])=>n>0).map(([key,n])=><li key={key}>{t('life.'+key)}: {n}</li>)}</ul><p>{t('life.reviewRecovery')}</p><Button onClick={()=>w.dispatch({type:'performance',accept:true})}>{t('life.mentor')}</Button><Button secondary onClick={()=>w.dispatch({type:'performance',accept:false})}>{t('life.reject')}</Button></div>}
