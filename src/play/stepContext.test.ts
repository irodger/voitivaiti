import {it,expect} from 'vitest';
import {uniqueStepContext} from './stepContext';
it('removes translated duplicate briefs while preserving new causal facts in order',()=>{
 const copy:Record<string,string>={brief:'Campaign needs 3× traffic.',same:'Campaign needs 3× traffic.',spacing:'Campaign needs 3×   traffic.',limit:'Platform verified 2×.',change:'A new contract changes the journey.'};
 const keys=['same','limit','spacing','change','limit'],before=[...keys];
 expect(uniqueStepContext(keys,'brief',key=>copy[key])).toEqual(['limit','change']);expect(keys).toEqual(before);
});
