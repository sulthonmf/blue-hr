import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { Award, Plus, Calendar, AlertCircle, ExternalLink, Trash2, BookOpen, CheckCircle } from 'lucide-react';

export const TrainingsPage: React.FC = () => {
  const { trainings, addTraining, deleteTraining } = useHRStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    provider: 'Udemy / AWS Training Center',
    category: 'TECHNICAL',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    certification_url: 'https://cert.provider.com/verify/12345',
    expiry_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTraining(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        provider: 'Udemy / AWS Training Center',
        category: 'TECHNICAL',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        certification_url: 'https://cert.provider.com/verify/12345',
        expiry_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
      });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpang data pelatihan');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Award className="text-[#2563eb]" size={26} />
            <span>Pelatihan & Sertifikasi Karyawan</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pelacakan pelatihan profesional, pengunggahan sertifikat, dan pengingat masa kadaluarsa sertifikasi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Pelatihan Baru</span>
        </button>
      </div>

      {/* Trainings Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Daftar Pelatihan & Sertifikasi</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">JUDUL PELATIHAN</th>
                <th className="p-3">KARYAWAN</th>
                <th className="p-3">PENYELENGGARA</th>
                <th className="p-3">KATEGORI</th>
                <th className="p-3">KADALUARSA SERTIFIKAT</th>
                <th className="p-3">VERIFIKASI SERTIFIKAT</th>
                <th className="p-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {trainings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    Belum ada data pelatihan & sertifikasi.
                  </td>
                </tr>
              ) : (
                trainings.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <p className="font-extrabold text-slate-900 dark:text-white">{t.title}</p>
                      <p className="text-[10px] text-slate-400">{t.start_date} - {t.end_date}</p>
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{t.user_name}</td>
                    <td className="p-3 font-bold text-slate-500">{t.provider}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] font-bold text-[10px] rounded-lg">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono">
                      {t.expiry_date ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-md text-[10px]">
                          Aktif (s.d. {t.expiry_date})
                        </span>
                      ) : (
                        <span className="text-slate-400">Permanen</span>
                      )}
                    </td>
                    <td className="p-3">
                      {t.certification_url ? (
                        <a
                          href={t.certification_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg flex items-center gap-1.5 w-fit"
                        >
                          <CheckCircle size={12} />
                          <span>Lihat Sertifikat</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-slate-400">Tidak ada file</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteTraining(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah Pelatihan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">Tambah Data Pelatihan</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Judul Pelatihan / Sertifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="AWS Certified Solutions Architect"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Penyelenggara / Institusi</label>
                <input
                  type="text"
                  required
                  placeholder="Amazon Web Services / Coursera"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tgl Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tgl Selesai</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tgl Kadaluarsa Sertifikat (Opsional)</label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tautan / URL Sertifikat</label>
                <input
                  type="url"
                  placeholder="https://cert.provider.com/verify/abc"
                  value={formData.certification_url}
                  onChange={(e) => setFormData({ ...formData, certification_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold shadow-md hover:bg-blue-700">
                  Simpan Pelatihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
