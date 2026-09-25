import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { Prep1SectionCheckBtn } from '../src/components/Prep1SectionCheckBtn';
import * as audioLib from '../src/lib/audio';

describe('مؤثر الصوت التفاعلي للنقر (Section Check Button Click Sound)', () => {
  let playSoundSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    playSoundSpy = vi.spyOn(audioLib, 'playCheckClickSound');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('يطلق مؤثر الصوت للنقر عند تفاعل المستخدم مع الزر في حالة غير المكتمل (completing)', () => {
    const handleToggle = vi.fn();
    render(<Prep1SectionCheckBtn isFinished={false} onToggle={handleToggle} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(playSoundSpy).toHaveBeenCalledTimes(1);
    expect(playSoundSpy).toHaveBeenCalledWith({ isCompleting: true });
  });

  it('يطلق مؤثر صوت النقر التكتيكي عند إلغاء الإكمال (un-completing)', () => {
    const handleToggle = vi.fn();
    render(<Prep1SectionCheckBtn isFinished={true} onToggle={handleToggle} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(playSoundSpy).toHaveBeenCalledTimes(1);
    expect(playSoundSpy).toHaveBeenCalledWith({ isCompleting: false });
  });

  it('لا يطلق مؤثر الصوت إذا تم تعطيل الصوت عبر soundEnabled={false}', () => {
    const handleToggle = vi.fn();
    render(
      <Prep1SectionCheckBtn isFinished={false} onToggle={handleToggle} soundEnabled={false} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(playSoundSpy).not.toHaveBeenCalled();
  });

  it('يطلق مؤثر الصوت التكتيكي عند تفاعل المستخدم مع زر القسم في فهرس Prep1IndexViewer', () => {
    render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>
    );

    // Get section check buttons in Prep1IndexViewer
    const checkButtons = document.querySelectorAll('.prep1-section-check-btn');
    expect(checkButtons.length).toBeGreaterThan(0);

    // Click the first check button
    fireEvent.click(checkButtons[0]);

    expect(playSoundSpy).toHaveBeenCalled();
  });

  describe('دالة توليد الصوت audioLib.playCheckClickSound في Web Audio', () => {
    it('تنشئ وتتحكم في مذبذب الصوت وكسب الصوت (gain and oscillator) دون أخطاء', () => {
      const mockSetValueAtTime = vi.fn();
      const mockExponentialRamp = vi.fn();
      const mockLinearRamp = vi.fn();
      const mockConnect = vi.fn();
      const mockStart = vi.fn();
      const mockStop = vi.fn();

      const mockGainNode = {
        gain: {
          setValueAtTime: mockSetValueAtTime,
          linearRampToValueAtTime: mockLinearRamp,
          exponentialRampToValueAtTime: mockExponentialRamp,
        },
        connect: mockConnect,
      };

      const mockOscillatorNode = {
        type: 'sine',
        frequency: {
          setValueAtTime: mockSetValueAtTime,
          exponentialRampToValueAtTime: mockExponentialRamp,
        },
        connect: mockConnect,
        start: mockStart,
        stop: mockStop,
      };

      const mockAudioCtx = {
        currentTime: 0,
        state: 'running',
        createOscillator: vi.fn().mockReturnValue(mockOscillatorNode),
        createGain: vi.fn().mockReturnValue(mockGainNode),
        destination: {},
        resume: vi.fn().mockResolvedValue(undefined),
      } as unknown as AudioContext;

      vi.spyOn(audioLib, 'getAudioContext').mockReturnValue(mockAudioCtx);

      // Restore the spy to test actual implementation
      playSoundSpy.mockRestore();

      // Test completing sound
      const playedComplete = audioLib.playCheckClickSound({
        isCompleting: true,
        audioContext: mockAudioCtx,
      });
      expect(playedComplete).toBe(true);
      expect(mockOscillatorNode.type).toBe('sine');
      expect(mockStart).toHaveBeenCalled();
      expect(mockStop).toHaveBeenCalled();

      // Test uncompleting sound
      const playedUncomplete = audioLib.playCheckClickSound({
        isCompleting: false,
        audioContext: mockAudioCtx,
      });
      expect(playedUncomplete).toBe(true);
      expect(mockOscillatorNode.type).toBe('triangle');
    });

    it('تتعامل بأمان مع البيئات غير الداعمة للصوت دون إثارة أخطاء', () => {
      playSoundSpy.mockRestore();

      expect(() => {
        const result = audioLib.playCheckClickSound({ audioContext: null });
        expect(result).toBe(false);
      }).not.toThrow();
    });
  });
});
