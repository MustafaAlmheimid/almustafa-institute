# دليل النشر على Render + Neon

## نظرة عامة

المشروع مكون من جزئين:
1. **Frontend** — React + Vite (static files)
2. **Backend** — Express + Prisma (API server)
3. **Database** — Neon PostgreSQL

في البيئة المحلية: السيرفر يشغل على `localhost:3001` والفرونت على `localhost:5173`

في الإنتاج: السيرفر يشغل على Render ويقدم ملفات الفرونت الثابتة من `dist/`

---

## الخطوة 1: إنشاء قاعدة بيانات على Neon

### 1.1 التسجيل
1. انتقل إلى [neon.tech](https://neon.tech)
2. سجّل حساب مجاني (أو سجّل دخول بـ GitHub)

### 1.2 إنشاء Project
1. اضغط **"New Project"**
2. اختر اسم للمشروع: `al-mustafa-institute`
3. اختر الموقع الأقرب إليك (مثلاً `us-east-1`)
4. اضغط **"Create Project"**

### 1.3 الحصول على Connection String
1. في الداشبورد، اضغط على تاب **"Connection Details"**
2. انسخ الـ **Connection String** الكامل. راح يكون شكله هيك:
   ```
   postgresql://almustafa:xxxxxxxx@ep-xxx.us-east-1.aws.neon.tech/almustafa?sslmode=require
   ```
3. احفظه في ملف تيكست لأنك راح تحتاجه

---

## الخطوة 2: تحضير المشروع محلياً

### 2.1 تثبيت الحزم
تأكد إنك في مجلد المشروع وشغّل:
```bash
npm install
```

### 2.2 تحديث ملف .env
افتح ملف `.env` وعدّل `DATABASE_URL`:
```env
DATABASE_URL="postgresql://almustafa:xxxxxxxx@ep-xxx.us-east-1.aws.neon.tech/almustafa?sslmode=require"
FRONTEND_URL="http://localhost:5173"
PORT=3001
```

### 2.3 توليد Prisma Client
```bash
npx prisma generate
```

### 2.4 دفع المخطط إلى Neon
هاي الأمر بينشئ الجداول في قاعدة البيانات على Neon:
```bash
npx prisma db push
```

> إذا راجع لك خطأ، تأكد من أن `DATABASE_URL` صحيح وأن الإنترنت شغال.

### 2.5 اختبار محلياً
الآن شغّل السيرفر والفرونت معاً:
```bash
npm run dev
```

- الفرونت: http://localhost:5173
- السيرفر: http://localhost:3001
- البيانات: راح تتحفظ في Neon بدل localStorage

---

## الخطوة 3: النشر على Render

### 3.1 إرسال الكود إلى GitHub
1. أنشئ مخزن جديد على GitHub (مثلاً `al-mustafa-institute`)
2. ارفع كل الملفات إليه
3. تأكد من أن ملف `.env` مضاف إلى `.gitignore` وما ترفعه بشكل علني إلى GitHub

### 3.2 ربط Render بـ GitHub
1. انتقل إلى [render.com](https://render.com)
2. سجّل دخول باستخدام GitHub
3. اضغط **"New +"** → **"Web Service"**
4. اختر مخزن `al-mustafa-institute` من GitHub

### 3.3 إعدادات الخدمة
املأ الحقول بهاي الطريقة:

| الحقل | القيمة |
|---------|--------|
| **Name** | al-mustafa-institute |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run render:build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 3.4 إضافة Environment Variables
اضغط **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | الـ Connection String اللي انسخته من Neon |
| `FRONTEND_URL` | الرابط اللي راح يعطيك Render (مثلاً `https://al-mustafa-institute.onrender.com`) |

> ملاحظة: لا تحتاج تعيين `PORT` — Render بيعيّنه تلقائياً.

### 3.5 انشاء قاعدة بيانات على Render (اختياري)
إذا بتحب تستخدم قاعدة بيانات مجانية من Render بدل Neon:
1. في الداشبورد، اضغط **"New +"** → **"PostgreSQL"**
2. اختر اسم: `al-mustafa-db`
3. اختر الخطة: Free
4. بعد الإنشاء، انسخ الـ **Internal Database URL** واستخدمه كـ `DATABASE_URL`

### 3.6 النشر
اضغط **"Create Web Service"**

الآن Render راح يبني وينشر تلقائياً. انتظر حتى تشوف الحالة "Live".

---

## الخطوة 4: التحقق من النشر

### 4.1 فحص الصحة
افتح الرابط اللي اعطاك Render (مثلاً):
```
https://al-mustafa-institute.onrender.com/api/health
```

لازم يرجع:
```json
{ "ok": true }
```

### 4.2 فحص الطلاب
```
https://al-mustafa-institute.onrender.com/api/students
```

لازم يرجع قائمة بالطلاب.

### 4.3 فتح الموقع
```
https://al-mustafa-institute.onrender.com
```

---

## الخطوة 5: تشغيل محلي + التطبيق على Render

بعد النشر على Render، الموقع راح يشتغل كـ **Monolith** (السيرفر والفرونت معاً).

لو بدك تشغل الفرونت محلي والسيرفر على Render:

### 5.1 تحديث vite.config.ts
افتح `vite.config.ts` وغيّر الـ proxy:
```ts
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'https://al-mustafa-institute.onrender.com', // رابط Render
        changeOrigin: true,
      },
    },
  },
});
```

### 5.2 تشغيل محلي
```bash
npm run dev
```

الآن الفرونت على `localhost:5173` راح يتواصل مع Render API!

---

## ملفات مهمة في المشروع

```
├── .env                          # متغيرات البيئة (ما بتترفع على GitHub)
├── .gitignore                    # تجاهل ملفات حساسة
├── render.yaml                   # إعدادات Render Blueprint
├── package.json                  # سكريبتات البناء والتشغيل
├── vite.config.ts                # إعدادات Vite + Proxy
├── prisma/
│   └── schema.prisma             # تعريف جداول الـ Database
├── server/
│   └── index.ts                  # Express API Server
└── src/
    ├── lib/
    │   ├── api.ts                  # طبقة الاتصال بالـ Backend
    │   └── store.tsx               # إدارة الحالة (حالياً localStorage)
    └── ...
```

---

## حل المشاكل الشائعة

### المشكل: "Cannot find module '@prisma/client'"
الحل: تأكد من أن `prisma generate` بيتنفذ قبل البناء:
```bash
npm run render:build
```

### المشكل: "Database connection failed"
الحل: تأكد من:
1. `DATABASE_URL` صحيح في Render Environment Variables
2. Neon database مفعولة (في داشبورد Neon اضغط على "Start" إذا كان موقفة)

### المشكل: "CORS error"
الحل: أضف الـ FRONTEND_URL الصحيح في Render Environment Variables.

### المشكل: "404 on /api/students"
الحل: تأكد من أن السيرفر شغال. افتح لوغز Render وبحث عن أخطاء.

---

## ملاحظات أمنية

1. **لا ترفع `.env` على GitHub** — الملف مضاف لـ `.gitignore`
2. **قاعدة البيانات Neon المجانية** تنام بعد 30 يوم من عدم النشط — للإنتاج اشتر خطة مدفوعة
3. **Render Free tier** بينام بعد 15 دقيقة من عدم النشط — الزيارة الأولى قد تأخذ دقائق

---

إذا واجهتك أي مشكلة خبرني وبساعدك! 🚀
