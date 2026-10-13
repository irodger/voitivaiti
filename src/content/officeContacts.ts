import {text} from './localization';
[
 ['title','Рядом в офисе','Around the office'],['summary','Коллеги: {people} · ждут работу: {waiting}','Colleagues: {people} · waiting for work: {waiting}'],['hint','Рабочие ожидания и обычные разговоры — разные вещи.','Work commitments and casual topics are different things.'],
 ['waiting','Ждёт работу · {count}','Waiting for work · {count}'],['new','Есть новая тема','New topic available'],['talk','Подойти и поговорить','Walk over and talk'],
 ['joke','Коллеги — не справочник с ногами. Но иногда знают, где болит проект.','Colleagues are not walking manuals. But sometimes they know where the project hurts.']
].forEach(([id,ru,en])=>text('officeContacts.'+id,ru,en));
