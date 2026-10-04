export const formatTime=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export const formatNumber=(value:number,locale:string)=>value.toLocaleString(locale);
