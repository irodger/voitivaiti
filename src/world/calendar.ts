/** Economic calendar origin: 1 January 2026, independent of the host timezone. */
export const isWorkday=(day:number)=>{const weekday=new Date(Date.UTC(2026,0,day)).getUTCDay();return weekday!==0&&weekday!==6;};
export function nextWorkdayOnOrAfter(day:number){let result=day;while(!isWorkday(result))result++;return result;}
export function addWorkdays(day:number,count:number){let result=day;for(let left=count;left>0;){result++;if(isWorkday(result))left--;}return result;}
