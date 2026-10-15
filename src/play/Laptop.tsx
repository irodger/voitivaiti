import {useLaptopTools} from '../hooks/useLaptopTools';
import './laptopToolProfiles.css';
import {useRef} from 'react';
import {motion,useIsPresent} from 'framer-motion';
import {X} from 'lucide-react';
import {useLaptopWorkspace} from '../hooks/useLaptopWorkspace';
import {useModalInteraction} from '../hooks/useModalInteraction';
import {useI18n} from '../content/localization';
import {unreadCompanyMail} from '../world/companyMail';
import {LaptopNavigation} from './LaptopNavigation';
import {LaptopReturn} from './LaptopReturn';
import {LaptopContent} from './LaptopContent';
import {LaptopTaskbar} from './LaptopTaskbar';
import {ActionPanel} from './ActionDock';
import {laptopFamily} from './laptopDevices';
import '../content/workspaceUx';
import './workspaceUx.css';
import './laptopApps.css';
import './laptopShell.css';
import './laptopDevices.css';

/** Device frame and modal lifecycle; navigation and app content have separate owners. */
export function Laptop({onClose}:{onClose:()=>void}){
 const present=useIsPresent(),w=useLaptopWorkspace(),tools=useLaptopTools(),{t}=useI18n(),ref=useRef<HTMLDivElement>(null);
 const device=laptopFamily(w.world.characters.find(ch=>ch.id===w.world.activeCharacterId)?.profession??'');
 useModalInteraction(ref,onClose);
 return <motion.div className="laptop-backdrop" style={{pointerEvents:present?'auto':'none'}}
  initial={{backgroundColor:'#17231d00',backdropFilter:'blur(0px)'}} animate={{backgroundColor:'#17231d99',backdropFilter:'blur(8px)'}} exit={{backgroundColor:'#17231d00',backdropFilter:'blur(0px)'}}
  onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t('ui.laptop')} className="laptop-shell" data-device={device} layoutId="player-laptop" transition={{type:'spring',stiffness:280,damping:32}}>
   <div className="laptop-bezel"><i className="camera"/><span>almost.ready</span><button onClick={onClose} aria-label={t('ui.close')}><X size={18}/></button></div>
   <div className="laptop-display" data-editor-kind={tools.editorKind} data-app={w.board?'browser':w.selectedApp} data-workdesk={w.board?'true':'false'}>
    <LaptopNavigation unreadMail={unreadCompanyMail(w.world)} day={w.world.company!.currentDay} time={w.world.time} board={w.board} selectedApp={w.selectedApp} step={w.step} onDesk={w.openDesk} onApp={w.openApp}/>
    {!w.board&&w.step&&w.task&&!w.task.rewarded&&(w.view||w.app==='mail')&&<LaptopReturn step={w.step} onReturn={w.returnCurrent}/>}
    <div className="laptop-body"><ActionPanel className="laptop-workspace"><div className="laptop-content" ref={w.contentRef}><LaptopContent workspace={w} onClose={onClose}/></div></ActionPanel></div>
    {device!=='PacBook'&&<LaptopTaskbar board={w.board} selectedApp={w.selectedApp} time={w.world.time} onDesk={w.openDesk} onApp={w.openApp}/>}
   </div>
   <div className="laptop-chin"><span>{device}</span></div><div className="laptop-base"><i/></div>
  </motion.div>
 </motion.div>;
}
