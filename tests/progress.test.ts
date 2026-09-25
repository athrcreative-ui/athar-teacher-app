import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateUnitProgress,
  getCompletedLessonIds,
  isLessonFinished,
  setLessonFinished,
  toggleLessonFinished,
} from '../src/lib/progress';

describe('حساب تقدم ونسبة إنجاز الوحدة (Unit Completion Percentage)', () => {
  it('تحسب النسبة بدقة عند عدم إنجاز أي درس', () => {
    const result = calculateUnitProgress(['lesson-01', 'lesson-02', 'lesson-03', 'lesson-04'], []);
    expect(result.completed).toBe(0);
    expect(result.total).toBe(4);
    expect(result.percentage).toBe(0);
    expect(result.isFullyCompleted).toBe(false);
  });

  it('تحسب النسبة بدقة عند إنجاز جزء من الدروس', () => {
    const result = calculateUnitProgress(
      ['lesson-01', 'lesson-02', 'lesson-03', 'lesson-04'],
      ['lesson-01', 'lesson-03'],
    );
    expect(result.completed).toBe(2);
    expect(result.total).toBe(4);
    expect(result.percentage).toBe(50);
    expect(result.isFullyCompleted).toBe(false);
  });

  it('تقرب النسبة المئوية لأقرب رقم صحيح', () => {
    const result = calculateUnitProgress(
      ['lesson-01', 'lesson-02', 'lesson-03'],
      ['lesson-01', 'lesson-02'],
    );
    expect(result.completed).toBe(2);
    expect(result.total).toBe(3);
    expect(result.percentage).toBe(67);
    expect(result.isFullyCompleted).toBe(false);
  });

  it('تحدد الوحدة كمكتملة بالكامل عند إنجاز كافة دروسها بنسبة 100%', () => {
    const result = calculateUnitProgress(
      ['lesson-01', 'lesson-02'],
      ['lesson-01', 'lesson-02'],
    );
    expect(result.completed).toBe(2);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(100);
    expect(result.isFullyCompleted).toBe(true);
  });

  it('تتعامل مع الوحدات الفارغة دون أخطاء', () => {
    const result = calculateUnitProgress([], ['lesson-01']);
    expect(result.completed).toBe(0);
    expect(result.total).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.isFullyCompleted).toBe(false);
  });
});

describe('تخزين وإدارة حالة الدروس المكتملة', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('تسمح بتبديل حالة إكمال الدرس وإلغائها', () => {
    expect(isLessonFinished('lesson-test-1')).toBe(false);

    const afterFirstToggle = toggleLessonFinished('lesson-test-1');
    expect(afterFirstToggle).toBe(true);
    expect(isLessonFinished('lesson-test-1')).toBe(true);
    expect(getCompletedLessonIds()).toContain('lesson-test-1');

    const afterSecondToggle = toggleLessonFinished('lesson-test-1');
    expect(afterSecondToggle).toBe(false);
    expect(isLessonFinished('lesson-test-1')).toBe(false);
    expect(getCompletedLessonIds()).not.toContain('lesson-test-1');
  });

  it('تسمح بضبط حالة الإكمال صراحة', () => {
    setLessonFinished('lesson-test-2', true);
    expect(isLessonFinished('lesson-test-2')).toBe(true);

    setLessonFinished('lesson-test-2', true); // Idempotent
    expect(isLessonFinished('lesson-test-2')).toBe(true);

    setLessonFinished('lesson-test-2', false);
    expect(isLessonFinished('lesson-test-2')).toBe(false);
  });
});
