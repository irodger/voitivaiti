import {
  ArrowUpRight,
  Check,
  Compass,
  Crown,
  Network,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import '../content/careerMap';
import '../content/mastery';
import '../content/promotion';
import './careerMap.css';
import { PromotionRequirements } from './PromotionRequirements';
import { Modal } from './shared';
import { useCareerMap } from './useCareerMap';
const icons = [Sprout, Compass, ShieldCheck, Users, Crown, Network];
export function CareerMap({ onWork }: { onWork?: () => void } = {}) {
  const { ch, role, t, setSelected, columns, points, chosen, edges } = useCareerMap();

  return (
    <section className="career-map" aria-label={t('careerMap.title')}>
      <header>
        <div>
          <h2>{t('careerMap.title')}</h2>
          <p>{t('careerMap.hint')}</p>
        </div>
        <span>{t(role.titleKey)}</span>
      </header>
      <div
        className="career-map-board"
        style={{ '--career-columns': columns } as React.CSSProperties}
      >
        <svg
          className="career-map-lines wide"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e) => (
            <path
              key={e.from.node.id + e.to.node.id}
              className={['current', 'passed'].includes(e.to.state) ? 'travelled' : ''}
              d={
                'M ' +
                e.from.x +
                ' ' +
                e.from.y +
                ' C ' +
                (e.from.x + 8) +
                ' ' +
                e.from.y +
                ' ' +
                (e.to.x - 8) +
                ' ' +
                e.to.y +
                ' ' +
                e.to.x +
                ' ' +
                e.to.y
              }
            />
          ))}
        </svg>
        <svg
          className="career-map-lines tall"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((e) => (
            <path
              key={e.from.node.id + e.to.node.id}
              className={['current', 'passed'].includes(e.to.state) ? 'travelled' : ''}
              d={
                'M ' +
                e.from.y +
                ' ' +
                e.from.x +
                ' C ' +
                e.from.y +
                ' ' +
                (e.from.x + 8) +
                ' ' +
                e.to.y +
                ' ' +
                (e.to.x - 8) +
                ' ' +
                e.to.y +
                ' ' +
                e.to.x
              }
            />
          ))}
        </svg>
        {points.map((p, i) => {
          const Icon = icons[i % icons.length];
          return (
            <button
              key={p.node.id}
              className={'career-map-node ' + p.state + (p.branched ? ' branched' : '')}
              style={
                {
                  '--career-depth': p.depth + 1,
                  '--career-slot': p.slot + 1,
                } as React.CSSProperties
              }
              onClick={() => setSelected(p.node.id)}
              aria-current={p.state === 'current' ? 'step' : undefined}
            >
              <span className="career-map-emblem">
                {p.state === 'current' ? (
                  <CharacterAvatar id={ch.avatarId} size={44} />
                ) : (
                  <Icon size={25} />
                )}
              </span>
              <small>
                {p.state === 'passed' && <Check size={12} />} {t('careerMap.' + p.state)}
              </small>
              <b>{t(p.node.titleKey)}</b>
              <ArrowUpRight className="career-map-open" size={14} />
            </button>
          );
        })}
      </div>
      {chosen && (
        <Modal title={t(chosen.node.titleKey)} onClose={() => setSelected(null)}>
          <p>{t('careerMap.' + chosen.state)}</p>
          {chosen.state === 'future' || chosen.state === 'next' ? (
            <>
              {chosen.state === 'future' && <p>{t('promotionClarity.future')}</p>}
              <PromotionRequirements
                nodeId={chosen.node.id}
                onWork={
                  onWork
                    ? () => {
                        setSelected(null);
                        onWork();
                      }
                    : undefined
                }
              />
            </>
          ) : (
            <p>{t(role.descriptionKey)}</p>
          )}
        </Modal>
      )}
    </section>
  );
}
