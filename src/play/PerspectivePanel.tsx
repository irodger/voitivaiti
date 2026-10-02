import '../content/mastery';
import {useWorld} from '../world/store';
import {activeCharacter,activeTask} from '../world/simulation';
import {rankOf} from '../world/mastery';
import {professionById} from '../content/professions';
import {useI18n} from '../content/localization';
import {Button} from './shared';
import {TermText} from './TermText';
export function PerspectivePanel(){const w=useWorld(),ch=activeCharacter(w),task=activeTask(w),ep=w.perspective,{t}=useI18n();if(!task?.rewarded||ch.completedWork.length<2)return null;const role=ch.profession==='qa'?'frontend':'qa';if(!ep&&ch.experience?.some(e=>e.id==='perspective:'+task.id))return null;return <div className="result-outcome">{!ep?<Button secondary onClick={()=>w.dispatch({type:'perspective-start'})}>{t('mastery.episode',{role:t(professionById[role].titleKey)})}</Button>:<><h3>{t('mastery.episodeTitle')} · {t(professionById[ep.profession].titleKey)}</h3>{ep.observations.map((key,i)=><p key={i}><TermText>{t(key)}</TermText></p>)}{!ep.completed&&(ep.stage>=4?<Button onClick={()=>w.dispatch({type:'perspective-action',id:ep.stage===4?'teach-case':'teach-limits'})}>{t(ep.stage===4?'mastery.teachCase':'mastery.teachLimits')}</Button>:ep.stage<3?<Button onClick={()=>w.dispatch({type:'perspective-action',id:['reproduce','environment','regression'][ep.stage]})}>{t('mastery.'+['reproduce','environment','regression'][ep.stage])}</Button>:<>{['approve','request',...(rankOf(ch)>=1?['mentor']:[])].map(id=><Button key={id} secondary onClick={()=>w.dispatch({type:'perspective-action',id})}>{t('mastery.'+id)}</Button>)}</>)}<Button secondary onClick={()=>w.dispatch({type:'perspective-action',id:'close'})}>{t('mastery.return')}</Button></>}</div>;}
