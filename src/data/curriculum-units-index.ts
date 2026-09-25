import type { IconName } from '../components/Icon';
import { prep1Themes } from './prep1-curriculum-index';

export type CurriculumSectionType =
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
  | 'project'
  | 'faith'
  | 'quran'
  | 'tajweed'
  | 'seerah'
  | 'characters'
  | 'worship'
  | 'values'
  | 'review';

export interface CurriculumIndexItem {
  id: string; // lesson id
  title: string;
  type: CurriculumSectionType;
  typeLabel: string;
  pageNumber?: number;
  description?: string;
}

export interface CurriculumTopic {
  id: string;
  number: string;
  title: string;
  items: CurriculumIndexItem[];
}

export interface CurriculumUnitTheme {
  id: string;
  unitId: string;
  levelId: string;
  subjectId: string;
  stageBadge: string;
  number: string;
  title: string;
  bannerGradient: string;
  iconSymbol: string;
  diagnostic?: CurriculumIndexItem;
  topics: CurriculumTopic[];
  project?: CurriculumIndexItem;
}

export const sectionTypeIcons: Record<CurriculumSectionType, IconName> = {
  diagnostic: 'clipboard',
  listening: 'volume-high',
  reading: 'book',
  story: 'book',
  poetry: 'feather',
  rhetoric: 'sparkle',
  grammar: 'layers',
  spelling: 'check',
  writing: 'edit',
  formative: 'brain',
  project: 'flag',
  faith: 'heart',
  quran: 'book',
  tajweed: 'volume-high',
  seerah: 'compass',
  characters: 'user',
  worship: 'check-circle',
  values: 'star',
  review: 'clipboard',
};

export const sectionTypeColors: Record<
  CurriculumSectionType,
  { bg: string; text: string; border: string }
> = {
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
  faith: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  quran: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' },
  tajweed: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
  seerah: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  characters: { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  worship: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  values: { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  review: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
};

// All curriculum unit themes database
export const allCurriculumUnitThemes: Record<string, CurriculumUnitTheme> = {
  // ==========================================
  // اللغة العربية - الصف الخامس الابتدائي
  // ==========================================
  'unit-arabic-5-primary-01': {
    id: 'unit-arabic-5-primary-01',
    unitId: 'unit-arabic-5-primary-01',
    levelId: 'level-arabic-5-primary',
    subjectId: 'subject-arabic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · اللغة العربية',
    number: 'الوحدة الأولى',
    title: 'نيلنا أمانة',
    bannerGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #0ea5e9 100%)',
    iconSymbol: '🌊',
    topics: [
      {
        id: 'p5-a-u1-t1',
        number: 'الموضوع الأول',
        title: 'نيلنا شريان الحياة',
        items: [
          {
            id: 'lesson-01',
            title: 'سر الحياة (نص استماع)',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 8,
            description: 'أهمية نهر النيل وسر الحياة في مصر وواجب حمايته ورعايته.',
          },
          {
            id: 'lesson-02',
            title: 'لم ألوث ماء النهر',
            type: 'reading',
            typeLabel: 'قراءة ونصوص',
            pageNumber: 14,
            description: 'نص فرعوني من التراث المصري القديم يعكس قداسة النيل والحرص على نقائه.',
          },
          {
            id: 'lesson-03',
            title: 'المفعول به',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 20,
            description: 'تعريف المفعول به في الجملة الفعلية وتحديد موقعه وعلامات إعرابه الأصلية.',
          },
        ],
      },
      {
        id: 'p5-a-u1-t2',
        number: 'الموضوع الثاني',
        title: 'كن إيجابيًا ومسؤولًا',
        items: [
          {
            id: 'lesson-04',
            title: 'همزة القطع وألف الوصل',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 26,
            description: 'التمييز الدقيق بين همزة القطع وألف الوصل نطقًا وكتابة مع شواهد وأمثلة.',
          },
          {
            id: 'lesson-05',
            title: 'بطل حل المشكلات',
            type: 'reading',
            typeLabel: 'قراءة وتفكير نقدي',
            pageNumber: 32,
            description: 'قصة ملهمة في ابتكار حلول ذكية وعملية لمواجهة تحديات البيئة والمجتمع.',
          },
          {
            id: 'lesson-06',
            title: 'المفعول به (المفرد وجمع التكسير)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 38,
            description: 'علامة نصب المفعول به الفتحة الظاهرة عند كونه اسمًا مفردًا أو جمع تكسير.',
          },
        ],
      },
      {
        id: 'p5-a-u1-t3',
        number: 'الموضوع الثالث',
        title: 'العطاء والمسؤولية المجتمعية',
        items: [
          {
            id: 'lesson-07',
            title: 'حكاية عطاء',
            type: 'story',
            typeLabel: 'قصة ولمحة أدبية',
            pageNumber: 44,
            description: 'قصة تجسد أسمى معاني الإيثار والمشاركة المجتمعية وخدمة المحتاجين.',
          },
          {
            id: 'lesson-08',
            title: 'الصواب أم إرضاء الصديق؟',
            type: 'reading',
            typeLabel: 'قراءة وموقف تربوي',
            pageNumber: 50,
            description: 'بناء الشخصية المستقلة واتخاذ الموقف الأخلاقي السليم عند تعارض المصالح.',
          },
          {
            id: 'lesson-11',
            title: 'هيا نحمي نيلنا',
            type: 'writing',
            typeLabel: 'تعبير كتابي ومشروع',
            pageNumber: 56,
            description: 'كتابة لافتات ورسائل توعوية وتصميم مبادرة لحماية نهر النيل وترشيد المياه.',
          },
        ],
      },
    ],
  },

  'unit-arabic-5-primary-02': {
    id: 'unit-arabic-5-primary-02',
    unitId: 'unit-arabic-5-primary-02',
    levelId: 'level-arabic-5-primary',
    subjectId: 'subject-arabic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · اللغة العربية',
    number: 'الوحدة الثانية',
    title: 'من التواصل',
    bannerGradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #3b82f6 100%)',
    iconSymbol: '📬',
    topics: [
      {
        id: 'p5-a-u2-t1',
        number: 'الموضوع الأول',
        title: 'لغات وثقافات',
        items: [
          {
            id: 'lesson-12',
            title: 'جسر التواصل',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 62,
            description: 'أهمية الحوار والتواصل الإنساني بين الثقافات والحضارات المختلفة.',
          },
          {
            id: 'lesson-13',
            title: 'لغة النصر',
            type: 'reading',
            typeLabel: 'قراءة ونصوص',
            pageNumber: 68,
            description: 'دور اللغة في توحيد الصفوف وبناء الثقة وتخليد أمجاد الوطن وبطولاته.',
          },
          {
            id: 'lesson-14',
            title: 'إعراب المفعول به (جمع المؤنث السالم)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 74,
            description: 'نصب المفعول به بالكسرة نيابة عن الفتحة عند كونه جمع مؤنث سالم.',
          },
        ],
      },
      {
        id: 'p5-a-u2-t2',
        number: 'الموضوع الثاني',
        title: 'رحلة الكلمة',
        items: [
          {
            id: 'lesson-15',
            title: 'الهمزة المتطرفة على السطر',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 80,
            description: 'حالات رسم الهمزة المتطرفة مفردة على السطر بعد سكون أو مد.',
          },
          {
            id: 'lesson-16',
            title: 'الرسالة عبر الزمن',
            type: 'reading',
            typeLabel: 'قراءة تاريخية',
            pageNumber: 86,
            description: 'رحلة الرسائل من الحمام الزاجل والبريد القديم إلى العالم الرقمي الحديث.',
          },
          {
            id: 'lesson-17',
            title: 'المفعول به (المثنى وجمع المذكر السالم)',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 92,
            description: 'علامة نصب المفعول به الياء في حالتي المثنى وجمع المذكر السالم.',
          },
        ],
      },
      {
        id: 'p5-a-u2-t3',
        number: 'الموضوع الثالث',
        title: 'قيم إنسانية وأدب',
        items: [
          {
            id: 'lesson-18',
            title: 'تطبيقات على الهمزة المتطرفة على السطر',
            type: 'spelling',
            typeLabel: 'قواعد إملائية تطبيقية',
            pageNumber: 98,
            description: 'تدريبات مكثفة على إتقان كتابة الهمزة المتطرفة في الجمل والنصوص.',
          },
          {
            id: 'lesson-19',
            title: 'أخي الإنسان',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 104,
            description: 'قصيدة عيسى الناعوري في نشر المحبة والسلام ونبذ الحروب والخلافات.',
          },
          {
            id: 'lesson-20',
            title: 'ثقتي أقوى من السخرية',
            type: 'reading',
            typeLabel: 'قراءة وتربية نفسية',
            pageNumber: 110,
            description: 'تعزيز صلابة الشخصية ومواجهة السخرية والتنمر بثقة وعزيمة.',
          },
          {
            id: 'lesson-21',
            title: 'السر أمانة',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 116,
            description: 'كتابة قصة قصيرة تبين أهمية كتمان الأسرار والأمانة والوفاء بالعهود.',
          },
        ],
      },
    ],
  },

  'unit-arabic-5-primary-03': {
    id: 'unit-arabic-5-primary-03',
    unitId: 'unit-arabic-5-primary-03',
    levelId: 'level-arabic-5-primary',
    subjectId: 'subject-arabic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · اللغة العربية',
    number: 'الوحدة الثالثة',
    title: 'جمال الاختلاف',
    bannerGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 45%, #2dd4bf 100%)',
    iconSymbol: '🌈',
    topics: [
      {
        id: 'p5-a-u3-t1',
        number: 'الموضوع الأول',
        title: 'التنوع سنة الحياة',
        items: [
          {
            id: 'lesson-22',
            title: 'التنوع حياة',
            type: 'listening',
            typeLabel: 'نص استماع',
            pageNumber: 122,
            description: 'تكامل البشر واختلاف مهاراتهم ومواهبهم التي تعمر الكون وتزدهر بها الحياة.',
          },
          {
            id: 'lesson-23',
            title: 'كيف يصبح العالم أجمل؟',
            type: 'reading',
            typeLabel: 'قراءة ومقال',
            pageNumber: 128,
            description: 'مقال فكري يناقش التعايش السلمي واحترام التنوع بين الثقافات والآراء.',
          },
          {
            id: 'lesson-24',
            title: 'المفعول لأجله',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 134,
            description: 'تعريف المفعول لأجله كمصدر منصوب يبيّن سبب حدوث الفعل وإعرابه بالفتحة.',
          },
        ],
      },
      {
        id: 'p5-a-u3-t2',
        number: 'الموضوع الثاني',
        title: 'التأمل والجمال',
        items: [
          {
            id: 'lesson-25',
            title: 'الهمزة المتطرفة على الألف',
            type: 'spelling',
            typeLabel: 'قواعد إملائية',
            pageNumber: 140,
            description: 'رسم الهمزة المتطرفة على الألف عندما يسبقها حرف مفتوح.',
          },
          {
            id: 'lesson-26',
            title: 'حائر أمام بائع الزهور',
            type: 'reading',
            typeLabel: 'قصة وأدب',
            pageNumber: 146,
            description: 'قصة وجدانية رقيقة في تأمل الجمال الطبيعي واختيار الهدايا المعبرة.',
          },
          {
            id: 'lesson-27',
            title: 'إعراب ظرفي الزمان والمكان',
            type: 'grammar',
            typeLabel: 'قواعد نحوية',
            pageNumber: 152,
            description: 'الظروف المنصوبة وإعراب شبه الجملة وتحديد دلالة الزمان والمكان.',
          },
        ],
      },
      {
        id: 'p5-a-u3-t3',
        number: 'الموضوع الثالث',
        title: 'التعايش والتعبير',
        items: [
          {
            id: 'lesson-28',
            title: 'تطبيقات على الهمزة المتطرفة على الألف',
            type: 'spelling',
            typeLabel: 'قواعد إملائية تطبيقية',
            pageNumber: 158,
            description: 'أنشطة تطبيقية لتثبيت رسم الهمزة المتطرفة على الألف ومقارنتها بالحالات الأخرى.',
          },
          {
            id: 'lesson-29',
            title: 'جمال التنوع',
            type: 'poetry',
            typeLabel: 'نص شعري',
            pageNumber: 164,
            description: 'نص شعري بديع في بهجة ألوان الطبيعة وتناغم الكائنات رغم تباينها.',
          },
          {
            id: 'lesson-30',
            title: 'الاختيار الصعب',
            type: 'reading',
            typeLabel: 'قراءة ومواقف',
            pageNumber: 170,
            description: 'موقف قصصي تربوي يدرب المتعلم على اتخاذ القرارات الحكيمة المتوازنة.',
          },
          {
            id: 'lesson-31',
            title: 'أصدقاء رغم الاختلاف',
            type: 'writing',
            typeLabel: 'تعبير كتابي',
            pageNumber: 176,
            description: 'كتابة مقال رأي حول قيمة الصداقة العميقة القادرة على احتواء الاختلافات.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // التربية الدينية الإسلامية - الصف الخامس الابتدائي
  // ==========================================
  'unit-islamic-5-primary-01': {
    id: 'unit-islamic-5-primary-01',
    unitId: 'unit-islamic-5-primary-01',
    levelId: 'level-islamic-5-primary',
    subjectId: 'subject-islamic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · التربية الدينية',
    number: 'الوحدة الأولى',
    title: 'الإيمان والسلام',
    bannerGradient: 'linear-gradient(135deg, #065f46 0%, #059669 45%, #10b981 100%)',
    iconSymbol: '🕌',
    topics: [
      {
        id: 'p5-i-u1-t1',
        number: 'الموضوع الأول',
        title: 'العقيدة والتوحيد',
        items: [
          {
            id: 'lesson-09',
            title: 'الإيمان بالكتب السماوية',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 6,
            description: 'معنى الإيمان بكتب الله المنزلة، التوراة، الإنجيل، الزبور، وصحف إبراهيم وموسى.',
          },
        ],
      },
      {
        id: 'p5-i-u1-t2',
        number: 'الموضوع الثاني',
        title: 'القرآن الكريم وتدبره',
        items: [
          {
            id: 'lesson-38',
            title: 'سورة الإنسان (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 12,
            description: 'تلاوة وحفظ آيات سورة الإنسان وتدبر نعم الله وجزاء الأبرار في الجنة.',
          },
        ],
      },
      {
        id: 'p5-i-u1-t3',
        number: 'الموضوع الثالث',
        title: 'السيرة النبوية والعبادات والقيم',
        items: [
          {
            id: 'lesson-39',
            title: 'صلح الحديبية',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 18,
            description: 'حكمة النبي ﷺ في إرساء دعائم السلام وشروط الصلح وبشائر الفتح المبين.',
          },
          {
            id: 'lesson-40',
            title: 'الصحابي الجليل أبو ذر الغفاري',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 24,
            description: 'إسلام الصحابي الجليل أبو ذر وجهره بالحق وزهده وورعه ومواقفه الخالدة.',
          },
          {
            id: 'lesson-41',
            title: 'رمضان شهر الصيام',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 30,
            description: 'فضل شهر رمضان ونزول القرآن فيه، وأركان الصيام وثمراته في تقوى القلوب.',
          },
          {
            id: 'lesson-42',
            title: 'حق الجار',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 36,
            description: 'وصايا النبي ﷺ بالجار وكف الأذى عنه والإحسان إليه ومساعدته في الشدائد.',
          },
        ],
      },
    ],
  },

  'unit-islamic-5-primary-02': {
    id: 'unit-islamic-5-primary-02',
    unitId: 'unit-islamic-5-primary-02',
    levelId: 'level-islamic-5-primary',
    subjectId: 'subject-islamic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · التربية الدينية',
    number: 'الوحدة الثانية',
    title: 'طريق الإيمان',
    bannerGradient: 'linear-gradient(135deg, #115e59 0%, #0d9488 45%, #14b8a6 100%)',
    iconSymbol: '📖',
    topics: [
      {
        id: 'p5-i-u2-t1',
        number: 'الموضوع الأول',
        title: 'القرآن الكريم والتجويد',
        items: [
          {
            id: 'lesson-43',
            title: 'القرآن الكريم آخر الكتب السماوية',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 42,
            description: 'خصائص القرآن الكريم وخلوده وإعجازه وحفظ الله تعالى له من كل تحريف.',
          },
          {
            id: 'lesson-44',
            title: 'سورة القيامة (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 48,
            description: 'تلاوة وتفسير آيات سورة القيامة واستحضار عظمة البعث والجزاء والحساب.',
          },
          {
            id: 'lesson-45',
            title: 'أحكام التجويد ومخارج الحروف',
            type: 'tajweed',
            typeLabel: 'أحكام التجويد',
            pageNumber: 54,
            description: 'مخارج الحروف الأساسية وإتقان النطق السليم وتطبيق أحكام التلاوة.',
          },
        ],
      },
      {
        id: 'p5-i-u2-t2',
        number: 'الموضوع الثاني',
        title: 'السيرة النبوية والصحابة',
        items: [
          {
            id: 'lesson-46',
            title: 'رسائل النبي إلى الملوك',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 60,
            description: 'عالمية الدعوة الإسلامية وكتب النبي ﷺ إلى النجاشي وكسرى وقيصر والمقوقس.',
          },
          {
            id: 'lesson-47',
            title: 'الصحابي الجليل زيد بن ثابت',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 66,
            description: 'كاتب الوحي النبوي وجهوده الرائدة في جمع القرآن الكريم وإتقان لغات الأمم.',
          },
        ],
      },
      {
        id: 'p5-i-u2-t3',
        number: 'الموضوع الثالث',
        title: 'العبادات والقيم الإسلامية',
        items: [
          {
            id: 'lesson-48',
            title: 'الصوم',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 72,
            description: 'شروط وجوب الصيام وصحته، ومبطلاته، وسننه وآدابه السامية.',
          },
          {
            id: 'lesson-49',
            title: 'السعي في طلب العلم',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 78,
            description: 'مكانة العلم والعلماء في الإسلام وحث القرآن والسنة على التفكر وطلب المعرفة.',
          },
        ],
      },
    ],
  },

  'unit-islamic-5-primary-03': {
    id: 'unit-islamic-5-primary-03',
    unitId: 'unit-islamic-5-primary-03',
    levelId: 'level-islamic-5-primary',
    subjectId: 'subject-islamic-5-primary',
    stageBadge: 'الصف الخامس الابتدائي · التربية الدينية',
    number: 'الوحدة الثالثة',
    title: 'الدين والتواضع',
    bannerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #3b82f6 100%)',
    iconSymbol: '⭐',
    topics: [
      {
        id: 'p5-i-u3-t1',
        number: 'الموضوع الأول',
        title: 'الوحي والتنزيل',
        items: [
          {
            id: 'lesson-50',
            title: 'نزول القرآن الكريم',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 84,
            description: 'نزول القرآن الكريم في ليلة القدر وتدرج نزوله وفق الوقائع والأحداث.',
          },
          {
            id: 'lesson-51',
            title: 'سورة المدثر (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 90,
            description: 'آيات سورة المدثر وأمر الله تعالى بالإنذار والطهارة والصبر في الدعوة.',
          },
        ],
      },
      {
        id: 'p5-i-u3-t2',
        number: 'الموضوع الثاني',
        title: 'الغزوات والبطولات الإسلامية',
        items: [
          {
            id: 'lesson-52',
            title: 'غزوة خيبر',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 96,
            description: 'أسباب فتح حصون خيبر وبطولات الإمام علي بن أبي طالب والتسامح الإسلامي.',
          },
          {
            id: 'lesson-53',
            title: 'الصحابي الجليل سعد بن أبي وقاص',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 102,
            description: 'سيرة فارس الإسلام وأول من رمى بسهم في سبيل الله ومكانته ودعاؤه المستجاب.',
          },
        ],
      },
      {
        id: 'p5-i-u3-t3',
        number: 'الموضوع الثالث',
        title: 'العبادات والأخلاق الكريمة',
        items: [
          {
            id: 'lesson-54',
            title: 'شروط الصوم وآدابه',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 108,
            description: 'الأركان والسنن والمستحبات أثناء الصيام، وحفظ اللسان والجوارح.',
          },
          {
            id: 'lesson-55',
            title: 'التواضع خلق المسلم',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 114,
            description: 'أهمية التواضع ولين الجانب، وتحذير الإسلام من الكبر والخيلاء والفخر.',
          },
        ],
      },
    ],
  },

  // ==========================================
  // التربية الدينية - الصف الأول الإعدادي
  // ==========================================
  'unit-islamic-1-prep-01': {
    id: 'unit-islamic-1-prep-01',
    unitId: 'unit-islamic-1-prep-01',
    levelId: 'level-islamic-1-prep',
    subjectId: 'subject-islamic-1-prep',
    stageBadge: 'الصف الأول الإعدادي · التربية الدينية',
    number: 'الوحدة الأولى',
    title: 'الإسلام دين الرحمة والسلام',
    bannerGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 45%, #0e7490 100%)',
    iconSymbol: '🕌',
    topics: [
      {
        id: 'p1-i-u1-t1',
        number: 'الموضوع الأول',
        title: 'العقيدة والتجويد',
        items: [
          {
            id: 'lesson-32',
            title: 'الإيمان بالكتب السماوية',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 8,
            description: 'الركن الثالث من أركان الإيمان ووجوب التصديق بالكتب المنزلة من عند الله.',
          },
          {
            id: 'lesson-33',
            title: 'سورة الإنسان (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 14,
            description: 'تدبر آيات سورة الإنسان وجزاء الصابرين والشاكرين ومظاهر الرحمة الإلهية.',
          },
          {
            id: 'lesson-34',
            title: 'أحكام النون الساكنة والتنوين',
            type: 'tajweed',
            typeLabel: 'أحكام التجويد',
            pageNumber: 20,
            description: 'الإظهار الحلقي، الإدغام، الإقلاب، والإخفاء الحقيقي مع تطبيقات عملية.',
          },
        ],
      },
      {
        id: 'p1-i-u1-t2',
        number: 'الموضوع الثاني',
        title: 'العبادات والسيرة النبوية',
        items: [
          {
            id: 'lesson-35',
            title: 'رمضان شهر الصيام',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 26,
            description: 'المقاصد التربوية والروحية لصوم رمضان وتأثيره في وحدة الأمة وتراحمها.',
          },
          {
            id: 'lesson-36',
            title: 'صلح الحديبية',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 32,
            description: 'الرؤية الاستراتيجية للنبي ﷺ وإرساء ثقافة الحوار والسلام والالتزام بالعهود.',
          },
          {
            id: 'lesson-37',
            title: 'أبو ذر الغفاري',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 38,
            description: 'قدوة الصحابة في الزهد ونصرة المظلومين والصدق الذي لا يخشى في الله لومة لائم.',
          },
        ],
      },
      {
        id: 'p1-i-u1-t3',
        number: 'الموضوع الثالث',
        title: 'الأخلاق والتقييم',
        items: [
          {
            id: 'lesson-56',
            title: 'حق الجار',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 44,
            description: 'الرحمة بالجار وتأكيد النبي ﷺ على كف الأذى ورعاية حرمات الجيران.',
          },
          {
            id: 'lesson-57',
            title: 'مراجعة على الوحدة الأولى',
            type: 'review',
            typeLabel: 'مراجعة وتقييم',
            pageNumber: 50,
            description: 'أسئلة وتطبيقات شاملة واختبارات مرحلية على موضوعات الوحدة الأولى.',
          },
        ],
      },
    ],
  },

  'unit-islamic-1-prep-02': {
    id: 'unit-islamic-1-prep-02',
    unitId: 'unit-islamic-1-prep-02',
    levelId: 'level-islamic-1-prep',
    subjectId: 'subject-islamic-1-prep',
    stageBadge: 'الصف الأول الإعدادي · التربية الدينية',
    number: 'الوحدة الثانية',
    title: 'طريق الإيمان',
    bannerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #0284c7 100%)',
    iconSymbol: '📖',
    topics: [
      {
        id: 'p1-i-u2-t1',
        number: 'الموضوع الأول',
        title: 'القرآن والتجويد',
        items: [
          {
            id: 'lesson-58',
            title: 'القرآن الكريم (آخر الكتب السماوية)',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 56,
            description: 'شمولية رسالة القرآن الكريم ومنهجه القويم في هداية البشرية وإصلاح المجتمعات.',
          },
          {
            id: 'lesson-59',
            title: 'سورة القيامة (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 62,
            description: 'تفسير سورة القيامة، وأقسام النفس البشرية، وأهوال يوم البعث واللقاء.',
          },
          {
            id: 'lesson-60',
            title: 'مخارج الحروف',
            type: 'tajweed',
            typeLabel: 'أحكام التجويد',
            pageNumber: 68,
            description: 'المخارج الخمسة العامة: الجوف، الحلق، اللسان، الشفتان، والخيشوم.',
          },
        ],
      },
      {
        id: 'p1-i-u2-t2',
        number: 'الموضوع الثاني',
        title: 'العبادات والسيرة العطرة',
        items: [
          {
            id: 'lesson-61',
            title: 'معنى الصوم',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 74,
            description: 'امتناع الجوارح عن المعاصي ومقاصد الصوم في تهذيب السلوك والارتقاء بالنفس.',
          },
          {
            id: 'lesson-62',
            title: 'رسائل النبي ﷺ إلى الملوك',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 80,
            description: 'بلاغ الرسالة العالمية والدبلوماسية الراقية للرسول الأعظم في مخاطبة القادة.',
          },
          {
            id: 'lesson-63',
            title: 'زيد بن ثابت رضي الله عنه جامع القرآن',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 86,
            description: 'أعظم مشروع توثيقي في التاريخ الإسلامي: جمع القرآن في مصحف واحد بإشرافه.',
          },
        ],
      },
      {
        id: 'p1-i-u2-t3',
        number: 'الموضوع الثالث',
        title: 'العلم والمراجعة',
        items: [
          {
            id: 'lesson-64',
            title: 'طلب العلم',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 92,
            description: 'مكانة العلم في نهضة الأمم ودعوة الإسلام المستمرة للتعلم والتفوق والإتقان.',
          },
          {
            id: 'lesson-65',
            title: 'مراجعة على الوحدة الثانية',
            type: 'review',
            typeLabel: 'مراجعة وتقييم',
            pageNumber: 98,
            description: 'تدريبات مرحلية ونماذج أسئلة لتقييم استيعاب دروس الوحدة الثانية.',
          },
        ],
      },
    ],
  },

  'unit-islamic-1-prep-03': {
    id: 'unit-islamic-1-prep-03',
    unitId: 'unit-islamic-1-prep-03',
    levelId: 'level-islamic-1-prep',
    subjectId: 'subject-islamic-1-prep',
    stageBadge: 'الصف الأول الإعدادي · التربية الدينية',
    number: 'الوحدة الثالثة',
    title: 'الدين والتواضع',
    bannerGradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 45%, #6366f1 100%)',
    iconSymbol: '⭐',
    topics: [
      {
        id: 'p1-i-u3-t1',
        number: 'الموضوع الأول',
        title: 'الوحي والتفسير والعبادات',
        items: [
          {
            id: 'lesson-66',
            title: 'نزول القرآن الكريم',
            type: 'faith',
            typeLabel: 'عقيدة وتوحيد',
            pageNumber: 104,
            description: 'نزول القرآن الكريم من اللوح المحفوظ إلى السماء الدنيا ثم منجمًا عبر 23 سنة.',
          },
          {
            id: 'lesson-67',
            title: 'سورة المدثر (تلاوة وحفظ وتفسير)',
            type: 'quran',
            typeLabel: 'قرآن وتفسير',
            pageNumber: 110,
            description: 'أوامر الطهارة الظاهرة والباطنة وهجر الرجز والثبات على الحق.',
          },
          {
            id: 'lesson-68',
            title: 'شروط الصوم وآدابه',
            type: 'worship',
            typeLabel: 'فقه وعبادات',
            pageNumber: 116,
            description: 'شروط الوجوب والصحة ومفطرات الصيام وآداب الإفطار والسحور.',
          },
        ],
      },
      {
        id: 'p1-i-u3-t2',
        number: 'الموضوع الثاني',
        title: 'السيرة النبوية والبطولات',
        items: [
          {
            id: 'lesson-69',
            title: 'غزوة خيبر',
            type: 'seerah',
            typeLabel: 'سيرة نبوية',
            pageNumber: 122,
            description: 'دروس فتح خيبر والبطولة والإقدام والوفاء بالمعاهدات ومكارم الأخلاق في الحرب.',
          },
          {
            id: 'lesson-70',
            title: 'سعد بن أبي وقاص',
            type: 'characters',
            typeLabel: 'سير وشخصيات',
            pageNumber: 128,
            description: 'سيرة قائد معركة القادسية وواحد من العشرة المبشرين بالجنة.',
          },
        ],
      },
      {
        id: 'p1-i-u3-t3',
        number: 'الموضوع الثالث',
        title: 'الأخلاق والتقييم النهائي',
        items: [
          {
            id: 'lesson-71',
            title: 'التواضع خلق المسلم',
            type: 'values',
            typeLabel: 'قيم وأخلاق',
            pageNumber: 134,
            description: 'مفهوم التواضع الحقيقي وأثره في نيل محبة الله والناس ونبذ التعالي.',
          },
          {
            id: 'lesson-72',
            title: 'مراجعة على الوحدة الثالثة',
            type: 'review',
            typeLabel: 'مراجعة وتقييم',
            pageNumber: 140,
            description: 'ملخص المفاهيم والأسئلة الشاملة لمقرر الوحدة الثالثة.',
          },
          {
            id: 'lesson-73',
            title: 'تقييمات (التقييم النهائي)',
            type: 'review',
            typeLabel: 'التقييم النهائي الشامل',
            pageNumber: 146,
            description: 'نماذج امتحانات شاملة للفصل الدراسي الأول في مادة التربية الدينية الإسلامية.',
          },
        ],
      },
    ],
  },
};

// Also import prep1Themes and register them into allCurriculumUnitThemes
prep1Themes.forEach((t) => {
  const gradient =
    t.colorScheme === 'emerald'
      ? 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0e7490 100%)'
      : 'linear-gradient(135deg, #312e81 0%, #3730a3 40%, #4f46e5 100%)';

  allCurriculumUnitThemes[t.unitId] = {
    id: t.id,
    unitId: t.unitId,
    levelId: 'level-arabic-1-prep',
    subjectId: 'subject-arabic-1-prep',
    stageBadge: 'الصف الأول الإعدادي · اللغة العربية',
    number: t.number,
    title: t.title,
    bannerGradient: gradient,
    iconSymbol: t.id === 'theme-1' ? '📖' : '🎨',
    diagnostic: t.diagnostic
      ? {
          id: t.diagnostic.id,
          title: t.diagnostic.title,
          type: t.diagnostic.type as CurriculumSectionType,
          typeLabel: t.diagnostic.typeLabel,
          pageNumber: t.diagnostic.pageNumber,
          description: t.diagnostic.description,
        }
      : undefined,
    topics: t.topics.map((tp) => ({
      id: tp.id,
      number: tp.number,
      title: tp.title,
      items: tp.items.map((it) => ({
        id: it.id,
        title: it.title,
        type: it.type as CurriculumSectionType,
        typeLabel: it.typeLabel,
        pageNumber: it.pageNumber,
        description: it.description,
      })),
    })),
  };
});

/**
 * Get unit theme by unitId, with dynamic fallback if not explicitly registered
 */
export function getUnitTheme(
  unitId: string,
  levelTitle?: string,
  subjectTitle?: string,
  unitTitle?: string,
  lessons?: Array<{ id: string; title: string }>,
): CurriculumUnitTheme {
  const registered = allCurriculumUnitThemes[unitId];
  if (registered) return registered;

  // Fallback for any newly added or arbitrary unit
  const fallbackItems: CurriculumIndexItem[] = (lessons || []).map((l, idx) => ({
    id: l.id,
    title: l.title,
    type: 'reading',
    typeLabel: 'درس',
    pageNumber: (idx + 1) * 6,
    description: l.title,
  }));

  return {
    id: unitId,
    unitId,
    levelId: '',
    subjectId: '',
    stageBadge: `${levelTitle || ''} · ${subjectTitle || ''}`,
    number: 'الوحدة الدراسية',
    title: unitTitle || 'الوحدة',
    bannerGradient: 'linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #0e7490 100%)',
    iconSymbol: '📚',
    topics: [
      {
        id: `${unitId}-topic-1`,
        number: 'الموضوع الرئيسي',
        title: unitTitle || 'دروس الوحدة',
        items: fallbackItems,
      },
    ],
  };
}
