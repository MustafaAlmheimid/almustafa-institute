import type { Student } from "./store";
import { getSurah } from "./surahs";

export type CertType = "surah" | "juz" | "star";

export interface CertOptions {
  type: CertType;
  surah?: number;
  juz?: number;
  reason?: string;
  supervisorName?: string;     // اسم المشرف (متغير يدوي)
  generalSupervisorName?: string; // اسم المشرف العام (متغير يدوي)
}

export function generateCertificate(student: Student, opts: CertOptions) {
  const logoUrl = `${window.location.origin}/logo.png`;
  const photoUrl = student.photo;

  let title = "";
  let subtitle = "";
  let body = "";
  let detail = "";
  let isStar = opts.type === "star";

  // تحديد الأسماء ديناميكياً أو اعتماد قيم افتراضية
  const supervisor = opts.supervisorName?.trim() || "حنان الشهاب";
  const generalSupervisor = opts.generalSupervisorName?.trim() || "مصطفى المحيميد";

  if (opts.type === "surah" && opts.surah) {
    const s = getSurah(opts.surah)!;
    title = "شهادة تميز وفخر";
    subtitle = `في حفظ سورة ${s.name}`;
    body = `بكل فخر واعتزاز، يسر عائلة معهد المصطفى أن تُهنيء بطلها المتميز`;
    detail = `الذي أتمّ بفضل الله وتوفيقه حفظ <b>سورة ${s.name}</b> تلاوةً متميزة وتجويداً متقناً، سائلين المولى له الثبات والرفعة.`;
  } else if (opts.type === "juz" && opts.juz) {
    title = "إنجاز قرآني مبارك";
    subtitle = `إتمام الجزء ${opts.juz}`;
    body = `بفرحة غامرة، تسعد عائلة معهد المصطفى بتكريم بطلها المجدّ`;
    detail = `لاجتيازه خطوة مباركة في رحلته مع كتاب الله وإتمام حفظ <b>الجزء ${opts.juz}</b> بأداء رائع يُثلج الصدور.`;
  } else if (opts.type === "star") {
    title = "🌟 وسام نجم الأسبوع 🌟";
    subtitle = "صاحب الهمة والتميز";
    body = `تتوج عائلة معهد المصطفى نجمها المتألق لهذا الأسبوع البطل/ة`;
    const actualReason = opts.reason?.trim() || "لأدائه الاستثنائي، حرصه الشديد، وأخلاقه الرفيعة التي أضاءت حلقتنا هذا الأسبوع.";
    detail = `<span style="color: #b45309; font-size: 20px; font-weight: 800; display: block; margin-bottom: 8px;">مبارك التميز يا بطل!</span>${actualReason}`;
  }

  const dateStr = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${student.fullName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Cairo', 'Amiri', serif;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .cert-container {
          width: 297mm;
          height: 210mm;
          background: #ffffff;
          padding: 15mm 20mm;
          position: relative;
          border: 12px double ${isStar ? '#b45309' : '#065f46'};
          outline: 4px solid ${isStar ? '#f59e0b' : '#d4af37'};
          outline-offset: -8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        }

        .cert-container::before {
          content: "";
          position: absolute;
          top: 8px; bottom: 8px; left: 8px; right: 8px;
          border: 1px solid ${isStar ? '#f59e0b' : '#d4af37'};
          pointer-events: none;
        }

        .header-logos {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2mm;
        }

        .logo-box img {
          height: 65px;
          object-fit: contain;
        }

        .cert-title {
          text-align: center;
          margin-bottom: 2mm;
        }

        .cert-title h1 {
          font-family: 'Amiri', serif;
          font-size: 38px;
          color: ${isStar ? '#b45309' : '#065f46'};
          font-weight: 700;
          margin-bottom: 2px;
        }

        .cert-title h2 {
          size: 16px;
          color: ${isStar ? '#d97706' : '#d4af37'};
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .divider {
          width: 200px;
          height: 2px;
          background: linear-gradient(to left, transparent, ${isStar ? '#f59e0b' : '#d4af37'}, transparent);
          margin: 3mm auto 0 auto;
        }

        .main-content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10mm;
          margin: 4mm 0;
        }

        .text-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: right;
        }

        .body-text {
          font-size: 18px;
          color: #4b5563;
          line-height: 1.6;
        }

        .student-name {
          font-family: 'Amiri', serif;
          font-size: 36px;
          font-weight: bold;
          color: ${isStar ? '#92400e' : '#047857'};
          margin: 3mm 0;
          padding-bottom: 1mm;
          border-bottom: 3px double ${isStar ? '#f59e0b' : '#d4af37'};
          display: inline-block;
        }

        .detail-box {
          font-size: 16px;
          color: #1f2937;
          line-height: 1.7;
          background: ${isStar ? '#fffbeb' : '#f0fdf4'};
          padding: 4mm 5mm;
          border-radius: 12px;
          border: 1px dashed ${isStar ? '#fcd34d' : '#a7f3d0'};
          margin-top: 2mm;
          width: 100%;
        }

        .photo-side {
          width: 50mm;
          height: 50mm;
          border: 4px solid ${isStar ? '#b45309' : '#065f46'};
          outline: 2px solid ${isStar ? '#f59e0b' : '#d4af37'};
          outline-offset: 4px;
          border-radius: 16px;
          overflow: hidden;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          shrink-0: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .photo-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .verse {
          font-family: 'Amiri', serif;
          font-size: 20px;
          font-weight: bold;
          color: ${isStar ? '#b45309' : '#065f46'};
          margin: 2mm 0;
          text-align: center;
        }

        .date-box {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 1mm;
        }

        .signatures {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 5mm;
          margin-top: 2mm;
        }

        .sign {
          text-align: center;
          width: 28%;
        }

        .sign .line {
          width: 75%;
          height: 1px;
          background: #cbd5e1;
          margin: 0 auto 6px auto;
        }

        .sign .role {
          font-size: 13px;
          font-weight: 700;
          color: ${isStar ? '#b45309' : '#065f46'};
        }

        .sign .name {
          font-size: 12px;
          color: #6b7280;
          margin-top: 1px;
        }

        @media print {
          body { background: none; }
          .cert-container {
            box-shadow: none;
            width: 297mm;
            height: 210mm;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4 landscape;
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

        <div class="main-content">
          <div class="text-side">
            <div class="body-text">
              <p>${body}</p>
              <div class="student-name">${student.fullName}</div>
            </div>
            <div class="detail-box">
              ${detail}
            </div>
          </div>
          
          <div class="photo-side">
            <img src="${photoUrl}" alt="${student.fullName}" onerror="this.src='/students/student1.png'" />
          </div>
        </div>

        <div class="verse">
          ﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾
        </div>

        <div class="date-box">
          حرر في: ${dateStr}
        </div>

        <!-- التوقيعات الثلاثية المحدثة بالأسماء المتغيرة -->
        <div class="signatures">
          <div class="sign">
            <div class="line"></div>
            <div class="role">المعلم المسؤول</div>
            <div class="name">${student.teacher}</div>
          </div>
          <div class="sign">
            <div class="line"></div>
            <div class="role">المشرف</div>
            <div class="name">${supervisor}</div>
          </div>
          <div class="sign">
            <div class="line"></div>
            <div class="role">المشرف العام</div>
            <div class="name">${generalSupervisor}</div>
          </div>
        </div>
      </div>

      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 300);
        });
      </script>
    </body>
    </html>
  `);
  win.document.close();
}