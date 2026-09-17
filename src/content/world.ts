import { text } from './localization';
export const archetypes=[
 {id:'commerce',name:'ecommerce',ru:'Корзинка',en:'Little Cart',titleRu:'E-commerce',titleEn:'E-commerce',stack:['React','Node.js','PostgreSQL'],debt:35,process:45,security:60,traffic:60},
 {id:'fintech',name:'bank',ru:'Банк 24½',en:'Bank 24½',titleRu:'Банк / fintech',titleEn:'Banking / fintech',stack:['React','Java','Oracle'],debt:72,process:90,security:90,traffic:75},
 {id:'telecom',name:'telecom',ru:'Связь без конца',en:'Always Connected',titleRu:'Telecom',titleEn:'Telecom',stack:['Java','Kafka','Oracle'],debt:80,process:75,security:80,traffic:95},
 {id:'saas',name:'saas',ru:'Почти готово',en:'Almost Ready',titleRu:'SaaS',titleEn:'SaaS',stack:['React','Node.js','Redis'],debt:30,process:55,security:60,traffic:50},
 {id:'portal',name:'portal',ru:'Внутренний мир',en:'Inner World',titleRu:'Корпоративный портал',titleEn:'Corporate portal',stack:['TypeScript','.NET','SQL Server'],debt:65,process:70,security:75,traffic:25},
 {id:'social',name:'social',ru:'Все свои',en:'Our People',titleRu:'Социальная платформа',titleEn:'Social platform',stack:['React','Go','Cassandra'],debt:45,process:35,security:50,traffic:85},
 {id:'marketplace',name:'market',ru:'Едет к вам',en:'On Its Way',titleRu:'Доставка / marketplace',titleEn:'Delivery / marketplace',stack:['React','Kotlin','PostgreSQL'],debt:50,process:45,security:65,traffic:80},
 {id:'game',name:'game',ru:'Ещё один ход',en:'One More Turn',titleRu:'Игровой сервис',titleEn:'Game service',stack:['TypeScript','C#','Redis'],debt:40,process:40,security:60,traffic:90},
 {id:'enterprise',name:'enterprise',ru:'Большая система',en:'The Big System',titleRu:'Large enterprise',titleEn:'Large enterprise',stack:['Java','SAP','Oracle'],debt:85,process:95,security:85,traffic:65},
 {id:'startup',name:'startup',ru:'Успеем к пятнице',en:'Ship It Friday',titleRu:'Стартап',titleEn:'Startup',stack:['React','Python','PostgreSQL'],debt:60,process:15,security:35,traffic:30},
].map(a=>({...a,nameKey:text(`project.${a.id}.name`,a.ru,a.en),titleKey:text(`project.${a.id}.type`,a.titleRu,a.titleEn)}));
text('company.craft','Бюро «Почти готово»','Almost Ready Studio');text('company.bank','Банк 24½','Bank 24½');text('company.scale','Системы и люди','Systems & People');
text('culture.calm','Спокойная работа','Calm collaboration');text('culture.fast','Быстрее к релизу','Ship it fast');text('culture.careful','Сначала согласуем','Review before shipping');
text('stage.growing','Растущая компания','Growing company');text('stage.established','Зрелая компания','Established company');
export const problemDefinitions=[
 {category:'interface' as const,ru:'Интерфейс ведёт себя по-разному на разных экранах',en:'The interface behaves differently across screens',root:'layout assumptions'},
 {category:'payment' as const,ru:'Повторное действие создаёт неправильный результат',en:'A repeated action produces an incorrect result',root:'missing idempotency'},
 {category:'performance' as const,ru:'После релиза система стала медленнее',en:'The system slowed down after a release',root:'unbounded query'},
 {category:'access' as const,ru:'У сотрудников и сервисов слишком широкие доступы',en:'Employees and services have excessive access',root:'inherited permissions'},
 {category:'delivery' as const,ru:'Релиз заблокирован зависимостями команд',en:'Team dependencies are blocking the release',root:'implicit dependencies'},
].map(p=>({...p,titleKey:text(`problem.${p.category}`,p.ru,p.en)}));
export const npcDefinitions=[
 {id:'sergey',ru:'Сергей',en:'Sergey',avatar:'3',profession:'backend',level:'level-3',line:text('npc.sergey.line','Если задача на пять минут — сначала посмотрим, что скрывается за этими пятью минутами.','If it is a five-minute task, let us check what those five minutes are hiding.')},
 {id:'anya',ru:'Аня',en:'Anya',avatar:'1',profession:'designer',level:'level-2',line:text('npc.anya.line','Можно чуть воздушнее? И нет, просто добавить пустое место — не всегда ответ.','Could it breathe a bit more? And no, extra blank space is not always the answer.')},
 {id:'ilya',ru:'Илья',en:'Ilya',avatar:'0',profession:'frontend',level:'level-1',line:text('npc.ilya.line','Работает — хорошо. Давай ещё подумаем, что будет после следующей правки.','Working is good. Let us also consider what happens after the next change.')},
 {id:'max',ru:'Макс',en:'Max',avatar:'4',profession:'qa',level:'level-2',line:text('npc.max.line','Я ничего не ломал. Я просто нажал кнопку. Два раза.','I did not break anything. I just clicked the button. Twice.',{ru:'Я ничего не ломал. Оно само, блин, после второго клика.',en:'I did not break it. The damn thing broke on the second click.'})},
 {id:'oleg',ru:'Олег',en:'Oleg',avatar:'2',profession:'product',level:'level-2',line:'ui.deadlineReaction'},
].map(n=>({...n,nameKey:text(`npc.${n.id}.name`,n.ru,n.en)}));
export const traitIds=['curious','careful','social','patient'];
[['curious','Любопытный','Curious'],['careful','Внимательный','Careful'],['social','Общительный','Sociable'],['patient','Терпеливый','Patient']].forEach(([id,ru,en])=>text(`trait.${id}`,ru,en));
export const glossary=[
 ['frontend','Frontend','То, что пользователь видит и нажимает: экраны, кнопки и их поведение.','The screens, buttons and behavior a user sees and interacts with.'],
 ['bug','Bug','Программа делает не то, что от неё ожидают. Такую ошибку называют багом.','When software does not behave as expected, we call it a bug.'],
 ['daily','Daily','Короткая встреча команды: что сделали, что планируют и где нужна помощь.','A short team meeting: what happened, what comes next and who needs help.'],
 ['qa','QA','Проверка качества: работает ли продукт в реальных ситуациях, а не только в идеальном сценарии.','Quality assurance checks real situations, not just the happy path.'],
 ['review','Code Review','Коллега проверяет изменения до того, как они попадут пользователям.','A colleague checks changes before they reach users.'],
 ['mr','Merge Request','Запрос добавить твои изменения в общий проект. Здесь коллеги их обсуждают и одобряют.','A request to add your changes to the shared project, where colleagues discuss and approve them.'],
 ['variable','CSS variable','Значение с именем. Меняешь его в одном месте — обновляются все связанные стили.','A named value. Change it once and all styles using it update.'],
 ['null','null','Код ожидал что-то найти, но получил «ничего». Перед обращением к такому значению нужна проверка.','Code expected to find something but found nothing. Check the value before using it.'],
 ['rollback','Rollback','Возврат предыдущей рабочей версии, чтобы остановить проблему.','Restore the previous working version to stop an incident.'],
 ['debt','Технический долг','Временные упрощения, за которые позже придётся заплатить временем и сложностью.','Shortcuts that will cost time and complexity later.'],
 ['api','API','Договор о том, как системы обращаются друг к другу и какие данные передают.','An agreement on how systems communicate and which data they exchange.'],
 ['metric','Метрика','Измеримый показатель, который помогает понять, что происходит с продуктом.','A measurable signal that helps explain what is happening in a product.'],
].map(([id,title,ru,en])=>({id,titleKey:text(`term.${id}.title`,title,id==='debt'?'Technical debt':id==='metric'?'Metric':title),explanationKey:text(`term.${id}.explanation`,ru,en)}));
