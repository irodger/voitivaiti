import {Sunrise,MessageSquare,Clock3} from 'lucide-react';
import {useWorld} from '../world/store';
import {morningBriefing} from '../world/morningBriefing';
import {useI18n} from '../content/localization';
import {formatCalendarDate} from '../utils/format';
import {TermText} from './TermText';
import '../content/morningBriefing';
import './morningBriefing.css';

export function MorningBriefing(){
 const w=useWorld(),{t,locale}=useI18n(),brief=morningBriefing(w);if(!brief)return null;
 return <section className="morning-brief"><header><Sunrise size={22}/><div><h3>{t('morningBrief.title')}</h3><p>{t('morningBrief.from',{date:formatCalendarDate(brief.calendarDay,locale),count:brief.delivered})}</p></div></header>{brief.items.length?<details><summary><MessageSquare size={16}/>{brief.items.length===1?t('morningBrief.'+brief.items[0].kind):t('desk.colleagues')} · {brief.items.length}</summary>{brief.items.map(item=><article key={item.id}><small>{t('morningBrief.'+item.kind)}</small><b>{t(item.titleKey)}</b>{item.factKey&&<p><TermText>{t(item.factKey)}</TermText></p>}</article>)}</details>:<p>{t('morningBrief.none')}</p>}{brief.deadlines.length>0&&<details><summary><Clock3 size={16}/>{t('morningBrief.deadlines')} · {brief.deadlines.length}</summary>{brief.deadlines.map(item=><article key={item.id}><b>{t(item.titleKey)}</b><small>{t('morningBrief.'+(item.overdue?'overdue':'today'))}</small></article>)}</details>}<p>{t('morningBrief.hint')}</p></section>;
}
