import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';

describe('الرأس القابل للتوسيع وإحصائيات المحور (.prep1-theme-header expandable)', () => {
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

  it('يكون .prep1-theme-header قابلاً للتوسيع ويحتوي على سمات الوصولية المطلوبة', () => {
    const { container } = renderComponent();

    const headers = container.querySelectorAll('.prep1-theme-header');
    expect(headers.length).toBeGreaterThanOrEqual(2);

    const firstHeader = headers[0];
    expect(firstHeader.classList.contains('prep1-theme-header--expandable')).toBe(true);
    expect(firstHeader.getAttribute('role')).toBe('button');
    expect(firstHeader.getAttribute('aria-expanded')).toBe('false');

    // وجود مؤشر التوسيع
    expect(firstHeader.querySelector('.prep1-theme-header__expand-indicator')).toBeTruthy();
  });

  it('يفتح القائمة المنسدلة للإحصائيات السريعة عند النقر على .prep1-theme-header', () => {
    const { container } = renderComponent();

    const headers = container.querySelectorAll('.prep1-theme-header');
    const firstHeader = headers[0];

    // قبل النقر: القائمة المنسدلة غير موجودة
    expect(container.querySelector('.prep1-theme-dropdown')).toBeNull();

    // النقر على الهيدر
    fireEvent.click(firstHeader);

    // بعد النقر: تصبح القائمة المنسدلة ظاهرة وتتحول aria-expanded إلى true
    expect(firstHeader.getAttribute('aria-expanded')).toBe('true');
    const dropdown = container.querySelector('.prep1-theme-dropdown');
    expect(dropdown).toBeTruthy();

    // التحقق من وجود إحصائيات إجمالي الدروس
    expect(screen.getByText('إجمالي عدد الدروس')).toBeTruthy();
    expect(screen.getAllByText(/دروس/).length).toBeGreaterThanOrEqual(1);

    // التحقق من وجود متوسط وقت الإنجاز
    expect(screen.getByText('متوسط وقت إنجاز الدرس')).toBeTruthy();
    expect(screen.getAllByText(/دقيقة \/ درس/).length).toBeGreaterThanOrEqual(1);

    // التحقق من وجود معدل الإنجاز
    expect(screen.getByText('نسبة الإنجاز الحالية')).toBeTruthy();

    // التحقق من وجود شارات توزيع المهارات
    expect(screen.getByText(/توزيع المهارات والأنشطة/)).toBeTruthy();
  });

  it('يغلق القائمة المنسدلة عند النقر مرة ثانية', () => {
    const { container } = renderComponent();

    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];

    // النقر الأول للفتح
    fireEvent.click(firstHeader);
    expect(container.querySelector('.prep1-theme-dropdown')).toBeTruthy();

    // النقر الثاني للإغلاق
    fireEvent.click(firstHeader);
    expect(container.querySelector('.prep1-theme-dropdown')).toBeNull();
    expect(firstHeader.getAttribute('aria-expanded')).toBe('false');
  });

  it('يدعم التوسيع والإغلاق عبر لوحة المفاتيح بواسطة زر Enter', () => {
    const { container } = renderComponent();

    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];

    // الضغط على Enter للفتح
    fireEvent.keyDown(firstHeader, { key: 'Enter', code: 'Enter' });
    expect(container.querySelector('.prep1-theme-dropdown')).toBeTruthy();

    // الضغط على Space للإغلاق
    fireEvent.keyDown(firstHeader, { key: ' ', code: 'Space' });
    expect(container.querySelector('.prep1-theme-dropdown')).toBeNull();
  });

  it('يحتوي على كروت إحصائية متدرجة الظهور (stagger-fade) بداخل القائمة المنسدلة عند التوسيع', () => {
    const { container } = renderComponent();
    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];

    // فتح القائمة المنسدلة
    fireEvent.click(firstHeader);

    const statCards = container.querySelectorAll('.prep1-stat-card');
    expect(statCards.length).toBe(3);

    // التحقق من فئات وخصائص التدرج الحركي لكل كارت
    expect(statCards[0].classList.contains('prep1-stat-card--stagger-1')).toBe(true);
    expect(statCards[1].classList.contains('prep1-stat-card--stagger-2')).toBe(true);
    expect(statCards[2].classList.contains('prep1-stat-card--stagger-3')).toBe(true);
  });
});
