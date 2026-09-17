import type { GameTask, GameEffect, Choice } from '../types/game';
const e = (stat: GameEffect['stat'], value: number): GameEffect => ({stat,value});
const no = (id:string,label:string,response:string):Choice=>({id,label,response,correct:false});
export const tasks:GameTask[]=[{
 id:'FE-1427',title:'Поднять заголовок на 10 px',description:'На главной странице заголовок расположен слишком близко к следующему блоку. Нужно немного поднять его.',profession:'frontend',difficulty:1,author:'anya',estimate:15,
 groups:['Найти компонент','Загуглить решение','Поправить CSS','Запустить тесты','Пройти ревью','Исправить ревью','Пройти QA'],
 rewards:[e('money',1200),e('xp',50),e('reputation',5),e('htmlCss',1)],
 steps:[
 {id:'files',group:0,type:'file-picker',title:'Где живёт заголовок?',text:'Заголовок находится в Hero — первом большом блоке страницы. Файлы .tsx описывают компоненты, а .css — их внешний вид.',timeCostMinutes:18,wrongAttemptTimeCostMinutes:5,wrongEffects:[e('stress',1)],effects:[e('xp',5),e('energy',-2)],choices:[
 no('home','Home.tsx','Похоже на страницу целиком. Сам заголовок вынесен куда-то ещё.'),
 {id:'hero',label:'Hero.tsx',correct:true,response:'Компонент найден. Вот он, наш заголовок.'},
 no('css','hero.module.css','Стили нашлись, но сначала неплохо бы понять, к какому компоненту они относятся.'),
 no('app','App.tsx','Слишком высоко. Здесь собирается всё приложение.'),
 no('package','package.json','Заголовок здесь точно не живёт. Зато теперь ты знаешь версию React.') ]},
 {id:'search',group:1,type:'search',title:'Гуглить — часть работы',text:'css как поднять элемент выше',timeCostMinutes:24,wrongAttemptTimeCostMinutes:8,wrongEffects:[e('stress',1)],effects:[e('htmlCss',1),e('xp',5),e('energy',-1)],choices:[
 {id:'margin',label:'CSS margin-top',description:'Внешний отступ сверху. Отрицательное значение поднимает элемент.',correct:true,response:'Нам подходит отрицательный margin-top. Например, −10 px.'},
 {id:'stack',label:'Stack Overflow про отрицательный margin',description:'Можно использовать отрицательный margin, если понимаешь, зачем он нужен.',correct:true,response:'Чтобы поднять заголовок на 10 px, уменьшаем верхний отступ на 10 px.'},
 {...no('forum','Форум: поставь position: absolute','Звучит уверенно. Подозрительно уверенно.\n17 ответов: НЕ ДЕЛАЙ ТАК'),description:'Очень уверенный человек в интернете. Что может пойти не так?'}]},
 {id:'css',group:2,type:'code-choice',title:'Десять пикселей вверх',text:'Меняем только верхний отступ. Отрицательное значение поднимает элемент.',code:'.heroTitle {\n  font-size: 32px;\n  margin-top: 0;\n  font-weight: 700;\n}',resultCode:'.heroTitle {\n  font-size: 32px;\n  margin-top: -10px;\n  font-weight: 700;\n}',timeCostMinutes:17,wrongAttemptTimeCostMinutes:7,wrongEffects:[e('stress',1)],effects:[e('xp',5),e('energy',-2)],choices:[
 {id:'top',label:'margin-top: -10px',correct:true,response:'Заголовок поднялся ровно на 10 px. Почти готово.'},
 no('bottom','margin-bottom: 10px','Изменился отступ снизу, но заголовок не поднялся.'),
 no('absolute','position: absolute','Заголовок поднялся. И покинул нормальный поток документа.'),
 no('rotate','transform: rotate(180deg)','Заголовок действительно изменился. Требование задачи формально не выполнено.')]},
 {id:'tests',group:3,type:'terminal',title:'Проверим, что ничего не сломалось',text:'Тесты автоматически проверяют знакомые сценарии. Нажми «Запустить тесты» и дождись результата.',code:'✓ Header renders\n✓ Hero renders\n✓ Mobile layout\n\n3 passed',cta:'Запустить тесты',timeCostMinutes:12,effects:[e('energy',-1)]},
 {id:'review',group:4,type:'review',title:'Вторая пара глаз',speaker:'ilya',text:'Всё ок, но давай через CSS variable.',cta:'Отправить в ревью',timeCostMinutes:41,effects:[e('energy',-1)],choices:[
 {id:'ok',label:'Окей, сейчас поправлю',response:'Спасибо! Переменная хранит отступ в одном месте — потом проще менять.',effects:[e('reputation',2)]},
 {id:'why',label:'А зачем?',response:'Потому что дизайнеры уже три раза меняли этот отступ.',effects:[e('debugging',1),e('reputation',1)],timeCostMinutes:3},
 {id:'works',label:'У меня и так работает',response:'Да. А теперь сделай так, чтобы нам потом тоже работалось.',effects:[e('stress',3),e('reputation',-2)]}]},
 {id:'variable',group:5,type:'code-choice',title:'Одна переменная вместо сюрпризов',text:'CSS variable — именованное значение. Меняем его один раз, и отступ обновляется во всех нужных местах.',code:'.heroTitle {\n  margin-top: -10px;\n}',resultCode:'.heroTitle {\n  margin-top: var(--hero-title-offset);\n}',timeCostMinutes:23,wrongAttemptTimeCostMinutes:5,wrongEffects:[e('stress',1)],effects:[e('xp',5),e('energy',-1)],choices:[
 {id:'variable',label:'Использовать CSS variable',correct:true,response:'Review approved ✓\nПередано в QA. Илья одобрил изменения.'},
 no('important','Добавить !important','Замечание никуда не делось. Зато появилось !important.'),
 no('duplicate','Продублировать правило','Теперь одинаковое правило существует в двух местах. Илья это почувствовал на расстоянии.'),
 no('nothing','Ничего не менять','Merge Request всё ещё ждёт изменений.')]},
 {id:'qa',group:6,type:'bug-preview',title:'Тесты прошли. Макс — нет.',speaker:'max',text:'На iPhone SE заголовок уехал.\n«Но тесты же прошли!»\nТесты тоже люди. Иногда ошибаются.',timeCostMinutes:92,wrongAttemptTimeCostMinutes:10,wrongEffects:[e('stress',2)],effects:[e('debugging',1),e('xp',10),e('energy',-4)],resultCode:':root { --hero-title-offset: -10px; }\n\n@media (max-width: 375px) {\n  :root { --hero-title-offset: 0px; }\n}',choices:[
 {id:'offset',label:'Добавить отдельный offset для маленького экрана',description:'На экране до 375 px оставим отступ 0, на большом — −10 px.',correct:true,response:'Макс: «Теперь норм.»'},
 no('hide','Скрыть заголовок','Бага больше нет. Заголовка тоже.'),
 no('small','Уменьшить шрифт в два раза','Аня: «Почему заголовок теперь размером с сноску?»') ]}
 ]
},{
 id:'FE-1451',title:'Кнопка не работает после второго клика',description:'После первого клика всё нормально. После второго ничего не происходит. Пользователь, разумеется, нажал третий раз.',profession:'frontend',difficulty:2,author:'oleg',estimate:30,
 groups:['Воспроизвести баг','Открыть Console','Понять ошибку','Загуглить','Исправить','Проверить исправление','Отправить в ревью'],
 rewards:[e('money',1800),e('xp',80),e('reputation',6),e('javascript',2),e('debugging',1)],
 steps:[
 {id:'reproduce',group:0,type:'reproduce',title:'Нажми. А теперь ещё раз.',text:'Кнопка убирает подсказку. Нажми её два раза, чтобы повторить действия пользователя.',timeCostMinutes:12,effects:[e('debugging',1),e('xp',5),e('energy',-1)]},
 {id:'console',group:1,type:'console',title:'Послушаем приложение',text:'Console — журнал сообщений браузера. Когда что-то ломается, здесь часто остаётся подсказка.',code:"Uncaught TypeError:\nCannot read properties of null (reading 'remove')",cta:'Открыть Console',timeCostMinutes:6},
 {id:'understand',group:2,type:'code-choice',title:'Что исчезло после первого клика?',text:'querySelector ищет элемент. remove удаляет его. Если искать удалённую подсказку снова, получим null — «ничего нет».',code:"const button = document.querySelector('.hintButton');\n\nbutton.addEventListener('click', () => {\n  const hint = document.querySelector('.clickHint');\n  hint.remove();\n});",timeCostMinutes:15,wrongAttemptTimeCostMinutes:4,wrongEffects:[e('stress',1)],effects:[e('debugging',1),e('xp',5)],choices:[
 no('server','Сломался сервер','Посмотри ещё раз на слово null.'),
 {id:'null',label:'При втором клике hint равен null',correct:true,response:'Именно. Первый клик удалил подсказку. Второй пытается удалить то, чего уже нет.'},
 no('css','Проблема в CSS','Посмотри ещё раз на слово null.')]},
 {id:'search',group:3,type:'search',title:'Не ты первый это гуглишь',text:'javascript cannot read properties of null',timeCostMinutes:18,wrongAttemptTimeCostMinutes:12,wrongEffects:[e('stress',1)],effects:[e('javascript',1),e('xp',5),e('energy',-1)],choices:[
 {id:'guard',label:'Проверить, существует ли значение перед вызовом метода',description:'if (hint) выполнит код, только когда элемент найден.',correct:true,response:'Перед вызовом remove проверяем, существует ли подсказка.'},
 no('restart','Перезагрузить компьютер','Компьютер перезагрузился. Баг остался отдохнувшим и полным сил.')]},
 {id:'fix',group:4,type:'code-choice',title:'Не обращаться к пустоте',text:'Если подсказка ещё есть — удаляем. Если уже нет — ничего не делаем. Какой вариант проверяет её существование?',code:'hint.remove();',resultCode:'if (hint) {\n  hint.remove();\n}',timeCostMinutes:22,wrongAttemptTimeCostMinutes:6,wrongEffects:[e('stress',1)],effects:[e('xp',10),e('energy',-2)],choices:[
 {id:'if',label:'if (hint) { hint.remove(); }',correct:true,response:'Теперь remove вызывается только для существующего элемента.'},
 no('reload','window.location.reload();','Страница перезагрузилась. Причина ошибки никуда не делась.'),
 no('try','try { hint.remove(); } catch {}','Ошибка спрятана, но код всё ещё пытается удалить пустоту. Лучше проверить значение.'),
 no('button','button.remove();','Подсказка осталась. А кнопка уволилась.')]},
 {id:'retest',group:5,type:'reproduce',title:'Та же кнопка. Новая попытка.',text:'Проверь исправление двумя кликами. Первый уберёт подсказку, второй спокойно ничего не сделает.',timeCostMinutes:14,effects:[e('energy',-1),e('stress',-2)]},
 {id:'review',group:6,type:'review',title:'Осталось ревью',speaker:'ilya',text:'Да, тут всё просто. Апрув.',cta:'Отправить в ревью',timeCostMinutes:28,effects:[e('energy',-1),e('reputation',2)]},
 ]
}];
