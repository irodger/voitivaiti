import {text} from './localization';
import type {WorkArtifact} from '../world/types';
const key=(id:string,ru:string,en:string)=>text('artifact.'+id,ru,en);
key('open','Открыть данные','Open evidence');
key('read','Посмотреть запись','Inspect entry');
key('continue','Зафиксировать наблюдение','Record observation');
key('hint','Открой обе записи. Здесь нет неверного ответа: сравни условия и результат.','Open both entries. There is no wrong answer: compare conditions and results.');
key('context','Материалы текущей работы','Current work materials');
key('notes','Собранные наблюдения','Collected observations');
key('none','Наблюдения появятся после исследования. Пока можно свериться с описанием задачи.','Observations will appear during investigation. For now, consult the task brief.');
key('scope','Описание задачи','Task brief');
key('contextHint','Это справочные материалы. Продолжить текущий шаг можно в {app}.','These are reference materials. Continue the current step in {app}.');
key('experiment.prompt','Выбери условия и повтори действие. Затем измени одно условие и сравни результаты. Проверка идёт на копии и не меняет рабочую систему.','Choose conditions and repeat the action. Then change one condition and compare results. Testing uses a copy and does not change production.');
key('experiment.run','Повторить действие в этих условиях','Repeat the action under these conditions');
key('experiment.results','Результаты твоих проверок','Your test results');
key('experiment.empty','В этих условиях ещё не проверяли.','These conditions have not been tested yet.');
const row=(id:string,ru:string,en:string,detail:string,eng:string)=>({id,labelKey:key(id+'.label',ru,en),detailKey:key(id+'.data',detail,eng)});
const cases={
 interface:[row('screen.initial','Первое открытие · 1440 px','First open · 1440 px','Окно: 1440 · ширина формы: 720 · кнопка видна','Viewport: 1440 · form width: 720 · button visible'),row('screen.rotate','После поворота · 390 px','After rotation · 390 px','Окно: 390 · ширина формы: 720 · кнопка за краем','Viewport: 390 · form width: 720 · button outside frame')],
 payment:[row('request.first','09:41:02.100 · первый клик','09:41:02.100 · first click','requestId: pay-101 · POST /orders · 201 · order: A71','requestId: pay-101 · POST /orders · 201 · order: A71'),row('request.repeat','09:41:02.180 · повторный клик','09:41:02.180 · repeated click','requestId: pay-102 · POST /orders · 201 · order: A72 · экран ещё показывает ожидание','requestId: pay-102 · POST /orders · 201 · order: A72 · screen still shows waiting')],
 performance:[row('list.small','20 записей · после релиза','20 records · after release','Ответ сети: 80 ms · отрисовка списка: 40 ms','Network response: 80 ms · list rendering: 40 ms'),row('list.large','5000 записей · после релиза','5000 records · after release','Ответ сети: 80 ms · отрисовка списка: 2400 ms','Network response: 80 ms · list rendering: 2400 ms')]
};
const metrics={
 interface:[row('metric.mobile','Мобильные сессии','Mobile sessions','До релиза: 2% отказов · после: 18% · нагрузка прежняя','Before release: 2% failures · after: 18% · same load'),row('metric.old','Предыдущая версия','Previous version','Та же нагрузка · 2% отказов','Same load · 2% failures')],
 payment:[row('metric.orders','Операции после релиза','Operations after release','Посетители: +0% · повторные операции: +16%','Visitors: +0% · repeated operations: +16%'),row('metric.received','Доставка запросов','Request delivery','pay-101 и pay-102 дошли до сервера. Два разных результата.','pay-101 and pay-102 reached the server. Two distinct results.')],
 performance:[row('metric.new','Новая версия · 1000 посетителей','New version · 1000 visitors','Время ответа: 800 → 2400 ms · начало роста совпало с релизом','Response time: 800 → 2400 ms · rise starts with release'),row('metric.previous','Прежняя версия · 1000 посетителей','Previous version · 1000 visitors','Время ответа: 800 ms · после возврата задержка исчезает','Response time: 800 ms · delay disappears after rollback')]
};
export function roleArtifact(role:string,category:keyof typeof cases,observationKey:string):WorkArtifact|undefined{
 if(!['frontend','qa','sre','product','designer'].includes(role))return undefined;
 const kind=role==='sre'?'metrics':role==='product'?'task':role==='designer'?'design':role==='qa'?'environment':category==='payment'?'network':'component';
 const titles:Record<string,[string,string]>={metrics:['Метрики: сравнение версий','Metrics: compare versions'],task:['Обращения и обещания','Reports and commitments'],design:['Ожидание и реальный экран','Expected and actual experience'],environment:['Условия воспроизведения','Reproduction conditions'],network:['Отправленные запросы · Network','Sent requests · Network'],component:['Экран и работа компонента','Screen and component behavior']};
 let rows=role==='sre'?metrics[category]:cases[category];
 if(role==='qa'&&category==='payment')rows=[{...cases.payment[0],labelKey:key('qa.single','Один клик · медленная сеть','Single click · slow network')},{...cases.payment[1],labelKey:key('qa.double','Двойной клик · медленная сеть','Double click · slow network'),detailKey:key('qa.double.data','Два обращения: pay-101 → order A71; pay-102 → order A72. Экран ещё показывает ожидание.','Two requests: pay-101 → order A71; pay-102 → order A72. The screen still shows waiting.')}];
 if(role==='product'||role==='designer')rows=[row(role+'.'+category+'.experience','Наблюдение пользователя','User observation',category==='payment'?'Человек нажал второй раз, потому что не увидел подтверждения.':category==='interface'?'На телефоне человек не нашёл продолжение формы.':'Человек с большим архивом ждёт, маленький список открывается быстро.',category==='payment'?'The person clicked again because no confirmation appeared.':category==='interface'?'On the phone the person could not find how to continue the form.':'A person with a large archive waits; a small list opens quickly.'),{id:'context',labelKey:key('contextRow','Контекст команды','Team context'),detailKey:observationKey}];
 return {experiment:role==='qa',kind,titleKey:key(kind+'.title',...titles[kind]),promptKey:role==='qa'?'artifact.experiment.prompt':'artifact.hint',rows:[...rows,{optional:true,...row('reference.health','Служебная запись · вне сравнения','Service entry · outside comparison','GET /health · 200 · сервер доступен. Эта запись не объясняет сбой действия.','GET /health · 200 · server available. This entry does not explain the interaction failure.')}]};
}

export function codeArtifact(id:string,code:string):WorkArtifact{
 return {kind:'code',titleKey:key(id+'.code.title','Открытый фрагмент · IDE','Open fragment · IDE'),promptKey:key('code.prompt','Открой фрагмент и связь с экраном. Читать весь код не нужно.','Open the fragment and its screen connection. You do not need to read all the code.'),rows:[{id:'source',labelKey:key('code.source','Фрагмент файла','File fragment'),detailKey:key(id+'.source',code,code)},{id:'connection',labelKey:key('code.connection','Как это связано с экраном','How this connects to the screen'),detailKey:key(id+'.connection',id.startsWith('hint')?'querySelector ищет подсказку на экране. remove удаляет найденный элемент; null означает, что элемент не найден.':'Home собирает страницу из частей. Hero содержит заголовок; styles.title связывает его с правилом в файле стилей.',id.startsWith('hint')?'querySelector looks for the on-screen hint. remove deletes the matching element; null means nothing was found.':'Home assembles page parts. Hero contains the heading; styles.title links it to a stylesheet rule.')}]};
}
