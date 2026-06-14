import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Eye, Pencil, Trash2, X, Upload, UserPlus } from "lucide-react";
import { useStore, uid, today, type Student } from "../lib/store";
import { Card, SectionTitle, ProgressBar, Badge } from "../components/ui";

const emptyStudent = (): Student => ({
  id: uid(),
  fullName: "",
  photo: "/students/student1.png",
  birthDate: "",
  grade: "الصف الأول",
  enrollmentDate: today(),
  parentName: "",
  parentPhone: "",
  address: "",
  notes: "",
  subjects: ["حفظ القرآن"],
  performance: "جيد",
  teacher: "الشيخ عبد الرحمن",
  teacherNotes: "",
  memorized: [],
  attendance: [],
  lastUpdate: today(),
});

const grades = ["الصف الأول","الصف الثاني","الصف الثالث","الصف الرابع","الصف الخامس","الصف السادس","الصف السابع","الصف الثامن","الصف التاسع","الشهادة الرسمية"];
const perfs = ["ممتاز","جيد جداً","جيد","مقبول"] as const;

export default function Students() {
  const { students, addStudent, updateStudent, deleteStudent, user, teachers } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const isAdmin = user?.role === "admin";

  const filtered = useMemo(
    () => students.filter((s) => s.fullName.includes(q) || s.parentName.includes(q) || s.grade.includes(q) || s.id.includes(q)),
    [students, q]
  );

  const openNew = () => { setEditing(emptyStudent()); setIsNew(true); };
  const openEdit = (s: Student) => { setEditing({ ...s }); setIsNew(false); };

  const save = () => {
    if (!editing || !editing.fullName.trim()) return;
    if (isNew) addStudent(editing);
    else updateStudent(editing);
    setEditing(null);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const reader = new FileReader();
    reader.onload = () => setEditing({ ...editing, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle sub={`${students.length} طالب مسجل في المعهد`}>إدارة الطلاب</SectionTitle>
        {isAdmin && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-gradient-to-l from-emerald-bright to-emerald-rich text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" /> إضافة طالب
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-rich" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث بالاسم، ولي الأمر، أو الصف..."
          className="w-full pr-11 pl-4 py-3 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0f211a] dark:text-white focus:ring-2 focus:ring-emerald-bright outline-none"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-emerald-50 dark:bg-white/5 text-emerald-deep dark:text-emerald-100 text-sm">
                <th className="px-4 py-3 font-bold">الطالب</th>
                <th className="px-4 py-3 font-bold hidden md:table-cell">الصف</th>
                <th className="px-4 py-3 font-bold hidden lg:table-cell">ولي الأمر</th>
                <th className="px-4 py-3 font-bold">التقدم</th>
                <th className="px-4 py-3 font-bold hidden sm:table-cell">الأداء</th>
                <th className="px-4 py-3 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const pct = Math.round((s.memorized.length / 114) * 100);
                return (
                  <tr key={s.id} className="border-t border-emerald-50 dark:border-white/5 hover:bg-emerald-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.photo} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-emerald-100" />
                        <div>
                          <p className="font-bold text-emerald-deep dark:text-white">{s.fullName}</p>
                          <p className="text-xs text-gray-400">#{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600 dark:text-emerald-100/70">{s.grade}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-emerald-100/70">{s.parentName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <ProgressBar value={pct} className="flex-1" />
                        <span className="text-xs font-bold text-emerald-rich w-9">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge color={s.performance === "ممتاز" ? "emerald" : s.performance === "جيد جداً" ? "gold" : "gray"}>{s.performance}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/student/${s.id}`} className="p-2 rounded-lg text-emerald-rich hover:bg-emerald-100 dark:hover:bg-white/10" title="عرض">
                          <Eye className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-sky-600 hover:bg-sky-100 dark:hover:bg-white/10" title="تعديل">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setConfirmDel(s.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-white/10" title="حذف">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">لا يوجد طلاب مطابقون للبحث</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit / New modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0f211a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="sticky top-0 bg-emerald-deep text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> {isNew ? "إضافة طالب جديد" : "تعديل بيانات الطالب"}
                </h3>
                <button onClick={() => setEditing(null)}><X className="w-6 h-6" /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img src={editing.photo} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100" />
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 dark:border-white/10 cursor-pointer hover:bg-emerald-50 dark:hover:bg-white/5 text-emerald-rich text-sm font-semibold">
                    <Upload className="w-4 h-4" /> رفع صورة
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                </div>

                <Field label="الاسم الكامل" value={editing.fullName} onChange={(v) => setEditing({ ...editing, fullName: v })} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="تاريخ الميلاد" type="date" value={editing.birthDate} onChange={(v) => setEditing({ ...editing, birthDate: v })} />
                  <Field label="تاريخ التسجيل" type="date" value={editing.enrollmentDate} onChange={(v) => setEditing({ ...editing, enrollmentDate: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="الصف" value={editing.grade} options={grades} onChange={(v) => setEditing({ ...editing, grade: v })} />
                  <Select label="مستوى الأداء" value={editing.performance} options={[...perfs]} onChange={(v) => setEditing({ ...editing, performance: v as Student["performance"] })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="اسم ولي الأمر" value={editing.parentName} onChange={(v) => setEditing({ ...editing, parentName: v })} />
                  <Field label="رقم الهاتف" value={editing.parentPhone} onChange={(v) => setEditing({ ...editing, parentPhone: v })} />
                </div>
                <Field label="العنوان" value={editing.address} onChange={(v) => setEditing({ ...editing, address: v })} />
                <Select label="المعلم المسؤول" value={editing.teacher} options={teachers.map((t) => t.name)} onChange={(v) => setEditing({ ...editing, teacher: v })} />
                <Field label="المواد (افصل بفاصلة)" value={editing.subjects.join("، ")} onChange={(v) => setEditing({ ...editing, subjects: v.split(/[،,]/).map((x) => x.trim()).filter(Boolean) })} />
                <Area label="ملاحظات عامة" value={editing.notes} onChange={(v) => setEditing({ ...editing, notes: v })} />
                <Area label="ملاحظات المعلم" value={editing.teacherNotes} onChange={(v) => setEditing({ ...editing, teacherNotes: v })} />

                <div className="flex gap-3 pt-2">
                  <button onClick={save} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold hover:scale-[1.02] transition-transform">
                    {isNew ? "إضافة الطالب" : "حفظ التغييرات"}
                  </button>
                  <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setConfirmDel(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0f211a] rounded-2xl p-6 max-w-sm text-center" dir="rtl"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-lg text-emerald-deep dark:text-white">تأكيد الحذف</h3>
              <p className="text-gray-500 text-sm mt-1">هل أنت متأكد من حذف هذا الطالب؟ لا يمكن التراجع.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { deleteStudent(confirmDel); setConfirmDel(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold">حذف</button>
                <button onClick={() => setConfirmDel(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white focus:ring-2 focus:ring-emerald-bright outline-none" />
    </div>
  );
}
function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white focus:ring-2 focus:ring-emerald-bright outline-none" />
    </div>
  );
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white focus:ring-2 focus:ring-emerald-bright outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
