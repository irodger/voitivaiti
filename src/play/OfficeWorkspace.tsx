import { motion } from 'framer-motion';
import { ArrowUpRight,Building2,Laptop2 } from 'lucide-react';
import { OfficeScene } from '../components/OfficeScene';
import { ConferenceInvitation } from './ConferenceInvitation';
import { Conversation } from './Conversation';
import { OfficeContacts } from './OfficeContacts';
import { OfficeStatus } from './SpaceStatus';
import { useOfficeWorkspace,type OfficeWorkspaceProps } from './useOfficeWorkspace';



export function OfficeWorkspace({project,laptopOpen,openLaptop,openCompany}:OfficeWorkspaceProps){
 const {w,t,contact,setContact}=useOfficeWorkspace();

 return <section className="world-office"><div className="office-stage"><OfficeScene onWork={openLaptop} paused={!!contact}/>{!laptopOpen&&<motion.button layoutId="player-laptop" className="office-laptop" whileHover={{scale:1.08,y:-3}} whileTap={{scale:.96}} onClick={openLaptop} aria-label={t('ui.openLaptop')}><span className="mini-camera"/><span className="mini-display"><span className="mini-screen-bar"/><span className="mini-screen-windows"><i/><i/><i/></span></span><span className="desk-hotspot"><Laptop2 size={15}/><span>{t('ui.openLaptop')}</span><ArrowUpRight size={13}/></span><i className="mini-base"/></motion.button>}</div><OfficeStatus openLaptop={openLaptop}/><div className="office-shortcuts"><ConferenceInvitation/><button onClick={openCompany}><Building2 size={19}/>{t(w.company!.nameKey)}<ArrowUpRight size={15}/></button></div><OfficeContacts onTalk={(id,topic)=>setContact({id,topic})}/><div className="project-strip"><span className="eyebrow">{t('ui.project')}</span><b>{t(project.nameKey)}</b><small>{project.stack.join(' · ')}</small></div>{contact&&<Conversation npcId={contact.id} initialTopicId={contact.topic} onClose={()=>setContact(null)} onWork={openLaptop}/>}</section>;
}
