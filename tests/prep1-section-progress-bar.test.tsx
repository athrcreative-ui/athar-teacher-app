import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('شريط تقدم إكمال القسم داخل .prep1-section-item (Subtle Section Progress Bar Indicator)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('يعرض شريط تقدم إكمال بنسبة 0% داخل عنصر القسم عندما يكون الدرس غير مكتمل', () => {
    render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const progressBar = screen.getByTestId(`section-progress-bar-${firstLesson.id}`);

    expect(progressBar).toBeTruthy();
    expect(progressBar.getAttribute('role')).toBe('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
    expect(progressBar.classList.contains('is-filled')).toBe(false);

    const fill = progressBar.querySelector('.prep1-section-progress-bar__fill') as HTMLElement;
    expect(fill).toBeTruthy();
    expect(fill.style.width).toBe('0%');
  });

  it('يملأ شريط التقدم بنسبة 100% داخل .prep1-section-item عند النقر على زر الإكمال', () => {
    render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const progressBar = screen.getByTestId(`section-progress-bar-${firstLesson.id}`);
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    // النقر على زر الإكمال للقسم المحدد
    fireEvent.click(checkBtn);

    // التحقق من تعبئة شريط التقدم بنسبة 100% واكتساب كلاس is-filled
    expect(progressBar.getAttribute('aria-valuenow')).toBe('100');
    expect(progressBar.classList.contains('is-filled')).toBe(true);

    const fill = progressBar.querySelector('.prep1-section-progress-bar__fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('يعود شريط التقدم إلى 0% عند إلغاء الإكمال لنفس القسم', () => {
    render(
      <MemoryRouter>
        <Prep1IndexViewer />
      </MemoryRouter>,
    );

    const firstLesson = prep1Themes[0].topics[0].items[0];
    const progressBar = screen.getByTestId(`section-progress-bar-${firstLesson.id}`);
    const checkBtn = screen.getByRole('button', {
      name: (content) => content.includes(firstLesson.title) && content.includes('تعليم'),
    });

    // إكمال
    fireEvent.click(checkBtn);
    expect(progressBar.getAttribute('aria-valuenow')).toBe('100');

    // إلغاء الإكمال
    fireEvent.click(checkBtn);
    expect(progressBar.getAttribute('aria-valuenow')).toBe('0');
    expect(progressBar.classList.contains('is-filled')).toBe(false);

    const fill = progressBar.querySelector('.prep1-section-progress-bar__fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });
});
