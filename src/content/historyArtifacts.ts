import {text} from './localization';
import type {Problem,WorkArtifact} from '../world/types';
const key=(id:string,ru:string,en:string)=>text('evidence.'+id,ru,en);
key('history','Материалы прошлой работы','Previous work materials');
key('result','Что передали в прошлый раз','Previously delivered result');
key('limitation','Что осталось за границами','What remained outside scope');
key('observations','Наблюдение из прошлой проверки','Observation from the previous check');
key('new','Что изменилось сейчас','What changed this time');
key('prompt','Сверь прошлый результат с новым условием. Дополнительные записи можно открыть для контекста.','Compare the previous result with the new condition. Open additional records for context if useful.');
key('qa','Окружение из обращения QA','Environment from the QA report');
key('control','Соседнее окружение','Neighboring environment');
key('qa.data','Повторное действие: сбой воспроизводится. Версия та же, что в обращении QA.','Repeated interaction: failure reproduced. Same version as the QA report.');
key('control.data','Повторное действие: сбоя нет. Изменено только окружение; общий график ещё не объясняет различие.','Repeated interaction: no failure. Only the environment changed; the overall chart does not yet explain the difference.');
key('environments','Два окружения · одна проверка','Two environments · one check');
key('review','Материалы проверки коллеги','Colleague verification materials');
key('original','Исходный случай','Original case');
key('neighbor','Соседний случай','Neighboring case');
key('original.data','В отчёте есть условия и успешный результат исходного случая.','The report includes conditions and a passing result for the original case.');
key('neighbor.data','В отчёте нет результата соседнего случая. Это ограничение проверки, а не доказанный сбой.','The report has no result for the neighboring case. This is a verification limit, not a proven failure.');
export function historyArtifact(problem:Problem):WorkArtifact|undefined{
 const previous=problem.story?.encounters.at(-1);if(!previous)return undefined;
 return {kind:'task',titleKey:'evidence.history',promptKey:'evidence.prompt',rows:[
  {id:'previous-result',labelKey:'evidence.result',detailKey:problem.history.find(event=>event.id===previous.taskId+':encounter')?.key??previous.observations.at(-1)??'story.past'},
  {id:'new-condition',labelKey:'evidence.new',detailKey:problem.story?.change?'story.'+problem.story.change:problem.workaround?'story.environment':'story.stable'},
  ...(problem.story?.limitations??[]).map((detailKey,i)=>({id:'limitation-'+i,optional:true,labelKey:'evidence.limitation',detailKey})),
  ...previous.observations.slice(-2).map((detailKey,i)=>({id:'observation-'+i,optional:true,labelKey:'evidence.observations',detailKey}))
 ]};
}
export const environmentArtifact:WorkArtifact={experiment:true,kind:'environment',titleKey:'evidence.environments',promptKey:'artifact.experiment.prompt',rows:[{id:'qa',labelKey:'evidence.qa',detailKey:'evidence.qa.data'},{id:'control',labelKey:'evidence.control',detailKey:'evidence.control.data'}]};
export const reviewArtifact:WorkArtifact={kind:'task',titleKey:'evidence.review',promptKey:'artifact.hint',rows:[{id:'original',labelKey:'evidence.original',detailKey:'evidence.original.data'},{id:'neighbor',labelKey:'evidence.neighbor',detailKey:'evidence.neighbor.data'}]};
