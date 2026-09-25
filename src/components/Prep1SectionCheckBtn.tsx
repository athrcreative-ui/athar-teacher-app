import { useState } from 'react';
import { playCheckClickSound } from '../lib/audio';
import { ConfettiBurst } from './ConfettiBurst';
import { Icon } from './Icon';

export interface Prep1SectionCheckBtnProps {
  isFinished: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  title?: string;
  finishedTitle?: string;
  unfinishedTitle?: string;
  finishedText?: string;
  unfinishedText?: string;
  className?: string;
  soundEnabled?: boolean;
}

export function Prep1SectionCheckBtn({
  isFinished,
  onToggle,
  ariaLabel,
  title,
  finishedTitle = 'تم الإنجاز',
  unfinishedTitle = 'وضع كـ مكتمل',
  finishedText = 'مكتمل',
  unfinishedText = 'إكمال',
  className = '',
  soundEnabled = true,
}: Prep1SectionCheckBtnProps) {
  const [isPopping, setIsPopping] = useState(false);

  const defaultTitle = isFinished ? finishedTitle : unfinishedTitle;
  const resolvedTitle = title !== undefined ? title : defaultTitle;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger subtle tactile click sound feedback
    if (soundEnabled) {
      playCheckClickSound({ isCompleting: !isFinished });
    }

    // Only trigger positive reinforcement confetti / pop when marking as finished
    if (!isFinished) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 850);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      className={`prep1-section-check-btn${isFinished ? ' is-finished' : ''}${isPopping ? ' is-popping' : ''} ${className}`.trim()}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={resolvedTitle}
      data-tooltip={defaultTitle}
      data-popping={isPopping ? 'true' : 'false'}
    >
      <span className="prep1-check-btn__icon-wrapper">
        <Icon
          name={isFinished ? 'check-circle' : 'check'}
          className={isPopping ? 'prep1-check-pop-icon' : ''}
        />
        {isPopping && <ConfettiBurst testId="check-confetti-burst" />}
      </span>
      <span>{isFinished ? finishedText : unfinishedText}</span>
      <span className="prep1-section-check-btn__tooltip" role="tooltip" aria-hidden="true">
        {resolvedTitle}
      </span>
    </button>
  );
}
