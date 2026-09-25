import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { D3CircularProgressChart } from '../src/components/D3CircularProgressChart';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';
import { setLessonFinished } from '../src/lib/progress';

describe('مخطط التقدم الدائري بتقنية D3 (D3 Circular Progress Chart in .prep1-theme-header)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يرسم المخطط الدائري المنفرد باستخدام D3 بشكل صحيح وبكافة العناصر البصرية', () => {
    const { container } = render(
      <D3CircularProgressChart
        completed={5}
        total={20}
        percentage={25}
        title="المحور الأول"
        colorScheme="emerald"
      />,
    );

    // التحقق من الحاوية الدلالية ومقاييس الوصول
    const meter = screen.getByRole('meter');
    expect(meter).toBeTruthy();
    expect(meter.getAttribute('aria-valuenow')).toBe('25');
    expect(meter.getAttribute('aria-label')).toContain('المحور الأول: 25%');

    // التحقق من رسم عناصر D3 داخل الـ SVG
    const svg = container.querySelector('svg.d3-circular-progress-svg');
    expect(svg).toBeTruthy();

    const track = container.querySelector('.d3-circle-track');
    expect(track).toBeTruthy();
    expect(track?.getAttribute('d')).toBeTruthy();

    const fill = container.querySelector('.d3-circle-fill');
    expect(fill).toBeTruthy();
    expect(fill?.getAttribute('d')).toBeTruthy();

    const text = container.querySelector('.d3-circle-percentage-text');
    expect(text).toBeTruthy();
    expect(text?.textContent).toBe('25%');

    // التحقق من النص التوضيحي بجانب المخطط
    expect(screen.getByText('5 / 20 دروس')).toBeTruthy();
  });

  it('يدمج المخطط الدائري بتقنية D3 بداخل .prep1-theme-header في فهرس الصف الأول الإعدادي', () => {
    const { container } = render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    // التحقق من وجود عناصر .prep1-theme-header
    const themeHeaders = container.querySelectorAll('.prep1-theme-header');
    expect(themeHeaders.length).toBeGreaterThanOrEqual(2);

    // التحقق من وجود المخطط الدائري داخل كل header
    themeHeaders.forEach((header) => {
      const chartWrapper = header.querySelector('.prep1-theme-header__chart');
      expect(chartWrapper).toBeTruthy();

      const d3Meter = chartWrapper?.querySelector('[data-testid="d3-circular-progress"]');
      expect(d3Meter).toBeTruthy();

      const svg = chartWrapper?.querySelector('svg.d3-circular-progress-svg');
      expect(svg).toBeTruthy();

      const percentText = chartWrapper?.querySelector('.d3-circle-percentage-text');
      expect(percentText).toBeTruthy();
    });
  });

  it('يحدّث المخطط الدائري ونسبة الإنجاز فور إكمال درس داخل المحور', () => {
    const { container } = render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstThemeHeader = container.querySelector('.prep1-theme-header');
    expect(firstThemeHeader).toBeTruthy();

    // النسبة الأولية 0%
    const initialText = firstThemeHeader?.querySelector('.d3-circle-percentage-text');
    expect(initialText?.textContent).toBe('0%');

    // إكمال أول درس في المحور الأول
    const firstLesson = prep1Themes[0].topics[0].items[0];
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('كمكتمل'),
    });
    fireEvent.click(checkBtn);

    // نتحقق من تحديث النسبة لتصبح أكبر من 0% والنص يعكس 1 درس مكتمل
    const updatedMeter = firstThemeHeader?.querySelector('[data-testid="d3-circular-progress"]');
    expect(updatedMeter).toBeTruthy();
    expect(Number(updatedMeter?.getAttribute('aria-valuenow'))).toBeGreaterThan(0);

    const updatedText = firstThemeHeader?.querySelector('.d3-circle-percentage-text');
    expect(updatedText?.textContent).not.toBe('0%');

    // التحقق من تفعيل كلاس التحريك التفاعلي عند التحديث
    expect(updatedMeter?.classList.contains('d3-circular-progress-wrapper--updated')).toBe(true);
    expect(updatedMeter?.getAttribute('data-updating')).toBe('true');
  });

  it('يحتوي المخطط الدائري على فئات حركة الدخول (entrance animation) والنبض البصري عند التحديث', () => {
    const { container, rerender } = render(
      <D3CircularProgressChart
        completed={3}
        total={10}
        percentage={30}
        title="المحور الأول"
        colorScheme="emerald"
      />,
    );

    const wrapper = container.querySelector('.d3-circular-progress-wrapper');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.classList.contains('d3-circular-progress-wrapper--loaded')).toBe(true);

    // إعادة التمرير بنسبة أعلى لمحاكاة تحديث المعلم
    rerender(
      <D3CircularProgressChart
        completed={4}
        total={10}
        percentage={40}
        title="المحور الأول"
        colorScheme="emerald"
      />,
    );

    expect(wrapper?.classList.contains('d3-circular-progress-wrapper--updated')).toBe(true);
    expect(wrapper?.getAttribute('data-updating')).toBe('true');
  });
});
