import { Link } from 'react-router-dom';
import { teacher } from '../lib/content';
import { isSafeContactUrl } from '../lib/urls';
import { BrandImage } from '../components/BrandImage';
import { Icon, type IconName } from '../components/Icon';
import { BadgeCollection } from '../components/LearningBadges';
import { SafeExternalLink } from '../components/SafeExternalLink';

const contactIcons: Record<string, IconName> = {
  email: 'mail',
  whatsapp: 'message',
  facebook: 'external',
};

export function HomePage() {
  const contacts = teacher.contacts.filter(({ url }) => isSafeContactUrl(url));

  return (
    <>
      <section className="hero-section">
        <div className="hero-decoration hero-decoration--one" />
        <div className="hero-decoration hero-decoration--two" />
        <div className="container hero-grid">
          <div className="hero-content">
            {teacher.logo && (
              <div className="hero-brand-mark">
                <BrandImage image={teacher.logo} eager />
                {teacher.brandName && <span>{teacher.brandName}</span>}
              </div>
            )}
            {teacher.tagline && <p className="eyebrow"><Icon name="sparkle" /> {teacher.tagline}</p>}
            <h1 id="page-title" tabIndex={-1}>
              أهلًا بك في <span>{teacher.appName}</span>
            </h1>
            {teacher.name && <p className="teacher-name">مع {teacher.name}</p>}
            {teacher.professionalTitle && <p className="professional-title">{teacher.professionalTitle}</p>}
            {teacher.bio && <p className="hero-bio">{teacher.bio}</p>}
            <div className="hero-actions">
              <Link className="primary-button" to="/curriculum">
                <span>ابدأ التعلّم</span>
                <Icon name="arrow-left" />
              </Link>
            </div>
          </div>
          <div className="portrait-wrap" aria-hidden={!teacher.photo}>
            <div className="portrait-backdrop" />
            {teacher.photo ? (
              <BrandImage className="teacher-portrait" eager fallbackLabel={teacher.name || teacher.appName} image={teacher.photo} />
            ) : (
              <span className="teacher-portrait image-fallback">{(teacher.name || teacher.appName).slice(0, 1)}</span>
            )}
            {teacher.tagline && <div className="portrait-note"><Icon name="sparkle" /> {teacher.tagline}</div>}
          </div>
        </div>
      </section>

      <BadgeCollection />

      <section aria-labelledby="learning-profile-home-title" className="learning-profile-home-section">
        <div className="container">
          <div className="learning-profile-home-card">
            <div className="learning-profile-home-copy">
              <p className="section-kicker">ابدأ بنفسك قبل ما تبدأ المنهج</p>
              <h2 id="learning-profile-home-title">اعرف نمطك التعليمي قبل ما تبدأ مذاكرة</h2>
              <p>
                أجب عن استبيان من 30 سؤالًا، واكتشف بصمة تعلّمك ونقاط قوتك والطرق التي تساعدك على الفهم، ثم احصل على نصائح عملية وخطة 7 أيام تساعدك على تقوية مهاراتك الدراسية.
              </p>
              <div className="learning-profile-home-benefits" aria-label="مميزات الاستبيان">
                <span>🧠 اكتشف نقاط قوتك</span>
                <span>💡 نصائح مناسبة لك</span>
                <span>🎯 خطة لتطوير مهاراتك</span>
              </div>
              <Link className="primary-button" to="/learning-profile">
                <span>ابدأ اكتشاف بصمتك</span>
                <Icon name="arrow-left" />
              </Link>
            </div>
            <div className="learning-profile-home-visual">
              <img
                alt="طالب يكتشف طريقة تعلمه ويخطط لتطوير مهاراته الدراسية"
                loading="lazy"
                src="/assets/learning-profile-hero.svg"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="board-entry-title" className="board-entry-section">
        <div className="container">
          <Link className="board-entry-card" to="/board">
            <div className="board-entry-copy">
              <p className="section-kicker">أداة شرح عملية للمعلم</p>
              <h2 id="board-entry-title">السبورة التعليمية</h2>
              <p>اكتب وارسم وأضف النصوص والأشكال والصور، ثم اعرض الشرح بوضوح في الفصل أو أثناء الشرح أونلاين.</p>
              <span className="board-entry-button">
                <span>افتح السبورة التعليمية</span>
                <Icon name="arrow-left" />
              </span>
            </div>
            <div aria-hidden="true" className="board-entry-preview">
              <div className="board-entry-preview__top"><span /><span /><span /></div>
              <div className="board-entry-preview__canvas">
                <i className="board-entry-preview__line board-entry-preview__line--one" />
                <i className="board-entry-preview__line board-entry-preview__line--two" />
                <i className="board-entry-preview__circle" />
                <i className="board-entry-preview__triangle" />
              </div>
              <div className="board-entry-preview__tools"><b /><b /><b /><b /></div>
            </div>
          </Link>
        </div>
      </section>

      {contacts.length > 0 && (
        <section aria-labelledby="contact-title" className="contact-section">
          <div className="container contact-card">
            <div>
              <p className="section-kicker">للتواصل العام</p>
              <h2 id="contact-title">{teacher.name ? `تواصل مع ${teacher.name}` : 'وسائل التواصل'}</h2>
            </div>
            <div className="contact-links">
              {contacts.map((contact) => (
                <SafeExternalLink href={contact.url} key={contact.id} mode="contact" newTab={contact.url.startsWith('https:')}>
                  <Icon name={contactIcons[contact.id] ?? 'external'} />
                  <span>{contact.label}</span>
                </SafeExternalLink>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
