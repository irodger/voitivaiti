import { motion } from 'framer-motion';
import { OfficePerson } from './OfficePerson';
import { officeSeatFacing, type OfficeActivity } from './officeMovement';
import { useOfficeColleague } from './useOfficeColleague';

export function OfficeColleague({
  id,
  avatarId,
  name,
  role,
  index,
  activity,
  beat,
  introducing,
  unread,
  onTalk,
}: {
  id: string;
  avatarId: string;
  name: string;
  role: string;
  index: number;
  activity: OfficeActivity;
  beat: number;
  introducing: boolean;
  unread: boolean;
  onTalk: (id: string) => void;
}) {
  const {
    onUpdate,
    onAnimationStart,
    onAnimationComplete,
    reduced,
    destination,
    facing,
    walking,
    rear,
    route,
    moving,
    t,
    Tag,
    atDesk,
  } = useOfficeColleague(index, activity, beat, introducing);

  return (
    <motion.div
      className={'office-resident' + (walking && !reduced ? ' is-walking' : '')}
      initial={false}
      animate={{ left: route.map((p) => p[0] + '%'), top: route.map((p) => p[1] + '%') }}
      transition={{
        duration: reduced ? 0 : moving ? Math.min(12, Math.max(4, route.length * 1.3)) : 0,
        ease: 'linear',
        delay: moving && !reduced ? index * 0.35 : 0,
      }}
      onUpdate={onUpdate}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      style={
        {
          zIndex: Math.round(destination[1]),
          '--person-scale': 0.85 + destination[1] / 350,
        } as React.CSSProperties
      }
    >
      <Tag
        className={'resident-target' + (introducing ? ' office-agent-label' : '')}
        onClick={introducing ? undefined : () => onTalk(id)}
        aria-label={introducing ? undefined : t('ui.talkWith', { name })}
        title={introducing ? undefined : t('ui.talkWith', { name })}
      >
        <OfficePerson
          avatarId={avatarId}
          walking={walking}
          rear={rear}
          seated={!walking && atDesk}
          facing={walking ? facing : officeSeatFacing(index)}
        />
        <span className="resident-name">
          {name}
          {unread && !introducing && <i className="resident-unread" />}
        </span>
        <span className="resident-detail">
          <b>{name}</b>
          <small>{role}</small>
          <small>{t('officePerson.' + (walking ? 'walking' : activity))}</small>
          {!introducing && <strong>{t(unread ? 'officePerson.new' : 'officePerson.talk')}</strong>}
        </span>
      </Tag>
    </motion.div>
  );
}
