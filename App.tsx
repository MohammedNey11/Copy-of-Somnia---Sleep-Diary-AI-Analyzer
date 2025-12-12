import React, { useState } from 'react';
import { User, SleepEntry, Language } from './types';
import { MOCK_DATA, TRANSLATIONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { SleepForm } from './components/SleepForm';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Moon, LogIn, LogOut, Plus, Globe, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<SleepEntry[]>(MOCK_DATA);
  const [lang, setLang] = useState<Language>('en');
  const [showForm, setShowForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPass) {
      setUser({ name: loginEmail.split('@')[0], email: loginEmail });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginEmail('');
    setLoginPass('');
    setShowForm(false);
  };

  const handleAddEntry = (entry: SleepEntry) => {
    setEntries(prev => [entry, ...prev]);
    setShowForm(false);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 ${isRTL ? 'font-arabic' : 'font-sans'}`}
    >
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Moon className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {lang === 'en' ? 'Somnia' : 'سومنيا'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLang}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
              >
                <Globe size={16} />
                {lang === 'en' ? 'English' : 'العربية'}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-slate-400 text-sm">
                    {t.welcome}, <span className="text-white font-medium">{user.name}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {isRTL ? <LogOut size={20} className="scale-x-[-1]" /> : <LogOut size={20} />}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          // Login Screen
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/30 mb-4">
                  <Lock className="text-indigo-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white">{t.appTitle}</h2>
                <p className="text-slate-400 mt-2">{t.loginPrompt}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  {isRTL ? <LogIn size={20} className="scale-x-[-1]" /> : <LogIn size={20} />}
                  {t.login}
                </button>
              </form>
              
              <div className="mt-6 text-center text-xs text-slate-500">
                Demo Account: Any email/password works
              </div>
            </div>
          </div>
        ) : (
          // Dashboard View
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">{t.dashboard}</h1>
                <p className="text-slate-400 mt-1">{new Date().toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                {t.newEntry}
              </button>
            </div>

            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <SleepForm 
                  onSave={handleAddEntry} 
                  onCancel={() => setShowForm(false)} 
                  lang={lang} 
                />
              </div>
            )}

            <Dashboard data={entries} lang={lang} />
            
            <AnalysisPanel data={entries} lang={lang} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
