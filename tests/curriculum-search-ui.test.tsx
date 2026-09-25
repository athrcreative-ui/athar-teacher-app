import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CurriculumPage } from '../src/pages/CurriculumPage';

describe('واجهة شريط البحث في صفحة المناهج (CurriculumPage Search Bar UI)', () => {
  function renderCurriculumPage() {
    return render(
      <MemoryRouter>
        <CurriculumPage />
      </MemoryRouter>,
    );
  }

  it('يعرض شريط البحث ووسمه التوضيحي والاقتراحات الشائعة', () => {
    renderCurriculumPage();

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ });
    expect(searchInput).toBeTruthy();
    expect(searchInput.getAttribute('placeholder')).toContain('ابحث عن وحدة');

    // الاقتراحات الشائعة موجودة
    expect(screen.getByText('اقتراحات شائعة:')).toBeTruthy();
    expect(screen.getByRole('button', { name: /نيلنا أمانة/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /الإيمان والسلام/ })).toBeTruthy();
  });

  it('يصفي الوحدات المعروضة عند الكتابة في شريط البحث', () => {
    renderCurriculumPage();

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ });

    // البحث عن وحدة "الإيمان والسلام"
    fireEvent.change(searchInput, { target: { value: 'الإيمان والسلام' } });

    // تظهر رسالة التغذية الراجعة
    expect(screen.getByText(/تم العثور على/)).toBeTruthy();
    expect(screen.getByText('الوحدة الأولى: الإيمان والسلام')).toBeTruthy();

    // لا تظهر الوحدات الأخرى مثل "نيلنا أمانة"
    expect(screen.queryByText('الوحدة الأولى: نيلنا أمانة')).toBeNull();
  });

  it('يمسح البحث ويعيد كامل الوحدات عند الضغط على زر المسح أو مسح التصفية', () => {
    renderCurriculumPage();

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ }) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'الإيمان والسلام' } });

    const clearButton = screen.getByRole('button', { name: /مسح نص البحث/ });
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe('');
    expect(screen.getByText('الوحدة الأولى: نيلنا أمانة')).toBeTruthy();
  });

  it('يُفعّل البحث عند النقر على إحدى الكلمات المفتاحية المقترحة', () => {
    renderCurriculumPage();

    const chip = screen.getByRole('button', { name: /جمال الاختلاف/ });
    fireEvent.click(chip);

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ }) as HTMLInputElement;
    expect(searchInput.value).toBe('جمال الاختلاف');
    expect(screen.getByText('الوحدة الثالثة: جمال الاختلاف')).toBeTruthy();
  });

  it('يعرض رسالة عدم العثور على نتائج مع خيار إعادة العرض عند كتابة نص غير موجود', () => {
    renderCurriculumPage();

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ });
    fireEvent.change(searchInput, { target: { value: 'كلمة_غريبة_جدا_غير_موجودة' } });

    expect(screen.getByText(/لا توجد وحدات تطابق/)).toBeTruthy();
    const resetBtn = screen.getByRole('button', { name: 'عرض جميع الوحدات' });
    expect(resetBtn).toBeTruthy();

    fireEvent.click(resetBtn);
    expect(screen.getByText('الوحدة الأولى: نيلنا أمانة')).toBeTruthy();
  });

  it('يمسح البحث عند الضغط على مفتاح Escape', () => {
    renderCurriculumPage();

    const searchInput = screen.getByRole('searchbox', { name: /ابحث عن وحدة/ }) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'نيلنا' } });
    expect(searchInput.value).toBe('نيلنا');

    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });
    expect(searchInput.value).toBe('');
  });
});
