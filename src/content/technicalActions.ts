import {text} from './localization';
import type {ActionFlow,TechnicalAction} from '../world/types';
type Pair=[string,string];
function flow(key:string,initial:string[],rows:{id:string;label:Pair;result:Pair;minutes?:number;next?:string[];completes?:boolean;code?:string}[]):ActionFlow{
 return {initial,actions:rows.map(({label,result,...row}):TechnicalAction=>({...row,minutes:row.minutes??3,labelKey:text(`action.${key}.${row.id}`, ...label),observationKey:text(`observation.${key}.${row.id}`, ...result)}))};
}
export const technicalFlows:Record<string,ActionFlow>={
 'FE-1427.files':flow('heading.files',['home','styles','hero'],[
  {id:'home',label:['Открыть Home.tsx','Open Home.tsx'],result:['Страница собирается из Header, Hero и Footer. Самого заголовка здесь нет; он внутри Hero.','The page assembles Header, Hero and Footer. The heading is inside Hero.'],code:'<Header />\n<Hero />\n<Footer />',next:['hero']},
  {id:'styles',label:['Открыть стили заголовка','Open heading styles'],result:['Нашли .title. Теперь посмотрим, какой компонент использует этот класс.','Found .title. Next, inspect the component using this class.'],code:'.title { margin-top: 0; }',next:['usage']},
  {id:'usage',label:['Найти использование .title','Find uses of .title'],result:['Поиск привёл в Hero.tsx: класс применён к h1.','Search led to Hero.tsx: the class is applied to h1.'],code:'<h1 className={styles.title}>Almost ready</h1>',completes:true},
  {id:'hero',label:['Открыть Hero.tsx','Open Hero.tsx'],result:['Здесь h1 и импорт hero.module.css. Компонент и его стили найдены.','Here are h1 and the hero.module.css import. Component and styles located.'],code:'import styles from "./hero.module.css";\n<h1 className={styles.title}>Almost ready</h1>',completes:true},
 ]),
 'FE-1427.search':flow('heading.search',['docs','inspector'],[
  {id:'docs',label:['Открыть справку по внешним отступам','Read the margin documentation'],result:['В примере отрицательный margin-top поднимает блок. Изменение участвует в обычном расположении элементов.','The example uses a negative margin-top to move the block up within normal layout.'],code:'margin-top: -10px;',next:['example']},
  {id:'inspector',label:['Посмотреть отступы в инспекторе браузера','Inspect spacing in the browser'],result:['У заголовка верхний отступ 0. При −10 px он поднимается на нужное расстояние.','The top margin is 0. Setting it to −10 px moves the heading by the requested distance.'],next:['example']},
  {id:'example',label:['Примерить −10 px в браузере','Try −10 px in the browser'],result:['Предпросмотр: заголовок выше на 10 px, соседний блок остался в потоке. Сохраним это в файле стилей.','Preview: heading moved up 10 px and the neighbouring block remains in flow. Save the change in the stylesheet.'],completes:true},
 ]),
 'FE-1427.css':flow('heading.css',['margin','transform'],[
  {id:'margin',label:['Изменить верхний отступ на −10 px','Set the top margin to −10 px'],result:['Правка внесена в hero.module.css. Проверим расположение блоков.','Updated hero.module.css. Check the layout.'],code:'.title { margin-top: -10px; }',next:['preview']},
  {id:'transform',label:['Попробовать translateY в предпросмотре','Try translateY in the preview'],result:['Заголовок сдвинулся, но его место в потоке не изменилось: зазор до следующего блока вырос. Нужна правка отступа.','The heading moved, but its layout space stayed unchanged, enlarging the gap to the next block. Adjust the margin.'],code:'.title { transform: translateY(-10px); }',next:['margin']},
  {id:'preview',label:['Обновить предпросмотр','Refresh the preview'],result:['Заголовок поднят на 10 px. Блоки не перекрываются. Правка готова к тестам.','Heading moved up 10 px. Blocks do not overlap. Ready for tests.'],completes:true},
 ]),
 'FE-1427.variable':flow('heading.variable',['find','extract'],[
  {id:'find',label:['Найти места, где задан этот отступ','Find where this spacing is defined'],result:['Значение пока одно, но ревьюер просит дать ему имя, чтобы дальнейшие изменения были понятнее.','There is one value today; the reviewer asks for a name to make future changes clearer.'],next:['extract']},
  {id:'extract',label:['Вынести отступ в --hero-offset','Extract spacing to --hero-offset'],result:['Правило теперь использует именованное значение. Проверим, сохранилось ли расположение.','The rule now uses a named value. Check that the layout stayed the same.'],code:':root { --hero-offset: -10px; }\n.title { margin-top: var(--hero-offset); }',next:['check']},
  {id:'check',label:['Сравнить экран до и после замены','Compare the screen before and after'],result:['Расположение не изменилось. Изменение готово к проверке на маленьком экране.','Layout is unchanged. Ready for a small-screen check.'],completes:true},
 ]),
 'FE-1427.qa':flow('heading.qa',['device','report'],[
  {id:'device',label:['Открыть экран шириной 320 px','Open a 320 px screen'],result:['На узком экране заголовок заходит на соседний блок. На широком −10 px выглядит нормально.','On a narrow screen the heading overlaps the next block. At desktop width −10 px looks fine.'],next:['adjust']},
  {id:'report',label:['Посмотреть запись QA','Watch the QA recording'],result:['На записи iPhone SE: проблема появляется только ниже 375 px. Теперь можно повторить её локально.','The iPhone SE recording shows the issue only below 375 px. It can now be reproduced locally.'],next:['device']},
  {id:'adjust',label:['Оставить нулевой отступ ниже 375 px','Use zero offset below 375 px'],result:['Добавлено правило для маленького экрана. Нужно проверить оба размера.','Added a small-screen rule. Check both sizes.'],code:'@media (max-width: 374px) {\n  .title { margin-top: 0; }\n}',next:['verify']},
  {id:'verify',label:['Проверить 320 px и desktop','Check 320 px and desktop'],result:['На 320 px заголовок не перекрывает блок. На desktop сдвиг −10 px сохранился. QA подтвердил оба случая.','At 320 px the heading does not overlap. Desktop keeps the −10 px offset. QA confirmed both cases.'],completes:true},
 ]),
 'FE-1451.understand':flow('hint.understand',['trace','log','ask'],[
  {id:'trace',label:['Проследить удаление подсказки','Trace the hint removal'],result:['Первый клик находит .hint и удаляет её. Второй поиск уже возвращает null.','The first click finds .hint and removes it. The second lookup returns null.'],code:'// first click: <p class="hint">…</p>\n// second click: null',next:['inspect']},
  {id:'log',label:['Вывести hint перед каждым удалением','Log hint before each removal'],result:['Console: сначала элемент, затем null. Исключение возникает именно при втором вызове remove.','Console shows an element, then null. The exception happens on the second remove call.'],code:'HTMLElement\nnull\nTypeError: Cannot read properties of null (reading \'remove\')',next:['inspect']},
  {id:'ask',label:['Попросить коллегу посмотреть два клика','Ask a colleague to watch both clicks'],result:['Коллега: «После первого клика элемента уже нет. Посмотри значение перед вторым remove».','Colleague: “After the first click the element is gone. Inspect the value before the second remove.”'],next:['log']},
  {id:'inspect',label:['Открыть строку с hint.remove()','Open the hint.remove() line'],result:['Вызов не проверяет результат поиска. Теперь ищем способ безопасно обработать отсутствие элемента.','The call does not check the lookup result. Next, find how to handle a missing element safely.'],code:'const hint = document.querySelector(".hint");\nhint.remove();',completes:true},
 ]),
 'FE-1451.search':flow('hint.search',['docs','restart'],[
  {id:'docs',label:['Открыть справку по querySelector и null','Read about querySelector and null'],result:['querySelector возвращает null, если элемента нет. Можно проверить значение до вызова или использовать ?. — вызов только для существующего элемента.','querySelector returns null when nothing matches. Check the value or use ?. to call only when the element exists.'],next:['example']},
  {id:'restart',label:['Перезапустить окружение и повторить два клика','Restart the environment and repeat both clicks'],result:['Компьютер перезагрузился. Второй клик снова падает: Cannot read properties of null (reading \'remove\'). Потрачено 12 минут. Перезапуск не меняет обработчик.','The computer restarted. The second click still fails: Cannot read properties of null (reading \'remove\'). Twelve minutes spent. Restarting does not change the handler.'],minutes:12,next:['trace','ask','docs']},
  {id:'trace',label:['Посмотреть, когда hint становится null','Inspect when hint becomes null'],result:['Сразу после удаления .hint больше не находится. Ошибка связана с состоянием страницы, а не компьютера.','Immediately after removal .hint no longer matches. The failure depends on page state, not the computer.'],code:'first click → element removed\nsecond click → hint === null',next:['docs','ask']},
  {id:'ask',label:['Показать коллеге ошибку и обработчик','Show a colleague the error and handler'],result:['Коллега: «Проверь результат поиска перед remove. Справка покажет два способа».','Colleague: “Check the lookup result before remove. The documentation shows two approaches.”'],next:['docs']},
  {id:'example',label:['Проверить пример на отсутствующем элементе','Try the example with a missing element'],result:['При null вызов пропускается без ошибки. Можно перенести этот подход в обработчик.','With null the call is skipped without an error. Apply the approach to the handler.'],code:'if (hint) { hint.remove(); }\n// or: hint?.remove();',completes:true},
 ]),
 'FE-1451.fix':flow('hint.fix',['guard','optional','inspect'],[
  {id:'inspect',label:['Посмотреть весь обработчик перед правкой','Read the whole handler before editing'],result:['Других действий в обработчике нет. Кнопка должна оставаться доступной; отсутствие подсказки допустимо.','The handler does nothing else. The button must stay usable; a missing hint is valid.'],code:'button.onclick = () => {\n  const hint = document.querySelector(".hint");\n  hint.remove();\n};',next:['guard','optional']},
  {id:'guard',label:['Добавить проверку перед remove','Add a guard before remove'],result:['Обработчик изменён: при null удаление пропускается. Осталось повторить два клика в Browser.','Handler updated: removal is skipped for null. Repeat both clicks in Browser.'],code:'const hint = document.querySelector(".hint");\nif (hint) { hint.remove(); }',completes:true},
  {id:'optional',label:['Использовать безопасный вызов ?.remove()','Use the safe ?.remove() call'],result:['Обработчик изменён: ?. не вызывает remove при null. Осталось проверить поведение двумя кликами.','Handler updated: ?. skips remove for null. Verify the behaviour with two clicks.'],code:'const hint = document.querySelector(".hint");\nhint?.remove();',completes:true},
 ]),
};
text('action.observed','Наблюдения','Observations');
text('action.next','Следующее действие','Next action');
text('action.minutes','{minutes} мин','{minutes} min');

for(const value of Object.values(technicalFlows))value.actions.push({id:'resume',labelKey:text('action.resume','Продолжить исследование','Resume investigation'),observationKey:text('observation.resume','В сохранении осталась незаконченная попытка. Проверим текущее состояние и продолжим работу.','The save contains an unfinished attempt. Inspect the current state and continue.'),minutes:0,next:value.initial});
export const technicalBriefs:Record<string,Pair>={
 'FE-1451.understand':['Ошибка возникает на втором клике. Проследи, что меняется после первого.','The second click fails. Trace what changes after the first.'],
 'FE-1451.fix':['Измени обработчик так, чтобы отсутствие подсказки было допустимым состоянием.','Update the handler so a missing hint is a valid state.'],
 'FE-1427.qa':['QA прислал запись с маленького экрана. Воспроизведи ситуацию и проверь изменение на двух размерах.','QA sent a small-screen recording. Reproduce it and check your change at both sizes.']
};
