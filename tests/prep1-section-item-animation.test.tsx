import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Prep1IndexViewer } from '../src/components/Prep1IndexViewer';
import { prep1Themes } from '../src/data/prep1-curriculum-index';

describe('حركة الدخول والتأخير المتتابع لعناصر الأقسام (.prep1-section-item staggered entry animation)', () => {
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

  it('يطبق فئة .prep1-section-item والخصائص المعتمدة للحركة والتأخير الزمني', () => {
    const { container } = renderViewer();

    const sectionElements = container.querySelectorAll('li.prep1-section-item');
    expect(sectionElements.length).toBeGreaterThan(0);

    const firstItem = sectionElements[0] as HTMLElement;
    expect(firstItem.classList.contains('prep1-section-item')).toBe(true);
    expect(firstItem.getAttribute('data-item-index')).toBe('0');
    expect(firstItem.style.animationDelay).toBe('0ms');
  });

  it('يطبق تأخيراً زمنياً متتابعاً (staggered delay) على كل عنصر داخل قائمة .prep1-section-item', () => {
    const { container } = renderViewer();

    const firstTopicItems = prep1Themes[0].topics[0].items;
    expect(firstTopicItems.length).toBeGreaterThan(0);

    // فحص جميع عناصر الأقسام في الموضوع الأول
    firstTopicItems.forEach((item, index) => {
      const sectionElement = container.querySelector(
        `li.prep1-section-item[data-section-id="${item.id}"]`,
      ) as HTMLElement;

      expect(sectionElement).toBeTruthy();
      expect(sectionElement.getAttribute('data-item-index')).toBe(String(index));

      // التحقق من قيمة animationDelay المتتابعة (index * 45ms)
      const expectedDelay = `${index * 45}ms`;
      expect(sectionElement.style.animationDelay).toBe(expectedDelay);
    });
  });

  it('يحافظ على التأخير المتتابع عند التنقل بين المحاور وعرض موضوعات أخرى', () => {
    const { container } = renderViewer();

    // الانتقال إلى المحور الثاني
    const theme2Tab = screen.getByRole('tab', { name: /المحور الثاني/ });
    fireEvent.click(theme2Tab);

    const theme2TopicItems = prep1Themes[1].topics[0].items;
    expect(theme2TopicItems.length).toBeGreaterThan(0);

    theme2TopicItems.forEach((item, index) => {
      const sectionElement = container.querySelector(
        `li.prep1-section-item[data-section-id="${item.id}"]`,
      ) as HTMLElement;

      expect(sectionElement).toBeTruthy();
      expect(sectionElement.getAttribute('data-item-index')).toBe(String(index));
      expect(sectionElement.style.animationDelay).toBe(`${index * 45}ms`);
    });
  });

  it('يحافظ على التأخير المتتابع عند تصفية العناصر بالبحث', () => {
    const { container } = renderViewer();

    const searchInput = screen.getByRole('searchbox', { name: /البحث داخل فهرس/ });
    fireEvent.change(searchInput, { target: { value: 'زينب' } });

    const matchedItem = container.querySelector(
      'li.prep1-section-item[data-section-id="lesson-p1-02"]',
    ) as HTMLElement;

    expect(matchedItem).toBeTruthy();
    expect(matchedItem.style.animationDelay).toBeTruthy();
  });
});
