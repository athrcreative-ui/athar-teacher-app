import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import curriculumData from '../src/data/curriculum.json';
import { getLessonAssistantGuide } from '../src/data/lesson-support';
import { GuidedLessonAssistant } from '../src/components/GuidedLessonAssistant';
import { LessonAccordion } from '../src/components/LessonAccordion';
import type { LessonContent } from '../src/types/content';

describe('تعميم خاصية اسألني وأنا هشرح لك على جميع دروس التطبيق', () => {
  it('تتوفر المساعدة الموجهة لجميع الدروس المرفقة في المنهج الدراسي', () => {
    let checkedLessonsCount = 0;

    for (const level of curriculumData.levels) {
      for (const subject of level.subjects) {
        for (const unit of subject.units) {
          for (const lesson of unit.lessons) {
            const guide = getLessonAssistantGuide(lesson.id);
            expect(guide, `يجب أن يتوفر دليل مساعدة للدرس ${lesson.id} (${lesson.title})`).not.toBeNull();
            if (guide) {
              expect(guide.lessonTitle).toBeTruthy();
              expect(guide.intro).toBeTruthy();
              expect(guide.topics.length).toBeGreaterThanOrEqual(2);
              for (const topic of guide.topics) {
                expect(topic.id).toBeTruthy();
                expect(topic.title).toBeTruthy();
                expect(topic.explanation).toBeTruthy();
                expect(topic.simpleExplanation).toBeTruthy();
                expect(topic.examples.length).toBeGreaterThanOrEqual(1);
                expect(topic.commonMistake.wrong).toBeTruthy();
                expect(topic.commonMistake.correction).toBeTruthy();
              }
              expect(guide.quickQuestion.question).toBeTruthy();
              expect(guide.quickQuestion.options.length).toBe(3);
              expect(guide.quickQuestion.correctIndex).toBeGreaterThanOrEqual(0);
              expect(guide.quickQuestion.correctIndex).toBeLessThan(3);
              expect(guide.quickQuestion.correctFeedback).toBeTruthy();
              expect(guide.quickQuestion.incorrectFeedback).toBeTruthy();
            }
            checkedLessonsCount += 1;
          }
        }
      }
    }

    expect(checkedLessonsCount).toBe(116);
  });

  it('تعيد null لمعرف درس غير مسجل وغير موجود بالمنهج للحفاظ على سلوك الحالة الفارغة', () => {
    expect(getLessonAssistantGuide('lesson-empty')).toBeNull();
    expect(getLessonAssistantGuide('unknown-non-existent-id')).toBeNull();
  });

  it('تفعّل محطة اسألني وأنا هشرح لك في الأكورديون لدروس الوحدة الثانية مثل درس جمع المؤنث السالم', () => {
    const lesson14Content: LessonContent = {
      schemaVersion: 1,
      id: 'lesson-14',
      explanation: { text: 'جمع المؤنث السالم ينصب بالكسرة', audio: null },
      summary: { text: '', resources: [] },
      videos: [],
      activities: [],
      assessments: [],
      files: [],
      homework: [],
    };

    render(<LessonAccordion lesson={lesson14Content} />);
    const assistantBtn = screen.getByRole('button', { name: /اسألني وأنا هشرح لك/ });
    expect(assistantBtn).toBeTruthy();

    fireEvent.click(assistantBtn);

    expect(screen.getByText(/أنا معاك في درس «إعراب المفعول به \(جمع المؤنث السالم\)»/)).toBeTruthy();
    expect(screen.getByText('مش فاهم الفكرة')).toBeTruthy();
    expect(screen.getByText('اديني مثال')).toBeTruthy();
    expect(screen.getByText('إيه الخطأ الشائع؟')).toBeTruthy();
    expect(screen.getByText('اختبرني بسرعة')).toBeTruthy();
  });

  it('تستجيب الأنماط الأربعة للمساعد الموجه بصورة تفاعلية كاملة', () => {
    const guide = getLessonAssistantGuide('lesson-14')!;
    expect(guide).not.toBeNull();

    render(<GuidedLessonAssistant guide={guide} />);

    // 1. مش فاهم الفكرة
    fireEvent.click(screen.getByRole('button', { name: /مش فاهم الفكرة/ }));
    expect(screen.getByText('خلينا نفهمها ببساطة 👇')).toBeTruthy();
    expect(screen.getByRole('button', { name: /👍 فهمت/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /👍 فهمت/ }));
    expect(screen.getByText(/ممتاز 👌 لو عايز تثبت الفكرة أكتر/)).toBeTruthy();

    // 2. اديني مثال
    fireEvent.click(screen.getByRole('button', { name: /اديني مثال/ }));
    expect(screen.getByText('تعال نجرب مثالًا 👇')).toBeTruthy();

    // 3. إيه الخطأ الشائع؟
    fireEvent.click(screen.getByRole('button', { name: /إيه الخطأ الشائع؟/ }));
    expect(screen.getByText('خلي بالك من الغلطة دي ⚠️')).toBeTruthy();
    expect(screen.getByText('الخطأ:')).toBeTruthy();
    expect(screen.getByText('الصواب:')).toBeTruthy();

    // 4. اختبرني بسرعة
    fireEvent.click(screen.getByRole('button', { name: /اختبرني بسرعة/ }));
    expect(screen.getByText('يلا أشوف فهمت ولا لأ 😄')).toBeTruthy();
    const correctOptionText = guide.quickQuestion.options[guide.quickQuestion.correctIndex];
    fireEvent.click(screen.getByRole('button', { name: correctOptionText }));
    expect(screen.getByText(guide.quickQuestion.correctFeedback)).toBeTruthy();
  });
});
