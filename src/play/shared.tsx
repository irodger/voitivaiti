import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { professionById } from '../content/professions';
import { characterName } from '../utils/characterName';
import { TermText } from './TermText';
import { useModal } from './useModal';
import { useSpeech } from './useSpeech';
export { characterName } from '../utils/characterName';
export { formatTime } from '../utils/format';
export function Button({
  children,
  onClick,
  disabled = false,
  secondary = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={secondary ? 'world-secondary' : 'primary-button'}
    >
      {children}
      {!secondary && <ArrowRight size={18} />}
    </motion.button>
  );
}
export function Modal({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const { ref, t } = useModal();
  return (
    <dialog
      ref={ref}
      className={'modal world-modal ' + className}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button className="icon-button" aria-label={t('ui.close')} onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function Speech({
  speaker = 'sergey',
  children,
}: {
  speaker?: string;
  children: ReactNode;
}) {
  const { t, ch } = useSpeech(speaker);
  return (
    <div className="speech">
      <CharacterAvatar id={ch?.avatarId ?? '3'} size={44} />
      <div>
        <div className="speaker">
          {ch ? characterName(ch, t) : t('ui.npcName')}
          <span>
            {ch
              ? t(
                  professionById[ch.profession].careers.find((n) => n.id === ch.careerNodeId)!
                    .titleKey,
                )
              : ''}
          </span>
        </div>
        <p>{typeof children === 'string' ? <TermText>{children}</TermText> : children}</p>
      </div>
    </div>
  );
}
export function Code({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div className={`code-mock ${error ? 'error-code' : ''}`}>
      <div className="code-top">
        <span className="window-dots" aria-hidden="true">
          ● ● ●
        </span>
        <span>{error ? 'Console' : 'source'}</span>
      </div>
      <div className="source-view">
        <div className="source-gutter" aria-hidden="true">
          {text.split('\n').map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <pre>
          <code>{text}</code>
        </pre>
      </div>
    </div>
  );
}
