import {it,expect} from 'vitest';
import {emptyCampaign} from './simulation';
import {transition} from './engine';
import {reviewResponse} from './life';
import {warningReviewDetails} from './warningReview';
import {migrateLegacy} from './store';
function start(){return transition(emptyCampaign(),{type:'new',name:'Warning',avatarId:'1',professionId:'frontend',seed:1427}).campaign;}
it('records issues before the reply and retains them after time and reload',()=>{
 const c=start();c.life!.reviewDue=true;c.life!.decisionHistory=[{day:1,kind:'riskyDeploys'}];reviewResponse(c,false);
 expect(warningReviewDetails(c)).toEqual({day:1,issues:[{key:'riskyDeploys',count:1}]});
 c.life!.calendarDay=30;c.life!.decisionHistory=[];
 expect(warningReviewDetails(migrateLegacy(JSON.parse(JSON.stringify(c))))).toEqual({day:1,issues:[{key:'riskyDeploys',count:1}]});
});
it('does not invent reasons for a legacy review or borrow another hero’s review',()=>{
 const c=start();c.company!.history.push({id:'legacy',day:1,kind:'performance-review',key:'life.stage1',actorId:c.activeCharacterId,values:{stage:1}});
 expect(warningReviewDetails(c)).toBeNull();c.life!.reviewDue=true;reviewResponse(c,true);c.activeCharacterId='anya';expect(warningReviewDetails(c)).toBeNull();
});
it('records an empty snapshot distinctly from missing historical data',()=>{
 const c=start();c.life!.reviewDue=true;reviewResponse(c,true);expect(warningReviewDetails(c)).toEqual({day:1,issues:[]});
});
