import { describe, expect, it } from 'vitest';
import { filterCurriculum, normalizeArabic, unitMatchesQuery } from '../src/lib/search';
import type { CurriculumLevel, CurriculumUnit } from '../src/types/content';

describe('مطابقة وبحث الوحدات العربية (Curriculum Unit Search & Normalization)', () => {
  describe('normalizeArabic', () => {
    it('يزيل التشكيل والحركات بدقة', () => {
      expect(normalizeArabic('الوَحْدَةُ الأُولَى: نَيْلُنَا أَمَانَةٌ')).toBe('الوحده الاولي: نيلنا امانه');
    });

    it('يوحد صور الألف والهمزات والتاء المربوطة والألف المقصورة', () => {
      expect(normalizeArabic('إعراب آية الأسبوع على هُدى')).toBe('اعراب ايه الاسبوع علي هدي');
    });

    it('يزيل الكشيدة والتطويل', () => {
      expect(normalizeArabic('نـحـو')).toBe('نحو');
    });

    it('يتعامل مع النصوص الفارغة والمسافات الزائدة', () => {
      expect(normalizeArabic('')).toBe('');
      expect(normalizeArabic('   دروس   اللغة   ')).toBe('دروس اللغه');
    });
  });

  describe('unitMatchesQuery', () => {
    const sampleUnit: CurriculumUnit = {
      id: 'unit-arabic-01',
      title: 'الوحدة الأولى: نيلنا أمانة',
      description: 'دروس الوحدة الأولى في اللغة العربية للصف الخامس الابتدائي.',
      lessons: [
        { id: 'lesson-01', title: 'سر الحياة (نص استماع)' },
        { id: 'lesson-02', title: 'لم ألوث ماء النهر' },
        { id: 'lesson-03', title: 'المفعول به' },
      ],
    };

    it('يطابق عنوان الوحدة بدقة', () => {
      expect(unitMatchesQuery(sampleUnit, 'نيلنا أمانة')).toBe(true);
      expect(unitMatchesQuery(sampleUnit, 'نيلنا امانه')).toBe(true);
      expect(unitMatchesQuery(sampleUnit, 'الوحده')).toBe(true);
    });

    it('يطابق الكلمات المفتاحية في وصف الوحدة', () => {
      expect(unitMatchesQuery(sampleUnit, 'الخامس الابتدائي')).toBe(true);
    });

    it('يطابق الكلمات المفتاحية في أسماء دروس الوحدة', () => {
      expect(unitMatchesQuery(sampleUnit, 'المفعول به')).toBe(true);
      expect(unitMatchesQuery(sampleUnit, 'ماء النهر')).toBe(true);
    });

    it('يطابق الكلمات في سياق المادة والمستوى عند تمريرها', () => {
      expect(unitMatchesQuery(sampleUnit, 'لغة عربية', ['اللغة العربية', 'المرحلة الابتدائية'])).toBe(true);
    });

    it('لا يطابق الكلمات غير الموجودة', () => {
      expect(unitMatchesQuery(sampleUnit, 'رياضيات هندسة حساب')).toBe(false);
    });
  });

  describe('filterCurriculum', () => {
    const mockLevels: CurriculumLevel[] = [
      {
        id: 'level-primary',
        title: 'الصف الخامس الابتدائي',
        stage: 'المرحلة الابتدائية',
        subjects: [
          {
            id: 'sub-arabic',
            title: 'اللغة العربية',
            units: [
              {
                id: 'unit-1',
                title: 'الوحدة الأولى: نيلنا أمانة',
                lessons: [{ id: 'l1', title: 'سر الحياة' }],
              },
              {
                id: 'unit-2',
                title: 'الوحدة الثانية: من التواصل',
                lessons: [{ id: 'l2', title: 'لغة النصر' }],
              },
            ],
          },
          {
            id: 'sub-islamic',
            title: 'التربية الإسلامية',
            units: [
              {
                id: 'unit-islamic-1',
                title: 'الوحدة الأولى: عقيدتي',
                lessons: [{ id: 'l3', title: 'شكر النعم' }],
              },
            ],
          },
        ],
      },
    ];

    it('يعيد كامل الوحدات عند خلو حقل البحث', () => {
      const result = filterCurriculum(mockLevels, '');
      expect(result.isSearching).toBe(false);
      expect(result.matchedUnitsCount).toBe(3);
      expect(result.totalUnitsCount).toBe(3);
      expect(result.filteredLevels.length).toBe(1);
    });

    it('يصفي الوحدات بناءً على اسم الوحدة', () => {
      const result = filterCurriculum(mockLevels, 'عقيدتي');
      expect(result.isSearching).toBe(true);
      expect(result.matchedUnitsCount).toBe(1);
      expect(result.filteredLevels[0].subjects.length).toBe(1);
      expect(result.filteredLevels[0].subjects[0].units[0].id).toBe('unit-islamic-1');
    });

    it('يصفي الوحدات بناءً على كلمات في دروسها', () => {
      const result = filterCurriculum(mockLevels, 'لغة النصر');
      expect(result.matchedUnitsCount).toBe(1);
      expect(result.filteredLevels[0].subjects[0].units[0].id).toBe('unit-2');
    });

    it('يعيد نتيجة فارغة عند عدم وجود أي تطابق', () => {
      const result = filterCurriculum(mockLevels, 'كلمة غير موجودة قط');
      expect(result.matchedUnitsCount).toBe(0);
      expect(result.filteredLevels.length).toBe(0);
    });
  });
});
