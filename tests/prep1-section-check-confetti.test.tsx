import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1SectionCheckBtn } from '../src/components/Prep1SectionCheckBtn';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('تأثير الفرقعة وحركة الأشكال الاحتفالية لزر الإكمال (Section Check-Mark Pop & Confetti)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يُطلق حركة check-mark pop وظهور عناصر confetti عند تعليم القسم كمكتمل', () => {
    let finished = false;
    const { rerender } = render(
      <Prep1SectionCheckBtn
        isFinished={finished}
        onToggle={() => {
          finished = true;
        }}
        ariaLabel="تحديد الدرس كمكتمل"
        finishedText="مكتمل"
        unfinishedText="إكمال"
      />,
    );

    const checkBtn = screen.getByRole('button', { name: 'تحديد الدرس كمكتمل' });
    expect(checkBtn.classList.contains('is-finished')).toBe(false);
    expect(checkBtn.classList.contains('is-popping')).toBe(false);
    expect(screen.queryByTestId('check-confetti-burst')).toBeNull();

    // النقر للتعليم كمكتمل
    fireEvent.click(checkBtn);

    // إعادة التصيير بالحالة المكتملة
    rerender(
      <Prep1SectionCheckBtn
        isFinished={true}
        onToggle={() => {
          finished = false;
        }}
        ariaLabel="إلغاء إكمال الدرس"
        finishedText="مكتمل"
        unfinishedText="إكمال"
      />,
    );

    // التحقق من تفعيل كلاس التحريك is-popping وظهور الأشكال الاحتفالية confetti
    const poppingBtn = screen.getByRole('button', { name: 'إلغاء إكمال الدرس' });
    expect(poppingBtn.classList.contains('is-popping')).toBe(true);
    expect(poppingBtn.getAttribute('data-popping')).toBe('true');

    const confettiBurst = screen.getByTestId('check-confetti-burst');
    expect(confettiBurst).toBeTruthy();

    const dots = confettiBurst.querySelectorAll('.prep1-confetti-dot');
    expect(dots.length).toBe(6);
  });

  it('لا يُطلق تأثير confetti عند إلغاء الإكمال (un-toggling)', () => {
    let finished = true;
    const { rerender } = render(
      <Prep1SectionCheckBtn
        isFinished={finished}
        onToggle={() => {
          finished = false;
        }}
        ariaLabel="إلغاء إكمال الدرس"
        finishedText="مكتمل"
        unfinishedText="إكمال"
      />,
    );

    const checkBtn = screen.getByRole('button', { name: 'إلغاء إكمال الدرس' });
    expect(checkBtn.classList.contains('is-finished')).toBe(true);

    // النقر لإلغاء الإكمال
    fireEvent.click(checkBtn);

    rerender(
      <Prep1SectionCheckBtn
        isFinished={false}
        onToggle={() => {
          finished = true;
        }}
        ariaLabel="تحديد الدرس كمكتمل"
        finishedText="مكتمل"
        unfinishedText="إكمال"
      />,
    );

    const uncompletedBtn = screen.getByRole('button', { name: 'تحديد الدرس كمكتمل' });
    expect(uncompletedBtn.classList.contains('is-popping')).toBe(false);
    expect(screen.queryByTestId('check-confetti-burst')).toBeNull();
  });

  it('يعمل تأثير pop والكونفيتي بداخل فهرس المنهج Prep1IndexViewer عند نقر المعلم', () => {
    const { container } = render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    expect(checkBtn.classList.contains('is-finished')).toBe(false);

    // النقر على زر الإكمال
    fireEvent.click(checkBtn);

    // يصبح الزر في وضع مكتمل ويحتوي على تأثير الفرقعة
    expect(checkBtn.classList.contains('is-finished')).toBe(true);
    expect(checkBtn.classList.contains('is-popping')).toBe(true);
    expect(container.querySelector('[data-testid="check-confetti-burst"]')).toBeTruthy();
  });
});
