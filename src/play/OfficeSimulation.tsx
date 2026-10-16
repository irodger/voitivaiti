import '../content/officePeople';
import { OfficeColleague } from './OfficeColleague';
import './officeMovement.css';
import { useOfficeSimulation } from './useOfficeSimulation';

export function OfficeSimulation({onTalk,paused=false}:{onTalk:(id:string)=>void;paused?:boolean}) {
 const {host,t,status,width,height,residents,playerProps,experience}=useOfficeSimulation(paused,onTalk);
 return <div ref={host} className="office-simulation living-office">
  <div className="office-activity" role="status">{t('life.'+status)}</div>
  <div className="office-world-plane" style={{width,height}}>{residents.map(props=><OfficeColleague key={props.id} {...props}/>)}<OfficeColleague {...playerProps}/></div>
  <div className="office-experience">{experience}</div>
 </div>;
}
