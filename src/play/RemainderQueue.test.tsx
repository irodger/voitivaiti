import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async importOriginal=>{const actual=await importOriginal<typeof import('../world/store')>();return {...actual,useWorld:Object.assign((selector?: (s:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld)};});
import {useWorld} from '../world/store';
import {beginPlaytest} from '../world/playtestHelpers';
import {activeCharacter} from '../world/simulation';
import {transition} from '../world/engine';
import {RemainderQueue} from './RemainderQueue';
import '../content/corrections';
it('a Junior with two completed tasks can choose and start the next feature after closing the bug',()=>{
 const c=beginPlaytest('frontend');const ch=activeCharacter(c);ch.completedWork=['FE-1427','FE-1451'];c.activeTaskId=null;c.phase='office';c.time=669;c.schedule.forEach(e=>e.status='completed');c.life!.queue.forEach(q=>q.status=q.id==='bug'?'done':'waiting');useWorld.setState(c);
 const html=renderToStaticMarkup(<RemainderQueue/>);expect(html).toContain('Обещанная функция');expect(html).toContain('<button');expect(html).not.toContain('Старый проблемный модуль');
 const chosen=transition(c,{type:'priority',id:'feature',explained:true}).campaign;expect(chosen.life!.queue.find(q=>q.id==='feature')!.status).toBe('selected');const started=transition(chosen,{type:'take-task'}).campaign;expect(started.activeTaskId).not.toBeNull();expect(started.schedule.some(e=>e.type==='task'&&e.status==='pending')).toBe(true);
});
