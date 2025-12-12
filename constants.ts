import { SleepEntry, Language } from './types';

export const MOCK_DATA: SleepEntry[] = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  
  // Randomize sleep times around 11 PM - 1 AM for bedtime, 6 AM - 8 AM for wake
  const bedHour = 22 + Math.floor(Math.random() * 4); // 22, 23, 24 (0), 25 (1)
  const wakeHour = 6 + Math.floor(Math.random() * 3);
  
  const bedTime = new Date(date);
  bedTime.setHours(bedHour, Math.floor(Math.random() * 60));
  
  const wakeTime = new Date(date);
  wakeTime.setDate(wakeTime.getDate() + 1); // Wake up next day
  wakeTime.setHours(wakeHour, Math.floor(Math.random() * 60));

  return {
    id: `entry-${i}`,
    date: date.toISOString().split('T')[0],
    bedTime: bedTime.toISOString(),
    wakeTime: wakeTime.toISOString(),
    quality: 5 + Math.floor(Math.random() * 5), // 5-10
    mood: Math.random() > 0.5 ? 'rested' : 'tired',
    notes: i % 3 === 0 ? "Had coffee too late." : "Read a book before bed.",
  };
});

export const TRANSLATIONS = {
  en: {
    appTitle: "Somnia Sleep Analyzer",
    login: "Log In",
    logout: "Log Out",
    welcome: "Welcome back",
    dashboard: "Dashboard",
    newEntry: "New Entry",
    analyze: "AI Analysis",
    avgDuration: "Avg Duration",
    avgQuality: "Avg Quality",
    consistency: "Consistency",
    sleepTrend: "Sleep Duration Trend",
    qualityTrend: "Sleep Quality Trend",
    bedtimeConsistency: "Bedtime Consistency",
    hours: "Hours",
    score: "Score",
    date: "Date",
    save: "Save Entry",
    analyzing: "Analyzing sleep patterns...",
    generateInsights: "Generate AI Insights",
    loginPrompt: "Please log in to view your sleep analytics.",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter password",
    notes: "Notes",
    bedTime: "Bed Time",
    wakeTime: "Wake Time",
    quality: "Quality (1-10)",
    analysisTitle: "AI Sleep Coach",
    recommendations: "Recommendations",
  },
  ar: {
    appTitle: "سومنيا - محلل النوم",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    welcome: "أهلاً بك",
    dashboard: "لوحة التحكم",
    newEntry: "إدخال جديد",
    analyze: "تحليل الذكاء الاصطناعي",
    avgDuration: "متوسط المدة",
    avgQuality: "متوسط الجودة",
    consistency: "الاتساق",
    sleepTrend: "اتجاه مدة النوم",
    qualityTrend: "اتجاه جودة النوم",
    bedtimeConsistency: "اتساق وقت النوم",
    hours: "ساعات",
    score: "النتيجة",
    date: "التاريخ",
    save: "حفظ الإدخال",
    analyzing: "جارٍ تحليل أنماط النوم...",
    generateInsights: "توليد رؤى الذكاء الاصطناعي",
    loginPrompt: "يرجى تسجيل الدخول لعرض تحليلات النوم.",
    emailPlaceholder: "أدخل البريد الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    notes: "ملاحظات",
    bedTime: "وقت النوم",
    wakeTime: "وقت الاستيقاظ",
    quality: "الجودة (1-10)",
    analysisTitle: "مدرب النوم الذكي",
    recommendations: "التوصيات",
  }
};
