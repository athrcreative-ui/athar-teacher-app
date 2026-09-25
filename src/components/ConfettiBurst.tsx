export interface ConfettiBurstProps {
  className?: string;
  testId?: string;
}

export function ConfettiBurst({ className = '', testId }: ConfettiBurstProps) {
  return (
    <span
      className={`prep1-confetti-burst ${className}`.trim()}
      aria-hidden="true"
      data-testid={testId}
    >
      <span className="prep1-confetti-dot p1" />
      <span className="prep1-confetti-dot p2" />
      <span className="prep1-confetti-dot p3" />
      <span className="prep1-confetti-dot p4" />
      <span className="prep1-confetti-dot p5" />
      <span className="prep1-confetti-dot p6" />
    </span>
  );
}
