/**
 * Audio synthesis utility for tactile UI feedback.
 * Uses Web Audio API to generate lightweight, non-intrusive sound effects
 * without relying on external audio assets or network downloads.
 */

let sharedAudioContext: AudioContext | null = null;

/**
 * Returns the shared AudioContext instance if supported, or null.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  try {
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new AudioContextClass();
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
}

/**
 * Checks whether Web Audio synthesis is supported in the current environment.
 */
export function isAudioSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

export interface CheckClickSoundOptions {
  /**
   * Whether the interaction is marking a section as complete (true) or un-marking (false).
   * Defaults to true.
   */
  isCompleting?: boolean;
  /**
   * Volume scale factor between 0.0 and 1.0. Defaults to 0.7 for subtlety.
   */
  volume?: number;
  /**
   * Optional AudioContext override, useful for testing or custom audio graphs.
   */
  audioContext?: AudioContext | null;
}

/**
 * Plays a subtle, non-intrusive 'click' tactile sound effect.
 *
 * Designed specifically for section check button interactions (.prep1-section-check-btn):
 * - Gentle attack & exponential decay (~35-45ms)
 * - Low peak gain (0.05 - 0.08) to prevent jarring the user
 * - Subtle pleasant pitch contour giving crisp mechanical/haptic tactile feedback
 *
 * @returns boolean indicating if the sound was synthesized
 */
export function playCheckClickSound(options: CheckClickSoundOptions = {}): boolean {
  try {
    const ctx = options.audioContext !== undefined ? options.audioContext : getAudioContext();
    if (!ctx) return false;

    // Resume AudioContext if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const { isCompleting = true, volume = 0.7 } = options;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Configure subtle frequency modulation for crisp tactile click
    if (isCompleting) {
      // Pleasant, slightly affirmative micro-pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.038);

      const peakGain = Math.max(0.01, Math.min(0.12, 0.07 * volume));
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } else {
      // Softer, lower tactile click on uncheck
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.028);

      const peakGain = Math.max(0.01, Math.min(0.1, 0.05 * volume));
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }

    return true;
  } catch {
    // Graceful no-op on environments without audio support
    return false;
  }
}
