import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, ShieldCheck, BookOpen, Users } from "lucide-react";
import { useStore } from "../lib/store";

const creds = [
  { role: "مدير", icon: ShieldCheck, u: "admin", p: "admin123", desc: "صلاحيات كاملة" },
  { role: "ولي أمر", icon: Users, u: "parent", p: "parent123", desc: "عرض فقط" },
  { role: "طالب", icon: BookOpen, u: "student", p: "student123", desc: "عرض فقط" },
];

export default function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) nav("/dashboard");
    else setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
  };

  const quick = (u: string, p: string) => {
    setUsername(u); setPassword(p); setErr("");
    if (login(u, p)) nav("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" dir="rtl">
      {/* Left brand panel */}
      <div className="relative lg:w-1/2 bg-emerald-deep overflow-hidden flex items-center justify-center p-10 min-h-[36vh] lg:min-h-screen">
        <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/80 to-emerald-deep/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center text-white max-w-md"
        >
          <img src="/logo.png" alt="logo" className="w-28 h-28 mx-auto object-contain drop-shadow-2xl" />
          <h1 className="font-arabic text-5xl font-bold mt-4">معهد المصطفى</h1>
          <p className="text-gold-soft tracking-[0.3em] text-sm mt-1">AL MUSTAFA INSTITUTE</p>
          <div className="w-24 h-px bg-gold mx-auto my-6" />
          <p className="font-arabic text-2xl leading-relaxed text-emerald-50">
            ﴿ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ ﴾
          </p>
          <p className="text-emerald-100/70 mt-4 text-sm">
            منصة تعليمية متكاملة لتحفيظ القرآن الكريم والعلوم الشرعية والمواد الدراسية
          </p>
        </motion.div>
      </div>

      {/* Right login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-cream">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-extrabold text-emerald-deep">تسجيل الدخول</h2>
          <p className="text-gray-500 mt-1">مرحباً بك، الرجاء إدخال بياناتك</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-semibold text-emerald-deep">اسم المستخدم</label>
              <div className="relative mt-1.5">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-rich" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-bright outline-none"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-emerald-deep">كلمة المرور</label>
              <div className="relative mt-1.5">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-rich" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 rounded-xl border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-bright outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{err}</p>}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-l from-emerald-bright to-emerald-rich text-white font-bold shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all"
            >
              دخول
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-xs text-gray-400 mb-3">حسابات تجريبية — اضغط للدخول السريع</p>
            <div className="grid grid-cols-3 gap-2">
              {creds.map((c) => (
                <button
                  key={c.u}
                  onClick={() => quick(c.u, c.p)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border border-emerald-100 bg-white hover:border-emerald-bright hover:shadow-md transition-all"
                >
                  <c.icon className="w-5 h-5 text-emerald-rich" />
                  <span className="text-xs font-bold text-emerald-deep">{c.role}</span>
                  <span className="text-[9px] text-gray-400">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
