import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CurriculumPage } from '../src/pages/CurriculumPage';
import { UnitPage } from '../src/pages/UnitPage';

describe('تعميم الفهرس والأقسام الداخلية لجميع الوحدات والمراحل (Unit Index Generalization)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function renderUnitPage(levelId: string, subjectId: string, unitId: string) {
    return render(
      <MemoryRouter initialEntries={[`/curriculum/${levelId}/${subjectId}/${unitId}`]}>
        <Routes>
          <Route path="/curriculum/:levelId/:subjectId/:unitId" element={<UnitPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('لا يعرض الفهرس التفصيلي على الصفحة الرئيسية للمناهج بل داخل الوحدات فقط', () => {
    render(
      <MemoryRouter initialEntries={['/curriculum']}>
        <CurriculumPage />
      </MemoryRouter>,
    );

    // التحقق من عدم وجود عنوان الفهرس الموسع في الصفحة الرئيسية للمناهج
    expect(screen.queryByText('فهرس كتاب اللغة العربية — الصف الأول الإعدادي')).toBeNull();

    // التحقق من ظهور إشارة الفهرس والأقسام الداخلية في بطاقات الوحدات
    const indexHints = screen.getAllByText('الفهرس والأقسام الداخلية');
    expect(indexHints.length).toBeGreaterThan(0);
  });

  it('يعرض فهرس وموضوعات الوحدة الأولى في اللغة العربية للصف الخامس الابتدائي', () => {
    renderUnitPage(
      'level-arabic-5-primary',
      'subject-arabic-5-primary',
      'unit-arabic-5-primary-01',
    );

    // التحقق من عنوان الوحدة والشارة
    expect(screen.getAllByText(/الوحدة الأولى: نيلنا أمانة/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/الصف الخامس الابتدائي · اللغة العربية/)).toBeTruthy();

    // التحقق من الموضوعات المقسمة
    expect(screen.getByText('نيلنا شريان الحياة')).toBeTruthy();
    expect(screen.getByText('كن إيجابيًا ومسؤولًا')).toBeTruthy();
    expect(screen.getByText('العطاء والمسؤولية المجتمعية')).toBeTruthy();

    // التحقق من الأقسام الداخلية وشاراتها
    expect(screen.getByText('سر الحياة (نص استماع)')).toBeTruthy();
    expect(screen.getByText('لم ألوث ماء النهر')).toBeTruthy();
    expect(screen.getAllByText(/المفعول به/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('همزة القطع وألف الوصل')).toBeTruthy();
    expect(screen.getByText('حكاية عطاء')).toBeTruthy();
    expect(screen.getByText('هيا نحمي نيلنا')).toBeTruthy();
  });

  it('يعرض فهرس وموضوعات الوحدة الأولى في التربية الدينية للصف الخامس الابتدائي', () => {
    renderUnitPage(
      'level-islamic-5-primary',
      'subject-islamic-5-primary',
      'unit-islamic-5-primary-01',
    );

    // التحقق من عنوان الوحدة والشارة
    expect(screen.getAllByText(/الوحدة الأولى: الإيمان والسلام/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/الصف الخامس الابتدائي · التربية الدينية/)).toBeTruthy();

    // التحقق من الموضوعات والأقسام الدينية
    expect(screen.getByText('العقيدة والتوحيد')).toBeTruthy();
    expect(screen.getByText('القرآن الكريم وتدبره')).toBeTruthy();
    expect(screen.getByText('الإيمان بالكتب السماوية')).toBeTruthy();
    expect(screen.getByText('سورة الإنسان (تلاوة وحفظ وتفسير)')).toBeTruthy();
    expect(screen.getByText('الصحابي الجليل أبو ذر الغفاري')).toBeTruthy();
    expect(screen.getByText('رمضان شهر الصيام')).toBeTruthy();
    expect(screen.getByText('حق الجار')).toBeTruthy();
  });

  it('يعرض فهرس وموضوعات الوحدة الأولى في التربية الدينية للصف الأول الإعدادي', () => {
    renderUnitPage(
      'level-islamic-1-prep',
      'subject-islamic-1-prep',
      'unit-islamic-1-prep-01',
    );

    // التحقق من عنوان الوحدة والشارة
    expect(screen.getAllByText(/الوحدة الأولى: الإسلام دين الرحمة والسلام/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/الصف الأول الإعدادي · التربية الدينية/)).toBeTruthy();

    // التحقق من الموضوعات والدروس
    expect(screen.getByText('العقيدة والتجويد')).toBeTruthy();
    expect(screen.getByText('العبادات والسيرة النبوية')).toBeTruthy();
    expect(screen.getByText('أحكام النون الساكنة والتنوين')).toBeTruthy();
    expect(screen.getByText('صلح الحديبية')).toBeTruthy();
  });

  it('يعرض فهرس وموضوعات المحور الأول في اللغة العربية للصف الأول الإعدادي مع التقييم التشخيصي', () => {
    renderUnitPage(
      'level-arabic-1-prep',
      'subject-arabic-1-prep',
      'unit-arabic-1-prep-01',
    );

    // التحقق من العنوان والشارة
    expect(screen.getAllByText(/الهوية وبناء الشخصية/).length).toBeGreaterThanOrEqual(1);

    // التحقق من شريط التقييم التشخيصي
    expect(screen.getAllByText(/تقييم تشخيصي/).length).toBeGreaterThanOrEqual(1);

    // التحقق من الموضوعات
    expect(screen.getByText('الهوية ومؤثراتها')).toBeTruthy();
    expect(screen.getByText('أصدقائي')).toBeTruthy();
    expect(screen.getByText('فجر الحضارة (نص استماع)')).toBeTruthy();
  });

  it('يتيح البحث والفلترة داخل الوحدة', () => {
    renderUnitPage(
      'level-arabic-5-primary',
      'subject-arabic-5-primary',
      'unit-arabic-5-primary-01',
    );

    const searchInput = screen.getByRole('searchbox', {
      name: /ابحث داخل موضوعات وأقسام هذه الوحدة/,
    });

    fireEvent.change(searchInput, { target: { value: 'همزة القطع' } });

    // يظهر درس همزة القطع
    expect(screen.getByText('همزة القطع وألف الوصل')).toBeTruthy();

    // تختفي الدروس غير المطابقة
    expect(screen.queryByText('سر الحياة (نص استماع)')).toBeNull();
  });

  it('يتيح التبديل بين تقسيم الموضوعات والقائمة المتتابعة', () => {
    renderUnitPage(
      'level-arabic-5-primary',
      'subject-arabic-5-primary',
      'unit-arabic-5-primary-01',
    );

    // في البداية تقسيم الموضوعات نشط
    expect(screen.getByText('نيلنا شريان الحياة')).toBeTruthy();

    // التبديل إلى القائمة المتتابعة
    const flatBtn = screen.getByRole('button', { name: /قائمة متتابعة/ });
    fireEvent.click(flatBtn);

    // لا يظهر عنوان الموضوع الحاوي بل تظهر الدروس بقائمة مسترسلة
    expect(screen.queryByText('نيلنا شريان الحياة')).toBeNull();
    expect(screen.getByText('سر الحياة (نص استماع)')).toBeTruthy();
  });
});
