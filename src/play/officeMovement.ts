export type OfficePoint = readonly [number, number];
export type OfficeActivity = 'work' | 'meeting' | 'review' | 'incident' | 'lunch' | 'evening';
// Feet coordinates on the background plate. Paths follow the open central aisle.
const places: OfficePoint[] = [[41,35],[60,40],[79,46],[31,44],[21,58],[16,76]];
const aisle: OfficePoint[] = [[41,45],[50,50],[68,53],[82,57],[83,72],[72,84],[57,81],[40,75],[32,62],[37,51]];
export function officeDestination(index:number, activity:OfficeActivity, beat:number):OfficePoint {
 if(activity==='meeting'||activity==='review'||activity==='incident') return ([[58,65],[71,65],[83,68],[60,82],[73,84],[84,83]] as OfficePoint[])[index%6];
 if(activity==='lunch') return ([[56,65],[70,64],[83,69],[60,81],[73,83],[84,83]] as OfficePoint[])[index%6];
 if(activity==='evening') return [65+index*4,85];
 // Only one colleague takes a short walk; the others stay at their own stations.
 return beat%4===1&&index===Math.floor(beat/4)%5 ? [78,76] : places[index%places.length];
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
