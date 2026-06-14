import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserCheck, BookOpenCheck, GraduationCap, CalendarCheck, ArrowLeft, Megaphone } from "lucide-react";
import { useStore } from "../lib/store";
import { StatCard, Card, SectionTitle, ProgressBar, Badge } from "../components/ui";
import { SURAHS, memorizedJuzCount } from "../lib/surahs";

function attendanceRate(students: ReturnType<typeof useStore>["students"]): number {
  let total = 0, present = 0;
  students.forEach((s) => s.attendance.forEach((a) => { total++; if (a.status !== "absent") present++; }));
  return total ? Math.round((present / total) * 100) : 0;
}

export default function Dashboard() {
  const { students, teachers, announcements, user } = useStore();

  const stats = useMemo(() => {
    const totalSurahsMem = students.reduce((acc, s) => acc + s.memorized.length, 0);
    return {
      total: students.length,
      active: students.filter((s) => s.attendance.slice(-7).some((a) => a.status !== "absent")).length,
      surahs: totalSurahsMem,
      teachers: teachers.length,
      attendance: attendanceRate(students),
    };
  }, [students, teachers]);

  // Top memorizers
  const ranking = [...students].sort((a, b) => b.memorized.length - a.memorized.length);

  // viewer's own student
  const myStudent = user?.role !== "admin" ? students.find((s) => s.id === user?.studentId) : null;

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-emerald-deep p-7 lg:p-9"
      >
        <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-25" alt="" />
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-deep/60 to-emerald-deep/90" />
        <div className="relative text-white">
          <p className="text-gold-soft text-sm">
            {user?.role === "admin" ? "لوحة تحكم الإدارة" : "أهلاً وسهلاً"}
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-1">مرحباً، {user?.name}</h1>
          <p className="text-emerald-100/80 mt-2 max-w-xl">
            {user?.role === "admin"
              ? "نظرة شاملة على أداء الطلاب وتقدمهم في حفظ القرآن الكريم."
              : "تابع تقدم الطالب في حفظ القرآن الكريم وإنجازاته الدراسية."}
          </p>
          {myStudent && (
            <Link
              to={`/student/${myStudent.id}`}
              className="inline-flex items-center gap-2 mt-5 bg-gold text-emerald-deep font-bold px-5 py-2.5 rounded-xl hover:scale-105 transition-transform"
            >
              عرض ملف الطالب <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats (admin) */}
      {user?.role === "admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={Users} label="إجمالي الطلاب" value={stats.total} delay={0.05} />
          <StatCard icon={UserCheck} label="الطلاب النشطون" value={stats.active} accent="blue" delay={0.1} />
          <StatCard icon={BookOpenCheck} label="السور المحفوظة" value={stats.surahs} accent="gold" delay={0.15} />
          <StatCard icon={GraduationCap} label="عدد المعلمين" value={stats.teachers} accent="rose" delay={0.2} />
          <StatCard icon={CalendarCheck} label="نسبة الحضور" value={`${stats.attendance}%`} delay={0.25} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ranking / progress */}
        <div className="lg:col-span-2">
          <SectionTitle sub="ترتيب الطلاب حسب عدد السور المحفوظة">لوحة الشرف</SectionTitle>
          <Card className="p-5 space-y-4">
            {ranking.map((s, i) => {
              const pct = Math.round((s.memorized.length / 114) * 100);
              return (
                <Link key={s.id} to={`/student/${s.id}`} className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    i === 0 ? "bg-gold text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-amber-700/80 text-white" : "bg-emerald-50 dark:bg-white/10 text-emerald-rich"
                  }`}>{i + 1}</div>
                  <img src={s.photo} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-emerald-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-emerald-deep dark:text-white truncate group-hover:text-emerald-bright">{s.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ProgressBar value={pct} className="flex-1" />
                      <span className="text-xs font-bold text-emerald-rich w-10 text-left">{pct}%</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-lg font-extrabold text-emerald-deep dark:text-white">{s.memorized.length}</p>
                    <p className="text-[10px] text-gray-400">سورة</p>
                  </div>
                </Link>
              );
            })}
          </Card>
        </div>

        {/* Announcements + Juz overview */}
        <div className="space-y-6">
          <div>
            <SectionTitle>آخر الإعلانات</SectionTitle>
            <Card className="p-5 space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <Link to="/announcements" key={a.id} className="block p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-gold shrink-0" />
                    <p className="font-bold text-sm text-emerald-deep dark:text-white truncate">{a.title}</p>
                    {a.important && <Badge color="red">هام</Badge>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.body}</p>
                </Link>
              ))}
            </Card>
          </div>

          <Card className="p-5 text-center bg-gradient-to-br from-emerald-rich to-emerald-deep text-white pattern-islamic">
            <p className="text-sm text-emerald-100">إجمالي الأجزاء المحفوظة في المعهد</p>
            <p className="text-5xl font-extrabold mt-2">
              {students.reduce((acc, s) => acc + memorizedJuzCount(s.memorized.map((m) => m.surah)), 0)}
            </p>
            <p className="text-xs text-gold-soft mt-1">من أصل {SURAHS.length} سورة موزعة على 30 جزءاً</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
