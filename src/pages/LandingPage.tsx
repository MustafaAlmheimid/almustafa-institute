import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, Award, Target, Compass, Users, Phone, MapPin, 
  MessageCircle, LayoutDashboard, Menu, X, CheckCircle2, Star 
} from "lucide-react";
// استيراد الـ store لجلب البيانات الحية
import { useStore } from "../lib/store";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // جلب البرامج والمدرسين المخزنين في الـ Database
  const { programs: dbPrograms, teachers: dbTeachers } = useStore();

  // برامج افتراضية تظهر كاحتياط في حال كانت الـ Database فارغة
  const defaultPrograms = [
    { id: "p1", title: "حفظ وتجويد القرآن الكريم", description: "حلقات مخصصة لجميع الأعمار تهدف إلى الحفظ المتقن بأحكام التجويد." },
    { id: "p2", title: "علوم القرآن والحديث", description: "دراسة مبسطة لعمق الآيات الكريمة والأحاديث النبوية الشريفة." },
    { id: "p3", title: "برنامج التميز الأسبوعي", description: "تحفيز مستمر للطلاب الملتزمين وتتويج نجم الأسبوع بجوائز تقديرية." },
  ];

  // دمج أو اختيار البيانات المعروضة
  const programsToDisplay = dbPrograms && dbPrograms.length > 0 ? dbPrograms : defaultPrograms;
  const teachersToDisplay = dbTeachers || [];

  // معرض صور الأنشطة للمعهد
  const activities = [
    { title: "تكريم حفظة سورة الملك", img: "/all.jpg" },
    { title: "رحلة ترفيهية لطلاب الحلقات", img: "/all1.jpg" },
    { title: "مسابقة رمضان السنوية الكبرى", img: "/all2.jpg" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07110d] text-right font-sans selection:bg-emerald-rich selection:text-white" dir="rtl">
      
      {/* الهيدر / شريط التنقل */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f211a]/80 backdrop-blur-md border-b border-emerald-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-bright to-emerald-rich flex items-center justify-center text-white font-bold shadow-md">
              م
            </div>
            <div>
              <span className="text-xl font-black text-emerald-deep dark:text-white block tracking-tight">مَعْهَد المُصْطَفَى</span>
              <span className="text-[10px] font-bold text-gold block -mt-1">لعلوم القرآن الكريم</span>
            </div>
          </div>

          {/* القائمة لنسخة الحاسوب */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-gray-600 dark:text-emerald-100/70">
            <a href="#about" className="hover:text-emerald-rich transition-colors">نبذة عنا</a>
            <a href="#vision" className="hover:text-emerald-rich transition-colors">الرؤية والرسالة</a>
            <a href="#programs" className="hover:text-emerald-rich transition-colors">البرامج</a>
            <a href="#activities" className="hover:text-emerald-rich transition-colors">أنشطتنا</a>
            <a href="#teachers" className="hover:text-emerald-rich transition-colors">المدرسون</a>
            <a href="#contact" className="hover:text-emerald-rich transition-colors">اتصل بنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 bg-gradient-to-l from-emerald-rich to-emerald-deep text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform"
            >
              <LayoutDashboard className="w-4 h-4" /> لوحة الإدارة
            </Link>
            <button className="md:hidden p-2 text-emerald-deep dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* القائمة المتنقلة للموبايل */}
      {mobileMenuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden fixed inset-x-0 bg-white dark:bg-[#0f211a] border-b border-emerald-100 p-5 space-y-4 z-40 font-bold shadow-xl">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">نبذة عنا</a>
          <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">الرؤية والرسالة</a>
          <a href="#programs" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">البرامج التعليمية</a>
          <a href="#activities" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">صور الأنشطة</a>
          <a href="#teachers" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">المدرسون</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 dark:text-emerald-100">تواصل معنا</a>
        </motion.div>
      )}

      {/* قسم الترحيب / Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-deep to-emerald-rich text-white py-24 px-4 pattern-islamic text-center">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-gold text-xs font-black">
            ﷽ هدىً وبشرى للمؤمنين
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black font-arabic leading-tight">مرحباً بكم في معهد المصطفى لعلوم القرآن</h1>
          <p className="text-emerald-100 md:text-xl max-w-2xl mx-auto leading-relaxed">
            بيئة إيمانية تربوية تسعى لبناء جيل قرآني فريد، يجمع بين إتقان الحفظ والعمل بأخلاق كتاب الله وسنة رسوله.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a href="#about" className="bg-gold text-emerald-deep font-extrabold px-8 py-3.5 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors">اكتشف المعهد</a>
            <a href="https://wa.me/00963995482768" target="_blank" rel="noreferrer" className="bg-white/10 border border-white/20 font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-white/20 transition-all">
              <MessageCircle className="w-5 h-5 text-green-400 fill-green-400" /> استفسار سريع عبر واتساب
            </a>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] opacity-10 bg-cover bg-center pointer-events-none"></div>
      </section>

      {/* قسم نبذة عن المعهد */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-emerald-rich font-bold text-sm">
            <span className="w-8 h-0.5 bg-emerald-rich"></span> من نحن
          </div>
          <h2 className="text-3xl font-black text-emerald-deep dark:text-white">أهلاً بكم في صرح القرآن الكريم</h2>
          <p className="text-gray-600 dark:text-emerald-100/70 leading-relaxed text-justify">
            تأسس معهد المصطفى ليكون منارة مباركة تخدم كتاب الله عز وجل، ونظاماً متكاملاً لا يقتصر فقط على التلقين بل يركز على الفهم التربوي والتميز المعرفي. نعتمد في حلقتنا على أحدث الوسائل التقنية للمتابعة الشفافة واليومية مع أولياء الأمور لبناء شراكة حقيقية تضمن تفوق ونبوغ أبنائنا وبناتنا.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-bright shrink-0" /><span className="text-sm font-bold text-gray-700 dark:text-emerald-200">متابعة إلكترونية دقيقة</span></div>
            <div className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-bright shrink-0" /><span className="text-sm font-bold text-gray-700 dark:text-emerald-200">بيئة تربوية محفزة</span></div>
          </div>
        </div>
        <div className="relative">
          <img src="/inside.jpg" alt="حول المعهد" className="rounded-2xl shadow-xl object-cover w-full h-80 border-4 border-white dark:border-[#0f211a]" />
          <div className="absolute -bottom-5 -right-5 bg-gold text-emerald-deep p-5 rounded-2xl shadow-lg font-black text-center">
            <span className="text-3xl block">100%</span>
            <span className="text-xs">بيئة آمنة وملهمة</span>
          </div>
        </div>
      </section>

      {/* قسم الرؤية والرسالة */}
      <section id="vision" className="bg-emerald-50 dark:bg-[#0c1814] py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0f211a] p-8 rounded-2xl shadow-sm border border-emerald-100 dark:border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-rich"><Target className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-emerald-deep dark:text-white">رؤية المعهد</h3>
            <p className="text-gray-600 dark:text-emerald-100/70 text-sm leading-relaxed">
              أن نكون المرجع الرائد والنموذج الأسمى في تعليم القرآن الكريم وتخريج الحفظة المتقنين المتميزين علمياً وأخلاقياً على مستوى المنطقة، مدمجين روح الأصالة بأدوات العصر الحديثة.
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f211a] p-8 rounded-2xl shadow-sm border border-emerald-100 dark:border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600"><Compass className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-emerald-deep dark:text-white">رسالتنا</h3>
            <p className="text-gray-600 dark:text-emerald-100/70 text-sm leading-relaxed">
              تعليم كتاب الله غضاً طرياً كما أُنزل، عبر توفير طواقم تعليمية مؤهلة، ومناهج متوازنة تراعي الفروق الفردية للطلاب، وتوظيف برامج التحفيز المستمر لترغيب الناشئة في ملازمة القرآن.
            </p>
          </div>
        </div>
      </section>

      {/* قسم البرامج والمسارات - مربوط بالـ Store */}
      <section id="programs" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-emerald-deep dark:text-white">برامجنا التعليمية المتميزة</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">مسارات تعليمية واضحة ومدروسة بعناية لتناسب قدرات ومستويات كل طالب وطالبة</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {programsToDisplay.map((p, i) => (
            <div key={p.id || i} className="bg-white dark:bg-[#0f211a] p-6 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-sm space-y-4 hover:border-emerald-bright dark:hover:border-emerald-bright transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-white/5 flex items-center justify-center text-emerald-rich">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-emerald-deep dark:text-white">{p.title}</h3>
              <p className="text-gray-600 dark:text-emerald-100/60 text-xs leading-relaxed">{p.description}</p>
              
              {/* عرض المدة والمستوى في حال تواجدهما في بيانات الـ store */}
              {('duration' in p || 'level' in p) && (
                <div className="flex items-center gap-2 mt-2 text-[10px] flex-wrap">
                  {p.duration && <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-white/5 text-emerald-rich font-semibold">{p.duration}</span>}
                  {p.level && <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-white/5 text-amber-600 font-semibold">{p.level}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* قسم صور الأنشطة */}
      <section id="activities" className="bg-slate-100 dark:bg-[#0b1411] py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-black text-emerald-deep dark:text-white">صور من أنشطة وفعاليات المعهد</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">نشارككم لحظات الفرح والإنجاز والأنشطة الترفيهية لطلابنا المباركين</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden shadow-md bg-white border border-gray-200 dark:border-0">
                <img src={act.img} alt={act.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep via-emerald-deep/40 to-transparent opacity-90 p-4 flex flex-col justify-end">
                  <h4 className="text-white font-bold text-sm flex items-center gap-1.5"><Star className="w-4 h-4 fill-gold text-gold" /> {act.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم المدرسين الأفاضل - مربوط بالـ Store بالكامل */}
      <section id="teachers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-emerald-deep dark:text-white">طاقمنا التعليمي المتميز</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">كفاءات قرآنية متخصصة تجمع بين الخبرة الطويلة والأسلوب التربوي الحكيم</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
          {teachersToDisplay.map((t, i) => (
            <motion.div 
              key={t.id || i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#0f211a] p-5 rounded-2xl text-center border border-slate-200/60 dark:border-white/5 shadow-sm space-y-3"
            >
              {t.photo ? (
                <img src={t.photo} alt={t.name} className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-50 dark:border-white/10 shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-bright to-emerald-deep mx-auto flex items-center justify-center text-white shadow-md">
                  <Users className="w-9 h-9" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-emerald-deep dark:text-white text-sm line-clamp-1">{t.name}</h3>
                <p className="text-xs text-gold font-semibold mt-1 line-clamp-1">{t.subject || "مدرس القرآن الكريم"}</p>
              </div>
            </motion.div>
          ))}
          
          {teachersToDisplay.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-8 text-sm">لا يوجد معلمون مسجلون حالياً في هيئة التدريس.</p>
          )}
        </div>
      </section>

      {/* قسم اتصل بنا والمعلومات الجغرافية */}
      <section id="contact" className="bg-emerald-deep text-white py-16 px-4 pattern-islamic">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 items-start relative z-10">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">معهد المصطفى للقرآن</h3>
            <p className="text-emerald-100 text-xs leading-relaxed">
              يسعدنا دائماً تواصلكم معنا للرد على استفساراتكم أو لتسجيل أبنائكم في حلقات الإتقان والتميز في أي وقت.
            </p>
            <div className="flex gap-2 pt-2">
              <a href="https://wa.me/00963995482768" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gold">أرقام التواصل والعنوان</h3>
            <div className="space-y-3 text-xs text-emerald-100">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>الإدارة: 0995482768 (متاح اتصال وواتساب)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>الموقع: سوريا / حمص / ريف القصير - قرية سقرجة - الطريق العام</span>
              </div>
            </div>
          </div>

          {/* الخريطة الجغرافية لموقع المعهد */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gold">موقعنا على الخريطة</h3>
            <div className="rounded-xl overflow-hidden border-2 border-emerald-800 h-40 bg-emerald-900/40">
              <iframe 
                title="موقع معهد المصطفى"
                src="https://maps.google.com/?q=34.520954,36.505640&entry=gps&g_st=ac" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>
        <div className="border-t border-emerald-800 text-center mt-12 pt-6 text-[11px] text-emerald-200">
          جميع الحقوق محفوظة © {new Date().getFullYear()} معهد المصطفى لعلوم القرآن الكريم.
        </div>
      </section>

    </div>
  );
}