import '../content/responsibility';
import {useWorld} from '../world/store';
import {useI18n} from '../content/localization';
import {Button,characterName} from './shared';
export function DelegationResults(){
 const w=useWorld(),{t}=useI18n();
 const results=w.company?.delegations?.filter(d=>d.actorId===w.activeCharacterId&&d.status==='returned')??[];
 if(!results.length)return null;
 return <div className="remainder-queue">{results.map(d=>{
  const npc=w.characters.find(n=>n.id===d.npcId);
  return <article className="remainder-card" key={d.id}><h3>{t('responsibility.title')}</h3><p>{npc&&characterName(npc,t)} · {t('life.work.'+d.work)}</p><p>{t('responsibility.result.'+d.result)}</p><Button secondary onClick={()=>w.dispatch({type:'delegation-result',id:d.id,response:'accept'})}>{t('responsibility.accept')}</Button><Button secondary onClick={()=>w.dispatch({type:'delegation-result',id:d.id,response:'clarify'})}>{t('responsibility.clarify')}</Button></article>;
 })}</div>;
}
