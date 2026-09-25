import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BadgeCollection, BadgeUnlockNotification, UnitAchievementBadge } from '../src/components/LearningBadges';
import { createBadgeNoticeStore, getBadgeSummary, isUnitComplete, LEARNING_BADGES, SEEN_BADGES_KEY, type BadgeUnit } from '../src/lib/badges';
import { curriculum } from '../src/lib/content';
import { setLessonFinished } from '../src/lib/progress';

const fixtureIds = Array.from({ length: 25 }, (_, index) => `test-lesson-${index + 1}`);
const fixtureUnits: BadgeUnit[] = [
  { id: 'a', title: 'الوحدة الأولى', lessonIds: fixtureIds.slice(0, 15) },
  { id: 'b', title: 'الوحدة الثانية', lessonIds: fixtureIds.slice(15) },
];
const realUnits = curriculum.levels.flatMap((level) => level.subjects.flatMap((subject) => subject.units));
const realIds = [...new Set(realUnits.flatMap((unit) => unit.lessons.map((lesson) => lesson.id)))];

beforeEach(() => {
  window.localStorage.clear();
  // Reset the existing progress store's memory fallback as well as its disk state.
  setLessonFinished('badge-test-reset', true);
  setLessonFinished('badge-test-reset', false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('data-driven badge rules', () => {
  it('defines six uniquely identified badges', () => {
    expect(LEARNING_BADGES).toHaveLength(6);
    expect(new Set(LEARNING_BADGES.map((badge) => badge.id)).size).toBe(6);
  });
  it.each([0, 1, 3, 5, 10, 20])('uses actual completion for %i lessons', (count) => {
    const result = getBadgeSummary(fixtureIds.slice(0, count), fixtureUnits);
    expect(result.completedCount).toBe(count);
    result.badges.forEach(({ badge, earned, current, target }) => {
      if (badge.rule.kind === 'lessons') expect(earned).toBe(count >= badge.rule.target);
      expect(current).toBeLessThanOrEqual(target);
    });
  });
  it('ignores duplicates and IDs outside the curriculum', () => {
    expect(getBadgeSummary([fixtureIds[0], fixtureIds[0], 'unknown'], fixtureUnits).completedCount).toBe(1);
  });
  it('requires every lesson in a nonempty unit and revokes when completion is undone', () => {
    const check = (ids: string[]) => getBadgeSummary(ids, fixtureUnits).badges.find((item) => item.badge.id === 'unit-champion')!;
    expect(check(fixtureIds.slice(0, 14)).earned).toBe(false);
    expect(check(fixtureIds.slice(0, 15)).earned).toBe(true);
    expect(check(fixtureIds.slice(0, 14)).earned).toBe(false);
    expect(isUnitComplete([], new Set())).toBe(false);
    expect(isUnitComplete(fixtureUnits[0].lessonIds, new Set(fixtureIds.slice(0, 15)))).toBe(true);
  });
  it('does not mistake rounded percentages or an empty curriculum for completion', () => {
    const ids = Array.from({ length: 201 }, (_, index) => `lesson-${index}`);
    const result = getBadgeSummary(ids.slice(0, 200), [{ id: 'large', title: 'كبيرة', lessonIds: ids }]);
    expect(result.badges.find((item) => item.badge.id === 'unit-champion')!.earned).toBe(false);
    expect(getBadgeSummary([], []).badges.every((item) => !item.earned && !item.achievable)).toBe(true);
  });
  it('marks thresholds exceeding available content as unavailable', () => {
    const result = getBadgeSummary([fixtureIds[0]], [{ id: 'small', title: 'صغيرة', lessonIds: [fixtureIds[0]] }]);
    expect(result.badges.find((item) => item.badge.id === 'achievement-maker')!.achievable).toBe(false);
  });
});

describe('notification history and privacy', () => {
  it.each(['{', '{}', 'null', '42', '[null,12,"unknown"]'])('tolerates invalid history: %s', (raw) => {
    window.localStorage.setItem(SEEN_BADGES_KEY, raw);
    expect(createBadgeNoticeStore().read().size).toBe(0);
  });
  it('persists only valid badge IDs and restores history after reload', () => {
    const store = createBadgeNoticeStore();
    store.remember(['first-lesson', 'first-lesson', 'unknown']);
    expect([...createBadgeNoticeStore().read()]).toEqual(['first-lesson']);
    expect(JSON.parse(window.localStorage.getItem(SEEN_BADGES_KEY)!)).toEqual(['first-lesson']);
  });
  it('retains notification history when storage access or writing fails', () => {
    const disabled = createBadgeNoticeStore(() => { throw new Error('storage disabled'); });
    disabled.remember(['first-lesson']);
    expect(disabled.read().has('first-lesson')).toBe(true);
    const full = createBadgeNoticeStore(() => ({ getItem: () => null, setItem: () => { throw new Error('full'); } }));
    full.remember(['active-learner']);
    expect(full.read().has('active-learner')).toBe(true);
  });
  it('merges existing history from another tab rather than overwriting it', () => {
    const first = createBadgeNoticeStore();
    const second = createBadgeNoticeStore();
    first.remember(['first-lesson']);
    second.remember(['active-learner']);
    expect([...first.read()].sort()).toEqual(['active-learner', 'first-lesson']);
  });
});

describe('achievement UI and progress integration', () => {
  it('renders six readable locked badges with zero progress', () => {
    render(<BadgeCollection />);
    expect(within(screen.getByRole('list', { name: 'شارات التعلم' })).getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getAllByText('لم تحصل عليها بعد')).toHaveLength(6);
    expect(screen.getByText(/ليست درجات اختبار/)).toBeTruthy();
  });
  it('does not award anything for rendering, navigation or opening learning content', () => {
    const view = render(<BadgeUnlockNotification />);
    view.rerender(<BadgeUnlockNotification />);
    expect(screen.queryByRole('complementary', { name: 'إنجاز جديد' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('');
  });
  it('unlocks after marking complete and updates the collection immediately', () => {
    render(<><BadgeCollection /><BadgeUnlockNotification /></>);
    act(() => setLessonFinished(realIds[0], true));
    const toast = screen.getByRole('complementary', { name: 'إنجاز جديد' });
    expect(within(toast).getByText('بداية موفقة')).toBeTruthy();
    expect(screen.getAllByText('تم الحصول عليها').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('status').textContent).toContain('بداية موفقة');
  });
  it('groups milestones in one notification and preserves keyboard focus', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    render(<BadgeUnlockNotification />);
    act(() => realIds.slice(0, 5).forEach((id) => setLessonFinished(id, true)));
    const toast = screen.getByRole('complementary', { name: 'إنجاز جديد' });
    expect(within(toast).getByText('المثابر')).toBeTruthy();
    expect(within(toast).getByText('متعلم نشط')).toBeTruthy();
    expect(document.activeElement).toBe(trigger);
    const close = within(toast).getByRole('button', { name: 'إغلاق إشعار الشارة' });
    close.focus();
    fireEvent.keyDown(close, { key: 'Escape' });
    expect(screen.queryByRole('complementary', { name: 'إنجاز جديد' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
  it('does not replay achievements on reload, StrictMode remount, or undo/redo', () => {
    act(() => setLessonFinished(realIds[0], true));
    const view = render(<StrictMode><BadgeUnlockNotification /></StrictMode>);
    expect(screen.queryByRole('complementary')).toBeNull();
    act(() => setLessonFinished(realIds[0], false));
    act(() => setLessonFinished(realIds[0], true));
    expect(screen.queryByRole('complementary')).toBeNull();
    view.unmount();
    render(<BadgeUnlockNotification />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('removes pending notices and earned state when progress is undone', () => {
    render(<><BadgeCollection /><BadgeUnlockNotification /></>);
    act(() => setLessonFinished(realIds[0], true));
    act(() => setLessonFinished(realIds[0], false));
    expect(screen.queryByRole('complementary')).toBeNull();
    expect(screen.getAllByText('لم تحصل عليها بعد')).toHaveLength(6);
    act(() => setLessonFinished(realIds[0], true));
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('responds to cross-tab progress and does not celebrate an already-seen award', () => {
    render(<><BadgeCollection /><BadgeUnlockNotification /></>);
    act(() => {
      window.localStorage.setItem('athar_finished_lessons', JSON.stringify([realIds[0]]));
      window.localStorage.setItem(SEEN_BADGES_KEY, JSON.stringify(['first-lesson', 'unit-champion']));
      window.dispatchEvent(new StorageEvent('storage', { key: 'athar_finished_lessons' }));
    });
    expect(screen.getAllByText('تم الحصول عليها').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('stays usable when progress storage is malformed or unavailable', () => {
    window.localStorage.setItem('athar_finished_lessons', '{');
    const view = render(<BadgeCollection />);
    expect(screen.getAllByText('لم تحصل عليها بعد')).toHaveLength(6);
    view.unmount();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<><BadgeCollection /><BadgeUnlockNotification /></>);
    act(() => setLessonFinished(realIds[0], true));
    expect(screen.getAllByText('تم الحصول عليها').length).toBeGreaterThanOrEqual(1);
  });
  it('renders the contextual unit badge only for full completion without nested controls', () => {
    const view = render(<UnitAchievementBadge completed={false} unitTitle="وحدة تجريبية" />);
    expect(screen.queryByText('بطل الوحدة')).toBeNull();
    view.rerender(<UnitAchievementBadge completed unitTitle="وحدة تجريبية" />);
    expect(screen.getByLabelText('بطل الوحدة: وحدة تجريبية — اكتملت الوحدة بنجاح')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
