import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { Megaphone, Plus, Pin } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { announcements, createAnnouncement } = useHRStore();
  const { t } = useLanguageStore();
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('IMPORTANT');
  const [isPinned, setIsPinned] = useState(false);

  const canManage = hasPermission('manage_announcements');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAnnouncement({
        title,
        content,
        category,
        is_pinned: isPinned ? 1 : 0
      });
      alert('Pengumuman berhasil dipublikasikan!');
      setIsAdding(false);
      setTitle('');
      setContent('');
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Megaphone className="text-[#2563eb]" size={24} />
            {t.announcementsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.announcementsSub}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            {isAdding ? t.cancel : t.createAnnouncementBtn}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">Form Publikasi Berita / Pengumuman</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.announcementTitle}</label>
                <input
                  type="text"
                  required
                  placeholder="Judul berita..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.categoryLabel}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                >
                  <option value="IMPORTANT">{t.importantCat}</option>
                  <option value="GENERAL">{t.generalCat}</option>
                  <option value="POLICY">{t.policyCat}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.announcementContent}</label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan pengumuman resmi perusahaan di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-[#2563eb] focus:ring-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{t.pinAnnouncement}</span>
            </label>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md transition-all text-xs"
            >
              {t.submit}
            </button>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm relative transition-all">
            {ann.is_pinned === 1 && (
              <span className="absolute top-6 right-6 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                <Pin size={10} /> {t.pinned}
              </span>
            )}
            <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] text-[10px] font-bold rounded-full mb-3 border border-blue-100 dark:border-blue-900/40">
              {ann.category}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 font-display">{ann.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Oleh: <strong className="text-slate-700 dark:text-slate-200">{ann.author_name || 'HR Admin'}</strong></span>
              <span>Diterbitkan: {new Date(ann.created_at).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
