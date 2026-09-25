import { useEffect, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'athar_finished_lessons';
const TIMESTAMPS_KEY = 'athar_lesson_completion_timestamps';
const CHANGE_EVENT = 'athar-lesson-progress-change';

let memoryFallback: string[] = [];
let timestampsMemoryFallback: Record<string, string> = {};

export function getLessonCompletionTimestamps(): Record<string, string> {
  if (typeof window === 'undefined') return timestampsMemoryFallback;
  try {
    const raw = window.localStorage.getItem(TIMESTAMPS_KEY);
    if (!raw) return timestampsMemoryFallback;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : timestampsMemoryFallback;
  } catch {
    return timestampsMemoryFallback;
  }
}

export function saveLessonCompletionTimestamp(lessonId: string, isoDate?: string): void {
  const dateStr = isoDate || new Date().toISOString().split('T')[0];
  timestampsMemoryFallback[lessonId] = dateStr;
  if (typeof window === 'undefined') return;

  try {
    const current = getLessonCompletionTimestamps();
    current[lessonId] = dateStr;
    window.localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage might be unavailable
  }
}

export function removeLessonCompletionTimestamp(lessonId: string): void {
  delete timestampsMemoryFallback[lessonId];
  if (typeof window === 'undefined') return;

  try {
    const current = getLessonCompletionTimestamps();
    delete current[lessonId];
    window.localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(current));
  } catch {
    // LocalStorage might be unavailable
  }
}

export function getCompletedLessonIds(): string[] {
  if (typeof window === 'undefined') return memoryFallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return memoryFallback;
  }
}

function saveCompletedLessonIds(ids: string[]): void {
  const unique = Array.from(new Set(ids));
  memoryFallback = unique;
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  } catch {
    // LocalStorage might be full or disabled, fallback kept in memoryFallback
  }

  try {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: unique }));
  } catch {
    // Ignore in non-browser environments
  }
}

export function isLessonFinished(lessonId: string): boolean {
  return getCompletedLessonIds().includes(lessonId);
}

export function setLessonFinished(lessonId: string, finished: boolean): void {
  const current = getCompletedLessonIds();
  const exists = current.includes(lessonId);

  if (finished && !exists) {
    saveLessonCompletionTimestamp(lessonId);
    saveCompletedLessonIds([...current, lessonId]);
  } else if (!finished && exists) {
    removeLessonCompletionTimestamp(lessonId);
    saveCompletedLessonIds(current.filter((id) => id !== lessonId));
  }
}

export function toggleLessonFinished(lessonId: string): boolean {
  const current = getCompletedLessonIds();
  const exists = current.includes(lessonId);
  const nextState = !exists;

  if (nextState) {
    saveLessonCompletionTimestamp(lessonId);
    saveCompletedLessonIds([...current, lessonId]);
  } else {
    removeLessonCompletionTimestamp(lessonId);
    saveCompletedLessonIds(current.filter((id) => id !== lessonId));
  }

  return nextState;
}

export interface UnitProgress {
  completed: number;
  total: number;
  percentage: number;
  isFullyCompleted: boolean;
}

export interface DailyProgressPoint {
  date: string;
  dayLabel: string;
  shortDate: string;
  completedDaily: number;
  cumulativeCompleted: number;
}

export function getThemeLast7DaysProgress(
  themeLessonIds: string[],
  completedIds: string[] = getCompletedLessonIds(),
): DailyProgressPoint[] {
  const completedSet = new Set(completedIds);
  const finishedThemeLessons = themeLessonIds.filter((id) => completedSet.has(id));
  const timestamps = getLessonCompletionTimestamps();
  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const today = new Date();
  const points: DailyProgressPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'اليوم' : arabicDays[d.getDay()];
    const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;

    const completedOnThisDay = finishedThemeLessons.filter((id) => {
      const ts = timestamps[id];
      if (ts) {
        return ts === dateStr;
      }
      return i === 0;
    }).length;

    const cumulativeCompleted = finishedThemeLessons.filter((id) => {
      const ts = timestamps[id];
      if (ts) {
        return ts <= dateStr;
      }
      return i === 0;
    }).length;

    points.push({
      date: dateStr,
      dayLabel,
      shortDate,
      completedDaily: completedOnThisDay,
      cumulativeCompleted,
    });
  }

  return points;
}

export type StudentCohort = 'all' | 'top' | 'support';

export function getCohortLast7DaysProgress(
  themeLessonIds: string[],
  cohort: StudentCohort = 'all',
  completedIds?: string[],
): DailyProgressPoint[] {
  if (cohort === 'all') {
    return getThemeLast7DaysProgress(themeLessonIds, completedIds);
  }

  const total = themeLessonIds.length;
  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = new Date();
  const points: DailyProgressPoint[] = [];

  const targetCompleted =
    cohort === 'top'
      ? Math.min(total, Math.max(2, Math.round(total * 0.88)))
      : Math.max(1, Math.round(total * 0.22));

  // Realistic cumulative accumulation curves over 7 days
  const fractions =
    cohort === 'top'
      ? [0.35, 0.45, 0.58, 0.70, 0.80, 0.90, 1.0]
      : [0.15, 0.15, 0.35, 0.45, 0.65, 0.75, 1.0];

  let prevCumulative = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'اليوم' : arabicDays[d.getDay()];
    const shortDate = `${d.getDate()}/${d.getMonth() + 1}`;

    const stepIndex = 6 - i;
    const cumulative = Math.min(
      targetCompleted,
      Math.max(1, Math.round(targetCompleted * fractions[stepIndex])),
    );
    const daily = Math.max(0, cumulative - prevCumulative);
    prevCumulative = cumulative;

    points.push({
      date: dateStr,
      dayLabel,
      shortDate,
      completedDaily: daily,
      cumulativeCompleted: cumulative,
    });
  }

  return points;
}

export function calculateUnitProgress(
  lessonIds: string[],
  completedIds: string[] | Set<string> = getCompletedLessonIds(),
): UnitProgress {
  const total = lessonIds.length;
  if (total === 0) {
    return {
      completed: 0,
      total: 0,
      percentage: 0,
      isFullyCompleted: false,
    };
  }

  const completedSet = completedIds instanceof Set ? completedIds : new Set(completedIds);
  const completed = lessonIds.filter((id) => completedSet.has(id)).length;
  const percentage = Math.round((completed / total) * 100);

  return {
    completed,
    total,
    percentage,
    isFullyCompleted: completed === total && total > 0,
  };
}

// Store subscription for useSyncExternalStore
let cachedIds: string[] = getCompletedLessonIds();
let cachedIdsString: string = JSON.stringify(cachedIds);

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    const next = getCompletedLessonIds();
    const nextString = JSON.stringify(next);
    if (nextString !== cachedIdsString) {
      cachedIds = next;
      cachedIdsString = nextString;
    }
    // Notify every subscriber; another subscription may already have updated the shared cache.
    callback();
  };

  window.addEventListener(CHANGE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(CHANGE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

function getSnapshot(): string[] {
  const next = getCompletedLessonIds();
  const nextString = JSON.stringify(next);
  if (nextString !== cachedIdsString) {
    cachedIds = next;
    cachedIdsString = nextString;
  }
  return cachedIds;
}

export function useLessonProgress() {
  const completedLessonIds = useSyncExternalStore(subscribe, getSnapshot, () => memoryFallback);
  const completedSet = new Set(completedLessonIds);

  const checkIsFinished = (lessonId: string) => completedSet.has(lessonId);

  const toggle = (lessonId: string) => toggleLessonFinished(lessonId);

  const setFinished = (lessonId: string, finished: boolean) => setLessonFinished(lessonId, finished);

  const getUnitProgress = (lessonIds: string[]) => calculateUnitProgress(lessonIds, completedSet);

  return {
    completedLessonIds,
    isLessonFinished: checkIsFinished,
    toggleLessonFinished: toggle,
    setLessonFinished: setFinished,
    getUnitProgress,
  };
}
