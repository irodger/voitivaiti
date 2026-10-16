export type CompanyTeam = {
  id: string;
  departmentId: string;
  nameKey: string;
  purposeKey: string;
  owns: string[];
  dependsOn: string[];
  contactId?: string;
  contactProfession: string;
};
export type CompanyStructure = {
  version: 1;
  type: 'studio' | 'growing' | 'established';
  industryKey: string;
  product: { projectId: string; nameKey: string; purposeKey: string };
  departments: { id: string; nameKey: string; teamIds: string[] }[];
  teams: CompanyTeam[];
  campaign: {
    id: string;
    sourceTeamId: string;
    targetTeamId: string;
    consumerTeamId?: string;
    routeTeamIds?: string[];
    expectedLoad?: { baselineMultiplier: number; expectedMultiplier: number; changedDay: number };
    result?: {
      taskId: string;
      kind: 'bounded' | 'verified' | 'evidence';
      coverageMultiplier: number;
      day: number;
    };
    capacityCheck?: {
      taskId: string;
      ownerTeamId: string;
      testedMultiplier: number;
      expectedMultiplier: number;
      day: number;
    };
    plannedDay: number;
    state: 'planned' | 'launched';
    problemId?: string;
    launchedDay?: number;
  };
};

export type CompanyInteractionContext = {
  sourceTeamId: string;
  ownerTeamId: string;
  consumerTeamId: string;
  originEventId: string;
};
