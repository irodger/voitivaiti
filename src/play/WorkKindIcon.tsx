import {Bug,Blocks,Wrench,GitPullRequest,MessagesSquare} from 'lucide-react';
import type {WorkKind} from '../world/lifeTypes';
const icons={bug:Bug,feature:Blocks,debt:Wrench,review:GitPullRequest,support:MessagesSquare};
export function WorkKindIcon({kind}:{kind:WorkKind}){const Icon=icons[kind];return <span className="desk-kind-icon" data-kind={kind} aria-hidden="true"><Icon size={20}/></span>;}
