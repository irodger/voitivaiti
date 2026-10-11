import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {emptyCampaign,activeCharacter} from '../world/simulation';
import {transition} from '../world/engine';
let campaign=transition(emptyCampaign(),{type:'new',name:'Studio',avatarId:'1',professionId:'frontend',seed:1427}).campaign;
vi.mock('../world/store',()=>({useWorld:()=>campaign}));
vi.mock('../content/localization',async original=>{const actual=await original<typeof import('../content/localization')>();return {...actual,useI18n:()=>({t:(key:string)=>key,locale:'ru'})};});
import {OfficeBrief} from './OfficeBrief';
import {LaptopAppHeader} from './LaptopAppHeader';
import type {Task,Step} from '../world/types';
const steps=[{id:'first',app:'console',titleKey:'first-step'},{id:'second',app:'chat',titleKey:'second-step'}] as Step[];
const task={currentStepId:'first',progress:{first:{status:'active'},second:{status:'locked'}}} as unknown as Task;
it('a reference app points to the real current step without presenting it as active here',()=>{
 const html=renderToStaticMarkup(<LaptopAppHeader app="ide" task={task} steps={steps} view={null} onDesk={()=>{}} onCurrent={()=>{}}/>);
 expect(html).toContain('studio.reference');expect(html).toContain('studio.goCurrent');expect(html).toContain('data-current="false"');expect(html).toContain('studio-app-art');
});
it('read-only history does not offer a misleading current-step shortcut',()=>{
 const html=renderToStaticMarkup(<LaptopAppHeader app="chat" task={task} steps={steps} view={steps[1]} onDesk={()=>{}} onCurrent={()=>{}}/>);
 expect(html).toContain('ui.readOnly');expect(html).not.toContain('studio.goCurrent');
});
it('the office prioritizes a pending morning meeting over available work',()=>{
 const ch=activeCharacter(campaign);ch.firstDay!.onboardingCompleted=true;ch.completedWork=['one','two'];
 campaign.schedule=[{id:'sync',type:'sync',key:'meeting',status:'pending'}];
 const html=renderToStaticMarkup(<OfficeBrief openLaptop={()=>{}} openTeam={()=>{}}/>);
 expect(html).toContain('studio.sync');expect(html).toContain('studio.syncHint');expect(html).toContain('studio.team');expect(html).not.toContain('office-brief-progress');
});
it('an empty reference header leaves its return action to the compact empty state',()=>{
 const html=renderToStaticMarkup(<LaptopAppHeader app="ide" task={task} steps={steps} view={null} emptyReference onDesk={()=>{}} onCurrent={()=>{}}/>);
 expect(html).not.toContain('studio.goCurrent');expect(html).not.toContain('app-work-count');expect(html).toContain('data-empty-reference="true"');
});
