import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Calendar, MapPin, Phone, User, BookOpen, Award, Star,
  TrendingUp, CheckCircle2, Lock, Search, Printer, GraduationCap, ClipboardList, Plus, X,
} from "lucide-react";
import { useStore, today } from "../lib/store";
import { Card, SectionTitle, ProgressBar, Badge, StatCard } from "../components/ui";
import { SURAHS, memorizedJuzCount, getSurah } from "../lib/surahs";
import QuranHeart from "../components/QuranHeart";
import { generateReport } from "../lib/report";
import { generateCertificate } from "../lib/certificate";

export default function StudentProfile() {
  const { id } = useParams();
  const { students, user, toggleSurah, setAttendance } = useStore();
  const student = students.find((s) => s.id === id);
  const [tab, setTab] = useState<"all" | "memorized" | "remaining">("all");
  const [q, setQ] = useState("");
  const [certOpen, setCertOpen] = useState(false);
  const [certType, setCertType] = useState<"surah" | "juz">("surah");
  const [certSurah, setCertSurah] = useState(1);
  const [certJuz, setCertJuz] = useState(1);

  const isAdmin = user?.role === "admin";

  const memNumbers = useMemo(() => student?.memorized.map((m) => m.surah) ?? [], [student]);
  const memSet = useMemo(() => new Set(memNumbers), [memNumbers]);

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">لم يتم العثور على الطالب.</p>
        <Link to="/students" className="text-emerald-rich font-bold mt-2 inline-block">العودة للطلاب</Link>
      </div>
    );
  }

  const pct = Math.round((student.memorized.length / 114) * 100);
  const juz = memorizedJuzCount(memNumbers);
  const lastMem = [...student.memorized].sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastSurah = lastMem ? getSurah(lastMem.surah) : null;

  const ranking = [...students].sort((a, b) => b.memorized.length - a.memorized.length);
  const rank = ranking.findIndex((s) => s.id === student.id) + 1;

  const presentCount = student.attendance.filter((a) => a.status === "present").length;
  const attendancePct = student.attendance.length ? Math.round((student.attendance.filter((a) => a.status !== "absent").length / student.attendance.length) * 100) : 0;

  const filteredSurahs = SURAHS.filter((s) => {
    if (tab === "memorized" && !memSet.has(s.number)) return false;
    if (tab === "remaining" && memSet.has(s.number)) return false;
    if (q && !s.name.includes(q) && !s.english.toLowerCase().includes(q.toLowerCase()) && String(s.number) !== q) return false;
    return true;
  });

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between no-print">
        <Link to={isAdmin ? "/students" : "/dashboard"} className="inline-flex items-center gap-2 text-emerald-rich font-semibold hover:gap-3 transition-all">
          <ArrowRight className="w-5 h-5" /> رجوع
        </Link>
        <button
          onClick={() => generateReport(student)}
          className="inline-flex items-center gap-2 bg-gold text-emerald-deep px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Printer className="w-5 h-5" /> طباعة التقرير PDF
        </button>
        <button
          onClick={() => setCertOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-l from-emerald-bright to-emerald-rich text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Award className="w-5 h-5" /> طباعة شهادة
        </button>
      </div>

      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-emerald-deep pattern-islamic">
            <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
          </div>
          <div className="px-6 pb-6 -mt-16 flex flex-col md:flex-row items-center md:items-end gap-5">
            <img src={student.photo} alt={student.fullName} className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-[#0f211a] shadow-xl" />
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-extrabold text-emerald-deep dark:text-white">{student.fullName}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge color="emerald">{student.grade}</Badge>
                <Badge color="gold">رقم الطالب #{student.id}</Badge>
                <Badge color="gray">المعلم: {student.teacher}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-l from-gold-soft to-gold text-emerald-deep px-5 py-3 rounded-2xl">
              <Star className="w-6 h-6 fill-emerald-deep" />
              <div>
                <p className="text-2xl font-extrabold leading-none">#{rank}</p>
                <p className="text-[10px] font-semibold">الترتيب في المعهد</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Memorization stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="السور المحفوظة" value={student.memorized.length} sub={`من ${SURAHS.length} سورة`} delay={0.05} />
        <StatCard icon={BookOpen} label="الأجزاء المحفوظة" value={juz} sub="من 30 جزءاً" accent="gold" delay={0.1} />
        <StatCard icon={TrendingUp} label="نسبة الإنجاز" value={`${pct}%`} accent="blue" delay={0.15} />
        <StatCard icon={Award} label="نسبة الحضور" value={`${attendancePct}%`} sub={`${presentCount} يوم حضور`} accent="rose" delay={0.2} />
      </div>

      {/* QURAN HEART centerpiece */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="p-6 lg:p-8 bg-gradient-to-br from-white to-emerald-50/50 dark:from-[#0f211a] dark:to-[#0a1a13]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-emerald-deep dark:text-white">قلب القرآن</h2>
            <p className="text-gray-500 dark:text-emerald-100/50 text-sm mt-1">رحلة حفظ القرآن الكريم — كل قطعة تمثل سورة</p>
            <p className="font-arabic text-lg text-gold mt-1">يمتلئ القلب خضرةً مع كل سورة تُحفظ</p>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div className="py-6">
              <QuranHeart memorized={memNumbers} canEdit={isAdmin} onToggle={(n) => toggleSurah(student.id, n)} />
              {isAdmin && (
                <p className="text-center text-xs text-gray-400 mt-8">اضغط على أي سورة لتحديد أو إلغاء حفظها</p>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-emerald-deep dark:text-white">نسبة إكمال الحفظ</span>
                  <span className="font-extrabold text-emerald-rich">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="h-4" />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{student.memorized.length} محفوظة</span>
                  <span>{114 - student.memorized.length} متبقية</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoTile label="آخر سورة محفوظة" value={lastSurah ? lastSurah.name : "—"} icon={BookOpen} />
                <InfoTile label="تاريخ آخر حفظ" value={lastMem ? lastMem.date : "—"} icon={Calendar} />
                <InfoTile label="السور المتبقية" value={`${114 - student.memorized.length}`} icon={Lock} />
                <InfoTile label="آخر تحديث" value={student.lastUpdate} icon={TrendingUp} />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-gradient-to-br from-emerald-bright to-emerald-rich" /> محفوظة</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-gray-300 dark:bg-white/10" /> غير محفوظة</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Surah list with filter */}
      <div>
        <SectionTitle sub="قائمة السور — يمكن للإدارة تحديد الحفظ">سجل الحفظ التفصيلي</SectionTitle>
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2">
              {([["all","الكل"],["memorized","المحفوظة"],["remaining","المتبقية"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === k ? "bg-emerald-rich text-white" : "bg-emerald-50 dark:bg-white/5 text-emerald-deep dark:text-emerald-100"}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-rich" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن سورة..."
                className="pr-10 pl-3 py-2 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-bright" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredSurahs.map((s) => {
              const isMem = memSet.has(s.number);
              const entry = student.memorized.find((m) => m.surah === s.number);
              return (
                <motion.button
                  key={s.number}
                  whileHover={isAdmin ? { scale: 1.04 } : {}}
                  onClick={() => isAdmin && toggleSurah(student.id, s.number)}
                  disabled={!isAdmin}
                  className={`relative p-3 rounded-xl text-right transition-all ${isAdmin ? "cursor-pointer" : "cursor-default"} ${
                    isMem
                      ? "bg-gradient-to-br from-emerald-bright/15 to-emerald-rich/10 border border-emerald-bright/40"
                      : "bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${isMem ? "text-emerald-rich" : "text-gray-400"}`}>{s.number}</span>
                    {isMem ? <CheckCircle2 className="w-4 h-4 text-emerald-bright" /> : <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
                  </div>
                  <p className={`font-arabic text-lg leading-tight mt-1 ${isMem ? "text-emerald-deep dark:text-emerald-200" : "text-gray-400 dark:text-gray-500"}`}>{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.english}</p>
                  {entry && <p className="text-[9px] text-emerald-rich/70 mt-1">{entry.date}</p>}
                </motion.button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Info grids */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <SectionTitle>المعلومات الشخصية</SectionTitle>
          <Card className="p-5 space-y-1">
            <Row icon={User} label="الاسم الكامل" value={student.fullName} />
            <Row icon={Calendar} label="تاريخ الميلاد" value={student.birthDate} />
            <Row icon={GraduationCap} label="الصف الحالي" value={student.grade} />
            <Row icon={Calendar} label="تاريخ التسجيل" value={student.enrollmentDate} />
            <Row icon={User} label="اسم ولي الأمر" value={student.parentName} />
            <Row icon={Phone} label="هاتف ولي الأمر" value={student.parentPhone} />
            <Row icon={MapPin} label="العنوان" value={student.address} />
            <Row icon={ClipboardList} label="ملاحظات" value={student.notes} />
          </Card>
        </div>
        <div>
          <SectionTitle>المعلومات الأكاديمية</SectionTitle>
          <Card className="p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-emerald-100/50 mb-2">المواد الدراسية</p>
              <div className="flex flex-wrap gap-2">
                {student.subjects.map((sub) => <Badge key={sub} color="emerald">{sub}</Badge>)}
              </div>
            </div>
            <Row icon={Star} label="مستوى الأداء" value={student.performance} />
            <Row icon={User} label="المعلم المسؤول" value={student.teacher} />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-emerald-100/50 mb-1">ملاحظات المعلم</p>
              <p className="text-emerald-deep dark:text-emerald-100 bg-emerald-50 dark:bg-white/5 rounded-xl p-3 text-sm leading-relaxed">{student.teacherNotes || "لا توجد ملاحظات"}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Attendance */}
      <div>
        <SectionTitle sub={isAdmin ? "اضغط على أي يوم لتغيير حالته: حاضر ← متأخر ← غائب ← حذف" : "سجل الحضور والإنجازات"}>الحضور والإنجازات</SectionTitle>
        <Card className="p-5">
          {/* Summary + formula */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-white/5 rounded-xl px-4 py-2">
              <span className="text-sm text-gray-500 dark:text-emerald-100/60">نسبة الحضور</span>
              <span className="text-xl font-extrabold text-emerald-rich">{attendancePct}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-emerald-100/50">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-bright/10 text-emerald-rich font-semibold">حاضر: {presentCount}</span>
              <span className="px-3 py-1.5 rounded-lg bg-amber-400/15 text-amber-600 font-semibold">متأخر: {student.attendance.filter((a) => a.status === "late").length}</span>
              <span className="px-3 py-1.5 rounded-lg bg-red-400/15 text-red-500 font-semibold">غائب: {student.attendance.filter((a) => a.status === "absent").length}</span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 font-semibold">الإجمالي: {student.attendance.length}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mb-3">
            تُحسب النسبة = (أيام الحضور + أيام التأخير) ÷ إجمالي الأيام المسجّلة × 100
          </p>

          <div className="flex flex-wrap gap-1.5">
            {student.attendance.map((a) => (
              <button
                key={a.date}
                disabled={!isAdmin}
                onClick={() => {
                  const next = a.status === "present" ? "late" : a.status === "late" ? "absent" : "none";
                  setAttendance(student.id, a.date, next);
                }}
                title={`${a.date} — ${a.status === "present" ? "حاضر" : a.status === "late" ? "متأخر" : "غائب"}${isAdmin ? " (اضغط للتغيير)" : ""}`}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold transition-transform ${isAdmin ? "cursor-pointer hover:scale-110" : "cursor-default"} ${
                  a.status === "present" ? "bg-emerald-bright text-white" : a.status === "late" ? "bg-amber-400 text-white" : "bg-red-400 text-white"
                }`}
              >
                {new Date(a.date).getDate()}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => {
                  const exists = student.attendance.some((a) => a.date === today());
                  if (!exists) setAttendance(student.id, today(), "present");
                }}
                title="تسجيل حضور اليوم"
                className="w-7 h-7 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-rich/50 text-emerald-rich hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-bright" /> حاضر</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> متأخر</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400" /> غائب</span>
            {isAdmin && <span className="flex items-center gap-1.5"><Plus className="w-3 h-3" /> تسجيل حضور اليوم</span>}
          </div>
        </Card>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setCertOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0f211a] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" dir="rtl"
            >
              <div className="bg-emerald-deep text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" /> طباعة شهادة إتمام
                </h3>
                <button onClick={() => setCertOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">نوع الشهادة</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => setCertType("surah")}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        certType === "surah"
                          ? "border-emerald-bright bg-emerald-50 dark:bg-white/10 text-emerald-rich"
                          : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      إتمام سورة
                    </button>
                    <button
                      onClick={() => setCertType("juz")}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        certType === "juz"
                          ? "border-emerald-bright bg-emerald-50 dark:bg-white/10 text-emerald-rich"
                          : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      إتمام جزء
                    </button>
                  </div>
                </div>

                {certType === "surah" ? (
                  <div>
                    <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">اختر السورة</label>
                    <select
                      value={certSurah}
                      onChange={(e) => setCertSurah(Number(e.target.value))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    >
                      {SURAHS.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. {s.name} — {s.english}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">اختر الجزء</label>
                    <select
                      value={certJuz}
                      onChange={(e) => setCertJuz(Number(e.target.value))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                        <option key={j} value={j}>الجزء {j}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => {
                    generateCertificate(student, {
                      type: certType,
                      surah: certType === "surah" ? certSurah : undefined,
                      juz: certType === "juz" ? certJuz : undefined,
                    });
                    setCertOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Printer className="w-5 h-5" /> طباعة الشهادة
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BookOpen }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl p-3 border border-emerald-100 dark:border-white/5">
      <div className="flex items-center gap-1.5 text-gray-400 text-[11px]"><Icon className="w-3.5 h-3.5" />{label}</div>
      <p className="font-arabic text-emerald-deep dark:text-white font-bold mt-1 truncate">{value}</p>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-emerald-50 dark:border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-white/5 flex items-center justify-center text-emerald-rich shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm text-gray-500 dark:text-emerald-100/50 w-32 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-emerald-deep dark:text-white">{value || "—"}</span>
    </div>
  );
}
