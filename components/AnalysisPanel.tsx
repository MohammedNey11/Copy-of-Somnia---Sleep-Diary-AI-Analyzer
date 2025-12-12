import React, { useState } from 'react';
import { SleepEntry, Language, AnalysisResult } from '../types';
import { TRANSLATIONS } from '../constants';
import { analyzeSleepData } from '../services/geminiService';
import { Sparkles, Loader2, Award, Lightbulb } from 'lucide-react';

interface AnalysisPanelProps {
  data: SleepEntry[];
  lang: Language;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data, lang }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    const analysis = await analyzeSleepData(data, lang);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-8 shadow-2xl border border-indigo-500/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-yellow-400" />
            {t.analysisTitle}
          </h2>
          {!result && !loading && (
            <button
              onClick={handleAnalysis}
              className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              {t.generateInsights}
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-white mb-4" size={48} />
            <p className="text-indigo-200 animate-pulse">{t.analyzing}</p>
          </div>
        )}

        {result && !loading && (
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-lg text-indigo-100 leading-relaxed text-start">
                  {result.summary}
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-400" />
                  {t.recommendations}
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-indigo-200 bg-indigo-950/30 p-3 rounded-lg border border-indigo-500/20">
                      <span className="bg-indigo-500/50 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-start">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-indigo-950/50 rounded-xl p-6 flex flex-col items-center justify-center border border-indigo-500/30">
              <Award size={48} className="text-yellow-400 mb-2" />
              <div className="text-6xl font-bold text-white mb-2">{result.score}</div>
              <div className="text-indigo-300 uppercase tracking-widest text-sm">{t.score}</div>
              
              <button
                onClick={handleAnalysis}
                className="mt-8 text-sm text-indigo-300 hover:text-white underline decoration-indigo-500/50 underline-offset-4"
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
