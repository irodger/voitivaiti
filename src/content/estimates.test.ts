import {it,expect} from 'vitest';
import {templates} from './scenarios';
it('ordinary handcrafted estimates cover investigation, resolution and review',()=>{const generated=templates.filter(t=>t.steps.length===3&&t.steps[0].id==='investigate'&&!t.id.startsWith('lens.')&&!t.id.startsWith('priority.')&&t.id!=='support-diagnosis');expect(generated.length).toBeGreaterThan(20);for(const task of generated)expect(task.estimate,task.id).toBe(task.steps.reduce((sum,step)=>sum+step.minutes,0));});
