import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {useWorld,migrateLegacy,snapshot} from './store';
import {beginPlaytest} from './playtestHelpers';
it('closing a completed perspective clears the live merged store and stays closed after reload',()=>{
 const c=beginPlaytest('frontend');c.perspective={taskId:'previous-task',profession:'qa',stage:3,observations:['mastery.returnResult'],completed:true};const identity=c.activeCharacterId,task=c.activeTaskId,time=c.time;useWorld.setState(c);useWorld.getState().dispatch({type:'perspective-action',id:'close'});
 expect(useWorld.getState().perspective).toBeUndefined();expect(useWorld.getState().activeCharacterId).toBe(identity);expect(useWorld.getState().activeTaskId).toBe(task);expect(useWorld.getState().time).toBe(time);
 const restored=migrateLegacy(JSON.parse(JSON.stringify(snapshot(useWorld.getState()))));expect(restored.perspective).toBeUndefined();
});
it('closing an unfinished perspective also exits without changing its source task',()=>{const c=beginPlaytest('qa');c.perspective={taskId:'previous-task',profession:'frontend',stage:1,observations:[],completed:false};useWorld.setState(c);useWorld.getState().dispatch({type:'perspective-action',id:'close'});expect(useWorld.getState().perspective).toBeUndefined();expect(useWorld.getState().tasks).toEqual(c.tasks);});
