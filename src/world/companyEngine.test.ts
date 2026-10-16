import { describe, it, expect, vi } from 'vitest';
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
import { transition } from './engine';
import {
  generateWorld,
  emptyCampaign,
  activeCharacter,
  activeTask,
  makeSchedule,
  makeCharacter,
} from './simulation';
import { advanceCalendar } from './life';
import { migrateLegacy } from './store';
import { advanceCompanyStructure, encounterTeam } from './companyEngine';
import { causalContext } from './causalRouting';
import { resolveTaskTemplate } from '../content/scenarios';
import { finishPlaytestTask } from './playtestHelpers';
import { dictionary } from '../content/localization';
function start(role = 'frontend') {
  const c = transition(emptyCampaign(), {
    type: 'new',
    name: 'Company',
    avatarId: '1',
    professionId: role,
    seed: 1427,
  }).campaign;
  delete activeCharacter(c).firstDay;
  activeCharacter(c).completedWork = ['one', 'two'];
  return c;
}
function launch() {
  const c = start(),
    due = c.company!.structure!.campaign.plannedDay;
  while (c.life!.calendarDay < due) advanceCalendar(c);
  return c;
}
function assign(c: ReturnType<typeof start>) {
  c.phase = 'office';
  c.time = 540;
  c.activeTaskId = null;
  c.schedule = makeSchedule(c);
  c.schedule[0].status = 'completed';
  const q = c.life!.queue.find((q) => q.id === 'bug')!;
  q.status = 'selected';
  q.explained = true;
  q.problemId = c.company!.projects[0].problems.find((p) => p.category === 'interface')!.id;
  q.projectId = c.company!.projects[0].id;
  return transition(c, { type: 'take-task' }).campaign;
}
describe('basic company structure and campaign cause', () => {
  it('generates a deterministic product, ownership and valid team dependencies without extra people', () => {
    const a = generateWorld(1427),
      b = generateWorld(1427);
    expect(a).toEqual(b);
    expect(a.characters).toHaveLength(5);
    const org = a.company.structure!;
    expect(org.teams).toHaveLength(7);
    expect(org.departments).toHaveLength(4);
    expect(org.product.projectId).toBe(a.company.projects[0].id);
    for (const team of org.teams) {
      expect(org.departments.find((d) => d.id === team.departmentId)!.teamIds).toContain(team.id);
      expect(team.contactId).toBeUndefined();
      for (const id of team.dependsOn) expect(org.teams.some((t) => t.id === id)).toBe(true);
      expect(dictionary[team.nameKey]?.en).toBeTruthy();
    }
    const product = org.teams.find((t) => t.nameKey === 'org.team.product')!;
    expect(product.dependsOn.map((id) => org.teams.find((t) => t.id === id)!.nameKey)).toEqual([
      'org.team.payments',
      'org.team.security',
      'org.team.platform',
    ]);
    for (const p of a.company.projects[0].problems)
      expect(org.teams.some((t) => t.id === p.ownerTeamId)).toBe(true);
    expect(
      new Set(
        Array.from({ length: 20 }, (_, seed) => generateWorld(seed).company.structure!.industryKey),
      ).size,
    ).toBeGreaterThan(1);
  });
  it('launches once at its saved date, creates a real owned problem, and survives reload without employees or balance effects', () => {
    let c = start(),
      org = c.company!.structure!,
      count = c.characters.length,
      stats = structuredClone(activeCharacter(c).stats);
    advanceCompanyStructure(c);
    expect(org.campaign.state).toBe('planned');
    c.life!.calendarDay = org.campaign.plannedDay;
    advanceCompanyStructure(c);
    org = c.company!.structure!;
    expect(org.campaign.state).toBe('launched');
    expect(c.characters).toHaveLength(count);
    expect(activeCharacter(c).stats).toEqual(stats);
    const p = c.company!.projects[0].problems.find((p) => p.id === org.campaign.problemId)!;
    expect(p.ownerTeamId).toBe(org.campaign.targetTeamId);
    expect(p.history[0].values).toMatchObject({
      sourceTeamId: org.campaign.sourceTeamId,
      ownerTeamId: org.campaign.targetTeamId,
    });
    expect(causalContext(c, p)!.id).toBe(org.campaign.id + ':risk');
    const history = structuredClone(c.company!.history);
    c = migrateLegacy(JSON.parse(JSON.stringify(c)));
    advanceCompanyStructure(c);
    advanceCompanyStructure(c);
    expect(c.company!.structure).toEqual(org);
    expect(c.company!.history).toEqual(history);
    expect(
      c.company!.projects[0].problems.filter((p) => p.id === org.campaign.problemId),
    ).toHaveLength(1);
  });
  it('routes campaign risk over fresh work, creates a single real contact and lets the player observe the forecast before repair', () => {
    let c = assign(launch());
    const task = activeTask(c)!,
      org = c.company!.structure!;
    expect(task.problemId).toBe(org.campaign.problemId);
    expect(task.encounter!.causeKey).toBe('org.campaign.launched');
    expect(task.encounter!.contextKeys).toContain('org.team.marketing');
    expect(task.encounter!.contextKeys).toContain('org.team.platform');
    expect(c.characters).toHaveLength(7); // five core colleagues, the hero and one encountered contact
    const contactId = org.teams.find((t) => t.id === org.campaign.sourceTeamId)!.contactId!;
    expect(resolveTaskTemplate(task).author).toBe(contactId);
    expect(encounterTeam(c, org.campaign.sourceTeamId, makeCharacter)!.id).toBe(contactId);
    expect(c.characters).toHaveLength(7);
    const step = resolveTaskTemplate(task).steps[0],
      artifact = step.actionFlow!.actions.find((a) => a.id === 'inspect')!.artifact!;
    expect(artifact.rows.map((r) => r.id)).toEqual(['forecast', 'capacity']);
    expect(task.progress[step.id].observations).toBeUndefined();
    c = transition(c, {
      type: 'artifact-inspect',
      actionId: 'inspect',
      rowId: 'forecast',
    }).campaign;
    c = migrateLegacy(JSON.parse(JSON.stringify(c)));
    expect(activeTask(c)!.progress[step.id].artifactReadings!.inspect).toEqual(['forecast']);
    expect(
      resolveTaskTemplate(activeTask(c)!).steps[0].actionFlow!.actions.find(
        (a) => a.id === 'inspect',
      )!.artifact,
    ).toEqual(artifact);
    c = finishPlaytestTask(c);
    expect(activeTask(c)!.rewarded).toBe(true);
    expect(activeTask(c)!.progress[step.id].observations!.inspect).toBe('org.campaign.observation');
    expect(activeTask(c)!.progress[step.id].observations!.trace).toBe('org.campaign.trace.result');
    const p = c.company!.projects[0].problems.find((p) => p.id === task.problemId)!;
    expect(causalContext(c, p)?.id).not.toBe(task.encounter!.triggerId);
    expect(c.company!.employeeIds.filter((id) => id === contactId)).toHaveLength(1);
  });
  it('uses the same Platform-owned cause through an SRE lens', () => {
    let c = launch();
    activeCharacter(c).profession = 'sre';
    c = assign(c);
    expect(activeTask(c)!.templateId).toBe('lens.sre.performance');
    const p = c.company!.projects[0].problems.find((p) => p.id === activeTask(c)!.problemId)!;
    expect(p.ownerTeamId).toBe(c.company!.structure!.campaign.targetTeamId);
    expect(finishPlaytestTask(c).tasks.at(-1)!.rewarded).toBe(true);
  });
  it('does not rebuild legacy companies or backfill campaign events on reload', () => {
    let c = start();
    delete c.company!.structure;
    const history = structuredClone(c.company!.history);
    c = migrateLegacy(JSON.parse(JSON.stringify(c)));
    expect(c.company!.structure).toBeUndefined();
    advanceCompanyStructure(c);
    expect(c.company!.history).toEqual(history);
    const old = migrateLegacy({
      gamePhase: 'home',
      currentDay: 50,
      characters: [{ id: 'legacy', name: 'Legacy', avatarId: '1', profession: 'frontend' }],
      activeCharacterId: 'legacy',
    });
    expect(old.company!.structure).toBeUndefined();
    advanceCalendar(old);
    expect(old.company!.history.some((e) => e.kind === 'marketing-campaign')).toBe(false);
  });
});
