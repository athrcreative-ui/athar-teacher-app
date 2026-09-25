import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SafeExternalLink } from '../components/SafeExternalLink';

const whatsappUrl =
  'https://wa.me/201008709358?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D9%83%D9%88%D8%B1%D8%B3%20%D8%A7%D9%84%D9%85%D8%B0%D8%A7%D9%83%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D8%A8%D8%AF%D8%B9%D8%A9%20%D8%A8%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1%20%D8%A7%D9%84%D8%A7%D8%B5%D8%B7%D9%86%D8%A7%D8%B9%D9%8A';

const lectures = [
  {
    title: 'المحاضرة المجانية التعريفية',
    description: 'مدخل عملي لفكرة المذاكرة المبدعة وتوظيف الذكاء الاصطناعي كمعلم خصوصي مساعد للطالب.',
    url: 'https://drive.google.com/file/d/16Q6DA3LaD8-jyxZMjDqiA9WJjzAxJt25/view?usp=drivesdk',
    free: true,
  },
  {
    title: 'المحاضرة الأولى',
    description: 'شرح وتبسيط المحتوى الدراسي بالذكاء الاصطناعي بما يناسب مستوى الطالب ومرحلته.',
    url: 'https://drive.google.com/file/d/1h8Zen7t7V2H1zF_wD5Rc0J9Tx9ErHiuL/view?usp=drivesdk',
    free: false,
  },
  {
    title: 'المحاضرة الثانية',
    description: 'التلخيص والمراجعة وصناعة أسئلة واختبارات متنوعة من نفس محتوى المنهج.',
    url: 'https://drive.google.com/file/d/1tCOj3iDPMdNFDcbTtkRfpU1C08NBgL63/view?usp=drivesdk',
    free: false,
  },
  {
    title: 'المحاضرة الثالثة',
    description: 'التطبيق العملي على الاختبارات والتصحيح والتغذية الراجعة واستخدام AI كمعلم خصوصي.',
    url: 'https://drive.google.com/file/d/1sEVpkkI-0URa8yg-sGUJX2pD8R7oU-eX/view?usp=drivesdk',
    free: false,
  },
];

export function StudentProgramsPage() {
  return (
    <section className="page-section student-programs-page">
      <div className="container">
        <nav aria-label="مسار الصفحة" className="breadcrumbs">
          <ol>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Icon className="breadcrumb-separator" name="chevron" /></li>
            <li aria-current="page">البرامج التدريبية للطلاب</li>
          </ol>
        </nav>

        <div className="page-heading">
          <p className="section-kicker">تعلم عملي للطلاب</p>
          <h1 id="page-title" tabIndex={-1}>البرامج التدريبية للطلاب</h1>
          <p>برامج عملية تساعد الطالب على المذاكرة والفهم والمراجعة بذكاء، مع توظيف أدوات الذكاء الاصطناعي بصورة تعليمية منظمة.</p>
        </div>

        <article className="student-course-hero">
          <div>
            <span className="student-course-badge"><Icon name="sparkle" /> الكورس الأول</span>
            <h2>المذاكرة المبدعة بالذكاء الاصطناعي</h2>
            <p>
              3 محاضرات تدريبية أساسية + محاضرة تعريفية مجانية، لتعلّم كيفية مذاكرة وتبسيط أي محتوى دراسي مهما كان التخصص أو المرحلة أو المنهج باستخدام الذكاء الاصطناعي.
            </p>
            <p>
              يتدرب الطالب على استخدام AI في الشرح والتبسيط والتلخيص وصناعة الاختبارات والتصحيح والتغذية الراجعة، بحيث يصبح الذكاء الاصطناعي معلمًا خصوصيًا مساعدًا يتكيف مع مستوى الطالب واحتياجه.
            </p>
          </div>
          <div className="student-course-price">
            <small>قيمة الاشتراك</small>
            <strong>500 جنيه</strong>
            <span>للكورس كاملًا</span>
          </div>
        </article>

        <div className="student-programs-grid">
          <section className="student-info-card" aria-labelledby="course-benefits-title">
            <div className="student-card-heading">
              <Icon name="brain" />
              <div>
                <p className="section-kicker">ماذا سيتعلم الطالب؟</p>
                <h2 id="course-benefits-title">أهم محاور الكورس</h2>
              </div>
            </div>
            <ul className="student-benefit-list">
              <li><Icon name="check-circle" /> شرح أي درس بطريقة أبسط تناسب مستوى الطالب.</li>
              <li><Icon name="check-circle" /> تلخيص المحتوى وتحويله إلى نقاط وأسئلة وخرائط مراجعة.</li>
              <li><Icon name="check-circle" /> إنشاء اختبارات متنوعة وتصحيح الإجابات مع توضيح الخطأ.</li>
              <li><Icon name="check-circle" /> بناء أسلوب مذاكرة يجعل AI معلمًا خصوصيًا مساعدًا للطالب.</li>
            </ul>
          </section>

          <section className="student-info-card student-subscribe-card" aria-labelledby="subscribe-title">
            <div className="student-card-heading">
              <Icon name="message" />
              <div>
                <p className="section-kicker">طريقة الاشتراك</p>
                <h2 id="subscribe-title">اشترك عبر واتساب</h2>
              </div>
            </div>
            <ol className="student-steps">
              <li>إرسال قيمة الكورس <strong>500 جنيه</strong> على Vodafone Cash رقم <strong dir="ltr">01008709358</strong>.</li>
              <li>إرسال صورة التحويل على واتساب إلى نفس الرقم.</li>
              <li>إرسال <strong>الاسم + المرحلة الدراسية + الإيميل المستخدم في Google</strong>.</li>
              <li>يتم تفعيل الإيميل للمحاضرات والمادة العلمية الخاصة بالمشتركين.</li>
            </ol>
            <SafeExternalLink className="primary-button student-whatsapp-button" href={whatsappUrl} mode="contact">
              <Icon name="message" />
              <span>تواصل للاشتراك عبر واتساب</span>
            </SafeExternalLink>
          </section>
        </div>

        <section aria-labelledby="lectures-title" className="student-section">
          <div className="student-section-heading">
            <div>
              <p className="section-kicker">المحاضرات المسجلة</p>
              <h2 id="lectures-title">شاهد المحاضرات</h2>
            </div>
            <p>المحاضرة المجانية متاحة للجميع، وباقي المحاضرات تُفتح فقط للإيميلات التي تم منحها صلاحية المشاهدة على Google Drive.</p>
          </div>

          <div className="student-lecture-grid">
            {lectures.map((lecture, index) => (
              <article className="student-lecture-card" key={lecture.title}>
                <div className="student-lecture-number">{index + 1}</div>
                <div>
                  <span className={lecture.free ? 'student-access-tag is-free' : 'student-access-tag is-locked'}>
                    {lecture.free ? 'مجانا للجميع' : 'للمشتركين فقط'}
                  </span>
                  <h3>{lecture.title}</h3>
                  <p>{lecture.description}</p>
                </div>
                <SafeExternalLink className={lecture.free ? 'primary-button' : 'secondary-button'} href={lecture.url}>
                  <Icon name={lecture.free ? 'play' : 'video'} />
                  <span>{lecture.free ? 'شاهد الآن' : 'فتح المحاضرة'}</span>
                </SafeExternalLink>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="material-title" className="student-material-card">
          <div className="student-card-heading">
            <Icon name="file" />
            <div>
              <p className="section-kicker">المادة العلمية للكورس</p>
              <h2 id="material-title">المذاكرة المبدعة بأدوات الذكاء الاصطناعي</h2>
            </div>
          </div>
          <p>
            ملف المادة العلمية يحتوي على خطوات وأوامر تطبيقية للشرح والتبسيط، تحديد نمط التعلم، رفع محتوى المنهج، إعداد الأسئلة والاختبارات، التلخيص، وتوظيف الأدوات المساندة في المذاكرة.
          </p>
          <div className="student-material-actions">
            <SafeExternalLink className="secondary-button" href="https://docs.google.com/document/d/1WVHlX81qBZYRyI98MuFZWLwjib3oIeaaXBi9iVK0fY4/edit?usp=drivesdk">
              <Icon name="file" />
              <span>فتح المادة العلمية للمشتركين</span>
            </SafeExternalLink>
            <span className="student-access-note">يتطلب الدخول بإيميل Google المصرح له.</span>
          </div>
        </section>
      </div>
    </section>
  );
}
