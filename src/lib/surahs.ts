export interface Surah {
  number: number;
  name: string;       // Arabic name
  english: string;    // transliteration
  ayahs: number;
  juz: number;        // juz where it primarily starts
}

// All 114 Surahs of the Quran with Arabic names, transliteration, ayah count, and starting juz.
export const SURAHS: Surah[] = [
  { number: 1, name: "الفاتحة", english: "Al-Fatiha", ayahs: 7, juz: 1 },
  { number: 2, name: "البقرة", english: "Al-Baqarah", ayahs: 286, juz: 1 },
  { number: 3, name: "آل عمران", english: "Aal-Imran", ayahs: 200, juz: 3 },
  { number: 4, name: "النساء", english: "An-Nisa", ayahs: 176, juz: 4 },
  { number: 5, name: "المائدة", english: "Al-Ma'idah", ayahs: 120, juz: 6 },
  { number: 6, name: "الأنعام", english: "Al-An'am", ayahs: 165, juz: 7 },
  { number: 7, name: "الأعراف", english: "Al-A'raf", ayahs: 206, juz: 8 },
  { number: 8, name: "الأنفال", english: "Al-Anfal", ayahs: 75, juz: 9 },
  { number: 9, name: "التوبة", english: "At-Tawbah", ayahs: 129, juz: 10 },
  { number: 10, name: "يونس", english: "Yunus", ayahs: 109, juz: 11 },
  { number: 11, name: "هود", english: "Hud", ayahs: 123, juz: 11 },
  { number: 12, name: "يوسف", english: "Yusuf", ayahs: 111, juz: 12 },
  { number: 13, name: "الرعد", english: "Ar-Ra'd", ayahs: 43, juz: 13 },
  { number: 14, name: "إبراهيم", english: "Ibrahim", ayahs: 52, juz: 13 },
  { number: 15, name: "الحجر", english: "Al-Hijr", ayahs: 99, juz: 14 },
  { number: 16, name: "النحل", english: "An-Nahl", ayahs: 128, juz: 14 },
  { number: 17, name: "الإسراء", english: "Al-Isra", ayahs: 111, juz: 15 },
  { number: 18, name: "الكهف", english: "Al-Kahf", ayahs: 110, juz: 15 },
  { number: 19, name: "مريم", english: "Maryam", ayahs: 98, juz: 16 },
  { number: 20, name: "طه", english: "Taha", ayahs: 135, juz: 16 },
  { number: 21, name: "الأنبياء", english: "Al-Anbiya", ayahs: 112, juz: 17 },
  { number: 22, name: "الحج", english: "Al-Hajj", ayahs: 78, juz: 17 },
  { number: 23, name: "المؤمنون", english: "Al-Mu'minun", ayahs: 118, juz: 18 },
  { number: 24, name: "النور", english: "An-Nur", ayahs: 64, juz: 18 },
  { number: 25, name: "الفرقان", english: "Al-Furqan", ayahs: 77, juz: 18 },
  { number: 26, name: "الشعراء", english: "Ash-Shu'ara", ayahs: 227, juz: 19 },
  { number: 27, name: "النمل", english: "An-Naml", ayahs: 93, juz: 19 },
  { number: 28, name: "القصص", english: "Al-Qasas", ayahs: 88, juz: 20 },
  { number: 29, name: "العنكبوت", english: "Al-Ankabut", ayahs: 69, juz: 20 },
  { number: 30, name: "الروم", english: "Ar-Rum", ayahs: 60, juz: 21 },
  { number: 31, name: "لقمان", english: "Luqman", ayahs: 34, juz: 21 },
  { number: 32, name: "السجدة", english: "As-Sajdah", ayahs: 30, juz: 21 },
  { number: 33, name: "الأحزاب", english: "Al-Ahzab", ayahs: 73, juz: 21 },
  { number: 34, name: "سبأ", english: "Saba", ayahs: 54, juz: 22 },
  { number: 35, name: "فاطر", english: "Fatir", ayahs: 45, juz: 22 },
  { number: 36, name: "يس", english: "Ya-Sin", ayahs: 83, juz: 22 },
  { number: 37, name: "الصافات", english: "As-Saffat", ayahs: 182, juz: 23 },
  { number: 38, name: "ص", english: "Sad", ayahs: 88, juz: 23 },
  { number: 39, name: "الزمر", english: "Az-Zumar", ayahs: 75, juz: 23 },
  { number: 40, name: "غافر", english: "Ghafir", ayahs: 85, juz: 24 },
  { number: 41, name: "فصلت", english: "Fussilat", ayahs: 54, juz: 24 },
  { number: 42, name: "الشورى", english: "Ash-Shura", ayahs: 53, juz: 25 },
  { number: 43, name: "الزخرف", english: "Az-Zukhruf", ayahs: 89, juz: 25 },
  { number: 44, name: "الدخان", english: "Ad-Dukhan", ayahs: 59, juz: 25 },
  { number: 45, name: "الجاثية", english: "Al-Jathiyah", ayahs: 37, juz: 25 },
  { number: 46, name: "الأحقاف", english: "Al-Ahqaf", ayahs: 35, juz: 26 },
  { number: 47, name: "محمد", english: "Muhammad", ayahs: 38, juz: 26 },
  { number: 48, name: "الفتح", english: "Al-Fath", ayahs: 29, juz: 26 },
  { number: 49, name: "الحجرات", english: "Al-Hujurat", ayahs: 18, juz: 26 },
  { number: 50, name: "ق", english: "Qaf", ayahs: 45, juz: 26 },
  { number: 51, name: "الذاريات", english: "Adh-Dhariyat", ayahs: 60, juz: 26 },
  { number: 52, name: "الطور", english: "At-Tur", ayahs: 49, juz: 27 },
  { number: 53, name: "النجم", english: "An-Najm", ayahs: 62, juz: 27 },
  { number: 54, name: "القمر", english: "Al-Qamar", ayahs: 55, juz: 27 },
  { number: 55, name: "الرحمن", english: "Ar-Rahman", ayahs: 78, juz: 27 },
  { number: 56, name: "الواقعة", english: "Al-Waqi'ah", ayahs: 96, juz: 27 },
  { number: 57, name: "الحديد", english: "Al-Hadid", ayahs: 29, juz: 27 },
  { number: 58, name: "المجادلة", english: "Al-Mujadila", ayahs: 22, juz: 28 },
  { number: 59, name: "الحشر", english: "Al-Hashr", ayahs: 24, juz: 28 },
  { number: 60, name: "الممتحنة", english: "Al-Mumtahanah", ayahs: 13, juz: 28 },
  { number: 61, name: "الصف", english: "As-Saff", ayahs: 14, juz: 28 },
  { number: 62, name: "الجمعة", english: "Al-Jumu'ah", ayahs: 11, juz: 28 },
  { number: 63, name: "المنافقون", english: "Al-Munafiqun", ayahs: 11, juz: 28 },
  { number: 64, name: "التغابن", english: "At-Taghabun", ayahs: 18, juz: 28 },
  { number: 65, name: "الطلاق", english: "At-Talaq", ayahs: 12, juz: 28 },
  { number: 66, name: "التحريم", english: "At-Tahrim", ayahs: 12, juz: 28 },
  { number: 67, name: "الملك", english: "Al-Mulk", ayahs: 30, juz: 29 },
  { number: 68, name: "القلم", english: "Al-Qalam", ayahs: 52, juz: 29 },
  { number: 69, name: "الحاقة", english: "Al-Haqqah", ayahs: 52, juz: 29 },
  { number: 70, name: "المعارج", english: "Al-Ma'arij", ayahs: 44, juz: 29 },
  { number: 71, name: "نوح", english: "Nuh", ayahs: 28, juz: 29 },
  { number: 72, name: "الجن", english: "Al-Jinn", ayahs: 28, juz: 29 },
  { number: 73, name: "المزمل", english: "Al-Muzzammil", ayahs: 20, juz: 29 },
  { number: 74, name: "المدثر", english: "Al-Muddaththir", ayahs: 56, juz: 29 },
  { number: 75, name: "القيامة", english: "Al-Qiyamah", ayahs: 40, juz: 29 },
  { number: 76, name: "الإنسان", english: "Al-Insan", ayahs: 31, juz: 29 },
  { number: 77, name: "المرسلات", english: "Al-Mursalat", ayahs: 50, juz: 29 },
  { number: 78, name: "النبأ", english: "An-Naba", ayahs: 40, juz: 30 },
  { number: 79, name: "النازعات", english: "An-Nazi'at", ayahs: 46, juz: 30 },
  { number: 80, name: "عبس", english: "Abasa", ayahs: 42, juz: 30 },
  { number: 81, name: "التكوير", english: "At-Takwir", ayahs: 29, juz: 30 },
  { number: 82, name: "الانفطار", english: "Al-Infitar", ayahs: 19, juz: 30 },
  { number: 83, name: "المطففين", english: "Al-Mutaffifin", ayahs: 36, juz: 30 },
  { number: 84, name: "الانشقاق", english: "Al-Inshiqaq", ayahs: 25, juz: 30 },
  { number: 85, name: "البروج", english: "Al-Buruj", ayahs: 22, juz: 30 },
  { number: 86, name: "الطارق", english: "At-Tariq", ayahs: 17, juz: 30 },
  { number: 87, name: "الأعلى", english: "Al-A'la", ayahs: 19, juz: 30 },
  { number: 88, name: "الغاشية", english: "Al-Ghashiyah", ayahs: 26, juz: 30 },
  { number: 89, name: "الفجر", english: "Al-Fajr", ayahs: 30, juz: 30 },
  { number: 90, name: "البلد", english: "Al-Balad", ayahs: 20, juz: 30 },
  { number: 91, name: "الشمس", english: "Ash-Shams", ayahs: 15, juz: 30 },
  { number: 92, name: "الليل", english: "Al-Layl", ayahs: 21, juz: 30 },
  { number: 93, name: "الضحى", english: "Ad-Duha", ayahs: 11, juz: 30 },
  { number: 94, name: "الشرح", english: "Ash-Sharh", ayahs: 8, juz: 30 },
  { number: 95, name: "التين", english: "At-Tin", ayahs: 8, juz: 30 },
  { number: 96, name: "العلق", english: "Al-Alaq", ayahs: 19, juz: 30 },
  { number: 97, name: "القدر", english: "Al-Qadr", ayahs: 5, juz: 30 },
  { number: 98, name: "البينة", english: "Al-Bayyinah", ayahs: 8, juz: 30 },
  { number: 99, name: "الزلزلة", english: "Az-Zalzalah", ayahs: 8, juz: 30 },
  { number: 100, name: "العاديات", english: "Al-Adiyat", ayahs: 11, juz: 30 },
  { number: 101, name: "القارعة", english: "Al-Qari'ah", ayahs: 11, juz: 30 },
  { number: 102, name: "التكاثر", english: "At-Takathur", ayahs: 8, juz: 30 },
  { number: 103, name: "العصر", english: "Al-Asr", ayahs: 3, juz: 30 },
  { number: 104, name: "الهمزة", english: "Al-Humazah", ayahs: 9, juz: 30 },
  { number: 105, name: "الفيل", english: "Al-Fil", ayahs: 5, juz: 30 },
  { number: 106, name: "قريش", english: "Quraysh", ayahs: 4, juz: 30 },
  { number: 107, name: "الماعون", english: "Al-Ma'un", ayahs: 7, juz: 30 },
  { number: 108, name: "الكوثر", english: "Al-Kawthar", ayahs: 3, juz: 30 },
  { number: 109, name: "الكافرون", english: "Al-Kafirun", ayahs: 6, juz: 30 },
  { number: 110, name: "النصر", english: "An-Nasr", ayahs: 3, juz: 30 },
  { number: 111, name: "المسد", english: "Al-Masad", ayahs: 5, juz: 30 },
  { number: 112, name: "الإخلاص", english: "Al-Ikhlas", ayahs: 4, juz: 30 },
  { number: 113, name: "الفلق", english: "Al-Falaq", ayahs: 5, juz: 30 },
  { number: 114, name: "الناس", english: "An-Nas", ayahs: 6, juz: 30 },
];

export const TOTAL_JUZ = 30;

export function getSurah(num: number): Surah | undefined {
  return SURAHS.find((s) => s.number === num);
}

// Compute number of distinct Juz' the student has fully reached coverage of.
// Approximate: count distinct juz numbers touched by memorized surahs.
export function memorizedJuzCount(memorizedNumbers: number[]): number {
  const juzSet = new Set<number>();
  memorizedNumbers.forEach((n) => {
    const s = getSurah(n);
    if (s) juzSet.add(s.juz);
  });
  return juzSet.size;
}
