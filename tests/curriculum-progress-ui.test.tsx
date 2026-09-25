import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { curriculum } from '../src/lib/content';
import { setLessonFinished } from '../src/lib/progress';
import { CurriculumPage } from '../src/pages/CurriculumPage';

describe('واجهة شريط التقدم المرئي للوحدات في صفحة المناهج (CurriculumPage Visual Progress Bar)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderCurriculumPage() {
    return render(
      <MemoryRouter>
        <CurriculumPage />
      </MemoryRouter>,
    );
  }

  it('يعرض شريط تقدم مرئي لكل وحدة دراسية مع النسبة المئوية الرقمية', () => {
    renderCurriculumPage();

    // نتحقق من وجود عناصر progressbar لكل الوحدات
    const progressBars = screen.getAllByRole('progressbar');
    const allUnits = curriculum.levels.flatMap((l) => l.subjects.flatMap((s) => s.units));

    expect(progressBars.length).toBe(allUnits.length);
    expect(progressBars.length).toBeGreaterThan(0);

    // التحقق من القيم الافتراضية لشريط التقدم عند عدم إنجاز أي درس
    progressBars.forEach((bar) => {
      expect(bar.getAttribute('aria-valuemin')).toBe('0');
      expect(bar.getAttribute('aria-valuemax')).toBe('100');
      expect(bar.getAttribute('aria-valuenow')).toBe('0');
      expect(bar.getAttribute('aria-label')).toContain('0%');

      const fill = bar.querySelector('.unit-progress-fill') as HTMLElement;
      expect(fill).toBeTruthy();
      expect(fill.style.width).toBe('0%');
    });

    // النسبة المئوية الرقمية تظهر بجانب شريط التقدم
    const numericBadges = screen.getAllByText(/0%/);
    expect(numericBadges.length).toBeGreaterThanOrEqual(allUnits.length);
  });

  it('يحدّث شريط التقدم المرئي والنسبة المئوية عند إنجاز دروس في الوحدة', () => {
    const targetUnit = curriculum.levels[0].subjects[0].units[0];
    expect(targetUnit.lessons.length).toBeGreaterThan(0);

    // نعلّم نصف الدروس أو درساً واحداً كمكتمل
    const firstLessonId = targetUnit.lessons[0].id;
    setLessonFinished(firstLessonId, true);

    renderCurriculumPage();

    const expectedPercentage = Math.round((1 / targetUnit.lessons.length) * 100);

    // نتحقق من وجود شريط تقدم يعكس النسبة المحسوبة
    const updatedBar = screen.getByLabelText(`نسبة إنجاز الوحدة ${expectedPercentage}%`);
    expect(updatedBar).toBeTruthy();
    expect(updatedBar.getAttribute('aria-valuenow')).toBe(String(expectedPercentage));

    const fill = updatedBar.querySelector('.unit-progress-fill') as HTMLElement;
    expect(fill.style.width).toBe(`${expectedPercentage}%`);

    // يظهر نص النسبة الرقمية المقابلة
    expect(screen.getByText(`${expectedPercentage}%`)).toBeTruthy();
  });

  it('يعرض شريط التقدم مكتملاً بنسبة 100% مع التمييز البصري عند إنهاء جميع دروس الوحدة', () => {
    const targetUnit = curriculum.levels[0].subjects[0].units[0];

    // إتمام جميع دروس الوحدة
    targetUnit.lessons.forEach((lesson) => {
      setLessonFinished(lesson.id, true);
    });

    renderCurriculumPage();

    const completedBar = screen.getByLabelText('نسبة إنجاز الوحدة 100%');
    expect(completedBar).toBeTruthy();
    expect(completedBar.getAttribute('aria-valuenow')).toBe('100');

    const fill = completedBar.querySelector('.unit-progress-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(fill.className).toContain('is-completed');

    // تظهر شارة الاكتمال
    expect(screen.getByText('مكتملة بالكامل ✨')).toBeTruthy();
  });
});
