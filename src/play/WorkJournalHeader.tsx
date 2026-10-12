import {Coffee,Files,Sunrise,CheckCheck} from 'lucide-react';
import {useI18n} from '../content/localization';
import '../content/workJournal';
import './workJournal.css';

export function WorkJournalHeader({kind,title,counts}:{kind:'day'|'morning'|'memory';title:string;counts:{label:string;value:number}[]}){
 const {t}=useI18n(),Icon=kind==='day'?CheckCheck:kind==='morning'?Sunrise:Files;
 return <header className="work-journal-header" data-kind={kind}><div className="journal-copy"><small><Icon size={14}/>{t('journal.'+kind)}</small><h2>{title}</h2><div className="journal-counts">{counts.map(count=><span key={count.label}><b>{count.value}</b>{t(count.label)}</span>)}</div></div><svg className="journal-desk" viewBox="0 0 150 105" aria-hidden="true"><path className="journal-shadow" d="M10 84 81 104 145 82 74 62Z"/><path className="journal-table" d="M9 74 80 94 143 73 72 53Z"/><path className="journal-monitor" d="m38 16 75 12v43L38 58Z"/><path className="journal-screen" d="m44 24 62 10v29L44 53Z"/><path className="journal-code" d="m51 34 12 2m-12 6 22 4m-22 4 16 3m11-14 19 3m-17 7 15 3"/><path className="journal-monitor" d="m72 63 10 2v12l-10-2zm-10 12 23 4 10-4-24-4Z"/><path className="journal-cup" d="m111 65 14 3v13l-14-3Z"/><path className="journal-steam" d="M119 59c-8-6 7-8 0-15"/><circle className="journal-spark" cx="128" cy="24" r="9"/><path className="journal-check" d="m124 24 3 3 5-6"/></svg><Coffee className="journal-watermark" size={70} aria-hidden="true"/></header>;
}
