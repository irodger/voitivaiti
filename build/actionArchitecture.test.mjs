import {readdirSync,readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
const root=new URL('../src/world/actions/',import.meta.url);
describe('action module boundaries',()=>{
 it('domain handlers do not import the coordinator, UI or persistence',()=>{
  for(const file of readdirSync(root).filter(file=>file.endsWith('.ts'))){
   const code=readFileSync(new URL(file,root),'utf8');
   const imports=[...code.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match=>match[1]);
   expect(imports.filter(path=>/(?:^|\/)(?:engine|store|play|hooks|components)(?:\/|$)/.test(path)),file).toEqual([]);
   expect(imports.filter(path=>/^(?:react|zustand)(?:\/|$)/.test(path)),file).toEqual([]);
  }
 });
});
