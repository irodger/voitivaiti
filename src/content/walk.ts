import {text} from './localization';
const words:Record<string,[string,string]>={
 morning:['Утро','Morning'],day:['День','Daytime'],evening:['Вечер','Evening'],night:['Ночь','Night'],
 title:['Вечер без рабочих чатов','An evening away from work chats'],
 intro:['Дверь подъезда закрылась. Здесь никто не спрашивает, когда будет готова задача. Куда пойдём?','The building door closes behind you. Nobody here is asking when the task will be done. Where shall we go?'],
 tired:['Рабочий день всё ещё крутится в голове. Можно пройтись недалеко от дома или дать себе больше времени.','The workday is still going round in your head. Stay close to home or give yourself more time.'],
 neighborhood:['Твой квартал','Your neighborhood'],
 alt:['Тихий двор, парк и набережная в вечернем свете','A quiet courtyard, park and riverside in the evening light'],
 choose:['Выбери маршрут на картинке или в списке','Pick a route in the scene or the list'],
 budget:['До полуночи: {minutes} мин. Сон — в любой момент после возвращения.','{minutes} min until midnight. Sleep whenever you like after returning.'],
 short:['Длинные маршруты оставим на другой вечер. Показаны только те, на которые хватает времени.','Save longer routes for another evening. Only routes that fit tonight are shown.'],
 back:['Вернуться домой','Go back home'],
 result:['Прогулка закончилась','Walk finished'],
 actual:['Стресс: {before} → {after}','Stress: {before} → {after}'],
 minutes:['Прошло {minutes} мин','{minutes} min passed'],
 done:['Можно возвращаться домой. Остаток вечера — твой: ужин, книга, игры или сон.','Time to head home. The rest of the evening is yours: dinner, a book, games or sleep.'],
 range:['Прогуляться · выбрать маршрут','Take a walk · choose a route'],
 courtyard:['Круг у дома','Around the block'],
 'courtyard.brief':['Знакомая дорожка у дома. Немного свежего воздуха.','A familiar path close to home. A little fresh air.'],
 'courtyard.result':['Сосед придержал дверь, во дворе шуршат листья. Небольшая прогулка — а мысли уже не так цепляются за работу.','A neighbor holds the door; leaves rustle in the courtyard. A short walk, and work no longer occupies every thought.'],
 'courtyard.tired':['Первый круг ты мысленно дописываешь рабочее сообщение. На втором замечаешь свет в окнах. Работа подождёт до утра.','On the first lap you mentally finish a work message. On the second you notice the warm windows. Work can wait until morning.'],
 park:['Через парк','Through the park'],
 'park.brief':['Деревья, тихая скамейка и прогулка без спешки.','Trees, a quiet bench and an unhurried walk.'],
 'park.result':['Телефон остался в кармане. Ты посидел на скамейке и послушал деревья — впервые за день без желания что-нибудь исправить.','Your phone stays in your pocket. You sit on a bench and listen to the trees, with no urge to fix anything for once.'],
 'park.tired':['Ты ловишь себя на том, что снова прокручиваешь разговор с командой. Потом просто считаешь шаги. На скамейке под деревьями становится чуть спокойнее.','You catch yourself replaying a conversation with the team. Then you just count your steps. You feel a little calmer on a bench under the trees.'],
 river:['До набережной','To the riverside'],
 'river.brief':['Длинный маршрут вдоль воды. Больше времени вне четырёх стен.','A longer route along the water. More time outdoors.'],
 'river.result':['На воде дрожат отражения фонарей. Город живёт дальше без твоих уведомлений. У моста задерживаешься дольше, чем собирался.','Streetlights reflect on the water. The city goes on without your notifications. You stay by the bridge longer than you meant to.'],
 'river.tired':['Поначалу в голове только сроки. У моста останавливаешься и долго смотришь на воду. Проблемы не исчезли, но вечер перестал принадлежать им.','At first your head is full of deadlines. You stop at the bridge and watch the water. The problems remain, but they no longer own the evening.'],
};
Object.entries(words).forEach(([id,[ru,en]])=>text('walk.'+id,ru,en));
text('focus.walk','Вечерняя прогулка · выбираешь маршрут','Evening walk · picking a route');
text('focus.walkDone','Прогулка закончилась · можно домой','Walk finished · ready to go home');
