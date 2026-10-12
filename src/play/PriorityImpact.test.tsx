import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async original=>{const actual=await original<typeof import('../world/store')>();return {...actual,useWorld:Object.assign(()=>actual.useWorld.getState(),actual.useWorld)};});
import {useWorld} from '../world/store';
import {beginPlaytest} from '../world/playtestHelpers';
import {activeCharacter} from '../world/simulation';
import {PriorityImpact} from './PriorityImpact';
it('explains real remaining obligations without inventing risks or changing deadlines',()=>{
 const c=beginPlaytest('frontend');activeCharacter(c).completedWork=['one','two','three'];
 c.life!.queue.forEach(q=>q.status='done');const bug=c.life!.queue.find(q=>q.id==='bug')!;bug.status='waiting';bug.expectation={state:'waiting',dueDay:c.life!.calendarDay};
 useWorld.setState(c);const before=JSON.stringify(c),html=renderToStaticMarkup(<PriorityImpact chosen="feature"/>);
 expect(html).toContain('Срок сегодня');expect(html).toContain('Выбор не переносит');expect(html).not.toContain('Старый проблемный модуль');expect(JSON.stringify(c)).toBe(before);
 bug.delegatedTo='colleague';useWorld.setState(c);expect(renderToStaticMarkup(<PriorityImpact chosen="feature"/>)).toBe('');
});
