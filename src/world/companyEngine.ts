import '../content/companyEngine';
import {nextWorkdayOnOrAfter,isWorkday} from './calendar';
import type {Campaign,Company,Character,Problem,Task,TaskTemplate,StepProgress} from './types';
import type {CompanyStructure,CompanyInteractionContext} from './companyEngineTypes';
export function createCompanyStructure(company:Company):CompanyStructure{
 const prefix=company.id+':team:',department=(id:string)=>company.id+':department:'+id;
 const specs=[['product','product',['web','api'],['payments','security','platform'],'product'],['payments','foundation',['payment'],['platform','security'],'backend'],['security','foundation',['access'],['platform'],'security'],['platform','foundation',['infrastructure'],[],'sre'],['sales','growth',['sales'],['product'],'business-analyst'],['marketing','growth',['campaigns'],['product','platform'],'product'],['support','operations',['support'],['product','payments'],'support']] as const;
 const teams=specs.map(([id,dept,owns,dependsOn,profession])=>({id:prefix+id,departmentId:department(dept),nameKey:'org.team.'+id,purposeKey:'org.purpose.'+id,owns:[...owns],dependsOn:dependsOn.map(id=>prefix+id),contactProfession:profession}));
 const type=company.processMaturity>70?'established':company.processMaturity<40?'studio':'growing';
 return {version:1,type,industryKey:'project.'+company.archetype+'.type',product:{projectId:company.projects[0].id,nameKey:company.projects[0].nameKey,purposeKey:'org.product.purpose'},departments:['product','foundation','growth','operations'].map(id=>({id:department(id),nameKey:'org.department.'+id,teamIds:teams.filter(t=>t.departmentId===department(id)).map(t=>t.id)})),teams,campaign:{id:company.id+':campaign:launch',sourceTeamId:prefix+'marketing',targetTeamId:prefix+'platform',plannedDay:nextWorkdayOnOrAfter(8+(company.seed>>>0)%4),state:'planned'}};
}
/** Resolve a route from saved ownership and edges, never team names or ID suffixes. */
export function campaignTeams(c:Campaign){
 const org=c.company?.structure;if(!org)return;
 const source=org.teams.find(t=>t.id===org.campaign.sourceTeamId&&t.owns.includes('campaigns'));
 const consumer=source&&org.teams.find(t=>source.dependsOn.includes(t.id)&&t.owns.includes('web'));
 const owner=consumer&&org.teams.find(t=>consumer.dependsOn.includes(t.id)&&t.owns.includes('infrastructure'));
 if(!source||!consumer||!owner||source.departmentId===owner.departmentId)return;
 return {source,consumer,owner};
}
/** Launch once from a saved plan. No employee generation or numeric balance effects. */
export function advanceCompanyStructure(c:Campaign){
 const company=c.company,org=company?.structure,day=c.life?.calendarDay;if(!company||!org||day===undefined||!isWorkday(day)||org.campaign.state!=='planned'||day<org.campaign.plannedDay)return;
 const project=company.projects.find(p=>p.id===org.product.projectId),route=campaignTeams(c);if(!project||!route)return;
 org.campaign.targetTeamId=route.owner.id;org.campaign.consumerTeamId=route.consumer.id;org.campaign.routeTeamIds=[route.source.id,route.consumer.id,route.owner.id];org.campaign.expectedLoad={baselineMultiplier:1,expectedMultiplier:3,changedDay:day};
 const id=org.campaign.id+':capacity',eventId=org.campaign.id+':risk';
 let p=project.problems.find(p=>p.id===id);
 if(!p){p={id,titleKey:'org.campaign.title',category:'performance',ownerTeamId:org.campaign.targetTeamId,affectedSystems:['web','api'],rootCause:'unverified campaign capacity',severity:3,discovered:true,status:'planned',contributions:[],history:[]};project.problems.push(p);}
 const event={id:eventId,day,kind:'marketing-campaign',key:'org.campaign.launched',projectId:project.id,problemId:id,values:{sourceTeamId:org.campaign.sourceTeamId,ownerTeamId:org.campaign.targetTeamId,productProjectId:project.id,consumerTeamId:route.consumer.id,dependencyFromTeamId:route.consumer.id,dependencyToTeamId:route.owner.id,originEventId:eventId,baselineMultiplier:1,expectedMultiplier:3}};
 if(!company.history.some(e=>e.id===eventId)){company.history.push(event);project.history.push(event);p.history.push(event);}
 p.latestOutcomeKey=event.key;org.campaign.state='launched';org.campaign.problemId=id;org.campaign.launchedDay=day;
}
/** Materialize a single contact only on an actual assignment involving this team. */
export function encounterTeam(c:Campaign,teamId:string,create:(id:string,name:string,avatar:string,profession:string)=>Character){
 const team=c.company?.structure?.teams.find(t=>t.id===teamId);if(!team)return;
 const existing=c.characters.find(ch=>ch.id===team.contactId);if(existing)return existing;
 const id=team.id+':contact',index=c.company!.structure!.teams.indexOf(team),nameIndex=((c.company!.seed>>>0)+index)%18;
 const marketing=team.id===c.company!.structure!.campaign.sourceTeamId;
 const contact=create(id,marketing?'npc.org.marketing.name':'roster.name.'+nameIndex,marketing||nameIndex%2===0?'1':'0',team.contactProfession);contact.playable=false;contact.currentProjectIds=[c.company!.structure!.product.projectId];team.contactId=id;c.characters.push(contact);if(!c.company!.employeeIds.includes(id))c.company!.employeeIds.push(id);return contact;
}
function campaignOutcomes(scene:TaskTemplate,teamContext:CompanyInteractionContext){
 for(const action of scene.steps.flatMap(s=>s.actionFlow?.actions??[]))if(action.outcome){const changed=action.outcome.systemChanged!==false;action.outcome.teamContext={...teamContext};action.outcome.summaryKey=action.outcome.kind==='temporary'?'org.campaign.bounded':changed?'org.campaign.proper':'org.campaign.evidence';action.outcome.followupKey=action.outcome.kind==='temporary'?'org.campaign.returned':changed?'org.campaign.review':'org.campaign.evidenceNext';}
}
export function prepareCampaignWork(c:Campaign,task:Task,base:TaskTemplate,problem:Problem,create:(id:string,name:string,avatar:string,profession:string)=>Character){
 if(problem.id!==c.company?.structure?.campaign.problemId)return;
 if(task.encounter?.triggerId!==c.company.structure.campaign.id+':risk'){
  const context=task.encounter?.teamContext;if(!context)return;
  const scene=task.scene??structuredClone(base);
  if(['investigation','recurrence','artifact'].includes(task.sceneFamily??''))campaignOutcomes(scene,context);
  if(task.sceneFamily==='review'){
   const contact=encounterTeam(c,context.consumerTeamId,create);if(contact){scene.author=contact.id;scene.steps[0].speaker=contact.id;}
  }
  task.scene=scene;return;
 }
 const org=c.company.structure,route=campaignTeams(c),consumerTeamId=org.campaign.consumerTeamId??route?.consumer.id;if(!consumerTeamId)return;
 const teamContext={sourceTeamId:org.campaign.sourceTeamId,ownerTeamId:problem.ownerTeamId??org.campaign.targetTeamId,consumerTeamId,originEventId:org.campaign.id+':risk'};if(task.encounter)task.encounter.teamContext=teamContext;
 const contact=encounterTeam(c,c.company.structure.campaign.sourceTeamId,create),scene=structuredClone(base);if(contact){scene.author=contact.id;if(task.encounter)task.encounter.previousActorId=contact.id;}
 scene.titleKey=problem.titleKey;scene.descriptionKey='org.campaign.launched';scene.steps[0].titleKey='org.campaign.forecast';scene.steps[0].bodyKey='org.campaign.launched';if(contact)scene.steps[0].speaker=contact.id;task.sceneFamily='investigation';
 const inspect=scene.steps[0].actionFlow?.actions.find(a=>a.id==='inspect'),trace=scene.steps[0].actionFlow?.actions.find(a=>a.id==='trace');
 if(inspect){inspect.observationKey='org.campaign.observation';inspect.artifact={kind:'metrics',titleKey:'org.campaign.forecast',promptKey:'org.campaign.prompt',rows:[{id:'forecast',labelKey:'org.campaign.plannedTraffic',detailKey:'org.campaign.plannedTraffic.data'},{id:'capacity',labelKey:'org.campaign.capacity',detailKey:'org.campaign.capacity.data'}]};}
 const replyEffects=trace?.effects;
 if(trace){trace.effects=undefined;trace.labelKey='org.campaign.trace';trace.observationKey='org.campaign.trace.result';trace.artifact=undefined;trace.completes=false;trace.dependency=true;trace.dependencyTeamId=problem.ownerTeamId;trace.dependencyResponseKey='org.campaign.reply.result';trace.next=['campaign-local','campaign-reply'];}
 scene.steps[0].actionFlow?.actions.push({id:'campaign-local',labelKey:'org.campaign.local',observationKey:'org.campaign.local.result',minutes:30,next:['campaign-reply']},{id:'campaign-reply',labelKey:'org.campaign.reply',observationKey:'org.campaign.reply.result',minutes:0,effects:replyEffects,requiresReply:true,completes:true,artifact:{kind:'metrics',titleKey:'org.campaign.reply',promptKey:'artifact.hint',rows:[{id:'tested',labelKey:'org.campaign.capacity',detailKey:'org.campaign.tested'},{id:'gap',labelKey:'org.campaign.plannedTraffic',detailKey:'org.campaign.gap'}]}});
 campaignOutcomes(scene,teamContext);

 const handoff=scene.steps.flatMap(s=>s.actionFlow?.actions??[]).find(a=>a.id==='handoff');if(handoff)handoff.labelKey='org.campaign.handoff';
 task.scene=scene;
}

/** The result becomes a world fact only when the exact owning team's reply arrives. */
export function deliverCampaignReply(c:Campaign,task:Task,progress:StepProgress){
 const d=progress.dependency,org=c.company?.structure;if(!d?.ready||d.delivered||d.responseKey!=='org.campaign.reply.result'||!org||task.problemId!==org.campaign.problemId)return;
 const owner=org.teams.find(t=>t.id===org.campaign.targetTeamId);if(!owner||owner.contactId!==d.npcId)return;
 d.delivered=true;org.campaign.capacityCheck={taskId:task.id,ownerTeamId:owner.id,testedMultiplier:2,expectedMultiplier:3,day:c.life!.calendarDay};
 const event={id:task.id+':capacity-reply',day:c.life!.calendarDay,kind:'company-team-result',key:'org.campaign.reply.result',actorId:d.npcId,projectId:task.projectId,problemId:task.problemId,values:{sourceTeamId:owner.id,consumerTeamId:task.encounter?.teamContext?.consumerTeamId??org.campaign.consumerTeamId??'',sourceTaskId:task.id,testedMultiplier:2,expectedMultiplier:3}};
 const project=c.company!.projects.find(p=>p.id===task.projectId)!,problem=project.problems.find(p=>p.id===task.problemId)!;
 if(!problem.history.some(e=>e.id===event.id)){problem.history.push(event);project.history.push(event);c.company!.history.push(event);}
}

/** Record coverage from a verified action outcome, never from assignment or family. */
export function recordCampaignOutcome(c:Campaign,task:Task){
 const campaign=c.company?.structure?.campaign,context=task.encounter?.teamContext,outcome=task.outcome;
 if(!campaign||!context||!outcome||task.problemId!==campaign.problemId||context.originEventId!==campaign.id+':risk'||!['org.campaign.bounded','org.campaign.proper','org.campaign.evidence'].includes(outcome.summaryKey))return;
 campaign.result={taskId:task.id,kind:outcome.kind==='temporary'?'bounded':outcome.systemChanged===false?'evidence':'verified',coverageMultiplier:outcome.kind==='temporary'?2:campaign.expectedLoad?.expectedMultiplier??3,day:c.life!.calendarDay};
}

/** Correspondence comes from an actual request/context action on the existing task. */
export function recordCampaignCorrespondence(c:Campaign,task:Task,actionId:string,progress:StepProgress){
 const context=task.encounter?.teamContext,campaign=c.company?.structure?.campaign;if(!context||task.problemId!==campaign?.problemId||!['trace','campaign-local'].includes(actionId)||progress.dependency?.responseKey!=='org.campaign.reply.result')return;
 const id=task.id+':'+actionId+':correspondence',kind=actionId==='trace'?'company-team-request':'company-team-context',key=actionId==='trace'?'mail.requestBody':'org.campaign.local.result';
 const event={id,day:c.life!.calendarDay,kind,key,actorId:task.characterId,projectId:task.projectId,problemId:task.problemId,values:{...context,sourceTaskId:task.id,minute:c.time}};
 const project=c.company!.projects.find(p=>p.id===task.projectId)!,problem=project.problems.find(p=>p.id===task.problemId)!;if(!problem.history.some(e=>e.id===id)){problem.history.push(event);project.history.push(event);c.company!.history.push(event);}
}
