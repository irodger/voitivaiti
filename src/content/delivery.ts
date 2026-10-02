import {text} from './localization';
const words:Record<string,[string,string]>={
 title:['Посылка приехала','Your parcel is here'],opened:['Новая вещь дома','A new addition to your home'],
 sealed:['Коробка уже у двери. Заказ оплачен — осталось снять упаковку и найти покупке место.','The parcel is at your door. It is already paid for: unwrap it and find it a place.'],
 open:['Открыть коробку','Open the box'],back:['К покупкам','Back to shopping'],home:['Посмотреть в квартире','See it in your apartment'],
 paid:['Уже оплачено · {price} ₽','Already paid · ₽{price}'],placed:['Вещь установлена в квартире','Installed in your apartment'],
 'monitor.result':['Подключаешь второй экран и ставишь рядом с ноутбуком. Теперь не нужно постоянно переключаться между кодом и результатом.','You connect the second screen beside your laptop. No more constantly switching between code and results.'],
 'keyboard.result':['Подключаешь клавиатуру. Первое сообщение набирается дольше обычного — хочется ещё немного послушать клавиши.','You connect the keyboard. Your first message takes longer than usual: you want to listen to the keys a little more.'],
 'headphones.result':['Надеваем наушники — и звуки соседской дрели становятся далёкими. Можно наконец остаться наедине со своей музыкой.','You put on the headphones and the neighbor’s drill fades away. Finally, some time with just your music.'],
 'router.result':['Роутер занял место на столе. Индикаторы горят, связь появилась — больше не придётся искать интернет у окна.','The router finds a place on your desk. Lights on, connection ready: no more hunting for a signal by the window.'],
 'focus.sealed':['Дома · ждёт распаковка покупки','At home · a purchase awaits unboxing'],
 'focus.opened':['Покупка распакована · можно посмотреть дома','Purchase unboxed · see it at home'],
};
Object.entries(words).forEach(([id,[ru,en]])=>text('delivery.'+id,ru,en));
