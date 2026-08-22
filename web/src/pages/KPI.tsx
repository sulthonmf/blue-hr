import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { Award, Plus } from 'lucide-react';

export const KPIPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { kpis, employees, createKPI } = useHRStore();
  const { t } = useLanguageStore();
  const [isAdding, setIsAdding] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('2026-Q1');
  const [actualScore, setActualScore] = useState(90);
  const [feedback, setFeedback] = useState('');

  const canManage = hasPermission('manage_kpi');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !title) return alert('Lengkapi data KPI');
    try {
      await createKPI({
        user_id: Number(selectedUserId),
        period,
        title,
        target_score: 100,
        actual_score: actualScore,
        feedback
      });
      alert('KPI Skor berhasil disimpan!');
      setIsAdding(false);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Award className="text-amber-500" size={24} />
            {t.kpiTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.kpiSub}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            {isAdding ? t.cancel : t.giveKpiBtn}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">{t.kpiFormTitle}</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.selectEmployee}</label>
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                >
                  <option value="">-- {t.selectEmployee} --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.assessmentPeriod}</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                >
                  <option value="2026-Q1">2026 - Quarter 1</option>
                  <option value="2026-Q2">2026 - Quarter 2</option>
                  <option value="2026-Q3">2026 - Quarter 3</option>
                  <option value="2026-Q4">2026 - Quarter 4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.kpiIndicatorTitle}</label>
              <input
                type="text"
                required
                placeholder="Contoh: System Reliability & Unit Test Coverage 90%"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.actualScore} (0 - 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={actualScore}
                onChange={(e) => setActualScore(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.feedbackNotes}</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Catatan dari evaluator..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                rows={2}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md transition-all text-xs"
            >
              {t.save}
            </button>
          </form>
        </div>
      )}

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full">
                  {kpi.period}
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">Skor: {kpi.actual_score} / 100</span>
              </div>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1 font-display">{kpi.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Karyawan: <strong className="text-slate-700 dark:text-slate-200">{kpi.user_name || 'Budi Santoso'}</strong></p>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 my-3 border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    kpi.actual_score >= 85 ? 'bg-emerald-500' : kpi.actual_score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, kpi.actual_score)}%` }}
                ></div>
              </div>

              {kpi.feedback && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  "{kpi.feedback}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
