import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';

describe('شرائح تصفية فئات الطلاب داخل القائمة المنسدلة (Student Cohort Filter Chips)', () => {
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

  it('تعرض القائمة المنسدلة شرائح التصفية الثلاث (All Students, Top Performers, Needs Support) عند فتحها', () => {
    const { container } = renderComponent();

    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    expect(firstHeader).toBeTruthy();

    // النقر لتوسيع القائمة المنسدلة
    fireEvent.click(firstHeader);

    const dropdown = container.querySelector('.prep1-theme-dropdown');
    expect(dropdown).toBeTruthy();

    // التحقق من وجود حاوية الفلتر
    const filterBar = dropdown?.querySelector('.prep1-cohort-filter');
    expect(filterBar).toBeTruthy();

    // التحقق من وجود الشريحة الأولى: All Students
    const allStudentsChip = screen.getByTestId('filter-chip-all-students');
    expect(allStudentsChip).toBeTruthy();
    expect(allStudentsChip.getAttribute('aria-checked')).toBe('true');
    expect(allStudentsChip.classList.contains('is-active')).toBe(true);
    expect(screen.getByText('All Students')).toBeTruthy();
    expect(screen.getByText('جميع الطلاب')).toBeTruthy();

    // التحقق من وجود الشريحة الثانية: Top Performers
    const topPerformersChip = screen.getByTestId('filter-chip-top-performers');
    expect(topPerformersChip).toBeTruthy();
    expect(topPerformersChip.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText('Top Performers')).toBeTruthy();
    expect(screen.getByText('الطلاب المتفوقون')).toBeTruthy();

    // التحقق من وجود الشريحة الثالثة: Needs Support
    const needsSupportChip = screen.getByTestId('filter-chip-needs-support');
    expect(needsSupportChip).toBeTruthy();
    expect(needsSupportChip.getAttribute('aria-checked')).toBe('false');
    expect(screen.getByText('Needs Support')).toBeTruthy();
    expect(screen.getByText('بحاجة لدعم')).toBeTruthy();
  });

  it('تسمح للمعلم بالتبديل إلى فئة "Top Performers" وتحديث الإحصائيات والمخطط البياني', () => {
    const { container } = renderComponent();
    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    fireEvent.click(firstHeader);

    const topPerformersChip = screen.getByTestId('filter-chip-top-performers');
    const allStudentsChip = screen.getByTestId('filter-chip-all-students');

    // النقر على شريحة الطلاب المتفوقين
    fireEvent.click(topPerformersChip);

    expect(topPerformersChip.getAttribute('aria-checked')).toBe('true');
    expect(topPerformersChip.classList.contains('is-active')).toBe(true);
    expect(allStudentsChip.getAttribute('aria-checked')).toBe('false');
    expect(allStudentsChip.classList.contains('is-active')).toBe(false);

    // التحقق من تحديث المؤشرات الخاصة بشريحة المتفوقين
    expect(screen.getByText(/شريحة المتفوقين/)).toBeTruthy();
    expect(screen.getByText(/إنجاز أسرع/)).toBeTruthy();

    // التحقق من تحديث شارة المخطط البياني
    expect(screen.getAllByText(/Top Performers/).length).toBeGreaterThanOrEqual(2);
  });

  it('تسمح للمعلم بالتبديل إلى فئة "Needs Support" وتحديث الإحصائيات والمخطط البياني', () => {
    const { container } = renderComponent();
    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    fireEvent.click(firstHeader);

    const needsSupportChip = screen.getByTestId('filter-chip-needs-support');

    // النقر على شريحة الطلاب بحاجة لدعم
    fireEvent.click(needsSupportChip);

    expect(needsSupportChip.getAttribute('aria-checked')).toBe('true');
    expect(needsSupportChip.classList.contains('is-active')).toBe(true);

    // التحقق من مؤشرات شريحة الدعم
    expect(screen.getByText(/شريحة الدعم/)).toBeTruthy();
    expect(screen.getByText(/وتيرة متأنية/)).toBeTruthy();

    // التحقق من تحديث شارة المخطط البياني
    expect(screen.getAllByText(/Needs Support/).length).toBeGreaterThanOrEqual(2);
  });

  it('تتيح العودة بسهولة إلى فئة "All Students" بعد اختيار أي فئة أخرى', () => {
    const { container } = renderComponent();
    const firstHeader = container.querySelectorAll('.prep1-theme-header')[0];
    fireEvent.click(firstHeader);

    const allStudentsChip = screen.getByTestId('filter-chip-all-students');
    const topPerformersChip = screen.getByTestId('filter-chip-top-performers');

    // الانتقال إلى Top Performers
    fireEvent.click(topPerformersChip);
    expect(topPerformersChip.classList.contains('is-active')).toBe(true);

    // العودة إلى All Students
    fireEvent.click(allStudentsChip);
    expect(allStudentsChip.classList.contains('is-active')).toBe(true);
    expect(allStudentsChip.getAttribute('aria-checked')).toBe('true');
    expect(topPerformersChip.classList.contains('is-active')).toBe(false);
  });
});
