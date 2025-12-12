import React, { useMemo } from 'react';
import { SleepEntry, Language, ChartDataPoint } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area
} from 'recharts';
import { Moon, Clock, Zap, Activity } from 'lucide-react';

interface DashboardProps {
  data: SleepEntry[];
  lang: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, lang }) => {
  const t = TRANSLATIONS[lang];

  // Process data for charts
  const chartData: ChartDataPoint[] = useMemo(() => {
    return data.map(entry => {
      const bed = new Date(entry.bedTime);
      const wake = new Date(entry.wakeTime);
      const durationMs = wake.getTime() - bed.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Calculate offset from midnight for consistency chart
      // If bedtime is 23:00, offset is -60. If 01:00, offset is 60.
      let minutesFromMidnight = bed.getHours() * 60 + bed.getMinutes();
      if (minutesFromMidnight > 12 * 60) {
        minutesFromMidnight -= 24 * 60; 
      }

      return {
        date: new Date(entry.date).toLocaleDateString(lang, { weekday: 'short', day: 'numeric' }),
        duration: parseFloat(durationHours.toFixed(1)),
        quality: entry.quality,
        bedTimeOffset: minutesFromMidnight
      };
    }).reverse(); // Show oldest to newest
  }, [data, lang]);

  // Calculate Aggregates
  const stats = useMemo(() => {
    if (data.length === 0) return { avgDuration: 0, avgQuality: 0, consistency: 0 };
    
    const totalDuration = chartData.reduce((acc, curr) => acc + curr.duration, 0);
    const totalQuality = chartData.reduce((acc, curr) => acc + curr.quality, 0);
    
    // Simple consistency score: standard deviation of bedtime offset (inverse)
    const offsets = chartData.map(d => d.bedTimeOffset);
    const meanOffset = offsets.reduce((a, b) => a + b, 0) / offsets.length;
    const variance = offsets.reduce((a, b) => a + Math.pow(b - meanOffset, 2), 0) / offsets.length;
    const stdDev = Math.sqrt(variance);
    // Score out of 100. Lower stdDev is better. Let's map 0-120min stdDev to 100-0.
    const consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev / 2)));

    return {
      avgDuration: totalDuration / data.length,
      avgQuality: totalQuality / data.length,
      consistency: consistencyScore
    };
  }, [chartData, data.length]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 font-medium mb-1">{label}</p>
          <p className="text-indigo-400">
            {payload[0].name}: <span className="text-white font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border border-indigo-500/30 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Clock className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider">{t.avgDuration}</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {stats.avgDuration.toFixed(1)} <span className="text-lg text-slate-500 font-normal">h</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border border-purple-500/30 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Zap className="text-purple-400" size={24} />
            </div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider">{t.avgQuality}</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {stats.avgQuality.toFixed(1)} <span className="text-lg text-slate-500 font-normal">/ 10</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900/50 border border-emerald-500/30 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Activity className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-slate-400 text-sm uppercase tracking-wider">{t.consistency}</h3>
          </div>
          <p className="text-4xl font-bold text-white">
            {stats.consistency.toFixed(0)} <span className="text-lg text-slate-500 font-normal">%</span>
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sleep Duration Trend */}
        <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Moon size={20} className="text-indigo-400" />
            {t.sleepTrend}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#818cf8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDuration)" 
                  name={t.hours}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Quality Bar Chart */}
        <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-purple-400" />
            {t.qualityTrend}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 10]}
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="quality" 
                  fill="#c084fc" 
                  radius={[4, 4, 0, 0]}
                  name={t.score}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
