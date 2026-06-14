import { type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Megaphone, BookOpen, GraduationCap,
  LogOut, Moon, Sun, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../lib/store";
import { useTheme } from "../lib/theme";

const adminNav = [
  { to: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/students", label: "الطلاب", icon: Users },
  { to: "/announcements", label: "الإعلانات", icon: Megaphone },
  { to: "/programs", label: "البرامج التعليمية", icon: BookOpen },
];

const viewerNav = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/announcements", label: "الإعلانات", icon: Megaphone },
  { to: "/programs", label: "البرامج التعليمية", icon: BookOpen },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useStore();
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const items = user?.role === "admin" ? adminNav : viewerNav;

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <Link to="/dashboard" className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <img src="/logo.png" alt="logo" className="w-12 h-12 object-contain" />
        <div className="text-white">
          <p className="font-arabic text-xl font-bold leading-tight">معهد المصطفى</p>
          <p className="text-[10px] text-gold-soft tracking-wider">AL MUSTAFA INSTITUTE</p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {items.map((it) => {
          const active = loc.pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-to-l from-emerald-bright to-emerald-rich text-white shadow-lg"
                  : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <it.icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
        {user?.role !== "admin" && user?.studentId && (
          <Link
            to={`/student/${user.studentId}`}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              loc.pathname.startsWith("/student/")
                ? "bg-gradient-to-l from-emerald-bright to-emerald-rich text-white shadow-lg"
                : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            ملف الطالب
          </Link>
        )}
      </nav>

      <div className="px-3 pb-5 space-y-2">
        <div className="px-4 py-3 rounded-xl bg-white/5 text-white">
          <p className="text-sm font-bold">{user?.name}</p>
          <p className="text-[10px] text-gold-soft">
            {user?.role === "admin" ? "مدير النظام" : user?.role === "parent" ? "ولي أمر" : "طالب"}
          </p>
        </div>
        <button
          onClick={() => { logout(); nav("/login"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-200 hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-cream dark:bg-[#0a1410]" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 fixed inset-y-0 right-0 bg-emerald-deep dark:bg-[#06281e] pattern-islamic z-30">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-emerald-deep pattern-islamic ml-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 left-4 text-white">
              <X className="w-6 h-6" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:mr-72 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="no-print sticky top-0 z-20 bg-white/80 dark:bg-[#0d1c16]/80 backdrop-blur-xl border-b border-emerald-100 dark:border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="lg:hidden text-emerald-deep dark:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-emerald-deep dark:text-emerald-100">
            <span className="font-arabic text-lg">﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-white/5 text-emerald-rich dark:text-gold hover:scale-105 transition-transform"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>

        <footer className="no-print text-center py-5 text-xs text-emerald-deep/50 dark:text-emerald-100/30">
          © {new Date().getFullYear()} معهد المصطفى — جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
}
