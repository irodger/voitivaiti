import {it,expect,vi} from 'vitest';
vi.stubGlobal('localStorage',{getItem:()=>null,setItem:()=>{},removeItem:()=>{}});
import {editorKindFor,laptopTool,laptopAppOrder} from './laptopTools';
import {professions} from './professions';
it('gives non-coding professions a material editor rather than a generic IDE',()=>{
 for(const role of ['designer','ux-research','qa','analyst','business-analyst','data-analyst','product','project','delivery','support']){
  expect(editorKindFor(role),role).not.toBe('code');expect(laptopTool(role,'ide').labelKey,role).not.toBe('ui.ide');expect(laptopTool(role,'ide').icon,role).not.toBe('code');
 }
 expect(laptopTool('designer','ide').labelKey).toBe('tool.design');
});
it('keeps coding tools for engineering roles and stable saved application ids for everyone',()=>{
 for(const role of ['frontend','backend','mobile','qa-automation','data-engineer','devops'])expect(laptopTool(role,'ide').labelKey,role).toBe('ui.ide');
 for(const role of professions)for(const app of laptopAppOrder){const tool=laptopTool(role.id,app);expect(tool.labelKey).toBeTruthy();expect(tool.purposeKey).toBeTruthy();}
 expect(laptopAppOrder).toEqual(['ide','browser','console','chat','mail']);expect(editorKindFor('unknown-role')).toBe('code');
});
