import { useEffect, useMemo, useRef, useState } from 'react';
import { curriculum } from '../lib/content';
import { useLessonProgress } from '../lib/progress';
import { createBadgeNoticeStore, getBadgeSummary, type BadgeProgress, type BadgeUnit } from '../lib/badges';
import { Icon } from './Icon';
import '../styles/learning-badges.css';

const badgeUnits: BadgeUnit[] = curriculum.levels.flatMap((level) =>
  level.subjects.flatMap((subject) => subject.units.map((unit) => ({
    id: unit.id, title: unit.title, lessonIds: unit.lessons.map((lesson) => lesson.id),
  }))),
);

function useBadgeSummary() {
  const { completedLessonIds } = useLessonProgress();
  return useMemo(() => getBadgeSummary(completedLessonIds, badgeUnits), [completedLessonIds]);
}

export function AchievementBadge({ progress }: { progress: BadgeProgress }) {
  const { badge, earned, current, target, achievable, unitTitle } = progress;
  return (
    <li className={`learning-badge${earned ? ' learning-badge--earned' : ''}`}>
      <span className="learning-badge__medallion"><Icon name={badge.icon} /></span>
      <strong>{badge.title}</strong>
      <span className="learning-badge__status">
        {earned && <Icon name="check-circle" />}
        {earned ? 'تم الحصول عليها' : 'لم تحصل عليها بعد'}
      </span>
      <span className="learning-badge__description">{badge.requirement}</span>
      {badge.rule.kind === 'unit' && unitTitle && <small>{unitTitle}</small>}
      {!earned && (
        achievable
          ? <small aria-label={`${current} من ${target} دروس مكتملة`}><bdi>{current} / {target}</bdi> دروس</small>
          : <small>تحتاج إضافة مزيد من المحتوى</small>
      )}
    </li>
  );
}

export function BadgeCollection() {
  const { completedCount, badges } = useBadgeSummary();
  const earnedCount = badges.filter((badge) => badge.earned).length;
  const next = badges.find((badge) => !badge.earned && badge.achievable);
  return (
    <section aria-labelledby="learning-achievements-title" className="learning-achievements-section">
      <div className="container learning-achievements">
        <div className="learning-achievements__heading">
          <div>
            <p className="section-kicker">كل خطوة في التعلم تستحق التقدير</p>
            <h2 id="learning-achievements-title">إنجازاتي</h2>
          </div>
          <p className="learning-achievements__counts">الدروس المنجزة: <strong>{completedCount}</strong> · الشارات: <strong>{earnedCount} / {badges.length}</strong></p>
        </div>
        {next ? (
          <div className="learning-achievements__next">
            <span>الشارة التالية: <strong>{next.badge.title}</strong></span>
            <span>المتبقي: {next.target - next.current} من الدروس{next.badge.rule.kind === 'unit' ? ` في وحدة «${next.unitTitle}»` : ''}.</span>
            <progress aria-label={`التقدم نحو شارة ${next.badge.title}`} max={next.target} value={next.current} />
          </div>
        ) : (
          <p>{earnedCount === badges.length ? 'أحسنت! حصلت على جميع الشارات المتاحة. واصل التعلم والمراجعة.' : 'ابدأ بالدروس المتاحة، وستظهر هنا خطوات تقدمك.'}</p>
        )}
        <ul className="learning-achievements__grid" aria-label="شارات التعلم">
          {badges.map((badge) => <AchievementBadge key={badge.badge.id} progress={badge} />)}
        </ul>
        <p className="learning-achievements__privacy">تعتمد الشارات على الدروس التي تحددها كمكتملة، وليست درجات اختبار. تُحفظ في هذا المتصفح فقط؛ لا تتزامن بين الأجهزة، وحذف بيانات الموقع يمسحها.</p>
      </div>
    </section>
  );
}

/** Non-interactive: safe to place inside an existing linked curriculum card. */
export function UnitAchievementBadge({ completed, unitTitle }: { completed: boolean; unitTitle: string }) {
  if (!completed) return null;
  return (
    <span className="unit-achievement-badge" aria-label={`بطل الوحدة: ${unitTitle} — اكتملت الوحدة بنجاح`}>
      <Icon name="star" /><span>بطل الوحدة</span>
    </span>
  );
}

/** Mount once in AppShell, so completion from either lessons or unit controls is observed. */
export function BadgeUnlockNotification() {
  const summary = useBadgeSummary();
  const [store] = useState(() => createBadgeNoticeStore());
  const previous = useRef<Set<string> | null>(null);
  const [noticeIds, setNoticeIds] = useState<string[]>([]);
  const originFocus = useRef<HTMLElement | null>(null);
  const toastRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const earned = summary.badges.filter((item) => item.earned);
    const current = new Set(earned.map((item) => item.badge.id));
    if (previous.current === null) {
      // Existing achievements appear in the collection without a replay on load.
      previous.current = current;
      store.remember([...current]);
      return;
    }
    const seen = store.read();
    const newlyEarned = earned.filter((item) => !previous.current!.has(item.badge.id) && !seen.has(item.badge.id));
    previous.current = current;
    if (newlyEarned.length) {
      if (!toastRef.current?.contains(document.activeElement)) {
        originFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      store.remember(newlyEarned.map((item) => item.badge.id));
    }
    setNoticeIds((old) => {
      const next = [...new Set([...old.filter((id) => current.has(id)), ...newlyEarned.map((item) => item.badge.id)])];
      return next.length === old.length && next.every((id, index) => id === old[index]) ? old : next;
    });
  }, [summary, store]);

  const notices = summary.badges.filter((item) => item.earned && noticeIds.includes(item.badge.id));
  function dismiss() {
    const restoreFocus = toastRef.current?.contains(document.activeElement);
    setNoticeIds([]);
    if (restoreFocus) {
      const target = originFocus.current;
      if (target?.isConnected && target !== document.body) target.focus();
      else document.querySelector<HTMLElement>('#page-title')?.focus();
    }
  }
  return (
    <>
      <div className="learning-badge-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {notices.length > 0 ? `شارة جديدة! ${notices.map((item) => `${item.badge.title}: ${item.badge.message}`).join(' ')}` : ''}
      </div>
      {notices.length > 0 && (
        <aside className="learning-badge-toast" aria-label="إنجاز جديد" ref={toastRef} onKeyDown={(event) => {
          if (event.key === 'Escape') { event.stopPropagation(); dismiss(); }
        }}>
          <div className="learning-badge-toast__heading">
            <strong><Icon name="sparkle" />{notices.length === 1 ? 'شارة جديدة!' : 'شارات جديدة!'}</strong>
            <button type="button" className="learning-badge-toast__close" aria-label="إغلاق إشعار الشارة" onClick={dismiss}><Icon name="close" /></button>
          </div>
          {notices.map(({ badge, unitTitle }) => (
            <div className="learning-badge-toast__award" key={badge.id}>
              <span className="learning-badge__medallion"><Icon name={badge.icon} /></span>
              <div><strong>{badge.title}</strong><p>{badge.message}</p>{badge.rule.kind === 'unit' && unitTitle && <small>{unitTitle}</small>}</div>
            </div>
          ))}
          <button type="button" className="secondary-button" onClick={dismiss}>واصل التعلّم</button>
        </aside>
      )}
    </>
  );
}
