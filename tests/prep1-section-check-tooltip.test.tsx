import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1SectionCheckBtn } from '../src/components/Prep1SectionCheckBtn';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('نص التلميح وخاصية العنوان لزر الإكمال (Section Check Button Title & Tooltip)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يعرض "وضع كـ مكتمل" كخاصية title وتلميح عندما تكون الحالة غير مكتملة', () => {
    render(
      <Prep1SectionCheckBtn
        isFinished={false}
        onToggle={() => {}}
        ariaLabel="تحديد الدرس كمكتمل"
      />,
    );

    const btn = screen.getByRole('button', { name: 'تحديد الدرس كمكتمل' });
    expect(btn.getAttribute('title')).toBe('وضع كـ مكتمل');
    expect(btn.getAttribute('data-tooltip')).toBe('وضع كـ مكتمل');

    const tooltip = btn.querySelector('.prep1-section-check-btn__tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('وضع كـ مكتمل');
  });

  it('يعرض "تم الإنجاز" كخاصية title وتلميح عندما تكون الحالة مكتملة', () => {
    render(
      <Prep1SectionCheckBtn
        isFinished={true}
        onToggle={() => {}}
        ariaLabel="إلغاء إكمال الدرس"
      />,
    );

    const btn = screen.getByRole('button', { name: 'إلغاء إكمال الدرس' });
    expect(btn.getAttribute('title')).toBe('تم الإنجاز');
    expect(btn.getAttribute('data-tooltip')).toBe('تم الإنجاز');

    const tooltip = btn.querySelector('.prep1-section-check-btn__tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('تم الإنجاز');
  });

  it('يحدّث خاصية title والتلميح ديناميكياً عند تبديل حالة الإكمال', () => {
    let finished = false;
    const { rerender } = render(
      <Prep1SectionCheckBtn
        isFinished={finished}
        onToggle={() => {
          finished = true;
        }}
        ariaLabel="حالة الدرس"
      />,
    );

    const btn = screen.getByRole('button', { name: 'حالة الدرس' });
    expect(btn.getAttribute('title')).toBe('وضع كـ مكتمل');

    // تبديل الحالة إلى مكتمل
    fireEvent.click(btn);

    rerender(
      <Prep1SectionCheckBtn
        isFinished={true}
        onToggle={() => {
          finished = false;
        }}
        ariaLabel="حالة الدرس"
      />,
    );

    expect(btn.getAttribute('title')).toBe('تم الإنجاز');
    const tooltip = btn.querySelector('.prep1-section-check-btn__tooltip');
    expect(tooltip?.textContent).toBe('تم الإنجاز');
  });

  it('يعرض العنوان التوضيحي والتلميح الصحيح في فهرس المنهج Prep1IndexViewer للأقسام المكتملة وغير المكتملة', () => {
    render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    // في البداية: غير مكتمل -> 'وضع كـ مكتمل'
    expect(checkBtn.getAttribute('title')).toBe('وضع كـ مكتمل');
    const tooltip = checkBtn.querySelector('.prep1-section-check-btn__tooltip');
    expect(tooltip?.textContent).toBe('وضع كـ مكتمل');

    // النقر للتحويل إلى مكتمل
    fireEvent.click(checkBtn);

    // بعد الإكمال: مكتمل -> 'تم الإنجاز'
    expect(checkBtn.getAttribute('title')).toBe('تم الإنجاز');
    expect(tooltip?.textContent).toBe('تم الإنجاز');

    // النقر مرة أخرى لإلغاء الإكمال -> يعود 'وضع كـ مكتمل'
    fireEvent.click(checkBtn);
    expect(checkBtn.getAttribute('title')).toBe('وضع كـ مكتمل');
    expect(tooltip?.textContent).toBe('وضع كـ مكتمل');
  });
});
