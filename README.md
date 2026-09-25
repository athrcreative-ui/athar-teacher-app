# قالب تطبيق المعلم التعليمي

تطبيق عربي ثابت مبني بـ React وTypeScript وVite. يعرض النموذج الحالي هوية محمد سيف الدين، بينما تظل الهوية والمحتوى بيانات منفصلة عن الواجهات ليُعاد استخدام القالب مع معلم آخر دون تعديل المكونات.

## المتطلبات والتشغيل

استخدم Node.js 22.12 أو أحدث وnpm. تم التحقق من الإصدار الحالي باستخدام Node.js 24.18 وnpm 11.16.

```bash
npm install
npm run dev
```

الفحوص الأساسية قبل أي إصدار:

```bash
npm run validate:content
npm run typecheck
npm run test:run
npm run check
npm run build
```

`check` يشغّل فحص المحتوى والأنواع والاختبارات وفحص أنماط الأسرار. أما `build` فيشغّل `check` مرة واحدة ثم ينشئ `dist`، بلا استدعاء دائري بين الأوامر.

## Preview وShare وDeploy

- `npm run preview`: معاينة محلية لملفات `dist`؛ ليست رابط مشاركة دائمًا.
- Share: مشاركة فرع أو Pull Request للمراجعة؛ لا تعني أن النسخة منشورة.
- Deploy: رفع `dist` إلى الاستضافة بعد اعتماد التغييرات. التطبيق يستخدم `HashRouter` فتعمل روابط مثل `/#/lessons/lesson-01` على الاستضافة الثابتة دون rewrite إضافي.

مسار الإصدار المختصر: اسحب النسخة المعتمدة → شغّل `npm run check` → شغّل `npm run build` → عاين → انشر نفس الالتزام الذي تم فحصه.

## أماكن البيانات

- الهوية والألوان والتواصل: `src/data/teacher.json`
- أصول الهوية: `public/assets/brand/`
- فهرس المنهج: `src/data/curriculum.json`
- محتوى كل درس: `src/data/lessons/<lesson-id>.json`
- عقد البيانات والتحقق وقت التشغيل: `src/content/schema.ts`

`teacher.json` هو المصدر الوحيد للاسم والصورة واللوجو والتواصل. إصدار العقد الحالي `schemaVersion: 1`. يتضمن `theme` الرموز الدلالية: `primary` و`primaryContrast` و`accent` و`background` و`surface` و`text` و`mutedText` و`border` و`focus` و`fontFamily`، مع `secondary` اختياري. يمكن أن تكون `photo` و`logo` بقيمة `null`، ويمكن حذف الحقول التعريفية الاختيارية بدل اختراع بيانات.

## تحديث محتوى درس

عدّل ملف الدرس المقصود فقط عند إضافة مورد إلى درس موجود. استخدم `id` ثابتًا وفريدًا بصيغة kebab-case. الروابط المقبولة هي HTTPS بلا اسم مستخدم أو كلمة مرور، أو مسار محلي آمن يبدأ بـ `/assets/`. النصوص بيانات نصية فقط وليست HTML.

### فيديو YouTube

```json
{
  "id": "video-intro",
  "title": "عنوان الفيديو",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "description": "وصف اختياري",
  "kind": "youtube",
  "action": "open"
}
```

الأنواع المدعومة في `videos`: `youtube` و`direct` و`link`. لا يُنشأ اتصال بـ YouTube قبل ضغط المستخدم على التشغيل. للفيديو المباشر يمكن إضافة `captions` بالشكل `{ "src": "/assets/...vtt", "label": "العربية", "language": "ar" }`، ويصدر الفاحص تحذيرًا عند غيابها.

### نشاط أو اختبار خارجي

أضف المورد إلى `activities` أو `assessments`:

```json
{
  "id": "activity-review",
  "title": "نشاط المراجعة",
  "url": "https://example.com/activity",
  "description": "وصف اختياري",
  "kind": "link",
  "action": "open"
}
```

التطبيق يفتح المصدر الخارجي فقط ولا يخزن إجابات أو درجات.

### ملف

```json
{
  "id": "worksheet-01",
  "title": "ورقة العمل",
  "url": "/assets/lessons/worksheet-01.pdf",
  "format": "PDF",
  "kind": "link",
  "action": "download"
}
```

`action: "download"` يستخدم تنزيل المتصفح مع الملفات المحلية فقط؛ الرابط الخارجي يظل فتحًا آمنًا في تبويب جديد. اختبر الموارد الخارجية في نافذة خاصة لأن صحة الرابط لا تضمن الإتاحة العامة أو غياب تسجيل الدخول.

### صوت شرح أو صورة تلخيص

الصوت المباشر داخل `explanation.audio` يحتاج `kind: "direct"` ويمكن إضافة `transcript`. صورة التلخيص داخل `summary.resources` تحتاج `kind: "image"` و`alt` وصفيًا:

```json
{
  "id": "summary-map",
  "title": "خريطة الدرس",
  "url": "/assets/lessons/summary-map.webp",
  "kind": "image",
  "alt": "وصف محتوى الخريطة",
  "action": "open"
}
```

### واجب

أضف إلى `homework` عنصرًا يحتوي `id` و`title` و`instructions` و`resources`. يقبل `dueDate` اختياريًا كتاريخ حقيقي بصيغة `YYYY-MM-DD`. لا توجد خاصية تسليم أو رفع ملفات.

## إضافة درس جديد

1. أضف مرجع `id` و`title` إلى الوحدة في `src/data/curriculum.json`.
2. أنشئ `src/data/lessons/<id>.json` واجعل `id` مطابقًا لاسم الملف.
3. استخدم العقد التالي ثم أضف المحتوى المتاح فقط:

```json
{
  "schemaVersion": 1,
  "id": "lesson-03",
  "explanation": { "text": "", "audio": null },
  "summary": { "text": "", "resources": [] },
  "videos": [],
  "activities": [],
  "assessments": [],
  "files": [],
  "homework": []
}
```

لا يلزم تعديل أي Component؛ ملفات الدروس تُكتشف عبر `import.meta.glob`.

## تغيير هوية المعلم

حدّث `src/data/teacher.json` وانقل الأصول إلى `public/assets/brand/` ثم حدّث مساراتها. حافظ على أسماء الرموز الدلالية وعلى تباين الألوان، وشغّل بوابة الفحص. لا تنقل سياق المنهج إلى ملف الهوية؛ أسماء المستوى والمادة والوحدة تخص `curriculum.json`.

## حدود النسخة

المشروع مكتبة تعليمية ثابتة بلا تسجيل دخول أو مستخدمين أو قاعدة بيانات أو LMS أو Backend أو تحليلات أو تتبع تقدم أو درجات أو تسليم واجبات أو Chat أو مدفوعات أو CMS. قسم «اسألني وأنا هشرح لك» يعرض أن المساعد غير متاح فقط.

راجع `RELEASE_CHECKLIST.md` قبل النشر، و`AGENTS.md` عند تنفيذ تحديثات محتوى لاحقة.
