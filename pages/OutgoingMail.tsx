import React, { useState } from 'react';
import { OutgoingMail, UserRole, OutgoingType } from '../types';
import { OUTGOING_TYPES, DRIVE_FOLDERS } from '../constants';
import { FileUp, ExternalLink } from 'lucide-react';

interface OutgoingMailProps {
  data: OutgoingMail[];
  onAdd: (mail: OutgoingMail) => void;
  role: UserRole;
}

export const OutgoingMailPage: React.FC<OutgoingMailProps> = ({ data, onAdd, role }) => {
  const [formData, setFormData] = useState<Partial<OutgoingMail>>({});
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number) return alert('Nomor Surat wajib diisi');

    const newMail: OutgoingMail = {
      id: Date.now().toString(),
      number: formData.number!,
      type: formData.type as OutgoingType,
      classification: formData.classification || '',
      dateLetter: formData.dateLetter || '',
      dateAction: formData.dateAction || '',
      subject: formData.subject || '',
      agenda: formData.agenda || '',
      destinationAgency: formData.destinationAgency || '',
      documentName: file ? file.name : 'No Document'
    };

    if (file) {
       console.log(`Uploading to Outgoing Drive: ${DRIVE_FOLDERS.OUTGOING}`);
    }

    onAdd(newMail);
    setFormData({});
    setFile(null);
    // Force reset form element if needed, or controlled inputs will handle it
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Register Surat Keluar</h2>
        <a 
          href={DRIVE_FOLDERS.OUTGOING} 
          target="_blank" 
          rel="noreferrer" 
          className="text-green-600 hover:underline flex items-center gap-2 text-sm"
        >
          Buka Google Drive Folder <ExternalLink size={14} />
        </a>
      </div>

      {role === UserRole.ADMIN && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Nomor Surat</label>
              <input name="number" required onChange={handleInputChange} className="input-field" />
            </div>

            <div>
              <label className="label">Jenis Naskah</label>
              <select name="type" required onChange={handleInputChange} className="input-field">
                <option value="">Pilih Jenis...</option>
                {OUTGOING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Klasifikasi</label>
              <input name="classification" required onChange={handleInputChange} className="input-field" placeholder="Contoh: PM.01" />
            </div>

            <div>
              <label className="label">Tanggal Naskah</label>
              <input type="date" name="dateLetter" onChange={handleInputChange} className="input-field" />
            </div>

            <div>
              <label className="label">Tanggal Pelaksanaan</label>
              <input type="date" name="dateAction" onChange={handleInputChange} className="input-field" />
            </div>

             <div>
              <label className="label">Instansi Tujuan</label>
              <input name="destinationAgency" onChange={handleInputChange} className="input-field" />
            </div>

             <div className="md:col-span-2">
              <label className="label">Perihal</label>
              <input name="subject" required onChange={handleInputChange} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Agenda</label>
              <textarea name="agenda" rows={2} onChange={handleInputChange} className="input-field"></textarea>
            </div>
            
            <div className="md:col-span-2 border-t pt-4 mt-2">
               <label className="label flex items-center gap-2 mb-2">
                 <FileUp size={16} /> Upload Dokumen
               </label>
               <input 
                 type="file" 
                 onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                 className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
               />
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition shadow-lg">
                Simpan Data Keluar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table View */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="p-4">Nomor</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Tujuan</th>
                <th className="p-4">Perihal</th>
                <th className="p-4">Tgl Naskah</th>
                <th className="p-4">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{item.number}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">{item.type}</span></td>
                  <td className="p-4">{item.destinationAgency}</td>
                  <td className="p-4">{item.subject}</td>
                  <td className="p-4">{item.dateLetter}</td>
                  <td className="p-4 text-accent">{item.documentName}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada data surat keluar</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .label { @apply block text-sm font-medium text-gray-700 mb-1; }
        .input-field { @apply w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition; }
      `}</style>
    </div>
  );
};
