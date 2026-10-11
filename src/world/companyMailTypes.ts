export type CompanyMailMessage={id:string;threadId:string;eventId:string;projectId:string;problemId:string;taskId?:string;day:number;minute?:number;direction:'incoming'|'outgoing';senderTeamId?:string;senderCharacterId?:string;recipientTeamId?:string;subjectKey:string;bodyKeys:string[];readBy:string[]};
export type CompanyMailbox={version:1;messages:CompanyMailMessage[]};
