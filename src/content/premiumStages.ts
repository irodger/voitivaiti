import {text} from './localization';
[
['path','Путь задачи','Task journey'],['progress','Завершено {done} из {total}','{done} of {total} complete'],['current','Сейчас','Now'],['next','Впереди','Up next'],['complete','Готово','Done'],['locked','После предыдущего этапа','After the previous stage'],['delivered','Результат передан','Result delivered'],['system','Рабочая система изменена','Production changed'],['evidence','Знание и результат проверки','Evidence and verification'],['temporary','Временный результат · ограничения сохранены','Temporary result · limitations retained']
].forEach(([id,ru,en])=>text('premiumStage.'+id,ru,en));
