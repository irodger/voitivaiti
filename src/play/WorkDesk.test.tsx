import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async importOriginal=>{const actual=await importOriginal<typeof import('../world/store')>();return {...actual,useWorld:Object.assign(()=>actual.useWorld.getState(),actual.useWorld)};});
import {useWorld} from '../world/store';
import {transition} from '../world/engine';
import {emptyCampaign,activeCharacter,activeTask} from '../world/simulation';
import {WorkDesk} from './WorkDesk';
import {Work} from './Work';
import {translate} from '../content/localization';
function morning(){let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'frontend',seed:1427}).campaign;delete activeCharacter(c).firstDay;return transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;}
it('task acquisition lives in the laptop desk, not in the office panel',()=>{const c=morning();useWorld.setState(c);const desk=renderToStaticMarkup(<WorkDesk onResume={()=>{}}/>);expect(desk).toContain(translate('queue.start'));const office=renderToStaticMarkup(<Work openLaptop={()=>{}} openCompany={()=>{}} laptopOpen={false}/>);expect(office).not.toContain(translate('queue.start'));expect(office).toContain(translate('desk.open'));});
it('desk exposes continuation without creating or replacing an unfinished task',()=>{const c=transition(morning(),{type:'take-task'}).campaign;useWorld.setState(c);const before=JSON.stringify(activeTask(c));const html=renderToStaticMarkup(<WorkDesk onResume={()=>{}}/>);expect(html).toContain(translate('desk.resume'));expect(html).not.toContain(translate('queue.start'));expect(JSON.stringify(activeTask(useWorld.getState()))).toBe(before);});
