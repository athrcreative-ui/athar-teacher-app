import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfettiBurst } from './ConfettiBurst';
import { D3CircularProgressChart } from './D3CircularProgressChart';
import { Icon } from './Icon';
import { Prep1SectionCheckBtn } from './Prep1SectionCheckBtn';
import { ThemeProgressLineChart } from './ThemeProgressLineChart';
import {
  prep1Themes,
  sectionTypeColors,
  type Prep1Theme,
  type Prep1SectionType,
  type Prep1IndexItem,
} from '../data/prep1-curriculum-index';
import { useLessonProgress, type StudentCohort } from '../lib/progress';

interface Prep1IndexViewerProps {
  initialThemeId?: string;
  defaultExpanded?: boolean;
}

export function Prep1IndexViewer({
  initialThemeId = 'all',
  defaultExpanded = true,
}: Prep1IndexViewerProps) {
  const [activeTab, setActiveTab] = useState<string>(initialThemeId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const searchInputId = useId();
  const { isLessonFinished, toggleLessonFinished, getUnitProgress } = useLessonProgress();

  // All prep1 lesson IDs
  const allPrep1LessonIds = useMemo(() => {
    return prep1Themes.flatMap((theme) => {
      const ids: string[] = [];
      if (theme.diagnostic) ids.push(theme.diagnostic.id);
      theme.topics.forEach((topic) => {
        topic.items.forEach((item) => ids.push(item.id));
      });
      return ids;
    });
  }, []);

  const overallProgress = getUnitProgress(allPrep1LessonIds);

  // Filter themes based on tab and search
  const visibleThemes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return prep1Themes
      .filter((theme) => activeTab === 'all' || theme.id === activeTab)
      .map((theme) => {
        if (!query) return theme;

        const filteredTopics = theme.topics
          .map((topic) => {
            const matchesTopic =
              topic.title.toLowerCase().includes(query) ||
              topic.number.toLowerCase().includes(query);

            const filteredItems = topic.items.filter(
              (item) =>
                matchesTopic ||
                item.title.toLowerCase().includes(query) ||
                item.typeLabel.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query)),
            );

            return {
              ...topic,
              items: filteredItems,
            };
          })
          .filter((topic) => topic.items.length > 0);

        const diagnosticMatches =
          theme.diagnostic &&
          (theme.diagnostic.title.toLowerCase().includes(query) ||
            theme.diagnostic.typeLabel.toLowerCase().includes(query) ||
            (theme.diagnostic.description &&
              theme.diagnostic.description.toLowerCase().includes(query)));

        return {
          ...theme,
          diagnostic: diagnosticMatches || filteredTopics.length > 0 ? theme.diagnostic : undefined,
          topics: filteredTopics,
        };
      })
      .filter((theme) => theme.topics.length > 0 || theme.diagnostic !== undefined);
  }, [activeTab, searchQuery]);

  return (
    <article className="prep1-index-card" aria-labelledby="prep1-index-heading">
      {/* Banner / Header */}
      <div className="prep1-index-banner">
        <div className="prep1-index-banner__top">
          <div className="prep1-index-title-group">
            <span className="prep1-index-icon-box" aria-hidden="true">
              📖
            </span>
            <div>
              <div className="prep1-index-badge-official">
                <Icon name="check-circle" />
                <span>المنهج الجديد المطوّر · الفصل الدراسي الأول</span>
              </div>
              <h2 id="prep1-index-heading">فهرس كتاب اللغة العربية — الصف الأول الإعدادي</h2>
            </div>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <span style={{ display: 'inline-flex', transform: isExpanded ? 'rotate(90deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>
              <Icon name="chevron" />
            </span>
            <span>{isExpanded ? 'طيّ الفهرس' : 'عرض الفهرس بالكامل'}</span>
          </button>
        </div>

        <p>
          فهرس رسمي شامل يعرض المحاور التعليمية والأقسام الداخلية (نصوص الاستماع، القراءة الأدبية،
          النصوص الشعرية، القواعد النحوية والإملائية، التعبير الكتابي والتقييمات التكوينية) بنفس
          تصميم وتقسيم الكتاب المدرسي.
        </p>

        <div className="prep1-index-stats">
          <span className="prep1-index-stat-pill">
            <Icon name="layers" />
            <span>محوران دراسيان (6 موضوعات)</span>
          </span>
          <span className="prep1-index-stat-pill">
            <Icon name="book" />
            <span>{allPrep1LessonIds.length} درسًا وقسمًا داخليًا</span>
          </span>
          <span className="prep1-index-stat-pill">
            <Icon name={overallProgress.isFullyCompleted ? 'check-circle' : 'check'} />
            <span>
              الإنجاز الكلي: {overallProgress.percentage}% ({overallProgress.completed} من{' '}
              {overallProgress.total} مكتمل)
            </span>
          </span>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Controls & Filter Tabs */}
          <div className="prep1-index-controls">
            <div className="prep1-index-tabs" role="tablist" aria-label="تصفية المحاور في الفهرس">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`prep1-index-tab${activeTab === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>كافة المنهج (المحوران)</span>
              </button>

              {prep1Themes.map((theme) => {
                const isActive = activeTab === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`prep1-index-tab prep1-index-tab--${theme.colorScheme}${
                      isActive ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveTab(theme.id)}
                  >
                    <span>
                      {theme.number}: {theme.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Internal Search */}
            <div className="prep1-index-search-box">
              <span className="prep1-index-search-icon" aria-hidden="true">
                <Icon name="search" />
              </span>
              <input
                id={searchInputId}
                type="search"
                className="prep1-index-search-input"
                placeholder="ابحث في الفهرس (نحو، إملاء، زينب، فجر الحضارة...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="البحث داخل فهرس الصف الأول الإعدادي"
              />
            </div>
          </div>

          {/* Themes Render */}
          <div className="prep1-themes-container">
            {visibleThemes.length === 0 ? (
              <div className="prep1-index-empty">
                <Icon name="search" />
                <h4>لا توجد نتائج تطابق «{searchQuery}» في الفهرس</h4>
                <p>جرّب البحث باسم الدرس أو بنوع القسم الداخلي (مثل: نحو، استماع، قراءة، إملاء).</p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSearchQuery('')}
                >
                  مسح البحث
                </button>
              </div>
            ) : (
              visibleThemes.map((theme) => (
                <ThemeBlock
                  key={theme.id}
                  theme={theme}
                  isLessonFinished={isLessonFinished}
                  toggleLessonFinished={toggleLessonFinished}
                />
              ))
            )}
          </div>
        </>
      )}
    </article>
  );
}

interface ThemeBlockProps {
  theme: Prep1Theme;
  isLessonFinished: (id: string) => boolean;
  toggleLessonFinished: (id: string) => void;
}

function ThemeBlock({ theme, isLessonFinished, toggleLessonFinished }: ThemeBlockProps) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [studentFilter, setStudentFilter] = useState<StudentCohort>('all');
  const [celebratingSectionIds, setCelebratingSectionIds] = useState<Record<string, boolean>>({});
  const isEmerald = theme.colorScheme === 'emerald';

  const triggerSectionConfetti = (lessonId: string) => {
    setCelebratingSectionIds((prev) => ({ ...prev, [lessonId]: true }));
    window.setTimeout(() => {
      setCelebratingSectionIds((prev) => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
    }, 850);
  };

  const cancelSectionConfetti = (lessonId: string) => {
    setCelebratingSectionIds((prev) => {
      if (!prev[lessonId]) return prev;
      const next = { ...prev };
      delete next[lessonId];
      return next;
    });
  };

  const allItems = useMemo(() => {
    const list: Prep1IndexItem[] = [];
    if (theme.diagnostic) {
      list.push(theme.diagnostic);
    }
    theme.topics.forEach((t) => {
      list.push(...t.items);
    });
    if (theme.project) {
      list.push(theme.project);
    }
    return list;
  }, [theme]);

  const themeLessonIds = useMemo(() => {
    return allItems.map((item) => item.id);
  }, [allItems]);

  const totalLessons = themeLessonIds.length;
  const completedLessons = useMemo(
    () => themeLessonIds.filter((id) => isLessonFinished(id)).length,
    [themeLessonIds, isLessonFinished],
  );
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const remainingLessons = totalLessons - completedLessons;

  // Estimated completion time calculations (in minutes)
  const lessonTypeTimeMap: Record<string, number> = {
    diagnostic: 25,
    writing: 25,
    grammar: 20,
    spelling: 15,
    reading: 20,
    story: 20,
    poetry: 15,
    rhetoric: 15,
    listening: 15,
    formative: 15,
    project: 30,
  };

  const totalEstimatedMinutes = useMemo(() => {
    return allItems.reduce(
      (sum, item) => sum + (lessonTypeTimeMap[item.type] || 18),
      0,
    );
  }, [allItems]);

  const avgCompletionTimeMinutes =
    totalLessons > 0 ? Math.round(totalEstimatedMinutes / totalLessons) : 18;

  const totalEstimatedHours = (totalEstimatedMinutes / 60).toFixed(1);

  const remainingEstimatedMinutes = useMemo(() => {
    return allItems
      .filter((item) => !isLessonFinished(item.id))
      .reduce((sum, item) => sum + (lessonTypeTimeMap[item.type] || 18), 0);
  }, [allItems, isLessonFinished]);

  const remainingEstimatedHours = (remainingEstimatedMinutes / 60).toFixed(1);

  // Skill / Lesson categories breakdown
  const skillBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    allItems.forEach((item) => {
      const label = item.typeLabel || 'دروس متنوعة';
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }, [allItems]);

  // Cohort-based statistics for the dropdown
  const cohortStats = useMemo(() => {
    if (studentFilter === 'top') {
      const topCompleted = Math.min(totalLessons, Math.max(1, Math.round(totalLessons * 0.88)));
      const topPercentage = totalLessons > 0 ? Math.round((topCompleted / totalLessons) * 100) : 0;
      const topAvgTime = Math.max(10, Math.round(avgCompletionTimeMinutes * 0.7));
      const topRemaining = totalLessons - topCompleted;
      const topHours = ((topCompleted * topAvgTime) / 60).toFixed(1);
      return {
        metaStat1: `${theme.topics.length} موضوعات · شريحة المتفوقين (10 طلاب)`,
        avgTime: topAvgTime,
        metaStat2: `إنجاز أسرع بنسبة 30% · إجمالي الوقت: ~${topHours} ساعة`,
        completedCount: topCompleted,
        percentage: topPercentage,
        metaStat3:
          topRemaining > 0
            ? `معدل إنجاز متميز · متبقي فقط ${topRemaining} دروس`
            : 'أنهى الطلاب المتفوقون جميع الدروس! 🌟',
      };
    }
    if (studentFilter === 'support') {
      const supportCompleted = Math.max(1, Math.round(totalLessons * 0.22));
      const supportPercentage =
        totalLessons > 0 ? Math.round((supportCompleted / totalLessons) * 100) : 0;
      const supportAvgTime = Math.round(avgCompletionTimeMinutes * 1.35);
      const supportRemaining = totalLessons - supportCompleted;
      const remainingHours = ((supportRemaining * supportAvgTime) / 60).toFixed(1);
      return {
        metaStat1: `${theme.topics.length} موضوعات · شريحة الدعم (6 طلاب بحاجة لمتابعة)`,
        avgTime: supportAvgTime,
        metaStat2: 'وتيرة متأنية · يحتاج الطلاب تدريبات إضافية',
        completedCount: supportCompleted,
        percentage: supportPercentage,
        metaStat3: `متبقي ${supportRemaining} درساً بحاجة لدعم وتدخل تدريسي مباشر (~${remainingHours} س)`,
      };
    }
    return {
      metaStat1: `${theme.topics.length} موضوعات رئيسية`,
      avgTime: avgCompletionTimeMinutes,
      metaStat2: `إجمالي وقت المذاكرة: ~${totalEstimatedHours} ساعة`,
      completedCount: completedLessons,
      percentage: completionPercentage,
      metaStat3:
        remainingLessons > 0
          ? `متبقي ~${remainingEstimatedHours} ساعة دراسية`
          : 'اكتملت جميع دروس المحور! 🎉',
    };
  }, [
    studentFilter,
    totalLessons,
    theme.topics.length,
    avgCompletionTimeMinutes,
    totalEstimatedHours,
    completedLessons,
    completionPercentage,
    remainingLessons,
    remainingEstimatedHours,
  ]);

  return (
    <section
      className="prep1-theme-section"
      aria-labelledby={`theme-heading-${theme.id}`}
    >
      {/* Theme Header - Expandable on click */}
      <header
        className={`prep1-theme-header prep1-theme-header--${theme.colorScheme} prep1-theme-header--expandable${
          isSummaryExpanded ? ' is-expanded' : ''
        }`}
        onClick={() => setIsSummaryExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsSummaryExpanded((prev) => !prev);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isSummaryExpanded}
        aria-controls={`theme-summary-dropdown-${theme.id}`}
        title={isSummaryExpanded ? 'انقر لإخفاء إحصائيات المحور' : 'انقر لعرض إحصائيات سريعة عن دروس المحور'}
      >
        <div className="prep1-theme-header__title">
          <span className="prep1-theme-header__tag">{theme.number}</span>
          <h3 id={`theme-heading-${theme.id}`}>{theme.title}</h3>
          <span className="prep1-theme-header__expand-indicator">
            <Icon
              name="chevron"
              className={`prep1-theme-header__chevron ${
                isSummaryExpanded ? 'prep1-theme-header__chevron--expanded' : ''
              }`}
            />
            <span className="prep1-theme-header__expand-text">
              {isSummaryExpanded ? 'إخفاء الإحصائيات' : 'إحصائيات المحور'}
            </span>
          </span>
        </div>

        {/* D3 Circular Progress Chart */}
        <div className="prep1-theme-header__chart">
          <D3CircularProgressChart
            completed={completedLessons}
            total={totalLessons}
            percentage={completionPercentage}
            title={theme.title}
            colorScheme={theme.colorScheme}
          />
        </div>

        <Link
          to={`/curriculum/level-arabic-1-prep/subject-arabic-1-prep/${theme.unitId}`}
          className="prep1-theme-header__action"
          title={`فتح دروس ${theme.number}`}
          onClick={(e) => e.stopPropagation()}
        >
          <span>فتح الوحدة التعليمية</span>
          <Icon name="arrow-left" />
        </Link>
      </header>

      {/* Expandable Summary Statistics Dropdown */}
      {isSummaryExpanded && (
        <div
          id={`theme-summary-dropdown-${theme.id}`}
          className="prep1-theme-dropdown"
          role="region"
          aria-labelledby={`theme-heading-${theme.id}`}
        >
          <div className="prep1-theme-dropdown__header">
            <span className="prep1-theme-dropdown__title">
              <Icon name="brain" /> إحصائيات ومؤشرات دروس {theme.title}
            </span>
            <span className="prep1-theme-dropdown__badge">
              {totalLessons} دروس موزعة على {theme.topics.length} موضوعات
            </span>
          </div>

          {/* Student Cohort Filter Chips */}
          <div
            className="prep1-cohort-filter"
            role="group"
            aria-label="تصفية تقدم الطلاب حسب الفئة"
          >
            <div className="prep1-cohort-filter__header">
              <span className="prep1-cohort-filter__label">
                <Icon name="user" /> عرض تقدم فئات الطلاب:
              </span>
              <span className="prep1-cohort-filter__hint">
                تصفية الإحصائيات والمخطط البياني حسب فئة الأداء
              </span>
            </div>

            <div className="prep1-cohort-filter__chips" role="radiogroup" aria-label="فئات الطلاب">
              <button
                type="button"
                role="radio"
                aria-checked={studentFilter === 'all'}
                className={`prep1-cohort-chip${studentFilter === 'all' ? ' is-active' : ''}`}
                onClick={() => setStudentFilter('all')}
                data-testid="filter-chip-all-students"
                aria-label="All Students (جميع الطلاب)"
              >
                <span className="prep1-cohort-chip__icon">
                  <Icon name="user" />
                </span>
                <span className="prep1-cohort-chip__content">
                  <strong className="prep1-cohort-chip__name">All Students</strong>
                  <span className="prep1-cohort-chip__sub">جميع الطلاب</span>
                </span>
                <span className="prep1-cohort-chip__badge">32 طالباً</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={studentFilter === 'top'}
                className={`prep1-cohort-chip prep1-cohort-chip--top${
                  studentFilter === 'top' ? ' is-active' : ''
                }`}
                onClick={() => setStudentFilter('top')}
                data-testid="filter-chip-top-performers"
                aria-label="Top Performers (الطلاب المتفوقون)"
              >
                <span className="prep1-cohort-chip__icon">
                  <Icon name="star" />
                </span>
                <span className="prep1-cohort-chip__content">
                  <strong className="prep1-cohort-chip__name">Top Performers</strong>
                  <span className="prep1-cohort-chip__sub">الطلاب المتفوقون</span>
                </span>
                <span className="prep1-cohort-chip__badge">10 طلاب</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={studentFilter === 'support'}
                className={`prep1-cohort-chip prep1-cohort-chip--support${
                  studentFilter === 'support' ? ' is-active' : ''
                }`}
                onClick={() => setStudentFilter('support')}
                data-testid="filter-chip-needs-support"
                aria-label="Needs Support (طلاب بحاجة لدعم)"
              >
                <span className="prep1-cohort-chip__icon">
                  <Icon name="flag" />
                </span>
                <span className="prep1-cohort-chip__content">
                  <strong className="prep1-cohort-chip__name">Needs Support</strong>
                  <span className="prep1-cohort-chip__sub">بحاجة لدعم</span>
                </span>
                <span className="prep1-cohort-chip__badge">6 طلاب</span>
              </button>
            </div>
          </div>

          <div className="prep1-stats-grid">
            {/* Stat 1: Total Lessons */}
            <div
              className="prep1-stat-card prep1-stat-card--stagger-1"
              style={{ '--stagger-index': 0 } as React.CSSProperties}
            >
              <div className="prep1-stat-card__icon prep1-stat-card__icon--blue">
                <Icon name="book" />
              </div>
              <div className="prep1-stat-card__body">
                <span className="prep1-stat-card__label">إجمالي عدد الدروس</span>
                <strong className="prep1-stat-card__value">{totalLessons} دروس</strong>
                <span className="prep1-stat-card__meta">{cohortStats.metaStat1}</span>
              </div>
            </div>

            {/* Stat 2: Average Completion Time */}
            <div
              className="prep1-stat-card prep1-stat-card--stagger-2"
              style={{ '--stagger-index': 1 } as React.CSSProperties}
            >
              <div className="prep1-stat-card__icon prep1-stat-card__icon--amber">
                <Icon name="clock" />
              </div>
              <div className="prep1-stat-card__body">
                <span className="prep1-stat-card__label">متوسط وقت إنجاز الدرس</span>
                <strong className="prep1-stat-card__value">{cohortStats.avgTime} دقيقة / درس</strong>
                <span className="prep1-stat-card__meta">{cohortStats.metaStat2}</span>
              </div>
            </div>

            {/* Stat 3: Completion Status */}
            <div
              className="prep1-stat-card prep1-stat-card--stagger-3"
              style={{ '--stagger-index': 2 } as React.CSSProperties}
            >
              <div className="prep1-stat-card__icon prep1-stat-card__icon--emerald">
                <Icon name="check-circle" />
              </div>
              <div className="prep1-stat-card__body">
                <span className="prep1-stat-card__label">نسبة الإنجاز الحالية</span>
                <strong className="prep1-stat-card__value">
                  {cohortStats.completedCount} من {totalLessons} ({cohortStats.percentage}%)
                </strong>
                <span className="prep1-stat-card__meta">{cohortStats.metaStat3}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="prep1-theme-dropdown__breakdown">
            <span className="prep1-breakdown__title">
              <Icon name="layers" /> توزيع المهارات والأنشطة:
            </span>
            <div className="prep1-breakdown__chips">
              {skillBreakdown.map((stat) => (
                <span key={stat.label} className="prep1-breakdown__chip">
                  {stat.label} <strong className="prep1-breakdown__count">{stat.count}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Recharts 7-Day Completion Progress Line Chart */}
          <ThemeProgressLineChart
            themeTitle={theme.title}
            themeLessonIds={themeLessonIds}
            studentCohort={studentFilter}
            colorScheme={theme.colorScheme}
          />
        </div>
      )}

      {/* Diagnostic Assessment Strip */}
      {theme.diagnostic && (
        <div className="prep1-diagnostic-strip">
          <div className="prep1-diagnostic-strip__info">
            <span className="prep1-diagnostic-strip__badge">
              <Icon name="clipboard" /> {theme.diagnostic.typeLabel}
            </span>
            <strong>{theme.diagnostic.title}</strong>
            {theme.diagnostic.pageNumber && (
              <span className="page-num">ص {theme.diagnostic.pageNumber}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Prep1SectionCheckBtn
              isFinished={isLessonFinished(theme.diagnostic.id)}
              onToggle={() => {
                if (!isLessonFinished(theme.diagnostic!.id)) {
                  triggerSectionConfetti(theme.diagnostic!.id);
                } else {
                  cancelSectionConfetti(theme.diagnostic!.id);
                }
                toggleLessonFinished(theme.diagnostic!.id);
              }}
              ariaLabel={`تحديد ${theme.diagnostic.title} كمكتمل`}
              title={isLessonFinished(theme.diagnostic.id) ? 'تم الإنجاز' : 'وضع كـ مكتمل'}
              finishedText="مكتمل"
              unfinishedText="تحديد كمكتمل"
            />
            <Link to={`/lessons/${theme.diagnostic.id}`}>
              <span>ابدأ التقييم</span>
              <Icon name="arrow-left" />
            </Link>
          </div>

          {/* Subtle diagnostic completion progress bar indicator */}
          <div
            className={`prep1-section-progress-bar prep1-diagnostic-progress-bar${isLessonFinished(theme.diagnostic.id) ? ' is-filled' : ''}`}
            role="progressbar"
            aria-valuenow={isLessonFinished(theme.diagnostic.id) ? 100 : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`شريط تقدم إكمال ${theme.diagnostic.title}`}
          >
            <span
              className="prep1-section-progress-bar__fill prep1-section-progress-fill"
              style={{ width: isLessonFinished(theme.diagnostic.id) ? '100%' : '0%' }}
            />
          </div>

          {/* Client-side confetti burst effect when diagnostic is completed */}
          {celebratingSectionIds[theme.diagnostic.id] && (
            <ConfettiBurst
              className="prep1-diagnostic-confetti-burst"
              testId={`diagnostic-confetti-${theme.diagnostic.id}`}
            />
          )}
        </div>
      )}

      {/* Topics Grid */}
      <div className="prep1-topics-grid">
        {theme.topics.map((topic) => (
          <div key={topic.id} className="prep1-topic-card">
            <div
              className={`prep1-topic-card__header prep1-topic-card__header--${theme.colorScheme}`}
            >
              <div className="prep1-topic-card__title-wrap">
                <span
                  className={`prep1-topic-card__badge prep1-topic-card__badge--${theme.colorScheme}`}
                >
                  {topic.number}
                </span>
                <h4>{topic.title}</h4>
              </div>
              <span className="prep1-topic-card__count">
                {topic.items.length} {topic.items.length === 1 ? 'قسم' : 'أقسام'}
              </span>
            </div>

            {/* Internal Sections Table / List */}
            <ul className="prep1-internal-sections">
              {topic.items.map((item, itemIdx) => {
                const finished = isLessonFinished(item.id);
                const isCelebrating = Boolean(celebratingSectionIds[item.id]);
                const colors = sectionTypeColors[item.type] || {
                  bg: '#f1f5f9',
                  text: '#334155',
                  border: '#cbd5e1',
                };

                return (
                  <li
                    key={item.id}
                    className={`prep1-section-item${finished ? ' is-completed' : ''}${isCelebrating ? ' is-celebrating' : ''}`}
                    data-section-id={item.id}
                    data-item-index={itemIdx}
                    style={{
                      '--section-item-index': itemIdx,
                      '--stagger-index': itemIdx,
                      animationDelay: `${itemIdx * 45}ms`,
                    } as React.CSSProperties}
                  >
                    <div className="prep1-section-item__meta">
                      <span
                        className="prep1-section-type-badge"
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {getSectionIcon(item.type)}
                        <span>{item.typeLabel}</span>
                      </span>

                      <div className="prep1-section-item__title-box">
                        <Link
                          to={`/lessons/${item.id}`}
                          className="prep1-section-item__title"
                        >
                          {item.title}
                        </Link>
                        {item.description && (
                          <span className="prep1-section-item__desc" title={item.description}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="prep1-section-item__side">
                      {item.pageNumber && (
                        <span className="prep1-section-page-badge" title="رقم الصفحة في الكتاب">
                          ص {item.pageNumber}
                        </span>
                      )}

                      <Prep1SectionCheckBtn
                        isFinished={finished}
                        onToggle={() => {
                          if (!finished) {
                            triggerSectionConfetti(item.id);
                          } else {
                            cancelSectionConfetti(item.id);
                          }
                          toggleLessonFinished(item.id);
                        }}
                        ariaLabel={
                          finished
                            ? `إلغاء إكمال «${item.title}»`
                            : `تعليم «${item.title}» كمكتمل`
                        }
                        title={finished ? 'تم الإنجاز' : 'وضع كـ مكتمل'}
                        finishedText="مكتمل"
                        unfinishedText="إكمال"
                      />

                      <Link
                        to={`/lessons/${item.id}`}
                        className="prep1-section-open-link"
                        title={`فتح درس «${item.title}»`}
                        aria-label={`فتح درس ${item.title}`}
                      >
                        <Icon name="arrow-left" />
                      </Link>
                    </div>

                    {/* Subtle section completion progress bar indicator */}
                    <div
                      className={`prep1-section-progress-bar${finished ? ' is-filled' : ''}`}
                      role="progressbar"
                      aria-valuenow={finished ? 100 : 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`شريط تقدم إكمال ${item.title}`}
                      data-testid={`section-progress-bar-${item.id}`}
                      data-completed={finished ? 'true' : 'false'}
                    >
                      <span
                        className="prep1-section-progress-bar__fill prep1-section-progress-fill"
                        style={{ width: finished ? '100%' : '0%' }}
                      />
                    </div>

                    {/* Client-side confetti effect when marked as complete in .prep1-section-item */}
                    {isCelebrating && (
                      <ConfettiBurst
                        className="prep1-section-item__confetti prep1-section-confetti-burst"
                        testId={`section-item-confetti-${item.id}`}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function getSectionIcon(type: Prep1SectionType) {
  switch (type) {
    case 'listening':
      return '🎧';
    case 'reading':
      return '📖';
    case 'story':
      return '📚';
    case 'poetry':
      return '✍️';
    case 'rhetoric':
      return '✨';
    case 'grammar':
      return '📐';
    case 'spelling':
      return '✏️';
    case 'writing':
      return '📝';
    case 'formative':
      return '🎯';
    case 'diagnostic':
      return '📋';
    case 'project':
      return '🏆';
    default:
      return '📌';
  }
}
