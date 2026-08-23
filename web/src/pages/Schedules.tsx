import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Calendar, Plus, Video, Building, Clock, Users, X, AlertTriangle, ExternalLink, CheckCircle2, Trash2 } from 'lucide-react';

export const SchedulesPage: React.FC = () => {
  const { schedules, meetingRooms, reserveRoom, createMeetingRoom, cancelSchedule } = useHRStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [newRoomData, setNewRoomData] = useState({
    name: '',
    capacity: 10,
    location: 'Lantai 1 - Gedung A',
    facilities: 'TV Display, Video Conf, Whiteboard'
  });

  const handleCreateRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMeetingRoom(newRoomData);
      setIsRoomModalOpen(false);
      setNewRoomData({
        name: '',
        capacity: 10,
        location: 'Lantai 1 - Gedung A',
        facilities: 'TV Display, Video Conf, Whiteboard'
      });
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal membuat ruang rapat');
    }
  };

  // MS Teams Style Date Ribbon Generator (Past 2 days + Next 4 days)
  const getWeekDays = () => {
    const curr = new Date();
    const week = [];
    for (let i = -2; i <= 4; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('id-ID', { month: 'short' });
      week.push({ dateStr, dayName, dayNum, monthName, isToday: dateStr === new Date().toISOString().split('T')[0] });
    }
    return week;
  };

  const weekDays = getWeekDays();

  const [formData, setFormData] = useState({
    title: '',
    room_id: meetingRooms[0]?.id || 1,
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await reserveRoom(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        room_id: meetingRooms[0]?.id || 1,
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '11:00',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        description: ''
      });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Gagal mereservasi ruang rapat');
    }
  };

  const filteredSchedules = schedules.filter((s) => !selectedDate || s.date === selectedDate || schedules.length < 3);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Calendar className="text-[#2563eb]" size={26} />
            <span>Agenda & Reservasi Ruang Rapat</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jadwal kegiatan perusahaan, meeting room booking anti-bentrok, dan tautan rapat online.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRoomModalOpen(true)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all"
          >
            <Building size={16} className="text-[#2563eb]" />
            <span>Tambah Ruangan Baru</span>
          </button>

          <button
            onClick={() => {
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Reservasi Ruangan / Buat Agenda</span>
          </button>
        </div>
      </div>

      {/* MS Teams Style Interactive Calendar Date Ribbon Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-display flex items-center gap-2">
            <Clock size={14} className="text-[#2563eb]" />
            <span>Pilih Tanggal Agenda (MS Teams Style Calendar Bar)</span>
          </h3>
          <button
            onClick={() => setSelectedDate('')}
            className="text-[11px] font-bold text-[#2563eb] hover:underline"
          >
            Tampilkan Semua Tanggal
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/30 scale-105 font-bold'
                    : day.isToday
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-[#2563eb]/40 text-[#2563eb] font-bold'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-[#2563eb]'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">{day.dayName}</span>
                <span className="text-lg font-black font-display my-0.5">{day.dayNum}</span>
                <span className="text-[9px] font-medium opacity-75">{day.monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meeting Rooms Availability Section */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Ruang Rapat Perusahaan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meetingRooms.map((room) => (
            <div key={room.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold text-[10px] rounded-md flex items-center gap-1">
                    <Building size={12} />
                    {room.location}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-full">
                    {room.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">{room.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Users size={14} className="text-[#2563eb]" />
                  <span>Kapasitas: {room.capacity} Orang</span>
                </p>
                {room.facilities && (
                  <p className="text-[11px] text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl">
                    <span className="font-bold">Fasilitas:</span> {room.facilities}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Schedules List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Agenda & Rapat Terjadwal</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">JUDUL AGENDA</th>
                <th className="p-3">RUANG RAPAT</th>
                <th className="p-3">TANGGAL & WAKTU</th>
                <th className="p-3">PEMESAN</th>
                <th className="p-3">TAUTAN MEETING</th>
                <th className="p-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Tidak ada agenda rapat terjadwal pada tanggal {selectedDate || 'ini'}.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((s) => {
                  const getDeptStyle = (tStr: string) => {
                    const str = (tStr || '').toLowerCase();
                    if (str.includes('sprint') || str.includes('tech') || str.includes('dev') || str.includes('engineer')) return 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60';
                    if (str.includes('townhall') || str.includes('hands') || str.includes('all') || str.includes('executive')) return 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200/60';
                    if (str.includes('hr') || str.includes('people') || str.includes('capital')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60';
                    if (str.includes('finance') || str.includes('tax') || str.includes('payroll')) return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60';
                    return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200/60';
                  };

                  const badgeClass = getDeptStyle(s.title);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900 dark:text-white text-xs">{s.title}</p>
                        {s.description && <p className="text-[11px] text-slate-400">{s.description}</p>}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 font-extrabold text-[11px] rounded-lg ${badgeClass}`}>
                          {s.room_name || 'Virtual / Online'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        <span className="font-bold">{s.date}</span> ({s.start_time} - {s.end_time})
                      </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{s.user_name}</td>
                    <td className="p-3">
                      {s.meeting_link ? (
                        <a
                          href={s.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563eb] font-bold rounded-lg flex items-center gap-1.5 w-fit"
                        >
                          <Video size={14} />
                          <span>Join Meeting</span>
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-italic">Rapat Offline</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => cancelSchedule(s.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Reservasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Reservasi Ruang Rapat & Buat Agenda
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-bold text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Judul Agenda Rapat</label>
                <input
                  type="text"
                  required
                  placeholder="Sprint Review & Demo Fitur Enterprise"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pilih Ruang Rapat</label>
                <select
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                >
                  {meetingRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Kap: {r.capacity} Org - {r.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tautan Rapat Online (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz-uvwx-rst"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan Agenda</label>
                <textarea
                  rows={2}
                  placeholder="Pembahasan integrasi API..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold shadow-md hover:bg-blue-700">
                  Simpan & Pesan Ruangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Ruang Rapat Baru (Hybrid & Offline) */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Building className="text-[#2563eb]" size={18} />
                <span>Tambah Ruang Rapat Baru (Hybrid / Offline)</span>
              </h3>
              <button onClick={() => setIsRoomModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nama Ruang Rapat</label>
                <input
                  type="text"
                  required
                  placeholder="Ruang Meeting Hybrid Executive B"
                  value={newRoomData.name}
                  onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kapasitas Orang</label>
                <input
                  type="number"
                  required
                  min={2}
                  max={100}
                  value={newRoomData.capacity}
                  onChange={(e) => setNewRoomData({ ...newRoomData, capacity: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Lokasi Gedung / Lantai</label>
                <input
                  type="text"
                  required
                  placeholder="Lantai 4 - Gedung B (Kantor Pusat)"
                  value={newRoomData.location}
                  onChange={(e) => setNewRoomData({ ...newRoomData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Fasilitas (TV, Projector, Sound, dll)</label>
                <input
                  type="text"
                  placeholder="Smart TV 65 Inch, Video Conf Dual Mic, Whiteboard"
                  value={newRoomData.facilities}
                  onChange={(e) => setNewRoomData({ ...newRoomData, facilities: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold shadow-md hover:bg-blue-700">
                  Simpan Ruang Rapat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
