import { useId, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import { UnitAchievementBadge } from '../components/LearningBadges';
import { Prep1SectionCheckBtn } from '../components/Prep1SectionCheckBtn';
import {
  getUnitTheme,
  sectionTypeColors,
  sectionTypeIcons,
  type CurriculumSectionType,
} from '../data/curriculum-units-index';
import { findUnit } from '../lib/content';
import { useLessonProgress } from '../lib/progress';
import { NotFoundPage } from './NotFoundPage';

export function UnitPage() {
  const { levelId = '', subjectId = '', unitId = '' } = useParams();
  const context = findUnit(levelId, subjectId, unitId);
  const { getUnitProgress, isLessonFinished, toggleLessonFinished } = useLessonProgress();
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const searchInputId = useId();

  if (!context) return <NotFoundPage />;

  const { level, subject, unit } = context;
  const unitLessonIds = unit.lessons.map((l) => l.id);
  const progress = getUnitProgress(unitLessonIds);

  const unitTheme = useMemo(
    () =>
      getUnitTheme(
        unit.id,
        level.title,
        subject.title,
        unit.title,
        unit.lessons,
      ),
    [unit.id, level.title, subject.title, unit.title, unit.lessons],
  );

  // Map of all items for fast lookup by lesson ID (to enrich flat view)
  const itemsById = useMemo(() => {
    const map = new Map<string, { type: CurriculumSectionType; typeLabel: string; pageNumber?: number; description?: string }>();
    if (unitTheme.diagnostic) {
      map.set(unitTheme.diagnostic.id, unitTheme.diagnostic);
    }
    unitTheme.topics.forEach((t) => {
      t.items.forEach((it) => {
        map.set(it.id, it);
      });
    });
    return map;
  }, [unitTheme]);

  // Total count of internal sections in this unit
  const totalSectionsCount = useMemo(() => {
    let count = 0;
    if (unitTheme.diagnostic) count++;
    unitTheme.topics.forEach((t) => {
      count += t.items.length;
    });
    return count > 0 ? count : unit.lessons.length;
  }, [unitTheme, unit.lessons.length]);

  // Available section types in this unit for quick filters
  const availableSectionTypes = useMemo(() => {
    const set = new Map<string, string>();
    if (unitTheme.diagnostic) {
      set.set(unitTheme.diagnostic.type, unitTheme.diagnostic.typeLabel);
    }
    unitTheme.topics.forEach((t) => {
      t.items.forEach((it) => {
        if (!set.has(it.type)) {
          set.set(it.type, it.typeLabel);
        }
      });
    });
    return Array.from(set.entries()).map(([type, label]) => ({ type, label }));
  }, [unitTheme]);

  // Filter topics and items based on search and type filter
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return unitTheme.topics
      .map((topic) => {
        const matchesTopic =
          topic.title.toLowerCase().includes(query) ||
          topic.number.toLowerCase().includes(query);

        const filteredItems = topic.items.filter((item) => {
          const matchesType = selectedType === 'all' || item.type === selectedType;
          if (!matchesType) return false;

          if (!query) return true;

          return (
            matchesTopic ||
            item.title.toLowerCase().includes(query) ||
            item.typeLabel.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
          );
        });

        return {
          ...topic,
          items: filteredItems,
        };
      })
      .filter((topic) => topic.items.length > 0);
  }, [unitTheme.topics, searchQuery, selectedType]);

  // Check if diagnostic strip matches filters
  const showDiagnostic = useMemo(() => {
    if (!unitTheme.diagnostic) return false;
    const diag = unitTheme.diagnostic;
    const matchesType = selectedType === 'all' || diag.type === selectedType;
    if (!matchesType) return false;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      diag.title.toLowerCase().includes(query) ||
      diag.typeLabel.toLowerCase().includes(query) ||
      (diag.description && diag.description.toLowerCase().includes(query))
    );
  }, [unitTheme.diagnostic, searchQuery, selectedType]);

  // Filtered lessons for flat view
  const filteredFlatLessons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return unit.lessons.filter((lesson) => {
      const meta = itemsById.get(lesson.id);
      const matchesType = selectedType === 'all' || (meta && meta.type === selectedType);
      if (!matchesType) return false;

      if (!query) return true;

      return (
        lesson.title.toLowerCase().includes(query) ||
        (meta && meta.typeLabel.toLowerCase().includes(query)) ||
        (meta?.description && meta.description.toLowerCase().includes(query))
      );
    });
  }, [unit.lessons, itemsById, searchQuery, selectedType]);

  return (
    <section className="page-section unit-page">
      <div className="container narrow-container">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/' },
            { label: 'المناهج', to: '/curriculum' },
            { label: level.title, to: '/curriculum' },
            { label: subject.title, to: '/curriculum' },
            { label: unit.title },
          ]}
        />

        {/* Textbook Banner tailored to this unit and stage */}
        <article
          className="prep1-index-card"
          style={{ marginTop: '1rem', marginBottom: '1.75rem' }}
        >
          <div
            className="prep1-index-banner"
            style={{ background: unitTheme.bannerGradient }}
          >
            <div className="prep1-index-banner__top">
              <div className="prep1-index-title-group">
                <span className="prep1-index-icon-box" aria-hidden="true">
                  {unitTheme.iconSymbol}
                </span>
                <div>
                  <div className="prep1-index-badge-official">
                    <Icon name="check-circle" />
                    <span>{unitTheme.stageBadge} · الفصل الدراسي الأول</span>
                  </div>
                  <h1 id="page-title" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.35rem 0 0', color: '#ffffff' }} tabIndex={-1}>
                    {unit.title}
                  </h1>
                  <UnitAchievementBadge completed={progress.isFullyCompleted} unitTitle={unit.title} />
                </div>
              </div>

              {unit.lessons.length > 0 && (
                <div
                  className="prep1-index-stats"
                  style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>الدروس</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{unit.lessons.length}</div>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.25)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>الأقسام الداخلية</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{totalSectionsCount}</div>
                  </div>
                  <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.25)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>الإنجاز</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{progress.percentage}%</div>
                  </div>
                </div>
              )}
            </div>

            {unit.description && (
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.95rem' }}>
                {unit.description}
              </p>
            )}

            {/* Progress Bar inside unit header */}
            {unit.lessons.length > 0 && (
              <div style={{ marginTop: '0.25rem' }}>
                <div
                  aria-label={`نسبة إنجاز الوحدة ${progress.percentage}%`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={progress.percentage}
                  className="unit-progress-track"
                  role="progressbar"
                  style={{ background: 'rgba(0, 0, 0, 0.25)', height: '10px' }}
                >
                  <div
                    className={`unit-progress-fill ${progress.isFullyCompleted ? 'is-completed' : ''}`}
                    style={{
                      width: `${progress.percentage}%`,
                      background: progress.isFullyCompleted ? '#4ade80' : '#38bdf8',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', marginTop: '0.35rem' }}>
                  <span>{progress.completed} من {progress.total} دروس مكتملة</span>
                  {progress.isFullyCompleted && <span>مكتملة بالكامل ✨</span>}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Index Controls Toolbar: Search, Filters, and View Switcher */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Search Input within this unit */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 280px',
                maxWidth: '450px',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted-text)',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Icon name="search" />
              </span>
              <input
                id={searchInputId}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث داخل موضوعات وأقسام هذه الوحدة..."
                aria-label="ابحث داخل موضوعات وأقسام هذه الوحدة"
                style={{
                  width: '100%',
                  padding: '0.55rem 2.6rem 0.55rem 1rem',
                  borderRadius: '0.65rem',
                  border: '1px solid var(--border)',
                  background: 'var(--color-warm-surface, #f8fafc)',
                  fontSize: '0.9rem',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="مسح نص البحث"
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted-text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Icon name="close" />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-text)', fontWeight: 600 }}>
                طريقة العرض:
              </span>
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`secondary-button${viewMode === 'grouped' ? ' is-active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  background: viewMode === 'grouped' ? 'var(--text)' : undefined,
                  color: viewMode === 'grouped' ? 'var(--surface)' : undefined,
                }}
              >
                <Icon name="layers" />
                <span>تقسيم الموضوعات</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('flat')}
                className={`secondary-button${viewMode === 'flat' ? ' is-active' : ''}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.85rem',
                  background: viewMode === 'flat' ? 'var(--text)' : undefined,
                  color: viewMode === 'flat' ? 'var(--surface)' : undefined,
                }}
              >
                <Icon name="file" />
                <span>قائمة متتابعة</span>
              </button>
            </div>
          </div>

          {/* Section Type Filter Chips (if multiple types available) */}
          {availableSectionTypes.length > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.4rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.825rem', color: 'var(--muted-text)', fontWeight: 700 }}>
                تصفية حسب القسم:
              </span>
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`curriculum-keyword-chip${selectedType === 'all' ? ' is-active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.2rem 0.65rem' }}
              >
                <span>جميع الأقسام ({totalSectionsCount})</span>
              </button>
              {availableSectionTypes.map(({ type, label }) => {
                const isActive = selectedType === type;
                const colors = sectionTypeColors[type as CurriculumSectionType] || {
                  bg: '#f1f5f9',
                  text: '#334155',
                  border: '#cbd5e1',
                };

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(isActive ? 'all' : type)}
                    className={`curriculum-keyword-chip${isActive ? ' is-active' : ''}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.65rem',
                      borderColor: isActive ? undefined : colors.border,
                    }}
                  >
                    <span>{label}</span>
                    {isActive && <Icon name="close" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Grouped Thematic Index View */}
        {viewMode === 'grouped' ? (
          <div className="prep1-unit-grouped-experience" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Diagnostic assessment strip if available */}
            {showDiagnostic && unitTheme.diagnostic && (
              <div
                className="prep1-diagnostic-strip"
                style={{ borderRadius: '0.85rem', border: '1px solid #fde68a' }}
              >
                <div className="prep1-diagnostic-strip__info">
                  <span className="prep1-diagnostic-strip__badge">
                    <Icon name={sectionTypeIcons[unitTheme.diagnostic.type] || 'clipboard'} />{' '}
                    {unitTheme.diagnostic.typeLabel}
                  </span>
                  <strong>{unitTheme.diagnostic.title}</strong>
                  {unitTheme.diagnostic.pageNumber && (
                    <span className="page-num">ص {unitTheme.diagnostic.pageNumber}</span>
                  )}
                  {unitTheme.diagnostic.description && (
                    <span style={{ fontSize: '0.825rem', color: '#92400e', marginRight: '0.5rem' }}>
                      — {unitTheme.diagnostic.description}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Prep1SectionCheckBtn
                    isFinished={isLessonFinished(unitTheme.diagnostic.id)}
                    onToggle={() => toggleLessonFinished(unitTheme.diagnostic!.id)}
                    ariaLabel={`تحديد ${unitTheme.diagnostic.title} كمكتمل`}
                    finishedText="مكتمل"
                    unfinishedText="تحديد كمكتمل"
                  />
                  <Link to={`/lessons/${unitTheme.diagnostic.id}`}>
                    <span>افتح الدرس</span>
                    <Icon name="arrow-left" />
                  </Link>
                </div>
              </div>
            )}

            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, topicIdx) => (
                <section
                  key={topic.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Topic Header with Badge and Count */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      background: topicIdx % 2 === 0 ? 'var(--color-warm-surface, #f8fafc)' : 'var(--surface)',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.7rem',
                          borderRadius: '0.5rem',
                          background: 'var(--text)',
                          color: 'var(--surface)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {topic.number}
                      </span>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{topic.title}</h2>
                    </div>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--muted-text)',
                        background: 'var(--surface)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '0.45rem',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {topic.items.length} {topic.items.length === 1 ? 'قسم داخلي' : 'أقسام داخلية'}
                    </span>
                  </div>

                  {/* Internal Sections / Lessons list */}
                  <div className="lesson-list" style={{ padding: '0.75rem' }}>
                    {topic.items.map((item, index) => {
                      const finished = isLessonFinished(item.id);
                      const colors = sectionTypeColors[item.type] || {
                        bg: '#f1f5f9',
                        text: '#334155',
                        border: '#cbd5e1',
                      };
                      const iconName = sectionTypeIcons[item.type] || 'book';

                      return (
                        <div className={`lesson-card-wrapper${finished ? ' is-finished' : ''}`} key={item.id}>
                          <Link className={`lesson-card${finished ? ' lesson-card--finished' : ''}`} to={`/lessons/${item.id}`}>
                            <span className={`lesson-card__number${finished ? ' is-finished' : ''}`}>
                              {finished ? <Icon name="check" /> : index + 1}
                            </span>
                            <span className="lesson-card__content">
                              <small className="lesson-card__kicker">
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    background: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '0.4rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  <Icon name={iconName} />
                                  <span>{item.typeLabel}</span>
                                </span>
                                {item.pageNumber && (
                                  <span style={{ color: 'var(--muted-text)', marginRight: '0.35rem' }}>
                                    (ص {item.pageNumber})
                                  </span>
                                )}
                                {finished && (
                                  <span className="lesson-finished-badge">
                                    <Icon name="check" /> مكتمل
                                  </span>
                                )}
                              </small>
                              <strong>{item.title}</strong>
                              {item.description && (
                                <span style={{ fontSize: '0.825rem', color: 'var(--muted-text)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                                  {item.description}
                                </span>
                              )}
                            </span>
                            <span className="lesson-card__action">
                              افتح الدرس <Icon name="arrow-left" />
                            </span>
                          </Link>

                          <button
                            aria-label={finished ? `إلغاء تعليم «${item.title}» كمكتمل` : `تعليم «${item.title}» كمكتمل`}
                            className={`lesson-check-toggle${finished ? ' is-active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleLessonFinished(item.id);
                            }}
                            title={finished ? 'انقر لإلغاء الإكمال' : 'انقر لتعليم الدرس كمكتمل'}
                            type="button"
                          >
                            <Icon name={finished ? 'check-circle' : 'check'} />
                            <span>{finished ? 'مكتمل' : 'تحديد كمكتمل'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              <div className="large-empty-state" style={{ padding: '3rem 1.5rem' }}>
                <Icon name="search" />
                <h3>لا توجد نتائج تطابق بحثك</h3>
                <p>جرّب تغيير كلمات البحث أو اختيار «جميع الأقسام».</p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                >
                  إعادة ضبط البحث
                </button>
              </div>
            )}
          </div>
        ) : filteredFlatLessons.length ? (
          /* Flat Sequential List View with enriched badges */
          <div className="lesson-list">
            {filteredFlatLessons.map((lesson, index) => {
              const finished = isLessonFinished(lesson.id);
              const meta = itemsById.get(lesson.id);
              const colors = meta?.type ? sectionTypeColors[meta.type] : undefined;
              const iconName = meta?.type ? sectionTypeIcons[meta.type] : 'book';

              return (
                <div className={`lesson-card-wrapper${finished ? ' is-finished' : ''}`} key={lesson.id}>
                  <Link className={`lesson-card${finished ? ' lesson-card--finished' : ''}`} to={`/lessons/${lesson.id}`}>
                    <span className={`lesson-card__number${finished ? ' is-finished' : ''}`}>
                      {finished ? <Icon name="check" /> : index + 1}
                    </span>
                    <span className="lesson-card__content">
                      <small className="lesson-card__kicker">
                        {meta && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: colors?.bg || '#f1f5f9',
                              color: colors?.text || '#334155',
                              border: `1px solid ${colors?.border || '#cbd5e1'}`,
                              padding: '0.1rem 0.45rem',
                              borderRadius: '0.35rem',
                              fontWeight: 700,
                            }}
                          >
                            <Icon name={iconName} />
                            <span>{meta.typeLabel}</span>
                          </span>
                        )}
                        {meta?.pageNumber && (
                          <span style={{ color: 'var(--muted-text)', marginRight: '0.35rem' }}>
                            (ص {meta.pageNumber})
                          </span>
                        )}
                        {finished && (
                          <span className="lesson-finished-badge">
                            <Icon name="check" /> مكتمل
                          </span>
                        )}
                      </small>
                      <strong>{lesson.title}</strong>
                      {meta?.description && (
                        <span style={{ fontSize: '0.825rem', color: 'var(--muted-text)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                          {meta.description}
                        </span>
                      )}
                    </span>
                    <span className="lesson-card__action">
                      افتح الدرس <Icon name="arrow-left" />
                    </span>
                  </Link>

                  <button
                    aria-label={finished ? `إلغاء تعليم «${lesson.title}» كمكتمل` : `تعليم «${lesson.title}» كمكتمل`}
                    className={`lesson-check-toggle${finished ? ' is-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleLessonFinished(lesson.id);
                    }}
                    title={finished ? 'انقر لإلغاء الإكمال' : 'انقر لتعليم الدرس كمكتمل'}
                    type="button"
                  >
                    <Icon name={finished ? 'check-circle' : 'check'} />
                    <span>{finished ? 'مكتمل' : 'تحديد كمكتمل'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="large-empty-state">
            <Icon name="book" />
            <h2>لم تُعثر على دروس مطابقة</h2>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
            >
              عرض جميع الدروس
            </button>
          </div>
        )}
      </div>
    </section>
  );
}