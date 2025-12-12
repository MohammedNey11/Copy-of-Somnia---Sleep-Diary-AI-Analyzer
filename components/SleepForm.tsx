import React, { useState } from 'react';
import { SleepEntry, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Save, X } from 'lucide-react';

interface SleepFormProps {
  onSave: (entry: SleepEntry) => void;
  onCancel: () => void;
  lang: Language;
}

export const SleepForm: React.FC<SleepFormProps> = ({ onSave, onCancel, lang }) => {
  const t = TRANSLATIONS[lang];
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedTime || !wakeTime) return;

    // Construct dates
    const today = new Date().toISOString().split('T')[0];
    const bedDate = new Date(`${today}T${bedTime}`);
    const wakeDate = new Date(`${today}T${wakeTime}`);
    
    // Adjust if wake time is "before" bed time (meaning next day)
    // Simple heuristic: if wake time is earlier than bed time by a large margin, assume next day
    // Or simpler: usually users enter bed time for "last night" and wake time for "this morning"
    // For this mock, we will just use the current date logic or let user pick full datetime if we had a better picker.
    // Let's assume input type="datetime-local" for accuracy in a real app, but for style we stick to time and infer date.
    
    // Better Approach for Demo: Use datetime-local to avoid day confusion
    
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date(wakeTime).toISOString().split('T')[0],
      bedTime: new Date(bedTime).toISOString(),
      wakeTime: new Date(wakeTime).toISOString(),
      quality,
      mood: 'neutral',
      notes
    };
    onSave(newEntry);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{t.newEntry}</h2>
        <button onClick={onCancel} className="text-white/70 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">{t.bedTime}</label>
          <input 
            type="datetime-local" 
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">{t.wakeTime}</label>
          <input 
            type="datetime-local" 
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">{t.quality}: {quality}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-indigo-200 mt-1">
            <span>1 (Poor)</span>
            <span>10 (Excellent)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-indigo-100 mb-1">{t.notes}</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
            placeholder={lang === 'en' ? "How did you sleep?" : "¿Cómo dormiste?"}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {t.save}
        </button>
      </form>
    </div>
  );
};
