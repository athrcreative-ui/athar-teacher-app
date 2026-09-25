import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const scale = [1, 2, 3, 4, 5] as const;

type Question = {
  id: number;
  text: string;
};

type ScoreItem = {
  key: string;
  label: string;
  emoji: string;
  score: number;
};

const questions: Question[] = [
  { id: 1, text: 'أستطيع التعبير عن أفكاري بالكلام أو الكتابة بسهولة.' },
  { id: 2, text: 'أتذكر الكلمات والمعاني والمعلومات المكتوبة بصورة جيدة.' },
  { id: 3, text: 'أحب حل المسائل والألغاز واكتشاف العلاقات بين الأشياء.' },
  { id: 4, text: 'أحب ترتيب المعلومات في خطوات ومقارنة الأشياء ببعضها.' },
  { id: 5, text: 'أفهم المعلومة أسرع عندما أراها في صورة أو خريطة أو رسم.' },
  { id: 6, text: 'أتذكر الأشكال والأماكن والصور والتفاصيل البصرية بسهولة.' },
  { id: 7, text: 'أحب أن أتعلم عن طريق الحركة والتجربة والعمل بيدي.' },
  { id: 8, text: 'أفهم المهمة بشكل أفضل عندما أجرب تنفيذها بنفسي.' },
  { id: 9, text: 'أنتبه بسهولة إلى الأصوات والإيقاع والنغم.' },
  { id: 10, text: 'يسهل عليّ تذكر بعض المعلومات عندما أربطها بصوت أو إيقاع.' },
  { id: 11, text: 'أفهم مشاعر الآخرين وأستطيع العمل معهم بصورة جيدة.' },
  { id: 12, text: 'أستمتع بشرح ما تعلمته لزميل أو مساعدته على الفهم.' },
  { id: 13, text: 'أعرف الأشياء التي أجيدها والأشياء التي أحتاج إلى تحسينها.' },
  { id: 14, text: 'أستطيع أن أضع لنفسي هدفًا وأتابع تقدمي فيه.' },
  { id: 15, text: 'أحب ملاحظة الحيوانات والنباتات والبيئة وتصنيف الأشياء من حولي.' },
  { id: 16, text: 'أفهم بعض الأفكار بصورة أفضل عندما أربطها بالطبيعة والحياة من حولي.' },
  { id: 17, text: 'الصور والإنفوجرافيك والخرائط تساعدني كثيرًا على الفهم.' },
  { id: 18, text: 'الاستماع إلى الشرح والحوار يساعدني كثيرًا على الفهم.' },
  { id: 19, text: 'القراءة وكتابة الملاحظات بنفسي تساعدني على التعلم.' },
  { id: 20, text: 'الألعاب والتجارب والأنشطة العملية تجعلني أفهم بصورة أفضل.' },
  { id: 21, text: 'المناقشة والعمل مع زملائي يساعدانني على اكتشاف أفكار جديدة.' },
  { id: 22, text: 'أحيانًا أفهم وأركز أكثر عندما أتعلم وحدي في مكان هادئ.' },
  { id: 23, text: 'أستطيع التركيز على مهمة تعليمية حتى أنهي جزءًا واضحًا منها.' },
  { id: 24, text: 'عندما أتعلم معلومة جديدة أحاول ربطها بشيء أعرفه من قبل.' },
  { id: 25, text: 'إذا لم أفهم بطريقة معينة، أجرب طريقة أخرى مثل صورة أو مثال أو سؤال أو تجربة.' },
  { id: 26, text: 'بعد انتهاء الدرس أستطيع تحديد ما فهمته وما الذي ما زلت أحتاج إلى مراجعته.' },
  { id: 27, text: 'أحب طرح الأسئلة والبحث عندما أقابل شيئًا لا أعرفه.' },
  { id: 28, text: 'عندما يكون السؤال صعبًا أحاول أكثر من مرة قبل أن أتركه.' },
  { id: 29, text: 'أستطيع البدء في واجبي أو مهمتي دون الحاجة إلى تذكير مستمر.' },
  { id: 30, text: 'عندما أخطئ أحاول معرفة سبب الخطأ واستخدامه لتحسين إجابتي التالية.' },
];

const intelligenceGroups = [
  { key: 'linguistic', label: 'الذكاء اللغوي', emoji: '📝', ids: [1, 2] },
  { key: 'logical', label: 'الذكاء المنطقي', emoji: '🧩', ids: [3, 4] },
  { key: 'visual', label: 'الذكاء البصري المكاني', emoji: '🖼️', ids: [5, 6] },
  { key: 'kinesthetic', label: 'الذكاء الجسدي الحركي', emoji: '👐', ids: [7, 8] },
  { key: 'musical', label: 'الذكاء الموسيقي', emoji: '🎵', ids: [9, 10] },
  { key: 'social', label: 'الذكاء الاجتماعي', emoji: '🤝', ids: [11, 12] },
  { key: 'intrapersonal', label: 'معرفة الذات', emoji: '🪞', ids: [13, 14] },
  { key: 'naturalistic', label: 'الذكاء الطبيعي', emoji: '🌿', ids: [15, 16] },
];

const learningPreferences = [
  { key: 'visual', label: 'التعلم البصري', emoji: '🎨', id: 17 },
  { key: 'auditory', label: 'التعلم بالاستماع والحوار', emoji: '🎧', id: 18 },
  { key: 'readwrite', label: 'القراءة والكتابة', emoji: '📚', id: 19 },
  { key: 'practice', label: 'التعلم العملي والتجريبي', emoji: '🧪', id: 20 },
  { key: 'collaborative', label: 'التعلم التعاوني', emoji: '👥', id: 21 },
  { key: 'solo', label: 'التعلم الفردي الهادئ', emoji: '🧘', id: 22 },
];

const studySkills = [
  { key: 'focus', label: 'التركيز وإنهاء المهمة', emoji: '🎯', id: 23 },
  { key: 'connection', label: 'ربط الجديد بما تعرفه', emoji: '🔗', id: 24 },
  { key: 'flexibility', label: 'المرونة وتغيير طريقة التعلم', emoji: '🔄', id: 25 },
  { key: 'metacognition', label: 'مراجعة فهمك بنفسك', emoji: '🧠', id: 26 },
];

const learningHabits = [
  { key: 'curiosity', label: 'الفضول وطرح الأسئلة', emoji: '❓', id: 27 },
  { key: 'persistence', label: 'المثابرة أمام الصعوبة', emoji: '💪', id: 28 },
  { key: 'independence', label: 'الاستقلالية وبدء المهمة', emoji: '🚀', id: 29 },
  { key: 'errorlearning', label: 'التعلم من الخطأ', emoji: '🛠️', id: 30 },
];

const preferenceAdvice: Record<string, string[]> = {
  visual: ['حوّل الدرس إلى خريطة أو رسم بسيط.', 'استخدم لونين أو ثلاثة فقط لتمييز الأفكار.', 'بعد مشاهدة الصورة أغلقها وارسمها من الذاكرة.'],
  auditory: ['اشرح الفكرة بصوتك كأنك تشرحها لشخص آخر.', 'استخدم التسجيلات القصيرة ثم لخّص ما سمعت.', 'حوّل النقاط المهمة إلى أسئلة وأجب عنها بصوت مرتفع.'],
  readwrite: ['اكتب ملخصًا قصيرًا بلغتك أنت.', 'حوّل العناوين إلى أسئلة ثم اكتب الإجابة دون نسخ.', 'استخدم بطاقات سؤال وجواب للمراجعة.'],
  practice: ['ابدأ بمثال أو تجربة أو سؤال تطبيقي.', 'طبّق القاعدة على مثال جديد من عندك.', 'اجعل كل جلسة مذاكرة تنتهي بمهمة تنفذها بيدك.'],
  collaborative: ['اشرح جزءًا من الدرس لزميل أو فرد من الأسرة.', 'ناقش سؤالًا صعبًا بعد أن تحاول حله وحدك أولًا.', 'استخدم أسلوب: أنا أشرح — الآخر يسأل — أنا أصحح.'],
  solo: ['حدد جلسات هادئة قصيرة بلا مشتتات.', 'اكتب هدف الجلسة قبل البدء وماذا أنجزت بعدها.', 'استخدم المراجعة الذاتية ثم اطلب المساعدة في النقاط العالقة فقط.'],
};

const intelligenceAdvice: Record<string, string> = {
  linguistic: 'استثمر قوتك اللغوية في الشرح بصوتك، كتابة الملخصات، وصناعة أسئلة من الدرس.',
  logical: 'استخدم الجداول والمقارنات والخطوات، واسأل دائمًا: لماذا؟ وما العلاقة بين هذه الفكرة وتلك؟',
  visual: 'حوّل المعلومات إلى خرائط ورسوم ومسارات بصرية بدل تركها في صورة فقرات طويلة.',
  kinesthetic: 'اربط المذاكرة بالتطبيق والتجريب والبطاقات والحركة كلما كان ذلك مناسبًا للمادة.',
  musical: 'استخدم الإيقاع أو النطق المتكرر في حفظ القواعد والمصطلحات، دون الاعتماد عليه وحده.',
  social: 'التعلم بالشرح والمناقشة مناسب لك؛ اجعل الحوار وسيلة لاختبار الفهم لا لتضييع وقت المذاكرة.',
  intrapersonal: 'ضع أهدافًا قصيرة وراقب تقدمك بنفسك، واكتب ما الذي نجح معك وما الذي يحتاج إلى تعديل.',
  naturalistic: 'استخدم التصنيف والمجموعات واربط المعلومات بأمثلة من البيئة والحياة اليومية كلما أمكن.',
};

function skillMessage(score: number) {
  if (score >= 4) return 'نقطة قوة جيدة — حافظ عليها واستخدمها بوعي.';
  if (score === 3) return 'مستوى متوسط — يمكنك تحسينه بتدريب بسيط ومنتظم.';
  return 'هذه مهارة تستحق تركيزًا إضافيًا في خطتك القادمة.';
}

export function LearningProfilePage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const completion = Math.round((answeredCount / questions.length) * 100);
  const allAnswered = answeredCount === questions.length;

  const intelligenceScores = useMemo<ScoreItem[]>(() => intelligenceGroups.map((group) => ({
    key: group.key,
    label: group.label,
    emoji: group.emoji,
    score: group.ids.reduce((sum, id) => sum + (answers[id] ?? 0), 0) / group.ids.length,
  })).sort((a, b) => b.score - a.score), [answers]);

  const preferenceScores = useMemo<ScoreItem[]>(() => learningPreferences.map((item) => ({
    key: item.key,
    label: item.label,
    emoji: item.emoji,
    score: answers[item.id] ?? 0,
  })).sort((a, b) => b.score - a.score), [answers]);

  const skillScores = useMemo<ScoreItem[]>(() => studySkills.map((item) => ({
    key: item.key,
    label: item.label,
    emoji: item.emoji,
    score: answers[item.id] ?? 0,
  })).sort((a, b) => a.score - b.score), [answers]);

  const habitScores = useMemo<ScoreItem[]>(() => learningHabits.map((item) => ({
    key: item.key,
    label: item.label,
    emoji: item.emoji,
    score: answers[item.id] ?? 0,
  })).sort((a, b) => b.score - a.score), [answers]);

  const topPreference = preferenceScores[0];
  const topIntelligences = intelligenceScores.slice(0, 3);
  const prioritySkill = skillScores[0];

  const submitSurvey = () => {
    if (!allAnswered) return;
    setShowResults(true);
    window.setTimeout(() => document.getElementById('learning-profile-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const resetSurvey = () => {
    setAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="learning-profile-page">
      <section className="learning-profile-intro">
        <div className="container learning-profile-intro__grid">
          <div>
            <p className="section-kicker">اكتشف بصمة تعلّمك</p>
            <h1>اعرف نمطك التعليمي قبل ما تبدأ مذاكرة</h1>
            <p className="learning-profile-lead">
              أجب عن 30 سؤالًا قصيرًا، ثم ستحصل على قراءة مبسطة لنقاط قوتك، والطرق التي تساعدك على التعلم، ونصائح وخطة عملية لتطوير مهاراتك الدراسية.
            </p>
            <div className="learning-profile-scale" aria-label="مقياس الإجابة">
              <span>1 = لا ينطبق عليّ</span>
              <span>3 = متوسط</span>
              <span>5 = ينطبق عليّ جدًا</span>
            </div>
            <p className="learning-profile-note">لا توجد إجابة صحيحة أو خاطئة. اختر ما يعبّر عنك الآن، وليس ما تتمنى أن تكون عليه.</p>
          </div>
          <img alt="طالب يكتشف بصمة تعلمه ويخطط لتطوير مهاراته" className="learning-profile-intro__image" src="/assets/learning-profile-hero.svg" />
        </div>
      </section>

      <section className="learning-profile-survey" aria-labelledby="survey-title">
        <div className="container learning-profile-survey__container">
          <div className="learning-profile-progress-wrap">
            <div className="learning-profile-progress-copy">
              <h2 id="survey-title">استبيان بصمة التعلم</h2>
              <strong>{answeredCount} / {questions.length}</strong>
            </div>
            <div className="learning-profile-progress" aria-label={`تم إكمال ${completion}%`}>
              <span style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="learning-profile-questions">
            {questions.map((question) => (
              <article className={`learning-profile-question ${answers[question.id] ? 'is-answered' : ''}`} key={question.id}>
                <div className="learning-profile-question__number">{question.id}</div>
                <p>{question.text}</p>
                <div className="learning-profile-rating" role="radiogroup" aria-label={`السؤال ${question.id}`}>
                  {scale.map((value) => (
                    <button
                      aria-checked={answers[question.id] === value}
                      className={answers[question.id] === value ? 'is-selected' : ''}
                      key={value}
                      onClick={() => {
                        setAnswers((current) => ({ ...current, [question.id]: value }));
                        setShowResults(false);
                      }}
                      role="radio"
                      type="button"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="learning-profile-submit">
            <button className="primary-button" disabled={!allAnswered} onClick={submitSurvey} type="button">
              اعرض بصمة تعلّمي وخطتي
            </button>
            {!allAnswered && <p>أكمل الأسئلة المتبقية أولًا — بقي {questions.length - answeredCount} سؤال.</p>}
          </div>
        </div>
      </section>

      {showResults && allAnswered && (
        <section className="learning-profile-results" id="learning-profile-results" aria-labelledby="results-title">
          <div className="container">
            <div className="learning-profile-results__header">
              <p className="section-kicker">نتيجتك الشخصية</p>
              <h2 id="results-title">هذه بصمة تعلّمك الحالية</h2>
              <p>استخدمها كبوصلة تساعدك على اختيار طرق مذاكرة مناسبة، وليس كتصنيف ثابت يحصرك في طريقة واحدة.</p>
            </div>

            <div className="learning-profile-result-grid">
              <article className="learning-profile-result-card learning-profile-result-card--highlight">
                <span className="learning-profile-result-card__emoji">{topPreference.emoji}</span>
                <p className="section-kicker">الطريقة الأقرب لك حاليًا</p>
                <h3>{topPreference.label}</h3>
                <p>هذه الطريقة حصلت على أعلى تقييم بين تفضيلاتك، لكن الأفضل أن تجمع بينها وبين أكثر من طريقة حسب المادة والمهمة.</p>
              </article>

              <article className="learning-profile-result-card">
                <p className="section-kicker">أبرز نقاط قوتك</p>
                <h3>أعلى 3 مجالات</h3>
                <div className="learning-profile-chips">
                  {topIntelligences.map((item) => <span key={item.key}>{item.emoji} {item.label}</span>)}
                </div>
              </article>

              <article className="learning-profile-result-card">
                <p className="section-kicker">المهارة التي تستحق تدريبًا أكثر</p>
                <h3>{prioritySkill.emoji} {prioritySkill.label}</h3>
                <p>{skillMessage(prioritySkill.score)}</p>
              </article>
            </div>

            <div className="learning-profile-section-block">
              <h3>كيف تستفيد من طريقتك في المذاكرة؟</h3>
              <div className="learning-profile-advice-grid">
                {(preferenceAdvice[topPreference.key] ?? []).map((tip) => (
                  <div className="learning-profile-tip" key={tip}><span>✓</span><p>{tip}</p></div>
                ))}
                <div className="learning-profile-tip learning-profile-tip--wide"><span>★</span><p>{intelligenceAdvice[topIntelligences[0].key]}</p></div>
              </div>
            </div>

            <div className="learning-profile-section-block">
              <h3>خطة 7 أيام لتقوية مهاراتك الدراسية</h3>
              <div className="learning-profile-plan">
                <div><b>اليوم 1</b><p>اختر مادة واحدة، وحدد هدفًا صغيرًا وواضحًا لجلسة مذاكرة مدتها 25 دقيقة.</p></div>
                <div><b>اليوم 2</b><p>ذاكر جزءًا قصيرًا باستخدام {topPreference.label}، ثم اختبر نفسك من غير الرجوع للمصدر.</p></div>
                <div><b>اليوم 3</b><p>تدرب على {prioritySkill.label}: نفّذ تمرينًا واحدًا مركزًا عليها وسجل ما نجح معك.</p></div>
                <div><b>اليوم 4</b><p>اشرح ما تعلمته بصوتك أو اكتبه بأسلوبك، ثم اكتشف نقطة واحدة لم تكن واضحة.</p></div>
                <div><b>اليوم 5</b><p>حل أسئلة أو تطبيقات جديدة بدل إعادة قراءة الدرس فقط، وصحح أخطاءك بنفسك.</p></div>
                <div><b>اليوم 6</b><p>استخدم طريقة تعلم ثانية مختلفة عن طريقتك المفضلة حتى تدرب مرونتك في التعلم.</p></div>
                <div><b>اليوم 7</b><p>راجع الأسبوع: ما الذي ساعدك فعلًا؟ ما المهارة التي تحسنت؟ وما تعديلك للأسبوع القادم؟</p></div>
              </div>
            </div>

            <div className="learning-profile-section-block">
              <h3>مؤشر مهاراتك الدراسية</h3>
              <div className="learning-profile-skill-list">
                {studySkills.map((skill) => {
                  const score = answers[skill.id] ?? 0;
                  return (
                    <div className="learning-profile-skill" key={skill.key}>
                      <div><strong>{skill.emoji} {skill.label}</strong><span>{score} / 5</span></div>
                      <div className="learning-profile-skill__bar"><span style={{ width: `${score * 20}%` }} /></div>
                      <small>{skillMessage(score)}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="learning-profile-section-block">
              <h3>ميول تساعدك أثناء التعلم</h3>
              <div className="learning-profile-chips learning-profile-chips--large">
                {habitScores.map((item) => <span key={item.key}>{item.emoji} {item.label}: {item.score}/5</span>)}
              </div>
            </div>

            <div className="learning-profile-results__actions">
              <Link className="primary-button" to="/curriculum">ابدأ مذاكرتك الآن</Link>
              <button className="secondary-button" onClick={resetSurvey} type="button">أعد الاستبيان</button>
            </div>

            <p className="learning-profile-disclaimer">هذه النتيجة أداة تعليمية إرشادية لمساعدتك على فهم تفضيلاتك ومهاراتك الحالية، وليست اختبارًا نفسيًا أو تشخيصًا لشخصيتك.</p>
          </div>
        </section>
      )}
    </main>
  );
}
