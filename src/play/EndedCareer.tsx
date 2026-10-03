import {CareerReport} from './CareerReport';
import {MetaMap} from './MetaMap';
import '../content/mastery';
import '../content/recovery';
import '../content/corrections';
import {useWorld} from '../world/store';
import {activeCharacter} from '../world/simulation';
import {useI18n} from '../content/localization';
import {Button,characterName} from './shared';

export function EndedCareer(){const w=useWorld(),{t}=useI18n();return <section className="collection-view world-collection ended-career"><p className="eyebrow">{characterName(activeCharacter(w),t)}</p><h1>{t('life.ended')}</h1><h2>{t('life.'+w.life!.ended)}</h2>{w.meta!.careers.find(r=>r.characterId===w.activeCharacterId)?.report?<CareerReport report={w.meta!.careers.find(r=>r.characterId===w.activeCharacterId)!.report!} characterId={w.activeCharacterId}/>:<p>{t(w.life!.ended==='burnout'?'recovery.burnout':'life.confirmEnd')}</p>}<Button onClick={()=>w.dispatch({type:'next-career'})}>{t('life.newCareer')}</Button><details><summary>{t('life.archive')}</summary><MetaMap/></details></section>}
