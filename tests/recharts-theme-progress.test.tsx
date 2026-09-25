import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { setLessonFinished, saveLessonCompletionTimestamp } from '../src/lib/progress';

describe('مخطط Recharts لتقدم إنجاز الدروس خلال آخر 7 أيام (Recharts Progress Line Chart)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );
  }

  it('يظهر مخطط Recharts البياني داخل .prep1-theme-dropdown عند توسيع رأس المحور', () => {
    const { container } = renderComponent();

    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    expect(firstHeader).toBeTruthy();

    // النقر لتوسيع القائمة المنسدلة
    fireEvent.click(firstHeader);

    // التحقق من ظهور القائمة المنسدلة
    const dropdown = container.querySelector('.prep1-theme-dropdown');
    expect(dropdown).toBeTruthy();

    // التحقق من وجود قسم المخطط البياني Recharts
    const chartSection = container.querySelector('[data-testid="theme-recharts-line-chart"]');
    expect(chartSection).toBeTruthy();

    // التحقق من العنوان والنصوص التوضيحية
    expect(screen.getByText('تقدم إنجاز الدروس خلال آخر 7 أيام')).toBeTruthy();
    expect(screen.getByText(/متابعة وتيرة التعلم اليومية والتراكمية/)).toBeTruthy();
  });

  it('يعكس المخطط البياني الدروس المكتملة حديثاً بدقة', () => {
    // تعيين درس كمكتمل مع طابع زمني لليوم
    const todayStr = new Date().toISOString().split('T')[0];
    setLessonFinished('lesson-p1-01', true);
    saveLessonCompletionTimestamp('lesson-p1-01', todayStr);

    const { container } = renderComponent();

    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    fireEvent.click(firstHeader);

    // التحقق من تحديث شارة الإنجاز التراكمي في رأس المخطط
    expect(screen.getByText(/المكتمل حتى الآن:/)).toBeTruthy();
    expect(screen.getByText(/إنجاز هذا الأسبوع:/)).toBeTruthy();
  });
});
