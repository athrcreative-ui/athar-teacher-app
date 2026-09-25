import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import lesson01Data from '../src/data/lessons/lesson-01.json';
import { LessonAccordion } from '../src/components/LessonAccordion';
import type { LessonContent } from '../src/types/content';

const emptyLesson = {
  ...lesson01Data,
  id: 'lesson-empty',
  explanation: { text: '', audio: null },
  summary: { text: '', resources: [] },
  videos: [],
  activities: [],
  assessments: [],
  files: [],
  homework: [],
} as LessonContent;

describe('سلوك أكورديون الدرس', () => {
  it('يفتح قسم أهم النقاط افتراضيًا عند خلو الأقسام ويعرض الأقسام التسعة', () => {
    render(<LessonAccordion lesson={emptyLesson} />);
    const explanation = screen.getByRole('button', { name: /أهم النقاط الرئيسة بالدرس/ });
    const videos = screen.getByRole('button', { name: /شرح الدرس فيديو/ });
    const booklet = screen.getByRole('button', { name: /البوكليت/ });
    const presentation = screen.getByRole('button', { name: /البوربينت \/ العرض التقديمي/ });
    const assistant = screen.getByRole('button', { name: /اسألني وأنا هشرح لك/ });
    const homework = screen.getByRole('button', { name: /الواجبات \/ الاختبارات/ });

    expect(explanation.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('button')).toHaveLength(9);
    expect(videos).toBeTruthy();
    expect(booklet).toBeTruthy();
    expect(presentation).toBeTruthy();
    expect(homework).toBeTruthy();
    expect(screen.queryByRole('button', { name: /الملفات التعليمية/ })).toBeNull();

    fireEvent.click(assistant);

    expect(explanation.getAttribute('aria-expanded')).toBe('false');
    expect(assistant.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('لم يُضف مساعد شرح موجّه لهذا الدرس بعد.')).toBeTruthy();
  });

  it('يفتح أول قسم به محتوى تلقائيًا', () => {
    const lessonWithActivity = {
      ...emptyLesson,
      activities: [
        {
          id: 'test-activity',
          title: 'نشاط تجريبي',
          url: 'https://example.com/activity',
          format: 'نشاط',
        },
      ],
    } as LessonContent;

    render(<LessonAccordion lesson={lessonWithActivity} />);
    const activities = screen.getByRole('button', { name: /الأنشطة والألعاب التعليمية/ });
    expect(activities.getAttribute('aria-expanded')).toBe('true');
  });

  it('يعرض البوكليت في عارض جانبي مع خيار التحميل', () => {
    render(<LessonAccordion lesson={lesson01Data as LessonContent} />);
    const booklet = screen.getByRole('button', { name: /البوكليت/ });
    fireEvent.click(booklet);
    fireEvent.click(screen.getByRole('button', { name: /عرض البوكليت/ }));

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('تحميل البوكليت')).toBeTruthy();
  });

  it('يعرض مساعد الشرح الموجّه للدرس الأول ويستجيب للاختيارات', () => {
    render(<LessonAccordion lesson={lesson01Data as LessonContent} />);
    fireEvent.click(screen.getByRole('button', { name: /اسألني وأنا هشرح لك/ }));

    expect(screen.getByText('أنا معاك في درس «سر الحياة»')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /مش فاهم الفكرة/ }));
    expect(screen.getAllByText('لماذا نهر النيل سر الحياة؟').length).toBeGreaterThan(0);
    expect(screen.getByText(/نهر النيل مصدر أساسي للماء والزراعة والحياة/)).toBeTruthy();
  });

  it('يعرض رابط الواجب والاختبار المخصص للدرس الأول', () => {
    render(<LessonAccordion lesson={lesson01Data as LessonContent} />);
    fireEvent.click(screen.getByRole('button', { name: /الواجبات \/ الاختبارات/ }));

    expect(screen.getByText('واجب واختبار درس سر الحياة')).toBeTruthy();
    expect(screen.getByText('ابدأ الواجب والاختبار')).toBeTruthy();
  });
});
