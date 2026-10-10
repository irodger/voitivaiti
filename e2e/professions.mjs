// Explicit expectations: changing production device routing cannot silently change the test oracle.
export const professions = [
  ['frontend', 'PacBook', 'FE-1427'], ['mobile', 'PacBook', 'mobile-offline'],
  ['designer', 'PacBook', 'design-checkout'], ['product', 'PacBook', 'product-metrics'],
  ['ux-research', 'PacBook', 'research-interviews'],
  ['qa', 'Hell', 'qa-repeat'], ['qa-automation', 'Hell', 'automation-flaky'],
  ['analyst', 'Hell', 'analysis-contract'], ['business-analyst', 'Hell', 'business-process'],
  ['project', 'Hell', 'project-plan'], ['delivery', 'Hell', 'delivery-release'],
  ['data-analyst', 'Hell', 'data-funnel'], ['support', 'Hell', 'support-diagnosis'],
  ['backend', 'TankPad', 'backend-api'], ['devops', 'TankPad', 'devops-deploy'],
  ['sre', 'TankPad', 'sre-incident'], ['sysadmin', 'TankPad', 'sysadmin-access'],
  ['security', 'TankPad', 'security-permissions'], ['data-engineer', 'TankPad', 'data-pipeline'],
  ['dba', 'TankPad', 'dba-query'], ['solution-architect', 'TankPad', 'solution-boundaries'],
  ['architect', 'TankPad', 'architecture-map'],
].map(([id, device, firstTask]) => ({ id, device, firstTask }));
