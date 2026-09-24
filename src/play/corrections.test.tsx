import {it,expect,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
vi.mock('../world/store',async importOriginal=>{const actual=await importOriginal<typeof import('../world/store')>();return {...actual,useWorld:Object.assign((selector?: (s:ReturnType<typeof actual.useWorld.getState>)=>unknown)=>selector?selector(actual.useWorld.getState()):actual.useWorld.getState(),actual.useWorld)};});
import {StepRenderer} from './Mechanic';
import {transition} from '../world/engine';
import {emptyCampaign,activeCharacter,activeTask} from '../world/simulation';
import {useWorld,migrateLegacy,saveBeforeUpdate} from '../world/store';
import {templateById} from '../content/scenarios';
import {translate} from '../content/localization';
it('review response appears exactly once and only after sending',()=>{
 let c=transition(emptyCampaign(),{type:'new',name:'Test',avatarId:'1',professionId:'designer',seed:1427}).campaign;delete activeCharacter(c).firstDay;
 c=transition(c,{type:'event',id:c.schedule[0].id,choiceId:'plan'}).campaign;c=transition(c,{type:'take-task'}).campaign;
 c=transition(c,{type:'draft',id:'item-0'}).campaign;c=transition(c,{type:'submit'}).campaign;c=transition(c,{type:'advance'}).campaign;c=transition(c,{type:'choose',id:'durable'}).campaign;c=transition(c,{type:'advance'}).campaign;
 const task=activeTask(c)!,step=templateById[task.templateId].steps.find(s=>s.id==='review')!,reply=translate(step.bodyKey);
 const html=()=>{useWorld.setState(c);return renderToStaticMarkup(<StepRenderer step={step}/>);};expect(html()).not.toContain(reply);
 c=transition(c,{type:'run'}).campaign;expect(html()).not.toContain(reply);c=migrateLegacy(JSON.parse(JSON.stringify(c)));c=transition(c,{type:'finish-run',taskId:task.id,stepId:step.id}).campaign;expect(html().split(reply)).toHaveLength(2);
 const writes=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(k:string)=>writes.get(k)??null,setItem:(k:string,v:string)=>writes.set(k,v)});expect(saveBeforeUpdate()).toBe(true);const restored=migrateLegacy(JSON.parse(writes.get('voiti-vaiti-campaign')!).state);expect(restored.tasks).toEqual(c.tasks);expect(restored.activeTaskId).toBe(c.activeTaskId);
});

it('remainder has one heading and no duplicate queue introduction',async()=>{
 const {WorkRemainder}=await import('./WorkLoop');const {LifeStatus}=await import('./LifePanels');
 const c=useWorld.getState();activeCharacter(c).careerNodeId='level-1';activeCharacter(c).firstDay!.onboardingCompleted=true;c.schedule.forEach(e=>e.status='completed');c.time=850;useWorld.setState(c);
 const markup=renderToStaticMarkup(<WorkRemainder/>);expect(markup).toContain('Что возьмёшь дальше?');expect(markup.match(/<h1/g)).toHaveLength(1);expect(markup).not.toContain('Помочь:');expect(markup).toContain('remainder-card');expect(renderToStaticMarkup(<LifeStatus/>)).toContain('Сейчас:');
});
