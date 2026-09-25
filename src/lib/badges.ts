import type { IconName } from '../components/Icon';

export interface BadgeUnit {
  id: string;
  title: string;
  lessonIds: readonly string[];
}

export interface LearningBadge {
  id: string;
  title: string;
  requirement: string;
  message: string;
  icon: IconName;
  rule: { kind: 'lessons'; target: number } | { kind: 'unit' };
}

export const LEARNING_BADGES: readonly LearningBadge[] = [
  { id: 'first-lesson', title: 'بداية موفقة', requirement: 'أكمل أول درس', message: 'أحسنت! أنجزت أول درس وبدأت رحلة التعلم.', icon: 'sparkle', rule: { kind: 'lessons', target: 1 } },
  { id: 'active-learner', title: 'متعلم نشط', requirement: 'أكمل 3 دروس', message: 'رائع! أنجزت 3 دروس وتواصل تقدمك بثبات.', icon: 'book', rule: { kind: 'lessons', target: 3 } },
  { id: 'persistent-learner', title: 'المثابر', requirement: 'أكمل 5 دروس', message: 'الاستمرار يصنع الفرق. لقد أنجزت 5 دروس.', icon: 'flag', rule: { kind: 'lessons', target: 5 } },
  { id: 'steady-progress', title: 'متقدم بثبات', requirement: 'أكمل 10 دروس', message: 'تقدم مميز! وصلت إلى 10 دروس مكتملة.', icon: 'trending-up', rule: { kind: 'lessons', target: 10 } },
  { id: 'unit-champion', title: 'بطل الوحدة', requirement: 'أكمل جميع دروس وحدة واحدة', message: 'ممتاز! أنجزت الوحدة كاملة.', icon: 'star', rule: { kind: 'unit' } },
  { id: 'achievement-maker', title: 'صانع الإنجاز', requirement: 'أكمل 20 درسًا', message: 'إنجاز كبير! وصلت إلى 20 درسًا مكتملًا.', icon: 'compass', rule: { kind: 'lessons', target: 20 } },
];

export interface BadgeProgress {
  badge: LearningBadge;
  earned: boolean;
  achievable: boolean;
  current: number;
  target: number;
  unitTitle?: string;
}

export function isUnitComplete(lessonIds: readonly string[], completedIds: ReadonlySet<string>): boolean {
  return lessonIds.length > 0 && lessonIds.every((id) => completedIds.has(id));
}

/** Self-reported lesson completion only. No clicks, dates, scores or synthetic cohorts. */
export function getBadgeSummary(completedIds: readonly string[], units: readonly BadgeUnit[]) {
  const validIds = new Set(units.flatMap((unit) => [...unit.lessonIds]));
  const completed = new Set(completedIds.filter((id) => validIds.has(id)));
  const unitProgress = units.map((unit) => {
    const ids = [...new Set(unit.lessonIds)];
    return { title: unit.title, current: ids.filter((id) => completed.has(id)).length, target: ids.length };
  }).filter((unit) => unit.target > 0);
  const nearestUnit = unitProgress.reduce<(typeof unitProgress)[number] | undefined>(
    (best, unit) => !best || unit.current / unit.target > best.current / best.target ? unit : best,
    undefined,
  );
  const badges: BadgeProgress[] = LEARNING_BADGES.map((badge) => {
    if (badge.rule.kind === 'lessons') {
      return {
        badge,
        earned: completed.size >= badge.rule.target,
        achievable: validIds.size >= badge.rule.target,
        current: Math.min(completed.size, badge.rule.target),
        target: badge.rule.target,
      };
    }
    return {
      badge,
      earned: Boolean(nearestUnit && nearestUnit.current === nearestUnit.target),
      achievable: Boolean(nearestUnit),
      current: nearestUnit?.current ?? 0,
      target: nearestUnit?.target ?? 1,
      unitTitle: nearestUnit?.title,
    };
  });
  return { completedCount: completed.size, badges };
}

export const SEEN_BADGES_KEY = 'athar_seen_badges_v1';
type NoticeStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** Only notification history is stored; earned badges are always derived from progress. */
export function createBadgeNoticeStore(
  getStorage: () => NoticeStorage | null = () => typeof window === 'undefined' ? null : window.localStorage,
) {
  const memory = new Set<string>();
  const allowed = new Set(LEARNING_BADGES.map((badge) => badge.id));
  function read(): Set<string> {
    try {
      const raw = getStorage()?.getItem(SEEN_BADGES_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        parsed.forEach((id: unknown) => {
          if (typeof id === 'string' && allowed.has(id)) memory.add(id);
        });
      }
    } catch {
      // Disabled, corrupt or full storage must never interrupt learning.
    }
    return new Set(memory);
  }
  function remember(ids: readonly string[]): void {
    read();
    ids.forEach((id) => { if (allowed.has(id)) memory.add(id); });
    try {
      getStorage()?.setItem(SEEN_BADGES_KEY, JSON.stringify([...memory]));
    } catch {
      // The in-memory history still prevents repeated celebrations this session.
    }
  }
  return { read, remember };
}
