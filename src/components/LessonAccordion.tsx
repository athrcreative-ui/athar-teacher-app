import { useMemo, useState, type ReactNode } from 'react';
import { getLessonAssistantGuide, getLessonHomeworkAssessment } from '../data/lesson-support';
import { isSafeContentUrl } from '../lib/urls';
import { uiCopy } from '../lib/ui-copy';
import type { LessonContent, Resource } from '../types/content';
import { BookletViewer } from './BookletViewer';
import { GuidedLessonAssistant } from './GuidedLessonAssistant';
import { Icon, type IconName } from './Icon';
import { HomeworkList, ResourceList, SummaryResources, VideoResources } from './ResourceList';

type SectionId = keyof typeof uiCopy.lessonSections;

interface SectionDefinition {
  id: SectionId;
  icon: IconName;
  count: number;
  description: string;
  journey: string;
  theme: string;
  content: ReactNode;
}

const sectionMeta: Record<SectionId, Pick<SectionDefinition, 'description' | 'journey' | 'theme'>> = {
  explanation: {
    description: 'خلاصة مركّزة تساعدك تبدأ بثقة.',
    journey: 'افهم',
    theme: 'focus',
  },
  summary: {
    description: 'حوّل الأفكار إلى صورة مترابطة.',
    journey: 'لخّص',
    theme: 'summary',
  },
  videos: {
    description: 'شاهد الشرح في دقائق واضحة.',
    journey: 'شاهد',
    theme: 'video',
  },
  activities: {
    description: 'تعلّم بالمحاولة واللعب والتجربة.',
    journey: 'طبّق',
    theme: 'activity',
  },
  assessments: {
    description: 'اختبر فهمك خطوة بخطوة.',
    journey: 'اختبر',
    theme: 'quiz',
  },
  booklet: {
    description: 'ملفّك للقراءة والمراجعة الهادئة.',
    journey: 'اقرأ',
    theme: 'booklet',
  },
  presentation: {
    description: 'عرض جاهز للاستكشاف والمشاركة.',
    journey: 'اعرض',
    theme: 'presentation',
  },
  assistant: {
    description: 'مساعدة موجّهة من داخل الدرس.',
    journey: 'اسأل',
    theme: 'assistant',
  },
  homework: {
    description: 'مهمة قصيرة تثبت ما تعلّمته.',
    journey: 'راجع',
    theme: 'homework',
  },
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="empty-state experience-empty">
      <span className="empty-state__icon"><Icon name="sparkle" /></span>
      <p>{message}</p>
    </div>
  );
}

function normalizedFormat(resource: Resource): string {
  return (resource.format ?? '').trim().toLowerCase();
}

function isBooklet(resource: Resource): boolean {
  const format = normalizedFormat(resource);
  return format.includes('booklet') || format.includes('بوكليت');
}

function isPresentation(resource: Resource): boolean {
  const format = normalizedFormat(resource);
  return [
    'presentation',
    'powerpoint',
    'ppt',
    'pptx',
    'بوربوينت',
    'بوربينت',
    'عرض تقديمي',
  ].some((keyword) => format.includes(keyword));
}

export function LessonAccordion({ lesson }: { lesson: LessonContent }) {
  const sections = useMemo<SectionDefinition[]>(() => {
    const explanationCount = Number(Boolean(lesson.explanation.text.trim())) + Number(Boolean(lesson.explanation.audio));
    const summaryCount = Number(Boolean(lesson.summary.text.trim())) + lesson.summary.resources.length;
    const bookletFiles = lesson.files.filter(isBooklet);
    const presentationFiles = lesson.files.filter(isPresentation);
    const assistantGuide = getLessonAssistantGuide(lesson.id, lesson);
    const generatedHomework = getLessonHomeworkAssessment(lesson.id);
    const homeworkItems = generatedHomework && !lesson.homework.some(({ id }) => id === generatedHomework.id)
      ? [...lesson.homework, generatedHomework]
      : lesson.homework;

    return [
      {
        id: 'explanation',
        icon: 'book',
        count: explanationCount,
        ...sectionMeta.explanation,
        content: explanationCount ? (
          <div className="section-stack">
            {lesson.explanation.text.trim() && <p className="preserve-lines lesson-text">{lesson.explanation.text}</p>}
            {lesson.explanation.audio && isSafeContentUrl(lesson.explanation.audio.url) && (
              <div className="audio-card">
                <strong>{lesson.explanation.audio.title}</strong>
                <audio controls preload="metadata" src={lesson.explanation.audio.url}>
                  متصفحك لا يدعم تشغيل الصوت.
                </audio>
                {lesson.explanation.audio.transcript && (
                  <div className="media-transcript">
                    <h3>النص المكتوب للصوت</h3>
                    <p className="preserve-lines">{lesson.explanation.audio.transcript}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : <EmptyState message={uiCopy.empty.explanation} />,
      },
      {
        id: 'summary',
        icon: 'map',
        count: summaryCount,
        ...sectionMeta.summary,
        content: summaryCount ? (
          <div className="section-stack">
            {lesson.summary.text.trim() && <p className="preserve-lines lesson-text">{lesson.summary.text}</p>}
            <SummaryResources resources={lesson.summary.resources} />
          </div>
        ) : <EmptyState message={uiCopy.empty.summary} />,
      },
      {
        id: 'videos',
        icon: 'video',
        count: lesson.videos.length,
        ...sectionMeta.videos,
        content: lesson.videos.length ? <VideoResources resources={lesson.videos} /> : <EmptyState message={uiCopy.empty.videos} />,
      },
      {
        id: 'activities',
        icon: 'game',
        count: lesson.activities.length,
        ...sectionMeta.activities,
        content: lesson.activities.length ? <ResourceList action="افتح النشاط" resources={lesson.activities} /> : <EmptyState message={uiCopy.empty.activities} />,
      },
      {
        id: 'assessments',
        icon: 'brain',
        count: lesson.assessments.length,
        ...sectionMeta.assessments,
        content: lesson.assessments.length ? <ResourceList action="ابدأ التقويم" resources={lesson.assessments} /> : <EmptyState message={uiCopy.empty.assessments} />,
      },
      {
        id: 'booklet',
        icon: 'book',
        count: bookletFiles.length,
        ...sectionMeta.booklet,
        content: bookletFiles.length ? <BookletViewer resources={bookletFiles} /> : <EmptyState message={uiCopy.empty.booklet} />,
      },
      {
        id: 'presentation',
        icon: 'file',
        count: presentationFiles.length,
        ...sectionMeta.presentation,
        content: presentationFiles.length ? <ResourceList action="افتح العرض التقديمي" resources={presentationFiles} /> : <EmptyState message={uiCopy.empty.presentation} />,
      },
      {
        id: 'assistant',
        icon: 'message',
        count: assistantGuide ? 4 : 0,
        ...sectionMeta.assistant,
        content: assistantGuide ? <GuidedLessonAssistant guide={assistantGuide} /> : <EmptyState message={uiCopy.empty.assistant} />,
      },
      {
        id: 'homework',
        icon: 'clipboard',
        count: homeworkItems.length,
        ...sectionMeta.homework,
        content: homeworkItems.length ? <HomeworkList items={homeworkItems} /> : <EmptyState message={uiCopy.empty.homework} />,
      },
    ];
  }, [lesson]);

  const firstWithContent = sections.find(({ count }) => count > 0)?.id ?? 'explanation';
  const [openSection, setOpenSection] = useState<SectionId>(firstWithContent);

  function openSectionAndFocus(id: SectionId) {
    setOpenSection(id);
    window.requestAnimationFrame(() => {
      document.getElementById(`section-panel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <div className="lesson-experience">
      <nav aria-label="محطات الدرس" className="lesson-journey">
        <div className="lesson-journey__intro">
          <span className="lesson-journey__eyebrow">رحلة التعلّم</span>
          <strong>اختر المحطة التي تناسبك الآن</strong>
        </div>
        <ol className="lesson-journey__track">
          {sections.map((section, index) => {
            const active = openSection === section.id;
            return (
              <li className="lesson-journey__item" key={section.id}>
                <a
                  aria-controls={`section-panel-${section.id}`}
                  aria-current={active ? 'step' : undefined}
                  className={`journey-stop${active ? ' is-active' : ''}${section.count > 0 ? ' has-content' : ''}`}
                  href={`#section-panel-${section.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    openSectionAndFocus(section.id);
                  }}
                >
                  <span className="journey-stop__node">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={section.icon} />
                  </span>
                  <span className="journey-stop__copy">
                    <strong>{section.journey}</strong>
                    <small>{section.count > 0 ? 'متاح الآن' : 'قريبًا'}</small>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="lesson-accordion">
      {sections.map((section, sectionIndex) => {
        const open = openSection === section.id;
        const headingId = `section-heading-${section.id}`;
        const panelId = `section-panel-${section.id}`;

        return (
          <section className={`accordion-item experience-card experience-card--${section.theme}${open ? ' is-open' : ''}${section.count === 0 ? ' is-empty' : ''}`} key={section.id}>
            <h2 id={headingId}>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className="accordion-trigger experience-card__trigger"
                onClick={() => openSectionAndFocus(section.id)}
                type="button"
              >
                <span className="experience-card__index">{String(sectionIndex + 1).padStart(2, '0')}</span>
                <span className="accordion-icon experience-card__icon"><Icon name={section.icon} /></span>
                <span className="accordion-title experience-card__heading">
                  <span className="experience-card__eyebrow">{section.journey}</span>
                  <span className="experience-card__title">{uiCopy.lessonSections[section.id]}</span>
                  <span className="experience-card__description">{section.description}</span>
                </span>
                <span className="accordion-meta experience-card__meta">
                  <span className="experience-card__availability">
                    {section.count > 0 ? `${section.count} ${section.count === 1 ? 'مورد' : 'موارد'}` : 'لا يوجد محتوى بعد'}
                  </span>
                  <span className="experience-card__cta">{open ? 'إخفاء القسم' : 'افتح القسم'} <Icon className="accordion-chevron" name="chevron" /></span>
                </span>
              </button>
            </h2>
            {open && (
              <div aria-labelledby={headingId} className="accordion-panel experience-card__panel" id={panelId} role="region">
                {section.content}
              </div>
            )}
          </section>
        );
      })}
      </div>
    </div>
  );
}
