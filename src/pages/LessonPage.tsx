import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon, type IconName } from '../components/Icon';
import { LessonAccordion } from '../components/LessonAccordion';
import { findLessonContext, getLessonNeighbors, loadLesson, unitPath, type LessonLoadResult } from '../lib/content';
import { useLessonProgress } from '../lib/progress';
import { NotFoundPage } from './NotFoundPage';

const learningPath: Array<{ label: string; icon: IconName }> = [
  { label: 'استكشف', icon: 'sparkle' },
  { label: 'افهم', icon: 'book' },
  { label: 'شاهد', icon: 'video' },
  { label: 'طبّق', icon: 'game' },
  { label: 'اختبر', icon: 'brain' },
  { label: 'راجع', icon: 'clipboard' },
];

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const context = findLessonContext(lessonId);
  const [loadResult, setLoadResult] = useState<LessonLoadResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const { isLessonFinished, toggleLessonFinished } = useLessonProgress();

  useEffect(() => {
    let active = true;
    setLoadResult(null);
    loadLesson(lessonId)
      .then((loaded) => {
        if (active) setLoadResult(loaded);
      });
    return () => { active = false; };
  }, [lessonId, attempt]);

  if (!context) return <NotFoundPage />;

  const { level, subject, unit, lesson: lessonReference, lessonIndex } = context;
  const backToUnit = unitPath(level.id, subject.id, unit.id);
  const { previous, next } = getLessonNeighbors(context);
  const finished = isLessonFinished(lessonId);

  return (
    <section className="page-section lesson-page">
      <div className="container narrow-container">
        <Breadcrumbs items={[
          { label: 'الرئيسية', to: '/' },
          { label: 'المناهج', to: '/curriculum' },
          { label: level.title, to: '/curriculum' },
          { label: subject.title, to: '/curriculum' },
          { label: unit.title, to: backToUnit },
          { label: lessonReference.title },
        ]} />

        <header className="lesson-hero">
          <span aria-hidden="true" className="lesson-hero__shape lesson-hero__shape--one" />
          <span aria-hidden="true" className="lesson-hero__shape lesson-hero__shape--two" />
          <span aria-hidden="true" className="lesson-hero__shape lesson-hero__shape--three" />
          <div className="lesson-hero__content">
            <div className="lesson-hero__eyebrow">
              <span className="lesson-hero__index">{String(lessonIndex + 1).padStart(2, '0')}</span>
              <span>الدرس {lessonIndex + 1} من {unit.lessons.length}</span>
              {finished && (
                <span className="lesson-hero__completed-badge">
                  <Icon name="check-circle" /> تم إنجازه
                </span>
              )}
            </div>
            <h1 id="page-title" tabIndex={-1}>{lessonReference.title}</h1>
            <div className="lesson-hero__meta" aria-label="بيانات الدرس">
              <span><Icon name="book" /> {subject.title}</span>
              <span><Icon name="layers" /> {level.title}</span>
              <span><Icon name="map" /> {unit.title}</span>
            </div>
          </div>
          <div className="lesson-hero__actions">
            <button
              aria-pressed={finished}
              className={`lesson-status-btn${finished ? ' is-completed' : ''}`}
              onClick={() => toggleLessonFinished(lessonId)}
              type="button"
            >
              <Icon name={finished ? 'check-circle' : 'check'} />
              <span>{finished ? 'الدرس مكتمل ✓' : 'تحديد كمكتمل'}</span>
            </button>
            <Link className="back-link lesson-hero__back" to={backToUnit}>
              <Icon name="layers" /> العودة إلى الوحدة
            </Link>
          </div>
          <ol aria-label="مسار التعلّم" className="lesson-path">
            {learningPath.map((step, index) => (
              <li className="lesson-path__step" key={step.label}>
                <span className="lesson-path__node">
                  <Icon name={step.icon} />
                  <span>{step.label}</span>
                </span>
                {index < learningPath.length - 1 && <span aria-hidden="true" className="lesson-path__connector" />}
              </li>
            ))}
          </ol>
        </header>

        {!loadResult ? (
          <div aria-live="polite" className="lesson-loading">
            <span />
            <p>جارٍ فتح الدرس…</p>
          </div>
        ) : loadResult.status === 'ready' ? (
          <>
            <LessonAccordion key={loadResult.data.id} lesson={loadResult.data} />

            <div className={`lesson-completion-card${finished ? ' is-completed' : ''}`}>
              <div className="lesson-completion-card__info">
                <span className="lesson-completion-card__icon">
                  <Icon name={finished ? 'check-circle' : 'sparkle'} />
                </span>
                <div>
                  <h3>{finished ? 'أحسنت! هذا الدرس مكتمل' : 'أنهيت مذاكرة هذا الدرس؟'}</h3>
                  <p>
                    {finished
                      ? 'تم تسجيل هذا الدرس ضمن الدروس المنجزة في هذه الوحدة والمنهج الدراسي.'
                      : 'اضغط على الزر لتسجيل إنجازه وحساب نسبته في الوحدة التعليمية.'}
                  </p>
                </div>
              </div>
              <button
                aria-pressed={finished}
                className={`lesson-completion-card__button${finished ? ' is-completed' : ''}`}
                onClick={() => toggleLessonFinished(lessonId)}
                type="button"
              >
                <Icon name={finished ? 'check-circle' : 'check'} />
                <span>{finished ? 'إلغاء الإكمال' : 'تمييز كدرس منجز ✓'}</span>
              </button>
            </div>
          </>
        ) : loadResult.status === 'invalid' ? (
          <div aria-live="polite" className="large-empty-state lesson-error">
            <Icon name="file" />
            <h2>محتوى الدرس غير صالح حاليًا</h2>
            <p>راجع بيانات هذا الدرس أو عُد إلى الوحدة لاختيار درس آخر.</p>
            <Link className="text-link" to={backToUnit}>العودة إلى الوحدة</Link>
          </div>
        ) : loadResult.status === 'error' ? (
          <div aria-live="polite" className="large-empty-state lesson-error">
            <Icon name="file" />
            <h2>تعذر تحميل محتوى الدرس</h2>
            <p>حدث عطل مؤقت أثناء فتح الملف.</p>
            <button className="secondary-button" onClick={() => setAttempt((value) => value + 1)} type="button">أعد المحاولة</button>
          </div>
        ) : (
          <div className="large-empty-state">
            <Icon name="file" />
            <h2>تعذر العثور على محتوى هذا الدرس</h2>
            <Link className="text-link" to={backToUnit}>العودة إلى الوحدة</Link>
          </div>
        )}

        <nav aria-label="التنقل بين الدروس" className="lesson-pagination">
          {previous ? (
            <Link className="pagination-link pagination-link--previous" to={`/lessons/${previous.id}`}>
              <Icon name="arrow-right" />
              <span><small>الدرس السابق</small><strong>{previous.title}</strong></span>
            </Link>
          ) : <span />}
          {next && (
            <Link className="pagination-link pagination-link--next" to={`/lessons/${next.id}`}>
              <span><small>الدرس التالي</small><strong>{next.title}</strong></span>
              <Icon name="arrow-left" />
            </Link>
          )}
        </nav>
      </div>
    </section>
  );
}
