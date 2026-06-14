const API = "/api";

async function fetchJson<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    fetchJson<{ id: string; username: string; role: string; name: string; studentId?: string }>(`${API}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // Students
  getStudents: () => fetchJson<any[]>(`${API}/students`),
  createStudent: (data: any) => fetchJson<any>(`${API}/students`, { method: "POST", body: JSON.stringify(data) }),
  updateStudent: (id: string, data: any) => fetchJson<any>(`${API}/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStudent: (id: string) => fetchJson<any>(`${API}/students/${id}`, { method: "DELETE" }),

  // Attendance
  setAttendance: (studentId: string, date: string, status: string) =>
    fetchJson<any>(`${API}/students/${studentId}/attendance`, { method: "POST", body: JSON.stringify({ date, status }) }),

  // Memorization
  toggleMemorize: (studentId: string, surah: number, date: string) =>
    fetchJson<any>(`${API}/students/${studentId}/memorize`, { method: "POST", body: JSON.stringify({ surah, date }) }),

  // Announcements
  getAnnouncements: () => fetchJson<any[]>(`${API}/announcements`),
  createAnnouncement: (data: any) => fetchJson<any>(`${API}/announcements`, { method: "POST", body: JSON.stringify(data) }),
  updateAnnouncement: (id: string, data: any) => fetchJson<any>(`${API}/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) => fetchJson<any>(`${API}/announcements/${id}`, { method: "DELETE" }),

  // Programs
  getPrograms: () => fetchJson<any[]>(`${API}/programs`),
  createProgram: (data: any) => fetchJson<any>(`${API}/programs`, { method: "POST", body: JSON.stringify(data) }),
  updateProgram: (id: string, data: any) => fetchJson<any>(`${API}/programs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProgram: (id: string) => fetchJson<any>(`${API}/programs/${id}`, { method: "DELETE" }),

  // Teachers
  getTeachers: () => fetchJson<any[]>(`${API}/teachers`),
  createTeacher: (data: any) => fetchJson<any>(`${API}/teachers`, { method: "POST", body: JSON.stringify(data) }),
  updateTeacher: (id: string, data: any) => fetchJson<any>(`${API}/teachers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTeacher: (id: string) => fetchJson<any>(`${API}/teachers/${id}`, { method: "DELETE" }),
};
