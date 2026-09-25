import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('فهرس منهج اللغة العربية للصف الأول الإعدادي (Prep 1 Arabic Index Viewer)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderViewer() {
    return render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );
  }

  it('يعرض العنوان الرئيسي وشارات المنهج والمحورين', () => {
    renderViewer();

    expect(screen.getByText('فهرس كتاب اللغة العربية — الصف الأول الإعدادي')).toBeTruthy();
    expect(screen.getByText(/المنهج الجديد المطوّر/)).toBeTruthy();
    expect(screen.getAllByText(/المحور الأول: الهوية وبناء الشخصية/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/المحور الثاني: هواياتي/).length).toBeGreaterThanOrEqual(1);
  });

  it('يعرض الموضوعات الستة والأقسام الداخلية بالتفصيل', () => {
    renderViewer();

    // موضوعات المحور الأول
    expect(screen.getByText('الهوية ومؤثراتها')).toBeTruthy();
    expect(screen.getAllByText('الهوية وبناء الشخصية').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('أصدقائي')).toBeTruthy();

    // موضوعات المحور الثاني
    expect(screen.getByText('الرياضة')).toBeTruthy();
    expect(screen.getByText('الشعر والشعور')).toBeTruthy();
    expect(screen.getByText('أدب وفكر')).toBeTruthy();

    // الأقسام الداخلية البارزة
    expect(screen.getByText('فجر الحضارة (نص استماع)')).toBeTruthy();
    expect(screen.getByText('مقطع من رواية زينب (قصة ولمحة أدبية)')).toBeTruthy();
    expect(screen.getByText('مصر هذه هي التي ستبقى (مقال ثروت أباظة)')).toBeTruthy();
    expect(screen.getByText('يا أصدقائي (مقال عبد الوهاب مطاوع)')).toBeTruthy();
    expect(screen.getByText('حدد هواياتك (نص استماع)')).toBeTruthy();
    expect(screen.getByText('لطيفة النادي أول طيارة مصرية (سيرة مصرية)')).toBeTruthy();
  });

  it('يصفي الفهرس حسب التبويب المختار (المحور الأول أو المحور الثاني)', () => {
    renderViewer();

    // النقر على تبويب المحور الأول
    const theme1Tab = screen.getByRole('tab', { name: /المحور الأول/ });
    fireEvent.click(theme1Tab);

    expect(screen.getByText('الهوية ومؤثراتها')).toBeTruthy();
    // لا يظهر موضوع الرياضة من المحور الثاني
    expect(screen.queryByText('الرياضة')).toBeNull();

    // النقر على تبويب المحور الثاني
    const theme2Tab = screen.getByRole('tab', { name: /المحور الثاني/ });
    fireEvent.click(theme2Tab);

    expect(screen.getByText('الرياضة')).toBeTruthy();
    expect(screen.queryByText('الهوية ومؤثراتها')).toBeNull();
  });

  it('يبحث داخل الفهرس عن الدروس والأقسام الداخلية', () => {
    renderViewer();

    const searchInput = screen.getByRole('searchbox', { name: /البحث داخل فهرس/ });
    fireEvent.change(searchInput, { target: { value: 'زينب' } });

    expect(screen.getByText('مقطع من رواية زينب (قصة ولمحة أدبية)')).toBeTruthy();
    expect(screen.queryByText('حدد هواياتك (نص استماع)')).toBeNull();
  });

  it('يدعم إكمال الدروس وتحديث الحالة', () => {
    renderViewer();

    const lessonItem = prep1Themes[0].topics[0].items[0];
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(lessonItem.title) && content.includes('كمكتمل'),
    });

    fireEvent.click(checkBtn);

    // يصبح الزر في وضع مكتمل
    expect(
      screen.getByRole('button', {
        name: (content) => content.includes(lessonItem.title) && content.includes('إلغاء إكمال'),
      }),
    ).toBeTruthy();
  });
});
