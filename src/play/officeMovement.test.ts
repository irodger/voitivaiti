import {describe,it,expect} from 'vitest';
import {officeDestination,officeRoute} from './officeMovement';
describe('office movement',()=>{
 it('only the colleague taking a break leaves their station',()=>{
  for(let i=1;i<5;i++)expect(officeDestination(i,'work',1)).toEqual(officeDestination(i,'work',0));
  expect(officeDestination(0,'work',1)).not.toEqual(officeDestination(0,'work',0));
  expect(officeDestination(0,'work',2)).toEqual(officeDestination(0,'work',0));
 });
 it('meeting and review gather actual people instead of moving labels separately',()=>{
  const positions=Array.from({length:5},(_,i)=>officeDestination(i,'meeting',0));
  expect(new Set(positions.map(p=>p.join(','))).size).toBe(5);
  positions.forEach((p,i)=>expect(officeDestination(i,'review',0)).toEqual(p));
 });
 it('routes preserve endpoints and use intermediate aisle waypoints',()=>{
  const from=officeDestination(0,'work',0),to=officeDestination(3,'work',0),route=officeRoute(from,to);
  expect(route[0]).toEqual(from);expect(route.at(-1)).toEqual(to);expect(route.length).toBeGreaterThan(2);
  route.forEach(([x,y])=>{expect(x).toBeGreaterThan(0);expect(x).toBeLessThan(100);expect(y).toBeGreaterThan(0);expect(y).toBeLessThan(100)});
  expect(officeRoute(from,from)).toEqual([from]);
 });
 it('six workstations and meeting places remain distinct and comfortably separated',()=>{
  for(const activity of ['work','meeting','review','lunch'] as const){
   const points=Array.from({length:6},(_,i)=>officeDestination(i,activity,0));
   for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    expect(Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1])).toBeGreaterThan(10);
   }
  }
 });
});
