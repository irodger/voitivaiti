import type {Campaign,Character} from '../world/types';
import type {Topic} from './contextDialogue';
import {paymentLabel as label,causalKey} from './paymentCausalCopy';
export function paymentConversationTopics(c:Campaign,npc:Character):Topic[]{
 if(c.phase!=='office'||!['backend','qa','product'].includes(npc.profession))return [];
 return (c.company?.projects.flatMap(p=>p.problems)??[]).filter(p=>p.paymentCausal&&p.paymentCausal.phase!=='stable').map(p=>({
  id:`payment-causal:${p.id}:${p.paymentCausal!.revision}:${p.paymentCausal!.lastTaskId??'initial'}:${p.paymentCausal!.cause}`,paymentProblemId:p.id,
  titleKey:label('conversation','Что принимаем по этой оплате?','What are we accepting for this payment?'),bodyKey:p.latestOutcomeKey??causalKey('qaEvidence'),kind:'contextual',priority:140,
  choices:[
   {id:'evidence',labelKey:label('ask-evidence','Не принимать гипотезу без данных: запросить проверку','Request evidence before accepting the hypothesis'),responseKey:label('ask-evidence-reply','Я принесу проверяемые данные. Следующая встреча будет о них, а не о предположении.','I will bring checkable evidence. The next encounter will concern it, not an assumption.')},
   ...(npc.profession==='product'?[{id:'scope',labelKey:label('smaller-scope','Предложить меньший объём выпуска','Propose a smaller release scope'),responseKey:label('scope-promised','Я подготовлю меньший объём выпуска и вернусь с договорённостью на следующий рабочий день.','I will prepare a smaller release scope and return with the agreement next workday.')}]:[]),
   {id:'risk',labelKey:label('accept-risk','Принять ограничение и продолжить выпуск','Accept the limitation and continue release'),responseKey:causalKey('risk')}
  ]
 }));
}
