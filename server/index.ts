import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();

// CORS: allow frontend origins
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: [FRONTEND_URL, "http://localhost:5173", "http://localhost:4173"], credentials: true }));
app.use(express.json({ limit: "10mb" }));

const PORT = Number(process.env.PORT) || 3001;

// ====== SEED DATA ======
const seedUsers = [
  { username: "admin", password: "admin123", role: "admin", name: "إدارة المعهد" },
  { username: "parent", password: "parent123", role: "parent", name: "والد أحمد", studentId: "seed-s1" },
  { username: "student", password: "student123", role: "student", name: "أحمد المصطفى", studentId: "seed-s1" },
];

async function seed() {
  const count = await prisma.student.count();
  if (count > 0) return; // already seeded

  // Seed users
  for (const u of seedUsers) {
    await prisma.user.upsert({ where: { username: u.username }, update: {}, create: u });
  }

  // Seed teachers
  const teachers = [
    { name: "الشيخ عبد الرحمن", subject: "حفظ القرآن والتجويد", photo: "" },
    { name: "الأستاذة مريم", subject: "التلاوة والعلوم الدينية", photo: "" },
    { name: "الأستاذ خالد", subject: "المواد المدرسية", photo: "" },
    { name: "الأستاذة نور", subject: "اللغة العربية", photo: "" },
    { name: "الشيخ يوسف", subject: "الفقه والعقيدة", photo: "" },
  ];
  for (const t of teachers) await prisma.teacher.create({ data: t });

  // Seed programs
  const programs = [
    { title: "حفظ القرآن الكريم", description: "برنامج متكامل لحفظ القرآن الكريم بالتجويد على يد نخبة من المعلمين المتخصصين.", icon: "book", duration: "مستمر", level: "جميع المستويات" },
    { title: "التلاوة والتجويد", description: "تعلم أحكام التجويد وإتقان تلاوة القرآن الكريم بالأحكام الصحيحة.", icon: "mic", duration: "6 أشهر", level: "مبتدئ - متقدم" },
    { title: "العلوم الدينية", description: "دراسة الفقه والعقيدة والسيرة النبوية والأخلاق الإسلامية.", icon: "scroll", duration: "سنة دراسية", level: "جميع المراحل" },
    { title: "المواد المدرسية", description: "دعم تعليمي لجميع المواد المدرسية ولجميع الصفوف الدراسية.", icon: "graduation", duration: "سنة دراسية", level: "جميع الصفوف" },
    { title: "إعداد الصف التاسع", description: "برنامج مكثف لإعداد طلاب الصف التاسع للامتحانات الانتقالية.", icon: "target", duration: "سنة دراسية", level: "الصف التاسع" },
    { title: "إعداد الشهادة الرسمية", description: "تحضير شامل للامتحانات الوطنية والشهادات الرسمية.", icon: "award", duration: "سنة دراسية", level: "الشهادات الرسمية" },
  ];
  for (const p of programs) await prisma.program.create({ data: p });

  // Seed announcements
  const announcements = [
    { title: "بدء التسجيل للفصل الدراسي الجديد", body: "يسر معهد المصطفى الإعلان عن فتح باب التسجيل للفصل الدراسي الجديد لجميع المراحل. سارعوا بالتسجيل قبل امتلاء المقاعد.", date: new Date().toISOString().slice(0, 10), important: true },
    { title: "مسابقة حفظ القرآن الكريم السنوية", body: "تنطلق مسابقة المعهد السنوية لحفظ القرآن الكريم الشهر القادم. الجوائز قيمة لأوائل الحافظين. للتسجيل يرجى مراجعة الإدارة.", date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10), important: false },
    { title: "اجتماع أولياء الأمور", body: "ندعو جميع أولياء الأمور لحضور الاجتماع الدوري لمناقشة مستوى أبنائهم يوم السبت القادم الساعة العاشرة صباحاً.", date: new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10), important: false },
  ];
  for (const a of announcements) await prisma.announcement.create({ data: a });

  // Seed students
  const studentData = [
    {
      id: "seed-s1",
      fullName: "أحمد محمد المصطفى",
      photo: "/students/student1.png",
      birthDate: "2012-04-15",
      grade: "الصف السابع",
      enrollmentDate: "2021-09-01",
      parentName: "محمد المصطفى",
      parentPhone: "0501234567",
      address: "حي النور، الرياض",
      notes: "طالب مجتهد ومنتظم في الحضور",
      subjects: ["حفظ القرآن", "التجويد", "الفقه", "الرياضيات", "اللغة العربية"],
      performance: "ممتاز",
      teacher: "الشيخ عبد الرحمن",
      teacherNotes: "حفظ متقن وأداء ممتاز في التجويد. ينصح بالمراجعة المستمرة.",
      lastUpdate: new Date().toISOString().slice(0, 10),
      memorized: [
        { surah: 1, date: "2023-01-15" },
        { surah: 114, date: "2023-02-01" },
        { surah: 113, date: "2023-02-15" },
        { surah: 112, date: "2023-03-01" },
        { surah: 111, date: "2023-03-20" },
        { surah: 110, date: "2023-04-05" },
        { surah: 109, date: "2023-04-20" },
        { surah: 108, date: "2023-05-01" },
        { surah: 107, date: "2023-05-15" },
        { surah: 106, date: "2023-06-01" },
        { surah: 105, date: "2023-06-15" },
        { surah: 104, date: "2023-07-01" },
        { surah: 103, date: "2023-07-15" },
        { surah: 102, date: "2023-08-01" },
        { surah: 101, date: "2023-08-15" },
        { surah: 100, date: "2023-09-01" },
        { surah: 99, date: "2023-09-15" },
        { surah: 98, date: "2023-10-01" },
      ],
      attendance: generateSeedAttendance(),
    },
    {
      fullName: "فاطمة علي الزهراء",
      photo: "/students/student2.png",
      birthDate: "2013-08-22",
      grade: "الصف السادس",
      enrollmentDate: "2022-09-01",
      parentName: "علي الزهراء",
      parentPhone: "0509876543",
      address: "حي الياسمين، الرياض",
      notes: "طالبة متميزة في التلاوة",
      subjects: ["حفظ القرآن", "التجويد", "العلوم الدينية", "العلوم"],
      performance: "ممتاز",
      teacher: "الأستاذة مريم",
      teacherNotes: "صوت جميل وتلاوة متقنة. متفوقة في الحفظ.",
      lastUpdate: new Date().toISOString().slice(0, 10),
      memorized: [
        { surah: 1, date: "2023-02-01" },
        { surah: 114, date: "2023-02-20" },
        { surah: 113, date: "2023-03-10" },
        { surah: 112, date: "2023-04-01" },
        { surah: 111, date: "2023-04-20" },
        { surah: 110, date: "2023-05-10" },
        { surah: 109, date: "2023-06-01" },
        { surah: 108, date: "2023-06-20" },
        { surah: 107, date: "2023-07-10" },
        { surah: 106, date: "2023-08-01" },
        { surah: 105, date: "2023-08-20" },
        { surah: 104, date: "2023-09-10" },
      ],
      attendance: generateSeedAttendance(),
    },
  ];

  for (const s of studentData) {
    const { memorized, attendance, ...studentFields } = s as any;
    await prisma.student.create({
      data: {
        ...studentFields,
        memorized: { create: memorized },
        attendance: { create: attendance },
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

function generateSeedAttendance() {
  const arr: { date: string; status: string }[] = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (d.getDay() === 5) continue;
    const r = Math.random();
    arr.push({ date: d.toISOString().slice(0, 10), status: r > 0.88 ? "absent" : r > 0.8 ? "late" : "present" });
  }
  return arr;
}

// ====== AUTH ======
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ id: user.id, username: user.username, role: user.role, name: user.name, studentId: user.studentId });
});

// ====== STUDENTS ======
app.get("/api/students", async (_req, res) => {
  const students = await prisma.student.findMany({
    include: { memorized: true, attendance: true },
    orderBy: { fullName: "asc" },
  });
  res.json(students);
});

app.post("/api/students", async (req, res) => {
  const { memorized, attendance, ...data } = req.body;
  const student = await prisma.student.create({
    data: {
      ...data,
      memorized: { create: memorized || [] },
      attendance: { create: attendance || [] },
    },
    include: { memorized: true, attendance: true },
  });
  res.json(student);
});

app.put("/api/students/:id", async (req, res) => {
  const { memorized, attendance, ...data } = req.body;
  // Delete old relations and recreate
  await prisma.memorizationProgress.deleteMany({ where: { studentId: req.params.id } });
  await prisma.attendance.deleteMany({ where: { studentId: req.params.id } });
  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      ...data,
      memorized: { create: memorized || [] },
      attendance: { create: attendance || [] },
    },
    include: { memorized: true, attendance: true },
  });
  res.json(student);
});

app.delete("/api/students/:id", async (req, res) => {
  await prisma.student.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ====== ANNOUNCEMENTS ======
app.get("/api/announcements", async (_req, res) => {
  const items = await prisma.announcement.findMany({ orderBy: { date: "desc" } });
  res.json(items);
});

app.post("/api/announcements", async (req, res) => {
  const item = await prisma.announcement.create({ data: req.body });
  res.json(item);
});

app.put("/api/announcements/:id", async (req, res) => {
  const item = await prisma.announcement.update({ where: { id: req.params.id }, data: req.body });
  res.json(item);
});

app.delete("/api/announcements/:id", async (req, res) => {
  await prisma.announcement.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ====== PROGRAMS ======
app.get("/api/programs", async (_req, res) => {
  const items = await prisma.program.findMany();
  res.json(items);
});

app.post("/api/programs", async (req, res) => {
  const item = await prisma.program.create({ data: req.body });
  res.json(item);
});

app.put("/api/programs/:id", async (req, res) => {
  const item = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
  res.json(item);
});

app.delete("/api/programs/:id", async (req, res) => {
  await prisma.program.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ====== TEACHERS ======
app.get("/api/teachers", async (_req, res) => {
  const items = await prisma.teacher.findMany();
  res.json(items);
});

app.post("/api/teachers", async (req, res) => {
  const item = await prisma.teacher.create({ data: req.body });
  res.json(item);
});

app.put("/api/teachers/:id", async (req, res) => {
  const item = await prisma.teacher.update({ where: { id: req.params.id }, data: req.body });
  res.json(item);
});

app.delete("/api/teachers/:id", async (req, res) => {
  await prisma.teacher.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// ====== ATTENDANCE ======
app.post("/api/students/:id/attendance", async (req, res) => {
  const { date, status } = req.body;
  if (status === "none") {
    await prisma.attendance.deleteMany({ where: { studentId: req.params.id, date } });
  } else {
    await prisma.attendance.upsert({
      where: { id: `${req.params.id}-${date}` },
      update: { status },
      create: { date, status, studentId: req.params.id },
    });
  }
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: { memorized: true, attendance: true },
  });
  res.json(student);
});

// ====== MEMORIZATION ======
app.post("/api/students/:id/memorize", async (req, res) => {
  const { surah, date } = req.body;
  const existing = await prisma.memorizationProgress.findFirst({
    where: { studentId: req.params.id, surah },
  });
  if (existing) {
    await prisma.memorizationProgress.delete({ where: { id: existing.id } });
  } else {
    await prisma.memorizationProgress.create({
      data: { surah, date, studentId: req.params.id },
    });
  }
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: { memorized: true, attendance: true },
  });
  res.json(student);
});

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Serve static frontend in production
// Serve static frontend in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

// دالة برمجية بسيطة تلتقط أي مسار ليس تبعاً للـ API بدون استخدام النجمة
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"));
});

async function start() {
  await seed();
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

start().catch(console.error);
