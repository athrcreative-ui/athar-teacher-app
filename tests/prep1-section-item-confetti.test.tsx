import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('تأثير الكونفيتي عند تعليم القسم كمكتمل داخل .prep1-section-item', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يُطلق تأثير الكونفيتي وتفعيل عناصر .prep1-confetti-burst داخل .prep1-section-item عند إكمال القسم', () => {
    const { container } = render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const sectionItem = container.querySelector(
      `[data-section-id="${firstLesson.id}"]`,
    ) as HTMLElement;

    expect(sectionItem).toBeTruthy();
    expect(sectionItem.classList.contains('is-celebrating')).toBe(false);
    expect(
      sectionItem.querySelector(`[data-testid="section-item-confetti-${firstLesson.id}"]`),
    ).toBeNull();

    // البحث عن زر الإكمال الخاص بهذا القسم
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    // النقر على زر الإكمال
    fireEvent.click(checkBtn);

    // التحقق من تفعيل حالة الاحتفال وظهور بنية الكونفيتي المعتمدة .prep1-confetti-burst
    expect(sectionItem.classList.contains('is-celebrating')).toBe(true);

    const confettiBurst = sectionItem.querySelector(
      `[data-testid="section-item-confetti-${firstLesson.id}"]`,
    );
    expect(confettiBurst).toBeTruthy();
    expect(confettiBurst?.classList.contains('prep1-confetti-burst')).toBe(true);

    // التحقق من وجود جزيئات الكونفيتي الستة
    const dots = confettiBurst?.querySelectorAll('.prep1-confetti-dot');
    expect(dots?.length).toBe(6);
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p1')).toBeTruthy();
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p2')).toBeTruthy();
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p3')).toBeTruthy();
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p4')).toBeTruthy();
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p5')).toBeTruthy();
    expect(confettiBurst?.querySelector('.prep1-confetti-dot.p6')).toBeTruthy();
  });

  it('لا يُطلق تأثير الكونفيتي داخل عنصر القسم عند إلغاء الإكمال (un-completing)', () => {
    const { container } = render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const sectionItem = container.querySelector(
      `[data-section-id="${firstLesson.id}"]`,
    ) as HTMLElement;

    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    // إكمال أولاً
    fireEvent.click(checkBtn);
    expect(sectionItem.classList.contains('is-completed')).toBe(true);

    // إلغاء الإكمال
    const uncompleteBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('إلغاء'),
    });
    fireEvent.click(uncompleteBtn);

    // بعد إلغاء الإكمال لا تكون حالة احتفال
    expect(sectionItem.classList.contains('is-celebrating')).toBe(false);
    expect(
      sectionItem.querySelector(`[data-testid="section-item-confetti-${firstLesson.id}"]`),
    ).toBeNull();
  });
});
