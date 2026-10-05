export const formatTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export const formatNumber=(value:number,locale:string)=>value.toLocaleString(locale);

/** Same calendar origin as the economic workday calculation; independent of machine timezone. */
export const formatCalendarDate=(day:number,locale:string)=>new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,day)));
