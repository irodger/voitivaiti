import {describe,it,expect} from 'vitest';
import {officeDestination,officeRoute,residentActivity,officeSeatFacing,officeMotionFacing} from './officeMovement';
describe('office movement',()=>{
 it('only the colleague taking a break leaves their station',()=>{
  for(let i=1;i<5;i++)expect(officeDestination(i,'work',1)).toEqual(officeDestination(i,'work',0));
  expect(officeDestination(0,'work',1)).not.toEqual(officeDestination(0,'work',0));
  expect(officeDestination(0,'work',2)).toEqual(officeDestination(0,'work',0));
 });
 it('meeting and review gather actual people instead of moving labels separately',()=>{
  const positions=Array.from({length:5},(_,i)=>officeDestination(i,'meeting',0));
  expect(new Set(positions.map(p=>p.join(','))).size).toBe(5);
  expect(officeDestination(5,'review',0)).not.toEqual(officeDestination(0,'review',0));
 });
 it('routes preserve endpoints and use intermediate aisle waypoints',()=>{
  const from=officeDestination(0,'work',0),to=officeDestination(3,'work',0),route=officeRoute(from,to);
  expect(route[0]).toEqual(from);expect(route.at(-1)).toEqual(to);expect(route.length).toBeGreaterThan(2);
  route.forEach(([x,y])=>{expect(x).toBeGreaterThan(0);expect(x).toBeLessThan(100);expect(y).toBeGreaterThan(0);expect(y).toBeLessThan(100)});
  expect(officeRoute(from,from)).toEqual([from]);
 });
 it('six workstations and meeting places remain distinct and comfortably separated',()=>{
  for(const activity of ['work','meeting','lunch'] as const){
   const points=Array.from({length:6},(_,i)=>officeDestination(i,activity,0));
   for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    expect(Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1])).toBeGreaterThan(10);
   }
  }
 });
});

it('a review brings only its reviewer and the player into the discussion',()=>{
 for(let reviewer=0;reviewer<5;reviewer++){
  const activities=Array.from({length:6},(_,i)=>residentActivity(i,'review',reviewer));
  expect(activities.filter(a=>a==='review')).toHaveLength(2);
  expect(activities[reviewer]).toBe('review');expect(activities[5]).toBe('review');
  const points=activities.map((a,i)=>officeDestination(i,a,0));
  expect(new Set(points.map(p=>p.join(','))).size).toBe(6);
 }
});

it('seated residents face their own monitors, not a shared direction',()=>{expect([0,1,2,3,4,5].map(officeSeatFacing)).toEqual(['right','right','right','left','left','right']);});

it('walk direction follows each route segment and remains stable on vertical motion',()=>{expect(officeMotionFacing([10,20],[11,20])).toBe('right');expect(officeMotionFacing([20,20],[19,22])).toBe('left');expect(officeMotionFacing([20,20],[20,25],'left')).toBe('left');});
