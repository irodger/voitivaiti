import {measurementArtifact,crossSourceArtifact} from './measurementArtifacts';
import {historyArtifact,environmentArtifact,reviewArtifact} from './historyArtifacts';
import {text} from './localization';
import type {SceneFamily,TaskTemplate,Step,TechnicalAction,Problem} from '../world/types';

const copy=[
 ['past','Это продолжение прежней работы. Сначала сопоставь сохранённый результат с новым обращением.','This continues earlier work. Compare the saved result with the new report first.'],
 ['contract','Смежная команда изменила контракт. Старый результат проверялся на предыдущей версии; новые условия ещё не проверены.','A neighboring team changed the contract. The old result was checked on a previous version; the new conditions are unverified.'],
 ['environment','QA принесла второй случай: в другом окружении прежняя граница проверки не удержалась.','QA brought a second case: the previous test boundary did not hold in another environment.'],
 ['stable','Прежнее исправление сохраняется. Сейчас проверяем совместимость следующей версии, а не объявляем старый баг снова неисправленным.','The previous repair still holds. We are checking the next version’s compatibility, not declaring the old bug unfixed again.'],
 ['artifact.title','Что изменилось в самом артефакте?','What changed in the artifact?'],
 ['dependency.title','Без данных коллеги картина неполная','A colleague holds part of the evidence'],
 ['incident.title','Сначала остановить воздействие','Contain the impact first'],
 ['review.title','Чужой результат, твоя проверка','Their result, your review'],
 ['coordination.title','Разделить объём и договориться о следующем шаге','Split scope and agree the next step'],
 ['recurrence.title','Обход встретил новый случай','The workaround met a new case'],
 ['delegation.title','Работу делает коллега; за границы отвечаешь ты','A colleague does the work; you own its boundaries'],
 ['artifact.open','Открыть сохранённый артефакт и сравнить версии','Open the saved artifact and compare versions'],
 ['artifact.seen','В сохранённой версии исходный случай проходит. В новом обращении изменилось состояние между первым и повторным действием.','The original case passes in the saved version. The new report changes state between the first and repeated action.'],
 ['experiment','Повторить переход состояния на копии','Repeat the state transition on a copy'],
 ['experiment.result','На копии расхождение повторилось только при смене состояния. Рабочая система не менялась; теперь есть воспроизводимые условия.','The copy reproduces the divergence only when state changes. Production is unchanged; you now have reproduction conditions.'],
 ['hypothesis.environment','Сначала проверить окружение из отчёта QA','Check the environment from QA’s report first'],
 ['hypothesis.metrics','Сначала сопоставить время отчёта с метриками','Compare report timing with metrics first'],
 ['hypothesis.environment.result','В окружении QA сбой повторяется. В соседнем — нет. Общий всплеск метрик ещё не объясняет различие.','The QA environment reproduces the failure; a neighboring one does not. The overall metric spike does not yet explain the difference.'],
 ['hypothesis.metrics.result','Всплеск начался раньше обращения QA и затронул соседний поток. Это другой сигнал: один общий график не объясняет конкретный сбой.','The spike preceded QA’s report and affected a neighboring flow. It is a separate signal: one overall graph cannot explain the specific failure.'],
 ['crosscheck','Сопоставить оба источника на одном времени и версии','Cross-check both sources on one timestamp and version'],
 ['crosscheck.result','График показывает соседний поток, а QA проверяет конкретное действие. Время и условия различаются: оба отчёта полезны, но общий всплеск не доказывает причину этого сбоя.','The chart measures a neighboring flow while QA tests a specific interaction. Timing and conditions differ: both reports help, but the overall spike does not prove this failure’s cause.'],
 ['request','Передать коллеге условия и запросить недостающие данные','Send reproduction conditions and request missing data'],
 ['request.result','Запрос ушёл с версией, временем и шагами. Коллега проверяет свою часть; пока можно исследовать локальные данные или заняться другой работой.','The request includes version, time and steps. The colleague is checking their part; investigate local evidence or do other work meanwhile.'],
 ['local','Пока коллега проверяет — собрать локальную последовательность','Collect the local sequence while the colleague checks'],
 ['local.result','Сохранены состояния до и после действия. Это самостоятельное наблюдение, а не ответ за коллегу.','Before and after states are recorded. This is independent evidence, not an answer invented for the colleague.'],
 ['audit','Проверить соседний случай, пока ждём','Check a neighboring case while waiting'],
 ['audit.result','Соседний случай проходит. Граница локального исследования записана; чужие данные ещё нужно сопоставить.','The neighboring case passes. Local investigation boundaries are recorded; the other team’s data still needs comparison.'],
 ['reply','Прочитать ответ и сопоставить его со своей записью','Read the reply and compare it with your record'],
 ['bypass','Продолжить с локальными данными, явно оставив зависимость открытой','Proceed with local evidence, explicitly leaving the dependency open'],
 ['bypass.result','Можно передать локальный результат. Он не подтверждает чужую часть: зависимость и ограничение остаются в истории проблемы.','You can hand over a local result. It does not validate the other team’s part: dependency and limitation remain in problem history.'],
 ['triage','Сопоставить затронутый поток и последний стабильный результат','Compare affected flow and the last stable result'],
 ['triage.result','Воздействие ограничено новым потоком; сохранённый прежний сценарий проходит. Есть возможность ограничить выпуск, не отменяя проверенную работу.','Impact is confined to the new flow; the saved original case passes. The release can be limited without undoing verified work.'],
 ['mitigate','Ограничить новый поток и предупредить поддержку','Limit the new flow and notify support'],
 ['monitor','Повторить затронутый и контрольный случаи после изменения','Repeat affected and control cases after the change'],
 ['inspect-review','Прочитать изменения и условия чужой проверки','Read changes and the colleague’s test conditions'],
 ['inspect-review.result','Исходный случай проверен, соседний пропущен. Это ограничение доказательства, а не автоматически плохая работа.','The original case was tested; the neighboring case was omitted. This limits the evidence; it does not automatically make the work bad.'],
 ['comment','Попросить воспроизводимый соседний случай','Request a reproducible neighboring case'],
 ['approve-bounds','Принять ограниченный результат с явными границами','Accept the bounded result with explicit limitations'],
 ['comment.result','Коллега получил конкретные условия. Теперь проверь продолжение, а не повторяй прежний комментарий.','The colleague received specific conditions. Check the continuation instead of repeating the same comment.'],
 ['negotiate','Уточнить, кому нужен исходный путь, а кому полный объём','Clarify who needs the original path and who needs full scope'],
 ['negotiate.result','Поддержке нужен проверенный исходный путь сейчас; Product согласен отделить соседние сценарии от обещания первого результата.','Support needs the verified original path now; Product agrees to separate neighboring cases from the first-result commitment.'],
 ['split','Передать ограниченный объём и сохранить оставшуюся часть','Hand over bounded scope and preserve remaining work'],
 ['full','Согласовать общий объём и проверить обе стороны','Agree broader scope and check both sides'],
 ['assign','Передать коллеге артефакт, условия и границы проверки','Delegate the artifact, conditions and test boundaries'],
 ['result','Разобрать результат коллеги и оставшийся риск','Review the colleague’s result and remaining risk'],
 ['accept','Принять результат с границами и сообщить следующего владельца','Accept with boundaries and name the next owner'],
 ['revise','Вернуть конкретный случай на уточнение','Return a specific case for clarification'],
 ['review.wait','Пока коллега проверяет — уточнить исходные условия','Clarify original conditions while the colleague checks'],
 ['review.wait.result','Условия исходного случая сохранены. Это полезный контекст, но результата соседней проверки ещё нет.','Original conditions are recorded. This is useful context, but the neighboring test result is still pending.'],
 ['review.boundary','Сверить обещанный объём с соседним случаем','Compare promised scope with the neighboring case'],
 ['review.boundary.result','Соседний случай входит в обещанный объём. До ответа коллеги его нельзя считать проверенным.','The neighboring case belongs to the promised scope. It cannot be called verified before the colleague replies.'],
 ['review.reply','Открыть ответ коллеги и повторить соседний случай','Open the colleague’s reply and repeat the neighboring case'],
 ['review.reply.result','Коллега прислал версию и условия: исходный случай проходит, соседний воспроизводит сбой. Проверка дала конкретное замечание; рабочая система ещё не исправлена.','The colleague supplied version and conditions: the original case passes, the neighboring case reproduces a failure. The review produced a concrete finding; production is still unfixed.'],
 ['review.handoff','Передать воспроизводимое замечание владельцу задачи','Send the reproducible finding to the task owner'],
 ['review.handoff.result','Владелец получил условия сбоя и границу проверки. Следующая работа — исправить соседний случай, затем снова проверить оба пути.','The owner received failure conditions and verification boundaries. The next work is to fix the neighboring case, then retest both paths.'],
 ['review.bounded.result','Принят только исходный проверенный случай. Результата соседней проверки нет; ограничение передано владельцу и осталось в истории.','Only the verified original case was accepted. The neighboring test has no result; the owner received the limitation and it remains in history.'],
 ['review.bounded.followup','Соседний случай по-прежнему требует проверки. Ограниченное принятие не подтвердило его поведение.','The neighboring case still needs verification. Bounded acceptance did not confirm its behavior.'],
 ['review.followup','Замечание сохранено в истории: исправление соседнего случая остаётся отдельной работой.','The finding remains in history: fixing the neighboring case is separate work.'],
 ['review.reply.title','Ответ на замечание ревью','Reply to the review comment'],
 ['review.original','Исходный случай на присланной версии проходит.','The original case passes on the supplied version.'],
 ['review.neighbor','Соседний случай на той же версии воспроизводит сбой. Условия и порядок действий сохранены.','The neighboring case fails on the same version. Conditions and action order are recorded.'],
 ['pause','Пока ждём — заняться другой работой','Do other work while waiting'],
 ['resume','Продолжить эту работу','Resume this work'],
 ['waiting','Коллега ещё проверяет свою часть','The colleague is still checking their part'],
 ['ready','Ответ коллеги готов','The colleague’s reply is ready']
];
copy.forEach(([id,ru,en])=>text('story.'+id,ru,en));

export function storyScene(base:TaskTemplate,family:SceneFamily,grade:number,problem:Problem):TaskTemplate{
 const scene=structuredClone(base),investigate=base.steps[0].actionFlow!,resolve=base.steps[1].actionFlow!;
 const fact=investigate.actions.find(a=>a.id==='trace')!,limited=resolve.actions.find(a=>a.id==='verify-limited')!,shared=resolve.actions.find(a=>a.id==='verify-shared')!;
 const action=(id:string,label:string,observation:string,next?:string[],completes=false):TechnicalAction=>({id,labelKey:'story.'+label,observationKey:'story.'+observation,minutes:10,next,completes});
 const limitedResult={...limited,id:'bounded-result',labelKey:'story.accept',completes:true,next:undefined};
 const applyShared={...resolve.actions.find(a=>a.id==='shared')!,id:'apply-shared',next:['verified-result']};
 const applyLimited={...resolve.actions.find(a=>a.id==='limited')!,id:'apply-limited',next:['bounded-result']};
 const sharedResult={...shared,id:'verified-result',labelKey:'story.monitor',completes:true,next:undefined};
 // A review/plan is evidence and coordination, not a production deployment.
 if(['review','coordination','delegation','dependency'].includes(family))for(const a of [limitedResult,sharedResult]){
  a.effects=[{target:'craft',value:1}];a.outcome={...a.outcome!,systemChanged:false};
 }
 const makeStep=(id:string,title:string,actions:TechnicalAction[],initial:string[],code?:string):Step=>({id,titleKey:'story.'+title,bodyKey:base.descriptionKey,type:'choice',app:id==='discussion'?'chat':base.steps[0].app,actionFlow:{actions,initial},code,minutes:0,wrongMinutes:0,effects:[],wrongEffects:[]});
 const environment=action('environment','hypothesis.environment','hypothesis.environment.result',['crosscheck']);
 environment.artifact=structuredClone(environmentArtifact);
 const metrics=action('metrics','hypothesis.metrics','hypothesis.metrics.result',['crosscheck']);
 metrics.artifact=measurementArtifact();
 const cross=action('crosscheck','crosscheck','crosscheck.result',['apply-shared','apply-limited']);
 cross.artifact=crossSourceArtifact(problem);

 if(family==='artifact'){
  const open=action('open-artifact','artifact.open','artifact.seen',['experiment']);
  open.artifact={kind:'task',titleKey:'story.artifact.title',promptKey:'artifact.hint',rows:[{id:'saved',labelKey:'story.artifact.open',detailKey:'story.artifact.seen'},{id:'report',labelKey:'story.hypothesis.environment',detailKey:'story.environment'}]};
  open.artifact=historyArtifact(problem)??open.artifact;
  const experiment=action('experiment','experiment','experiment.result',grade===0?['apply-shared']:['environment','metrics']);
  scene.steps=[makeStep('artifact','artifact.title',[open,experiment,environment,metrics,cross,applyShared,applyLimited,sharedResult,limitedResult],['open-artifact'],`saved version: ${problem.story?.version??1}\noriginal case: passed\nnew report: state changes between actions`),base.steps[2]];
 }else if(family==='recurrence'){
  const previous=action('previous','artifact.open','environment',grade===0?['environment']:['environment','metrics']);
  previous.artifact=historyArtifact(problem);
  if(grade===0)cross.next=['apply-shared'];
  scene.steps=[makeStep('recurrence','recurrence.title',[previous,environment,metrics,cross,applyShared,applyLimited,sharedResult,limitedResult],['previous']),base.steps[2]];
 }else if(family==='dependency'||family==='delegation'){
  const request=action('request',family==='delegation'?'assign':'request','request.result',['local','bypass','reply']);request.dependency=true;request.delegates=family==='delegation';
  const local=action('local','local','local.result',['audit','reply','bypass']);
  const audit=action('audit','audit','audit.result',['reply','bypass']);audit.minutes=20;
  const reply=action('reply',family==='delegation'?'result':'reply','crosscheck.result',['verified-result','bounded-result']);reply.requiresReply=true;reply.observationKey=fact.observationKey;reply.artifact=structuredClone(fact.artifact);
  const bypass=action('bypass','bypass','bypass.result',['bounded-result']);
  scene.steps=[makeStep('discussion',family+'.title',[request,local,audit,reply,bypass,sharedResult,limitedResult],['request']),base.steps[2]];
 }else if(family==='incident'){
  const triage=action('triage','triage','triage.result',['mitigate','environment']);
  const mitigate=action('mitigate','mitigate','bypass.result',['bounded-result']);
  environment.next=['crosscheck'];cross.next=['apply-shared'];
  scene.steps=[makeStep('triage','incident.title',[triage,mitigate,environment,cross,applyShared,applyLimited,limitedResult,sharedResult],['triage']),base.steps[2]];
 }else if(family==='review'){
  const inspect=action('inspect-review','inspect-review','inspect-review.result',['comment','approve-bounds']);
  inspect.artifact=structuredClone(reviewArtifact);
  const comment=action('comment','comment','comment.result',['review-context','experiment','approve-bounds']);comment.dependency=true;
  const context=action('review-context','review.wait','review.wait.result',['review-boundary','experiment','approve-bounds']);context.minutes=15;
  const boundary=action('review-boundary','review.boundary','review.boundary.result',['experiment','approve-bounds']);boundary.minutes=15;
  const experiment=action('experiment','review.reply','review.reply.result',['verified-result']);experiment.requiresReply=true;experiment.requiresEvidence=true;
  experiment.artifact={kind:'task',titleKey:'story.review.reply.title',promptKey:'artifact.hint',rows:[{id:'original',labelKey:'evidence.original',detailKey:'story.review.original'},{id:'neighbor',labelKey:'evidence.neighbor',detailKey:'story.review.neighbor'}]};
  limitedResult.observationKey='story.review.bounded.result';limitedResult.outcome={...limitedResult.outcome!,summaryKey:'story.review.bounded.result',followupKey:'story.review.bounded.followup',systemChanged:false};
  sharedResult.labelKey='story.review.handoff';sharedResult.observationKey='story.review.handoff.result';
  sharedResult.outcome={...sharedResult.outcome!,summaryKey:'story.review.handoff.result',followupKey:'story.review.followup',systemChanged:false};
  const accept=action('approve-bounds','approve-bounds','bypass.result',['bounded-result']);
  scene.steps=[makeStep('review-evidence','review.title',[inspect,comment,context,boundary,experiment,accept,sharedResult,limitedResult],['inspect-review']),base.steps[2]];
 }else{
  const negotiate=action('negotiate','negotiate','negotiate.result',['split','full']);
  const split=action('split','split','bypass.result',['bounded-result']);
  const full=action('full','full','crosscheck.result',['verified-result']);
  scene.steps=[makeStep('discussion','coordination.title',[negotiate,split,full,limitedResult,sharedResult],['negotiate']),base.steps[2]];
 }
 scene.estimate=scene.steps.reduce((n,s)=>n+(s.actionFlow?s.actionFlow.actions.reduce((n,a)=>n+a.minutes,0)/2:s.minutes),0);
 return scene;
}
