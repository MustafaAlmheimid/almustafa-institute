import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "parent" | "student";

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  studentId?: string;
}

export interface MemEntry {
  surah: number;
  date: string;
}

export interface AttendanceEntry {
  date: string;
  status: "present" | "absent" | "late";
}

export interface Student {
  id: string;
  fullName: string;
  photo: string;
  birthDate: string;
  grade: string;
  enrollmentDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  notes: string;
  subjects: string[];
  performance: "ممتاز" | "جيد جداً" | "جيد" | "مقبول";
  teacherNotes: string;
  teacher: string;
  memorized: MemEntry[];
  attendance: AttendanceEntry[];
  lastUpdate: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  important: boolean;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  level: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  photo: string;
}

interface DataState {
  students: Student[];
  announcements: Announcement[];
  programs: Program[];
  teachers: Teacher[];
}

interface StoreContextType extends DataState {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addStudent: (s: Omit<Student, "id" | "lastUpdate">) => Promise<void>;
  updateStudent: (s: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  toggleSurah: (studentId: string, surah: number) => Promise<void>;
  setAttendance: (studentId: string, date: string, status: "present" | "absent" | "late" | "none") => Promise<void>;
  addAnnouncement: (a: Omit<Announcement, "id">) => Promise<void>;
  updateAnnouncement: (a: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addProgram: (p: Omit<Program, "id">) => Promise<void>;
  updateProgram: (p: Program) => Promise<void>;
  deleteProgram: (id: string) => Promise<void>;
  addTeacher: (t: Omit<Teacher, "id">) => Promise<void>;
  updateTeacher: (t: Teacher) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const USER_KEY = "almustafa_user_v1";

// 🌍 جعل الرابط ديناميكياً ليعمل محلياً وعلى السيرفر السحابي دون تعديل يدوي
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3001/api" 
  : "/api";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // جلب البيانات الأساسية عند الإقلاع مرة واحدة فقط
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resSt, resAn, resPr, resTe] = await Promise.all([
        fetch(`${API_BASE_URL}/students`).then(r => r.json()),
        fetch(`${API_BASE_URL}/announcements`).then(r => r.json()),
        fetch(`${API_BASE_URL}/programs`).then(r => r.json()),
        fetch(`${API_BASE_URL}/teachers`).then(r => r.json())
      ]);
      setStudents(resSt);
      setAnnouncements(resAn);
      setPrograms(resPr);
      setTeachers(resTe);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const found = await res.json();
        setUser(found);
        localStorage.setItem(USER_KEY, JSON.stringify(found));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const addStudent = async (s: Omit<Student, "id" | "lastUpdate">) => {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    });
    if (res.ok) {
      const newStudent = await res.json();
      setStudents(prev => [...prev, newStudent]);
    }
  };

  const updateStudent = async (s: Student) => {
    setStudents(prev => prev.map(x => x.id === s.id ? { ...s, lastUpdate: new Date().toISOString().slice(0, 10) } : x));
    await fetch(`${API_BASE_URL}/students/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    });
  };

  const deleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(x => x.id !== id));
    await fetch(`${API_BASE_URL}/students/${id}`, { method: "DELETE" });
  };

  const toggleSurah = async (studentId: string, surah: number) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    
    setStudents(prev => prev.map(st => {
      if (st.id !== studentId) return st;
      const has = st.memorized.some(m => m.surah === surah);
      const memorized = has
        ? st.memorized.filter(m => m.surah !== surah)
        : [...st.memorized, { surah, date: todayStr }];
      return { ...st, memorized, lastUpdate: todayStr };
    }));

    await fetch(`${API_BASE_URL}/students/${studentId}/memorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surah, date: todayStr })
    });
  };

  const setAttendance = async (studentId: string, date: string, status: "present" | "absent" | "late" | "none") => {
    setStudents(prev => prev.map(st => {
      if (st.id !== studentId) return st;
      let attendance = st.attendance.filter(a => a.date !== date);
      if (status !== "none") attendance = [...attendance, { date, status }];
      attendance.sort((a, b) => a.date.localeCompare(b.date));
      return { ...st, attendance, lastUpdate: new Date().toISOString().slice(0, 10) };
    }));

    await fetch(`${API_BASE_URL}/students/${studentId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, status })
    });
  };

  const addAnnouncement = async (a: Omit<Announcement, "id">) => {
    const res = await fetch(`${API_BASE_URL}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(a)
    });
    if (res.ok) {
      const newAn = await res.json();
      setAnnouncements(prev => [newAn, ...prev]);
    }
  };

  const updateAnnouncement = async (a: Announcement) => {
    setAnnouncements(prev => prev.map(x => x.id === a.id ? a : x));
    await fetch(`${API_BASE_URL}/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(a)
    });
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(x => x.id !== id));
    await fetch(`${API_BASE_URL}/announcements/${id}`, { method: "DELETE" });
  };

  const addProgram = async (p: Omit<Program, "id">) => {
    const res = await fetch(`${API_BASE_URL}/programs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });
    if (res.ok) {
      const newPr = await res.json();
      setPrograms(prev => [...prev, newPr]);
    }
  };

  const updateProgram = async (p: Program) => {
    setPrograms(prev => prev.map(x => x.id === p.id ? p : x));
    await fetch(`${API_BASE_URL}/programs/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    });
  };

  const deleteProgram = async (id: string) => {
    setPrograms(prev => prev.filter(x => x.id !== id));
    await fetch(`${API_BASE_URL}/programs/${id}`, { method: "DELETE" });
  };

  const addTeacher = async (t: Omit<Teacher, "id">) => {
    const res = await fetch(`${API_BASE_URL}/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    });
    if (res.ok) {
      const newTe = await res.json();
      setTeachers(prev => [...prev, newTe]);
    }
  };

  const updateTeacher = async (t: Teacher) => {
    setTeachers(prev => prev.map(x => x.id === t.id ? t : x));
    await fetch(`${API_BASE_URL}/teachers/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    });
  };

  const deleteTeacher = async (id: string) => {
    setTeachers(prev => prev.filter(x => x.id !== id));
    await fetch(`${API_BASE_URL}/teachers/${id}`, { method: "DELETE" });
  };

  return (
    <StoreContext.Provider
      value={{
        students,
        announcements,
        programs,
        teachers,
        user,
        loading,
        login,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleSurah,
        setAttendance,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addProgram,
        updateProgram,
        deleteProgram,
        addTeacher,
        updateTeacher,
        deleteTeacher,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}