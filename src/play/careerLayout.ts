import type {CareerNode} from '../world/types';
export function careerLayout(nodes:CareerNode[],current:string){
 const depths=new Map<string,number>();
 nodes.forEach(n=>{const depth=depths.get(n.id)??0;depths.set(n.id,depth);n.next.forEach(id=>depths.set(id,Math.max(depths.get(id)??0,depth+1)));});
 const ancestors=new Set<string>();
 const visit=(id:string)=>{nodes.filter(n=>n.next.includes(id)).forEach(n=>{if(!ancestors.has(n.id)){ancestors.add(n.id);visit(n.id);}});};visit(current);
 const columns=Math.max(...depths.values())+1;
 return {columns,points:nodes.map(n=>{const depth=depths.get(n.id)!,siblings=nodes.filter(other=>depths.get(other.id)===depth),slot=siblings.indexOf(n);return {node:n,depth,slot,branched:siblings.length>1,x:(depth+.5)/columns*100,y:siblings.length>1?(slot+.5)/siblings.length*100:50,state:n.id===current?'current':ancestors.has(n.id)?'passed':nodes.find(v=>v.id===current)?.next.includes(n.id)?'next':'future'};})};
}
