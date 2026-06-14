import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Trash2, X, Pencil, AlertTriangle, Calendar } from "lucide-react";
import { useStore, uid, today, type Announcement } from "../lib/store";
import { Card, SectionTitle, Badge } from "../components/ui";

export default function Announcements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, user } = useStore();
  const isAdmin = user?.role === "admin";
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => { setEditing({ id: uid(), title: "", body: "", date: today(), important: false }); setIsNew(true); };
  const save = () => {
    if (!editing || !editing.title.trim()) return;
    if (isNew) addAnnouncement(editing); else updateAnnouncement(editing);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub="آخر أخبار وإعلانات المعهد">الإعلانات</SectionTitle>
        {isAdmin && (
          <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-l from-emerald-bright to-emerald-rich text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" /> إعلان جديد
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`p-5 h-full relative overflow-hidden ${a.important ? "ring-2 ring-gold" : ""}`}>
              {a.important && <div className="pattern-gold absolute inset-0 opacity-30" />}
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${a.important ? "bg-gradient-to-br from-gold-soft to-gold" : "bg-gradient-to-br from-emerald-bright to-emerald-rich"}`}>
                      {a.important ? <AlertTriangle className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-deep dark:text-white text-lg leading-tight">{a.title}</h3>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><Calendar className="w-3 h-3" />{a.date}</p>
                    </div>
                  </div>
                  {a.important && <Badge color="red">هام</Badge>}
                </div>
                <p className="text-gray-600 dark:text-emerald-100/70 text-sm mt-3 leading-relaxed">{a.body}</p>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setEditing({ ...a }); setIsNew(false); }} className="flex items-center gap-1 text-sky-600 text-sm font-semibold hover:underline"><Pencil className="w-4 h-4" /> تعديل</button>
                    <button onClick={() => deleteAnnouncement(a.id)} className="flex items-center gap-1 text-red-500 text-sm font-semibold hover:underline"><Trash2 className="w-4 h-4" /> حذف</button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#0f211a] rounded-2xl w-full max-w-lg" dir="rtl">
              <div className="bg-emerald-deep text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-lg">{isNew ? "إعلان جديد" : "تعديل الإعلان"}</h3>
                <button onClick={() => setEditing(null)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">العنوان</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-emerald-deep dark:text-emerald-100">المحتوى</label>
                  <textarea rows={4} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-white/10 bg-white dark:bg-[#0a1410] dark:text-white outline-none focus:ring-2 focus:ring-emerald-bright" />
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-emerald-deep dark:text-emerald-100">
                  <input type="checkbox" checked={editing.important} onChange={(e) => setEditing({ ...editing, important: e.target.checked })} className="w-4 h-4 accent-emerald-rich" />
                  إعلان هام
                </label>
                <div className="flex gap-3 pt-2">
                  <button onClick={save} className="flex-1 py-3 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold">{isNew ? "نشر" : "حفظ"}</button>
                  <button onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-semibold">إلغاء</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
