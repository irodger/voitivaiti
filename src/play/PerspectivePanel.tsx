import '../content/mastery';
import { professionById } from '../content/professions';
import { rankOf } from '../world/mastery';
import { ActionDock } from './ActionDock';
import { Button } from './shared';
import { TermText } from './TermText';
import { usePerspectivePanel } from './usePerspectivePanel';
export function PerspectivePanel(){
const model=usePerspectivePanel();if(!model)return null;const {w,ch,ep,t,role}=model;
return <div className="result-outcome">{!ep?<Button secondary onClick={()=>w.dispatch({type:'perspective-start'})}>{t('mastery.episode',{role:t(professionById[role].titleKey)})}</Button>:<><h3>{t('mastery.episodeTitle')} · {t(professionById[ep.profession].titleKey)}</h3>{ep.observations.map((key,i)=><p key={i}><TermText>{t(key)}</TermText></p>)}{!ep.completed&&(ep.stage>=4?<Button onClick={()=>w.dispatch({type:'perspective-action',id:ep.stage===4?'teach-case':'teach-limits'})}>{t(ep.stage===4?'mastery.teachCase':'mastery.teachLimits')}</Button>:ep.stage<3?<Button onClick={()=>w.dispatch({type:'perspective-action',id:['reproduce','environment','regression'][ep.stage]})}>{t('mastery.'+['reproduce','environment','regression'][ep.stage])}</Button>:<>{['approve','request',...(rankOf(ch)>=1?['mentor']:[])].map(id=><Button key={id} secondary onClick={()=>w.dispatch({type:'perspective-action',id})}>{t('mastery.'+id)}</Button>)}</>)}<ActionDock><Button secondary onClick={()=>w.dispatch({type:'perspective-action',id:'close'})}>{t('mastery.return')}</Button></ActionDock></>}</div>;}
