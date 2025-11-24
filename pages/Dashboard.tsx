import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IncomingMail, OutgoingMail, MailSource } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface DashboardProps {
  incoming: IncomingMail[];
  outgoing: OutgoingMail[];
}

export const Dashboard: React.FC<DashboardProps> = ({ incoming, outgoing }) => {

  // Prepare Data for Charts
  const incomingStats = useMemo(() => {
    // Only count records that HAVE a classification (Internal)
    const counts: Record<string, number> = {};
    incoming.forEach(mail => {
      if (mail.source === MailSource.INTERNAL && mail.classification) {
        counts[mail.classification] = (counts[mail.classification] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, jumlah: counts[key] }));
  }, [incoming]);

  const outgoingStats = useMemo(() => {
    const counts: Record<string, number> = {};
    outgoing.forEach(mail => {
      if (mail.classification) {
        counts[mail.classification] = (counts[mail.classification] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, jumlah: counts[key] }));
  }, [outgoing]);

  // Schedule Logic: Filter invitations (Undangan is usually determined by subject or specific logic, assuming 'agenda' or 'subject' implies meeting)
  // For this requirement: "Setiap ada surat masuk berupa undangan"
  const schedule = useMemo(() => {
    return incoming
      .filter(m => m.subject.toLowerCase().includes('undangan') || m.agenda)
      .sort((a, b) => new Date(a.dateAction).getTime() - new Date(b.dateAction).getTime());
  }, [incoming]);

  return (
    <div className="space-y-8">
      
      {/* Section 1: Jadwal Kegiatan (Top Priority) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-accent" /> Jadwal Kegiatan
        </h2>
        
        {schedule.length === 0 ? (
          <p className="text-gray-500 italic">Tidak ada kegiatan terjadwal.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map(item => (
              <div key={item.id} className="border-l-4 border-accent bg-blue-50 p-4 rounded-r-lg">
                <h3 className="font-bold text-gray-900 mb-1">{item.agenda || item.subject}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{item.dateAction} • {item.timeAction}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{item.placeAction}</span>
                  </div>
                  <div className="font-medium text-blue-800 mt-2">
                    {item.agency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Surat Masuk (Klasifikasi)</h3>
          {incomingStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomingStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#3b82f6" name="Jumlah Surat Masuk" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">Belum ada data klasifikasi</div>
          )}
        </div>

        {/* Outgoing Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Surat Keluar (Klasifikasi)</h3>
          {outgoingStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outgoingStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="jumlah" fill="#10b981" name="Jumlah Surat Keluar" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400">Belum ada data klasifikasi</div>
          )}
        </div>
      </div>

    </div>
  );
};
