import {text} from './localization';
const entries:Record<string,[string,string]>={
 title:['Жизнь вне работы','Life outside work'],
 day:['Календарный день {day}','Calendar day {day}'],
 phone:['Разбился экран телефона. Счёт за замену.','A cracked phone screen. Replacement bill.'],
 note:['Ежедневные расходы — {daily} ₽. Аренда 15 000 ₽ и проездной 3 000 ₽ — раз в 30 календарных дней. Следующий платёж: день {day}.','Daily living costs: ₽{daily}. Rent ₽15,000 and transit ₽3,000 every 30 calendar days. Next payment: day {day}.'],
 owed:['Осталось оплатить: {amount} ₽. Сумма будет погашаться из следующих поступлений.','Outstanding bills: ₽{amount}. Future income will cover the balance.'],
 bill:['Счёт: {amount} ₽','Bill: ₽{amount}'],
 rent:['Аренда квартиры','Apartment rent'],transit:['Проездной на месяц','Monthly transit pass'],repayment:['Погашена часть бытовых счетов','Household bills paid'],
 flood:['Протечка затопила соседей. Счёт за ремонт.','A leak flooded the neighbours. Repair bill.'],
 lottery:['Выигрыш в розыгрыше на работе','Workplace raffle win'],
 refund:['Вернули деньги за старый заказ','Refund for an old order'],
 inheritance:['Пришёл небольшой перевод по бабушкиному наследству','A small payment from your grandmother’s estate'],
 monitor:['Монитор перестал включаться. Ремонт выполнен, выставлен счёт.','The monitor stopped working. Repaired; a bill was issued.'],
 bed:['Сломалось основание кровати. Мастер заменил крепления.','The bed frame broke. A repairer replaced the fittings.'],
 injury:['Неудачное падение: обследование и фиксация руки в частной клинике.','A bad fall: examination and a wrist brace at a private clinic.'],
};
Object.entries(entries).forEach(([id,[ru,en]])=>text('finance.'+id,ru,en));
