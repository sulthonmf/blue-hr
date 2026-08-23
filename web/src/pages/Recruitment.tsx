import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { Users, Plus, Briefcase, FileText, CheckCircle, X, Search, UserCheck } from 'lucide-react';

export const RecruitmentPage: React.FC = () => {
  const { jobs, applicants, createJobPosting, updateApplicantStatus } = useHRStore();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    branch_id: 1,
    description: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    await createJobPosting(formData);
    setIsModalOpen(false);
    setFormData({ title: '', department: 'Engineering', branch_id: 1, description: '', requirements: '' });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Users className="text-indigo-600" size={26} />
            <span>Perekrutan & Pelamar (Recruitment ATS)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola pembukaan lowongan kerja, screening CV, dan tahapan pelamar kerja.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Buka Lowongan Baru</span>
        </button>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 transition-all ${activeTab === 'jobs' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Lowongan Kerja ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`pb-3 transition-all ${activeTab === 'applicants' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Daftar Pelamar ({applicants.length})
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold text-[10px] rounded-md">
                    {j.department}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 text-[10px] font-extrabold rounded-full">
                    {j.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display mb-2">{j.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{j.description}</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Persyaratan:</span>
                  {j.requirements}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">NAMA PELAMAR</th>
                  <th className="p-3">POSISI DILAMAR</th>
                  <th className="p-3">KONTAK</th>
                  <th className="p-3">STATUS ATS</th>
                  <th className="p-3 text-right">UBAH STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {applicants.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{a.name}</td>
                    <td className="p-3 font-extrabold text-indigo-600">{a.job_title}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{a.email} • {a.phone}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={a.status}
                        onChange={(e) => updateApplicantStatus(a.id, e.target.value)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-200"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening CV</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFERED">Offered</option>
                        <option value="HIRED">Hired (Diterima)</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Buka Lowongan Pekerjaan Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Judul Posisi</label>
                <input
                  type="text"
                  required
                  placeholder="Senior React Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Departemen</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Deskripsi Pekerjaan</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kualifikasi / Requirements</label>
                <textarea
                  required
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700">
                  Publikasikan Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
