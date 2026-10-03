export type OfficePoint = readonly [number, number];
export type OfficeActivity = 'work' | 'meeting' | 'review' | 'incident' | 'lunch' | 'evening';
// Feet coordinates on the background plate. Paths follow the open central aisle.
const places: OfficePoint[] = [[29,53],[66,65],[18,67],[70,83],[47,46]];
const aisle: OfficePoint[] = [[47,46],[30,54],[25,67],[30,79],[47,88],[66,83],[73,73],[66,64],[58,49]];
export function officeDestination(index:number, activity:OfficeActivity, beat:number):OfficePoint {
 if(activity==='meeting'||activity==='review'||activity==='incident') return [42+(index%3)*7,46+Math.floor(index/3)*5];
 if(activity==='lunch') return [16+(index%3)*7,68+Math.floor(index/3)*6];
 if(activity==='evening') return [65+index*4,85];
 // Only one colleague takes a short walk; the others stay at their own stations.
 return beat%4===1&&index===Math.floor(beat/4)%5 ? [70,83] : places[index%places.length];
}
export function officeRoute(from:OfficePoint,to:OfficePoint):OfficePoint[] {
 if(from[0]===to[0]&&from[1]===to[1]) return [from];
 const nearest=(p:OfficePoint)=>aisle.reduce((best,a)=>Math.hypot(p[0]-a[0],p[1]-a[1])<Math.hypot(p[0]-best[0],p[1]-best[1])?a:best);
 const a=nearest(from),b=nearest(to),start=aisle.indexOf(a),end=aisle.indexOf(b);
 const direct=start<=end?aisle.slice(start,end+1):aisle.slice(end,start+1).reverse();
 const wrap=start<=end?[...aisle.slice(0,start+1).reverse(),...aisle.slice(end).reverse()]:[...aisle.slice(start),...aisle.slice(0,end+1)];
 const length=(points:readonly OfficePoint[])=>points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0);
 const middle=length(direct)<=length(wrap)?direct:wrap;
 return [from,...middle,to];
}
