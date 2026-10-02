import { text } from './localization';
export const marketItems=[
{id:'monitor',price:22000,ru:'Второй монитор',en:'Second monitor',desc:'Код и результат рядом. При переработке: стресс −2.',eng:'Code and results side by side. Overtime: 2 less stress.'},
{id:'keyboard',price:6500,ru:'Механическая клавиатура',en:'Mechanical keyboard',desc:'Приятно даже набрать пароль. Сон: ещё −2 стресса, до −12 за ночь.',eng:'Even passwords feel nice. Sleep removes 2 extra stress, up to 12 per night.'},
{id:'headphones',price:11000,ru:'Наушники с шумоподавлением',en:'Noise-cancelling headphones',desc:'Сосед сверлит, а ты отдыхаешь. Сон: ещё −1 стресса, до −12 за ночь.',eng:'Your neighbour drills, you relax. Sleep removes 1 extra stress, up to 12 per night.'},
{id:'router',price:5500,ru:'Новый Wi-Fi роутер',en:'New Wi-Fi router',desc:'Связь без танцев у окна. Сон: энергия +5 дополнительно.',eng:'No more connection rituals. Sleep restores 5 extra energy.'}
].map(i=>({...i,titleKey:text('market.'+i.id,i.ru,i.en),descriptionKey:text('market.'+i.id+'.desc',i.desc,i.eng)}));
const words:Record<string,[string,string]>={title:['До двери','To your door'],tagline:['Техника для жизни после работы','Tech for life after work'],tab:['Маркетплейс','Marketplace'],order:['Заказать · {price} ₽','Order · ₽{price}'],transit:['В пути · день {day}','In transit · day {day}'],unpack:['Распаковать','Unpack'],ready:['Посылка у двери','Your parcel has arrived'],delivery:['Доставка бесплатно, на следующий игровой день. Распаковать можно дома.','Free delivery on the next game day. Unpack at home.'],orders:['Мои заказы','My orders'],empty:['Здесь появятся твои посылки.','Your parcels will appear here.'],ordered:['Заказ оформлен','Order placed'],received:['Посылка распакована','Parcel unpacked']};Object.entries(words).forEach(([id,[ru,en]])=>text('market.'+id,ru,en));

const shipping:Record<string,[string,string]>={paid:['Оплачен','Paid'],sent:['В пути','On the way'],atDoor:['У двери','At your door'],tomorrow:['Доставка: осталось {days} дн.','Delivery in {days} game days'],receiveHome:['Посылка приехала. Распакуешь, когда вернёшься домой.','Your parcel is here. Unpack it when you return home.'],free:['Доставка бесплатно','Free delivery'],inRoom:['Уже в квартире','In your apartment']};
Object.entries(shipping).forEach(([id,[ru,en]])=>text('market.'+id,ru,en));

text('market.nextDay','Приедет завтра','Arrives tomorrow');
