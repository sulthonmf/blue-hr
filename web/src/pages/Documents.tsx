import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../stores/useLanguageStore';
import { FileText, Plus, AlertTriangle, CheckCircle, Calendar, ShieldAlert } from 'lucide-react';
import { client } from '../api/client';

interface DocItem {
  id: number;
  user_name: string;
  name: string;
  type: string;
  expiry_date: string;
  days_remaining: number;
  status: string;
}

export const DocumentsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('PKWT');
  const [expiryDate, setExpiryDate] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await client.get('/api/v1/documents');
      setDocuments(res.data);
    } catch {
      setDocuments([
        { id: 1, user_name: 'Budi Santoso', name: 'Kontrak Kerja PKWT 2026', type: 'PKWT', expiry_date: '2026-09-30', days_remaining: 35, status: 'EXPIRING_SOON' },
        { id: 2, user_name: 'Siti Aminah', name: 'Sertifikat Scrum Master', type: 'CERTIFICATE', expiry_date: '2027-12-31', days_remaining: 492, status: 'VALID' }
      ]);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/api/v1/documents', { name, type, expiry_date: expiryDate });
      setIsUploading(false);
      setName('');
      setExpiryDate('');
      fetchDocuments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.documentsTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.documentsSub}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-xs font-bold rounded-2xl shadow-md hover:bg-blue-700 transition-all"
        >
          <Plus size={16} />
          <span>{t.uploadDocumentBtn}</span>
        </button>
      </div>

      {isUploading && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.uploadDocumentBtn}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.documentName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.documentType}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="PKWT">Kontrak Kerja (PKWT)</option>
                <option value="NDA">Perjanjian NDA</option>
                <option value="CERTIFICATE">Sertifikasi Profesi</option>
                <option value="KTP_NPWP">Identitas KTP / NPWP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.expiryDate}</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563eb] text-white text-xs font-bold rounded-xl"
            >
              {t.save}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-bold text-slate-500">
            <tr>
              <th className="p-4">{t.documentName}</th>
              <th className="p-4">{t.colEmployee}</th>
              <th className="p-4">{t.documentType}</th>
              <th className="p-4">{t.expiryDate}</th>
              <th className="p-4">{t.expiryAlert}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{doc.name}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{doc.user_name}</td>
                <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-medium text-slate-700 dark:text-slate-300">{doc.type}</span></td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{doc.expiry_date}</td>
                <td className="p-4">
                  {doc.days_remaining <= 60 ? (
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                      <AlertTriangle size={14} />
                      <span>{doc.days_remaining} {t.daysRemaining}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle size={14} />
                      <span>Aktif ({doc.days_remaining} {t.daysRemaining})</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
