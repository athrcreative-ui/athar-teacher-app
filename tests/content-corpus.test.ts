import { describe, expect, it } from 'vitest';
import curriculumData from '../src/data/curriculum.json';
import teacherData from '../src/data/teacher.json';
import { validateCurriculumData, validateLessonData, validateTeacherData, type LessonContent } from '../src/content/schema';
import { findLessonContext, getLessonNeighbors } from '../src/lib/content';

const lessonModules = import.meta.glob<{ default: LessonContent }>('../src/data/lessons/*.json', { eager: true });

describe('تكامل محتوى المشروع', () => {
  it('يفحص المجموعة كاملة والتطابق بين الفهرس والملفات', () => {
    const teacher = validateTeacherData(teacherData);
    const curriculum = validateCurriculumData(curriculumData);
    expect(teacher.data).not.toBeNull();
    expect(curriculum.data).not.toBeNull();

    const referenceIds = curriculum.data?.levels.flatMap((level) =>
      level.subjects.flatMap((subject) => subject.units.flatMap((unit) => unit.lessons.map(({ id }) => id))),
    ) ?? [];
    const fileIds = Object.keys(lessonModules).map((file) => file.match(/([^/]+)\.json$/)?.[1]).filter(Boolean);
    expect(new Set(fileIds)).toEqual(new Set(referenceIds));

    for (const [file, module] of Object.entries(lessonModules)) {
      const id = file.match(/([^/]+)\.json$/)?.[1];
      expect(id).toBeTruthy();
      expect(validateLessonData(module.default, id).data).not.toBeNull();
    }
  });

  it('يحسب السابق والتالي داخل الوحدة الحالية فقط', () => {
    const first = findLessonContext('lesson-01');
    const second = findLessonContext('lesson-02');
    const beforeLastArabicUnitOne = findLessonContext('lesson-08');
    const lastArabicUnitOne = findLessonContext('lesson-11');
    const firstArabicUnitTwo = findLessonContext('lesson-12');
    const islamicLesson = findLessonContext('lesson-09');

    expect(first && getLessonNeighbors(first)).toMatchObject({ previous: null, next: { id: 'lesson-02' } });
    expect(second && getLessonNeighbors(second)).toMatchObject({ previous: { id: 'lesson-01' }, next: { id: 'lesson-03' } });
    expect(beforeLastArabicUnitOne && getLessonNeighbors(beforeLastArabicUnitOne)).toMatchObject({ previous: { id: 'lesson-07' }, next: { id: 'lesson-11' } });
    expect(lastArabicUnitOne && getLessonNeighbors(lastArabicUnitOne)).toMatchObject({ previous: { id: 'lesson-08' }, next: null });
    expect(firstArabicUnitTwo && getLessonNeighbors(firstArabicUnitTwo)).toMatchObject({ previous: null, next: { id: 'lesson-13' } });
    expect(islamicLesson && getLessonNeighbors(islamicLesson)).toMatchObject({ previous: null, next: { id: 'lesson-38' } });
  });
});
