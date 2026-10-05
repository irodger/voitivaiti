import type { WorkKind } from '../lifeTypes';
export type Action = {
    type: "conference";
    mode: "online" | "visit" | "skip";
    topic: "evidence" | "handoff";
} | {
    type: 'artifact-condition';
    actionId: string;
    rowId: string;
} | {
    type: 'artifact-compare';
    id: string;
} | {
    type: 'artifact-inspect';
    actionId: string;
    rowId: string;
} | {
    type: 'wait-for-reply';
    id: string;
} | {
    type: 'pause-task';
} | {
    type: 'resume-task';
    id: string;
} | {
    type: 'delegation-result';
    id: string;
    response: 'accept' | 'clarify';
} | {
    type: 'perspective-start';
} | {
    type: 'perspective-action';
    id: string;
} | {
    type: 'work-expectation';
    id: WorkKind;
    choice: 'postpone' | 'blocker' | 'defer';
} | {
    type: 'inspect-delivery';
    itemId: string;
} | {
    type: 'close-delivery';
} | {
    type: 'start-walk';
} | {
    type: 'walk-route';
    id: string;
} | {
    type: 'end-walk';
} | {
    type: 'technical-action';
    id: string;
} | {
    type: 'help-work';
    id: WorkKind;
} | {
    type: 'delegate-work';
    id: WorkKind;
    npcId: string;
} | {
    type: 'onboarding';
    choice?: string;
    name?: string;
} | {
    type: 'discover-term';
    id: string;
    context: string;
} | {
    type: 'office-encounter';
} | {
    type: 'priority';
    id: WorkKind;
    explained: boolean;
} | {
    type: 'performance';
    accept: boolean;
} | {
    type: 'montage';
} | {
    type: 'vacation';
    days?: 3 | 7 | 14;
    arrangements?: import('../vacation').VacationArrangements;
} | {
    type: 'montage-close';
} | {
    type: 'quit';
} | {
    type: 'next-career';
} | {
    type: 'rename';
    name: string;
} | {
    type: 'conversation';
    npcId: string;
    topicId: string;
    choiceId: string;
} | {
    type: 'order';
    itemId: string;
} | {
    type: 'unpack';
    itemId: string;
} | {
    type: 'buy-home';
    id: string;
} | {
    type: 'evening';
    id: 'walk' | 'cook' | 'read' | 'games';
} | {
    type: 'new';
    name: string;
    avatarId: string;
    professionId: string;
    seed: number;
} | {
    type: 'choose';
    id: string;
} | {
    type: 'draft';
    id: string;
} | {
    type: 'allocate';
    id: string;
    value: number;
} | {
    type: 'submit';
} | {
    type: 'run';
} | {
    type: 'finish-run';
    taskId: string;
    stepId: string;
} | {
    type: 'click';
} | {
    type: 'advance';
} | {
    type: 'take-task';
} | {
    type: 'event';
    id: string;
    choiceId: string;
} | {
    type: 'promote';
    nodeId: string;
} | {
    type: 'hire';
    id: string;
} | {
    type: 'end-day';
} | {
    type: 'sleep';
} | {
    type: 'reward-close';
} | {
    type: 'survey-open';
} | {
    type: 'talk';
    id: string;
} | {
    type: 'assign-project';
    id: string;
};
export type TransitionResult = {
    campaign: import('../types').Campaign;
    feedback: import('../types').Feedback[];
};
