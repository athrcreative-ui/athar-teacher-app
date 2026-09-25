export type Prep1SectionType =
  | 'diagnostic'
  | 'listening'
  | 'reading'
  | 'story'
  | 'poetry'
  | 'rhetoric'
  | 'grammar'
  | 'spelling'
  | 'writing'
  | 'formative'
  | 'project';

export interface Prep1IndexItem {
  id: string; // lesson id
  title: string;
  type: Prep1SectionType;
  typeLabel: string;
  pageNumber?: number;
  description?: string;
}

export interface Prep1Topic {
  id: string;
  number: string;
  title: string;
  themeId: string;
  items: Prep1IndexItem[];
}

export interface Prep1Theme {
  id: string;
  unitId: string;
  number: string;
  title: string;
  colorScheme: 'emerald' | 'indigo';
  diagnostic?: Prep1IndexItem;
  topics: Prep1Topic[];
  project?: Prep1IndexItem;
}

export const prep1Themes: Prep1Theme[] = [
  {
    id: 'theme-1',
    unitId: 'unit-arabic-1-prep-01',
    number: 'المحور الأول',
    title: 'الهوية وبناء الشخصية',
    colorScheme: 'emerald',
    diagnostic: {
      id: 'lesson-10',
      title: 'تقييم تشخيصي: قياس المكتسبات القبلية وتاريخ الهوية',
      type: 'diagnostic',
      typeLabel: 'تقييم تشخيصي',
      pageNumber: 8,
      description: 'قياس المكتسبات القبلية في مهارات القراءة والنحو والإملاء واستحضار الهوية الوطنية.',
    },
    topics: [
      {
        id: 'theme-1-topic-1',
        number: 'الموضوع الأول',
        title: 'الهوية ومؤثراتها',
        themeId: 'theme-1',
        items: [
          {
            id: 'lesson-p1-01',
            title: 'فجر الحضارة (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 12,
            description: 'من كتاب فجر الضمير لجيمس برستد؛ مصر مهد الأخلاق والضمير الإنساني.',
          },
          {
            id: 'lesson-p1-02',
            title: 'مقطع من رواية زينب (قصة ولمحة أدبية)',
            type: 'story',
            typeLabel: 'قصة ولمحة أدبية',
            pageNumber: 16,
            description: 'أول رواية مصرية حديثة للدكتور محمد حسين هيكل تصوّر بهجة العيد وتماسك أهل القرية.',
          },
          {
            id: 'lesson-p1-03',
            title: 'في وصف مصر (نص شعري)',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 22,
            description: 'أبيات شعرية في شموخ مصر وخلود نيلها وعراقة تاريخها.',
          },
          {
            id: 'lesson-p1-04',
            title: 'همزة القطع وألف الوصل (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 26,
            description: 'مواضع همزة القطع وألف الوصل في الحروف والأسماء والأفعال.',
          },
          {
            id: 'lesson-p1-05',
            title: 'الضمائر البارزة والمستترة (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 30,
            description: 'الضمائر المنفصلة والمتصلة والمستترة وإعرابها في الجمل.',
          },
          {
            id: 'lesson-p1-06',
            title: 'كتابة نموذج مقال وصفي (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 36,
            description: 'خطوات بناء المقال الوصفي الحسي والوجداني وتوظيف التعبيرات المجازية.',
          },
          {
            id: 'lesson-p1-07',
            title: 'تقييم تكويني (1): الهوية ومؤثراتها',
            type: 'formative',
            typeLabel: 'تقييم تكويني',
            pageNumber: 40,
            description: 'أنشطة تطبيقية تقيس مخرجات التعلم الخاصة بالموضوع الأول.',
          },
        ],
      },
      {
        id: 'theme-1-topic-2',
        number: 'الموضوع الثاني',
        title: 'الهوية وبناء الشخصية',
        themeId: 'theme-1',
        items: [
          {
            id: 'lesson-p1-08',
            title: 'دروس من الحياة (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 44,
            description: 'تجارب ومواقف ملهمة تسهم في بناء الشخصية الإيجابية الواعية.',
          },
          {
            id: 'lesson-p1-09',
            title: 'مصر هذه هي التي ستبقى (مقال ثروت أباظة)',
            type: 'reading',
            typeLabel: 'قراءة ومقال أدبي',
            pageNumber: 48,
            description: 'مقال يعبر عن عزة النفس والتفاؤل وقوة الهوية المصرية الراسخة عبر الزمان.',
          },
          {
            id: 'lesson-p1-10',
            title: 'شباب اليوم صناع الغد (نص شعري)',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 54,
            description: 'قصيدة إبراهيم ناجي تحث الشباب على العلم والعمل لبناء مستقبل الوطن.',
          },
          {
            id: 'lesson-p1-11',
            title: 'الضمائر المستترة وتقديرها (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 58,
            description: 'الاستتار الواجب والجائز للضمير وتقديره بحسب سياق الجملة الفعلية.',
          },
          {
            id: 'lesson-p1-12',
            title: 'علامات الترقيم وتطبيقاتها (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 62,
            description: 'ضبط علامات الترقيم وتنظيم الفقرات وتوضيح الدلالات المعنوية.',
          },
          {
            id: 'lesson-p1-13',
            title: 'كتابة سيرة ذاتية (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 66,
            description: 'صياغة المحطات الحياتية والاهتمامات والأهداف الشخصية بترتيب زمني سليم.',
          },
          {
            id: 'lesson-p1-14',
            title: 'تقييم تكويني (2): الهوية وبناء الشخصية',
            type: 'formative',
            typeLabel: 'تقييم تكويني',
            pageNumber: 70,
            description: 'تدريبات مهارية لقياس كفاءة استيعاب مهارات الموضوع الثاني.',
          },
        ],
      },
      {
        id: 'theme-1-topic-3',
        number: 'الموضوع الثالث',
        title: 'أصدقائي',
        themeId: 'theme-1',
        items: [
          {
            id: 'lesson-p1-15',
            title: 'الصداقة الحقيقية (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 74,
            description: 'أسس الصداقة الصالحة وأثرها الإيجابي في مساندة الفرد وصقل شخصيته.',
          },
          {
            id: 'lesson-p1-16',
            title: 'يا أصدقائي (مقال عبد الوهاب مطاوع)',
            type: 'reading',
            typeLabel: 'قراءة ومقال أدبي',
            pageNumber: 78,
            description: 'رسائل حكيمة تعزز قيم التسامح وحسن الظن والوفاء بين الأصدقاء.',
          },
          {
            id: 'lesson-p1-17',
            title: 'نداء إلى شباب الغد (نص شعري)',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 84,
            description: 'دعوة للأخوة والتآزر والتعاون المشترك لصنع غدٍ مشرق.',
          },
          {
            id: 'lesson-p1-18',
            title: 'أنواع الخبر في الجملة الاسمية (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 88,
            description: 'الخبر المفرد، وخبر الجملة (اسمية/فعلية)، وخبر شبه الجملة.',
          },
          {
            id: 'lesson-p1-19',
            title: 'رسم الهمزة على الألف (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 94,
            description: 'قواعد كتابة الهمزة المتوسطة والمتطرفة على الألف وفق سلم الحركات.',
          },
          {
            id: 'lesson-p1-20',
            title: 'كتابة رسالة إلى صديق (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 98,
            description: 'عناصر الرسالة الإخوانية من تحية وعرض وخاتمة بأسلوب مفعم بالود.',
          },
          {
            id: 'lesson-p1-21',
            title: 'تقييم تكويني (3): أصدقائي ومشروع المحور الأول',
            type: 'formative',
            typeLabel: 'تقييم تكويني ومشروع',
            pageNumber: 102,
            description: 'مراجعة ختامية للمحور الأول وإرشادات مشروع ملف وثائقي عن الهوية المصرية.',
          },
        ],
      },
    ],
  },
  {
    id: 'theme-2',
    unitId: 'unit-arabic-1-prep-02',
    number: 'المحور الثاني',
    title: 'هواياتي',
    colorScheme: 'indigo',
    diagnostic: {
      id: 'lesson-p1-22',
      title: 'تقييم تشخيصي: مهارات واهتمامات المحور الثاني',
      type: 'diagnostic',
      typeLabel: 'تقييم تشخيصي',
      pageNumber: 108,
      description: 'تقويم قبلي لاستكشاف هوايات الطلاب وميولهم اللغوية والرياضية والأدبية.',
    },
    topics: [
      {
        id: 'theme-2-topic-1',
        number: 'الموضوع الأول',
        title: 'الرياضة',
        themeId: 'theme-2',
        items: [
          {
            id: 'lesson-p1-23',
            title: 'حدد هواياتك (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 112,
            description: 'طرق اكتشاف الهوايات الحقيقية ودورها في تجديد النشاط وتوازن الشخصية.',
          },
          {
            id: 'lesson-p1-24',
            title: 'الرياضة والمجتمع (قراءة)',
            type: 'reading',
            typeLabel: 'قراءة',
            pageNumber: 116,
            description: 'أهمية الرياضة في تهذيب الأخلاق واستعراض بطولات مصرية عالمية ملهمة.',
          },
          {
            id: 'lesson-p1-25',
            title: 'الموسيقى في النص الشعري (لمحة بلاغية)',
            type: 'rhetoric',
            typeLabel: 'لمحة بلاغية',
            pageNumber: 122,
            description: 'الموسيقى الظاهرة والخفية في الشعر وأثر الإيقاع في جذب المتلقي.',
          },
          {
            id: 'lesson-p1-26',
            title: 'الفعل اللازم والفعل المتعدي (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 126,
            description: 'التمييز بين الفعل اللازم المكتفي بفاعله والفعل المتعدي لمفعول به.',
          },
          {
            id: 'lesson-p1-27',
            title: 'رسم الهمزة المتوسطة على الألف (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 132,
            description: 'حالات الهمزة المتوسطة المفتوحة بعد فتح أو سكون أو الساكنة بعد فتح.',
          },
          {
            id: 'lesson-p1-28',
            title: 'كتابة تقرير عن نشاط رياضي (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 136,
            description: 'أركان كتابة التقرير الصحفي والرياضي بموضوعية ودقة وتوصيات محددة.',
          },
          {
            id: 'lesson-p1-29',
            title: 'تقييم تكويني (4): الرياضة',
            type: 'formative',
            typeLabel: 'تقييم تكويني',
            pageNumber: 140,
            description: 'تقييم إتقان المهارات اللغوية والبلاغية المرتبطة بموضوع الرياضة.',
          },
        ],
      },
      {
        id: 'theme-2-topic-2',
        number: 'الموضوع الثاني',
        title: 'الشعر والشعور',
        themeId: 'theme-2',
        items: [
          {
            id: 'lesson-p1-30',
            title: 'لغة المشاعر (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 144,
            description: 'الشعر كمرآة لوجدان الإنسان وأداة راقية للتعبير عن العواطف النبيلة.',
          },
          {
            id: 'lesson-p1-31',
            title: 'الشعر والشاعر (مقال عبد الرحمن شكري)',
            type: 'reading',
            typeLabel: 'قراءة ومقال أدبي',
            pageNumber: 148,
            description: 'مقال نقدي لأحد رواد مدرسة الديوان حول رسالة الشاعر والصدق الفني.',
          },
          {
            id: 'lesson-p1-32',
            title: 'التشبيه وأركانه (لمحة بلاغية)',
            type: 'rhetoric',
            typeLabel: 'لمحة بلاغية',
            pageNumber: 154,
            description: 'أركان التشبيه الأربعة وصوره البلاغية وأثره في توضيح المعنى وتجسيمه.',
          },
          {
            id: 'lesson-p1-33',
            title: 'ظن وأخواتها والأفعال المتعدية لمفعولين (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 158,
            description: 'أفعال الرجحان واليقين والتحويل الناسخة التي تنصب مفعولين أصلهما المبتدأ والخبر.',
          },
          {
            id: 'lesson-p1-34',
            title: 'رسم الهمزة المتوسطة على الياء والنبرة (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 164,
            description: 'مواضع رسم الهمزة المتوسطة على نبرة وفق قوة حركة الكسرة.',
          },
          {
            id: 'lesson-p1-35',
            title: 'كتابة نص أدبي وصفي (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 168,
            description: 'توظيف الخيال البلاغي والمفردات الموحية في كتابة نص شاعري دافئ.',
          },
          {
            id: 'lesson-p1-36',
            title: 'تقييم تكويني (5): الشعر والشعور',
            type: 'formative',
            typeLabel: 'تقييم تكويني',
            pageNumber: 172,
            description: 'اختبار مرحلي يقيس التذوق البلاغي وإعراب ظن وأخواتها وقواعد الإملاء.',
          },
        ],
      },
      {
        id: 'theme-2-topic-3',
        number: 'الموضوع الثالث',
        title: 'أدب وفكر',
        themeId: 'theme-2',
        items: [
          {
            id: 'lesson-p1-37',
            title: 'رواد الفكر والأدب (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 176,
            description: 'إسهامات الرواد والمفكرين في إثراء الثقافة العربية وتنوير العقول.',
          },
          {
            id: 'lesson-p1-38',
            title: 'لطيفة النادي أول طيارة مصرية (سيرة مصرية)',
            type: 'story',
            typeLabel: 'قراءة وسيرة ذاتية',
            pageNumber: 180,
            description: 'سيرة ملهمة لأول رائدة طيران مصرية وعربية تتحدى الصعاب لصناعة المجد.',
          },
          {
            id: 'lesson-p1-39',
            title: 'فضل العلم والعمل (نص شعري)',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 186,
            description: 'قصيدة مصطفى صادق الرافعي في شرف العلم وأهمية العمل لرفعة الأوطان.',
          },
          {
            id: 'lesson-p1-40',
            title: 'الأفعال الصحيحة والمعتلة ومراجعة نحوية (قواعد نحوية)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 190,
            description: 'أقسام الفعل الصحيح (سالم، مهموز، مضعف) والمعتل (مثال، أجوف، ناقص، لفيف).',
          },
          {
            id: 'lesson-p1-41',
            title: 'تطبيقات إملائية عامة على الهمزات (قواعد إملائية)',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 196,
            description: 'مراجعة وتطبيقات شاملة على جميع مواضع الهمزة وعلامات الترقيم.',
          },
          {
            id: 'lesson-p1-42',
            title: 'كتابة مقال إقناعي (تعبير كتابي)',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 200,
            description: 'بناء الحجة والبرهان المنطقي ودحض الآراء المخالفة بأسلوب إقناعي رصين.',
          },
          {
            id: 'lesson-p1-43',
            title: 'تقييم تكويني (6): أدب وفكر ومشروع المحور الثاني',
            type: 'formative',
            typeLabel: 'تقييم تكويني ومشروع',
            pageNumber: 204,
            description: 'تقييم ختامي لمحتوى الفصل الدراسي وإرشادات مجلة الهوايات والأدب المدرسية.',
          },
        ],
      },
    ],
  },
];

export const sectionTypeIcons: Record<Prep1SectionType, string> = {
  diagnostic: 'clipboard',
  listening: 'volume-high',
  reading: 'book-open',
  story: 'book',
  poetry: 'feather',
  rhetoric: 'sparkle',
  grammar: 'layers',
  spelling: 'check',
  writing: 'edit',
  formative: 'brain',
  project: 'flag',
};

export const sectionTypeColors: Record<Prep1SectionType, { bg: string; text: string; border: string }> = {
  diagnostic: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' },
  listening: { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' },
  reading: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  story: { bg: '#fdf4ff', text: '#a21caf', border: '#f0abfc' },
  poetry: { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  rhetoric: { bg: '#f5f3ff', text: '#6d28d9', border: '#c4b5fd' },
  grammar: { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  spelling: { bg: '#fefce8', text: '#a16207', border: '#fde047' },
  writing: { bg: '#f8fafc', text: '#334155', border: '#cbd5e1' },
  formative: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
  project: { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
};
