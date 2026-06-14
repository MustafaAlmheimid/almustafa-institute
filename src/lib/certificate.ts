import type { Student } from "./store";
import { getSurah, SURAHS } from "./surahs";

export type CertType = "surah" | "juz";

export interface CertOptions {
  type: CertType;
  surah?: number; // for surah cert
  juz?: number;   // for juz cert
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
    body = `هنّئ إدارة معهد المصطفى بتقديم هذه الشهادة إلى الطالب/ة`;
    detail = `لإتمام حفظ سورة <b>${s.name}</b> بتجويد صحيح وأداء ممتاز`;
  } else if (opts.type === "juz" && opts.juz) {
    title = "شهادة إتمام حفظ جزء";
    subtitle = `الجزء السادس والعشرون — الجزء ${opts.juz}`;
    body = `هنّئ إدارة معهد المصطفى بتقديم هذه الشهادة إلى الطالب/ة`;
    detail = `لإتمام حفظ <b>الجزء السادس والعشرون — الجزء ${opts.juz}</b> بتجويد صحيح وأداء ممتاز`;
  }

  const dateStr = new Date().toLocaleDateString("ar-SA", {
    year: "numeric", month: "long", day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>شهادة — ${student.fullName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Cairo', sans-serif;
    background: #f5f0e6;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }
  .cert-wrap {
    width: 900px;
    max-width: 100%;
    background: linear-gradient(145deg, #fffbf0 0%, #fff 40%, #f0fdf9 100%);
    border: 12px solid transparent;
    border-image: linear-gradient(135deg, #c9a227, #047857, #c9a227) 1;
    padding: 48px 56px;
    position: relative;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  /* inner ornate border */
  .cert-wrap::before {
    content: "";
    position: absolute;
    inset: 10px;
    border: 2px solid #c9a227;
    pointer-events: none;
    opacity: 0.4;
  }
  .cert-wrap::after {
    content: "";
    position: absolute;
    inset: 18px;
    border: 1px dashed #047857;
    pointer-events: none;
    opacity: 0.3;
  }
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  .top-bar img { width: 90px; height: 90px; object-fit: contain; }
  .inst-name { text-align: center; flex: 1; }
  .inst-name .ar {
    font-family: 'Amiri', serif;
    font-size: 36px;
    font-weight: 700;
    color: #064e3b;
    letter-spacing: 1px;
  }
  .inst-name .en {
    font-size: 13px;
    letter-spacing: 4px;
    color: #c9a227;
    font-weight: 700;
    margin-top: 4px;
  }
  .divider {
    height: 3px;
    background: linear-gradient(90deg, transparent, #c9a227, #047857, #c9a227, transparent);
    margin: 24px 0;
    position: relative;
    z-index: 1;
  }
  .cert-title {
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .cert-title h1 {
    font-family: 'Amiri', serif;
    font-size: 42px;
    color: #064e3b;
    font-weight: 700;
  }
  .cert-title h2 {
    font-family: 'Amiri', serif;
    font-size: 52px;
    color: #047857;
    font-weight: 700;
    margin-top: 8px;
    text-shadow: 0 2px 8px rgba(4,120,87,0.15);
  }
  .body-text {
    text-align: center;
    font-size: 18px;
    color: #444;
    line-height: 2;
    margin: 28px 0;
    position: relative;
    z-index: 1;
  }
  .body-text .student-name {
    font-family: 'Amiri', serif;
    font-size: 38px;
    color: #064e3b;
    font-weight: 700;
    display: inline-block;
    border-bottom: 2px solid #c9a227;
    padding: 0 16px 4px;
    margin: 8px 0;
  }
  .detail-box {
    background: linear-gradient(135deg, #f0fdf9, #fffbeb);
    border: 1px solid #c9a22744;
    border-radius: 16px;
    padding: 20px 32px;
    text-align: center;
    font-size: 17px;
    color: #064e3b;
    margin: 20px auto;
    max-width: 600px;
    position: relative;
    z-index: 1;
  }
  .photo-wrap {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 5px solid #c9a227;
    padding: 4px;
    margin: 0 auto 16px;
    position: relative;
    z-index: 1;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  .photo-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .verse {
    text-align: center;
    font-family: 'Amiri', serif;
    font-size: 22px;
    color: #047857;
    margin: 20px 0;
    position: relative;
    z-index: 1;
  }
  .signatures {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    position: relative;
    z-index: 1;
  }
  .sign {
    text-align: center;
    color: #064e3b;
  }
  .sign .line {
    width: 160px;
    border-top: 1px solid #064e3b;
    margin: 32px auto 8px;
  }
  .sign .role {
    font-size: 13px;
    font-weight: 700;
  }
  .sign .name {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }
  .date-box {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    color: #777;
    position: relative;
    z-index: 1;
  }
  .stamp {
    position: absolute;
    bottom: 60px;
    left: 60px;
    width: 90px;
    height: 90px;
    border: 3px solid #c9a227;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Amiri', serif;
    font-size: 11px;
    color: #c9a227;
    text-align: center;
    line-height: 1.4;
    opacity: 0.35;
    transform: rotate(-12deg);
    pointer-events: none;
    z-index: 0;
  }
  .corner {
    position: absolute;
    width: 60px;
    height: 60px;
    pointer-events: none;
    z-index: 0;
  }
  .corner-tl { top: 6px; left: 6px; border-top: 4px solid #c9a227; border-left: 4px solid #c9a227; }
  .corner-tr { top: 6px; right: 6px; border-top: 4px solid #c9a227; border-right: 4px solid #c9a227; }
  .corner-bl { bottom: 6px; left: 6px; border-bottom: 4px solid #c9a227; border-left: 4px solid #c9a227; }
  .corner-br { bottom: 6px; right: 6px; border-bottom: 4px solid #c9a227; border-right: 4px solid #c9a227; }
  .printbtn {
    position: fixed; top: 16px; left: 16px;
    background: #047857; color: #fff; border: 0;
    padding: 10px 18px; border-radius: 10px;
    font-family: 'Cairo'; font-weight: 700; cursor: pointer;
  }
  @media print {
    .noprint { display: none !important; }
    body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cert-wrap { box-shadow: none; margin: 0; width: 100%; }
  }
</style>
</head>
<body>
  <button class="printbtn noprint" onclick="window.print()">🖨️ طباعة / حفظ كـ PDF</button>

  <div class="cert-wrap">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <div class="stamp">معهد<br/>المصطفى<br/>AL MUSTAFA</div>

    <div class="top-bar">
      <img src="${logoUrl}" alt="logo" />
      <div class="inst-name">
        <div class="ar">معهد المصطفى</div>
        <div class="en">AL MUSTAFA INSTITUTE</div>
      </div>
      <img src="${logoUrl}" alt="logo" style="opacity:0.6;transform:scaleX(-1)" />
    </div>

    <div class="divider"></div>

    <div class="cert-title">
      <h1>${title}</h1>
      <h2>${subtitle}</h2>
    </div>

    <div class="body-text">
      <p>${body}</p>
      <div class="student-name">${student.fullName}</div>
    </div>

    <div class="photo-wrap">
      <img src="${photoUrl}" alt="${student.fullName}" />
    </div>

    <div class="detail-box">
      ${detail}
    </div>

    <div class="verse">
      ﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾
    </div>

    <div class="date-box">
      تاريخ التقديم: ${dateStr}
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
    window.addEventListener('load', function(){
      setTimeout(function(){ try { window.print(); } catch(e){} }, 800);
    });
  </script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.open();
    w.document.write(html);
    w.document.close();
  }
}
