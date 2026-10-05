import {text} from './localization';
const copy:Record<string,[string,string]>={
 title:['Рабочее время','Workday time'],left:['До конца смены: {minutes} мин','Workday remaining: {minutes} min'],over:['После конца смены: {minutes} мин','Past the workday: {minutes} min'],
 note:['Продолжение может привести к переработке и дополнительному стрессу. Незавершённая задача сохранится до следующего рабочего утра.','Continuing may cause overtime and extra stress. Your unfinished task will be kept for the next work morning.'],
 first:['Сначала заверши первый день по подсказкам.','Follow the guidance to complete your first day.'],
 finish:['Сохранить работу и закончить день','Keep work and finish the day'],
 spent:['Время действий по задаче','Time spent on task actions']
};
Object.entries(copy).forEach(([id,[ru,en]])=>text('workClock.'+id,ru,en));
