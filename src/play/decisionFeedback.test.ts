import {it,expect} from 'vitest';
import '../content/corrections';
import {decisionFeedback} from './decisionFeedback';
import {templateById} from '../content/scenarios';
import {translate} from '../content/localization';
import type {StepProgress} from '../world/types';
it('flags reporting before edge checks without inventing a future failure',()=>{
 const step=templateById['priority.feature'].steps[1];
 const p:StepProgress={status:'completed',draft:['original','report'],allocation:{},clicks:0,run:'idle',charged:true};
 expect(decisionFeedback(step,p,translate)).toContain('до проверки соседнего сценария');
 p.draft=['original','edge','report'];
 expect(decisionFeedback(step,p,translate)).toContain('Будет на что опереться');
});
