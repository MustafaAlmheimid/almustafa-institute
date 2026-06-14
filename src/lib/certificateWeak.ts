import type { Student } from "./store";
import { getSurah } from "./surahs";

// إضافة النوع الجديد "star" للشهادات
export type CertType = "surah" | "juz" | "star";

export interface CertOptions {
  type: CertType;
  surah?: number; // لشهادة السورة
  juz?: number;   // لشهادة الجزء
  reason?: string; // لشهادة نجم الأسبوع
}

export function generateCertificate(student: Student, opts: CertOptions) {
  const logoUrl = `${window.location.origin}/logo.png`;
  const photoUrl = student.photo;

  let title = "";
  let subtitle = "";
  let body = "";
  let detail = "";

  if (opts.type === "surah" && opts.surah) {
    const s = getSurah(opts.surah)!;
    title = "شهادة إتمام حفظ سورة";
    subtitle = s.name;
    body = `يهنئ إدارة معهد المصطفى بتقديم هذه الشهادة إلى الطالب/ة`;
    detail = `لإتمام حفظ سورة <b>${s.name}</b> بتجويد صحيح وأداء ممتاز`;
  } else if (opts.type === "juz" && opts.juz) {
    title = "شهادة إتمام حفظ جزء";
    subtitle = `الجزء ${opts.juz}`;
    body = `يهنئ إدارة معهد المصطفى بتقديم هذه الشهادة إلى الطالب/ة`;
    detail = `لإتمام حفظ <b>الجزء ${opts.juz}</b> بتجويد صحيح وأداء ممتاز`;
  } else if (opts.type === "star") {
    title = "شـهادة نـجـم الأسـبـوع";
    subtitle = "تميز وإبداع مستمر";
    body = `يسر إدارة معهد المصطفى أن تمنح لقب نجم الأسبوع للطالب/ة المتميز`;
    // إذا لم يتم كتابة سبب، نضع نصاً افتراضياً جميلاً
    const actualReason = opts.reason?.trim() || "لتميزه الاستثنائي واجتهاده المبارك خلال هذا الأسبوع";
    detail = `<span style="color: #d4af37; font-size: 22px; font-weight: bold;">🌟 نـجـم الأسبوع 🌟</span><br/><br/>${actualReason}`;
  }

  const dateStr = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const win = window.open("", "_blank");
  if (!win) return;

  // كود الـ HTML والـ CSS لضبط المقاس بدقة على ورق A4 عند الطباعة
  win.document.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${student.fullName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;700;900&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Cairo', 'Amiri', serif;
          background: #f4f6f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ضبط أبعاد الشهادة لتطابق الـ A4 تماماً */
        .cert-container {
          width: 210mm;
          height: 297mm;
          background: #ffffff;
          padding: 20mm;
          position: relative;
          border: 15px double #065f46;
          outline: 3px solid #d4af37;
          outline-offset: -10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        /* زخارف إسلامية جانبية */
        .cert-container::before {
          content: "";
          position: absolute;
          top: 10px; bottom: 10px; left: 10px; right: 10px;
          border: 1px solid #d4af37;
          pointer-events: none;
        }

        .header-logos {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10mm;
        }

        .logo-box img {
          height: 75px;
          object-fit: contain;
        }

        .cert-title {
          text-align: center;
          margin-bottom: 8mm;
        }

        .cert-title h1 {
          font-family: 'Amiri', serif;
          font-size: 38px;
          color: #065f46;
          font-weight: 700;
          margin-bottom: 2px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
        }

        .cert-title h2 {
          font-size: 18px;
          color: #d4af37;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .divider {
          width: 60%;
          height: 2px;
          background: linear-gradient(to left, transparent, #d4af37, #065f46, #d4af37, transparent);
          margin: 4mm 0;
        }

        .body-text {
          text-align: center;
          font-size: 18px;
          color: #4b5563;
          line-height: 1.8;
          margin-top: 5mm;
        }

        .student-name {
          font-family: 'Amiri', serif;
          font-size: 34px;
          font-weight: bold;
          color: #065f46;
          margin: 6mm 0;
          padding: 2mm 15mm;
          border-bottom: 2px dashed #d4af37;
          display: inline-block;
        }

        .photo-wrap {
          width: 110mm;
          height: 110mm;
          margin: 5mm 0;
          border: 4px solid #065f46;
          outline: 2px solid #d4af37;
          outline-offset: 3px;
          border-radius: 15px;
          overflow: hidden;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-box {
          text-align: center;
          font-size: 18px;
          color: #1f2937;
          max-width: 85%;
          line-height: 1.6;
          background: #fcfdfd;
          padding: 4mm 6mm;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .verse {
          font-family: 'Amiri', serif;
          font-size: 20px;
          font-weight: bold;
          color: #065f46;
          margin: 6mm 0;
          text-align: center;
        }

        .date-box {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 5mm;
        }

        .signatures {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 10mm;
          margin-top: 5mm;
        }

        .sign {
          text-align: center;
          width: 30%;
        }

        .sign .line {
          width: 80%;
          height: 1px;
          background: #cbd5e1;
          margin: 0 auto 8px auto;
        }

        .sign .role {
          font-size: 13px;
          font-weight: bold;
          color: #065f46;
        }

        .sign .name {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        /* إعدادات أمر الطباعة التلقائي لورق A4 وبدون هوامش إضافية */
        @media print {
          body { background: none; }
          .cert-container {
            box-shadow: none;
            border-shadow: none;
            width: 210mm;
            height: 297mm;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>

      <div class="cert-container">
        <div class="header-logos">
          <div class="logo-box"><img src="${logoUrl}" alt="logo" onerror="this.style.display='none'" /></div>
          <div class="logo-box" style="transform: scaleX(-1);"><img src="${logoUrl}" alt="logo" onerror="this.style.display='none'" /></div>
        </div>

        <div class="cert-title">
          <h1>${title}</h1>
          <h2>${subtitle}</h2>
          <div class="divider"></div>
        </div>

        <div class="body-text">
          <p>${body}</p>
          <div class="student-name">${student.fullName}</div>
        </div>

        <div class="photo-wrap">
          <img src="${photoUrl}" alt="${student.fullName}" onerror="this.src='/students/student1.png'" />
        </div>

        <div class="detail-box">
          ${detail}
        </div>

        <div class="verse">
          ﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾
        </div>

        <div class="date-box">
          حرر في: ${dateStr}
        </div>

        <div class="signatures">
          <div class="sign">
            <div class="line"></div>
            <div class="role">المعلم المسؤول</div>
            <div class="name">${student.teacher}</div>
          </div>
          <div class="sign">
            <div class="line"></div>
            <div class="role">المدير التنفيذي</div>
            <div class="name">إدارة المعهد</div>
          </div>
          <div class="sign">
            <div class="line"></div>
            <div class="role">المدير العام</div>
            <div class="name">معهد المصطفى</div>
          </div>
        </div>
      </div>

      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
            // إغلاق النافذة المنبثقة تلقائياً بعد إنهاء الطباعة أو إلغائها لراحة المستخدم
            window.onafterprint = () => window.close();
          }, 300);
        });
      </script>
    </body>
    </html>
  `);
  win.document.close();
}