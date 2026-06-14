import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Mic, ScrollText, GraduationCap, Target, Award, Users,
  Plus, Pencil, Trash2, X, Upload, UserPlus, LayoutGrid,
} from "lucide-react";
import { useStore, uid, type Teacher, type Program } from "../lib/store";
import { Card, SectionTitle } from "../components/ui";

const iconMap: Record<string, typeof BookOpen> = {
  book: BookOpen, mic: Mic, scroll: ScrollText, graduation: GraduationCap, target: Target, award: Award,
};

const iconOptions: { key: string; label: string }[] = [
  { key: "book", label: "كتاب" },
  { key: "mic", label: "تلاوة" },
  { key: "scroll", label: "علوم" },
  { key: "graduation", label: "تخرج" },
  { key: "target", label: "هدف" },
  { key: "award", label: "شهادة" },
];

export default function Programs() {
  const {
    programs, teachers, user,
    addTeacher, updateTeacher, deleteTeacher,
    addProgram, updateProgram, deleteProgram,
  } = useStore();
  const isAdmin = user?.role === "admin";

  // ---- Teacher modal state ----
  const [editingT, setEditingT] = useState<Teacher | null>(null);
  const [isNewT, setIsNewT] = useState(false);
  const [confirmDelT, setConfirmDelT] = useState<string | null>(null);

  const openNewT = () => { setEditingT({ id: uid(), name: "", subject: "", photo: "" }); setIsNewT(true); };
  const openEditT = (t: Teacher) => { setEditingT({ ...t }); setIsNewT(false); };
  const saveT = () => {
    if (!editingT || !editingT.name.trim()) return;
    if (isNewT) addTeacher(editingT); else updateTeacher(editingT);
    setEditingT(null);
  };
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingT) return;
    const reader = new FileReader();
    reader.onload = () => setEditingT({ ...editingT, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  // ---- Program modal state ----
  const [editingP, setEditingP] = useState<Program | null>(null);
  const [isNewP, setIsNewP] = useState(false);
  const [confirmDelP, setConfirmDelP] = useState<string | null>(null);

  const openNewP = () => { setEditingP({ id: uid(), title: "", description: "", icon: "book", duration: "", level: "" }); setIsNewP(true); };
  const openEditP = (p: Program) => { setEditingP({ ...p }); setIsNewP(false); };
  const saveP = () => {
    if (!editingP || !editingP.title.trim()) return;
    if (isNewP) addProgram(editingP); else updateProgram(editingP);
    setEditingP(null);
  };

  return (
    <div className="space-y-8">
      {/* ===== Programs ===== */}
      <div className="flex items-center justify-between">
        <SectionTitle sub="برامج معهد المصطفى التعليمية المتكاملة">البرامج التعليمية</SectionTitle>
        {isAdmin && (
          <button
            onClick={openNewP}
            className="flex items-center gap-2 bg-gradient-to-l from-emerald-bright to-emerald-rich text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform shrink-0"
          >
            <Plus className="w-5 h-5" /> إضافة برنامج
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p, i) => {
          const Icon = iconMap[p.icon] ?? BookOpen;
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="p-6 h-full relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="pattern-islamic absolute inset-0 opacity-40" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-bright to-emerald-deep flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditP(p)} className="p-2 rounded-lg text-sky-600 hover:bg-sky-100 dark:hover:bg-white/10" title="تعديل">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelP(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-white/10" title="حذف">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-xl text-emerald-deep dark:text-white mt-4">{p.title}</h3>
                  <p className="text-gray-500 dark:text-emerald-100/60 text-sm mt-2 leading-relaxed">{p.description}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs flex-wrap">
                    {p.duration && <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-white/5 text-emerald-rich font-semibold">{p.duration}</span>}
                    {p.level && <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-white/5 text-amber-600 font-semibold">{p.level}</span>}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
        {programs.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">لا توجد برامج مسجلة</p>
        )}
      </div>

      {/* ===== Teachers ===== */}
      <div>
        <div className="flex items-center justify-between">
          <SectionTitle sub="نخبة من المعلمين المتخصصين">هيئة التدريس</SectionTitle>
          {isAdmin && (
            <button
              onClick={openNewT}
              className="flex items-center gap-2 bg-gradient-to-l from-emerald-bright to-emerald-rich text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform shrink-0"
            >
              <Plus className="w-5 h-5" /> إضافة معلم
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {teachers.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 text-center relative group">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-emerald-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-bright to-emerald-deep mx-auto flex items-center justify-center text-white">
                    <Users className="w-8 h-8" />
                  </div>
                )}
                <p className="font-bold text-emerald-deep dark:text-white mt-3">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1">{t.subject}</p>

                {isAdmin && (
                  <div className="flex items-center justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditT(t)} className="p-2 rounded-lg text-sky-600 hover:bg-sky-100 dark:hover:bg-white/10" title="تعديل">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelT(t.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-white/10" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
          {teachers.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-8">لا يوجد معلمون مسجلون</p>
          )}
        </div>
      </div>

      {/* ===== Program modal ===== */}
      <AnimatePresence>
        {editingP && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingP(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0f211a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl"
            >
              <div className="sticky top-0 bg-emerald-deep text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" /> {isNewP ? "إضافة برنامج جديد" : "تعديل البرنامج"}
                </h3>
                <button onClick={() => setEditingP(null)}><X className="w-6 h-6" /></button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">اسم البرنامج</label>
                  <input
                    value={editingP.title}
                    onChange={(e) => setEditingP({ ...editingP, title: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    placeholder="مثال: حفظ القرآن الكريم"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">الوصف</label>
                  <textarea
                    rows={3}
                    value={editingP.description}
                    onChange={(e) => setEditingP({ ...editingP, description: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    placeholder="وصف مختصر للبرنامج..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">المدة</label>
                    <input
                      value={editingP.duration}
                      onChange={(e) => setEditingP({ ...editingP, duration: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                      placeholder="مثال: 6 أشهر"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">المستوى</label>
                    <input
                      value={editingP.level}
                      onChange={(e) => setEditingP({ ...editingP, level: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                      placeholder="مثال: جميع المستويات"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100 mb-2 block">الأيقونة</label>
                  <div className="grid grid-cols-6 gap-2">
                    {iconOptions.map((opt) => {
                      const Icon = iconMap[opt.key];
                      const active = editingP.icon === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setEditingP({ ...editingP, icon: opt.key })}
                          className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all ${
                            active
                              ? "border-emerald-bright bg-emerald-50 dark:bg-white/10 text-emerald-rich"
                              : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-emerald-bright"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[9px] font-semibold">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={saveP} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold hover:scale-[1.02] transition-transform">
                    {isNewP ? "إضافة البرنامج" : "حفظ التغييرات"}
                  </button>
                  <button onClick={() => setEditingP(null)} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Teacher modal ===== */}
      <AnimatePresence>
        {editingT && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingT(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0f211a] rounded-2xl w-full max-w-md" dir="rtl"
            >
              <div className="bg-emerald-deep text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> {isNewT ? "إضافة معلم جديد" : "تعديل بيانات المعلم"}
                </h3>
                <button onClick={() => setEditingT(null)}><X className="w-6 h-6" /></button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  {editingT.photo ? (
                    <img src={editingT.photo} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-bright to-emerald-deep flex items-center justify-center text-white">
                      <Users className="w-9 h-9" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 dark:border-white/10 cursor-pointer hover:bg-emerald-50 dark:hover:bg-white/5 text-emerald-rich text-sm font-semibold">
                    <Upload className="w-4 h-4" /> رفع صورة
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                </div>

                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">اسم المعلم</label>
                  <input
                    value={editingT.name}
                    onChange={(e) => setEditingT({ ...editingT, name: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    placeholder="مثال: الشيخ عبد الرحمن"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">التخصص / المادة</label>
                  <input
                    value={editingT.subject}
                    onChange={(e) => setEditingT({ ...editingT, subject: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright"
                    placeholder="مثال: حفظ القرآن والتجويد"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={saveT} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold hover:scale-[1.02] transition-transform">
                    {isNewT ? "إضافة المعلم" : "حفظ التغييرات"}
                  </button>
                  <button onClick={() => setEditingT(null)} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Delete confirms ===== */}
      <AnimatePresence>
        {(confirmDelT || confirmDelP) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => { setConfirmDelT(null); setConfirmDelP(null); }}
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
              <p className="text-gray-500 text-sm mt-1">
                {confirmDelP ? "هل أنت متأكد من حذف هذا البرنامج؟ لا يمكن التراجع." : "هل أنت متأكد من حذف هذا المعلم؟ لا يمكن التراجع."}
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    if (confirmDelP) deleteProgram(confirmDelP);
                    if (confirmDelT) deleteTeacher(confirmDelT);
                    setConfirmDelP(null); setConfirmDelT(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold"
                >
                  حذف
                </button>
                <button onClick={() => { setConfirmDelT(null); setConfirmDelP(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
