import type { Student } from "./store";
import { SURAHS, memorizedJuzCount, getSurah } from "./surahs";

// Generates a printable PDF report by opening a styled print window.
// User can "Save as PDF" from the browser print dialog.
export function generateReport(student: Student) {
  const memSet = new Set(student.memorized.map((m) => m.surah));
  const pct = Math.round((student.memorized.length / 114) * 100);
  const juz = memorizedJuzCount(student.memorized.map((m) => m.surah));
  const lastMem = [...student.memorized].sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastSurah = lastMem ? getSurah(lastMem.surah) : null;
  const presentCount = student.attendance.filter((a) => a.status === "present").length;
  const lateCount = student.attendance.filter((a) => a.status === "late").length;
  const absentCount = student.attendance.filter((a) => a.status === "absent").length;
  const attendancePct = student.attendance.length
    ? Math.round((student.attendance.filter((a) => a.status !== "absent").length / student.attendance.length) * 100)
    : 0;

  const completedRows = [...student.memorized]
    .sort((a, b) => a.surah - b.surah)
    .map((m) => {
      const s = getSurah(m.surah)!;
      return `<tr><td>${s.number}</td><td class="ar">${s.name}</td><td>${s.english}</td><td>${s.ayahs}</td><td>${m.date}</td></tr>`;
    })
    .join("");

  const surahGrid = SURAHS.map((s) => {
    const mem = memSet.has(s.number);
    return `<span class="chip ${mem ? "on" : ""}">${s.number}</span>`;
  }).join("");

  const logoUrl = `${window.location.origin}/logo.png`;

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>تقرير الطالب - ${student.fullName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { font-family: 'Cairo', sans-serif; margin: 0; color: #0f2a22; background: #fff; }
  .page { max-width: 800px; margin: 0 auto; padding: 32px; }
  .header { display: flex; align-items: center; gap: 18px; border-bottom: 3px solid #047857; padding-bottom: 18px; }
  .header img { width: 78px; height: 78px; object-fit: contain; }
  .header .ar { font-family: 'Amiri', serif; font-size: 30px; font-weight: 700; color: #064e3b; }
  .header .en { letter-spacing: 3px; color: #c9a227; font-size: 12px; font-weight: 700; }
  .header .doc { margin-right: auto; text-align: left; color: #555; font-size: 12px; }
  .verse { text-align: center; font-family: 'Amiri', serif; font-size: 20px; color: #047857; margin: 16px 0; }
  .profile { display: flex; gap: 18px; align-items: center; background: #f0fdf9; border: 1px solid #d1fae5; border-radius: 14px; padding: 16px; margin-top: 8px; }
  .profile img { width: 92px; height: 92px; border-radius: 14px; object-fit: cover; border: 3px solid #047857; }
  .profile h1 { margin: 0; font-size: 24px; color: #064e3b; }
  .profile .meta { color: #047857; font-weight: 700; margin-top: 4px; }
  h2 { color: #064e3b; font-size: 16px; border-right: 4px solid #c9a227; padding-right: 8px; margin: 24px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  td, th { border: 1px solid #d1fae5; padding: 7px 10px; text-align: right; }
  th { background: #047857; color: #fff; }
  .info td:first-child { background: #f0fdf9; font-weight: 700; width: 35%; color: #064e3b; }
  .ar { font-family: 'Amiri', serif; font-size: 16px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 8px; }
  .stat { background: linear-gradient(135deg,#047857,#064e3b); color: #fff; border-radius: 12px; padding: 14px; text-align: center; }
  .stat .v { font-size: 26px; font-weight: 800; }
  .stat .l { font-size: 11px; opacity: .85; }
  .bar { height: 14px; background: #d1fae5; border-radius: 8px; overflow: hidden; margin-top: 6px; }
  .bar > div { height: 100%; background: linear-gradient(90deg,#10b981,#047857); }
  .grid { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
  .chip { width: 26px; height: 22px; display: inline-flex; align-items: center; justify-content: center; border-radius: 5px; font-size: 10px; font-weight: 700; background: #eee; color: #999; }
  .chip.on { background: #10b981; color: #fff; }
  .att { display: flex; gap: 14px; margin-top: 8px; }
  .att .a { flex: 1; text-align: center; border-radius: 10px; padding: 10px; font-weight: 700; }
  .footer { margin-top: 30px; border-top: 2px solid #d1fae5; padding-top: 12px; display: flex; justify-content: space-between; font-size: 11px; color: #777; }
  .footer .sign { text-align: center; }
  .footer .line { border-top: 1px solid #999; width: 140px; margin-top: 28px; }
  @media print { .noprint { display: none; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  .printbtn { position: fixed; top: 16px; left: 16px; background: #047857; color: #fff; border: 0; padding: 10px 18px; border-radius: 10px; font-family: 'Cairo'; font-weight: 700; cursor: pointer; }
</style>
</head>
<body>
  <button class="printbtn noprint" onclick="window.print()">🖨️ حفظ كـ PDF / طباعة</button>
  <div class="page">
    <div class="header">
      <img src="${logoUrl}" alt="logo" />
      <div>
        <div class="ar">معهد المصطفى</div>
        <div class="en">AL MUSTAFA INSTITUTE</div>
      </div>
      <div class="doc">
        تقرير الطالب الرسمي<br/>
        التاريخ: ${new Date().toISOString().slice(0, 10)}<br/>
        رقم الطالب: #${student.id}
      </div>
    </div>

    <div class="verse">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</div>

    <div class="profile">
      <img src="${student.photo}" alt="" />
      <div>
        <h1>${student.fullName}</h1>
        <div class="meta">${student.grade} · المعلم: ${student.teacher}</div>
        <div style="color:#666;font-size:13px;margin-top:4px;">مستوى الأداء: ${student.performance}</div>
      </div>
    </div>

    <h2>المعلومات الشخصية</h2>
    <table class="info">
      <tr><td>الاسم الكامل</td><td>${student.fullName}</td></tr>
      <tr><td>تاريخ الميلاد</td><td>${student.birthDate}</td></tr>
      <tr><td>الصف</td><td>${student.grade}</td></tr>
      <tr><td>تاريخ التسجيل</td><td>${student.enrollmentDate}</td></tr>
      <tr><td>اسم ولي الأمر</td><td>${student.parentName}</td></tr>
      <tr><td>هاتف ولي الأمر</td><td>${student.parentPhone}</td></tr>
      <tr><td>العنوان</td><td>${student.address}</td></tr>
      <tr><td>المواد الدراسية</td><td>${student.subjects.join("، ")}</td></tr>
      <tr><td>ملاحظات</td><td>${student.notes || "—"}</td></tr>
    </table>

    <h2>تقدم حفظ القرآن الكريم</h2>
    <div class="stats">
      <div class="stat"><div class="v">${student.memorized.length}</div><div class="l">سورة محفوظة</div></div>
      <div class="stat"><div class="v">${juz}</div><div class="l">جزء محفوظ</div></div>
      <div class="stat"><div class="v">${114 - student.memorized.length}</div><div class="l">سورة متبقية</div></div>
      <div class="stat"><div class="v">${pct}%</div><div class="l">نسبة الإنجاز</div></div>
    </div>
    <div class="bar"><div style="width:${pct}%"></div></div>
    <p style="font-size:13px;color:#555;margin-top:8px;">
      آخر سورة محفوظة: <b>${lastSurah ? lastSurah.name : "—"}</b> بتاريخ ${lastMem ? lastMem.date : "—"} ·
      آخر تحديث: ${student.lastUpdate}
    </p>
    <div class="grid">${surahGrid}</div>

    <h2>السور المكتملة (${student.memorized.length})</h2>
    <table>
      <tr><th>الرقم</th><th>السورة</th><th>الاسم</th><th>الآيات</th><th>تاريخ الإتمام</th></tr>
      ${completedRows || `<tr><td colspan="5" style="text-align:center;color:#999;">لم يتم حفظ أي سورة بعد</td></tr>`}
    </table>

    <h2>الحضور</h2>
    <div class="att">
      <div class="a" style="background:#d1fae5;color:#065f46;">حاضر: ${presentCount}</div>
      <div class="a" style="background:#fef3c7;color:#92400e;">متأخر: ${lateCount}</div>
      <div class="a" style="background:#fee2e2;color:#991b1b;">غائب: ${absentCount}</div>
      <div class="a" style="background:#047857;color:#fff;">نسبة الحضور: ${attendancePct}%</div>
    </div>

    <h2>ملاحظات المعلم</h2>
    <p style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:10px;padding:12px;font-size:14px;line-height:1.8;">
      ${student.teacherNotes || "لا توجد ملاحظات."}
    </p>

    <div class="footer">
      <div class="sign">المعلم المسؤول<div class="line"></div></div>
      <div class="sign">ختم المعهد<div class="line"></div></div>
      <div class="sign">إدارة المعهد<div class="line"></div></div>
    </div>
    <p style="text-align:center;color:#aaa;font-size:11px;margin-top:18px;">© ${new Date().getFullYear()} معهد المصطفى — جميع الحقوق محفوظة</p>
  </div>
  <script>
    // auto-open print dialog once images load
    window.addEventListener('load', function(){ setTimeout(function(){ try { window.print(); } catch(e){} }, 600); });
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
