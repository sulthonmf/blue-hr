import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../stores/useLanguageStore';
import { LifeBuoy, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { client } from '../api/client';

interface Ticket {
  id: number;
  user_name: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  created_at: string;
}

export const HelpdeskPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('ADMIN');
  const [priority, setPriority] = useState('NORMAL');
  const [description, setDescription] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await client.get('/api/v1/tickets');
      setTickets(res.data);
    } catch {
      setTickets([
        { id: 1, user_name: 'Budi Santoso', subject: 'Kendala Klaim Asuransi Kesehatan', category: 'ASURANSI', priority: 'HIGH', status: 'OPEN', description: 'Klaim rawat jalan belum cair bulan ini', created_at: '2026-08-20' },
        { id: 2, user_name: 'Siti Aminah', subject: 'Permohonan Surat Keterangan Kerja', category: 'ADMIN', priority: 'NORMAL', status: 'IN_PROGRESS', description: 'Diperlukan untuk KPR Bank', created_at: '2026-08-22' }
      ]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/api/v1/tickets', { subject, category, priority, description });
      setIsAdding(false);
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await client.post(`/api/v1/tickets/${id}/status`, { status });
      fetchTickets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.helpdeskTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.helpdeskSub}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white text-xs font-bold rounded-2xl shadow-md hover:bg-blue-700 transition-all"
        >
          <Plus size={16} />
          <span>{t.createTicketBtn}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.createTicketBtn}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.ticketSubject}</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.ticketCategory}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="ASURANSI">Asuransi / BPJS</option>
                <option value="ADMIN">Surat Menyurat HR</option>
                <option value="PAYROLL">Payroll & Gaji</option>
                <option value="FASILITAS">Fasilitas & Aset</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">{t.ticketPriority}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Tinggi</option>
                <option value="URGENT">Mendesak</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">{t.ticketDescription}</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563eb] text-white text-xs font-bold rounded-xl"
            >
              {t.submit}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tickets.map((tItem) => (
          <div key={tItem.id} className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full">
                  {tItem.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{tItem.subject}</h4>
                <p className="text-xs text-slate-400">{tItem.user_name} • {tItem.created_at}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                tItem.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                tItem.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {tItem.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{tItem.description}</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              {tItem.status !== 'RESOLVED' && (
                <button
                  onClick={() => updateStatus(tItem.id, 'RESOLVED')}
                  className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg"
                >
                  Selesaikan Tiket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
